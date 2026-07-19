"use client";

import { trpc } from "@/lib/trpc/client";
import { Building2, Mail, Phone, MapPin, CreditCard, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { data, isLoading } = trpc.school.getDashboard.useQuery();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">School Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your school profile and subscription</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">School Profile</h2>
        </div>
        {isLoading ? (
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-[44px] animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />)}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">School Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input disabled value={data?.name || ""} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input disabled value="admin@gracefield.ng" className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input disabled value="+234 801 234 5678" className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input disabled value="42 Education Road, Lagos" className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Subscription</h2>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">Current Plan</div>
              <div className="text-xs text-neutral-500">School Term License</div>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-success"><ShieldCheck className="h-4 w-4" /> Active</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">Report Credits</div>
              <div className="text-xs text-neutral-500">Remaining this term</div>
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{data?.reportCreditsRemaining ?? 0} / 10</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">Next Billing</div>
              <div className="text-xs text-neutral-500">Term starts Sep 2026</div>
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">₦150,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
