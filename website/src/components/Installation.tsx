import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function Installation() {
  const [copied, setCopied] = useState(false);
  const code = "git clone https://github.com/PiterPentester/NetEngAI.git\ncd NetEngAI\nuv sync\ncp .env.example .env\nuv run python main.py";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className="py-24 relative border-t border-dark-border bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Quick Start</h2>
          <p className="text-gray-400">Prerequisites: Python 3.12+ and uv (recommended package manager).</p>
        </div>

        <div className="rounded-lg overflow-hidden border border-dark-border bg-[#0a0a0a] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-dark-border/40 border-b border-dark-border">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-gray-500">bash</span>
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code>
                <span className="text-neon-purple">git clone</span> https://github.com/PiterPentester/NetEngAI.git<br />
                <span className="text-neon-cyan">cd</span> NetEngAI<br />
                <span className="text-gray-500"># Sync dependencies</span><br />
                <span className="text-neon-purple">uv</span> sync<br />
                <span className="text-gray-500"># Configure env vars</span><br />
                <span className="text-neon-cyan">cp</span> .env.example .env<br />
                <span className="text-gray-500"># Run tests (optional)</span><br />
                <span className="text-neon-purple">uv</span> run pytest<br />
                <span className="text-gray-500"># Start the Telegram polling agent</span><br />
                <span className="text-neon-cyan">uv</span> run python main.py
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
