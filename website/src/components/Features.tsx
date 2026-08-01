import { motion } from "motion/react";
import { features } from "../data";

export function Features() {
  return (
    <section id="features" className="py-24 relative border-t border-dark-border bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Key Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to automate and diagnose your infrastructure directly from Telegram, with a focus on OpenWrt 25.x+.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group p-6 border border-dark-border bg-dark-bg rounded-lg hover:border-neon-cyan/30 transition-colors"
            >
              <div className="w-12 h-12 bg-dark-border/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
