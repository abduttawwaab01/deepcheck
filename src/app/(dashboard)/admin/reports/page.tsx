"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Search, Play, Eye, FileText, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-success/10 text-success",
  failed: "bg-error/10 text-error",
};

export default function AdminReportsPage() {
  const utils = trpc.useUtils();
  const { data: requests, isLoading, error } = trpc.admin.getReportRequests.useQuery();
  const { mutate: generate, isPending } = trpc.admin.generateDeepReport.useMutation({
    onSuccess: () => utils.admin.getReportRequests.invalidate(),
    onError: (err) => alert(err.message),
  });
  const [search, setSearch] = useState("");

  const filtered = (requests || []).filter((r) =>
    !search || r.requester.toLowerCase().includes(search.toLowerCase()) || (r.target || "").toLowerCase().includes(search.toLowerCase())
  );

  if (error) return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Report Requests</h1>
      <div className="glass rounded-2xl p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-error" />
        <p className="mt-2 text-sm text-error">Failed to load report requests: {error.message}</p>
        <Button size="sm" className="mt-3" onClick={() => utils.admin.getReportRequests.invalidate()}>Retry</Button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Report Requests</h1>
        <span className="self-start rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning sm:self-auto">
          {(requests || []).filter((r) => r.status === "pending").length} pending
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]"
          placeholder="Search by requester or target..."
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl py-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No report requests yet</p>
          <p className="mt-1 text-xs text-neutral-400">Reports will appear here when parents or teachers request deep reports</p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-900">
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Requester</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Target</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filtered.map((r) => (
                  <tr key={r.id} className="bg-white transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900">
                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{r.requester}</td>
                    <td className="px-4 py-3 text-neutral-500">{r.target || "—"}</td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{r.assessmentType || "deep"}</td>
                    <td className="px-4 py-3 text-neutral-500">{r.createdAt}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", statusColors[r.status || "pending"])}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.status === "pending" && (
                        <Button size="sm" onClick={() => generate({ requestId: r.id })} disabled={isPending}>
                          {isPending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1 h-3.5 w-3.5" />} Generate
                        </Button>
                      )}
                      {r.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => window.open(`/student/reports/deep/${r.id}`, "_blank")}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                      )}
                      {r.status === "failed" && (
                        <Button size="sm" variant="outline" onClick={() => generate({ requestId: r.id })} disabled={isPending}>
                          Retry
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 sm:hidden">
            {filtered.map((r) => (
              <div key={r.id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-neutral-900 dark:text-white">{r.requester}</div>
                  <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", statusColors[r.status || "pending"])}>{r.status}</span>
                </div>
                <div className="mt-2 text-xs text-neutral-500">{r.target || "—"} &middot; {r.assessmentType || "deep"} &middot; {r.createdAt}</div>
                <div className="mt-3">
                  {r.status === "pending" && (
                    <Button size="sm" className="w-full" onClick={() => generate({ requestId: r.id })} disabled={isPending}>
                      Generate Report
                    </Button>
                  )}
                  {r.status === "completed" && (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(`/student/reports/deep/${r.id}`, "_blank")}>
                      View Report
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
