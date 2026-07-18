# NetEngAI

NetEngAI is a locally hosted, LLM-powered network automation and diagnostics assistant. It operates as a Telegram bot, interfacing with a local Llama.cpp instance (running the `minicpm5` model) and communicating dynamically with an OpenWrt router through a Model Context Protocol (MCP) server to diagnose and manage network status.

The agent's main focus is a Google WiFi (AC1304) router flashed with OpenWrt 25.12.4.

---

## Key Features

- **Telegram Bot Interface**: Interact with your network diagnostic agent directly via Telegram.
- **Model Context Protocol (MCP)**: Dynamic tool discovery and execution on the router via standard MCP HTTP/Streamable HTTP transport channels.
- **Langfuse Integration**: Wrapped AsyncOpenAI client for automated tracing, logging, and observability.
- **Modern OpenWrt Context**: Configured out-of-the-box for OpenWrt 25.x+ (leveraging the `apk` package manager instead of legacy `opkg`).
- **Configurable Prompting**: The system prompt is fully configurable via environment variables.

---

## Architecture Overview

```
                  ┌────────────────┐
                  │  Telegram Bot  │ (User Interaction)
                  └───────┬────────┘
                          │
                          ▼
                    [ main.py ] 
                    (NetEngAI)
                   /          \
                  /            \
                 ▼              ▼
     ┌───────────────┐      ┌───────────────┐
     │  Llama.cpp    │      │  OpenWrt MCP  │ (FastMCP Server)
     │ (MiniCPM5-1B) │      │    Server     │
     └───────────────┘      └───────┬───────┘
                                    │ (SSH)
                                    ▼
                            ┌───────────────┐
                            │ OpenWrt Router│ (Google WiFi AC1304)
                            └───────────────┘
```

---

## Configuration

The application is configured using environment variables. These can be defined in a `.env` file in the root directory:

| Environment Variable | Description | Default / Example |
|----------------------|-------------|-------------------|
| `TELEGRAM_TOKEN` | **Required**. The API token for your Telegram bot. | `123456789:ABCdefGhI...` |
| `LLAMA_SERVER_URL` | The endpoint URL of your local llama.cpp / V1 inference server. | `http://127.0.0.1:8080/v1` |
| `MCP_HTTP_URL` | The endpoint URL of the OpenWrt MCP server. | `http://127.0.0.1:8000/mcp` |
| `SYSTEM_PROMPT` | Custom system prompt to override the default instructions. | *(See default system prompt in `main.py`)* |
| `LANGFUSE_PUBLIC_KEY` | Langfuse tracing public key. | *(Optional)* |
| `LANGFUSE_SECRET_KEY` | Langfuse tracing secret key. | *(Optional)* |
| `LANGFUSE_BASE_URL` | Langfuse host URL. | *(Optional)* |

### Customizing the System Prompt

You can customize the prompt directly in your `.env` file. To write a multi-line prompt, wrap the value in double quotes:

```env
SYSTEM_PROMPT="You are NetEngAI, a helpful assistant.
Run diagnostics carefully.
Only output tool calls when necessary."
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (recommended package manager)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd NetEngAI
   ```

2. Sync dependencies:
   ```bash
   uv sync
   ```

3. Create a `.env` file and populate the required environment variables:
   ```bash
   cp .env.example .env  # Or create it manually
   ```

### Running Tests

Unit tests are written using `pytest` and can be executed via:

```bash
uv run pytest
```

### Running the Application

Start the Telegram polling agent container:

```bash
uv run python main.py
```
