"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, CheckCircle2, AlertTriangle, BookOpen, FileText } from "lucide-react";
const d = {
  n: "Adeola Samuel", a: "Math Diagnostic", dt: "2026-07-15", os: 62, ps: 55,
  s: ["Vocabulary", "Grammar", "Basic Geometry"],
  w: ["Logical Deduction", "Fraction Operations", "Inference Making"],
  t: [
    { n: "Number Sense", s: 72, st: "strong", c: 18, t: 25 },
    { n: "Fraction Operations", s: 34, st: "weak", c: 7, t: 20 },
    { n: "Geometry Basics", s: 68, st: "competent", c: 17, t: 25 },
    { n: "Logical Deduction", s: 28, st: "critical", c: 5, t: 18 },
    { n: "Data Interpretation", s: 55, st: "developing", c: 11, t: 20 },
    { n: "Algebraic Thinking", s: 45, st: "developing", c: 9, t: 20 },
    { n: "Word Problems", s: 38, st: "weak", c: 8, t: 22 },
    { n: "Measurement & Units", s: 82, st: "mastered", c: 22, t: 25 },
  ],
  cog: [
    { l: "Memory Recall", s: 65, a: 60 }, { l: "Logical Reasoning", s: 38, a: 50 },
    { l: "Spatial Awareness", s: 72, a: 58 }, { l: "Verbal Comprehension", s: 80, a: 65 },
    { l: "Processing Speed", s: 55, a: 52 }, { l: "Attention to Detail", s: 45, a: 55 },
  ],
  recs: [
    { p: "high", t: "Focus on Fraction Operations", d: "Master fractions through visual learning." },
    { p: "high", t: "Develop Logical Deduction", d: "Practice with puzzles and patterns." },
    { p: "medium", t: "Improve Word Problem Strategy", d: "Use the Read-Draw-Write approach." },
    { p: "low", t: "Strengthen Data Interpretation", d: "Practice reading charts and tables." },
  ],
};

const badge: Record<string, string> = {
  mastered: "bg-success/10 text-success", strong: "bg-info/10 text-info",
  competent: "bg-primary/10 text-primary", developing: "bg-warning/10 text-warning",
  weak: "bg-error/10 text-error", critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const circ = 2 * Math.PI * 54;

export default function DeepReportPage() {
  const params = useParams();
  const diff = d.os - d.ps;

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <FileText className="h-4 w-4" /><span>ID: {params.id}</span><span>&middot;</span><span>{d.dt}</span>
        </div>
        <Button variant="outline" size="sm" className="min-h-[44px] gap-1.5"><Download className="h-4 w-4" />PDF</Button>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{d.a}</h1>
        <p className="text-sm text-neutral-500">{d.n}</p>
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 130 130" className="-rotate-90">
            <circle cx="65" cy="65" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-neutral-800" />
            <circle cx="65" cy="65" r="54" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - d.os / 100)}
              className={cn("transition-all duration-1000", d.os >= 70 ? "text-success" : d.os >= 50 ? "text-warning" : "text-error")} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">{d.os}</span>
            <span className="text-[10px] text-neutral-500">Overall</span>
          </div>
        </div>
        <div className="text-xs">
          <div>Previous: <strong className="text-neutral-900 dark:text-white">{d.ps}%</strong></div>
          <div className={cn("font-semibold", diff >= 0 ? "text-success" : "text-error")}>{diff >= 0 ? "+" : ""}{diff}% change</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" />Strengths</div>
          <div className="mt-3 space-y-1.5">{d.s.map(s => (
            <div key={s} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />{s}
            </div>
          ))}</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-error"><AlertTriangle className="h-4 w-4" />Weaknesses</div>
          <div className="mt-3 space-y-1.5">{d.w.map(w => (
            <div key={w} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-error" />{w}
            </div>
          ))}</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Topic Breakdown</h3>
        <div className="space-y-3">
          {d.t.map(r => (
            <div key={r.n}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-neutral-900 dark:text-white">{r.n}</span>
                <span className="text-xs">{r.s}% <span className={cn("inline-block rounded px-1.5 py-0.5 font-medium", badge[r.st])}>{r.st}</span></span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div className={cn("h-full rounded-full", r.s >= 70 ? "bg-success" : r.s >= 50 ? "bg-warning" : "bg-error")} style={{ width: `${r.s}%` }} />
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-400">{r.c}/{r.t} correct</div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Cognitive Profile</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {d.cog.map(x => (
            <div key={x.l} className="rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-900 dark:text-white">{x.l}</span>
                <span className={cn("font-semibold", x.s >= x.a ? "text-success" : "text-error")}>{x.s}</span>
              </div>
              <div className="relative mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div className="absolute inset-y-0 rounded-full bg-neutral-400/30" style={{ width: `${x.a}%` }} />
                <div className="absolute inset-y-0 rounded-full bg-primary-500" style={{ width: `${x.s}%` }} />
              </div>
              <div className="mt-1 text-xs text-neutral-500">Peer avg: {x.a}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recommendations</h3>
        <div className="space-y-3">
          {d.recs.map(rec => (
            <div key={rec.t} className={cn("rounded-xl border border-neutral-100 border-l-4 p-4 dark:border-neutral-800",
              rec.p === "high" ? "border-l-error" : rec.p === "medium" ? "border-l-warning" : "border-l-info")}>
              <span className={cn("inline-block rounded-md px-2 py-0.5 text-xs font-medium",
                rec.p === "high" ? "bg-error/10 text-error" : rec.p === "medium" ? "bg-warning/10 text-warning" : "bg-info/10 text-info")}>
                {rec.p === "high" ? "High" : rec.p === "medium" ? "Medium" : "Low"} Priority
              </span>
              <h4 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">{rec.t}</h4>
              <p className="mt-1 text-sm text-neutral-500">{rec.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
