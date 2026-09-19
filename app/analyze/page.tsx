import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnalyzerPanel from "@/components/AnalyzerPanel";

export default function AnalyzePage() {
  return (
    <main className="min-h-screen grid-bg">
      <div className="aurora-bg">
        <div className="aurora-blob one" />
        <div className="aurora-blob two" />
        <div className="noise-overlay" />
      </div>
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm text-[#9d9dd4] hover:text-[#8b5cf6]">
          <ArrowLeft size={15} /> complexity lens
        </Link>
        <div className="pb-14 pt-20">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] text-[#8b5cf6]">COMPLEXITY LENS / ANALYZE</p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            Understand the <span className="gradient-text">shape</span> of your code.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9d9dd4]">
            Static pattern analysis gives you a fast estimate without executing or uploading your code.
          </p>
        </div>
      </div>
      <AnalyzerPanel />
    </main>
  );
}
