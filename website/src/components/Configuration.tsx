export function Configuration() {
  return (
    <section className="py-24 relative border-t border-dark-border bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Configuration</h2>
          <p className="text-gray-400">Configure NetEngAI using environment variables in a .env file.</p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-dark-border bg-dark-bg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border text-gray-400">
                <th className="py-4 px-6 font-medium whitespace-nowrap">Environment Variable</th>
                <th className="py-4 px-6 font-medium">Description</th>
                <th className="py-4 px-6 font-medium">Example / Default</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">TELEGRAM_TOKEN</td>
                <td className="py-4 px-6 text-gray-300"><b>Required.</b> The API token for your Telegram bot.</td>
                <td className="py-4 px-6 text-gray-500 font-mono">123456789:ABCdefGhI...</td>
              </tr>
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">LLAMA_SERVER_URL</td>
                <td className="py-4 px-6 text-gray-300">The endpoint URL of your local llama.cpp / V1 inference server.</td>
                <td className="py-4 px-6 text-gray-500 font-mono">http://127.0.0.1:8080/v1</td>
              </tr>
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">MCP_HTTP_URL</td>
                <td className="py-4 px-6 text-gray-300">The endpoint URL of the OpenWrt MCP server.</td>
                <td className="py-4 px-6 text-gray-500 font-mono">http://127.0.0.1:8000/mcp</td>
              </tr>
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">SYSTEM_PROMPT</td>
                <td className="py-4 px-6 text-gray-300">Custom system prompt to override the default instructions.</td>
                <td className="py-4 px-6 text-gray-500 italic">(Default from main.py)</td>
              </tr>
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">LANGFUSE_PUBLIC_KEY</td>
                <td className="py-4 px-6 text-gray-300">Langfuse tracing public key.</td>
                <td className="py-4 px-6 text-gray-500 italic">(Optional)</td>
              </tr>
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">LANGFUSE_SECRET_KEY</td>
                <td className="py-4 px-6 text-gray-300">Langfuse tracing secret key.</td>
                <td className="py-4 px-6 text-gray-500 italic">(Optional)</td>
              </tr>
              <tr className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono text-neon-purple whitespace-nowrap">LANGFUSE_BASE_URL</td>
                <td className="py-4 px-6 text-gray-300">Langfuse host URL.</td>
                <td className="py-4 px-6 text-gray-500 italic">(Optional)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
