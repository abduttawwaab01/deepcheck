"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { CSVLink } from "@/components/report/csv-link";
import { generateBasicReportPDF, downloadBlob } from "@/lib/pdf/generate-report";

const circumference = 2 * Math.PI * 60;

export default function BasicReportPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: report, isLoading } = trpc.student.getBasicReport.useQuery({ id }, { enabled: !!id });

  function handleDownloadPDF() {
    if (!report) return;
    const blob = generateBasicReportPDF({
      studentName: (report as any).studentName || "Student",
      score: report.score,
      category: report.category,
      date: report.createdAt,
      topics: report.topics,
      strengths: report.strengths,
      weaknesses: report.weaknesses,
      recommendations: report.recommendations,
    });
    downloadBlob(blob, `basic-report-${id}.pdf`);
  }

  if (isLoading) return <div className="mx-auto max-w-4xl space-y-6"><div className="h-48 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" /></div>;
  if (!report) return <div className="mx-auto max-w-4xl py-8 text-center text-sm text-neutral-500">Report not found</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 min-[320px]:space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="min-h-[44px] gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <CSVLink data={[
            ["Metric", "Value"],
            ["Score", report.score],
            ["Category", report.category],
            ["Date", report.createdAt],
            ...report.topics.flatMap((t: any) => [
              [`Topic: ${t.name}`, `${t.score}%`],
            ]),
            ...report.strengths.map((s: string) => ["Strength", s]),
            ...report.weaknesses.map((w: string) => ["Weakness", w]),
            ...report.recommendations.map((r: any) => ["Recommendation", `${r.title}: ${r.description}`]),
          ]} filename={`basic-report-${id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 min-h-[44px] dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900">
            <Download className="h-4 w-4" />CSV
          </CSVLink>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="min-h-[44px] gap-1.5"><Download className="h-4 w-4" />PDF</Button>
          <Button variant="outline" size="sm" className="min-h-[44px] gap-1.5"><Share2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-neutral-800" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (report.score / 100) * circumference}
                className={cn("transition-all duration-1000", report.score >= 70 ? "text-success" : report.score >= 50 ? "text-warning" : "text-error")} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">{report.score}</span>
              <span className="text-[10px] text-neutral-500">{report.category}</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Basic Report Card</h1>
            <p className="mt-1 text-xs text-neutral-400">{report.createdAt}</p>
            <span className={cn("mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-medium",
              report.score >= 70 ? "bg-success/10 text-success" : report.score >= 50 ? "bg-warning/10 text-warning" : "bg-error/10 text-error")}>
              {report.category}
            </span>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Topic Breakdown</h2>
        <div className="space-y-3">
          {report.topics.map((t: any) => (
            <div key={t.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-neutral-900 dark:text-white">{t.name}</span>
                <span className={cn("text-xs", t.score >= 70 ? "text-success" : t.score >= 50 ? "text-warning" : "text-error")}>{t.score}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className={cn("h-full rounded-full transition-all", t.score >= 75 ? "bg-success" : t.score >= 60 ? "bg-primary-500" : t.score >= 40 ? "bg-warning" : "bg-error")}
                  style={{ width: `${t.score}%` }} />
              </div>
            </div>
          ))}
          {report.topics.length === 0 && <p className="text-sm text-neutral-500">No topic breakdown available</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold text-success">Strengths</h2>
          <ul className="space-y-2">
            {report.strengths.map((s: string) => (
              <li key={s} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />{s}
              </li>
            ))}
            {report.strengths.length === 0 && <li className="text-sm text-neutral-500">None recorded</li>}
          </ul>
        </div>
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold text-error">Weaknesses</h2>
          <ul className="space-y-2">
            {report.weaknesses.map((w: string) => (
              <li key={w} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-error" />{w}
              </li>
            ))}
            {report.weaknesses.length === 0 && <li className="text-sm text-neutral-500">None recorded</li>}
          </ul>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Recommendations</h2>
        <ol className="space-y-2">
          {report.recommendations.map((r: any, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">{i + 1}</span>
              <span className="text-neutral-700 dark:text-neutral-300"><strong>{r.title}</strong>: {r.description}</span>
            </li>
          ))}
          {report.recommendations.length === 0 && <li className="text-sm text-neutral-500">No recommendations</li>}
        </ol>
      </div>
    </div>
  );
}
