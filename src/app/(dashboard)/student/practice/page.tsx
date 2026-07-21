"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Brain, CheckCircle2, ArrowRight, RotateCcw, Sparkles, Target } from "lucide-react";

export default function PracticePage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [conceptFilter, setConceptFilter] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const startTimeRef = useRef<number>(0);

  const { data: questionsData, isLoading: questionsLoading } = trpc.assessment.getPracticeQuestions.useQuery(
    { slug: selectedSlug, conceptFilter: conceptFilter || undefined },
    { enabled: started && !!selectedSlug },
  );

  const questions = questionsData?.questions || [];
  const current = questions[currentIndex];
  const total = questions.length;

  const handleStart = () => {
    setStarted(true);
    setAnswers({});
    setCurrentIndex(0);
    setCompleted(false);
    startTimeRef.current = Date.now();
  };

  const handleComplete = useCallback(() => {
    setCompleted(true);
  }, []);

  if (!started) {
    return (
      <div className="animate-fade-in mx-auto max-w-lg space-y-6 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-info">
            <Target className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Practice Mode</h1>
          <p className="mt-2 text-sm text-neutral-500">Sharpen your skills with targeted practice questions</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500">Assessment Level</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            >
              <option value="">Choose a level...</option>
              <option value="primary-to-jss1">Primary to JSS1</option>
              <option value="jss3-to-ss1">JSS3 to SS1</option>
              <option value="ss3-to-university">SS3 to University</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500">Focus Concept (optional)</label>
            <input
              type="text"
              value={conceptFilter}
              onChange={(e) => setConceptFilter(e.target.value)}
              placeholder="e.g. Algebra, Fractions..."
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950"
            />
          </div>
          <Button size="lg" className="w-full" onClick={handleStart} disabled={!selectedSlug}>
            <Sparkles className="mr-2 h-4 w-4" />Start Practice
          </Button>
        </div>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg rounded-2xl p-8 text-center">
        <p className="text-sm text-neutral-500">No practice questions available for this selection</p>
        <Button variant="outline" className="mt-4" onClick={() => setStarted(false)}>Go Back</Button>
      </div>
    );
  }

  if (completed) {
    const correctCount = questions.filter((q: any) => answers[q.id] === q.correctOptionId).length;
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);

    return (
      <div className="animate-fade-in mx-auto max-w-lg py-8 text-center">
        <div className="glass rounded-2xl p-8">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h2 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">Practice Complete</h2>
          <div className="mt-4">
            <span className="text-5xl font-extrabold text-primary-600">{pct}%</span>
            <p className="mt-1 text-sm text-neutral-500">{correctCount}/{total} correct</p>
          </div>
          <div className="mt-6 space-y-2">
            {questions.map((q: any, i: number) => {
              const isCorrect = answers[q.id] === q.correctOptionId;
              return (
                <div key={q.id} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                  isCorrect ? "bg-success/5 text-success" : "bg-error/5 text-error"
                )}>
                  {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border-2 border-current" />}
                  <span className="truncate">{q.questionText?.slice(0, 60)}...</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setStarted(false); setAnswers({}); setCurrentIndex(0); setCompleted(false); }}>
              <RotateCcw className="mr-2 h-4 w-4" />New Practice
            </Button>
            <Button className="flex-1" onClick={handleStart}>
              <RotateCcw className="mr-2 h-4 w-4" />Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-2xl space-y-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-500">Practice - {selectedSlug.replace(/-/g, " ")}</h2>
        <span className="text-xs text-neutral-400">{currentIndex + 1}/{total}</span>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6">
        {current && (
          <>
            <div className="mb-1 text-xs font-medium text-neutral-400">
              {current.bloomLevel && <span className="capitalize">{current.bloomLevel}</span>}
              {current.concept && <span> &middot; {current.concept}</span>}
            </div>
            <p className="mt-2 text-base font-medium text-neutral-900 sm:text-lg dark:text-white">{current.questionText}</p>
            <div className="mt-5 space-y-3">
              {current.options?.map((opt: any) => {
                const isSelected = answers[current.id] === opt.id;
                return (
                  <button key={opt.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: opt.id }))}
                    className={cn("flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px]",
                      isSelected
                        ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                    )}
                  >
                    <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      isSelected ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                    )}>
                      {String.fromCharCode(65 + current.options.indexOf(opt))}
                    </span>
                    {opt.text || opt.optionText}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
          Previous
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button onClick={() => { if (answers[current?.id]) setCurrentIndex(currentIndex + 1); }} disabled={!answers[current?.id]}>
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={Object.keys(answers).length < questions.length}>
            <CheckCircle2 className="mr-1 h-4 w-4" /> Finish
          </Button>
        )}
      </div>
    </div>
  );
}
