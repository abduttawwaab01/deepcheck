"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Settings</h1>
        <Button size="sm"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">System Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Application Name</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="Deep Check" disabled />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Support Email</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="support@deepcheck.app" disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Platform URL</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="https://deepcheck.app" disabled />
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
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="smtp.sendgrid.net" disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">SMTP Port</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="587" disabled />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">From Address</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="noreply@deepcheck.app" disabled />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-primary-600" defaultChecked disabled />
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
              <select className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" disabled>
                <option>NGN (&#8358;)</option>
                <option>USD ($)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Tax Rate (%)</label>
              <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="7.5" disabled />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-500">Payment Gateway API Key</label>
            <input className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value="sk_live_••••••••••••••••" disabled type="password" />
          </div>
        </div>
        <div className="mt-4 text-xs text-neutral-400">Contact your developer to modify these settings.</div>
      </div>
    </div>
  );
}
