"use client";

import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AlertTriangle, TrendingDown, Users, Activity, BookOpen, Target, ArrowRight, Shield, Zap, Clock, Brain } from "lucide-react";

const riskColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  moderate: "bg-yellow-500",
  low: "bg-blue-500",
  none: "bg-emerald-500",
};

const riskTextColors: Record<string, string> = {
  critical: "text-red-600 dark:text-red-400",
  high: "text-orange-600 dark:text-orange-400",
  moderate: "text-yellow-600 dark:text-yellow-400",
  low: "text-blue-600 dark:text-blue-400",
  none: "text-emerald-600 dark:text-emerald-400",
};

const riskBg: Record<string, string> = {
  critical: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  high: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
  moderate: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  low: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  none: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
};

const cohortColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  neutral: "bg-neutral-400",
};

export default function TeacherInsightsPage() {
  const router = useRouter();
  const { data: insights, isLoading } = trpc.teacher.getSchoolInsights.useQuery();

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (!insights) return null;

  const riskEntries = Object.entries(insights.riskDistribution).filter(([, count]) => count > 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Class Insights</h1>
        <p className="mt-1 text-sm text-neutral-500">
          School-wide analytics for {insights.schoolName || "your school"} &middot; {insights.totalStudents} students
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{insights.studentsWithAssessments}</div>
          <div className="text-xs text-neutral-500">Assessed</div>
          <div className="text-[10px] text-neutral-400">of {insights.totalStudents} total</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className={cn("text-2xl font-bold", insights.avgScore >= 60 ? "text-success" : insights.avgScore >= 40 ? "text-warning" : "text-error")}>
            {insights.avgScore}%
          </div>
          <div className="text-xs text-neutral-500">Average Score</div>
          <div className="text-[10px] text-neutral-400">median {insights.medianScore}%</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className={cn("text-2xl font-bold", insights.atRiskCount > 0 ? "text-error" : "text-success")}>
            {insights.atRiskCount}
          </div>
          <div className="text-xs text-neutral-500">At Risk</div>
          <div className="text-[10px] text-neutral-400">critical + high</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">
            {insights.engagementSummary.activeThisWeek}
          </div>
          <div className="text-xs text-neutral-500">Active This Week</div>
          <div className="text-[10px] text-neutral-400">{insights.engagementSummary.inactiveOver30Days} inactive 30d</div>
        </div>
      </div>

      {/* Risk Distribution */}
      {riskEntries.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Risk Distribution</h3>
          <div className="flex gap-1 overflow-hidden rounded-full">
            {riskEntries.map(([level, count]) => (
              <div
                key={level}
                className={cn("h-3 rounded-full", riskColors[level])}
                style={{ width: `${Math.max(4, (count / insights.totalStudents) * 100)}%` }}
                title={`${level}: ${count}`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {riskEntries.map(([level, count]) => (
              <div key={level} className="flex items-center gap-1.5 text-xs">
                <span className={cn("h-2.5 w-2.5 rounded-full", riskColors[level])} />
                <span className="capitalize text-neutral-600 dark:text-neutral-400">{level}</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cohort Segmentation */}
      {insights.cohorts.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Performance Cohorts</h3>
          <div className="space-y-2">
            {insights.cohorts.map((cohort) => (
              <div key={cohort.label} className="flex items-center gap-3">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", cohortColors[cohort.color] || "bg-neutral-400")} />
                <span className="w-40 shrink-0 text-xs text-neutral-600 dark:text-neutral-400">{cohort.label}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className={cn("h-full rounded-full", cohortColors[cohort.color] || "bg-neutral-400")}
                      style={{ width: `${cohort.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-xs font-semibold text-neutral-900 dark:text-white">{cohort.count}</span>
                <span className="w-10 text-right text-[10px] text-neutral-400">{cohort.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Attention */}
      {insights.needsAttention.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Needs Attention</h3>
          <div className="space-y-2">
            {insights.needsAttention.map((s) => (
              <button
                key={s.studentId}
                onClick={() => router.push(`/teacher/insights/${s.studentId}`)}
                className={cn("flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all hover:scale-[1.005]", riskBg[s.riskLevel])}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", riskColors[s.riskLevel])}>
                    <span className="text-xs font-bold text-white">{s.riskScore}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{s.studentName}</p>
                    <p className={cn("text-xs capitalize", riskTextColors[s.riskLevel])}>{s.riskLevel} risk</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topic Difficulty */}
      {insights.topicDifficulty.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Topic Difficulty (hardest first)</h3>
          <div className="space-y-2">
            {insights.topicDifficulty.slice(0, 10).map((topic) => (
              <div key={topic.topicName} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-xs text-neutral-600 dark:text-neutral-400">{topic.topicName}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className={cn("h-full rounded-full", topic.averageScore >= 60 ? "bg-success" : topic.averageScore >= 40 ? "bg-warning" : "bg-error")}
                      style={{ width: `${topic.averageScore}%` }}
                    />
                  </div>
                </div>
                <span className={cn("w-10 text-right text-xs font-semibold", topic.averageScore >= 60 ? "text-success" : topic.averageScore >= 40 ? "text-warning" : "text-error")}>
                  {topic.averageScore}%
                </span>
                <span className="w-20 text-right text-[10px] text-neutral-400">
                  {topic.strugglingCount}/{topic.studentCount} struggling
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers */}
      {insights.topPerformers.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Top Performers</h3>
          <div className="space-y-2">
            {insights.topPerformers.slice(0, 5).map((s, i) => (
              <button
                key={s.studentId}
                onClick={() => router.push(`/teacher/insights/${s.studentId}`)}
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-100 p-3 text-left transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-success">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-white">{s.studentName}</span>
                <span className="text-sm font-bold text-success">{s.score}%</span>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Concept Heatmap Summary */}
      {insights.conceptHeatmap.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Concept Heatmap</h3>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-10">
              {insights.conceptHeatmap.slice(0, 80).map((entry, i) => (
                <div
                  key={i}
                  className={cn("flex h-8 w-8 items-center justify-center rounded text-[10px] font-bold text-white",
                    entry.score >= 80 ? "bg-success" : entry.score >= 60 ? "bg-info" : entry.score >= 40 ? "bg-warning" : "bg-error"
                  )}
                  title={`${entry.studentName}: ${entry.topicName} (${entry.score}%)`}
                >
                  {entry.score}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-neutral-400">
              Cells show student topic scores. Click a student in &quot;Needs Attention&quot; for detail.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
