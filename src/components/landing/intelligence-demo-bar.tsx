"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Activity, Zap, TrendingUp } from "lucide-react";

const detections = [
  "Fraction Misconception detected in Adeola — score: 34%",
  "Noun-Verb Agreement gap found in Chidi — accuracy: 28%",
  "Logical Deduction weakness in Zainab — percentile: 15th",
  "Algebraic Reasoning gap in Emeka — theta: -1.2",
  "Critical Analysis gap in Temilade — score: 41%",
  "Geometry spatial reasoning weakness in Ada — 22%",
  "Reading Comprehension gap in Emeka — 45%",
  "Number Sense foundational gap in Chidi — 31%",
  "Data Interpretation weakness in Zainab — 38%",
  "Problem Solving strategy gap in Adeola — 29%",
];

export function IntelligenceDemoBar() {
  return (
    <section className="relative overflow-hidden border-y border-neutral-200 bg-neutral-900 py-0 dark:border-neutral-800">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-transparent to-secondary-600/20" />

      {/* Live ticker */}
      <div className="relative flex items-center gap-4 overflow-hidden py-4">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-neutral-900 px-4">
          <span className="flex h-2 w-2 rounded-full bg-success animate-pulse-slow" />
          <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Live Detection Feed</span>
        </div>
        <div className="flex gap-8 overflow-hidden">
          <div className="flex animate-ticker gap-8">
            {[...detections, ...detections].map((d, i) => (
              <span key={i} className="whitespace-nowrap text-sm text-white/60">
                <span className="text-success">◆</span> {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1.2M+</div>
              <div className="text-sm text-white/60">Learning gaps detected</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {[
              { icon: Activity, label: "Active Users", value: "12,847", color: "text-success" },
              { icon: Zap, label: "Avg. Time Saved", value: "6.2 hrs/wk", color: "text-warning" },
              { icon: TrendingUp, label: "Score Improvement", value: "+23%", color: "text-primary-400" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <div className="text-sm font-semibold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
