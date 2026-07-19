"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, Eye, Sparkles, ChevronRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  mastered: "bg-success/10 text-success", strong: "bg-info/10 text-info",
  competent: "bg-primary/10 text-primary", developing: "bg-warning/10 text-warning",
  weak: "bg-error/10 text-error",
};

export default function ReportsPage() {
  const { data: reports, isLoading } = trpc.student.getReports.useQuery();

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">My Reports</h1>
        <p className="mt-1 text-sm text-neutral-500">View your assessment reports and deep analysis</p>
      </div>

      {(!reports || reports.length === 0) && (
        <div className="glass rounded-2xl p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-neutral-400" />
          <p className="mt-2 text-sm text-neutral-500">No reports yet. Complete an assessment to see your results.</p>
        </div>
      )}

      <div className="space-y-3">
        {reports?.map(r => (
          <div key={r.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{r.title}</h3>
                  <span className={cn("shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium", categoryColors[r.category] || categoryColors.developing)}>
                    {r.category}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-neutral-500">
                  <span>Score: <strong className={cn(r.score >= 70 ? "text-success" : r.score >= 50 ? "text-warning" : "text-error")}>{r.score}%</strong></span>
                  <span>{r.date}</span>
                </div>
              </div>
              <div className="shrink-0">
                {r.hasDeep ? (
                  <Link href={`/student/reports/deep/${r.deepId}`}>
                    <Button size="sm" variant="outline" className="min-h-[44px] gap-1.5">
                      <Sparkles className="h-4 w-4" /> Deep Report
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" className="min-h-[44px] gap-1.5">
                    <Sparkles className="h-4 w-4" /> Request Deep
                  </Button>
                )}
              </div>
            </div>
            <Link href={`/student/reports/basic/${r.id}`} className="mt-2 flex items-center gap-1 text-xs text-primary-600">
              <Eye className="h-3.5 w-3.5" /> View basic report <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
