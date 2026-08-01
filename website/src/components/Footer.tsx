import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-dark-border py-12 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">NetEng<span className="text-neon-cyan">AI</span></span>
          <span className="text-gray-500 text-sm ml-2">© {new Date().getFullYear()} PiterPentester</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/PiterPentester/NetEngAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
