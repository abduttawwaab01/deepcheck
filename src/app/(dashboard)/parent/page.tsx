"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, Activity, Sparkles, TrendingUp, Clock, History, Coins, BarChart3, ArrowRight, Heart } from "lucide-react";

export default function ParentDashboardPage() {
  const { data } = trpc.parent.getDashboard.useQuery();
  if (!data) return <div className="animate-fade-in space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>;

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="break-words text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Welcome, {data.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Here&apos;s your children&apos;s progress</p>
        </div>
        <Link href="/pricing" className="shrink-0">
          <div className="flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1.5 text-xs font-medium text-secondary-700 transition-colors hover:bg-secondary-100 dark:bg-secondary-950 dark:text-secondary-300 dark:hover:bg-secondary-900">
            <Sparkles className="h-3.5 w-3.5" />{data.deepReportCredits} credits &middot; Buy More
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/parent/assessment" className="group">
          <div className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Parenting Assessment</span>
            <span className="text-[10px] text-neutral-400">Evaluate your parenting style</span>
          </div>
        </Link>
        <Link href="/pricing" className="group">
          <div className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
              <Coins className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Buy Coins</span>
            <span className="text-[10px] text-neutral-400">Get more deep reports</span>
          </div>
        </Link>
      </div>

      {data.children.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-8 text-center">
          <Users className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No children linked yet. Add a child to get started.</p>
          <Link href="/parent/children">
            <Button size="sm" className="mt-4 gap-1.5"><Users className="h-4 w-4" />Link a Child</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Your Children</h2>
            <Link href="/parent/children" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
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
              <div className="mt-2 flex items-center gap-2">
                {child.hasDeep ? (
                  <span className="flex items-center gap-1 text-xs text-success"><Sparkles className="h-3 w-3" />Deep report available</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-neutral-400"><Activity className="h-3 w-3" />Basic report only</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <Link href={`/parent/children/${child.id}/early-warning`}>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" />View Progress
                  </Button>
                </Link>
                <Link href={`/parent/reports`}>
                  <Button size="sm" variant="ghost" className="gap-1.5">
                    <Activity className="h-3.5 w-3.5" />Reports
                  </Button>
                </Link>
              </div>
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
