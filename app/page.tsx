"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Hero3D from "@/components/Hero3D";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return <main className="overflow-hidden">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8"><Link href="/" className="font-mono text-sm text-[#cdd6f4]"><span className="text-[#89b4fa]">complexity</span> lens</Link><Link href="/analyze" className="border border-[#3a3a55] px-4 py-2 text-sm text-[#cdd6f4] transition hover:border-[#89b4fa]">Open analyzer <ArrowRight className="ml-1 inline" size={14} /></Link></nav>
    <section className="relative mx-auto flex min-h-[650px] max-w-6xl items-center px-5 py-24 md:px-8"><Hero3D /><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="relative z-10 max-w-2xl"><p className="mb-5 font-mono text-xs tracking-[0.18em] text-[#89b4fa]">STATIC CODE ANALYSIS</p><h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#cdd6f4] md:text-7xl">See what your<br /><span className="text-[#89b4fa]">code actually costs.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#8a8ab0]">A free, browser-based complexity estimate for Python, Java, C, and C++. No execution, no uploads, no paywall.</p><div className="mt-9"><Link href="/analyze" className="inline-flex items-center gap-2 bg-[#89b4fa] px-5 py-3 text-sm font-semibold text-[#1e1e2e] transition hover:bg-[#b4d0ff]">Try it now <ArrowRight size={16} /></Link></div></motion.div></section>
    <HowItWorks />
    <section className="mx-auto max-w-6xl border-y border-[#3a3a55] px-5 py-20 md:px-8"><p className="mb-3 font-mono text-xs tracking-[0.18em] text-[#a6e3a1]">WHY FREE</p><h2 className="max-w-xl text-3xl font-semibold text-[#cdd6f4]">A useful first pass should not require a subscription.</h2><p className="mt-5 max-w-2xl leading-7 text-[#8a8ab0]">Complexity Lens runs its small set of static heuristics in your browser. It is transparent about what it can see, and it never pretends to replace a careful review of your algorithm.</p></section>
    <footer className="mx-auto max-w-6xl px-5 py-8 font-mono text-xs text-[#8a8ab0] md:px-8">complexity lens · static analysis, kept local</footer>
  </main>;
}
