"use client";
import { motion } from "framer-motion";
import { Braces, ScanSearch, LineChart } from "lucide-react";

const steps = [
  { icon: Braces, number: "01", title: "Paste code", text: "Drop in a function or a whole file. Choose a language or let us detect it." },
  { icon: ScanSearch, number: "02", title: "Detect patterns", text: "Loops, nesting, recursion, and sized allocations are read without running anything." },
  { icon: LineChart, number: "03", title: "See the curve", text: "Get a Big-O estimate, plain-language context, and a growth chart." },
];

export default function HowItWorks() {
  return <section id="how" className="mx-auto max-w-6xl px-5 py-24 md:px-8"><div className="mb-12"><p className="mb-3 font-mono text-xs tracking-[0.18em] text-[#89b4fa]">HOW IT WORKS</p><h2 className="text-3xl font-semibold text-[#cdd6f4]">Three steps from code to clarity.</h2></div><div className="grid gap-4 md:grid-cols-3">{steps.map(({ icon: Icon, number, title, text }, index) => <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.45, delay: index * 0.1 }} className="border border-[#3a3a55] bg-[#252538] p-6"><div className="mb-12 flex items-center justify-between"><span className="font-mono text-sm text-[#8a8ab0]">{number}</span><Icon size={20} className="text-[#89b4fa]" /></div><h3 className="mb-2 text-lg font-medium text-[#cdd6f4]">{title}</h3><p className="text-sm leading-6 text-[#8a8ab0]">{text}</p></motion.article>)}</div></section>;
}
