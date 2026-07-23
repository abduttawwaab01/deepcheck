"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Search, Plus, Trash2, Eye, Edit2, Building, X, CheckCircle2,
  AlertTriangle, ChevronLeft, ChevronRight, Upload, Download, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DOMAIN_COLORS: Record<string, string> = {
  "Teaching Quality & Pedagogy": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "Curriculum Implementation": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  "Student Assessment & Evaluation": "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "School Leadership & Management": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "Infrastructure & Resources": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300",
  "Student Support & Welfare": "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  "Parent & Community Engagement": "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "Teacher Development": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "School Culture & Climate": "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "Data-Driven Decision Making": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Technology Integration": "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  "Safety & Discipline": "bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
  "Financial Management": "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  "Student Achievement Outcomes": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

interface OptionForm {
  optionText: string;
  score: number;
  optionOrder: number;
}

interface QuestionForm {
  code: string;
  domain: string;
  dimension: string;
  questionText: string;
  options: OptionForm[];
}

const defaultOptions: OptionForm[] = [
  { optionText: "Never", score: 1, optionOrder: 1 },
  { optionText: "Rarely", score: 2, optionOrder: 2 },
  { optionText: "Sometimes", score: 3, optionOrder: 3 },
  { optionText: "Often", score: 4, optionOrder: 4 },
  { optionText: "Always", score: 5, optionOrder: 5 },
];

const emptyForm: QuestionForm = {
  code: "",
  domain: "Teaching Quality & Pedagogy",
  dimension: "",
  questionText: "",
  options: defaultOptions.map((o) => ({ ...o })),
};

export default function AdminSchoolAssessmentsPage() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [viewQuestion, setViewQuestion] = useState<any>(null);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: domains } = trpc.admin.getSchoolQuestionDomains.useQuery();
  const { data: qData, isLoading: questionsLoading } = trpc.admin.getSchoolQuestions.useQuery(
    { search, domain, page, pageSize },
  );

  const createQuestion = trpc.admin.createSchoolQuestion.useMutation({
    onSuccess: () => {
      setShowAddModal(false);
      setForm(emptyForm);
      setFormError("");
      utils.admin.getSchoolQuestions.invalidate();
      utils.admin.getSchoolQuestionDomains.invalidate();
    },
    onError: (err) => setFormError(err.message),
  });

  const updateQuestion = trpc.admin.updateSchoolQuestion.useMutation({
    onSuccess: () => {
      setEditQuestion(null);
      setForm(emptyForm);
      setFormError("");
      utils.admin.getSchoolQuestions.invalidate();
    },
    onError: (err) => setFormError(err.message),
  });

  const deleteQuestion = trpc.admin.deleteSchoolQuestion.useMutation({
    onSuccess: () => {
      setViewQuestion(null);
      utils.admin.getSchoolQuestions.invalidate();
    },
  });

  const bulkImport = trpc.admin.bulkImportSchoolQuestions.useMutation({
    onSuccess: (result) => {
      setImportSuccess(`Imported ${result.created} questions${result.failed > 0 ? ` (${result.failed} failed)` : ""}`);
      setImportError("");
      setImportText("");
      utils.admin.getSchoolQuestions.invalidate();
      utils.admin.getSchoolQuestionDomains.invalidate();
      setTimeout(() => setImportSuccess(""), 3000);
    },
    onError: (err) => {
      setImportError(err.message);
      setImportSuccess("");
    },
  });

  const { data: exportData } = trpc.admin.exportSchoolQuestions.useQuery(
    { domain: domain !== "all" ? domain : undefined },
    { enabled: false },
  );

  const questions = qData?.items || [];
  const total = qData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const domainStats = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const q of questions) {
      const d = q.domain || "Uncategorized";
      groups[d] = (groups[d] || 0) + 1;
    }
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  }, [questions]);

  const updateFormOption = useCallback((index: number, field: keyof OptionForm, value: string | number) => {
    setForm((prev) => {
      const opts = [...prev.options];
      opts[index] = { ...opts[index], [field]: value };
      return { ...prev, options: opts };
    });
  }, []);

  const addOption = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { optionText: "", score: prev.options.length + 1, optionOrder: prev.options.length + 1 }],
    }));
  }, []);

  const removeOption = useCallback((index: number) => {
    setForm((prev) => {
      if (prev.options.length <= 2) return prev;
      const opts = prev.options.filter((_, i) => i !== index).map((o, i) => ({ ...o, optionOrder: i + 1 }));
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
      code: q.code || "",
      domain: q.domain || "",
      dimension: q.dimension || "",
      questionText: q.questionText || "",
      options: q.options && q.options.length > 0
        ? q.options.sort((a: any, b: any) => a.optionOrder - b.optionOrder).map((o: any) => ({
            optionText: o.optionText,
            score: o.score || 1,
            optionOrder: o.optionOrder,
          }))
        : defaultOptions.map((o) => ({ ...o })),
    });
    setFormError("");
    setEditQuestion(q);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.code.trim()) { setFormError("Code is required"); return; }
    if (!form.domain.trim()) { setFormError("Domain is required"); return; }
    if (!form.dimension.trim()) { setFormError("Dimension is required"); return; }
    if (!form.questionText.trim()) { setFormError("Question text is required"); return; }
    if (form.options.filter((o) => o.optionText.trim()).length < 2) { setFormError("At least 2 options are required"); return; }

    const cleanedOptions = form.options
      .filter((o) => o.optionText.trim())
      .map((o, i) => ({ optionText: o.optionText.trim(), score: o.score, optionOrder: i + 1 }));

    setFormError("");
    if (editQuestion) {
      updateQuestion.mutate({
        id: editQuestion.id,
        code: form.code.trim(),
        domain: form.domain.trim(),
        dimension: form.dimension.trim(),
        questionText: form.questionText.trim(),
        options: cleanedOptions,
      });
    } else {
      createQuestion.mutate({
        code: form.code.trim(),
        domain: form.domain.trim(),
        dimension: form.dimension.trim(),
        questionText: form.questionText.trim(),
        options: cleanedOptions,
      });
    }
  }, [form, editQuestion, createQuestion, updateQuestion]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    deleteQuestion.mutate({ id: questionId });
  }, [deleteQuestion]);

  const parseImportText = useCallback((text: string) => {
    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("Input must be a JSON array");
      const validated = data.map((q: any, i: number) => {
        if (!q.domain) throw new Error(`Question ${i + 1}: domain is required`);
        if (!q.questionText) throw new Error(`Question ${i + 1}: questionText is required`);
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Question ${i + 1}: at least 2 options required`);
        }
        return {
          domain: q.domain,
          subDomain: q.subDomain || q.dimension || undefined,
          questionText: q.questionText,
          difficulty: q.difficulty || "medium",
          options: q.options.map((o: any, j: number) => ({
            optionText: o.optionText || o.text || "",
            score: o.score || j + 1,
            optionOrder: o.optionOrder || j + 1,
          })),
        };
      });
      return validated;
    } catch {
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) throw new Error("Invalid format. Use JSON array or CSV with header row");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const domainIdx = headers.findIndex((h) => h === "domain");
      const questionIdx = headers.findIndex((h) => h === "question" || h === "questiontext" || h === "question_text");
      if (domainIdx === -1 || questionIdx === -1) throw new Error("CSV must have 'domain' and 'question' columns");
      const questions = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        if (cols.length > Math.max(domainIdx, questionIdx)) {
          questions.push({
            domain: cols[domainIdx],
            questionText: cols[questionIdx],
            difficulty: "medium" as const,
            options: defaultOptions.map((o) => ({ ...o })),
          });
        }
      }
      if (questions.length === 0) throw new Error("No valid questions found in CSV");
      return questions;
    }
  }, []);

  const handleImport = useCallback(() => {
    setImportError("");
    setImportSuccess("");
    try {
      const questions = parseImportText(importText);
      bulkImport.mutate({ questions });
    } catch (e: any) {
      setImportError(e.message);
    }
  }, [importText, parseImportText, bulkImport]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportText(ev.target?.result as string || "");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const handleExport = useCallback(async () => {
    const result = await utils.client.admin.exportSchoolQuestions.query({
      domain: domain !== "all" ? domain : undefined,
    });
    if (!result || result.length === 0) {
      alert("No questions to export");
      return;
    }
    const csv = [
      "domain,dimension,questionText,displayOrder,option1,score1,option2,score2,option3,score3,option4,score4,option5,score5",
      ...result.map((q) => {
        const opts = q.options.sort((a, b) => a.optionOrder - b.optionOrder);
        const optCols = opts.flatMap((o) => [o.optionText, String(o.score)]);
        while (optCols.length < 10) optCols.push("", "");
        return `"${q.domain}","${q.dimension || ""}","${q.questionText.replace(/"/g, '""')}","${q.displayOrder}",${optCols.map((c) => `"${c}"`).join(",")}`;
      }),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `school-assessment-questions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [domain, utils]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">School Assessment Questions</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage Likert-based school self-assessment questions across all domains</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowImportModal(true)}>
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">School Self-Assessment</h2>
            <p className="text-xs text-neutral-500">{total} total questions across {domains?.length || 0} domains</p>
          </div>
        </div>
        {domainStats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 dark:border-neutral-800">
            {domainStats.map(([name, count]) => (
              <div key={name} className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <label className={cn("text-xs font-medium truncate block rounded px-1.5 py-0.5", DOMAIN_COLORS[name] || "bg-neutral-100 text-neutral-600")}>{name}</label>
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
        <div className="flex gap-2 flex-wrap">
          <select className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" value={domain} onChange={(e) => { setDomain(e.target.value); setPage(1); }}>
            <option value="all">All Domains</option>
            {domains?.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <Button size="sm" className="gap-1.5" onClick={openAddModal}>
            <Plus className="h-3.5 w-3.5" /> Add Question
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Question</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 sm:table-cell">Domain</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-neutral-500 md:table-cell">Dimension</th>
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
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium truncate max-w-[180px]", DOMAIN_COLORS[q.domain] || "bg-neutral-100 text-neutral-600")}>{q.domain}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-600 md:table-cell dark:text-neutral-400">{q.dimension}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="text-xs text-neutral-500">{q.options?.length || 0} options</span>
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
              <span className={cn("rounded px-2 py-0.5 text-xs font-medium", DOMAIN_COLORS[viewQuestion.domain] || "bg-neutral-100 text-neutral-600")}>{viewQuestion.domain}</span>
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{viewQuestion.dimension}</span>
            </div>
            {viewQuestion.options && viewQuestion.options.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="text-xs font-medium text-neutral-500">Likert Options</label>
                {viewQuestion.options.sort((a: any, b: any) => a.optionOrder - b.optionOrder).map((opt: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
                    <span className="text-neutral-700 dark:text-neutral-300">{String.fromCharCode(65 + i)}. {opt.optionText}</span>
                    <span className="text-xs font-medium text-neutral-400">Score: {opt.score}</span>
                  </div>
                ))}
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
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{editQuestion ? "Edit School Question" : "Add School Question"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditQuestion(null); setFormError(""); }} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]">✕</button>
            </div>

            {formError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Code *</label>
                  <input className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" placeholder="e.g. SKL-001" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Domain *</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))}>
                    {domains?.map((d) => <option key={d} value={d}>{d}</option>)}
                    {!domains && <option value="Teaching Quality & Pedagogy">Teaching Quality & Pedagogy</option>}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Dimension *</label>
                <input className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" placeholder="e.g. Differentiated Instruction" value={form.dimension} onChange={(e) => setForm((p) => ({ ...p, dimension: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Question Text *</label>
                <textarea className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" rows={3} placeholder="Enter question..." value={form.questionText} onChange={(e) => setForm((p) => ({ ...p, questionText: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Likert Options * (min 2, with scores 1-5)</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <span className="shrink-0 text-xs font-medium text-neutral-400 w-5">{String.fromCharCode(65 + i)}.</span>
                    <input className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" placeholder={`Option ${i + 1}`} value={opt.optionText} onChange={(e) => updateFormOption(i, "optionText", e.target.value)} />
                    <input type="number" className="w-16 rounded-lg border border-neutral-200 bg-white px-2 py-3 text-center text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white min-h-[44px]" min={1} max={5} value={opt.score} onChange={(e) => updateFormOption(i, "score", parseInt(e.target.value) || 1)} />
                    {form.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} className="flex shrink-0 items-center justify-center rounded p-3 text-neutral-400 hover:text-error min-h-[44px] min-w-[44px]"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addOption} className="mt-1 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <Plus className="h-3 w-3" /> Add Option
                </button>
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

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Bulk Import Questions</h3>
                <p className="text-xs text-neutral-500 mt-1">Import questions from JSON or CSV format</p>
              </div>
              <button onClick={() => { setShowImportModal(false); setImportText(""); setImportError(""); setImportSuccess(""); }} className="flex items-center justify-center rounded-lg p-3 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[44px] min-w-[44px]">✕</button>
            </div>

            {importError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-error/10 p-3 text-xs text-error">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {importError}
              </div>
            )}

            {importSuccess && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-xs text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {importSuccess}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                  <FileText className="h-3.5 w-3.5" /> Upload File
                </Button>
                <input ref={fileInputRef} type="file" accept=".json,.csv" className="hidden" onChange={handleFileUpload} />
                <span className="text-xs text-neutral-500 self-center">or paste below</span>
              </div>
              <textarea
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-xs font-mono outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                rows={12}
                placeholder={`JSON format:\n[\n  {\n    "domain": "Teaching Quality & Pedagogy",\n    "questionText": "The school provides adequate teaching resources",\n    "options": [\n      { "optionText": "Never", "score": 1 },\n      { "optionText": "Rarely", "score": 2 },\n      { "optionText": "Sometimes", "score": 3 },\n      { "optionText": "Often", "score": 4 },\n      { "optionText": "Always", "score": 5 }\n    ]\n  }\n]\n\nCSV format:\ndomain,question\nteaching quality,The school provides adequate teaching resources`}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setShowImportModal(false); setImportText(""); setImportError(""); setImportSuccess(""); }}>Cancel</Button>
              <Button className="flex-1" onClick={handleImport} disabled={!importText.trim() || bulkImport.isPending}>
                {bulkImport.isPending ? "Importing..." : "Import Questions"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
