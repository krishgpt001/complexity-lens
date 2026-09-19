"use client";

import { useState } from "react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, Clock3, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { analyze, type AnalysisResult, type Language } from "@/lib/analyze";
import ComplexityChart from "./ComplexityChart";

const sample = `def find_pair(numbers, target):
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return (i, j)
    return None`;

type RecentRun = {
  id: string;
  code: string;
  language: Language;
  time: string;
  space: string;
  timestamp: number;
};

export default function AnalyzerPanel() {
  const [code, setCode] = useState(sample);
  const [language, setLanguage] = useState<Language>("auto");
  const [result, setResult] = useState<AnalysisResult>(() => analyze(sample, "python"));
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("complexity-lens-recent");
      if (stored) setRecentRuns(JSON.parse(stored) as RecentRun[]);
    } catch {
      // Local storage can be unavailable in private browsing; analysis still works.
    }
  }, []);

  const run = () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    window.setTimeout(() => {
      const next = analyze(code, language);
      const entry: RecentRun = {
        id: `${Date.now()}`,
        code,
        language,
        time: next.time.notation,
        space: next.space.notation,
        timestamp: Date.now(),
      };
      setResult(next);
      setRecentRuns((current) => {
        const updated = [entry, ...current.filter((item) => item.code !== code)].slice(0, 5);
        try { window.localStorage.setItem("complexity-lens-recent", JSON.stringify(updated)); } catch {}
        return updated;
      });
      setIsAnalyzing(false);
    }, 320);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        run();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const restore = (entry: RecentRun) => {
    setCode(entry.code);
    setLanguage(entry.language);
    setResult(analyze(entry.code, entry.language));
  };

  const clearHistory = () => {
    setRecentRuns([]);
    try { window.localStorage.removeItem("complexity-lens-recent"); } catch {}
  };

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
      <div className="mb-7 flex items-end justify-between">
        <div><p className="mb-2 font-mono text-xs tracking-[0.18em] text-[#8b5cf6]">LOCAL ANALYSIS</p><h2 className="text-2xl font-semibold text-[#ece9ff]">Paste code. Get a signal.</h2></div>
        <span className="hidden items-center gap-2 font-mono text-xs text-[#9d9dd4] sm:flex"><motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2, repeat: Infinity }}><Activity size={14} className="text-[#2dd4bf]" /></motion.span> nothing leaves your browser</span>
      </div>
      <AnimatePresence initial={false}>
        {recentRuns.length > 0 && showHistory && <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} className="mb-5 overflow-hidden border border-[#2f2f5e] bg-[#12122c]">
          <div className="flex items-center justify-between border-b border-[#2f2f5e] px-4 py-3"><div className="flex items-center gap-2 font-mono text-xs text-[#ece9ff]"><Clock3 size={14} className="text-[#8b5cf6]" /> Recent analyses <span className="text-[#9d9dd4]">stored only on this device</span></div><button onClick={clearHistory} className="flex items-center gap-1 font-mono text-[10px] text-[#9d9dd4] hover:text-[#fb4d9e]"><Trash2 size={12} /> clear</button></div>
          <div className="grid gap-2 p-3 md:grid-cols-2">{recentRuns.map((entry) => <button key={entry.id} onClick={() => restore(entry)} className="group flex items-center justify-between border border-[#2f2f5e] bg-[#060615] p-3 text-left transition hover:border-[#8b5cf6]"><span className="min-w-0"><span className="block truncate font-mono text-xs text-[#ece9ff]">{entry.code.split(/\r?\n/).find((line) => line.trim())?.trim() || "Untitled analysis"}</span><span className="mt-1 block font-mono text-[10px] text-[#9d9dd4]">{entry.language === "auto" ? "auto" : entry.language} · {new Date(entry.timestamp).toLocaleDateString()}</span></span><span className="ml-3 whitespace-nowrap font-mono text-xs text-[#2dd4bf]">{entry.time} / {entry.space}</span></button>)}</div>
        </motion.div>}
      </AnimatePresence>
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border border-[#2f2f5e] bg-[#12122c]">
          <div className="flex items-center justify-between border-b border-[#2f2f5e] px-4 py-3">
            <div className="flex gap-1.5"><i className="h-2 w-2 bg-[#fb4d9e]" /><i className="h-2 w-2 bg-[#ffb454]" /><i className="h-2 w-2 bg-[#2dd4bf]" /></div>
            <button onClick={() => setCode("")} aria-label="Clear code" className="text-[#9d9dd4] hover:text-[#ece9ff]"><RotateCcw size={15} /></button>
          </div>
          <div className="border-b border-[#2f2f5e] p-3"><label htmlFor="language" className="sr-only">Language</label><select id="language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="bg-[#060615] px-3 py-2 font-mono text-xs text-[#ece9ff] outline-none"><option value="auto">Auto-detect</option><option value="python">Python</option><option value="java">Java</option><option value="c">C</option><option value="cpp">C++</option></select></div>
          <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="h-80 w-full resize-none bg-transparent p-5 font-mono text-sm leading-6 text-[#ece9ff] outline-none placeholder:text-[#9d9dd4]" placeholder="Paste Python, Java, C, or C++ code..." aria-label="Code to analyze" />
          <div className="flex items-center justify-between border-t border-[#2f2f5e] px-4 py-3"><span className="font-mono text-xs text-[#9d9dd4]">{code.split(/\r?\n/).length} lines <span className="hidden sm:inline">· Ctrl/⌘ Enter to analyze</span></span><button onClick={run} disabled={isAnalyzing || !code.trim()} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#060615] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">{isAnalyzing ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}>◌</motion.span> Reading</> : <>Analyze <ArrowRight size={15} /></>}</button></div>
        </div>
        <motion.div layout className="border border-[#2f2f5e] bg-[#12122c] p-5">
          <div className="mb-5 flex items-center justify-between"><span className="font-mono text-xs tracking-[0.12em] text-[#9d9dd4]">RESULT</span><span className="font-mono text-xs text-[#2dd4bf]">{result.language.toUpperCase()}</span></div>
          <motion.div layout className="mb-5 grid gap-3 sm:grid-cols-3"><Metric label="Time complexity" value={result.time.notation} /><Metric label="Space complexity" value={result.space.notation} green /><Metric label="Estimated memory" value={result.memory.label} green={result.memory.pressure === "low"} /></motion.div>
          <div className="mb-4 border-l-2 border-[#8b5cf6] bg-[#060615] p-4 text-sm leading-6 text-[#ece9ff]"><p>{result.time.explanation} {result.space.explanation}</p><p className="mt-2 text-xs text-[#9d9dd4]">Memory readout: {result.memory.detail}. Exact bytes depend on runtime input size and data types, so this tool reports growth pressure instead of inventing a byte count.</p></div>
          <ComplexityChart timeActive={result.time.className} spaceActive={result.space.className} />
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs text-[#9d9dd4]"><span>{result.codeLines} code lines</span><span>·</span><span>{result.maxNesting} nesting levels</span><span>·</span><span>{result.time.confidence}% confidence</span><button onClick={() => setShowHistory((value) => !value)} className="text-[#8b5cf6] hover:text-[#ece9ff]">{showHistory ? "hide history" : "show history"}</button></div>
          {result.warnings.length > 0 && <div className="mt-4 space-y-2">{result.warnings.map((warning) => <p key={warning} className="border-l-2 border-[#fb4d9e] pl-3 text-xs leading-5 text-[#fb4d9e]">{warning}</p>)}</div>}
        </motion.div>
      </div>
    </section>
  );
}

function Metric({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return <div className="border border-[#2f2f5e] bg-[#060615] p-4"><p className="mb-2 font-mono text-[10px] text-[#9d9dd4]">{label}</p><p className={`font-mono text-2xl ${green ? "text-[#2dd4bf]" : "text-[#8b5cf6]"}`}>{value}</p></div>;
}
