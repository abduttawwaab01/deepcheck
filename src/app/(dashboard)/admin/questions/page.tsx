"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, ChevronDown, Edit2, Trash2, Eye, Database, BarChart3, Brain, BookOpen, Sparkles, GraduationCap, School, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const bankIcons: Record<string, any> = {
  primary_to_jss1: GraduationCap,
  jss3_to_ss1: BookOpen,
  ss3_to_university: Sparkles,
};

const bankGradients: Record<string, string> = {
  primary_to_jss1: "from-emerald-500 to-teal-500",
  jss3_to_ss1: "from-blue-500 to-indigo-500",
  ss3_to_university: "from-primary-500 to-secondary-500",
};

const bankLabels: Record<string, string> = {
  primary_to_jss1: "Primary → JSS",
  jss3_to_ss1: "JSS → SSS",
  ss3_to_university: "SSS → University",
};

// Demo expanded question data per bank
const demoBanks = [
  {
    id: "primary_to_jss1",
    level: "primary_to_jss1",
    title: "Primary 6 → JSS1 Readiness",
    total: 170,
    sections: [
      { name: "Numeracy", count: 65, configCount: 30 },
      { name: "Literacy", count: 55, configCount: 20 },
      { name: "Critical Thinking", count: 50, configCount: 15 },
    ],
  },
  {
    id: "jss3_to_ss1",
    level: "jss3_to_ss1",
    title: "JSS3 → SS1 Readiness",
    total: 170,
    sections: [
      { name: "Mathematics", count: 65, configCount: 30 },
      { name: "English", count: 55, configCount: 20 },
      { name: "Critical Thinking", count: 50, configCount: 15 },
    ],
  },
  {
    id: "ss3_to_university",
    level: "ss3_to_university",
    title: "SS3 → University Readiness",
    total: 170,
    sections: [
      { name: "Advanced Mathematics", count: 60, configCount: 25 },
      { name: "Critical Literacy", count: 55, configCount: 20 },
      { name: "Reasoning & Readiness", count: 55, configCount: 15 },
    ],
  },
];

const demoQuestions: Record<string, any[]> = {
  primary_to_jss1: Array.from({ length: 15 }, (_, i) => ({
    id: `pq-${i + 1}`,
    code: i < 5 ? `P-NUM-${String(i + 1).padStart(3, "0")}` : i < 10 ? `P-LIT-${String(i - 4).padStart(3, "0")}` : `P-CT-${String(i - 9).padStart(3, "0")}`,
    questionText: i < 5
      ? ["What is 3/4 + 1/2?", "If a rectangle has length 8cm and width 5cm, what is its area?", "What is 15% of 200?", "Solve: 2x + 5 = 13", "What is the next number: 2, 6, 18, 54, ?"][i]
      : i < 10
      ? ["Which word is a verb in 'The dog ran quickly'?", "What is the plural of 'child'?", "Identify the correct spelling", "Choose the correct sentence", "What does 'benevolent' mean?"][i - 5]
      : ["Which shape completes the pattern? ○●○●○?", "If all A are B, and all B are C, then?", "What is the odd one out: 2, 3, 5, 7, 10?", "Complete the analogy: Doctor:Hospital::Teacher:?", "If today is Wednesday, what day is 100 days from now?"][i - 10],
    concept: i < 5 ? "Fractions" : i < 10 ? "Grammar" : "Patterns",
    difficultyLevel: i < 5 ? "easy" : i < 10 ? "medium" : "hard",
    bloomLevel: i < 5 ? "apply" : i < 10 ? "understand" : "analyze",
    rendererType: "standard",
    status: "approved",
  })),
  jss3_to_ss1: Array.from({ length: 15 }, (_, i) => ({
    id: `jq-${i + 1}`,
    code: i < 5 ? `J-MATH-${String(i + 1).padStart(3, "0")}` : i < 10 ? `J-ENG-${String(i - 4).padStart(3, "0")}` : `J-CT-${String(i - 9).padStart(3, "0")}`,
    questionText: i < 5
      ? ["Simplify: 3x + 5y - 2x + 3y", "What is the value of 2^3 × 2^2?", "Solve: 5x - 3 = 2x + 9", "What type of angle measures 90°?", "If a = 3, b = 2, find a² + b²"][i]
      : i < 10
      ? ["Identify the figure of speech: 'The wind whispered through the trees'", "Which sentence is in passive voice?", "What is the antonym of 'ephemeral'?", "Identify the main clause: 'Although it rained, we went out'", "What is a sonnet?"][i - 5]
      : ["If all cats are mammals and some pets are cats, then?", "Complete the series: 1, 1, 2, 3, 5, 8, ?", "Which word does not belong: Apple, Banana, Carrot, Grape?", "If it takes 8 people 6 hours to paint a house, how long for 12 people?", "A bat and ball cost ₦110. The bat costs ₦100 more. How much is the ball?"][i - 10],
    concept: i < 5 ? "Algebra" : i < 10 ? "Figurative Language" : "Logical Reasoning",
    difficultyLevel: i < 5 ? "easy" : i < 10 ? "medium" : "hard",
    bloomLevel: i < 5 ? "apply" : i < 10 ? "analyze" : "evaluate",
    rendererType: "standard",
    status: "approved",
  })),
  ss3_to_university: Array.from({ length: 15 }, (_, i) => ({
    id: `sq-${i + 1}`,
    code: i < 5 ? `S-MATH-${String(i + 1).padStart(3, "0")}` : i < 10 ? `S-LIT-${String(i - 4).padStart(3, "0")}` : `S-RR-${String(i - 9).padStart(3, "0")}`,
    questionText: i < 5
      ? ["Evaluate lim_{x→2} (x² - 4)/(x - 2)", "Find the derivative of f(x) = 3x² + 2x - 1", "What is the probability of rolling a sum of 7 with two dice?", "If z = 3 + 4i, find |z|", "How many 3-digit numbers can be formed from {1,2,3,4,5} without repetition?"][i]
      : i < 10
      ? ["What is the author's primary purpose in a persuasive text?", "Identify the logical fallacy: 'Everyone believes X, so X must be true'", "What does 'ubiquitous' mean?", "What is the central claim of an argument?", "Which is NOT a type of bias in research?"][i - 5]
      : ["If 5x + 2 = 17, what is 3x - 1?", "Which of these best describes compound interest?", "A university offers 5 courses. You must pick 3. How many combinations?", "What is the opportunity cost of choosing to study instead of working?", "Which study method is most effective for long-term retention?"][i - 10],
    concept: i < 5 ? "Limits" : i < 10 ? "Critical Analysis" : "Decision Making",
    difficultyLevel: i < 5 ? "easy" : i < 10 ? "medium" : "hard",
    bloomLevel: i < 5 ? "apply" : i < 10 ? "analyze" : "evaluate",
    rendererType: "standard",
    status: "approved",
  })),
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

export default function AdminQuestionsPage() {
  const [activeBank, setActiveBank] = useState("primary_to_jss1");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [showConfig, setShowConfig] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewQuestion, setViewQuestion] = useState<any>(null);

  const bank = demoBanks.find((b) => b.level === activeBank)!;
  const Icon = bankIcons[activeBank] || Database;
  const gradient = bankGradients[activeBank] || "from-primary-500 to-primary-600";
  const questions = demoQuestions[activeBank] || [];

  const filtered = questions.filter((q) => {
    if (search && !q.questionText.toLowerCase().includes(search.toLowerCase()) && !q.code.toLowerCase().includes(search.toLowerCase())) return false;
    if (difficulty !== "all" && q.difficultyLevel !== difficulty) return false;
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Question Banks</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage readiness assessment question banks for all levels</p>
        </div>
      </div>

      {/* Bank selector */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {demoBanks.map((b) => {
          const BIcon = bankIcons[b.level] || Database;
          const isActive = activeBank === b.level;
          return (
            <button
              key={b.level}
              onClick={() => { setActiveBank(b.level); setShowConfig(false); }}
              className={cn(
                "glass rounded-2xl p-4 text-left transition-all hover:shadow-md",
                isActive && "ring-2 ring-primary-500",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", bankGradients[b.level])}>
                  <BIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{b.title}</h3>
                  <p className="text-xs text-neutral-500">{b.total} questions in bank</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bank stats + config */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", gradient)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">{bank?.title}</h2>
              <p className="text-xs text-neutral-500">{bank?.total} total questions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowConfig(!showConfig)}>
              <Settings2 className="h-3.5 w-3.5" /> Configure
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setShowAddModal(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Question
            </Button>
          </div>
        </div>

        {/* Section config */}
        {showConfig && bank && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-neutral-100 pt-4 sm:grid-cols-3 dark:border-neutral-800">
            {bank.sections.map((s) => (
              <div key={s.name} className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <label className="text-xs font-medium text-neutral-500">{s.name}</label>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-400">{s.count} available</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-neutral-400">Renders:</span>
                    <input
                      type="number"
                      className="w-14 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-center text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950"
                      defaultValue={s.configCount}
                      min={1}
                      max={s.count}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search / Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                difficulty === d
                  ? "bg-primary-600 text-white"
                  : "glass text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
              )}
            >
              {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Questions table */}
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
              {filtered.map((q) => (
                <tr key={q.id} className="border-b border-neutral-50 transition-colors hover:bg-neutral-50/50 dark:border-neutral-900 dark:hover:bg-neutral-900/50">
                  <td className="px-4 py-3 text-xs font-mono text-neutral-500">{q.code}</td>
                  <td className="max-w-[250px] px-4 py-3">
                    <p className="truncate text-sm text-neutral-900 dark:text-white">{q.questionText}</p>
                    <span className="mt-0.5 inline-block text-[10px] uppercase text-neutral-400">{q.rendererType}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-600 sm:table-cell dark:text-neutral-400">{q.concept}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", difficultyColors[q.difficultyLevel])}>
                      {q.difficultyLevel}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className={cn("inline-block rounded px-2 py-0.5 text-[11px] font-medium", bloomColors[q.bloomLevel])}>
                      {q.bloomLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewQuestion(q)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800" title="Edit">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-error dark:hover:bg-neutral-800" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-neutral-500">No questions found</div>
        )}
      </div>

      {/* View question modal */}
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
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{viewQuestion.rendererType}</span>
            </div>
            {/* Options preview */}
            <div className="mt-4 space-y-2">
              {["A. Option one", "B. Option two", "C. Option three", "D. Option four"].map((opt, i) => (
                <div key={i} className={cn("rounded-lg border px-3 py-2 text-sm", i === 0 ? "border-success/30 bg-success/5 text-success" : "border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400")}>
                  {opt} {i === 0 && "✓"}
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="outline" onClick={() => setViewQuestion(null)}>Close</Button>
          </div>
        </div>
      )}

      {/* Add question modal placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 animate-slide-up">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Add New Question</h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Question Text</label>
                <textarea className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" rows={3} placeholder="Enter question..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Difficulty</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white">
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Bloom Level</label>
                  <select className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white">
                    <option>Remember</option><option>Understand</option><option>Apply</option><option>Analyze</option><option>Evaluate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Concept</label>
                <input className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder="e.g. Fractions, Algebra" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Options (4)</label>
                {["", "", "", ""].map((_, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <input className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder={`Option ${i + 1}`} />
                    <label className="flex items-center gap-1 text-xs text-neutral-500">
                      <input type="radio" name="correct" defaultChecked={i === 0} /> Correct
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1">Save Question</Button>
            </div>
          </div>
        </div>
      )}

      {/* Account deletion perms note */}
      <div className="rounded-2xl bg-error/5 p-4 text-sm">
        <p className="font-medium text-error">Account Management</p>
        <p className="mt-1 text-xs text-neutral-500">
          Users can delete their own accounts from their Settings page. Admin can delete any user from the{" "}
          <a href="/admin/users" className="text-primary-500 underline">Users page</a>.
        </p>
      </div>
    </div>
  );
}
