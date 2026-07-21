"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { StandardRenderer, PassageRenderer, ChartQuestionRenderer, GeometryQuestionRenderer, InteractiveRenderer } from "@/components/assessment/question-renderer";
import { FloatingCalculator } from "@/components/calculator/floating-calculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";
import { ProctoringMonitor } from "@/lib/engine/client-proctoring";

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: assessment, isLoading } = trpc.assessment.getBySlug.useQuery({ slug: id }, { enabled: !!id });
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const startMutation = trpc.assessment.startAssessment.useMutation();
  const completeMutation = trpc.assessment.completeAssessment.useMutation();
  const logProctorMutation = trpc.assessment.logProctorEvent.useMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const questionStartTimeRef = useRef<number>(0);
  const questionTimesRef = useRef<Record<string, number>>({});
  const proctorRef = useRef<ProctoringMonitor | null>(null);

  useEffect(() => {
    if (assessment && !started) {
      setTimeRemaining(assessment.timeLimitMinutes * 60);
    }
  }, [assessment, started]);

  useEffect(() => {
    if (!started || completed || !timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { handleComplete(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, completed]);

  const recordQuestionTime = useCallback(() => {
    if (questionStartTimeRef.current > 0) {
      const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
      const qId = assessment?.questions[currentIndex]?.id;
      if (qId) {
        questionTimesRef.current[qId] = (questionTimesRef.current[qId] || 0) + elapsed;
      }
    }
    questionStartTimeRef.current = Date.now();
  }, [assessment, currentIndex]);

  const handleComplete = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!assessment || !instanceId) return;
    recordQuestionTime();
    proctorRef.current?.stop();
    let correct = 0;
    assessment.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    const pct = Math.round((correct / assessment.questions.length) * 100);
    setScore(pct);
    setCompleted(true);
    setSaving(true);
    try {
      const timeSpent = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
      await completeMutation.mutateAsync({
        instanceId,
        answers,
        timeSpentSeconds: timeSpent,
        questionTimes: questionTimesRef.current,
      });
    } catch {
      // silently fail - score is still shown client-side
    }
    setSaving(false);
  }, [assessment, answers, instanceId, completeMutation, recordQuestionTime]);

  const handleStart = async () => {
    try {
      const res = await startMutation.mutateAsync({ slug: id });
      if (res.error) return;
      setInstanceId(res.instanceId!);
      startTimeRef.current = Date.now();
      questionStartTimeRef.current = Date.now();
      setStarted(true);
      // Start proctoring monitor
      const monitor = new ProctoringMonitor(res.instanceId!, (event) => {
        logProctorMutation.mutate({
          instanceId: res.instanceId!,
          eventType: event.eventType as any,
          metadata: event.metadata,
        });
      });
      monitor.start();
      proctorRef.current = monitor;
    } catch {
      startTimeRef.current = Date.now();
      questionStartTimeRef.current = Date.now();
      setStarted(true);
    }
  };

  useEffect(() => {
    return () => { proctorRef.current?.stop(); };
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </main>
    );
  }

  if (!assessment) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="glass max-w-md rounded-2xl p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-error" />
          <h1 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">Assessment not found</h1>
          <p className="mt-2 text-sm text-neutral-500">The assessment ID &quot;{id}&quot; does not exist.</p>
          <Button className="mt-6" onClick={() => router.push("/student/assessments")}>View Assessments</Button>
        </div>
      </main>
    );
  }

  const questions = assessment.questions;
  const current = questions[currentIndex];
  const progress = Math.round(((currentIndex + (answers[current?.id] ? 1 : 0)) / questions.length) * 100);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const answeredCount = Object.keys(answers).length;
  const section = assessment.sections.find((s) => {
    let idx = 0;
    for (const sec of assessment.sections) {
      if (idx + sec.count > currentIndex) return sec.name === s.name;
      idx += sec.count;
    }
    return false;
  });

  const renderQuestion = () => {
    if (!current) return null;
    const selected = answers[current.id] || null;
    const onSelect = (optId: string) => setAnswers((prev) => ({ ...prev, [current.id]: optId }));

    switch (current.renderer) {
      case "passage": return <PassageRenderer question={current} selected={selected} onSelect={onSelect} />;
      case "chart": return <ChartQuestionRenderer question={current} selected={selected} onSelect={onSelect} />;
      case "geometry": return <GeometryQuestionRenderer question={current} selected={selected} onSelect={onSelect} />;
      case "interactive": return <InteractiveRenderer question={current} selected={selected} onSelect={onSelect} />;
      default: return <StandardRenderer question={current} selected={selected} onSelect={onSelect} />;
    }
  };

  if (!started) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="mx-auto w-full max-w-lg">
          <div className="glass rounded-2xl p-6 sm:p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">{assessment.title}</h1>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">{assessment.description}</p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <div className="text-lg font-bold text-neutral-900 dark:text-white">{assessment.questionCount}</div>
                <div className="text-xs text-neutral-500">Questions</div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <div className="text-lg font-bold text-neutral-900 dark:text-white">{assessment.timeLimitMinutes}</div>
                <div className="text-xs text-neutral-500">Minutes</div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <div className="text-lg font-bold text-neutral-900 dark:text-white">{assessment.sections.length}</div>
                <div className="text-xs text-neutral-500">Sections</div>
              </div>
            </div>

              <p className="mt-2 text-xs text-neutral-400">Questions are randomly selected &mdash; retakes will differ</p>
              <div className="mt-4 space-y-2 text-left">
                {assessment.sections.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm dark:bg-neutral-900">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.name}</span>
                    <span className="text-xs text-neutral-500">{s.count} questions</span>
                  </div>
                ))}
              </div>

            <div className="mt-6 flex flex-col gap-3">
              <p className="text-xs text-neutral-400">A calculator is available during the assessment.</p>
              <Button size="lg" className="w-full min-h-[48px]" onClick={handleStart}>
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (completed) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    const total = questions.length;
    const grade = score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 50 ? "Fair" : score >= 35 ? "Weak" : "Critical";
    const gradeColor = score >= 80 ? "text-success" : score >= 65 ? "text-primary-500" : score >= 50 ? "text-warning" : "text-error";

    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="mx-auto w-full max-w-lg">
          <div className="glass rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500">
              <CheckCircle2 className={`h-10 w-10 ${saving ? "animate-pulse" : ""}`} />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Assessment Complete</h1>
            <p className="mt-2 text-sm text-neutral-500">You have completed the {assessment.title}</p>

            <div className="mt-6">
              <div className={`text-5xl font-extrabold ${gradeColor}`}>{score}%</div>
              <div className={`mt-1 text-lg font-semibold ${gradeColor}`}>{grade}</div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <div className="font-bold text-neutral-900 dark:text-white">{correctCount}/{total}</div>
                <div className="text-xs text-neutral-500">Correct</div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <div className="font-bold text-neutral-900 dark:text-white">{total - correctCount}/{total}</div>
                <div className="text-xs text-neutral-500">Incorrect</div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs text-neutral-400 text-left">
                A detailed breakdown of your performance will be available in your reports.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button size="lg" className="w-full min-h-[48px]" onClick={() => router.push("/student/reports")}>
                View My Reports
              </Button>
              <Button variant="outline" size="lg" className="w-full min-h-[48px]" onClick={() => {
                setStarted(false); setCompleted(false); setCurrentIndex(0); setAnswers({}); setFlagged(new Set()); setScore(0);
              }}>
                Retake Assessment
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-4 sm:p-6">
      <FloatingCalculator />

      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-neutral-500">
            <Clock className="h-4 w-4" />
            <span className={`font-mono font-medium ${timeRemaining < 60 ? "text-error" : "text-neutral-700 dark:text-neutral-300"}`}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </span>
          <span className="text-neutral-400">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {section && (
        <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-md bg-primary-50 px-2 py-0.5 font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            {section.name}
          </span>
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
      )}

      <div className="glass rounded-2xl p-4 sm:p-6">
        {current && (
          <>
            <div className="mb-1 flex items-start justify-between">
              <span className="text-xs font-medium text-neutral-400">
                {current.bloomLevel.charAt(0).toUpperCase() + current.bloomLevel.slice(1)} &middot; {current.concept}
              </span>
              <button
                onClick={() => {
                  const next = new Set(flagged);
                  if (next.has(current.id)) next.delete(current.id); else next.add(current.id);
                  setFlagged(next);
                }}
                className={`rounded p-1 transition-colors ${flagged.has(current.id) ? "text-warning" : "text-neutral-300 hover:text-neutral-400"}`}
              >
                <Flag className="h-4 w-4" fill={flagged.has(current.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-3">
              {renderQuestion()}
            </div>
          </>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Button
            variant="ghost"
            onClick={() => { recordQuestionTime(); setCurrentIndex(Math.max(0, currentIndex - 1)); }}
            disabled={currentIndex === 0}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          <div className="text-xs text-neutral-400">
            {answeredCount}/{questions.length} answered
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() => { recordQuestionTime(); setCurrentIndex(currentIndex + 1); }}
              className="gap-1"
              disabled={!answers[current?.id]}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setShowReview(true)} className="gap-1" disabled={answeredCount < questions.length}>
              <CheckCircle2 className="h-4 w-4" /> Finish
            </Button>
          )}
        </div>
      </div>

      {showReview && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-neutral-900 animate-slide-up">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Review Your Answers</h2>
            <p className="mt-1 text-sm text-neutral-500">{answeredCount} of {questions.length} answered</p>

            <div className="mt-4 grid grid-cols-6 gap-2">
              {questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = flagged.has(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIndex(i); setShowReview(false); }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      isAnswered ? "bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                    } ${isFlagged ? "ring-2 ring-warning" : ""}`}
                  >
                    {isFlagged ? "!" : i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowReview(false)}>Continue</Button>
              <Button className="flex-1" onClick={handleComplete} disabled={saving}>
                {saving ? "Saving..." : "Submit All"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
