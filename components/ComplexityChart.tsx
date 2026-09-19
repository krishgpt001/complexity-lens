"use client";

import { motion } from "framer-motion";
import type { ComplexityClass } from "@/lib/analyze";

const curves: Array<{ label: string; className: ComplexityClass; color: string; values: number[] }> = [
  { label: "O(1)", className: "constant", color: "#a6e3a1", values: Array(15).fill(0.08) },
  { label: "O(log n)", className: "logarithmic", color: "#89b4fa", values: Array.from({ length: 15 }, (_, i) => 0.08 + Math.log2(i + 1) * 0.08) },
  { label: "O(n)", className: "linear", color: "#89dceb", values: Array.from({ length: 15 }, (_, i) => 0.08 + i * 0.055) },
  { label: "O(n log n)", className: "linearithmic", color: "#cba6f7", values: Array.from({ length: 15 }, (_, i) => 0.08 + (i + 1) * Math.log2(i + 2) * 0.023) },
  { label: "O(n²)", className: "quadratic", color: "#f9e2af", values: Array.from({ length: 15 }, (_, i) => 0.08 + (i + 1) ** 2 * 0.004) },
  { label: "O(2^n)", className: "exponential", color: "#f38ba8", values: Array.from({ length: 15 }, (_, i) => Math.min(0.98, 0.05 + 2 ** (i / 2.2) * 0.018)) },
];

function GrowthGraph({ active, title, axis }: { active: ComplexityClass; title: string; axis: string }) {
  const points = (values: number[]) => values.map((value, index) => `${(index / 14) * 470 + 15},${160 - Math.min(value, 1) * 140}`).join(" ");
  return <div className="border border-[#3a3a55] bg-[#1e1e2e] p-3">
    <div className="mb-2 flex items-center justify-between"><span className="font-mono text-[10px] text-[#cdd6f4]">{title}</span><span className="font-mono text-[9px] text-[#8a8ab0]">{axis}</span></div>
    <svg viewBox="0 0 500 180" className="h-44 w-full" role="img" aria-label={`${title} complexity growth curves`}>
      <g stroke="#3a3a55" strokeWidth="1"><path d="M15 20V160H485" /><path d="M15 125H485M15 90H485M15 55H485" strokeDasharray="2 5" /></g>
      {curves.map((curve) => <motion.polyline key={curve.label} points={points(curve.values)} fill="none" stroke={curve.color} strokeWidth={curve.className === active ? 3 : 1.25} opacity={curve.className === active ? 1 : 0.18} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: curve.className === active ? 0.9 : 0.2 }} />)}
    </svg>
    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-[#8a8ab0]">{curves.map((curve) => <span key={curve.label} className={curve.className === active ? "font-bold text-[#cdd6f4]" : ""}><i className="mr-1 inline-block h-1.5 w-1.5" style={{ backgroundColor: curve.color, opacity: curve.className === active ? 1 : 0.3 }} />{curve.label}</span>)}</div>
  </div>;
}

export default function ComplexityChart({ timeActive, spaceActive }: { timeActive: ComplexityClass; spaceActive: ComplexityClass }) {
  return <div className="grid gap-3 xl:grid-cols-2"><GrowthGraph active={timeActive} title="Time growth" axis="relative operations" /><GrowthGraph active={spaceActive} title="Space growth" axis="relative memory" /></div>;
}
