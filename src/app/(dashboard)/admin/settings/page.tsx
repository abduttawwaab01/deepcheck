"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { data: config, isLoading, refetch } = trpc.admin.getSystemConfig.useQuery();
  const updateMutation = trpc.admin.updateSystemConfig.useMutation();
  const [form, setForm] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (config) setForm({ ...config });
  }, [config]);

  const handleSave = async () => {
    setSaved(false);
    setError("");
    try {
      await updateMutation.mutateAsync(form);
      setSaved(true);
      refetch();
    } catch (err: any) {
      setError(err?.message || "Failed to save settings. Please try again.");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Settings</h1>
        <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {saved && <div className="rounded-xl bg-success/10 px-4 py-2 text-sm text-success">Settings saved successfully.</div>}
      {error && <div className="rounded-xl bg-error/10 px-4 py-2 text-sm text-error">{error}</div>}

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">System Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Application Name</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.appName || ""} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Support Email</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.supportEmail || ""} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Platform URL</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.platformUrl || ""} onChange={(e) => setForm({ ...form, platformUrl: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email Settings</h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">SMTP Host</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.smtpHost || ""} onChange={(e) => setForm({ ...form, smtpHost: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">SMTP Port</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.smtpPort || ""} onChange={(e) => setForm({ ...form, smtpPort: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">From Address</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.fromAddress || ""} onChange={(e) => setForm({ ...form, fromAddress: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600"
              checked={!!form.sendTransactional} onChange={(e) => setForm({ ...form, sendTransactional: e.target.checked })} />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Send transactional emails</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Payment Settings</h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Currency</label>
              <select className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.currency || "NGN"} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Tax Rate (%)</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.taxRate || ""} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Payment Gateway API Key</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.paymentGatewayKey || ""} onChange={(e) => setForm({ ...form, paymentGatewayKey: e.target.value })} type="password" />
          </div>
        </div>
      </div>
    </div>
  );
}
