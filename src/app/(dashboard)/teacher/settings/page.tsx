"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { User, Mail, BookOpen, School, KeyRound, Eye, EyeOff, Trash2 } from "lucide-react";

export default function TeacherSettingsPage() {
  const { data: profile, isLoading } = trpc.teacher.getProfile.useQuery();
  const deleteAccount = trpc.teacher.deleteAccount.useMutation({
    onSuccess: () => { window.location.href = "/login"; },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function handlePasswordChange() {
    setPwError("");
    setPwSuccess("");
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPwError("All fields are required.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwords.new.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Failed to change password.");
      } else {
        setPwSuccess("Password updated successfully.");
        setPasswords({ current: "", new: "", confirm: "" });
      }
    } catch {
      setPwError("Something went wrong. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }

  function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") {
      setDeleteError('Type "DELETE" exactly to confirm.');
      return;
    }
    setDeleteError("");
    deleteAccount.mutate({ confirmation: "DELETE" });
  }

  if (isLoading) return (
    <div className="animate-fade-in space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-48 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );

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
            { label: "Full Name", value: profile ? `${profile.firstName} ${profile.lastName}` : "", icon: User },
            { label: "Email Address", value: profile?.email || "", icon: Mail },
            { label: "Subject", value: profile?.subject || "", icon: BookOpen },
            { label: "School", value: profile?.schoolName || "", icon: School },
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
          {pwError && <p className="text-xs text-error">{pwError}</p>}
          {pwSuccess && <p className="text-xs text-success">{pwSuccess}</p>}
          <Button onClick={handlePasswordChange} disabled={pwLoading} className="gap-2 min-h-[44px]">
            <KeyRound className="h-4 w-4" /> {pwLoading ? "Updating..." : "Update Password"}
          </Button>
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
            value={deleteConfirm}
            onChange={e => setDeleteConfirm(e.target.value)}
            className="flex-1 rounded-xl border border-error/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-error dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
            placeholder='Type "DELETE" to confirm'
          />
          {deleteError && <p className="text-xs text-error sm:col-span-2">{deleteError}</p>}
          <Button onClick={handleDeleteAccount} disabled={deleteAccount.isPending}
            className="min-h-[44px] gap-2 shrink-0 bg-error hover:bg-error/90">
            <Trash2 className="h-4 w-4" />{deleteAccount.isPending ? "Deleting..." : "Delete My Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
