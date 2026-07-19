import os
import re
import json
import logging
import asyncio
from contextlib import AsyncExitStack
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Swap out standard OpenAI with the Langfuse-native wrapped AsyncOpenAI client
from langfuse.openai import AsyncOpenAI
from langfuse import propagate_attributes

# Official MCP Python SDK imports
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

# Logging Setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("NetEngAI")

# Load values from local environment variables (.env)
from dotenv import load_dotenv
load_dotenv()

# System configurations
LLAMA_SERVER_URL = os.getenv("LLAMA_SERVER_URL", "http://127.0.0.1:8080/v1")
MCP_HTTP_URL = os.getenv("MCP_HTTP_URL", "http://127.0.0.1:8000/mcp")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

DEFAULT_SYSTEM_PROMPT = (
    "You are NetEngAI, an expert network automation and diagnostic assistant running locally. "
    "Your primary target is a Google WiFi (AC1304) router flashed with OpenWrt version 25.12.4.\n\n"

    "CRITICAL CONTEXT & ARCHITECTURE RULES:\n"
    "1. The underlying environment uses OpenWrt 25.x, which has officially transitioned from the "
    "legacy 'opkg' tool to the 'apk' (Alpine Package Keeper) package manager. If managing or searching "
    "packages, output 'apk add', 'apk search', or 'apk info' instead of opkg instructions.\n"
    "2. When assessing wireless status or bufferbloat anomalies, keep in mind the hardware footprint "
    "of the AC1304 platform (Qualcomm IPQ4019, dual-band AC1200, concurrent 2.4GHz/5GHz configuration).\n"
    "3. Analyze user networking queries systematically. Evaluate interfaces, routing tables, and "
    "ubus statistics cleanly before reaching conclusions.\n\n"

    "TOOL EXECUTION MANDATE:\n"
    "If you need to query or interact with the system via an MCP tool, write a single tool call request "
    "using this EXACT XML syntax structure:\n"
    "<function name=\"tool_name\"><param name=\"parameter_name\">value</param></function>\n\n"
    "Do not output anything else (no text explanations, no markdown formatting, no thinking tags, "
    "no greetings) if you decide a tool call is required. Output ONLY the raw XML tag block."
)


def get_system_prompt() -> str:
    """Returns the system prompt configured from the env var SYSTEM_PROMPT, defaulting to DEFAULT_SYSTEM_PROMPT."""
    return os.getenv("SYSTEM_PROMPT", DEFAULT_SYSTEM_PROMPT)


# Setup wrapped OpenAI Client. Langfuse SDK reads LANGFUSE_PUBLIC_KEY,
# LANGFUSE_SECRET_KEY, and LANGFUSE_BASE_URL straight from environment variables.
ai_client = AsyncOpenAI(base_url=LLAMA_SERVER_URL, api_key="local-no-key")
MODEL_NAME = "minicpm5"


def clean_reasoning_tokens(text: str) -> str:
    """Removes reasoning <think>...</think> blocks and XML tool markup from the final output."""
    if not text:
        return ""
    # Strip any content inside <think> blocks
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    # Strip open/close hanging think tags if output was clipped
    cleaned = re.sub(r"<\/?think>", "", cleaned).strip()
    # Clean up leftover XML-like tool calls in the final answer if any
    cleaned = re.sub(r"<function.*?>.*?</function>", "", cleaned, flags=re.DOTALL).strip()
    cleaned = re.sub(r"name=\".*?\">", "", cleaned).strip()
    return cleaned


def parse_minicpm_tool_call(text: str) -> tuple[str | None, dict | None]:
    """
    Robust parser for MiniCPM5-1B running on llama.cpp.
    Matches standard XML structures, broken/clipped XML patterns, and raw JSON arrays.
    """
    if not text:
        return None, None

    # --- Mode A: Look for standard/clipped XML-like blocks ---
    # e.g., <function name="read_router_logs"><param name="lines">50</param></function>
    # or the clipped version: name="read_router_logs">
    xml_name_match = re.search(r'name=["\']([a-zA-Z0-9_-]+)["\']', text)
    if xml_name_match:
        tool_name = xml_name_match.group(1)
        arguments = {}

        # Attempt to extract params inside XML block
        param_matches = re.findall(r'<param name=["\']([a-zA-Z0-9_-]+)["\']>(.*?)</param>', text)
        for param, val in param_matches:
            # Try to convert numeric strings to integers/floats if possible
            try:
                if val.isdigit():
                    arguments[param] = int(val)
                else:
                    arguments[param] = json.loads(val)
            except Exception:
                arguments[param] = val

        logger.info(f"XML Parser Match: Extracted '{tool_name}' with parameters {arguments}")
        return tool_name, arguments

    # --- Mode B: Fallback JSON block parser ---
    json_blocks = re.findall(r"({.*?})", text, re.DOTALL)
    for block in json_blocks:
        try:
            parsed = json.loads(block.strip())
            name = parsed.get("name") or parsed.get("tool") or parsed.get("function")
            arguments = parsed.get("arguments") or parsed.get("args") or {}

            if name:
                logger.info(f"JSON Parser Match: Extracted '{name}' with args {arguments}")
                return name, arguments
        except json.JSONDecodeError:
            continue

    return None, None


async def run_diagnostic_agent(user_query: str, status_msg) -> str:
    """Manages the lifecycle of an active HTTP handshake with the OpenWrt MCP server."""
    session_id = f"tg-chat-{status_msg.chat_id}"

    # Use Option 2: Wrap the entire execution block with propagate_attributes.
    # All underlying call completions automatically receive the session scope.
    with propagate_attributes(
        session_id=session_id,
        trace_name="mcp-network-diagnostic",
        tags=["mcp-agent", "network-diagnostic"]
    ):
        async with AsyncExitStack() as exit_stack:
            logger.info(f"Initiating handshake sequence with: {MCP_HTTP_URL}")

            # 1. Establish the Streamable HTTP transport channels
            read_stream, write_stream, get_session_id = await exit_stack.enter_async_context(
                streamablehttp_client(url=MCP_HTTP_URL)
            )

            # 2. Open the protocol session bound to the streams
            session = await exit_stack.enter_async_context(
                ClientSession(read_stream, write_stream)
            )

            # 3. Initialize the handshake with the server
            await session.initialize()

            if (session_id_mcp := get_session_id()) is not None:
                logger.info(f"MCP protocol session initialized. Session ID: {session_id_mcp}")
            else:
                logger.info("MCP protocol session initialized successfully.")

            # 4. Pull capabilities dynamically from the router's MCP backend
            mcp_tools_response = await session.list_tools()
            openai_tools = []

            for tool in mcp_tools_response.tools:
                openai_tools.append({
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description or f"Executes {tool.name}",
                        "parameters": tool.inputSchema
                    }
                })

            logger.info(f"Registered {len(openai_tools)} tools from OpenWrt MCP Server.")

            # Strict formatting instructions to stop the 1B model from wandering off
            messages = [
                {
                    "role": "system",
                    "content": get_system_prompt()
                },
                {"role": "user", "content": user_query}
            ]

            # Payload configurations: Trace attributes are cleanly removed from direct keys
            payload_args = {
                "model": MODEL_NAME,
                "messages": messages,
                "temperature": 0.1,  # Keep low to prevent reasoning loop divergence
                "name": "network-diagnostic-planning"
            }
            if openai_tools:
                payload_args["tools"] = openai_tools

            # First Inference Pass: Traced automatically under our open context block
            response = await ai_client.chat.completions.create(**payload_args)
            resp_msg = response.choices[0].message
            raw_content = resp_msg.content or ""

            target_tool = None
            target_args = None

            # Mode 1: Fallback back to standard JSON tool calls (if parser middleware is configured in llama.cpp)
            if resp_msg.tool_calls:
                target_tool = resp_msg.tool_calls[0].function.name
                target_args = json.loads(resp_msg.tool_calls[0].function.arguments)
            # Mode 2: MiniCPM native XML / Text parsing fallback
            else:
                target_tool, target_args = parse_minicpm_tool_call(raw_content)

            # 5. Handle tool execution route
            if target_tool:
                await status_msg.edit_text(f"🔧 [MCP Action]: Running `{target_tool}` with parameters {target_args}...")

                # Call tool over official HTTP bridge
                tool_result = await session.call_tool(target_tool, arguments=target_args)

                # Extract text blocks returned by the MCP response
                result_texts = []
                for item in tool_result.content:
                    if hasattr(item, 'text'):
                        result_texts.append(item.text)
                    elif isinstance(item, dict) and "text" in item:
                        result_texts.append(item["text"])

                raw_output = "\n".join(result_texts)

                # Prepare proper tool call object for API alignment
                api_tool_calls = [{
                    "id": "mcp-call-id-1",
                    "type": "function",
                    "function": {
                        "name": target_tool,
                        "arguments": json.dumps(target_args)
                    }
                }]

                # Append assistant thoughts AND the formal tool call object
                messages.append({
                    "role": "assistant",
                    "content": raw_content,
                    "tool_calls": api_tool_calls  # Explicit linkage requirement
                })

                # Append the actual execution results
                messages.append({
                    "role": "tool",
                    "tool_call_id": "mcp-call-id-1",
                    "name": target_tool,
                    "content": raw_output
                })

                # Fallback reinforcement: Small local models thrive when data is also present in plain text
                messages.append({
                    "role": "user",
                    "content": f"[SYSTEM NOTE: The tool '{target_tool}' executed successfully. Output result data below. Synthesize this directly for the user]:\n{raw_output}"
                })

                # Append contexts so model reviews raw tool performance logs
                messages.append({
                    "role": "assistant",
                    "content": raw_content
                })
                messages.append({
                    "role": "tool",
                    "tool_call_id": "mcp-call-id-1",
                    "name": target_tool,
                    "content": raw_output
                })

                # Second Inference Pass: Model synthesizes router outputs into a clear summary
                await status_msg.edit_text("📊 Digesting network outputs...")
                final_response = await ai_client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=messages,
                    temperature=0.4,
                    name="network-diagnostic-summary"
                )
                return clean_reasoning_tokens(final_response.choices[0].message.content)

            else:
                # No tool execution triggered: Return raw response directly
                return clean_reasoning_tokens(raw_content)


async def telegram_message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Processes inbound Telegram text queries."""
    if not update.message or not update.message.text:
        return

    user_query = update.message.text
    status_msg = await update.message.reply_text("⚡ NetEngAI is planning reasoning steps...")

    try:
        # Run agent loop
        diagnostic_report = await run_diagnostic_agent(user_query, status_msg)
        await update.message.reply_text(diagnostic_report)
    except Exception as e:
        logger.error(f"Agent execution encountered an error: {e}", exc_info=True)
        await update.message.reply_text(f"❌ Diagnostic abort: {str(e)}")
    finally:
        try:
            await status_msg.delete()
        except Exception:
            pass


async def start_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Answers initial start command."""
    await update.message.reply_text(
        "👋 Welcome! I am NetEngAI, running locally on your hardware.\n"
        "Ask me to verify network paths, test latency, check routers, or tail diagnostic logs."
    )


def main():
    if not TELEGRAM_TOKEN:
        raise ValueError("CRITICAL ERROR: 'TELEGRAM_TOKEN' environment variable is missing.")

    # Initialize the Telegram Application
    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start_command_handler))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, telegram_message_handler))

    logger.info("Initializing polling agent container...")
    app.run_polling()


if __name__ == "__main__":
    main()
