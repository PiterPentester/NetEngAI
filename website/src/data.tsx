import { Terminal, Bot, Network, Activity, Settings, Cpu } from "lucide-react";

export const features = [
  {
    icon: <Bot className="w-6 h-6 text-neon-cyan" />,
    title: "Telegram Bot Interface",
    description: "Interact with your network diagnostic agent directly via a friendly Telegram bot interface."
  },
  {
    icon: <Network className="w-6 h-6 text-neon-purple" />,
    title: "Model Context Protocol (MCP)",
    description: "Dynamic tool discovery and execution on the router via standard MCP HTTP/Streamable HTTP transport channels."
  },
  {
    icon: <Activity className="w-6 h-6 text-neon-cyan" />,
    title: "Langfuse Integration",
    description: "Wrapped AsyncOpenAI client for automated tracing, logging, and observability of LLM calls."
  },
  {
    icon: <Cpu className="w-6 h-6 text-neon-purple" />,
    title: "Modern OpenWrt Context",
    description: "Configured out-of-the-box for OpenWrt 25.x+ (leveraging the apk package manager instead of legacy opkg)."
  },
  {
    icon: <Settings className="w-6 h-6 text-neon-cyan" />,
    title: "Configurable Prompting",
    description: "The system prompt is fully configurable via environment variables, allowing custom agent behaviors."
  },
  {
    icon: <Terminal className="w-6 h-6 text-neon-purple" />,
    title: "Local Execution",
    description: "Interfaces with a local Llama.cpp instance (minicpm5 model) for secure, privacy-first inference."
  }
];
