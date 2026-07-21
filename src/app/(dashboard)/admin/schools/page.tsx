"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Shield, Crown, Eye, CheckCircle2, XCircle, Trash2, Settings2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  verified: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-error/10 text-error",
};

const subColors: Record<string, string> = {
  premium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  pro: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  basic: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  enterprise: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  free: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800",
};

export default function AdminSchoolsPage() {
  const utils = trpc.useUtils();
  const { data: schools, isLoading } = trpc.admin.getSchools.useQuery();
  const [viewSchool, setViewSchool] = useState<any>(null);
  const [creditInput, setCreditInput] = useState("0");

  const verifyMutation = trpc.admin.verifySchool.useMutation({ onSuccess: () => { utils.admin.getSchools.invalidate(); setViewSchool(null); } });
  const creditsMutation = trpc.admin.updateSchoolCredits.useMutation({ onSuccess: () => { utils.admin.getSchools.invalidate(); setViewSchool(null); } });
  const subMutation = trpc.admin.updateSchoolSubscription.useMutation({ onSuccess: () => { utils.admin.getSchools.invalidate(); setViewSchool(null); } });
  const toggleMutation = trpc.admin.toggleSchoolActive.useMutation({ onSuccess: () => { utils.admin.getSchools.invalidate(); setViewSchool(null); } });
  const deleteMutation = trpc.admin.deleteSchool.useMutation({ onSuccess: () => { utils.admin.getSchools.invalidate(); setViewSchool(null); } });

  if (isLoading) return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Schools</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <div key={i} className="h-36 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Schools</h1>
        <span className="text-xs text-neutral-400">{schools?.length || 0} schools</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(!schools || schools.length === 0) ? (
          <div className="col-span-full py-8 text-center text-sm text-neutral-500">No schools registered yet</div>
        ) : schools.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">{s.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin className="h-3 w-3" /> {s.city || "—"}, {s.state || "—"}
                </div>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[s.status || "pending"])}>
                {s.status === "verified" ? <><Shield className="inline h-3 w-3 mr-1" />Verified</> : s.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {s.students || 0} students</div>
              <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {s.teachers || 0} teachers</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={cn("flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", subColors[s.subscription || "free"])}>
                <Crown className="h-3 w-3" /> {s.subscription}
              </span>
              <Button variant="outline" size="sm" onClick={() => { setViewSchool(s); setCreditInput(String(s.credits || 0)); }}>
                <Eye className="mr-1 h-3.5 w-3.5" /> View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {viewSchool && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{viewSchool.name}</h3>
                <p className="text-xs text-neutral-500">{viewSchool.city}, {viewSchool.state} &middot; {viewSchool.schoolType || "N/A"}</p>
              </div>
              <button onClick={() => setViewSchool(null)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">✕</button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <label className="text-xs font-medium text-neutral-500">Students</label>
                <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{viewSchool.students || 0}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <label className="text-xs font-medium text-neutral-500">Teachers</label>
                <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{viewSchool.teachers || 0}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Verification Status</label>
                <div className="flex gap-2">
                  {(["verified", "pending", "rejected"] as const).map((s) => (
                    <button key={s} onClick={() => verifyMutation.mutate({ schoolId: viewSchool.id, status: s })}
                      className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        viewSchool.status === s ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400")}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Subscription Tier</label>
                <div className="flex flex-wrap gap-2">
                  {(["free", "basic", "pro", "enterprise"] as const).map((s) => (
                    <button key={s} onClick={() => subMutation.mutate({ schoolId: viewSchool.id, status: s })}
                      className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        viewSchool.subscription === s ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400")}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Deep Report Credits</label>
                <div className="flex gap-2">
                  <input type="number" className="w-24 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    value={creditInput} onChange={(e) => setCreditInput(e.target.value)} min={0} max={9999} />
                  <Button size="sm" onClick={() => creditsMutation.mutate({ schoolId: viewSchool.id, credits: Number(creditInput) || 0 })} disabled={creditsMutation.isPending}>
                    <CreditCard className="mr-1 h-3.5 w-3.5" /> Set Credits
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600"
                  checked={!!viewSchool.isActive} onChange={(e) => toggleMutation.mutate({ schoolId: viewSchool.id, isActive: e.target.checked })} />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Active (school can log in and operate)</span>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setViewSchool(null)}>Close</Button>
              <Button variant="outline" className="flex-1 text-error hover:bg-error/10" onClick={() => {
                if (confirm(`Delete "${viewSchool.name}"? This cannot be undone.`)) deleteMutation.mutate({ schoolId: viewSchool.id });
              }}>
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
