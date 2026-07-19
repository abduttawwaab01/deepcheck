import { Shield, BarChart, Users, Globe, Zap, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  { icon: BarChart, title: "Deep Analytics", desc: "Real-time dashboards for every student, class, and subject with predictive insights." },
  { icon: Shield, title: "Anti-Cheating", desc: "Browser lockdown, AI proctoring, and plagiarism detection built-in." },
  { icon: Users, title: "Bulk Management", desc: "Upload or sync rosters, schedule assessments, and bulk-purchase credits." },
  { icon: Globe, title: "WASSCE & NECO Aligned", desc: "Questions mapped to national curricula with Bloom's taxonomy tagging." },
  { icon: Zap, title: "Auto-Grading", desc: "Instant results for objective, theory, and even essay questions." },
  { icon: Headphones, title: "Priority Support", desc: "Dedicated account manager and WhatsApp/Slack channel." },
];

export default function ForSchoolsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700 px-4 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold md:text-6xl">Built for Nigerian Schools</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            From class quizzes to term exams, Deep Check gives your school the tools to assess, analyze, and improve student outcomes — at scale.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register?role=school_admin"><Button size="lg" variant="secondary">Get Your School Started</Button></Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">Talk to Sales</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold text-neutral-900 dark:text-white">Everything your school needs</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-500 dark:text-neutral-400">One platform for assessment, analytics, and improvement.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass-strong rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950">
                <f.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 px-4 py-20 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Simple, transparent pricing</h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-600 dark:text-neutral-400">
            ₦150,000/school/term. Bulk discounts available for multi-campus schools. Includes all features, unlimited assessments, and priority support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/pricing"><Button size="lg">View Full Pricing</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="grid gap-8 md:grid-cols-3">
          {[{ value: "500+", label: "Schools Trust Us" }, { value: "50K+", label: "Assessments Delivered" }, { value: "98%", label: "Uptime SLA" }].map((s) => (
            <div key={s.value}>
              <div className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">{s.value}</div>
              <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
