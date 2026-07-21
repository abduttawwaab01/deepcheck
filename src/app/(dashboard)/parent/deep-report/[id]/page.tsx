"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Download,
  Heart,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  TrendingUp,
  BookOpen,
  Shield,
  Sparkles,
  FileText,
  Clock,
} from "lucide-react";

const scoreColor = (score: number) =>
  score < 40 ? "text-red-600" : score < 60 ? "text-yellow-600" : score < 80 ? "text-blue-600" : "text-green-600";

const scoreBorder = (score: number) =>
  score < 40 ? "border-l-red-500" : score < 60 ? "border-l-yellow-500" : score < 80 ? "border-l-blue-500" : "border-l-green-500";

const categoryBadgeVariant: Record<string, "red" | "orange" | "yellow" | "blue" | "green"> = {
  needs_guidance: "red",
  developing: "orange",
  adequate: "yellow",
  proficient: "blue",
  exemplary: "green",
};

const categoryLabel: Record<string, string> = {
  needs_guidance: "Needs Guidance",
  developing: "Developing",
  adequate: "Adequate",
  proficient: "Proficient",
  exemplary: "Exemplary",
};

const resourceIconMap: Record<string, typeof BookOpen> = {
  book: BookOpen,
  article: FileText,
  video: Target,
  activity: Heart,
  professional: Shield,
};

export default function ParentDeepReportPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: report, isLoading, error } = trpc.parent.getParentDeepReport.useQuery(
    { deepReportId: id },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl p-12 text-center glass">
        <AlertTriangle className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
        <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {error?.message || "Deep report not found or you do not have access."}
        </p>
        <Link href="/parent/assessment">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Go to Assessment
          </Button>
        </Link>
      </div>
    );
  }

  const domainAnalysis = (report.domainAnalysis as { domain: string; score: number; rating: string; findings: string[]; practicalTips: string[] }[]) || [];
  const parentingStyle = (report.parentingStyle as { primary: string; secondary: string; description: string; strengths: string[]; concerns: string[] }) || {} as any;
  const areasForGrowth = (report.areasForGrowth as { domain: string; score: number }[]) || [];
  const strengthsList = (report.strengths as { domain: string; score: number }[]) || [];
  const actionPlan = (report.actionPlan as { week: number; theme: string; actions: string[]; expectedOutcome: string }[]) || [];
  const ageInsights = (report.ageSpecificInsights as { ageGroup: string; developmentalStage: string; keyStrategies: string[]; warningSigns: string[] }) || {} as any;
  const resources = (report.resourceRecommendations as { title: string; category: string; description: string }[]) || [];
  const redFlags = (report.redFlags as { urgency: string; domain: string; concern: string }[]) || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/parent/assessment" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Deep Report</h1>
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
              <Clock className="h-3.5 w-3.5" />
              Generated {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : "recently"}
            </p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:border-green-800 dark:from-green-950 dark:to-emerald-950">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-lg dark:bg-neutral-900">
            <Star className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-green-600 dark:text-green-400">Overall Parenting Score</p>
            <p className={`text-4xl font-extrabold ${scoreColor(Number(report.overallScore))}`}>
              {Number(report.overallScore)}%
            </p>
            {report.aiSummary && (
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {report.aiSummary}
              </p>
            )}
          </div>
        </div>
      </div>

      {parentingStyle.primary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Parenting Style Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="blue" className="text-sm capitalize">{parentingStyle.primary}</Badge>
              {parentingStyle.secondary && (
                <span className="text-sm text-neutral-500">{parentingStyle.secondary}</span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{parentingStyle.description}</p>
            {parentingStyle.strengths?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-600">Strengths</p>
                <ul className="space-y-1.5">
                  {parentingStyle.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {parentingStyle.concerns?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-600">Areas for Growth</p>
                <ul className="space-y-1.5">
                  {parentingStyle.concerns.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {areasForGrowth.length > 0 && (
        <div className="glass rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" /> Critical Gaps — Immediate Attention Needed
          </h3>
          <div className="space-y-2">
            {areasForGrowth.map((gap: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white p-3 dark:bg-neutral-900">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{gap.domain}</span>
                <span className="text-sm font-bold text-red-600">{gap.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengthsList.length > 0 && (
        <div className="glass rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" /> Your Strengths
          </h3>
          <div className="space-y-2">
            {strengthsList.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white p-3 dark:bg-neutral-900">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{s.domain}</span>
                <span className="text-sm font-bold text-green-600">{s.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Domain Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {domainAnalysis.map((d: any, i: number) => (
            <div key={i} className={`border-l-4 ${scoreBorder(d.score)} rounded-r-xl bg-neutral-50 p-4 dark:bg-neutral-900`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{d.domain}</p>
                  <p className="text-xs capitalize text-neutral-500">{d.rating?.replace(/_/g, " ")}</p>
                </div>
                <span className={`text-lg font-bold ${scoreColor(d.score)}`}>{d.score}%</span>
              </div>
              <Progress value={d.score} className="mt-2" />
              {d.findings?.length > 0 && (
                <div className="mt-3 space-y-1">
                  {d.findings.slice(0, 2).map((f: string, j: number) => (
                    <p key={j} className="text-xs text-neutral-500">{f}</p>
                  ))}
                </div>
              )}
              {d.practicalTips?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {d.practicalTips.map((tip: string, j: number) => (
                    <p key={j} className="flex items-start gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary-500" />
                      {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {actionPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              4-Week Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionPlan.map((week: any, i: number) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                  <Badge variant={i === 0 ? "blue" : i === 1 ? "purple" : i === 2 ? "orange" : "green"}>
                    Week {week.week}
                  </Badge>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{week.theme}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {week.actions.map((action: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                      {action}
                    </li>
                  ))}
                </ul>
                {week.expectedOutcome && (
                  <p className="mt-2 text-xs italic text-neutral-500">Expected outcome: {week.expectedOutcome}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {ageInsights.ageGroup && ageInsights.ageGroup !== "Unknown" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" />
              Age-Specific Insights — {ageInsights.ageGroup}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{ageInsights.developmentalStage}</p>
            {ageInsights.keyStrategies?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">Key Strategies</p>
                <ul className="space-y-1.5">
                  {ageInsights.keyStrategies.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ageInsights.warningSigns?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-600">Warning Signs</p>
                <ul className="space-y-1.5">
                  {ageInsights.warningSigns.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              Resource Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map((r: any, i: number) => {
                const Icon = resourceIconMap[r.category] || BookOpen;
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{r.title}</p>
                      <Badge variant="default" className="mt-1 text-[10px] capitalize">{r.category}</Badge>
                      <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 line-clamp-2">{r.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {redFlags.length > 0 && (
        <div className="glass rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" /> Red Flags
          </h3>
          <div className="space-y-2">
            {redFlags.map((flag: any, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-3 dark:bg-neutral-900">
                <Badge
                  variant={flag.urgency === "immediate" ? "red" : flag.urgency === "soon" ? "orange" : "yellow"}
                  className="shrink-0 capitalize"
                >
                  {flag.urgency}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{flag.domain}</p>
                  <p className="text-xs text-neutral-500">{flag.concern}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link href="/parent/assessment" className="block">
        <Button variant="ghost" className="w-full gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Assessment
        </Button>
      </Link>
    </div>
  );
}
