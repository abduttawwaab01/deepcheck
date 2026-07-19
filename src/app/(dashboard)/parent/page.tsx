"use client";

import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import { Users, Activity, Sparkles, TrendingUp, Clock, History } from "lucide-react";

export default function ParentDashboardPage() {
  const { data } = trpc.parent.getDashboard.useQuery();
  if (!data) return <div className="animate-fade-in space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>;

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Welcome, {data.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Here&apos;s your children&apos;s progress</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1.5 text-xs font-medium text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300">
          <Sparkles className="h-3.5 w-3.5" />{data.deepReportCredits} credits
        </div>
      </div>

      {data.children.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-8 text-center">
          <Users className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No children linked yet. Add a child to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.children.map((child) => (
            <div key={child.id} className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {child.name.split(" ").map(s => s[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{child.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500"><Clock className="h-3 w-3" />{formatDate(child.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">{child.lastScore}</span>
                </div>
              </div>
              {child.hasDeep ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-success"><Sparkles className="h-3.5 w-3.5" />Deep report available</div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400"><Activity className="h-3.5 w-3.5" />Basic report only</div>
              )}
            </div>
          ))}
        </div>
      )}

      {data.recentActivity.length > 0 && (
        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300"><History className="h-4 w-4" />Recent Activity</h3>
          <div className="space-y-3">
            {data.recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-neutral-900 dark:text-white">{a.action}</p>
                  <span className="text-xs text-neutral-500">{formatDate(a.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
