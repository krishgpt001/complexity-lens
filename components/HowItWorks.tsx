"use client";
import { motion } from "framer-motion";
import { Braces, ScanSearch, LineChart } from "lucide-react";

const steps = [
  { icon: Braces, number: "01", title: "Paste code", text: "Drop in a function or a whole file. Choose a language or let us detect it.", glow: "#8b5cf6" },
  { icon: ScanSearch, number: "02", title: "Detect patterns", text: "Loops, nesting, recursion, and sized allocations are read without running anything.", glow: "#22d3ee" },
  { icon: LineChart, number: "03", title: "See the curve", text: "Get a Big-O estimate, plain-language context, and a growth chart.", glow: "#ec4899" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs tracking-[0.18em] text-[#8b5cf6]">HOW IT WORKS</p>
        <h2 className="text-3xl font-semibold text-[#ece9ff]">Three steps from code to clarity.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, number, title, text, glow }, index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl border border-[#2f2f5e] bg-[#12122c] p-6 transition-colors hover:border-[color:var(--glow)]"
            style={{ ["--glow" as string]: glow }}
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
              style={{ background: glow }}
            />
            <div className="mb-12 flex items-center justify-between">
              <span className="font-mono text-sm text-[#9d9dd4]">{number}</span>
              <Icon size={20} style={{ color: glow }} />
            </div>
            <h3 className="mb-2 text-lg font-medium text-[#ece9ff]">{title}</h3>
            <p className="text-sm leading-6 text-[#9d9dd4]">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
