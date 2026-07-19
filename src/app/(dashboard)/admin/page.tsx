"use client";

import { trpc } from "@/lib/trpc/client";
import { Users, School, ClipboardCheck, Wallet, TrendingUp, Clock, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats } = trpc.admin.getDashboardStats.useQuery();

  const s = {
    totalUsers: "12,847",
    totalSchools: "534",
    totalAssessments: "50,239",
    totalRevenue: "₦4.2M",
    pendingReports: 3,
    questionCount: 1458,
    userGrowth: [65,72,68,85,90,82,78,88,92,95,88,85,80,78,82,88,92,98,102,108,95,88,92,96,100,105,110,108,112,118],
    ...stats,
  };

  const cards = [
    { label: "Total Users", value: s.totalUsers, change: "+12%", icon: Users, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-950/30" },
    { label: "Schools", value: s.totalSchools, change: "+8%", icon: School, color: "text-secondary-600", bg: "bg-secondary-50 dark:bg-secondary-950/30" },
    { label: "Assessments", value: s.totalAssessments, change: "+22%", icon: ClipboardCheck, color: "text-success", bg: "bg-success/5" },
    { label: "Revenue (MTD)", value: s.totalRevenue, change: "+18%", icon: Wallet, color: "text-warning", bg: "bg-warning/5" },
  ];

  const maxGrowth = Math.max(...s.userGrowth);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4 text-success" />
          <span className="text-success">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className={`${c.bg} flex h-10 w-10 items-center justify-center rounded-xl`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <span className="text-xs font-medium text-success">{c.change}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white">{c.value}</div>
            <div className="text-xs text-neutral-500">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">User Growth (30 Days)</h3>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="flex h-48 items-end gap-1">
            {s.userGrowth.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-primary-500 to-secondary-500 transition-all hover:from-primary-600" style={{ height: `${(h / maxGrowth) * 100}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-neutral-400">
            <span>May 15</span>
            <span>Jun 15</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Pending Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-3 dark:border-red-900 dark:bg-red-950/30">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-error" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">12 schools pending verification</span>
              </div>
              <span className="text-xs text-neutral-400">Action needed</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-yellow-100 bg-yellow-50/50 p-3 dark:border-yellow-900 dark:bg-yellow-950/30">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{s.questionCount} questions pending review</span>
              </div>
              <span className="text-xs text-neutral-400">3 days old</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-info" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{s.pendingReports} reports scheduled for generation</span>
              </div>
              <span className="text-xs text-neutral-400">Tomorrow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { school: "Gracefield College", amount: "₦150,000", item: "School Credits", status: "Completed" },
            { school: "Mrs. Adeyemi", amount: "₦3,000", item: "Deep Report", status: "Completed" },
            { school: "Excel College", amount: "₦450,000", item: "Annual License", status: "Completed" },
            { school: "Dr. Eze", amount: "₦10,000", item: "Parent Bundle (5)", status: "Completed" },
          ].map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
              <div>
                <div className="text-sm font-medium text-neutral-900 dark:text-white">{t.school}</div>
                <div className="text-xs text-neutral-500">{t.item}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{t.amount}</span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
