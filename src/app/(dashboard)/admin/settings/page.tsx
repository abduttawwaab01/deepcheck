"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Save, Loader2, Shield, CreditCard, Bell, Mail, Globe, Key, Coins, Landmark, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { data: config, isLoading, refetch } = trpc.admin.getSystemConfig.useQuery();
  const updateMutation = trpc.admin.updateSystemConfig.useMutation();
  const [form, setForm] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (config) setForm({ ...config }); }, [config]);

  useEffect(() => {
    if (saved) { const t = setTimeout(() => setSaved(false), 3000); return () => clearTimeout(t); }
  }, [saved]);

  const handleSave = async () => {
    setSaved(false); setError("");
    try {
      const payload: any = { ...form };
      payload.pricePerCoin = Number(payload.pricePerCoin);
      payload.coinsPerReport = Number(payload.coinsPerReport);
      await updateMutation.mutateAsync(payload);
      setSaved(true);
      refetch();
    } catch (err: any) { setError(err?.message || "Failed to save settings."); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Admin Settings</h1>
        <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="w-full sm:w-auto">
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {saved && <div className="rounded-xl bg-success/10 px-4 py-2 text-sm text-success">Settings saved successfully.</div>}
      {error && <div className="rounded-xl bg-error/10 px-4 py-2 text-sm text-error">{error}</div>}

      {/* System Configuration */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">System Configuration</h3>
        </div>
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

      {/* Pricing Configuration */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Pricing Configuration</h3>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Price Per Coin (₦)</label>
              <input type="number" min={100} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.pricePerCoin || 2000} onChange={(e) => setForm({ ...form, pricePerCoin: e.target.value })} />
              <p className="mt-1 text-[11px] text-neutral-400">Default: 2000. This is the price users pay per coin.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Coins Per Deep Report</label>
              <input type="number" min={1} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.coinsPerReport || 1} onChange={(e) => setForm({ ...form, coinsPerReport: e.target.value })} />
              <p className="mt-1 text-[11px] text-neutral-400">Default: 1. How many coins are deducted per deep report.</p>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Bundle 20 Coins price is fixed at ₦35,000 (₦1,750/coin). Users see these prices on the /pricing page.
          </div>
        </div>
      </div>

      {/* Bank Transfer Settings */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Landmark className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Bank Transfer Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Account Name</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.bankAccountName || ""} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Account Number</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.bankAccountNumber || ""} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Bank Name</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                value={form.bankName || ""} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email Settings</h3>
        </div>
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

      {/* Payment Settings */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Payment Settings</h3>
        </div>
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
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Paystack Secret Key</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.paymentGatewayKey || ""} onChange={(e) => setForm({ ...form, paymentGatewayKey: e.target.value })} type="password" />
            <p className="mt-1 text-[11px] text-neutral-400">Used for Paystack payment verification. Never shared with clients.</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Notification Settings</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "notifyOnNewRegistration", label: "Email on new user registration" },
            { key: "notifyOnReportRequest", label: "Email on new deep report request" },
            { key: "notifyOnPayment", label: "Email on successful payment" },
            { key: "notifyOnSchoolSignup", label: "Email when a new school registers" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600"
                checked={!!form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Security</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Minimum Password Length</label>
            <input type="number" className="w-32 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              value={form.minPasswordLength || "8"} onChange={(e) => setForm({ ...form, minPasswordLength: e.target.value })} min={6} max={32} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600"
              checked={!!form.requireEmailVerification} onChange={(e) => setForm({ ...form, requireEmailVerification: e.target.checked })} />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Require email verification for new accounts</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600"
              checked={!!form.enable2FA} onChange={(e) => setForm({ ...form, enable2FA: e.target.checked })} />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Enable two-factor authentication (coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
