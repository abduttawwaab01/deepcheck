"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, Mail, KeyRound, Eye, EyeOff, Bell, Smartphone, CreditCard, Trash2 } from "lucide-react";

export default function ParentSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [toggles, setToggles] = useState({ email: true, whatsapp: false });

  const Toggle = ({ label, desc, icon: Icon, checked, onChange }: { label: string; desc: string; icon: any; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="h-5 w-5 shrink-0 text-primary-600" />
        <div className="min-w-0"><p className="text-sm font-medium text-neutral-900 dark:text-white">{label}</p><p className="text-xs text-neutral-500">{desc}</p></div>
      </div>
      <button onClick={() => onChange(!checked)}
        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors", checked ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700")}>
        <span className={cn("inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );

  const profile = { name: "Ngozi Ogunlesi", email: "ngozi.ogunlesi@email.com" };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your account settings</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 sm:text-base dark:text-white"><User className="h-5 w-5 text-primary-600" />Profile Information</h2>
        <div className="mt-4 space-y-4">
          <div><label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Full Name</label>
            <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input type="text" value={profile.name} disabled className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" style={{ minHeight: "44px" }} /></div></div>
          <div><label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Email Address</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input type="text" value={profile.email} disabled className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" style={{ minHeight: "44px" }} /></div></div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 sm:text-base dark:text-white"><Bell className="h-5 w-5 text-primary-600" />Notification Preferences</h2>
        <div className="mt-4 space-y-4">
          <Toggle label="Email Notifications" desc="Receive report updates via email" icon={Bell} checked={toggles.email} onChange={(v) => setToggles(p => ({ ...p, email: v }))} />
          <Toggle label="WhatsApp Alerts" desc="Get instant alerts on WhatsApp" icon={Smartphone} checked={toggles.whatsapp} onChange={(v) => setToggles(p => ({ ...p, whatsapp: v }))} />
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 sm:text-base dark:text-white"><CreditCard className="h-5 w-5 text-primary-600" />Payment Methods</h2>
        <p className="mt-2 text-xs text-neutral-500">No payment methods added yet. Deep reports are billed to your account.</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 sm:text-base dark:text-white"><KeyRound className="h-5 w-5 text-primary-600" />Change Password</h2>
        <div className="mt-4 space-y-4">
          <div><label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Current Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={passwords.current} onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                style={{ minHeight: "44px" }} placeholder="Enter current password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-neutral-400" style={{ minHeight: "44px", minWidth: "44px" }}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">New Password</label>
              <input type="password" value={passwords.new} onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                style={{ minHeight: "44px" }} placeholder="Enter new password" /></div>
            <div><label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Confirm Password</label>
              <input type="password" value={passwords.confirm} onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                style={{ minHeight: "44px" }} placeholder="Confirm new password" /></div>
          </div>
          <Button className="gap-2 min-h-[44px]"><KeyRound className="h-4 w-4" />Update Password</Button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-error/30 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-error" />
          <h2 className="text-sm font-semibold text-error sm:text-base">Delete Account</h2>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Permanently delete your account. This removes all data and cannot be undone.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="flex-1 rounded-xl border border-error/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-error dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
            placeholder='Type "DELETE" to confirm'
          />
          <Button className="min-h-[44px] gap-2 shrink-0 bg-error hover:bg-error/90">
            <Trash2 className="h-4 w-4" />Delete My Account
          </Button>
        </div>
      </div>
    </div>
  );
}
