"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, FileText, Play, GraduationCap, ArrowRight, School, Sparkles, BarChart3 } from "lucide-react";

const levelConfig: Record<string, { icon: any; gradient: string; label: string }> = {
  "primary-to-jss1": { icon: GraduationCap, gradient: "from-emerald-500 to-teal-500", label: "Primary → JSS" },
  "jss3-to-ss1": { icon: School, gradient: "from-blue-500 to-indigo-500", label: "JSS → SSS" },
  "ss3-to-university": { icon: Sparkles, gradient: "from-primary-500 to-secondary-500", label: "SSS → University" },
};

export default function AssessmentsPage() {
  const router = useRouter();
  const { data: assessments = [], isLoading } = trpc.student.getAssessmentListings.useQuery();

  if (isLoading) return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl p-5 animate-pulse">
          <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-2 h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Readiness Assessments</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Terminal diagnostic assessments that measure readiness for the next academic level
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assessments.map((a) => {
          const config = levelConfig[a.level] || levelConfig["primary-to-jss1"];
          const Icon = config.icon;
          return (
            <div key={a.id} className="glass rounded-2xl p-5 transition-all hover:shadow-md flex flex-col">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", config.gradient)}>
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">{a.title}</h2>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed flex-1">{a.description}</p>

              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{a.questionCount} questions</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{a.timeLimitMinutes} min</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.sections.map((s) => (
                  <span key={s.name} className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    {s.name}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                className="mt-4 w-full gap-1.5 min-h-[44px]"
                onClick={() => router.push(`/assessment/${a.id}`)}
              >
                <Play className="h-4 w-4" /> Start Assessment <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white">How it works</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-neutral-500">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />Choose your transition level above</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />Answer all questions at your own pace</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />Use the built-in calculator when needed</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />Get your readiness score and detailed report</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
