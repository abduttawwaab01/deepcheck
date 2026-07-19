"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { UserPlus, Users, Mail, CalendarDays, ClipboardCheck, X, User } from "lucide-react";

export default function ParentChildrenPage() {
  const { data: children, isLoading } = trpc.parent.getChildren.useQuery();
  const addChild = trpc.parent.addChild.useMutation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", relationship: "" });

  const handleAdd = async () => {
    await addChild.mutateAsync(form);
    setOpen(false);
    setForm({ firstName: "", lastName: "", email: "", relationship: "" });
  };

  if (isLoading) return <div className="animate-fade-in space-y-4">{[1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>;

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">My Children</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage linked children</p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5 min-h-[44px]"><UserPlus className="h-4 w-4" /><span className="hidden sm:inline">Add Child</span></Button>
      </div>

      {(!children || children.length === 0) ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-8 text-center">
          <Users className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No children linked. Tap Add Child to link your first child.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((child) => (
            <div key={child.id} className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-700 dark:bg-secondary-950 dark:text-secondary-300">
                  {child.name.split(" ").map(s => s[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{child.name}</h3>
                  <div className="mt-1.5 space-y-1">
                    <p className="flex items-center gap-1.5 text-xs text-neutral-500"><Mail className="h-3.5 w-3.5" />{child.email}</p>
                    <p className="flex items-center gap-1.5 text-xs text-neutral-500"><User className="h-3.5 w-3.5" />{child.relationship}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs text-neutral-500"><ClipboardCheck className="h-3.5 w-3.5" />{child.assessments} assessments</span>
                      <span className="flex items-center gap-1 text-xs text-neutral-500"><CalendarDays className="h-3.5 w-3.5" />Last active {formatDate(child.lastActive)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-6 dark:bg-neutral-900 animate-slide-up">
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 p-2 text-neutral-400"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Link a Child</h2>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                    style={{ minHeight: "44px" }} placeholder="Adeola" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                    style={{ minHeight: "44px" }} placeholder="Ogunlesi" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Child&apos;s Email</label>
                <input value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                  style={{ minHeight: "44px" }} placeholder="adeola@school.edu.ng" type="email" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Relationship</label>
                <select value={form.relationship} onChange={(e) => setForm(p => ({ ...p, relationship: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                  style={{ minHeight: "44px" }}>
                  <option value="">Select relationship</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
              <Button onClick={handleAdd} loading={addChild.isPending} className="w-full min-h-[44px] gap-1.5"><UserPlus className="h-4 w-4" />Link Child</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
