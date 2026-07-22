"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Mail, ClipboardCheck, Clock, X } from "lucide-react";

export default function StudentsPage() {
  const { data: students, isLoading } = trpc.school.getStudents.useQuery();
  const register = trpc.school.registerStudent.useMutation();
  const [search, setSearch] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "" });

  const filtered = students?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = async () => {
    await register.mutateAsync(form);
    setShowRegister(false);
    setForm({ email: "", firstName: "", lastName: "" });
  };

  if (isLoading) return (
    <div className="animate-fade-in space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-11 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Students</h1>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setShowRegister(true)}><UserPlus className="mr-1.5 h-4 w-4" /> Register</Button>
      </div>

      {showRegister && (
        <div className="glass rounded-2xl border border-primary-200 p-4 dark:border-primary-800">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Register Student</h3>
            <button onClick={() => setShowRegister(false)} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 min-h-[44px] min-w-[44px]"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
          </div>
          <Button size="sm" className="mt-3" loading={register.isPending} onClick={handleRegister}>Register Student</Button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-10 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered?.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-4 transition-all hover:shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-sm font-bold text-secondary-600 dark:bg-secondary-950">{s.name.charAt(0)}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-neutral-900 dark:text-white">{s.name}</div>
                <div className="flex items-center gap-1 text-xs text-neutral-500"><Mail className="h-3 w-3" /> {s.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1"><ClipboardCheck className="h-3.5 w-3.5" /> {s.assessments} assessments</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.lastActive}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
