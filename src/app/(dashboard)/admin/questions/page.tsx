"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Search, Plus, Trash2, Eye, Edit2, Database, BookOpen, Sparkles,
  GraduationCap, X, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  "PRI-JSS1": GraduationCap,
  "JSS3-SS1": BookOpen,
  "SS3-UNI": Sparkles,
  "TCH-QUALITY": Database,
};

const labelMap: Record<string, string> = {
  "PRI-JSS1": "Primary → JSS1",
  "JSS3-SS1": "JSS3 → SS1",
  "SS3-UNI": "SS3 → University",
  "TCH-QUALITY": "Teacher Quality",
};

const gradientMap: Record<string, string> = {
  "PRI-JSS1": "from-emerald-500 to-teal-500",
  "JSS3-SS1": "from-blue-500 to-indigo-500",
  "SS3-UNI": "from-primary-500 to-secondary-500",
  "TCH-QUALITY": "from-amber-500 to-orange-500",
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
  options: { optionText: string; isCorrect: boolean; optionOrder: number }[];
  explanation: string;
}

const emptyForm: QuestionForm = {
  questionText: "",
  concept: "",
  difficultyLevel: "medium",
  bloomLevel: "understand",
  options: [
    { optionText: "", isCorrect: true, optionOrder: 1 },
    { optionText: "", isCorrect: false, optionOrder: 2 },
    { optionText: "", isCorrect: false, optionOrder: 3 },
    { optionText: "", isCorrect: false, optionOrder: 4 },
  ],
  explanation: "",
};

export default function AdminQuestionsPage() {
  const utils = trpc.useUtils();
  const { data: banks, isLoading: banksLoading } = trpc.admin.getQuestionBanks.useQuery();
  const { data: missingOptions } = trpc.admin.checkMissingOptions.useQuery();
  const [activeBankId, setActiveBankId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [viewQuestion, setViewQuestion] = useState<any>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (banks && banks.length > 0 && !activeBankId) {
      setActiveBankId(banks[0].id);
    }
  }, [banks, activeBankId]);

  const { data: bankData, isLoading: questionsLoading } = trpc.admin.getQuestionsByBank.useQuery(
    { bankId: activeBankId || "", search, difficulty, page, pageSize },
    { enabled: !!activeBankId }
  );

  const createQuestion = trpc.admin.createQuestion.useMutation({
    onSuccess: () => {
      setShowAddModal(false);
      setForm(emptyForm);
      setFormError("");
      utils.admin.getQuestionsByBank.invalidate();
    },
    onError: (err) => setFormError(err.message),
  });

  const updateQuestion = trpc.admin.updateQuestion.useMutation({
    onSuccess: () => {
      setEditQuestion(null);
      setForm(emptyForm);
      setFormError("");
      utils.admin.getQuestionsByBank.invalidate();
    },
    onError: (err) => setFormError(err.message),
  });

  const deleteQuestion = trpc.admin.deleteQuestion.useMutation({
    onSuccess: () => {
      setViewQuestion(null);
      utils.admin.getQuestionsByBank.invalidate();
    },
  });

  const questions = bankData?.items || [];
  const total = bankData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const conceptStats = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const q of questions) {
      const c = q.concept || "Uncategorized";
      groups[c] = (groups[c] || 0) + 1;
    }
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [questions]);

  const updateFormOption = useCallback((index: number, field: "optionText" | "isCorrect", value: string | boolean) => {
    setForm((prev) => {
      const opts = [...prev.options];
      if (field === "isCorrect") {
        opts.forEach((o, i) => { o.isCorrect = i === index; });
      } else {
        opts[index] = { ...opts[index], optionText: value as string };
      }
      return { ...prev, options: opts };
    });
  }, []);

  const addOption = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { optionText: "", isCorrect: false, optionOrder: prev.options.length + 1 }],
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

  const openAddModal = useCallback(() => {
    setForm(emptyForm);
    setFormError("");
    setShowAddModal(true);
  }, []);

  const openEditModal = useCallback((q: any) => {
    setForm({
      questionText: q.questionText || "",
      concept: q.concept || "",
      difficultyLevel: q.difficultyLevel || "medium",
      bloomLevel: q.bloomLevel || "understand",
      options: q.options && q.options.length > 0
        ? q.options.sort((a: any, b: any) => a.optionOrder - b.optionOrder).map((o: any) => ({
            optionText: o.optionText,
            isCorrect: o.isCorrect,
            optionOrder: o.optionOrder,
          }))
        : emptyForm.options,
      explanation: q.explanation || "",
    });
    setFormError("");
    setEditQuestion(q);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.questionText.trim()) { setFormError("Question text is required"); return; }
    if (form.options.filter((o) => o.optionText.trim()).length < 2) { setFormError("At least 2 options are required"); return; }
    if (!form.options.some((o) => o.isCorrect)) { setFormError("Mark one option as correct"); return; }

    const cleanedOptions = form.options
      .filter((o) => o.optionText.trim())
      .map((o, i) => ({ optionText: o.optionText.trim(), isCorrect: o.isCorrect, optionOrder: i + 1 }));

    setFormError("");
    if (editQuestion) {
      updateQuestion.mutate({
        id: editQuestion.id,
        questionText: form.questionText.trim(),
        concept: form.concept.trim(),
        difficultyLevel: form.difficultyLevel,
        bloomLevel: form.bloomLevel,
        explanation: form.explanation.trim(),
        options: cleanedOptions,
      });
    } else {
      createQuestion.mutate({
        bankId: activeBankId || "",
        questionText: form.questionText.trim(),
        concept: form.concept.trim(),
        difficultyLevel: form.difficultyLevel,
        bloomLevel: form.bloomLevel,
        explanation: form.explanation.trim(),
        options: cleanedOptions,
      });
    }
  }, [form, activeBankId, editQuestion, createQuestion, updateQuestion]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    deleteQuestion.mutate({ id: questionId });
  }, [deleteQuestion]);

  if (banksLoading) {
    return <div className="space-y-6 animate-fade-in">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid grid-cols-3 gap-3">{[1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
      <div className="h-64 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </div>;
  }

  const activeBank = banks?.find((b) => b.id === activeBankId);
  const activeLevel = activeBank?.level || "";
  const Icon = iconMap[activeLevel] || Database;
  const gradient = gradientMap[activeLevel] || "from-primary-500 to-primary-600";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Question Banks</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage readiness assessment question banks for all levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {banks?.map((b) => {
          const BIcon = iconMap[b.level] || Database;
          const isActive = activeBankId === b.id;
          return (
            <button key={b.id} onClick={() => { setActiveBankId(b.id); setPage(1); setSearch(""); setDifficulty("all"); }}
              className={cn("glass rounded-2xl p-4 text-left transition-all hover:shadow-md", isActive && "ring-2 ring-primary-500")}>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", gradientMap[b.level] || "from-primary-500 to-primary-600")}>
                  <BIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{labelMap[b.level] || b.title}</h3>
                  <p className="text-xs text-neutral-500">{b.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        {activeBankId && missingOptions?.find((m) => m.bankId === activeBankId)?.missing ? (
          (() => {
            const info = missingOptions.find((m) => m.bankId === activeBankId)!;
            return (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{info.missing} of {info.total} questions in this bank are missing options. Edit each question to add options.</span>
              </div>
            );
          })()
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", gradient)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">{labelMap[activeLevel] || activeBank?.title || "Select a bank"}</h2>
              <p className="text-xs text-neutral-500">{total} total questions</p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5" onClick={openAddModal} disabled={!activeBankId}>
            <Plus className="h-3.5 w-3.5" /> Add Question
          </Button>
        </div>
        {conceptStats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 dark:border-neutral-800">
            {conceptStats.map(([name, count]) => (
              <div key={name} className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <label className="text-xs font-medium text-neutral-500 truncate block">{name}</label>
                <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
           <input className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" placeholder="Search questions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-2">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button key={d} onClick={() => { setDifficulty(d); setPage(1); }}
              className={cn("rounded-lg px-3 py-2 text-xs font-medium transition-colors min-h-[44px]", difficulty === d ? "bg-primary-600 text-white" : "glass text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300")}>
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
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 lg:table-cell">Options</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q: any) => (
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
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="text-xs text-neutral-500">{q.options?.length || 0} options</span>
                    {q.options?.some((o: any) => o.isCorrect) && (
                      <CheckCircle2 className="ml-1 inline h-3 w-3 text-success" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewQuestion(q)} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]" title="View"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => openEditModal(q)} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]" title="Edit"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 hover:text-error dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {questions.length === 0 && !questionsLoading && <div className="py-8 text-center text-sm text-neutral-500">No questions found</div>}
        {questionsLoading && <div className="py-8 text-center text-sm text-neutral-500">Loading...</div>}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <span className="text-xs text-neutral-500">Page {page} of {totalPages} ({total} questions)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {viewQuestion && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-neutral-400">{viewQuestion.code}</span>
                <h3 className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">{viewQuestion.questionText}</h3>
              </div>
              <button onClick={() => setViewQuestion(null)} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]">✕</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cn("rounded px-2 py-0.5 text-xs font-medium", difficultyColors[viewQuestion.difficultyLevel])}>{viewQuestion.difficultyLevel}</span>
              <span className={cn("rounded px-2 py-0.5 text-xs font-medium", bloomColors[viewQuestion.bloomLevel])}>{viewQuestion.bloomLevel}</span>
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{viewQuestion.concept}</span>
            </div>
            {viewQuestion.options && viewQuestion.options.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="text-xs font-medium text-neutral-500">Options</label>
                {viewQuestion.options.sort((a: any, b: any) => a.optionOrder - b.optionOrder).map((opt: any, i: number) => (
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
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setViewQuestion(null); openEditModal(viewQuestion); }}>
                <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setViewQuestion(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {(showAddModal || editQuestion) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{editQuestion ? "Edit Question" : "Add New Question"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditQuestion(null); setFormError(""); }} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]">✕</button>
            </div>

            {formError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Question Text *</label>
                <textarea className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" rows={3} placeholder="Enter question..." value={form.questionText} onChange={(e) => setForm((p) => ({ ...p, questionText: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Difficulty</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" value={form.difficultyLevel} onChange={(e) => setForm((p) => ({ ...p, difficultyLevel: e.target.value as any }))}>
                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Bloom Level</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" value={form.bloomLevel} onChange={(e) => setForm((p) => ({ ...p, bloomLevel: e.target.value as any }))}>
                    <option value="remember">Remember</option><option value="understand">Understand</option><option value="apply">Apply</option><option value="analyze">Analyze</option><option value="evaluate">Evaluate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Concept</label>
                <input className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" placeholder="e.g. Fractions, Algebra" value={form.concept} onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Options * (min 2, mark one correct)</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <span className="shrink-0 text-xs font-medium text-neutral-400 w-5">{String.fromCharCode(65 + i)}.</span>
                    <input className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" placeholder={`Option ${i + 1}`} value={opt.optionText} onChange={(e) => updateFormOption(i, "optionText", e.target.value)} />
                    <label className="flex shrink-0 items-center gap-1 text-xs text-neutral-500">
                      <input type="radio" name="correct" checked={opt.isCorrect} onChange={() => updateFormOption(i, "isCorrect", true)} /> ✓
                    </label>
                    {form.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} className="flex shrink-0 items-center justify-center rounded p-3 text-neutral-400 hover:text-error min-h-[44px] min-w-[44px]"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addOption} className="mt-1 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <Plus className="h-3 w-3" /> Add Option
                </button>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Explanation (optional)</label>
                <textarea className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" rows={2} placeholder="Explain the correct answer..." value={form.explanation} onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowAddModal(false); setEditQuestion(null); setFormError(""); }}>Cancel</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={createQuestion.isPending || updateQuestion.isPending}>
                {createQuestion.isPending || updateQuestion.isPending ? "Saving..." : editQuestion ? "Update Question" : "Save Question"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
