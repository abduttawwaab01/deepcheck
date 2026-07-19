"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { FileText, BarChart3, Sparkles, Download } from "lucide-react";

const categoryStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  weak: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  developing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  competent: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  strong: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  mastered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export default function TeacherReportsPage() {
  const { data: reports } = trpc.teacher.getReports.useQuery();

  if (!reports) return (
    <div className="animate-fade-in space-y-6">
      {[1, 2].map((i) => <div key={i} className="glass rounded-2xl p-6"><div className="h-4 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" /></div>)}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Reports</h1>
          <p className="mt-1 text-sm text-neutral-500">View your assessment reports and request deep analysis</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Export All</Button>
      </div>

      {reports.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-10 text-center">
          <BarChart3 className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No reports yet. Complete an assessment to see your results.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{report.type}</h3>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatDate(report.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={cn("rounded-lg px-2.5 py-1 text-xs font-medium capitalize", categoryStyles[report.category] || "bg-neutral-100 text-neutral-600")}>{report.category}</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">{report.score}</span>
                </div>
              </div>
              {!report.hasDeep && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-3 dark:border-primary-900 dark:bg-primary-950/30">
                  <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <Sparkles className="h-4 w-4 text-primary-500" />
                    <span>Get AI-powered deep analysis with personalized improvement plan</span>
                  </div>
                  <Button size="sm" className="gap-1.5 shrink-0"><Sparkles className="h-3.5 w-3.5" /> Request Deep Report</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
