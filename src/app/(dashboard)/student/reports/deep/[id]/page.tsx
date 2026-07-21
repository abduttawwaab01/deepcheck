"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, CheckCircle2, AlertTriangle, FileText, TrendingUp, Clock, Brain, Target, Zap } from "lucide-react";
import { generateDeepReportPDF, downloadBlob } from "@/lib/pdf/generate-report";

const badge: Record<string, string> = {
  mastered: "bg-success/10 text-success", strong: "bg-info/10 text-info",
  competent: "bg-primary/10 text-primary", developing: "bg-warning/10 text-warning",
  weak: "bg-error/10 text-error", critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const circ = 2 * Math.PI * 54;

export default function DeepReportPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: report, isLoading } = trpc.student.getDeepReport.useQuery({ id }, { enabled: !!id });

  if (isLoading) return <div className="animate-fade-in space-y-6"><div className="h-48 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" /></div>;
  if (!report) return <div className="py-8 text-center text-sm text-neutral-500">Report not found</div>;

  const os = (report.conceptMap || []).reduce((sum: number, c: any) => sum + (c.score || 0), 0);
  const overallScore = report.conceptMap && report.conceptMap.length > 0 ? Math.round(os / report.conceptMap.length) : 0;
  const learningStyle = (report.learningStyle || {}) as Record<string, any>;
  const predicted = (report.predictedPerformance || {}) as Record<string, any>;
  const plan = (report.personalizedPlan || {}) as Record<string, any>;
  const mp = (report.masteryProgression || {}) as Record<string, any>;

  function handleDownloadPDF() {
    const r = report!;
    const blob = generateDeepReportPDF({
      studentName: "Student",
      overallScore,
      thetaEstimate: 0,
      classification: "N/A",
      date: r.generatedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
      assessmentType: "Deep Report",
      topicBreakdown: (r.conceptMap || []).map((c: any) => ({ name: c.name, mastery: (c.score || 0) / 100, responses: c.total || 0 })),
      strengths: (r.conceptMap || []).filter((c: any) => c.score >= 65).map((c: any) => c.name),
      weaknesses: (r.conceptMap || []).filter((c: any) => c.score < 50).map((c: any) => c.name),
      recommendations: r.studyRecommendations || [],
      cognitiveProfile: r.cognitiveProfile?.map((c: any) => `${c.label}: ${c.score}`).join("\n"),
    });
    downloadBlob(blob, `deep-report-${id}.pdf`);
  }

  const engagementMetrics = learningStyle.engagementMetrics || {};
  const itemQuality = learningStyle.itemQualitySummary || {};

  return (
    <div className="animate-fade-in space-y-4 min-[320px]:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <FileText className="h-4 w-4" /><span>ID: {id}</span><span>&middot;</span><span>{report.generatedAt?.split("T")[0] || ""}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="min-h-[44px] gap-1.5"><Download className="h-4 w-4" />PDF</Button>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Deep Learning Report</h1>
        <p className="text-sm text-neutral-500">Comprehensive cognitive &amp; skill analysis</p>
      </div>

      <div className="flex items-center justify-center gap-6">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 130 130" className="-rotate-90">
            <circle cx="65" cy="65" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-neutral-800" />
            <circle cx="65" cy="65" r="54" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - overallScore / 100)}
              className={cn("transition-all duration-1000", overallScore >= 70 ? "text-success" : overallScore >= 50 ? "text-warning" : "text-error")} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">{overallScore}</span>
            <span className="text-[10px] text-neutral-500">Overall</span>
          </div>
        </div>
      </div>

      {/* Predicted Performance */}
      {predicted.nextAssessment != null && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <TrendingUp className="h-4 w-4 text-primary-500" />Predicted Performance
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-primary-50 p-3 dark:bg-primary-950">
              <div className="text-lg font-bold text-primary-600">{predicted.nextAssessment}%</div>
              <div className="text-xs text-neutral-500">Next Assessment</div>
            </div>
            <div className="rounded-xl bg-primary-50 p-3 dark:bg-primary-950">
              <div className="text-lg font-bold text-primary-600">{predicted.confidence || 80}%</div>
              <div className="text-xs text-neutral-500">Confidence</div>
            </div>
            <div className="rounded-xl bg-primary-50 p-3 dark:bg-primary-950">
              <div className="text-sm font-bold text-primary-600">{predicted.timeframe || "4-6 weeks"}</div>
              <div className="text-xs text-neutral-500">Timeframe</div>
            </div>
          </div>
          {predicted.improvementEstimate && (
            <p className="mt-2 text-xs text-neutral-500 text-center">{predicted.improvementEstimate}</p>
          )}
        </div>
      )}

      {/* Learning Behavior */}
      {learningStyle.responseTimePattern && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Clock className="h-4 w-4 text-info" />Learning Behavior
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-900">
              <div className={cn("text-sm font-bold capitalize",
                learningStyle.responseTimePattern === "methodical" ? "text-success" :
                learningStyle.responseTimePattern === "rushing" ? "text-error" : "text-warning")}>
                {learningStyle.responseTimePattern}
              </div>
              <div className="text-xs text-neutral-500">Pattern</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-900">
              <div className="text-sm font-bold text-neutral-900 dark:text-white">{learningStyle.consistencyIndex || 0}%</div>
              <div className="text-xs text-neutral-500">Consistency</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-900">
              <div className="text-sm font-bold text-neutral-900 dark:text-white">{learningStyle.guessingIndicator || 0}%</div>
              <div className="text-xs text-neutral-500">Guessing</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-900">
              <div className="text-sm font-bold text-neutral-900 dark:text-white">{learningStyle.avgResponseTimeSecs || 0}s</div>
              <div className="text-xs text-neutral-500">Avg Time</div>
            </div>
          </div>

          {/* Engagement Metrics */}
          {engagementMetrics.fatigueDetected != null && (
            <div className="mt-3 flex flex-wrap gap-2">
              {engagementMetrics.rushingScore > 0.5 && (
                <span className="rounded-full bg-error/10 px-2.5 py-1 text-xs font-medium text-error">Rushing Detected</span>
              )}
              {engagementMetrics.fatigueDetected && (
                <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">Fatigue Detected</span>
              )}
              {engagementMetrics.boredomDetected && (
                <span className="rounded-full bg-info/10 px-2.5 py-1 text-xs font-medium text-info">Boredom Indicators</span>
              )}
              {engagementMetrics.anxietyDetected && (
                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Anxiety Patterns</span>
              )}
              {!engagementMetrics.fatigueDetected && !engagementMetrics.boredomDetected && !engagementMetrics.anxietyDetected && engagementMetrics.rushingScore <= 0.5 && (
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">Healthy Engagement</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Item Quality */}
      {itemQuality.totalItems > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Brain className="h-4 w-4 text-purple-500" />Assessment Quality
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center sm:grid-cols-6">
            {[
              { label: "Excellent", count: itemQuality.excellent, color: "text-success" },
              { label: "Good", count: itemQuality.good, color: "text-info" },
              { label: "Acceptable", count: itemQuality.acceptable, color: "text-primary-500" },
              { label: "Marginal", count: itemQuality.marginal, color: "text-warning" },
              { label: "Poor", count: itemQuality.poor, color: "text-error" },
              { label: "Reject", count: itemQuality.reject, color: "text-red-700" },
            ].map((q) => (
              <div key={q.label} className="rounded-xl bg-neutral-50 p-2 dark:bg-neutral-900">
                <div className={cn("text-lg font-bold", q.color)}>{q.count}</div>
                <div className="text-[10px] text-neutral-500">{q.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Plan */}
      {plan.phases && plan.phases.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Target className="h-4 w-4 text-success" />Personalized Study Plan
          </div>
          <div className="mt-3 space-y-3">
            {plan.phases.map((phase: any, i: number) => (
              <div key={i} className="rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                    i === 0 ? "bg-success" : i === 1 ? "bg-primary-500" : "bg-info")}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">{phase.phase}</span>
                </div>
                {phase.actions && phase.actions.length > 0 && (
                  <ul className="mt-2 ml-8 space-y-1">
                    {phase.actions.map((action: string, j: number) => (
                      <li key={j} className="text-xs text-neutral-600 dark:text-neutral-400">{action}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths / Weaknesses */}
      {report.conceptMap && report.conceptMap.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" />Strengths</div>
            <div className="mt-3 space-y-1.5">
              {report.conceptMap.filter((c: any) => c.score >= 65).map((c: any) => (
                <div key={c.name} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />{c.name} ({c.score}%)
                </div>
              ))}
              {report.conceptMap.filter((c: any) => c.score >= 65).length === 0 && <div className="text-sm text-neutral-500">None identified</div>}
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-error"><AlertTriangle className="h-4 w-4" />Weaknesses</div>
            <div className="mt-3 space-y-1.5">
              {report.conceptMap.filter((c: any) => c.score < 50).map((c: any) => (
                <div key={c.name} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-error" />{c.name} ({c.score}%)
                </div>
              ))}
              {report.conceptMap.filter((c: any) => c.score < 50).length === 0 && <div className="text-sm text-neutral-500">None identified</div>}
            </div>
          </div>
        </div>
      )}

      {/* Topic Breakdown */}
      {report.conceptMap && report.conceptMap.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Topic Breakdown</h3>
          <div className="space-y-3">
            {report.conceptMap.map((r: any) => (
              <div key={r.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-neutral-900 dark:text-white">{r.name}</span>
                  <span className="text-xs">{r.score}% <span className={cn("inline-block rounded px-1.5 py-0.5 font-medium", badge[r.status] || "bg-neutral-100 text-neutral-600")}>{r.status || "unknown"}</span></span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className={cn("h-full rounded-full", r.score >= 70 ? "bg-success" : r.score >= 50 ? "bg-warning" : "bg-error")} style={{ width: `${r.score}%` }} />
                </div>
                {r.correct != null && r.total != null && <div className="mt-0.5 text-[10px] text-neutral-400">{r.correct}/{r.total} correct</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cognitive Profile */}
      {report.cognitiveProfile && report.cognitiveProfile.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Cognitive Profile</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.cognitiveProfile.map((x: any) => (
              <div key={x.label} className="rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-900 dark:text-white">{x.label}</span>
                  <span className={cn("font-semibold", x.score >= (x.average || 50) ? "text-success" : "text-error")}>{x.score}</span>
                </div>
                <div className="relative mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div className="absolute inset-y-0 rounded-full bg-neutral-400/30" style={{ width: `${x.average || 50}%` }} />
                  <div className="absolute inset-y-0 rounded-full bg-primary-500" style={{ width: `${x.score}%` }} />
                </div>
                <div className="mt-1 text-xs text-neutral-500">Peer avg: {x.average || 50}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.studyRecommendations && report.studyRecommendations.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recommendations</h3>
          <div className="space-y-3">
            {report.studyRecommendations.map((rec: any) => (
              <div key={rec.title} className={cn("rounded-xl border border-neutral-100 border-l-4 p-4 dark:border-neutral-800",
                rec.priority === "high" ? "border-l-error" : rec.priority === "medium" ? "border-l-warning" : "border-l-info")}>
                <span className={cn("inline-block rounded-md px-2 py-0.5 text-xs font-medium",
                  rec.priority === "high" ? "bg-error/10 text-error" : rec.priority === "medium" ? "bg-warning/10 text-warning" : "bg-info/10 text-info")}>
                  {rec.priority === "high" ? "High" : rec.priority === "medium" ? "Medium" : "Low"} Priority
                </span>
                <h4 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">{rec.title}</h4>
                <p className="mt-1 text-sm text-neutral-500">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.aiSummary && (
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">AI Summary</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{report.aiSummary}</p>
        </div>
      )}
    </div>
  );
}
