"use client";

import { motion } from "framer-motion";
import type { ComplexityClass } from "@/lib/analyze";

const curves: Array<{ label: string; className: ComplexityClass; color: string; values: number[] }> = [
  { label: "O(1)", className: "constant", color: "#2dd4bf", values: Array(15).fill(0.08) },
  { label: "O(log n)", className: "logarithmic", color: "#8b5cf6", values: Array.from({ length: 15 }, (_, i) => 0.08 + Math.log2(i + 1) * 0.08) },
  { label: "O(n)", className: "linear", color: "#22d3ee", values: Array.from({ length: 15 }, (_, i) => 0.08 + i * 0.055) },
  { label: "O(n log n)", className: "linearithmic", color: "#c084fc", values: Array.from({ length: 15 }, (_, i) => 0.08 + (i + 1) * Math.log2(i + 2) * 0.023) },
  { label: "O(n²)", className: "quadratic", color: "#ffb454", values: Array.from({ length: 15 }, (_, i) => 0.08 + (i + 1) ** 2 * 0.004) },
  { label: "O(2^n)", className: "exponential", color: "#fb4d9e", values: Array.from({ length: 15 }, (_, i) => Math.min(0.98, 0.05 + 2 ** (i / 2.2) * 0.018)) },
];

function GrowthGraph({ active, title, axis }: { active: ComplexityClass; title: string; axis: string }) {
  const points = (values: number[]) => values.map((value, index) => `${(index / 14) * 470 + 15},${160 - Math.min(value, 1) * 140}`).join(" ");
  return <div className="border border-[#2f2f5e] bg-[#060615] p-3">
    <div className="mb-2 flex items-center justify-between"><span className="font-mono text-[10px] text-[#ece9ff]">{title}</span><span className="font-mono text-[9px] text-[#9d9dd4]">{axis}</span></div>
    <svg viewBox="0 0 500 180" className="h-44 w-full" role="img" aria-label={`${title} complexity growth curves`}>
      <g stroke="#2f2f5e" strokeWidth="1"><path d="M15 20V160H485" /><path d="M15 125H485M15 90H485M15 55H485" strokeDasharray="2 5" /></g>
      {curves.map((curve) => <motion.polyline key={curve.label} points={points(curve.values)} fill="none" stroke={curve.color} strokeWidth={curve.className === active ? 3 : 1.25} opacity={curve.className === active ? 1 : 0.18} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: curve.className === active ? 0.9 : 0.2 }} />)}
    </svg>
    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9px] text-[#9d9dd4]">{curves.map((curve) => <span key={curve.label} className={curve.className === active ? "font-bold text-[#ece9ff]" : ""}><i className="mr-1 inline-block h-1.5 w-1.5" style={{ backgroundColor: curve.color, opacity: curve.className === active ? 1 : 0.3 }} />{curve.label}</span>)}</div>
  </div>;
}

export default function ComplexityChart({ timeActive, spaceActive }: { timeActive: ComplexityClass; spaceActive: ComplexityClass }) {
  return <div className="grid gap-3 xl:grid-cols-2"><GrowthGraph active={timeActive} title="Time growth" axis="relative operations" /><GrowthGraph active={spaceActive} title="Space growth" axis="relative memory" /></div>;
}
