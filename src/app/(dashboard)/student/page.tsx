"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ClipboardCheck, Target, TrendingUp, Sparkles, Flame, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";

export default function StudentDashboardPage() {
  const { data, isLoading } = trpc.student.getDashboard.useQuery();
  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>;
  if (!data) return <div className="py-8 text-center text-neutral-500">Failed to load dashboard</div>;

  const stats = [{ l: "Assessments", v: data.assessments, i: ClipboardCheck, c: "text-primary-600" }, { l: "Weak Concepts", v: data.weakConcepts, i: Target, c: "text-error" }, { l: "Mastered", v: data.conceptsMastered, i: TrendingUp, c: "text-success" }, { l: "Deep Reports", v: data.deepReports, i: Sparkles, c: "text-secondary-600" }];
  const rd = data.overallReadiness;
  const up = rd ? rd.score >= (rd.previousScore || 0) : true;

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Good morning, {data.name}!</h1>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-950 dark:text-orange-400">
            <Flame className="h-3.5 w-3.5" />{data.streak}-day streak
          </span>
        </div>
        <Link href="/student/assessments">
          <Button size="sm" className="min-h-[44px] shrink-0 gap-1.5"><ClipboardCheck className="h-4 w-4" /><span className="hidden sm:inline">Start</span></Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(s => (
          <div key={s.l} className="glass rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <s.i className={cn("h-4 w-4", s.c)} />
              <span className="truncate text-xs text-neutral-500">{s.l}</span>
            </div>
            <p className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rd ? <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Readiness Score</h3>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
                <circle cx="65" cy="65" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-neutral-800" />
                <circle cx="65" cy="65" r="54" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - rd.score / 100)}
                  className={cn("transition-all duration-1000", rd.score >= 70 ? "text-success" : rd.score >= 50 ? "text-warning" : "text-error")} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">{rd.score}</span>
                <span className="text-[10px] text-neutral-500">{rd.category}</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-neutral-500">Previous:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{rd.previousScore}%</span>
                {up ? <ArrowUp className="h-4 w-4 text-success" /> : <ArrowDown className="h-4 w-4 text-error" />}
              </div>
              <p className="mt-1 text-xs text-neutral-500">{up ? `+${rd.score - rd.previousScore}% improvement` : `${rd.previousScore - rd.score}% decline`}</p>
            </div>
          </div>
        </div> : <div className="glass flex items-center justify-center rounded-2xl p-4 text-sm text-neutral-500">
          Complete an assessment to see your readiness score
        </div>}

        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Cognitive Profile</h3>
          <div className="space-y-2.5">
            {data.radarData.map(d => (
              <div key={d.dimension}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="truncate text-neutral-600 dark:text-neutral-400">{d.dimension}</span>
                  <span className={cn("font-medium", d.score >= d.peerAverage ? "text-success" : "text-error")}>{d.score}</span>
                </div>
                <div className="relative h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className="absolute inset-y-0 rounded-full bg-neutral-400/30" style={{ width: `${d.peerAverage}%` }} />
                  <div className="absolute inset-y-0 rounded-full bg-primary-500" style={{ width: `${d.score}%` }} />
                </div>
                <div className="mt-0.5 flex justify-between text-[10px] text-neutral-400"><span>You: {d.score}</span><span>Avg: {d.peerAverage}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Weak Concepts</h3>
            <span className="text-xs text-neutral-400">{data.weakConceptsList.length} areas</span>
          </div>
          <div className="space-y-3">
            {data.weakConceptsList.map(c => (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate text-neutral-900 dark:text-white">{c.name}</span>
                  <span className="text-xs font-medium text-error">{c.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className="h-full rounded-full bg-error" style={{ width: `${c.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Journey Timeline</h3>
          <div className="space-y-3">
            {data.journey.map((e, i) => (
              <div key={e.date} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn("h-2.5 w-2.5 rounded-full", i === data.journey.length - 1 ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-600")} />
                  {i < data.journey.length - 1 && <div className="mt-0.5 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />}
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-between">
                  <span className="text-xs text-neutral-500">{e.date}</span>
                  <span className={cn("text-sm font-semibold", e.score >= 70 ? "text-success" : e.score >= 50 ? "text-warning" : "text-error")}>{e.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recommendations</h3>
        <div className="space-y-3">
          {data.recommendations.map(rec => (
            <div key={rec.id} className="flex items-start gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{rec.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{rec.description}</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
