"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Download, AlertTriangle, Target, TrendingUp,
  Building, Clock, BookOpen, FileText, Sparkles,
} from "lucide-react";

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

function CircularScore({ score, size = 180 }: { score: number; size?: number }) {
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
        <span className={cn("text-4xl font-extrabold", scoreColor(score))}>{score}%</span>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800", className)} />;
}

function downloadDeepReportPDF(report: any) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `deep-report-${report.id || "report"}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DeepReportPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = trpc.school.getSchoolDeepReport.useQuery(
    { deepReportId: id },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
          <h1 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">Report Not Found</h1>
          <p className="mt-2 text-sm text-neutral-500">The deep report with ID &quot;{id}&quot; could not be found.</p>
          <Link href="/school/assessment">
            <Button className="mt-6 gap-1"><ArrowLeft className="h-4 w-4" /> Back to Assessment</Button>
          </Link>
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
  const overallScore = Number(data.overallScore) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/school/assessment">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">School Deep Report</h1>
            <p className="mt-0.5 text-xs text-neutral-500">
              {data.generatedAt ? new Date(data.generatedAt).toLocaleDateString() : ""}
              {data.status && <span className="ml-2 capitalize">({data.status})</span>}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => downloadDeepReportPDF(data)}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <CircularScore score={overallScore} />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Overall Quality Score</h2>
            <p className="mt-1 text-sm text-neutral-500">Analysis across {domainAnalysis.length} educational domains</p>
            <div className="mt-3">
              <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                RATING_COLORS[overallScore >= 80 ? "excellent" : overallScore >= 60 ? "good" : overallScore >= 40 ? "adequate" : overallScore >= 20 ? "needs_improvement" : "critical"]
              )}>
                {ratingLabel(overallScore >= 80 ? "excellent" : overallScore >= 60 ? "good" : overallScore >= 40 ? "adequate" : overallScore >= 20 ? "needs_improvement" : "critical")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.aiSummary && (
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Sparkles className="h-4 w-4 text-primary-500" /> AI Analysis Summary
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
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{g.score}%</span>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">{g.domain}</div>
                  <div className="text-xs text-neutral-500">{g.rating ? ratingLabel(g.rating) : "Critical"}</div>
                  {g.findings && g.findings.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {g.findings.slice(0, 2).map((f: string, fi: number) => (
                        <li key={fi} className="text-xs text-neutral-500">&bull; {f}</li>
                      ))}
                    </ul>
                  )}
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
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">{s.score}%</span>
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
          <h3 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Domain Analysis ({domainAnalysis.length})</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {domainAnalysis.map((d: any, i: number) => (
              <div key={i} className={cn("glass rounded-xl border-l-4 p-4", RATING_BORDER[d.rating] || "border-l-neutral-400")}>
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">{d.domain}</h4>
                  <span className={cn("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold", RATING_COLORS[d.rating] || "bg-neutral-100 text-neutral-600")}>{d.score}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div className={cn("h-full rounded-full transition-all duration-500", scoreBarColor(d.score))} style={{ width: `${d.score}%` }} />
                </div>
                {d.findings && d.findings.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-neutral-500 mb-1">Findings</div>
                    <ul className="space-y-1">{d.findings.slice(0, 2).map((f: string, fi: number) => (
                      <li key={fi} className="text-xs text-neutral-600 dark:text-neutral-400">&bull; {f}</li>
                    ))}</ul>
                  </div>
                )}
                {d.improvements && d.improvements.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-neutral-500 mb-1">Improvements</div>
                    <ul className="space-y-1">{d.improvements.slice(0, 2).map((im: string, ii: number) => (
                      <li key={ii} className="text-xs text-neutral-600 dark:text-neutral-400">&bull; {im}</li>
                    ))}</ul>
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
                      )}>{a.difficulty}</span>
                    </div>
                    {a.expectedImpact && <p className="mt-1.5 text-xs italic text-neutral-500">Impact: {a.expectedImpact}</p>}
                    {a.resources && a.resources.length > 0 && (
                      <div className="mt-2">
                        {a.resources.map((res: string, ri: number) => (
                          <div key={ri} className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <FileText className="h-3 w-3 shrink-0 text-primary-400" /> {res}
                          </div>
                        ))}
                      </div>
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
                        )}>{b.status?.replace(/_/g, " ")}</span>
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
                      {phase.actions.slice(0, 5).map((act: string, ai: number) => (
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
            {resourceRecommendations.slice(0, 7).map((rec: any, i: number) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{rec.domain}</div>
                {rec.resources && rec.resources.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {rec.resources.map((r: string, ri: number) => (
                      <li key={ri} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <FileText className="mt-0.5 h-3 w-3 shrink-0 text-primary-400" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4 pb-8">
        <Link href="/school/assessment">
          <Button variant="outline" className="gap-1"><ArrowLeft className="h-4 w-4" /> Back to Assessment</Button>
        </Link>
      </div>
    </div>
  );
}
