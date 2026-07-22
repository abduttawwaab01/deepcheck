"use client";

import { trpc } from "@/lib/trpc/client";
import { Users, School, ClipboardCheck, Wallet, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: s } = trpc.admin.getDashboardStats.useQuery();

  if (!s) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>;

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const cards = [
    { label: "Total Users", value: fmt(s.totalUsers), icon: Users, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-950/30" },
    { label: "Schools", value: fmt(s.totalSchools), icon: School, color: "text-secondary-600", bg: "bg-secondary-50 dark:bg-secondary-950/30" },
    { label: "Questions", value: fmt(s.questionCount), icon: ClipboardCheck, color: "text-success", bg: "bg-success/5" },
    { label: "Pending Reports", value: fmt(s.pendingReports), icon: Wallet, color: "text-warning", bg: "bg-warning/5" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-success" />
          <span className="text-success">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-4">
            <div className={`${c.bg} flex h-10 w-10 items-center justify-center rounded-xl`}>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white">{c.value}</div>
            <div className="text-xs text-neutral-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Sections</h3>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Question Banks</span><span className="font-semibold">{s.bankCount}</span></div>
            <div className="flex justify-between text-sm"><span>Section Configs</span><span className="font-semibold">{s.sectionCount}</span></div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Pending Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-info" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{s.pendingReports} reports pending generation</span>
              </div>
              <span className="text-xs text-neutral-400">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
