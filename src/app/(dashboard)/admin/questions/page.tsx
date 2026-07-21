"use client";

import { useMemo, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Search, Plus, Settings2, Edit2, Trash2, Eye, Database, BookOpen, Sparkles, GraduationCap, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  "Primary → JSS": GraduationCap,
  "JSS → SSS": BookOpen,
  "SSS → University": Sparkles,
};

const gradientMap: Record<string, string> = {
  "Primary → JSS": "from-emerald-500 to-teal-500",
  "JSS → SSS": "from-blue-500 to-indigo-500",
  "SSS → University": "from-primary-500 to-secondary-500",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-error/10 text-error",
};

const bloomColors: Record<string, string> = {
  remember: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  understand: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  apply: "bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400",
  analyze: "bg-secondary-100 text-secondary-600 dark:bg-secondary-950 dark:text-secondary-400",
  evaluate: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
};

interface QuestionForm {
  questionText: string;
  concept: string;
  difficultyLevel: "easy" | "medium" | "hard";
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate";
  options: { optionText: string; isCorrect: boolean }[];
  explanation: string;
}

const emptyForm: QuestionForm = {
  questionText: "",
  concept: "",
  difficultyLevel: "medium",
  bloomLevel: "understand",
  options: [
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ],
  explanation: "",
};

export default function AdminQuestionsPage() {
  const utils = trpc.useUtils();
  const { data: questions, isLoading } = trpc.admin.getQuestions.useQuery();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewQuestion, setViewQuestion] = useState<any>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const createQuestion = trpc.admin.createQuestion.useMutation({
    onSuccess: () => {
      setShowAddModal(false);
      setForm(emptyForm);
      setFormError("");
      utils.admin.getQuestions.invalidate();
    },
    onError: (err) => setFormError(err.message),
  });

  const deleteQuestion = trpc.admin.deleteQuestion.useMutation({
    onSuccess: () => {
      setViewQuestion(null);
      utils.admin.getQuestions.invalidate();
    },
  });

  const banks = useMemo(() => {
    if (!questions) return [];
    const groups: Record<string, any[]> = {};
    for (const q of questions) {
      const key = q.concept || q.assessmentType || "Uncategorized";
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    }
    return Object.entries(groups).map(([section, qs]) => ({
      section,
      questions: qs,
      level: section,
      title: section,
      total: qs.length,
    }));
  }, [questions]);

  const activeBank = activeSection || (banks[0]?.section ?? null);
  const currentBank = banks.find((b) => b.section === activeBank);

  const filtered = (currentBank?.questions || []).filter((q: any) => {
    if (search && !q.questionText.toLowerCase().includes(search.toLowerCase()) && !q.code?.toLowerCase().includes(search.toLowerCase())) return false;
    if (difficulty !== "all" && q.difficultyLevel !== difficulty) return false;
    return true;
  });

  const updateFormOption = useCallback((index: number, field: "optionText" | "isCorrect", value: string | boolean) => {
    setForm((prev) => {
      const opts = [...prev.options];
      if (field === "isCorrect") {
        opts.forEach((o, i) => { o.isCorrect = i === index ? true : false; });
      } else {
        opts[index] = { ...opts[index], optionText: value as string };
      }
      return { ...prev, options: opts };
    });
  }, []);

  const addOption = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { optionText: "", isCorrect: false }],
    }));
  }, []);

  const removeOption = useCallback((index: number) => {
    setForm((prev) => {
      if (prev.options.length <= 2) return prev;
      const opts = prev.options.filter((_, i) => i !== index);
      if (!opts.some((o) => o.isCorrect) && opts.length > 0) opts[0].isCorrect = true;
      return { ...prev, options: opts };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.questionText.trim()) { setFormError("Question text is required"); return; }
    if (form.options.filter((o) => o.optionText.trim()).length < 2) { setFormError("At least 2 options are required"); return; }
    if (!form.options.some((o) => o.isCorrect)) { setFormError("Mark one option as correct"); return; }

    setFormError("");
    createQuestion.mutate({
      bankId: activeBank || "",
      questionText: form.questionText.trim(),
      concept: form.concept.trim(),
      difficultyLevel: form.difficultyLevel,
      bloomLevel: form.bloomLevel,
      explanation: form.explanation.trim(),
      options: form.options
        .filter((o) => o.optionText.trim())
        .map((o, i) => ({ optionText: o.optionText.trim(), isCorrect: o.isCorrect, optionOrder: i + 1 })),
    });
  }, [form, activeBank, createQuestion]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    deleteQuestion.mutate({ id: questionId });
  }, [deleteQuestion]);

  if (isLoading) {
    return <div className="space-y-6 animate-fade-in">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid grid-cols-3 gap-3">{[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
      <div className="h-64 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </div>;
  }

  const Icon = iconMap[activeBank] || Database;
  const gradient = gradientMap[activeBank] || "from-primary-500 to-primary-600";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Question Banks</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage readiness assessment question banks for all levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {banks.map((b) => {
          const BIcon = iconMap[b.section] || Database;
          const isActive = activeBank === b.section;
          return (
            <button key={b.section} onClick={() => setActiveSection(b.section)}
              className={cn("glass rounded-2xl p-4 text-left transition-all hover:shadow-md", isActive && "ring-2 ring-primary-500")}>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", gradientMap[b.section] || "from-primary-500 to-primary-600")}>
                  <BIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{b.section}</h3>
                  <p className="text-xs text-neutral-500">{b.total} questions</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", gradient)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">{currentBank?.section || "No questions"}</h2>
              <p className="text-xs text-neutral-500">{currentBank?.total || 0} total questions</p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => { setForm(emptyForm); setFormError(""); setShowAddModal(true); }}>
            <Plus className="h-3.5 w-3.5" /> Add Question
          </Button>
        </div>
        {currentBank && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-3 dark:border-neutral-800">
            {(() => {
              const groups: Record<string, number> = {};
              for (const q of currentBank.questions) {
                const c = q.concept || "Other";
                groups[c] = (groups[c] || 0) + 1;
              }
              return Object.entries(groups).map(([name, count]) => (
                <div key={name} className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                  <label className="text-xs font-medium text-neutral-500">{name}</label>
                  <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{count}</p>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", difficulty === d ? "bg-primary-600 text-white" : "glass text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300")}>
              {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Question</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 sm:table-cell">Concept</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 md:table-cell">Difficulty</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 lg:table-cell">Bloom</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q: any) => (
                <tr key={q.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50/50 dark:border-neutral-900 dark:hover:bg-neutral-900/50">
                  <td className="px-4 py-3 text-xs font-mono text-neutral-500">{q.code}</td>
                  <td className="max-w-[250px] px-4 py-3">
                    <p className="truncate text-sm text-neutral-900 dark:text-white">{q.questionText}</p>
                    <span className="mt-0.5 inline-block text-[10px] uppercase text-neutral-400">{q.rendererType}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-600 sm:table-cell dark:text-neutral-400">{q.concept}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", difficultyColors[q.difficultyLevel])}>{q.difficultyLevel}</span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", bloomColors[q.bloomLevel])}>{q.bloomLevel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewQuestion(q)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800" title="View"><Eye className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-error dark:hover:bg-neutral-800" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-8 text-center text-sm text-neutral-500">No questions found</div>}
      </div>

      {viewQuestion && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-neutral-400">{viewQuestion.code}</span>
                <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">{viewQuestion.questionText}</h3>
              </div>
              <button onClick={() => setViewQuestion(null)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">✕</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cn("rounded px-2 py-0.5 text-xs font-medium", difficultyColors[viewQuestion.difficultyLevel])}>{viewQuestion.difficultyLevel}</span>
              <span className={cn("rounded px-2 py-0.5 text-xs font-medium", bloomColors[viewQuestion.bloomLevel])}>{viewQuestion.bloomLevel}</span>
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{viewQuestion.concept}</span>
            </div>
            {viewQuestion.options && viewQuestion.options.length > 0 && (
              <div className="mt-4 space-y-2">
                {viewQuestion.options.map((opt: any, i: number) => (
                  <div key={i} className={cn("rounded-lg border px-3 py-2 text-sm",
                    opt.isCorrect ? "border-success/30 bg-success/5 text-success" : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400")}>
                    {String.fromCharCode(65 + i)}. {opt.optionText} {opt.isCorrect && "✓"}
                  </div>
                ))}
              </div>
            )}
            {viewQuestion.explanation && (
              <div className="mt-4 rounded-xl bg-info/5 p-3 text-xs text-info">
                <strong>Explanation:</strong> {viewQuestion.explanation}
              </div>
            )}
            <Button className="mt-4 w-full" variant="outline" onClick={() => setViewQuestion(null)}>Close</Button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Add New Question</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">✕</button>
            </div>

            {formError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Question Text *</label>
                <textarea className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" rows={3} placeholder="Enter question..." value={form.questionText} onChange={(e) => setForm((p) => ({ ...p, questionText: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Difficulty</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value={form.difficultyLevel} onChange={(e) => setForm((p) => ({ ...p, difficultyLevel: e.target.value as any }))}>
                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Bloom Level</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" value={form.bloomLevel} onChange={(e) => setForm((p) => ({ ...p, bloomLevel: e.target.value as any }))}>
                    <option value="remember">Remember</option><option value="understand">Understand</option><option value="apply">Apply</option><option value="analyze">Analyze</option><option value="evaluate">Evaluate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Concept</label>
                <input className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder="e.g. Fractions, Algebra" value={form.concept} onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Options * (min 2, mark one correct)</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <input className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder={`Option ${i + 1}`} value={opt.optionText} onChange={(e) => updateFormOption(i, "optionText", e.target.value)} />
                    <label className="flex shrink-0 items-center gap-1 text-xs text-neutral-500">
                      <input type="radio" name="correct" checked={opt.isCorrect} onChange={() => updateFormOption(i, "isCorrect", true)} /> ✓
                    </label>
                    {form.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} className="shrink-0 rounded p-0.5 text-neutral-400 hover:text-error"><X className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addOption} className="mt-1 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <Plus className="h-3 w-3" /> Add Option
                </button>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Explanation (optional)</label>
                <textarea className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" rows={2} placeholder="Explain the correct answer..." value={form.explanation} onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={createQuestion.isPending}>
                {createQuestion.isPending ? "Saving..." : "Save Question"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
