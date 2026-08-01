import { motion } from "motion/react";
import { ArrowRight, TerminalSquare } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/20 rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-xs font-mono font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            Llama.cpp + OpenWrt MCP
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            LLM-Powered Network <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
              Diagnostics Assistant
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10">
            NetEngAI operates as a Telegram bot, interfacing with a local Llama.cpp instance and communicating dynamically with an OpenWrt router through a Model Context Protocol (MCP) server.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#install"
              className="flex items-center gap-2 px-8 py-4 bg-neon-cyan text-dark-bg font-semibold rounded-md hover:bg-neon-cyan/90 glow-cyan transition-all"
            >
              <TerminalSquare className="w-5 h-5" />
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
            <a
              href="https://github.com/PiterPentester/NetEngAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 border border-dark-border bg-dark-border/50 font-medium rounded-md hover:border-gray-600 transition-colors"
            >
              View GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
