export function Architecture() {
  const asciiArt = `                  ┌────────────────┐
                  │  Telegram Bot  │ (User Interaction)
                  └───────┬────────┘
                          │
                          ▼
                    [ main.py ] 
                    (NetEngAI)
                   /          \\
                  /            \\
                 ▼              ▼
     ┌───────────────┐      ┌───────────────┐
     │  Llama.cpp    │      │  OpenWrt MCP  │ (FastMCP Server)
     │ (MiniCPM5-1B) │      │    Server     │
     └───────────────┘      └───────┬───────┘
                                    │ (SSH)
                                    ▼
                            ┌───────────────┐
                            │ OpenWrt Router│ (Google WiFi AC1304)
                            └───────────────┘`;

  return (
    <section className="py-24 relative border-t border-dark-border bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Architecture Overview</h2>
          <p className="text-gray-400">How NetEngAI connects your LLM with your router hardware.</p>
        </div>
        
        <div className="rounded-lg overflow-hidden border border-dark-border bg-[#0a0a0a] shadow-2xl p-6 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed text-neon-cyan">
            <code>{asciiArt}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
