"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, ArrowRight, CheckCircle, Download, AlertTriangle,
  Target, TrendingUp, BookOpen, Building, Clock, ClipboardCheck,
  ChevronRight, Sparkles, FileText, BarChart3,
} from "lucide-react";

type View = "quiz" | "results" | "deep-report";

const PAGE_SIZE = 5;

const CATEGORY_LABELS: Record<string, string> = {
  needs_improvement: "Needs Improvement",
  developing: "Developing",
  adequate: "Adequate",
  good: "Good",
  excellent: "Excellent",
};

const CATEGORY_COLORS: Record<string, string> = {
  needs_improvement: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  developing: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  adequate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  good: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  excellent: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const RATING_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  needs_improvement: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  adequate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  good: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  excellent: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

const RATING_BORDER: Record<string, string> = {
  critical: "border-l-red-500",
  needs_improvement: "border-l-orange-500",
  adequate: "border-l-yellow-500",
  good: "border-l-blue-500",
  excellent: "border-l-green-500",
};

function scoreColor(s: number) {
  if (s >= 80) return "text-green-600 dark:text-green-400";
  if (s >= 60) return "text-blue-600 dark:text-blue-400";
  if (s >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function scoreBarColor(s: number) {
  if (s >= 80) return "bg-green-500";
  if (s >= 60) return "bg-blue-500";
  if (s >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function ratingLabel(r: string) {
  return r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CircularScore({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="8"
          className="text-neutral-200 dark:text-neutral-800" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          className={cn("transition-all duration-1000", scoreColor(score).replace("text-", "stroke-"))} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-3xl font-extrabold", scoreColor(score))}>{score}%</span>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800", className)} />;
}

function DeepReportView({ data, loading, onBack }: { data: any; loading: boolean; onBack: () => void }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <div className="glass rounded-2xl p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
          <p className="mt-3 text-sm text-neutral-500">No deep report data available.</p>
        </div>
      </div>
    );
  }

  const domainAnalysis: any[] = Array.isArray(data.domainAnalysis) ? data.domainAnalysis : [];
  const criticalGaps: any[] = Array.isArray(data.criticalGaps) ? data.criticalGaps : [];
  const strengths: any[] = Array.isArray(data.strengths) ? data.strengths : [];
  const priorityActions: any[] = Array.isArray(data.priorityActionPlan) ? data.priorityActionPlan : [];
  const benchmarkComparison: any[] = Array.isArray(data.benchmarkComparison) ? data.benchmarkComparison : [];
  const improvementTimeline: any = data.improvementTimeline || null;
  const resourceRecommendations: any[] = Array.isArray(data.resourceRecommendations) ? data.resourceRecommendations : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Deep Report</h1>
          <p className="mt-1 text-sm text-neutral-500">Comprehensive school quality analysis</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <CircularScore score={Number(data.overallScore) || 0} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Overall Score</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Based on analysis across {domainAnalysis.length} educational domains
            </p>
            <div className="mt-3">
              <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                RATING_COLORS[Number(data.overallScore) >= 80 ? "excellent" : Number(data.overallScore) >= 60 ? "good" : Number(data.overallScore) >= 40 ? "adequate" : Number(data.overallScore) >= 20 ? "needs_improvement" : "critical"]
              )}>
                {ratingLabel(Number(data.overallScore) >= 80 ? "excellent" : Number(data.overallScore) >= 60 ? "good" : Number(data.overallScore) >= 40 ? "adequate" : Number(data.overallScore) >= 20 ? "needs_improvement" : "critical")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.aiSummary && (
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Sparkles className="h-4 w-4 text-primary-500" /> AI Summary
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{data.aiSummary}</p>
        </div>
      )}

      {criticalGaps.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" /> Critical Gaps ({criticalGaps.length})
          </h3>
          <div className="space-y-2">
            {criticalGaps.map((g: any, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-white p-3 dark:bg-red-950/50">
                <span className={cn("mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", "bg-red-500")}>{g.score}%</span>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{g.domain}</div>
                  <div className="text-xs text-neutral-500">{g.rating ? ratingLabel(g.rating) : "Critical"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length > 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
            <TrendingUp className="h-4 w-4" /> Strengths ({strengths.length})
          </h3>
          <div className="space-y-2">
            {strengths.map((s: any, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-white p-3 dark:bg-green-950/50">
                <span className={cn("mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", "bg-green-500")}>{s.score}%</span>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{s.domain}</div>
                  <div className="text-xs text-neutral-500">{s.rating ? ratingLabel(s.rating) : "Strong"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {domainAnalysis.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Domain Analysis</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {domainAnalysis.map((d: any, i: number) => (
              <div key={i} className={cn("glass rounded-xl border-l-4 p-4", RATING_BORDER[d.rating] || "border-l-neutral-400")}>
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{d.domain}</h4>
                  <span className={cn("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold", RATING_COLORS[d.rating] || "bg-neutral-100 text-neutral-600")}>
                    {d.score}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div className={cn("h-full rounded-full transition-all duration-500", scoreBarColor(d.score))} style={{ width: `${d.score}%` }} />
                </div>
                {d.findings && d.findings.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-neutral-500 mb-1">Findings</div>
                    <ul className="space-y-1">
                      {d.findings.slice(0, 2).map((f: string, fi: number) => (
                        <li key={fi} className="text-xs text-neutral-600 dark:text-neutral-400">&bull; {f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {d.improvements && d.improvements.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-neutral-500 mb-1">Improvements</div>
                    <ul className="space-y-1">
                      {d.improvements.slice(0, 2).map((im: string, ii: number) => (
                        <li key={ii} className="text-xs text-neutral-600 dark:text-neutral-400">&bull; {im}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {priorityActions.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Target className="h-4 w-4" /> Priority Action Plan
          </h3>
          <div className="space-y-3">
            {priorityActions.map((a: any, i: number) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">{a.rank || i + 1}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">{a.domain}</div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{a.action}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {a.timeframe?.replace(/_/g, " ")}
                      </span>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        a.difficulty === "easy" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : a.difficulty === "moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      )}>
                        {a.difficulty}
                      </span>
                    </div>
                    {a.expectedImpact && (
                      <p className="mt-1.5 text-xs italic text-neutral-500">Impact: {a.expectedImpact}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {benchmarkComparison.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Building className="h-4 w-4" /> Benchmark Comparison
          </h3>
          <div className="glass overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                    <th className="px-4 py-3 font-medium text-neutral-600 dark:text-neutral-400">Domain</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-600 dark:text-neutral-400">Score</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-600 dark:text-neutral-400">Best Practice</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-600 dark:text-neutral-400">Gap</th>
                    <th className="px-4 py-3 text-center font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkComparison.map((b: any, i: number) => (
                    <tr key={i} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{b.domain}</td>
                      <td className={cn("px-4 py-3 text-right font-semibold", scoreColor(b.schoolScore))}>{b.schoolScore}%</td>
                      <td className="px-4 py-3 text-right text-neutral-500">{b.bestPracticeScore}%</td>
                      <td className={cn("px-4 py-3 text-right font-medium", b.gap >= 0 ? "text-green-600" : "text-red-600")}>
                        {b.gap >= 0 ? "+" : ""}{b.gap}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                          b.status === "ahead" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : b.status === "on_track" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : b.status === "behind" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        )}>
                          {b.status?.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {improvementTimeline && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Clock className="h-4 w-4" /> Improvement Timeline
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { key: "phase30Days", label: "30 Days", color: "bg-red-500" },
              { key: "phase60Days", label: "60 Days", color: "bg-yellow-500" },
              { key: "phase90Days", label: "90 Days", color: "bg-green-500" },
            ].map(({ key, label, color }) => {
              const phase = improvementTimeline[key];
              if (!phase) return null;
              return (
                <div key={key} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 rounded-full", color)} />
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</h4>
                  </div>
                  {phase.expectedOutcome && (
                    <p className="mt-2 text-xs text-neutral-500 italic">{phase.expectedOutcome}</p>
                  )}
                  {phase.actions && phase.actions.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {phase.actions.slice(0, 4).map((act: string, ai: number) => (
                        <li key={ai} className="text-xs text-neutral-600 dark:text-neutral-400">&bull; {act}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {resourceRecommendations.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <BookOpen className="h-4 w-4" /> Resource Recommendations
          </h3>
          <div className="space-y-3">
            {resourceRecommendations.slice(0, 5).map((rec: any, i: number) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{rec.domain}</div>
                {rec.resources && rec.resources.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {rec.resources.map((r: string, ri: number) => (
                      <li key={ri} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <FileText className="mt-0.5 h-3 w-3 shrink-0 text-primary-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchoolAssessmentPage() {
  const { data: assessment, isLoading: assessmentLoading } = trpc.school.getSchoolAssessment.useQuery();
  const { data: resultsData } = trpc.school.getSchoolAssessmentResults.useQuery(
    {}, { enabled: false }
  );
  const { data: historyData, refetch: refetchHistory } = trpc.school.getSchoolAssessmentHistory.useQuery();
  const { data: dashboardData } = trpc.school.getDashboard.useQuery();
  const submitMutation = trpc.school.submitSchoolAssessment.useMutation();
  const requestDeepReportMutation = trpc.school.requestSchoolDeepReport.useMutation();
  const { data: deepReportData, isLoading: deepReportLoading } = trpc.school.getSchoolDeepReport.useQuery(
    { deepReportId: requestDeepReportMutation.data?.deepReportId || "" },
    { enabled: !!requestDeepReportMutation.data?.deepReportId }
  );

  const [view, setView] = useState<View>("quiz");
  const [started, setStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lastResult, setLastResult] = useState<any>(null);

  const questions = useMemo(() => assessment || [], [assessment]);
  const grouped = useMemo(() => {
    const groups: Record<string, typeof questions> = {};
    for (const q of questions) {
      if (!groups[q.domain]) groups[q.domain] = [];
      groups[q.domain].push(q);
    }
    return Object.entries(groups);
  }, [questions]);

  const flatQuestions = useMemo(() => questions, [questions]);
  const totalPages = Math.ceil(flatQuestions.length / PAGE_SIZE);
  const currentQuestions = flatQuestions.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const answeredCount = Object.keys(answers).length;
  const isLastPage = currentPage === totalPages - 1;

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const responses = Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }));
    submitMutation.mutate({ responses }, {
      onSuccess: (data) => {
        setLastResult(data);
        setView("results");
        setStarted(false);
        setCurrentPage(0);
        refetchHistory();
      },
    });
  };

  const handleRequestDeepReport = () => {
    if (!lastResult?.responseId) return;
    requestDeepReportMutation.mutate({ responseId: lastResult.responseId }, {
      onSuccess: (data) => {
        if (data.success && data.deepReportId) setView("deep-report");
      },
    });
  };

  if (assessmentLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <ClipboardCheck className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-500">No assessment questions available.</p>
        </div>
      </div>
    );
  }

  const domainForCurrentPage = currentQuestions[0]?.domain || "";
  const domainIndex = grouped.findIndex(([name]) => name === domainForCurrentPage);

  if (view === "deep-report") {
    return (
      <div className="space-y-6">
        <DeepReportView data={deepReportData} loading={deepReportLoading} onBack={() => setView("results")} />
      </div>
    );
  }

  if (view === "results") {
    const result = lastResult;
    const domainScores: Record<string, number> = (result?.domainScores || {}) as Record<string, number>;
    const creditsRemaining = dashboardData?.reportCreditsRemaining ?? 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setView("quiz"); setAnswers({}); setLastResult(null); }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Assessment Results</h1>
        </div>

        {result ? (
          <>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <CircularScore score={result.percentage || 0} />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">School Quality Score</h2>
                  <div className="mt-2">
                    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", CATEGORY_COLORS[result.category] || "")}>
                      {CATEGORY_LABELS[result.category] || result.category}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-neutral-500">
                    {result.totalScore} / {result.maxPossibleScore} points
                  </p>
                  {result.responseId && (
                    <Button onClick={handleRequestDeepReport} disabled={requestDeepReportMutation.isPending || creditsRemaining <= 0}
                      loading={requestDeepReportMutation.isPending} className="mt-4 gap-2" size="sm">
                      <Sparkles className="h-4 w-4" />
                      Get Deep Report
                      <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        {creditsRemaining} credits
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {Object.keys(domainScores).length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Domain Breakdown</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(domainScores).map(([domain, score]) => (
                    <div key={domain} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{domain}</span>
                        <span className={cn("text-sm font-bold", scoreColor(Number(score)))}>{Number(score)}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                        <div className={cn("h-full rounded-full transition-all duration-500", scoreBarColor(Number(score)))} style={{ width: `${Number(score)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setView("quiz"); setAnswers({}); setLastResult(null); }}>
                Retake Assessment
              </Button>
              {result.responseId && (
                <Link href={`/school/deep-report/${result.responseId}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ChevronRight className="h-4 w-4" /> View Deep Report
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
            <p className="mt-3 text-sm text-neutral-500">No results yet. Take the assessment first.</p>
            <Button className="mt-4" onClick={() => setView("quiz")}>Take Assessment</Button>
          </div>
        )}

        {historyData && historyData.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Assessment History</h3>
            <div className="space-y-2">
              {historyData.map((h: any) => (
                <div key={h.id} className="glass flex items-center justify-between rounded-xl p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">Assessment</div>
                    <div className="text-xs text-neutral-500">{h.completedAt ? new Date(h.completedAt).toLocaleDateString() : ""}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-sm font-bold", scoreColor(h.percentage || 0))}>{h.percentage || 0}%</span>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", CATEGORY_COLORS[h.category] || "")}>
                      {CATEGORY_LABELS[h.category] || h.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">School Quality Assessment</h1>
        <p className="mt-1 text-sm text-neutral-500">Answer each question honestly based on your school&apos;s current practices.</p>
      </div>

      {!started ? (
        <div className="glass rounded-2xl p-6 sm:p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Ready to Begin?</h2>
          <p className="mt-2 text-sm text-neutral-500">
            This assessment covers {questions.length} questions across {grouped.length} domains.
          </p>
          <div className="mx-auto mt-5 grid max-w-sm grid-cols-3 gap-3">
            <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
              <div className="text-lg font-bold text-neutral-900 dark:text-white">{questions.length}</div>
              <div className="text-xs text-neutral-500">Questions</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
              <div className="text-lg font-bold text-neutral-900 dark:text-white">{grouped.length}</div>
              <div className="text-xs text-neutral-500">Domains</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
              <div className="text-lg font-bold text-neutral-900 dark:text-white">~{Math.ceil(questions.length / 5 * 1.5)}</div>
              <div className="text-xs text-neutral-500">Minutes</div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-left">
            {grouped.map(([domain, qs]) => (
              <div key={domain} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-900">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{domain}</span>
                <span className="text-xs text-neutral-500">{qs.length} questions</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="mt-6 w-full" onClick={() => setStarted(true)}>Start Assessment</Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-900 dark:text-white">
              Question {currentPage * PAGE_SIZE + 1}{'\u2013'}{Math.min((currentPage + 1) * PAGE_SIZE, flatQuestions.length)} of {flatQuestions.length}
            </span>
            <span className="text-neutral-500">{answeredCount} answered</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500" style={{ width: `${(answeredCount / flatQuestions.length) * 100}%` }} />
          </div>
          {domainIndex >= 0 && (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="rounded-md bg-primary-50 px-2 py-0.5 font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">{domainForCurrentPage}</span>
              <span>Domain {domainIndex + 1} of {grouped.length}</span>
            </div>
          )}
          <div className="space-y-4">
            {currentQuestions.map((q, qi) => (
              <div key={q.id} className="glass rounded-xl p-4 sm:p-5">
                <div className="mb-1 flex items-start justify-between">
                  <span className="text-xs font-medium text-neutral-400">
                    Q{currentPage * PAGE_SIZE + qi + 1}
                    {q.dimension && <span className="ml-2">&middot; {q.dimension}</span>}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">{q.text}</h3>
                <div className="mt-3 grid gap-2">
                  {q.options.map((o: any) => (
                    <button key={o.id} onClick={() => handleSelectAnswer(q.id, o.id)}
                      className={cn("flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                        answers[q.id] === o.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                          : "border-neutral-200 bg-white hover:border-primary-300 dark:border-neutral-700 dark:bg-neutral-950"
                      )}>
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        answers[q.id] === o.id ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      )}>{o.order}</span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{o.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="text-xs text-neutral-400">Page {currentPage + 1} of {totalPages}</div>
            {isLastPage ? (
              <Button onClick={handleSubmit} disabled={answeredCount < flatQuestions.length || submitMutation.isPending} loading={submitMutation.isPending} className="gap-1">
                <CheckCircle className="h-4 w-4" /> Submit
              </Button>
            ) : (
              <Button onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} className="gap-1">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
