"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Brain, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, ChevronDown, ChevronUp, Filter } from "lucide-react";

const qualityColors: Record<string, string> = {
  excellent: "bg-success/10 text-success",
  good: "bg-info/10 text-info",
  acceptable: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
  marginal: "bg-warning/10 text-warning",
  poor: "bg-error/10 text-error",
  reject: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TeacherAnalyticsPage() {
  const [selectedInstance, setSelectedInstance] = useState<string>("");
  const { data: instances } = trpc.teacher.getInstances.useQuery();
  const { data: analysis, isLoading } = trpc.assessment.getItemAnalysis.useQuery(
    { instanceId: selectedInstance },
    { enabled: !!selectedInstance },
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Item Analysis</h1>
        <p className="mt-1 text-sm text-neutral-500">Question quality analysis for your assessments</p>
      </div>

      {/* Instance Selector */}
      <div className="glass rounded-2xl p-4">
        <label className="text-xs font-medium text-neutral-500">Select Assessment Instance</label>
        <select
          value={selectedInstance}
          onChange={(e) => setSelectedInstance(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        >
          <option value="">Choose an assessment...</option>
          {(instances || []).map((inst: any) => (
            <option key={inst.id} value={inst.id}>
              {inst.assessmentType} — {inst.startedAt?.split("T")[0]} {inst.thetaEstimate != null ? `(θ=${Number(inst.thetaEstimate).toFixed(2)})` : ""}
            </option>
          ))}
        </select>
      </div>

      {!selectedInstance && (
        <div className="glass rounded-2xl p-8 text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-neutral-300" />
          <h3 className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Select an assessment to analyze</h3>
          <p className="mt-1 text-xs text-neutral-500">Choose from your completed assessments above</p>
        </div>
      )}

      {isLoading && selectedInstance && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}
        </div>
      )}

      {analysis && !isLoading && (
        <>
          {/* Summary Cards */}
          {analysis.summary && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">{analysis.summary.totalItems}</div>
                <div className="text-xs text-neutral-500">Total Items</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className={cn("text-2xl font-bold", analysis.summary.meanDiscrimination >= 0.3 ? "text-success" : "text-warning")}>
                  {analysis.summary.meanDiscrimination.toFixed(2)}
                </div>
                <div className="text-xs text-neutral-500">Mean Discrimination</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {Math.round(analysis.summary.meanDifficulty * 100)}%
                </div>
                <div className="text-xs text-neutral-500">Mean Difficulty</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className={cn("text-2xl font-bold", analysis.summary.problemItems.length === 0 ? "text-success" : "text-error")}>
                  {analysis.summary.problemItems.length}
                </div>
                <div className="text-xs text-neutral-500">Problem Items</div>
              </div>
            </div>
          )}

          {/* Item Quality Distribution */}
          {analysis.summary && (
            <div className="glass rounded-2xl p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Item Quality Distribution</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {Object.entries(analysis.summary.itemsByQuality).map(([quality, count]) => (
                  <div key={quality} className={cn("rounded-xl p-3 text-center", qualityColors[quality] || "bg-neutral-100")}>
                    <div className="text-lg font-bold">{count as number}</div>
                    <div className="text-xs capitalize">{quality}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.summary?.suggestedRevisions && analysis.summary.suggestedRevisions.length > 0 && (
            <div className="glass rounded-2xl p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Suggested Revisions</h3>
              <div className="space-y-2">
                {analysis.summary.suggestedRevisions.map((suggestion: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <p className="text-xs text-neutral-700 dark:text-neutral-300">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Item Details */}
          {analysis.items && analysis.items.length > 0 && (
            <div className="glass rounded-2xl p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Item Details</h3>
              <div className="space-y-2">
                {analysis.items.map((item: any) => (
                  <ItemRow key={item.questionId} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ItemRow({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-100 dark:border-neutral-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={cn("rounded-lg px-2 py-1 text-xs font-medium", qualityColors[item.qualityRating] || "bg-neutral-100")}>
            {item.qualityRating}
          </span>
          <span className="text-xs text-neutral-500">{item.questionId.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span>D: {item.difficultyIndex.toFixed(2)}</span>
          <span>Disc: {item.discriminationIndex.toFixed(2)}</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-neutral-100 px-3 pb-3 dark:border-neutral-800">
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div><span className="text-neutral-500">Upper Acc:</span> {Math.round(item.upperGroupAccuracy * 100)}%</div>
            <div><span className="text-neutral-500">Lower Acc:</span> {Math.round(item.lowerGroupAccuracy * 100)}%</div>
            <div><span className="text-neutral-500">Point-Biserial:</span> {item.pointBiserial.toFixed(3)}</div>
            <div><span className="text-neutral-500">Median Time:</span> {item.responseTimeStats?.median || 0}s</div>
          </div>
          {item.distractorAnalysis && item.distractorAnalysis.length > 0 && (
            <div className="mt-2">
              <span className="text-[10px] font-medium text-neutral-500">Distractor Analysis:</span>
              <div className="mt-1 flex gap-2">
                {item.distractorAnalysis.map((d: any) => (
                  <span key={d.optionId} className={cn("rounded px-1.5 py-0.5 text-[10px]",
                    d.isEffective ? "bg-success/10 text-success" : "bg-error/10 text-error"
                  )}>
                    {d.totalPct ? `${Math.round(d.totalPct * 100)}%` : "0%"} {d.isCorrect ? "(correct)" : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
