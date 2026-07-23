"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, MapPin, CreditCard, ShieldCheck, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.school.getSettings.useQuery();
  const updateSettings = trpc.school.updateSettings.useMutation({
    onSuccess: () => { utils.school.getSettings.invalidate(); },
  });

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const result = await updateSettings.mutateAsync(form);
      if (result.success) {
        setSuccess("School profile updated successfully");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(result.message || "Failed to update");
      }
    } catch (e: any) {
      setError(e?.message || "An error occurred");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">School Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your school profile and subscription</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 p-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 p-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}

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
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
              </div>
            </div>
          </div>
        )}
        <Button size="sm" className="mt-4" loading={updateSettings.isPending} onClick={handleSave}>
          <Save className="mr-1.5 h-4 w-4" /> Save Changes
        </Button>
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
              <div className="text-xs text-neutral-500 capitalize">{data?.subscriptionStatus || "free"}</div>
            </div>
            <span className={`flex items-center gap-1 text-sm font-medium ${data?.subscriptionStatus === "active" ? "text-success" : "text-neutral-500"}`}>
              <ShieldCheck className="h-4 w-4" /> {data?.subscriptionStatus === "active" ? "Active" : data?.subscriptionStatus || "Free"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">Report Credits</div>
              <div className="text-xs text-neutral-500">Coins remaining</div>
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{data?.deepReportCredits ?? 0}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">Students</div>
              <div className="text-xs text-neutral-500">Active enrollment</div>
            </div>
            <span className="text-sm font-bold text-neutral-900 dark:text-white">{data?.studentCount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
