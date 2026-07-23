"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Users, GraduationCap, ClipboardCheck, Sparkles, Award, CheckCircle2, Clock, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SchoolDashboardPage() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.school.getDashboard.useQuery();
  const createSchool = trpc.school.createSchool.useMutation({
    onSuccess: () => { utils.school.getDashboard.invalidate(); utils.school.getSettings.invalidate(); },
  });

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", state: "", email: "", phone: "", schoolType: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (isLoading) return (
    <div className="animate-fade-in space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}
      </div>
    </div>
  );

  if (!data && !showCreate) return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950">
        <Building2 className="h-8 w-8 text-primary-600" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">No School Registered</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        Create your school to start managing teachers, students, and assessments.
      </p>
      <Button className="mt-6" onClick={() => setShowCreate(true)}>
        <Building2 className="mr-1.5 h-4 w-4" /> Create School
      </Button>
    </div>
  );

  if (showCreate) return (
    <div className="animate-fade-in mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Create Your School</h1>
        <p className="mt-1 text-sm text-neutral-500">Set up your school profile to get started.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 p-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 p-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}

      <div className="glass rounded-2xl p-5">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">School Name *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Lagos Grammar School"
                className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">City</label>
              <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="Lagos"
                className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">State</label>
              <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="Lagos State"
                className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="admin@school.com"
                className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">Phone</label>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="08012345678"
                className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">School Type</label>
            <select value={form.schoolType} onChange={(e) => setForm((f) => ({ ...f, schoolType: e.target.value }))}
              className="min-h-[44px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
              <option value="">Select type</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="tertiary">Tertiary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button className="flex-1" loading={createSchool.isPending} onClick={async () => {
            setError(""); setSuccess("");
            if (!form.name.trim()) { setError("School name is required"); return; }
            try {
              const result = await createSchool.mutateAsync(form);
              if (result.success) {
                setSuccess(result.message);
                setTimeout(() => setShowCreate(false), 1500);
              } else {
                setError(result.message || "Failed to create school");
              }
            } catch (e: any) {
              setError(e?.message || "An error occurred");
            }
          }}>Create School</Button>
        </div>
      </div>
    </div>
  );

  if (!data) return null;

  const stats = [
    { label: "Students", value: data.studentCount, icon: Users, color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-950" },
    { label: "Teachers", value: data.teacherCount, icon: GraduationCap, color: "text-secondary-600", bg: "bg-secondary-50 dark:bg-secondary-950" },
    { label: "Assessments", value: data.assessmentsTaken, icon: ClipboardCheck, color: "text-success", bg: "bg-success/5" },
    { label: "Deep Reports", value: data.deepReportsGenerated, icon: Sparkles, color: "text-warning", bg: "bg-warning/5" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{data.name}</h1>
          <p className="text-sm text-neutral-500">{data.city}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-3 py-2">
          <Award className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-warning">{data.reportCreditsRemaining} credits remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", s.bg)}>
              <s.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", s.color)} />
            </div>
            <div className="mt-2 text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{s.value}</div>
            <div className="text-xs text-neutral-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recent Assessments</h3>
          <div className="space-y-2">
            {data.recentAssessments.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900 dark:text-white">{a.student}</div>
                  <div className="text-xs text-neutral-500">{a.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-bold", a.score >= 60 ? "text-success" : a.score >= 40 ? "text-warning" : "text-error")}>{a.score}%</span>
                  <span className="text-xs text-neutral-400">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Teacher Status</h3>
          <div className="space-y-2">
            {data.teacherStatus.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  {t.assessed ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Assessed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning"><Clock className="h-3.5 w-3.5" /> Pending</span>
                  )}
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">{t.score}%</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full">View All Teachers</Button>
        </div>
      </div>
    </div>
  );
}
