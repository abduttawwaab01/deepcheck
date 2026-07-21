"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle2, AlertCircle, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

const options = ["A", "B", "C", "D"];

export default function SchoolAssessmentPage() {
  const { data: assessment, isLoading } = trpc.school.getSchoolAssessment.useQuery();
  const submitMutation = trpc.school.submitSchoolAssessment.useMutation();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);

  const questions = assessment || [];
  const questionCount = questions.length;

  const handleAnswer = useCallback(async (optionId: string) => {
    if (!questions[current]) return;
    setSelected(optionId);
    const qId = questions[current].id;
    const newAnswers = { ...answers, [qId]: optionId };
    setAnswers(newAnswers);
    await new Promise((r) => setTimeout(r, 400));
    if (current >= questionCount - 1) {
      const resp = Object.entries(newAnswers).map(([questionId, optionId]) => ({ questionId, optionId }));
      submitMutation.mutate({ responses: resp }, {
        onSuccess: (data) => {
          setResult({ score: data.score, maxScore: data.maxScore });
          setComplete(true);
        },
      });
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
    }
  }, [current, answers, questions, questionCount, submitMutation]);

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-32 w-full max-w-md animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" /></div>;
  }

  if (questionCount === 0) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-neutral-500">No assessment questions available.</div>;
  }

  if (complete && result) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"><CheckCircle2 className="h-10 w-10 text-success" /></div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Assessment Complete!</h1>
        <p className="mt-2 text-sm text-neutral-500">Your school quality assessment has been submitted.</p>
        <div className="glass mx-auto mt-6 w-40 rounded-2xl p-5">
          <div className="text-4xl font-extrabold text-primary-600">{Math.round((result.score / result.maxScore) * 100)}</div>
          <div className="text-sm font-medium text-primary-600">Quality Score</div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => { setStarted(false); setCurrent(0); setAnswers({}); setComplete(false); setResult(null); }}>Retake</Button>
        </div>
      </motion.div>
    </div>
  );

  if (!started) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg"><ClipboardCheck className="h-8 w-8" /></div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">School Quality Assessment</h1>
        <p className="mt-2 text-sm text-neutral-500">Evaluate your school across {questionCount} key dimensions to identify strengths and areas for improvement.</p>
        <div className="glass mx-auto mt-6 flex max-w-xs items-center justify-center gap-6 rounded-2xl py-4 text-sm">
          <div><div className="text-lg font-bold text-neutral-900 dark:text-white">{questionCount}</div><div className="text-xs text-neutral-500">Questions</div></div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div><div className="text-lg font-bold text-neutral-900 dark:text-white">~5</div><div className="text-xs text-neutral-500">Minutes</div></div>
        </div>
        <Button size="lg" className="mt-6 w-full gap-2" onClick={() => setStarted(true)}><Play className="h-4 w-4" /> Start Assessment</Button>
      </div>
    </div>
  );

  const q = questions[current];
  const progress = Math.round(((current + 1) / questionCount) * 100);

  return (
    <div className="min-h-[60vh]">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-neutral-900 dark:text-white">Question {current + 1} of {questionCount}</span>
          <span className="flex items-center gap-1 text-neutral-500"><Clock className="h-4 w-4" /> ~5 min</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">{q.text}</h2>
        <div className="mt-6 grid gap-3">
          {q.options.map((o: any) => (
            <button key={o.id} onClick={() => handleAnswer(o.id)} disabled={selected !== null}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected === o.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950" : "border-neutral-200 bg-white hover:border-primary-300 dark:border-neutral-700 dark:bg-neutral-950"
              } ${selected !== null ? "cursor-default" : "cursor-pointer"}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                selected === o.id ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}>{options[o.order - 1] || o.order}</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{o.text}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Select an answer to continue</span>
        <span>{questionCount - current - 1} remaining</span>
      </div>
    </div>
  );
}
