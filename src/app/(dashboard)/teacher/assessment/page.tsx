"use client";

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Play, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

export default function TeacherAssessmentPage() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [result, setResult] = useState<{ score: number; category: string } | null>(null);

  const { data: assessment } = trpc.teacher.getAssessment.useQuery(
    { assessmentId: "tq-001" },
    { enabled: started }
  );

  const submitAnswer = trpc.teacher.submitAnswer.useMutation();
  const complete = trpc.teacher.completeAssessment.useMutation();

  useEffect(() => {
    if (!started || result) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [started, result]);

  const handleComplete = useCallback(async () => {
    const res = await complete.mutateAsync({ instanceId: "tq-001" });
    setResult({ score: res.score, category: res.category });
  }, [complete]);

  useEffect(() => {
    if (timeLeft === 0 && started && !result) handleComplete();
  }, [timeLeft, started, result, handleComplete]);

  const handleNext = async () => {
    if (!assessment) return;
    await submitAnswer.mutateAsync({
      instanceId: "tq-001",
      itemId: assessment.currentItem.id,
      selectedOptions: selected,
    });
    setSelected([]);
    if (currentIdx < assessment.totalItems - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      handleComplete();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = assessment ? ((currentIdx + 1) / assessment.totalItems) * 100 : 0;

  if (result) return (
    <div className="animate-scale-in flex flex-col items-center justify-center py-12 text-center">
      <div className="glass rounded-2xl p-8 sm:p-10 max-w-sm w-full">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Assessment Complete</h2>
        <div className="mt-6">
          <span className="text-5xl font-extrabold text-primary-600">{result.score}</span>
          <p className="mt-1 text-sm capitalize text-neutral-500">{result.category}</p>
        </div>
        <Button className="mt-6 w-full" onClick={() => window.location.href = "/teacher/reports"}>View Reports</Button>
      </div>
    </div>
  );

  if (!started) return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
      <div className="glass rounded-2xl p-6 sm:p-8 max-w-sm w-full">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900">
          <Clock className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Teacher Quality Assessment</h1>
        <p className="mt-2 text-sm text-neutral-500">12 questions about your teaching practice</p>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-neutral-500">
          <Clock className="h-4 w-4" /><span>20 min time limit</span>
        </div>
        <Button size="lg" className="mt-6 w-full gap-2" onClick={() => setStarted(true)}>
          <Play className="h-4 w-4" /> Start Assessment
        </Button>
      </div>
    </div>
  );

  if (!assessment) return (
    <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{currentIdx + 1} of {assessment.totalItems}</span>
            <span className={cn("flex items-center gap-1 font-medium", timeLeft < 120 ? "text-error" : "text-neutral-500")}>
              <Clock className="h-3.5 w-3.5" />
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 sm:p-6">
        <p className="text-base font-medium text-neutral-900 sm:text-lg dark:text-white">{assessment.currentItem.text}</p>
        <div className="mt-5 space-y-3">
          {assessment.currentItem.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <button key={opt.id} onClick={() => setSelected(isSelected ? selected.filter((id) => id !== opt.id) : [opt.id])}
                className={cn("flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px]", isSelected ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300")}
              >
                <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium", isSelected ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800")}>{opt.order}</span>
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))} disabled={currentIdx === 0} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext} disabled={selected.length === 0 || submitAnswer.isPending} className="gap-1.5">
          {currentIdx < assessment.totalItems - 1 ? <>Next <ArrowRight className="h-4 w-4" /></> : "Complete"}
          {submitAnswer.isPending && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        </Button>
      </div>
    </div>
  );
}
