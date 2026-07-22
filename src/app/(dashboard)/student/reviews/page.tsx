"use client";

import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Brain, Calendar, Clock, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

const urgencyColors: Record<string, string> = {
  overdue: "bg-error/10 text-error border-error/30",
  due_soon: "bg-warning/10 text-warning border-warning/30",
  on_track: "bg-info/10 text-info border-info/30",
  fresh: "bg-success/10 text-success border-success/30",
};

const urgencyLabels: Record<string, string> = {
  overdue: "Overdue - Review Now",
  due_soon: "Due Soon",
  on_track: "On Track",
  fresh: "Recently Learned",
};

export default function ReviewSchedulePage() {
  const { data: schedule, isLoading, refetch } = trpc.student.getSpacedRepetitionSchedule.useQuery();

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    );
  }

  const items = schedule || [];
  const overdue = items.filter((s: any) => s.reviewUrgency === "overdue");
  const dueSoon = items.filter((s: any) => s.reviewUrgency === "due_soon");
  const onTrack = items.filter((s: any) => s.reviewUrgency === "on_track");
  const fresh = items.filter((s: any) => s.reviewUrgency === "fresh");

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Review Schedule</h1>
          <p className="mt-1 text-sm text-neutral-500">Spaced repetition keeps your knowledge fresh</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center justify-center rounded-xl border border-neutral-200 p-3 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900 min-h-[44px] min-w-[44px]">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <Brain className="mx-auto h-10 w-10 text-neutral-300" />
          <h3 className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">No topics to review</h3>
          <p className="mt-1 text-xs text-neutral-500">Complete an assessment to start tracking your review schedule</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-error">{overdue.length}</div>
              <div className="text-xs text-neutral-500">Overdue</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-warning">{dueSoon.length}</div>
              <div className="text-xs text-neutral-500">Due Soon</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-info">{onTrack.length}</div>
              <div className="text-xs text-neutral-500">On Track</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-success">{fresh.length}</div>
              <div className="text-xs text-neutral-500">Fresh</div>
            </div>
          </div>

          {/* Priority queue */}
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.topicId} className={cn("glass rounded-2xl p-4 border", urgencyColors[item.reviewUrgency] || "border-neutral-200 dark:border-neutral-800")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      item.reviewUrgency === "overdue" ? "bg-error/10" :
                      item.reviewUrgency === "due_soon" ? "bg-warning/10" :
                      item.reviewUrgency === "on_track" ? "bg-info/10" : "bg-success/10"
                    )}>
                      {item.reviewUrgency === "overdue" ? <AlertTriangle className="h-5 w-5 text-error" /> :
                       item.reviewUrgency === "fresh" ? <CheckCircle2 className="h-5 w-5 text-success" /> :
                       <Brain className="h-5 w-5 text-info" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.topicName}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{urgencyLabels[item.reviewUrgency] || item.reviewUrgency}</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.nextReviewDate?.split("T")[0]}</span>
                        <span>&middot;</span>
                        <span>Interval: {item.nextInterval}d</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-lg font-bold",
                      item.retentionAtNextReview >= 0.7 ? "text-success" :
                      item.retentionAtNextReview >= 0.5 ? "text-warning" : "text-error"
                    )}>
                      {Math.round(item.retentionAtNextReview * 100)}%
                    </div>
                    <div className="text-[10px] text-neutral-500">Est. retention</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
