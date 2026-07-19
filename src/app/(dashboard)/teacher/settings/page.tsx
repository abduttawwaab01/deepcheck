"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Mail, BookOpen, School, KeyRound, Eye, EyeOff, Save, Trash2 } from "lucide-react";

export default function TeacherSettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const profile = {
    name: "Chioma Okafor",
    email: "chioma.okafor@gracefield.edu.ng",
    subject: "Mathematics",
    school: "Gracefield College",
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your profile and account settings</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Profile Information</h2>
        </div>
        <div className="mt-4 space-y-4">
          {[
            { label: "Full Name", value: profile.name, icon: User },
            { label: "Email Address", value: profile.email, icon: Mail },
            { label: "Subject", value: profile.subject, icon: BookOpen },
            { label: "School", value: profile.school, icon: School },
          ].map((field) => (
            <div key={field.label}>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="text" value={field.value} disabled
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-500 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                  style={{ minHeight: "44px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">Change Password</h2>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Current Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                style={{ minHeight: "44px" }} placeholder="Enter current password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-neutral-400"
                style={{ minHeight: "44px", minWidth: "44px" }}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">New Password</label>
              <input type="password" value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                style={{ minHeight: "44px" }} placeholder="Enter new password" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Confirm New Password</label>
              <input type="password" value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                style={{ minHeight: "44px" }} placeholder="Confirm new password" />
            </div>
          </div>
          <Button className="gap-2 min-h-[44px]"><KeyRound className="h-4 w-4" /> Update Password</Button>
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
