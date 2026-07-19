"use client";

import { trpc } from "@/lib/trpc/client";
import { cn, formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, Zap, Target, History, GraduationCap } from "lucide-react";

export default function TeacherDashboardPage() {
  const { data } = trpc.teacher.getDashboard.useQuery();

  if (!data) return (
    <div className="animate-fade-in space-y-6">
      {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl p-6"><div className="h-4 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" /></div>)}
    </div>
  );

  const circumference = 2 * Math.PI * 65;
  const offset = circumference - (data.lastScore / 100) * circumference;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Welcome back, {data.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span className="truncate">{data.subject} &middot; {data.school}</span>
            </p>
          </div>
          <span className={cn("flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", data.assessed ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
            {data.assessed ? <><CheckCircle2 className="h-3.5 w-3.5" /> Assessed</> : <><Clock className="h-3.5 w-3.5" /> Pending</>}
          </span>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Last Score</h3>
          <span className="text-xs capitalize text-neutral-500">{data.category}</span>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <div className="relative">
            <svg width="160" height="160" className="-rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="65" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-neutral-800" />
              <circle cx="80" cy="80" r="65" fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">{data.lastScore}</span>
              <span className="text-xs font-medium capitalize text-primary-600">{data.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-success"><Zap className="h-4 w-4" /> Strengths</h3>
          <ul className="space-y-2">
            {data.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" /><span className="text-neutral-700 dark:text-neutral-300">{s}</span></li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-warning"><Target className="h-4 w-4" /> Improvements</h3>
          <ul className="space-y-2">
            {data.improvements.map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" /><span className="text-neutral-700 dark:text-neutral-300">{i}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300"><History className="h-4 w-4" /> Assessment History</h3>
        <div className="space-y-2">
          {data.assessmentHistory.map((a, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
              <span className="text-sm text-neutral-500">{formatDate(a.date)}</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${a.score}%` }} />
                </div>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{a.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
