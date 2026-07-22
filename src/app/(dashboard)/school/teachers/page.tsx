"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, BookOpen, CheckCircle2, Clock, UserPlus, X } from "lucide-react";

export default function TeachersPage() {
  const { data: teachers, isLoading } = trpc.school.getTeachers.useQuery();
  const invite = trpc.school.inviteTeacher.useMutation();
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", subject: "" });

  const handleInvite = async () => {
    await invite.mutateAsync(form);
    setShowInvite(false);
    setForm({ email: "", firstName: "", lastName: "", subject: "" });
  };

  if (isLoading) return (
    <div className="animate-fade-in space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Teachers</h1>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setShowInvite(true)}><UserPlus className="mr-1.5 h-4 w-4" /> Invite Teacher</Button>
      </div>

      {showInvite && (
        <div className="glass rounded-2xl border border-primary-200 p-4 dark:border-primary-800">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Invite New Teacher</h3>
            <button onClick={() => setShowInvite(false)} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 min-h-[44px] min-w-[44px]"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
          </div>
          <Button size="sm" className="mt-3" loading={invite.isPending} onClick={handleInvite}>Send Invitation</Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teachers?.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-4 transition-all hover:shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600 dark:bg-primary-950">{t.name.charAt(0)}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-neutral-900 dark:text-white">{t.name}</div>
                <div className="flex items-center gap-1 text-xs text-neutral-500"><Mail className="h-3 w-3" /> {t.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400"><BookOpen className="h-3.5 w-3.5" /> {t.subject}</div>
              <div className="flex items-center gap-2">
                <span className={cn("flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium", t.assessed ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                  {t.assessed ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{t.assessed ? "Assessed" : "Pending"}
                </span>
                <span className={cn("rounded-lg px-2 py-0.5 text-xs font-medium", t.status === "active" ? "bg-success/10 text-success" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800")}>{t.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
