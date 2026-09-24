"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HowItWorks from "@/components/HowItWorks";

const Hero3D = dynamic(() => import("@/components/Hero3D"), { ssr: false });

export default function Home() {
  return (
    <main className="overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob one" />
        <div className="aurora-blob two" />
        <div className="aurora-blob three" />
        <div className="noise-overlay" />
      </div>

      <nav className="sticky top-0 z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className="glass-panel flex w-full items-center justify-between rounded-full px-5 py-3">
          <Link href="/" className="font-mono text-sm text-[#ece9ff]">
            <span className="gradient-text font-semibold">complexity</span> lens
          </Link>
          <Link
            href="/analyze"
            className="group flex items-center gap-2 rounded-full border border-[#2f2f5e] bg-[#12122c] px-4 py-2 text-sm text-[#ece9ff] transition hover:border-[#8b5cf6] hover:shadow-[0_0_20px_-4px_#8b5cf6]"
          >
            Open analyzer <ArrowRight className="transition group-hover:translate-x-0.5" size={14} />
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto flex min-h-[650px] max-w-6xl items-center px-5 py-24 md:px-8">
        <Hero3D />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-2xl"
        >
          <p className="mb-5 flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#8b5cf6]">
            <Sparkles size={13} /> STATIC CODE ANALYSIS
          </p>
          <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#ece9ff] md:text-7xl">
            See what your
            <br />
            <span className="gradient-text">code actually costs.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#9d9dd4]">
            A free, browser-based complexity estimate for Python, Java, C, and C++. No execution, no uploads, no paywall.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <Link
              href="/analyze"
              className="glow-pulse inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#22d3ee] px-6 py-3 text-sm font-semibold text-[#060615] transition hover:brightness-110"
            >
              Try it now <ArrowRight size={16} />
            </Link>
            <a href="#how" className="text-sm text-[#9d9dd4] underline decoration-[#2f2f5e] underline-offset-4 transition hover:text-[#ece9ff]">
              See how it works
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] tracking-wide text-[#9d9dd4]/70">hover the ship, or scroll — it's made of stars</p>
        </motion.div>
      </section>

      <HowItWorks />

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl px-5 py-20 md:px-8"
      >
        <div className="glass-panel relative overflow-hidden rounded-3xl p-10 md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#22d3ee] opacity-20 blur-3xl" />
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-[#2dd4bf]">WHY FREE</p>
          <h2 className="max-w-xl text-3xl font-semibold text-[#ece9ff] md:text-4xl">
            A useful first pass should not require a subscription.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-[#9d9dd4]">
            Complexity Lens runs its small set of static heuristics in your browser. It is transparent about what it
            can see, and it never pretends to replace a careful review of your algorithm.
          </p>
        </div>
      </motion.section>

      <footer className="relative mx-auto max-w-6xl px-5 py-8 font-mono text-xs text-[#9d9dd4] md:px-8">
        <span className="gradient-text">complexity lens</span> · static analysis, kept local
      </footer>
    </main>
  );
}
