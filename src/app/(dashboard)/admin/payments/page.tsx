"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNaira, formatDate } from "@/lib/utils";

const demoPayments = [
  { id: "PAY001", user: "Gracefield College", email: "billing@gracefield.edu", amount: 150000, item: "School Credits", status: "completed", date: "2026-07-18" },
  { id: "PAY002", user: "Mrs. Adeyemi", email: "adeyemi@parent.com", amount: 3000, item: "Deep Report", status: "completed", date: "2026-07-17" },
  { id: "PAY003", user: "Excel College", email: "admin@excelcollege.edu", amount: 450000, item: "Annual License", status: "completed", date: "2026-07-15" },
  { id: "PAY004", user: "Dr. Eze", email: "eze@parent.com", amount: 10000, item: "Parent Bundle (5)", status: "completed", date: "2026-07-14" },
  { id: "PAY005", user: "Royal Academy", email: "finance@royalacademy.edu", amount: 75000, item: "Monthly Credits", status: "pending", date: "2026-07-13" },
  { id: "PAY006", user: "Bright Future Schools", email: "bursary@bfs.edu", amount: 250000, item: "Term License", status: "failed", date: "2026-07-12" },
  { id: "PAY007", user: "Golden Star Academy", email: "accounts@goldenstar.edu", amount: 30000, item: "Assessment Credits", status: "completed", date: "2026-07-10" },
  { id: "PAY008", user: "Summit College", email: "billing@summit.edu", amount: 180000, item: "Annual License", status: "completed", date: "2026-07-08" },
];

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-error/10 text-error",
  refunded: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800",
};

export default function AdminPaymentsPage() {
  const { data: _ } = trpc.admin.getPaymentHistory.useQuery();
  const [search, setSearch] = useState("");

  const filtered = demoPayments.filter((p) =>
    !search || p.user.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payment History</h1>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
          placeholder="Search by name or email..."
        />
      </div>

      <div className="hidden sm:block overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900">
              <th className="px-4 py-3 text-left font-medium text-neutral-500">User</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Item</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map((p) => (
              <tr key={p.id} className="bg-white transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900 dark:text-white">{p.user}</div>
                  <div className="text-xs text-neutral-500">{p.email}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">{formatNaira(p.amount)}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.item}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{formatDate(p.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {filtered.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-neutral-900 dark:text-white">{p.user}</div>
              <span className="font-semibold text-neutral-900 dark:text-white">{formatNaira(p.amount)}</span>
            </div>
            <div className="mt-1 text-xs text-neutral-500">{p.email} &middot; {p.item}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
              <span className="text-xs text-neutral-400">{formatDate(p.date)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-neutral-400">{filtered.length} transaction(s)</div>
    </div>
  );
}
