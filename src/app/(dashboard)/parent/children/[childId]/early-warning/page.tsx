"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, Minus, Brain, Shield, CheckCircle2, Clock, BookOpen, Target } from "lucide-react";

const riskColors: Record<string, string> = {
  critical: "bg-error text-white",
  high: "bg-orange-500 text-white",
  moderate: "bg-yellow-500 text-white",
  low: "bg-blue-500 text-white",
  none: "bg-success text-white",
};

const riskBg: Record<string, string> = {
  critical: "bg-error/5 border-error/20",
  high: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
  moderate: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  low: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  none: "bg-success/5 border-success/20",
};

const statusColors: Record<string, string> = {
  critical: "bg-error text-white",
  low: "bg-orange-500 text-white",
  moderate: "bg-yellow-500 text-white",
  good: "bg-success text-white",
};

export default function ParentEarlyWarningPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.childId as string;

  const { data, isLoading } = trpc.parent.getChildEarlyWarning.useQuery({ childId });

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass mx-auto max-w-lg rounded-2xl p-8 text-center">
        <p className="text-sm text-neutral-500">No assessment data available for this child yet</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { warning, summary, scoreTimeline, thetaTimeline, topicProgress, retentionOverview } = data;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{warning.studentName}&apos;s Learning Report</h1>
          <p className="text-sm text-neutral-500">Early warning & progress overview</p>
        </div>
      </div>

      {/* Risk Score */}
      <div className={cn("rounded-2xl border p-5", riskBg[warning.riskLevel])}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-semibold">Learning Risk Level</span>
            </div>
            <div className={cn("mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold", riskColors[warning.riskLevel])}>
              {warning.riskLevel.toUpperCase()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-neutral-900 dark:text-white">{warning.overallRiskScore}</div>
            <div className="text-xs text-neutral-500">risk score</div>
          </div>
        </div>

        {warning.topConcerns.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {warning.topConcerns.map((concern, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                {concern}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">{summary.totalAssessments}</div>
          <div className="text-xs text-neutral-500">Assessments Taken</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className={cn("text-2xl font-bold", summary.avgScore >= 60 ? "text-success" : "text-error")}>{summary.avgScore}%</div>
          <div className="text-xs text-neutral-500">Average Score</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-success">{summary.bestScore}%</div>
          <div className="text-xs text-neutral-500">Best Score</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className={cn("text-2xl font-bold", summary.improvementRate >= 0 ? "text-success" : "text-error")}>
            {summary.improvementRate > 0 ? "+" : ""}{summary.improvementRate}%
          </div>
          <div className="text-xs text-neutral-500">Improvement</div>
        </div>
      </div>

      {/* Signal Breakdown */}
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Detailed Analysis</h3>
        <div className="space-y-3">
          {warning.signals.map((signal) => (
            <div key={signal.signal}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{signal.label}</span>
                <span className={cn("font-bold", signal.score >= 70 ? "text-error" : signal.score >= 40 ? "text-warning" : "text-success")}>
                  {signal.score >= 70 ? "Concerning" : signal.score >= 40 ? "Watch" : "Good"}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className={cn("h-full rounded-full", signal.score >= 70 ? "bg-error" : signal.score >= 40 ? "bg-warning" : "bg-success")}
                  style={{ width: `${signal.score}%` }}
                />
              </div>
              <p className="mt-0.5 text-[10px] text-neutral-500">{signal.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Score Timeline */}
      {scoreTimeline.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Score Over Time</h3>
          <div className="flex items-end gap-1">
            {scoreTimeline.map((point, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] text-neutral-400">{point.score}%</span>
                <div
                  className={cn("w-full rounded-t", point.score >= 70 ? "bg-success" : point.score >= 50 ? "bg-warning" : "bg-error")}
                  style={{ height: `${Math.max(4, point.score * 0.8)}px` }}
                />
                <span className="text-[8px] text-neutral-400">{point.date?.slice(5) || ""}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic Progress */}
      {topicProgress.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Subject Progress</h3>
          <div className="space-y-2">
            {topicProgress.map((tp) => (
              <div key={tp.topicName} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-xs text-neutral-600 dark:text-neutral-400">{tp.topicName}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className={cn("h-full rounded-full", tp.latestScore >= 70 ? "bg-success" : tp.latestScore >= 50 ? "bg-warning" : "bg-error")}
                      style={{ width: `${tp.latestScore}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-xs font-semibold">{tp.latestScore}%</span>
                <span className="flex w-16 items-center justify-end gap-1 text-[10px]">
                  {tp.trend === "improving" ? <TrendingUp className="h-3 w-3 text-success" /> :
                   tp.trend === "declining" ? <TrendingDown className="h-3 w-3 text-error" /> :
                   <Minus className="h-3 w-3 text-neutral-400" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retention */}
      {retentionOverview.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Knowledge Retention</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {retentionOverview.map((r) => (
              <div key={r.topicName} className={cn("rounded-xl border p-3", riskBg[r.status === "good" ? "none" : r.status])}>
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-medium text-neutral-700 dark:text-neutral-300">{r.topicName}</span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold text-white", statusColors[r.status])}>
                    {r.retention}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {warning.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">What You Can Do</h3>
          <div className="space-y-2">
            {warning.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
