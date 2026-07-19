import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { questions, questionOptions } from "@/lib/db/schemas";

export interface PickedQuestion {
  id: string;
  bankId: string;
  questionText: string;
  questionType: string;
  rendererType: string;
  subjectId: string | null;
  concept: string | null;
  difficultyLevel: string;
  bloomLevel: string | null;
  expectedTimeSecs: number;
  allowsCalculator: boolean;
  passageText: string | null;
  chartData: Record<string, unknown> | null;
  geometryData: Record<string, unknown> | null;
  interactiveData: Record<string, unknown> | null;
  options: { id: string; optionText: string; optionOrder: number; isCorrect: boolean; explanation: string | null }[];
}

/**
 * Picks random questions from a bank with stratified difficulty sampling.
 * Ensures each attempt gets a different set within the same bank.
 */
export async function pickRandomQuestions(
  bankId: string,
  totalCount: number,
  difficultyDistribution: { easy: number; medium: number; hard: number } = { easy: 0.35, medium: 0.45, hard: 0.2 },
): Promise<PickedQuestion[]> {
  const bankQuestions = await db
    .select()
    .from(questions)
    .where(and(eq(questions.bankId, bankId), eq(questions.isActive, true), sql`${questions.deletedAt} IS NULL`));

  if (bankQuestions.length === 0) return [];

  // Stratified sampling by difficulty
  const groups: Record<string, typeof bankQuestions> = { easy: [], medium: [], hard: [] };
  for (const q of bankQuestions) {
    const level = q.difficultyLevel || "medium";
    if (groups[level]) groups[level].push(q);
    else groups.medium.push(q);
  }

  const picked: typeof bankQuestions = [];
  for (const [level, fraction] of Object.entries(difficultyDistribution)) {
    const pool = groups[level] || [];
    const needed = Math.round(totalCount * fraction);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, Math.min(needed, shuffled.length)));
  }

  // If we didn't get enough, fill from remaining pool
  if (picked.length < totalCount) {
    const usedIds = new Set(picked.map((q) => q.id));
    const remaining = bankQuestions.filter((q) => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
    picked.push(...remaining.slice(0, totalCount - picked.length));
  }

  // Shuffle final selection
  const final = picked.slice(0, totalCount).sort(() => Math.random() - 0.5);
  const questionIds = final.map((q) => q.id);

  // Load options
  const allOptions = await db
    .select()
    .from(questionOptions)
    .where(inArray(questionOptions.questionId, questionIds));

  const optionsByQuestion: Record<string, PickedQuestion["options"]> = {};
  for (const opt of allOptions) {
    if (!optionsByQuestion[opt.questionId]) optionsByQuestion[opt.questionId] = [];
    optionsByQuestion[opt.questionId].push({
      id: opt.id,
      optionText: opt.optionText,
      optionOrder: opt.optionOrder,
      isCorrect: opt.isCorrect,
      explanation: opt.explanation,
    });
  }

  return final.map((q) => ({
    id: q.id,
    bankId: q.bankId!,
    questionText: q.questionText,
    questionType: q.questionType,
    rendererType: q.rendererType || "standard",
    subjectId: q.subjectId,
    concept: q.concept,
    difficultyLevel: q.difficultyLevel || "medium",
    bloomLevel: q.bloomLevel,
    expectedTimeSecs: q.expectedTimeSecs,
    allowsCalculator: q.allowsCalculator || false,
    passageText: q.passageText,
    chartData: q.chartData as Record<string, unknown> | null,
    geometryData: q.geometryData as Record<string, unknown> | null,
    interactiveData: q.interactiveData as Record<string, unknown> | null,
    options: (optionsByQuestion[q.id] || []).sort((a, b) => a.optionOrder - b.optionOrder),
  }));
}

/**
 * Creates an assessment instance with randomized questions.
 */
export async function createRandomizedInstance(
  bankId: string,
  userId: string,
  configId: string,
  questionCount: number,
): Promise<{ instanceId: string; questions: PickedQuestion[] }> {
  const picked = await pickRandomQuestions(bankId, questionCount);
  const questionIds = picked.map((q) => q.id);

  const { assessmentInstances } = await import("@/lib/db/schemas");
  const [instance] = await db
    .insert(assessmentInstances)
    .values({
      configId,
      userId,
      status: "pending",
      questionOrder: questionIds,
    })
    .returning();

  return { instanceId: instance.id, questions: picked };
}
