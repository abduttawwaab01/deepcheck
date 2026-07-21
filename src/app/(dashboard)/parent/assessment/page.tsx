"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Download,
  AlertTriangle,
  Heart,
  Target,
  TrendingUp,
  BookOpen,
  Shield,
  Star,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";

type View = "quiz" | "results" | "deep-report";

const QUESTIONS_PER_PAGE = 5;

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

const scoreColor = (score: number) =>
  score < 40 ? "text-red-600" : score < 60 ? "text-yellow-600" : score < 80 ? "text-blue-600" : "text-green-600";

const scoreBorder = (score: number) =>
  score < 40 ? "border-l-red-500" : score < 60 ? "border-l-yellow-500" : score < 80 ? "border-l-blue-500" : "border-l-green-500";

const scoreBarColor = (score: number) =>
  score < 40 ? "bg-red-500" : score < 60 ? "bg-yellow-500" : score < 80 ? "bg-blue-500" : "bg-green-500";

const parentingStyleIcon: Record<string, string> = {
  authoritative: "Balanced & Supportive",
  authoritarian: "Firm & Structured",
  permissive: "Warm & Flexible",
  uninvolved: "Needs More Engagement",
};

function DeepReportSection({ report }: { report: any }) {
  if (!report) return null;

  const domainAnalysis: any[] = report.domainAnalysis || [];
  const parentingStyle: any = report.parentingStyle || {};
  const criticalGaps: any[] = report.criticalGaps || [];
  const strengths: any[] = report.strengths || [];
  const actionPlan: any[] = report.actionPlan || [];
  const ageInsights: any = report.ageSpecificInsights || {};
  const resources: any[] = report.resourceRecommendations || [];
  const redFlags: any[] = report.redFlags || [];

  const resourceIcon: Record<string, typeof BookOpen> = {
    book: BookOpen,
    article: FileText,
    video: Target,
    activity: Heart,
    professional: Shield,
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:border-green-800 dark:from-green-950 dark:to-emerald-950">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Star className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-green-600 dark:text-green-400">Overall Score</p>
            <p className={`text-3xl font-extrabold ${scoreColor(Number(report.overallScore))}`}>
              {Number(report.overallScore)}%
            </p>
          </div>
        </div>
        {report.aiSummary && (
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {report.aiSummary}
          </p>
        )}
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
            <div className="flex items-center gap-3">
              <Badge variant="blue" className="text-sm capitalize">{parentingStyle.primary}</Badge>
              <span className="text-sm text-neutral-500">{parentingStyle.secondary}</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{parentingStyle.description}</p>
            {parentingStyle.strengths?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-green-600">Strengths</p>
                <ul className="space-y-1">
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
                <p className="mb-2 text-xs font-semibold uppercase text-orange-600">Concerns</p>
                <ul className="space-y-1">
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

      {criticalGaps.length > 0 && (
        <div className="glass rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-950">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4" /> Critical Gaps — Areas Needing Immediate Attention
          </h3>
          <div className="space-y-2">
            {criticalGaps.map((gap: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white p-3 dark:bg-neutral-900">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{gap.domain}</span>
                <span className="text-sm font-bold text-red-600">{gap.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length > 0 && (
        <div className="glass rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" /> Strengths — Areas Where You Excel
          </h3>
          <div className="space-y-2">
            {strengths.map((s: any, i: number) => (
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
                <p className="mt-3 text-xs text-neutral-500">{d.findings[0]}</p>
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
                  <p className="mt-2 text-xs italic text-neutral-500">Expected: {week.expectedOutcome}</p>
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
          <CardContent className="space-y-3">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{ageInsights.developmentalStage}</p>
            {ageInsights.keyStrategies?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-blue-600">Key Strategies</p>
                <ul className="space-y-1">
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
                <p className="mb-2 text-xs font-semibold uppercase text-orange-600">Warning Signs to Watch For</p>
                <ul className="space-y-1">
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
                const Icon = resourceIcon[r.category] || BookOpen;
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{r.title}</p>
                      <Badge variant="default" className="mt-1 text-[10px] capitalize">{r.category}</Badge>
                      <p className="mt-1 text-[11px] text-neutral-500 line-clamp-2">{r.description}</p>
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

      {report.pdfUrl && (
        <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" /> Download PDF Report
          </Button>
        </a>
      )}
    </div>
  );
}

export default function ParentAssessmentPage() {
  const [view, setView] = useState<View>("quiz");
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedResponseId, setSubmittedResponseId] = useState<string | null>(null);

  const { data: questions, isLoading: loadingQuestions } = trpc.parent.getParentAssessment.useQuery();
  const submitMutation = trpc.parent.submitParentAssessment.useMutation();
  const { data: history, refetch: refetchHistory } = trpc.parent.getParentAssessmentHistory.useQuery();
  const { data: results } = trpc.parent.getParentAssessmentResults.useQuery(
    { responseId: submittedResponseId || undefined },
    { enabled: !!submittedResponseId || view === "results" }
  );
  const requestDeepReport = trpc.parent.requestParentDeepReport.useMutation();
  const { data: deepReport } = trpc.parent.getParentDeepReport.useQuery(
    { deepReportId: results?.deepReport?.id || "" },
    { enabled: !!results?.deepReport?.id }
  );

  const domains = useMemo(() => {
    if (!questions) return [];
    const grouped: Record<string, typeof questions> = {};
    for (const q of questions) {
      if (!grouped[q.domain]) grouped[q.domain] = [];
      grouped[q.domain].push(q);
    }
    return Object.entries(grouped).map(([domain, qs]) => ({ domain, questions: qs }));
  }, [questions]);

  const flatQuestions = useMemo(() => {
    if (!questions) return [];
    return questions;
  }, [questions]);

  const totalPages = Math.ceil(flatQuestions.length / QUESTIONS_PER_PAGE);
  const currentPageQuestions = useMemo(() => {
    const start = page * QUESTIONS_PER_PAGE;
    return flatQuestions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [flatQuestions, page]);

  const currentDomain = currentPageQuestions.length > 0 ? currentPageQuestions[0]?.domain : "";
  const progress = flatQuestions.length > 0 ? (Object.keys(answers).length / flatQuestions.length) * 100 : 0;
  const isLastPage = page >= totalPages - 1;
  const allAnswered = Object.keys(answers).length >= flatQuestions.length;

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const responses = flatQuestions
      .filter((q) => answers[q.id])
      .map((q) => ({ questionId: q.id, optionId: answers[q.id] }));
    submitMutation.mutate(
      { responses },
      {
        onSuccess: (data) => {
          setSubmittedResponseId(data.responseId);
          setView("results");
          refetchHistory();
        },
      }
    );
  };

  const handleRequestDeepReport = () => {
    if (!results?.id) return;
    requestDeepReport.mutate(
      { responseId: results.id },
      {
        onSuccess: () => {
          setView("deep-report");
        },
      }
    );
  };

  if (loadingQuestions) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (view === "results" && results) {
    const domainScores: Record<string, number> = (results.domainScores as Record<string, number>) || {};

    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setView("quiz"); setPage(0); setAnswers({}); setSubmittedResponseId(null); }}>
            <ArrowLeft className="mr-1 h-4 w-4" /> New Assessment
          </Button>
        </div>

        <div className="glass rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 p-6 dark:border-primary-800 dark:from-primary-950 dark:to-secondary-950">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg dark:bg-neutral-900">
              <span className={`text-3xl font-extrabold ${scoreColor(results.percentage)}`}>{results.percentage}%</span>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Your Parenting Score</p>
              <Badge variant={results.category ? categoryBadgeVariant[results.category] ?? "default" : "default"} className="mt-1 text-sm">
                {results.category ? categoryLabel[results.category] ?? results.category : results.category}
              </Badge>
              <p className="mt-2 text-xs text-neutral-500">
                Scored {results.totalScore} out of {results.maxPossibleScore} points
              </p>
            </div>
          </div>
        </div>

        {Object.keys(domainScores).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Domain Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(domainScores).map(([domain, score]) => (
                <div key={domain} className={`border-l-4 ${scoreBorder(score)} rounded-r-xl bg-neutral-50 p-3 dark:bg-neutral-900`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{domain}</span>
                    <span className={`text-sm font-bold ${scoreColor(score)}`}>{score}%</span>
                  </div>
                  <Progress value={score} className="mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          {results.deepReport ? (
            <Button className="flex-1 gap-2" onClick={() => setView("deep-report")}>
              <Sparkles className="h-4 w-4" /> View Deep Report
            </Button>
          ) : (
            <Button className="flex-1 gap-2" onClick={handleRequestDeepReport} loading={requestDeepReport.isPending}>
              <Sparkles className="h-4 w-4" /> Get Deep Report
            </Button>
          )}
        </div>

        {history && history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Assessment History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { setSubmittedResponseId(h.id); setView("results"); }}
                  className="flex w-full items-center justify-between rounded-xl bg-neutral-50 p-3 text-left transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {h.completedAt ? new Date(h.completedAt).toLocaleDateString() : "N/A"}
                    </p>
                    <Badge variant={h.category ? categoryBadgeVariant[h.category] ?? "default" : "default"} className="mt-1 text-[10px]">
                      {h.category ? categoryLabel[h.category] ?? h.category : h.category}
                    </Badge>
                  </div>
                  <span className={`text-lg font-bold ${scoreColor(h.percentage)}`}>{h.percentage}%</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (view === "deep-report" && deepReport) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView("results")}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Results
          </Button>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Deep Report</h1>
        </div>
        <DeepReportSection report={deepReport} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/parent" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Parenting Assessment</h1>
          <p className="text-sm text-neutral-500">Answer honestly — there are no right or wrong answers</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-neutral-500">
          <span>Question {page * QUESTIONS_PER_PAGE + 1}–{Math.min((page + 1) * QUESTIONS_PER_PAGE, flatQuestions.length)} of {flatQuestions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <Progress value={progress} />
      </div>

      {currentDomain && (
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary-500" />
          <h2 className="text-sm font-semibold text-primary-600 dark:text-primary-400">{currentDomain}</h2>
        </div>
      )}

      <div className="space-y-3">
        {currentPageQuestions.map((q, idx) => (
          <div key={q.id} className="glass rounded-2xl p-5">
            <p className="mb-1 text-[11px] font-medium text-primary-500">{q.dimension}</p>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {page * QUESTIONS_PER_PAGE + idx + 1}. {q.text}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(q.id, opt.id)}
                  className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${
                    answers[q.id] === opt.id
                      ? "border-primary-400 bg-primary-50 text-primary-700 ring-1 ring-primary-300 dark:border-primary-600 dark:bg-primary-950 dark:text-primary-300"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + opt.order - 1)}.</span> {opt.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        {isLastPage ? (
          <Button
            className="gap-2"
            onClick={handleSubmit}
            disabled={!allAnswered || submitMutation.isPending}
            loading={submitMutation.isPending}
          >
            <CheckCircle className="h-4 w-4" /> Submit Assessment
          </Button>
        ) : (
          <Button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Previous Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => { setSubmittedResponseId(h.id); setView("results"); }}
                className="flex w-full items-center justify-between rounded-xl bg-neutral-50 p-3 text-left transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {h.completedAt ? new Date(h.completedAt).toLocaleDateString() : "N/A"}
                  </p>
                  <Badge variant={h.category ? categoryBadgeVariant[h.category] ?? "default" : "default"} className="mt-1 text-[10px]">
                    {h.category ? categoryLabel[h.category] ?? h.category : h.category}
                  </Badge>
                </div>
                <span className={`text-lg font-bold ${scoreColor(h.percentage)}`}>{h.percentage}%</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
