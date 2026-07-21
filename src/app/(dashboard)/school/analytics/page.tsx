"use client";

import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Users } from "lucide-react";

export default function SchoolAnalyticsPage() {
  const { data, isLoading } = trpc.school.getClassroomAnalytics.useQuery();

  if (isLoading) return (
    <div className="animate-fade-in space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
    </div>
  );

  if (!data || data.students === 0) return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Classroom Analytics</h1>
        <p className="mt-1 text-sm text-neutral-500">School-wide performance insights</p>
      </div>
      <div className="glass rounded-2xl p-16 text-center">
        <Users className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
        <p className="mt-4 text-sm text-neutral-500">No students enrolled yet. Add students to see analytics.</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Classroom Analytics</h1>
        <p className="mt-1 text-sm text-neutral-500">School-wide performance insights across all students</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: data.students, icon: Users, color: "text-primary-600" },
          { label: "Average Score", value: `${data.avgScore}%`, icon: BarChart3, color: "text-blue-600" },
          { label: "Excellent (80+)", value: data.excellent, icon: CheckCircle2, color: "text-success" },
          { label: "Needs Work (<60)", value: data.needsWork, icon: AlertTriangle, color: "text-error" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <span className="text-xs font-medium text-neutral-500">{stat.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {data.subjectPerformance.length > 0 && (
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Subject Performance</h2>
          <div className="space-y-3">
            {data.subjectPerformance.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.name}</span>
                  <span className={cn("font-semibold", s.avgScore >= 70 ? "text-success" : s.avgScore >= 50 ? "text-warning" : "text-error")}>
                    {s.avgScore}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className={cn("h-full rounded-full transition-all duration-500",
                    s.avgScore >= 70 ? "bg-success" : s.avgScore >= 50 ? "bg-warning" : "bg-error"
                  )} style={{ width: `${s.avgScore}%` }} />
                </div>
                <p className="mt-0.5 text-xs text-neutral-400">{s.studentCount} student{s.studentCount !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {data.topStrengths.length > 0 && (
          <div className="glass rounded-2xl p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-success"><TrendingUp className="h-4 w-4" /> Top Strengths</h3>
            <ul className="space-y-2">
              {data.topStrengths.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700 dark:text-neutral-300">{s.name}</span>
                  <span className="font-semibold text-success">{s.avgScore}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.topWeaknesses.length > 0 && (
          <div className="glass rounded-2xl p-4 sm:p-5">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-warning"><TrendingDown className="h-4 w-4" /> Areas to Improve</h3>
            <ul className="space-y-2">
              {data.topWeaknesses.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700 dark:text-neutral-300">{s.name}</span>
                  <span className="font-semibold text-warning">{s.avgScore}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Score Distribution</h2>
        <div className="flex items-end gap-4">
          {[
            { label: "Excellent", count: data.excellent || 0, color: "bg-success" },
            { label: "Good", count: data.good || 0, color: "bg-primary-500" },
            { label: "Needs Work", count: data.needsWork || 0, color: "bg-error" },
          ].map((bar) => {
            const max = Math.max(data.excellent || 0, data.good || 0, data.needsWork || 0, 1);
            const height = (bar.count / max) * 120;
            return (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">{bar.count}</span>
                <div className={cn("w-full rounded-t-lg transition-all duration-500", bar.color)} style={{ height: `${Math.max(height, 4)}px` }} />
                <span className="text-xs text-neutral-500">{bar.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
