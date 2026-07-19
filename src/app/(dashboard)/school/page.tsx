"use client";

import { trpc } from "@/lib/trpc/client";
import { Users, GraduationCap, ClipboardCheck, Sparkles, Award, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SchoolDashboardPage() {
  const { data, isLoading } = trpc.school.getDashboard.useQuery();

  if (isLoading) return (
    <div className="animate-fade-in space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}
      </div>
    </div>
  );

  if (!data) return <div className="pt-10 text-center text-neutral-500">Failed to load dashboard</div>;

  const stats = [
    { label: "Students", value: data.studentCount, icon: Users, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-950" },
    { label: "Teachers", value: data.teacherCount, icon: GraduationCap, color: "text-secondary-600", bg: "bg-secondary-50 dark:bg-secondary-950" },
    { label: "Assessments", value: data.assessmentsTaken, icon: ClipboardCheck, color: "text-success", bg: "bg-success/5" },
    { label: "Deep Reports", value: data.deepReportsGenerated, icon: Sparkles, color: "text-warning", bg: "bg-warning/5" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{data.name}</h1>
          <p className="text-sm text-neutral-500">{data.city}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-3 py-2">
          <Award className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-warning">{data.reportCreditsRemaining} credits remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", s.bg)}>
              <s.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", s.color)} />
            </div>
            <div className="mt-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{s.value}</div>
            <div className="text-xs text-neutral-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recent Assessments</h3>
          <div className="space-y-2">
            {data.recentAssessments.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900 dark:text-white">{a.student}</div>
                  <div className="text-xs text-neutral-500">{a.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-bold", a.score >= 60 ? "text-success" : a.score >= 40 ? "text-warning" : "text-error")}>{a.score}%</span>
                  <span className="text-xs text-neutral-400">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Teacher Status</h3>
          <div className="space-y-2">
            {data.teacherStatus.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  {t.assessed ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Assessed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning"><Clock className="h-3.5 w-3.5" /> Pending</span>
                  )}
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">{t.score}%</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full">View All Teachers</Button>
        </div>
      </div>
    </div>
  );
}
