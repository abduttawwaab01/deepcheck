"use client";

import { useEffect, useState } from "react";
import { Brain, Search, Target, Zap, Activity, Sparkles } from "lucide-react";

export function IntelligenceDemoBar() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/landing-stats").then(r => r.json()).then(setData).catch(() => {}); }, []);

  const gapCount = data?.totalQuestions || 0;

  return (
    <section className="relative overflow-hidden bg-slate-900 py-0">
      {/* Glow lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary-400/50 to-transparent" />

      {/* Grid overlay */}
      <div className="data-grid pointer-events-none absolute inset-0 opacity-[0.03]" />

      <div className="relative border-t border-white/5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Stat */}
          <div className="group relative">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/20 transition-all duration-500 group-hover:shadow-primary-500/30 group-hover:scale-105">
                <Brain className="h-7 w-7 text-white" />
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg">
                  AI
                </div>
                {/* Orbiting dots */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 animate-spin-slow" style={{ animationDuration: "6s" }}>
                  <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 rounded-full bg-white/60" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                    {gapCount > 0 ? `${(gapCount / 1000).toFixed(1)}K+` : "Thousands of"}
                  </span>
                  <Zap className="h-4 w-4 text-primary-400" />
                </div>
                <div className="text-sm text-slate-500">Questions in assessment bank</div>
              </div>
            </div>
          </div>

          {/* Right: Feature badges with animated dots */}
          <div className="flex flex-wrap gap-6">
            <div className="group relative flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20 hover:bg-emerald-500/5">
              <div className="relative">
                <Search className="h-5 w-5 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Misconception Detection</div>
                <div className="text-xs text-slate-500">AI-Powered</div>
              </div>
            </div>

            <div className="group relative flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-primary-500/20 hover:bg-primary-500/5">
              <Target className="h-5 w-5 text-primary-400" />
              <div>
                <div className="text-sm font-semibold text-white">Precision Analysis</div>
                <div className="text-xs text-slate-500">IRT-Based</div>
              </div>
            </div>

            {/* Animated data flow lines */}
            <div className="relative hidden items-center lg:flex">
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-[2px]"
                  >
                    <div
                      className="h-10 w-[2px] rounded-full bg-gradient-to-t from-primary-500/0 via-primary-400/60 to-primary-500/0 animate-data-flow"
                      style={{ animationDelay: `${i * 0.15}s`, animationDuration: "2s" }}
                    />
                    <div
                      className="h-6 w-[2px] rounded-full bg-gradient-to-t from-secondary-500/0 via-secondary-400/40 to-secondary-500/0 animate-data-flow"
                      style={{ animationDelay: `${i * 0.15 + 0.5}s`, animationDuration: "2.5s" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
