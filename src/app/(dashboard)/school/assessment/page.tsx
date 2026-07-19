"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle2, AlertCircle, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

const questions = [
  { id: "q1", text: "How effective is the school's curriculum in meeting learning objectives?", options: [{ id: "a", text: "Not effective", order: 1 }, { id: "b", text: "Somewhat effective", order: 2 }, { id: "c", text: "Effective", order: 3 }, { id: "d", text: "Highly effective", order: 4 }] },
  { id: "q2", text: "How would you rate teacher-student interaction quality?", options: [{ id: "a", text: "Poor", order: 1 }, { id: "b", text: "Fair", order: 2 }, { id: "c", text: "Good", order: 3 }, { id: "d", text: "Excellent", order: 4 }] },
  { id: "q3", text: "How adequate are the school's learning facilities?", options: [{ id: "a", text: "Inadequate", order: 1 }, { id: "b", text: "Below average", order: 2 }, { id: "c", text: "Adequate", order: 3 }, { id: "d", text: "Excellent", order: 4 }] },
  { id: "q4", text: "How well does the school support student well-being?", options: [{ id: "a", text: "Poorly", order: 1 }, { id: "b", text: "Minimally", order: 2 }, { id: "c", text: "Well", order: 3 }, { id: "d", text: "Very well", order: 4 }] },
  { id: "q5", text: "How effective is the school's assessment system?", options: [{ id: "a", text: "Not effective", order: 1 }, { id: "b", text: "Somewhat effective", order: 2 }, { id: "c", text: "Effective", order: 3 }, { id: "d", text: "Highly effective", order: 4 }] },
  { id: "q6", text: "How would you rate parental involvement levels?", options: [{ id: "a", text: "Very low", order: 1 }, { id: "b", text: "Low", order: 2 }, { id: "c", text: "Moderate", order: 3 }, { id: "d", text: "High", order: 4 }] },
  { id: "q7", text: "How innovative is the school's teaching approach?", options: [{ id: "a", text: "Not innovative", order: 1 }, { id: "b", text: "Slightly innovative", order: 2 }, { id: "c", text: "Innovative", order: 3 }, { id: "d", text: "Very innovative", order: 4 }] },
  { id: "q8", text: "How safe is the school environment?", options: [{ id: "a", text: "Unsafe", order: 1 }, { id: "b", text: "Somewhat safe", order: 2 }, { id: "c", text: "Safe", order: 3 }, { id: "d", text: "Very safe", order: 4 }] },
  { id: "q9", text: "How well does the school prepare students for exams?", options: [{ id: "a", text: "Poorly", order: 1 }, { id: "b", text: "Adequately", order: 2 }, { id: "c", text: "Well", order: 3 }, { id: "d", text: "Very well", order: 4 }] },
  { id: "q10", text: "How would you rate administrative efficiency?", options: [{ id: "a", text: "Inefficient", order: 1 }, { id: "b", text: "Needs improvement", order: 2 }, { id: "c", text: "Efficient", order: 3 }, { id: "d", text: "Highly efficient", order: 4 }] },
  { id: "q11", text: "How inclusive is the school's learning environment?", options: [{ id: "a", text: "Not inclusive", order: 1 }, { id: "b", text: "Somewhat inclusive", order: 2 }, { id: "c", text: "Inclusive", order: 3 }, { id: "d", text: "Fully inclusive", order: 4 }] },
  { id: "q12", text: "How well does the school leverage technology?", options: [{ id: "a", text: "Not at all", order: 1 }, { id: "b", text: "Minimally", order: 2 }, { id: "c", text: "Adequately", order: 3 }, { id: "d", text: "Excellently", order: 4 }] },
];

const options = ["A", "B", "C", "D"];

export default function SchoolAssessmentPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = useCallback(async (optionId: string) => {
    setSelected(optionId);
    setAnswers((p) => ({ ...p, [`q${current}`]: optionId }));
    await new Promise((r) => setTimeout(r, 400));
    if (current >= 11) {
      const vals = Object.values({ ...answers, [`q${current}`]: optionId });
      const avg = Math.round((vals.length * 100) / 12);
      setScore(avg);
      setComplete(true);
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
    }
  }, [current, answers]);

  if (complete) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"><CheckCircle2 className="h-10 w-10 text-success" /></div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Assessment Complete!</h1>
        <p className="mt-2 text-sm text-neutral-500">Your school quality assessment has been submitted.</p>
        <div className="glass mx-auto mt-6 w-40 rounded-2xl p-5">
          <div className="text-4xl font-extrabold text-primary-600">{score}</div>
          <div className="text-sm font-medium text-primary-600">Quality Score</div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => { setStarted(false); setCurrent(0); setAnswers({}); setComplete(false); }}>Retake</Button>
        </div>
      </motion.div>
    </div>
  );

  if (!started) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg"><ClipboardCheck className="h-8 w-8" /></div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">School Quality Assessment</h1>
        <p className="mt-2 text-sm text-neutral-500">Evaluate your school across 12 key dimensions to identify strengths and areas for improvement.</p>
        <div className="glass mx-auto mt-6 flex max-w-xs items-center justify-center gap-6 rounded-2xl py-4 text-sm">
          <div><div className="text-lg font-bold text-neutral-900 dark:text-white">12</div><div className="text-xs text-neutral-500">Questions</div></div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div><div className="text-lg font-bold text-neutral-900 dark:text-white">~5</div><div className="text-xs text-neutral-500">Minutes</div></div>
        </div>
        <Button size="lg" className="mt-6 w-full gap-2" onClick={() => setStarted(true)}><Play className="h-4 w-4" /> Start Assessment</Button>
      </div>
    </div>
  );

  const q = questions[current];
  const progress = Math.round(((current + 1) / 12) * 100);

  return (
    <div className="min-h-[60vh]">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-neutral-900 dark:text-white">Question {current + 1} of 12</span>
          <span className="flex items-center gap-1 text-neutral-500"><Clock className="h-4 w-4" /> ~5 min</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">{q.text}</h2>
        <div className="mt-6 grid gap-3">
          {q.options.map((o) => (
            <button key={o.id} onClick={() => handleAnswer(o.id)} disabled={selected !== null}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected === o.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950" : "border-neutral-200 bg-white hover:border-primary-300 dark:border-neutral-700 dark:bg-neutral-950"
              } ${selected !== null ? "cursor-default" : "cursor-pointer"}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                selected === o.id ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}>{options[o.order - 1]}</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{o.text}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Select an answer to continue</span>
        <span>{12 - current - 1} remaining</span>
      </div>
    </div>
  );
}
