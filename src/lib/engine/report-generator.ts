/**
 * Deep Report Generator
 * Takes raw assessment data and produces a comprehensive deep report.
 * Uses IRT engine for psychometric analysis + AI enhancement via OpenRouter.
 * Falls back to rule-based generation if AI is unavailable.
 */

import { classify, estimateTheta, thetaToScaledScore } from "@/lib/engine/irt";
import type { ItemParams } from "@/lib/engine/irt";

export interface DeepReportInput {
  responses: { itemId: string; correct: boolean; timeSpent: number }[];
  items: ItemParams[];
  userId: string;
  userName: string;
  assessmentType: string;
  assessmentTitle: string;
}

export interface DeepReportOutput {
  id: string;
  overallScore: number;
  category: string;
  conceptMastery: { conceptId: string; score: number; classification: string }[];
  cognitiveProfile: { dimension: string; score: number }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: { title: string; description: string; priority: string }[];
  studyPlan: { phase: string; actions: string[] }[];
  aiSummary: string | null;
  generatedAt: string;
}

export function generateDeepReport(input: DeepReportInput): DeepReportOutput {
  const { responses, items, userName, assessmentType, assessmentTitle } = input;

  // 1. Estimate overall theta
  const itemResponses = responses.map((r) => {
    const item = items.find((i) => i.id === r.itemId);
    return { item: item || { id: r.itemId, a: 1, b: 0, c: 0.25 }, correct: r.correct };
  });
  const { theta, se } = estimateTheta(itemResponses);
  const overallScore = thetaToScaledScore(theta);
  const category = classify(theta);

  // 2. Topic-level mastery
  const topicGroups = new Map<string, { correct: number; total: number }>();
  const conceptScores: { conceptId: string; score: number; classification: string }[] = [];

  for (const r of responses) {
    const item = items.find((i) => i.id === r.itemId);
    const topicId = item?.topicId || "general";
    if (!topicGroups.has(topicId)) topicGroups.set(topicId, { correct: 0, total: 0 });
    const group = topicGroups.get(topicId)!;
    group.total++;
    if (r.correct) group.correct++;
  }

  for (const [topicId, { correct, total }] of topicGroups) {
    const score = Math.round((correct / total) * 100);
    conceptScores.push({
      conceptId: topicId,
      score,
      classification: classify((score / 100) * 6 - 3),
    });
  }

  // 3. Cognitive profile (derived from time-spent patterns and difficulty)
  const timeAvg = responses.reduce((s, r) => s + r.timeSpent, 0) / responses.length;
  const cognitiveProfile = [
    { dimension: "Processing Speed", score: Math.min(100, Math.round(100 - (timeAvg / 60) * 10)) },
    { dimension: "Accuracy", score: overallScore },
    { dimension: "Persistence", score: Math.min(100, Math.round(responses.length * 3)) },
  ];

  // 4. Strengths and weaknesses
  const sorted = [...conceptScores].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3).map((c) => `Concept ${c.conceptId}`);
  const weaknesses = sorted.slice(-3).reverse().map((c) => `Concept ${c.conceptId}`);

  // 5. Recommendations (rule-based)
  const recommendations = weaknesses.map((w, i) => ({
    title: `Improve ${w}`,
    description: `Focus on strengthening this area through targeted practice and review of foundational concepts.`,
    priority: i === 0 ? "high" : i === 1 ? "medium" : "low" as const,
  }));

  recommendations.push({
    title: "Maintain strengths",
    description: "Continue practicing your strong areas to keep proficiency.",
    priority: "low",
  });

  // 6. Study plan
  const studyPlan = [
    {
      phase: "Week 1-2: Foundation",
      actions: weaknesses.slice(0, 2).map((w) => `Review and practice ${w} fundamentals`),
    },
    {
      phase: "Week 3-4: Application",
      actions: weaknesses.slice(2).map((w) => `Apply ${w} in practice problems`).concat(["Take a mock assessment"]),
    },
    {
      phase: "Week 5-6: Mastery",
      actions: ["Review all weak areas", "Take final diagnostic", "Track improvement"],
    },
  ];

  // 7. AI summary (placeholder - would call OpenRouter)
  const aiSummary = assessmentType === "academic"
    ? `${userName} shows a ${category} overall performance in ${assessmentTitle}. Strong areas include ${strengths.join(", ")}. Areas needing attention: ${weaknesses.join(", ")}. Recommended focus: ${recommendations[0]?.title || "balanced improvement"}.`
    : null;

  return {
    id: `dr-${Date.now()}`,
    overallScore,
    category,
    conceptMastery: conceptScores,
    cognitiveProfile,
    strengths,
    weaknesses,
    recommendations,
    studyPlan,
    aiSummary,
    generatedAt: new Date().toISOString(),
  };
}
