"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User, KeyRound, Bell, Globe, AlertTriangle,
  Eye, EyeOff, Mail, Download, Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const [showPw, setShowPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const toggles = [
    { id: "n1", label: "Assessment Reminders", on: true },
    { id: "n2", label: "New Recommendations", on: true },
    { id: "n3", label: "Progress Updates", on: false },
    { id: "n4", label: "Study Tips & Resources", on: false },
  ];

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your account preferences</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Profile Information</h2>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Full Name</label>
            <input type="text" value="Adeola Samuel" disabled
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-500 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input type="email" value="adeola.samuel@example.com" disabled
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Change Password</h2>
        </div>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Current Password</label>
            <input type={showPw ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 text-neutral-400 min-h-[44px] min-w-[44px] flex items-center justify-center">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
          </div>
          <Button className="min-h-[44px] gap-2"><KeyRound className="h-4 w-4" />Update Password</Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Notification Preferences</h2>
        </div>
        <div className="mt-4 space-y-3">
          {toggles.map(t => (
            <div key={t.id} className="flex items-center justify-between">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{t.label}</span>
              <div className={cn("flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors", t.on ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700")}>
                <div className={cn("h-5 w-5 rounded-full bg-white shadow-sm transition-transform", t.on ? "translate-x-5" : "translate-x-0.5")} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Language</h2>
        </div>
        <div className="mt-4">
          <select className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
            <option>English</option><option>Yoruba</option><option>Hausa</option><option>Igbo</option><option>French</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-2xl border border-error/20 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-error" />
          <h2 className="text-sm font-semibold text-error sm:text-base">Data & Account</h2>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">Request a complete export of all your data</p>
          <Button variant="outline" className="min-h-[44px] gap-2 shrink-0">
            <Download className="h-4 w-4" />Request Data Export
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-error/30 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-error" />
          <h2 className="text-sm font-semibold text-error sm:text-base">Delete Account</h2>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Permanently delete your account and all associated data. This action cannot be undone.
          All your assessments, reports, and progress will be lost.
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
