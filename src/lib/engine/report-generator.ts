import { classify, estimateTheta, thetaToScaledScore, estimateConceptMasteries } from "@/lib/engine/irt";
import type { ItemParams } from "@/lib/engine/irt";
import { generateRecommendations, generateCognitiveProfile } from "@/lib/ai/openrouter";
import { db } from "@/lib/db";
import { basicReports, deepReports } from "@/lib/db/schemas/reports";
import { assessmentInstances, assessmentResponses } from "@/lib/db/schemas/assessments";
import { questions as questionsTable, questionOptions } from "@/lib/db/schemas/questions";
import { users } from "@/lib/db/schemas";
import { topics, subjects, cognitiveAttributes, itemAttributeMatrix } from "@/lib/db/schemas/content";
import { eq, inArray, and, sql } from "drizzle-orm";
import { analyzeItems } from "@/lib/engine/item-analysis";
import { analyzeResponseTimes } from "@/lib/engine/response-time-analytics";
import type { ResponseTimeRecord } from "@/lib/engine/response-time-analytics";

export interface DeepReportInput {
  userId: string;
  instanceId: string;
}

function computeResponseTimeMetrics(responses: { timeSpentSeconds: number | null }[]) {
  const times = responses.map((r) => r.timeSpentSeconds || 0).filter((t) => t > 0);
  if (times.length === 0) return { avgTimeSecs: 0, medianTimeSecs: 0, consistency: 0, rushing: false };
  const sorted = [...times].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const variance = times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length;
  const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
  const consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  const rushing = avg < 8;
  return { avgTimeSecs: Math.round(avg), medianTimeSecs: Math.round(median), consistency, rushing };
}

function computeBloomPerformance(responses: any[], dbQuestions: any[]) {
  const bloomGroups: Record<string, { correct: number; total: number }> = {};
  for (const r of responses) {
    const q = dbQuestions.find((dq) => dq.id === r.questionId);
    const bloom = q?.bloomLevel || "unclassified";
    if (!bloomGroups[bloom]) bloomGroups[bloom] = { correct: 0, total: 0 };
    bloomGroups[bloom].total++;
    if (r.isCorrect) bloomGroups[bloom].correct++;
  }
  return Object.entries(bloomGroups).map(([level, g]) => ({
    level,
    score: g.total > 0 ? Math.round((g.correct / g.total) * 100) : 0,
    correct: g.correct,
    total: g.total,
  }));
}

function computeConsistencyIndex(responses: any[], dbQuestions: any[]): number {
  if (responses.length < 4) return 50;
  const sorted = [...responses].sort((a, b) => a.orderIndex - b.orderIndex);
  const half = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, half);
  const secondHalf = sorted.slice(half);
  const firstCorrect = firstHalf.filter((r) => r.isCorrect).length / firstHalf.length;
  const secondCorrect = secondHalf.filter((r) => r.isCorrect).length / secondHalf.length;
  const diff = Math.abs(firstCorrect - secondCorrect);
  return Math.round(Math.max(0, Math.min(100, (1 - diff * 2) * 100)));
}

function computeGuessingIndex(responses: any[], dbQuestions: any[]): number {
  let quickCorrect = 0;
  let quickTotal = 0;
  for (const r of responses) {
    const q = dbQuestions.find((dq) => dq.id === r.questionId);
    const expected = q?.expectedTimeSecs || 30;
    if ((r.timeSpentSeconds || 0) < expected * 0.25) {
      quickTotal++;
      if (r.isCorrect) quickCorrect++;
    }
  }
  if (quickTotal === 0) return 0;
  const ratio = quickCorrect / quickTotal;
  return Math.round(ratio * 100);
}

export async function generateDeepReport(input: DeepReportInput): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
    if (!user) return { success: false, error: "User not found" };

    const [instance] = await db.select().from(assessmentInstances)
      .where(eq(assessmentInstances.id, input.instanceId)).limit(1);
    if (!instance) return { success: false, error: "Assessment instance not found" };

    const [basicReport] = await db.select().from(basicReports)
      .where(eq(basicReports.instanceId, input.instanceId)).limit(1);
    if (!basicReport) return { success: false, error: "Basic report not found" };

    const responses = await db.select().from(assessmentResponses)
      .where(eq(assessmentResponses.instanceId, input.instanceId));
    const qIds = responses.map((r) => r.questionId);

    const dbQuestions = qIds.length > 0 ? await db.select().from(questionsTable)
      .where(inArray(questionsTable.id, qIds)) : [];
    const dbOpts = qIds.length > 0 ? await db.select().from(questionOptions)
      .where(inArray(questionOptions.questionId, qIds)) : [];

    const correctMap: Record<string, string> = {};
    for (const o of dbOpts) { if (o.isCorrect) correctMap[o.questionId] = o.id; }

    const itemParams: ItemParams[] = dbQuestions.map((q) => ({
      id: q.id,
      a: parseFloat(String(q.discriminationParam || "1")) || 1,
      b: parseFloat(String(q.difficultyParam || "0")) || 0,
      c: parseFloat(String(q.guessingParam || "0.25")) || 0.25,
      topicId: q.topicId || undefined,
      bloomLevel: q.bloomLevel || undefined,
    }));

    const itemResponsesForTheta = responses.map((r) => {
      const item = itemParams.find((p) => p.id === r.questionId);
      return {
        item: item || { id: r.questionId, a: 1, b: 0, c: 0.25 },
        correct: r.isCorrect || correctMap[r.questionId] === r.selectedOptionId,
      };
    });

    const itemResponsesForConcepts = responses.map((r) => ({
      itemId: r.questionId,
      correct: r.isCorrect || correctMap[r.questionId] === r.selectedOptionId,
    }));

    const { theta, se } = estimateTheta(itemResponsesForTheta);
    const overallScore = thetaToScaledScore(theta);
    const category = classify(theta);

    const enrichedResponses = responses.map((r) => ({
      ...r,
      isCorrect: r.isCorrect || correctMap[r.questionId] === r.selectedOptionId,
    }));

    const conceptMasteryResults = estimateConceptMasteries(itemParams, itemResponsesForConcepts);
    const conceptMasteryMap = new Map<string, { mastery: number; responses: number }>();
    for (const cm of conceptMasteryResults) {
      if (cm.topicId) conceptMasteryMap.set(cm.topicId, { mastery: cm.theta, responses: cm.responses });
    }

    const topicGroups = new Map<string, { correct: number; total: number; name: string }>();
    for (const r of enrichedResponses) {
      const q = dbQuestions.find((dq) => dq.id === r.questionId);
      const topicId = q?.topicId || "general";
      if (!topicGroups.has(topicId)) topicGroups.set(topicId, { correct: 0, total: 0, name: q?.concept || "General" });
      const g = topicGroups.get(topicId)!;
      g.total++;
      if (r.isCorrect) g.correct++;
    }

    const conceptMasteries = Array.from(topicGroups.entries()).map(([topicId, g]) => {
      const irtMastery = conceptMasteryMap.get(topicId);
      const irtScore = irtMastery ? Math.round(irtMastery.mastery * 100) : Math.round((g.correct / g.total) * 100);
      const irtTheta = irtMastery ? (irtMastery.mastery * 6 - 3) : ((g.correct / g.total) * 6 - 3);
      return {
        topicId,
        topicName: g.name,
        score: irtScore,
        classification: classify(irtTheta),
        responses: g.total,
      };
    });

    const sorted = [...conceptMasteries].sort((a, b) => b.score - a.score);
    const strengths = sorted.filter((c) => c.score >= 70).slice(0, 5).map((c) => c.topicName);
    const weaknesses = sorted.filter((c) => c.score < 50).slice(0, 5).map((c) => c.topicName);

    const bloomPerformance = computeBloomPerformance(enrichedResponses, dbQuestions);

    const responseTimeMetrics = computeResponseTimeMetrics(responses);
    const consistencyIndex = computeConsistencyIndex(enrichedResponses, dbQuestions);
    const guessingIndex = computeGuessingIndex(enrichedResponses, dbQuestions);

    // ── Item Analysis ──────────────────────────────────────────────────
    const itemAnalysisRecords = responses.map((r) => ({
      questionId: r.questionId,
      selectedOptionId: r.selectedOptionId || "",
      isCorrect: r.isCorrect || correctMap[r.questionId] === r.selectedOptionId,
      timeSpentSeconds: r.timeSpentSeconds || 0,
    }));
    const itemAnalysis = analyzeItems(itemAnalysisRecords, responses.length);

    // ── Response Time Analytics ────────────────────────────────────────
    const rtRecords: ResponseTimeRecord[] = enrichedResponses.map((r, i) => ({
      questionId: r.questionId,
      timeSpentSeconds: r.timeSpentSeconds || 0,
      isCorrect: r.isCorrect,
      questionOrder: i + 1,
      expectedTimeSecs: dbQuestions.find((dq) => dq.id === r.questionId)?.expectedTimeSecs || undefined,
      difficultyLevel: dbQuestions.find((dq) => dq.id === r.questionId)?.difficultyLevel || undefined,
      bloomLevel: dbQuestions.find((dq) => dq.id === r.questionId)?.bloomLevel || undefined,
    }));
    const rtAnalytics = analyzeResponseTimes(rtRecords);

    // ── Item Quality Summary ───────────────────────────────────────────
    const itemQualitySummary = {
      excellent: itemAnalysis.summary.itemsByQuality.excellent,
      good: itemAnalysis.summary.itemsByQuality.good,
      acceptable: itemAnalysis.summary.itemsByQuality.acceptable,
      marginal: itemAnalysis.summary.itemsByQuality.marginal,
      poor: itemAnalysis.summary.itemsByQuality.poor,
      reject: itemAnalysis.summary.itemsByQuality.reject,
      meanDiscrimination: Math.round(itemAnalysis.summary.meanDiscrimination * 100) / 100,
      meanDifficulty: Math.round(itemAnalysis.summary.meanDifficulty * 100) / 100,
    };

    // ── Engagement Metrics ─────────────────────────────────────────────
    const engagementMetrics = {
      rushingScore: rtAnalytics.rushingDetection.rushingScore,
      fatigueDetected: rtAnalytics.engagementPattern.fatigue.detected,
      boredomDetected: rtAnalytics.engagementPattern.boredom.detected,
      anxietyDetected: rtAnalytics.engagementPattern.anxiety.detected,
      peakPerformanceWindow: rtAnalytics.engagementPattern.peakPerformanceWindow,
      timeEfficiency: Math.round(rtAnalytics.overallTimeEfficiency * 100),
    };

    const cognitiveProfile = [
      { dimension: "Accuracy", score: overallScore, average: 55, description: "Overall correctness rate" },
      { dimension: "Consistency", score: consistencyIndex, average: 60, description: "Performance stability across the assessment" },
      { dimension: "Speed", score: responseTimeMetrics.avgTimeSecs > 0 ? Math.min(100, Math.round(100 - responseTimeMetrics.avgTimeSecs * 1.5)) : 50, average: 50, description: "Response time efficiency" },
      { dimension: "Depth of Understanding", score: bloomPerformance.find((b) => b.level === "analyze")?.score || bloomPerformance.find((b) => b.level === "apply")?.score || overallScore, average: 50, description: "Performance on higher-order Bloom's levels" },
      { dimension: "Knowledge Application", score: bloomPerformance.find((b) => b.level === "apply")?.score || overallScore, average: 50, description: "Ability to apply knowledge to problems" },
    ];

    const aiData = {
      studentName: `${user.firstName} ${user.lastName}`,
      overallScore,
      category,
      theta,
      conceptMasteries: conceptMasteries.map((c) => ({
        topicName: c.topicName,
        score: c.score,
        classification: c.classification,
        responses: c.responses,
      })),
      strengths,
      weaknesses,
      cognitiveProfile: Object.fromEntries(cognitiveProfile.map((c) => [c.dimension, c.score])),
    };

    const aiResult = await generateRecommendations(aiData);
    const cognitiveText = await generateCognitiveProfile({
      strengths,
      weaknesses,
      bloomBreakdown: Object.fromEntries(bloomPerformance.map((b) => [b.level, b.total])),
    });

    const prioritizedWeaknesses = [...conceptMasteries]
      .filter((c) => c.score < 50)
      .sort((a, b) => a.score - b.score);

    const studyPlan = [
      {
        phase: "Week 1-2: Foundation",
        actions: prioritizedWeaknesses.slice(0, 2).map((w) => `Review and practice ${w.topicName} fundamentals — current mastery: ${w.score}%`),
      },
      {
        phase: "Week 3-4: Application",
        actions: [
          ...prioritizedWeaknesses.slice(2, 4).map((w) => `Apply ${w.topicName} in practice problems`),
          "Take a focused practice assessment on weak areas",
        ],
      },
      {
        phase: "Week 5-6: Mastery",
        actions: ["Review all weak areas", "Take a full diagnostic assessment", "Compare scores to track improvement"],
      },
    ];

    const predictedImprovement = Math.min(25, Math.max(5, Math.round((1 - se) * 15 + (strengths.length > weaknesses.length ? 5 : 0))));
    const predictedPerformance = {
      nextAssessment: Math.min(100, overallScore + predictedImprovement),
      confidence: Math.max(60, Math.min(95, Math.round((1 - se) * 100))),
      timeframe: "4-6 weeks with consistent practice",
      improvementEstimate: `+${predictedImprovement} points projected based on current trajectory`,
    };

    const conceptMap = conceptMasteries.map((c) => ({
      name: c.topicName,
      score: c.score,
      status: c.score >= 70 ? "strong" : c.score >= 50 ? "developing" : "weak",
      correct: Math.round(c.score * c.responses / 100),
      total: c.responses,
    }));

    const [prevReports] = await db.select({ score: basicReports.overallScore })
      .from(basicReports)
      .where(and(eq(basicReports.userId, input.userId), sql`${basicReports.id} != ${basicReport.id}`))
      .orderBy(sql`${basicReports.createdAt} DESC`)
      .limit(5);

    const learningBehavior = {
      responseTimePattern: responseTimeMetrics.rushing ? "rushing" : responseTimeMetrics.consistency > 70 ? "methodical" : "variable",
      consistencyIndex,
      guessingIndicator: guessingIndex,
      avgResponseTimeSecs: responseTimeMetrics.avgTimeSecs,
      totalAssessmentTimeSecs: responses.reduce((sum, r) => sum + (r.timeSpentSeconds || 0), 0),
      engagementMetrics,
      itemQualitySummary,
      timeAnalytics: {
        distribution: rtAnalytics.distribution,
        rushingScore: rtAnalytics.rushingDetection.rushingScore,
        overallEfficiency: rtAnalytics.overallTimeEfficiency,
      },
    };

    const [deepReport] = await db.insert(deepReports).values({
      basicReportId: basicReport.id,
      userId: input.userId,
      status: "completed",
      conceptMap,
      cognitiveProfile: cognitiveProfile.map((c) => ({ label: c.dimension, score: c.score, average: c.average, description: c.description })),
      masteryProgression: {
        conceptMasteries: conceptMasteries.map((c) => ({
          topicId: c.topicId,
          topicName: c.topicName,
          score: c.score,
          classification: c.classification,
          responses: c.responses,
        })),
        itemAnalysisSummary: {
          totalItems: itemAnalysis.summary.totalItems,
          meanDiscrimination: itemAnalysis.summary.meanDiscrimination,
          meanDifficulty: itemAnalysis.summary.meanDifficulty,
          problemItems: itemAnalysis.summary.problemItems.length,
          suggestions: itemAnalysis.summary.suggestedRevisions.slice(0, 10),
        },
      },
      learningStyle: learningBehavior,
      personalizedPlan: { phases: studyPlan },
      predictedPerformance,
      studyRecommendations: aiResult.resourceSuggestions.map((r, i) => ({
        priority: i === 0 ? "high" : i === 1 ? "medium" : "low",
        title: r,
        description: `Recommended resource for improving your performance.`,
      })),
      aiSummary: aiResult.summary || cognitiveText,
      generatedAt: new Date(),
    }).returning();

    await db.update(basicReports).set({ isDeepReportAvailable: true }).where(eq(basicReports.id, basicReport.id));

    return { success: true, reportId: deepReport.id };
  } catch (error) {
    console.error("Deep report generation error:", error);
    return { success: false, error: "Failed to generate deep report" };
  }
}
