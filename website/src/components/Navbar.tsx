import { Github, Terminal } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Terminal className="w-8 h-8 text-neon-cyan" />
            <span className="font-bold text-xl tracking-tight">NetEng<span className="text-neon-cyan">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#install" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Installation</a>
            <a
              href="https://github.com/PiterPentester/NetEngAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium border border-dark-border px-4 py-2 rounded-md hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
