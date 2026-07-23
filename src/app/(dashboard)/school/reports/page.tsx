"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, CheckCircle2, Clock, ExternalLink } from "lucide-react";

export default function ReportsPage() {
  const { data: reports, isLoading } = trpc.school.getReports.useQuery();
  const requestDeep = trpc.school.requestDeepReport.useMutation();

  if (isLoading) return (
    <div className="animate-fade-in space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Reports Hub</h1>
        <p className="mt-1 text-sm text-neutral-500">View assessment reports and request deep analysis</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500 dark:border-neutral-800">
              <th className="pb-3 pr-3 font-medium">Student</th>
              <th className="pb-3 pr-3 font-medium">Type</th>
              <th className="pb-3 pr-3 font-medium">Basic Score</th>
              <th className="pb-3 pr-3 font-medium">Deep Report</th>
              <th className="pb-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((r) => (
              <tr key={r.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/50">
                <td className="py-3 pr-3">
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{r.student}</div>
                  <div className="text-xs text-neutral-400">{r.date}</div>
                </td>
                <td className="py-3 pr-3 text-neutral-600 dark:text-neutral-400">{r.type}</td>
                <td className="py-3 pr-3">
                  <span className={cn("font-semibold", r.basicScore >= 60 ? "text-success" : r.basicScore >= 40 ? "text-warning" : "text-error")}>{r.basicScore}%</span>
                </td>
                <td className="py-3 pr-3">
                  {r.hasDeep ? (
                    <span className={cn("flex items-center gap-1 text-xs font-medium", r.deepStatus === "completed" ? "text-success" : "text-warning")}>
                      {r.deepStatus === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      {r.deepStatus === "completed" ? "Completed" : "Pending"}
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400">Not requested</span>
                  )}
                </td>
                <td className="py-3 text-right">
                  {r.hasDeep && r.deepStatus === "completed" ? (
                    <Button size="sm" variant="ghost" className="gap-1"><ExternalLink className="h-3.5 w-3.5" /> View</Button>
                  ) : r.hasDeep ? (
                    <span className="text-xs text-neutral-400">In progress</span>
                  ) : (
                    <Button size="sm" variant="outline" className="gap-1" loading={requestDeep.isPending}
                      onClick={() => requestDeep.mutate({ targetUserId: r.userId, instanceId: r.instanceId, assessmentType: r.type })}>
                      <FileText className="h-3.5 w-3.5" /> Request Deep
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!reports || reports.length === 0) && (
        <div className="py-16 text-center text-sm text-neutral-400">No reports found</div>
      )}
    </div>
  );
}
