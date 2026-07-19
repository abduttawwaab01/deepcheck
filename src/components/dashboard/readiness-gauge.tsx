"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReadinessGaugeProps {
  score: number;
  previousScore?: number;
  category: string;
}

const categoryLabels: Record<string, string> = {
  critical: "Critical", weak: "Weak", developing: "Developing",
  competent: "Competent", strong: "Strong", mastered: "Mastered",
};

export function ReadinessGauge({ score, previousScore, category }: ReadinessGaugeProps) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;
  const label = categoryLabels[category] || category;
  const diff = previousScore ? score - previousScore : 0;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Overall Readiness</span>
        {previousScore && (
          <span className={cn("text-xs font-medium", diff >= 0 ? "text-success" : "text-error")}>
            {diff >= 0 ? "↑" : "↓"} {Math.abs(diff)}%
          </span>
        )}
      </div>

      <div className="relative mt-4 flex flex-col items-center">
        <svg width="180" height="180" className="-rotate-90" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="70" fill="none" stroke="#e2e8f0" strokeWidth="12" className="dark:stroke-neutral-800" />
          <motion.circle
            cx="90" cy="90" r="70" fill="none" stroke="#3b82f6" strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">{score}</span>
          <span className="text-sm font-medium text-primary-600">{label}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-xs">
        {Object.entries(categoryLabels).map(([key, val]) => (
          <span key={key} className={cn("rounded-md px-2 py-1 transition-colors", key === category ? "bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300" : "text-neutral-400")}>{val}</span>
        ))}
      </div>
    </div>
  );
}
