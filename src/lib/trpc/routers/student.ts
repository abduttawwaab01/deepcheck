import { z } from "zod";
import { studentProcedure as protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { assessmentConfigs, assessmentInstances } from "@/lib/db/schemas/assessments";
import { basicReports } from "@/lib/db/schemas/reports";
import { questionBanks, questionBankConfigs } from "@/lib/db/schemas/question-banks";
import { questions as questionsTable } from "@/lib/db/schemas/questions";
import { masteryScores } from "@/lib/db/schemas/scoring";
import { topics } from "@/lib/db/schemas/content";
import { userStreaks, userBadges } from "@/lib/db/schemas/gamification";
import { eq, sql, desc, and, inArray } from "drizzle-orm";

export const studentRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!user) return null;

    const [assessmentCount] = await db.select({ count: sql<number>`count(*)` }).from(assessmentInstances)
      .where(eq(assessmentInstances.userId, ctx.user.id));
    const [reportCount] = await db.select({ count: sql<number>`count(*)` }).from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id));
    const [latestReport] = await db.select().from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id)).orderBy(desc(basicReports.createdAt)).limit(1);

    const [prevReport] = await db.select().from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id)).orderBy(desc(basicReports.createdAt)).limit(1).offset(1);

    const allReports = await db.select().from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id)).orderBy(desc(basicReports.createdAt)).limit(20);

    const journey = allReports.reverse().map((r) => ({
      date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
      score: Number(r.overallScore),
    }));

    const userMastery = await db.select({
      topicId: masteryScores.topicId,
      abilityEstimate: masteryScores.abilityEstimate,
      responsesCount: masteryScores.responsesCount,
    }).from(masteryScores).where(eq(masteryScores.userId, ctx.user.id));

    const topicIds = userMastery.map((m) => m.topicId).filter(Boolean);
    const topicNames = topicIds.length > 0 ? await db.select({ id: topics.id, name: topics.name })
      .from(topics).where(inArray(topics.id, topicIds)) : [];
    const topicNameMap: Record<string, string> = {};
    for (const t of topicNames) topicNameMap[t.id] = t.name;

    const weakConceptsList = userMastery
      .filter((m) => parseFloat(String(m.abilityEstimate)) < -0.5)
      .sort((a, b) => parseFloat(String(a.abilityEstimate)) - parseFloat(String(b.abilityEstimate)))
      .slice(0, 5)
      .map((m) => ({
        id: m.topicId,
        name: topicNameMap[m.topicId] || "Unknown Topic",
        score: Math.round(((parseFloat(String(m.abilityEstimate)) + 3) / 6) * 100),
      }));

    const strongConcepts = userMastery
      .filter((m) => parseFloat(String(m.abilityEstimate)) > 1.0)
      .sort((a, b) => parseFloat(String(b.abilityEstimate)) - parseFloat(String(a.abilityEstimate)))
      .slice(0, 5)
      .map((m) => ({
        id: m.topicId,
        name: topicNameMap[m.topicId] || "Unknown Topic",
        score: Math.round(((parseFloat(String(m.abilityEstimate)) + 3) / 6) * 100),
      }));

    const topicBreakdown = latestReport?.topicBreakdown as { name: string; score: number }[] | null;
    const radarData = topicBreakdown
      ? topicBreakdown.map((t) => ({
          dimension: t.name,
          score: t.score,
          peerAverage: 55,
        }))
      : [];

    const streak = allReports.length >= 2 ? 1 : 0;

    const [gamification] = await db.select().from(userStreaks)
      .where(eq(userStreaks.userId, ctx.user.id)).limit(1);
    const badges = await db.select().from(userBadges)
      .where(eq(userBadges.userId, ctx.user.id)).orderBy(desc(userBadges.awardedAt)).limit(10);

    return {
      name: user.firstName,
      streak: gamification?.currentStreak || 0,
      totalXp: gamification?.totalXp || 0,
      level: gamification?.level || 1,
      badges: badges.map((b) => ({ code: b.badgeCode, name: b.badgeName, iconUrl: b.iconUrl })),
      assessments: assessmentCount?.count || 0,
      weakConcepts: weakConceptsList.length,
      conceptsMastered: strongConcepts.length,
      deepReports: reportCount?.count || 0,
      overallReadiness: latestReport ? {
        score: Number(latestReport.overallScore),
        previousScore: prevReport ? Number(prevReport.overallScore) : 0,
        category: latestReport.category,
      } : null,
      radarData,
      weakConceptsList,
      strongConcepts,
      journey,
      recommendations: (latestReport?.recommendations as { title: string; description: string; priority: string }[] || []).map((r, i) => ({
        id: `rec-${i}`,
        title: r.title,
        description: r.description,
      })),
    };
  }),

  getAssessments: protectedProcedure.query(async () => {
    return db.select({
      id: assessmentConfigs.id,
      title: assessmentConfigs.title,
      assessmentType: assessmentConfigs.assessmentType,
      questionCount: assessmentConfigs.questionCount,
      timeLimitMinutes: assessmentConfigs.timeLimitMinutes,
    }).from(assessmentConfigs).where(eq(assessmentConfigs.isPublic, true)).orderBy(assessmentConfigs.title);
  }),

  getAssessmentListings: protectedProcedure.query(async () => {
    const banks = await db.select().from(questionBanks)
      .where(inArray(questionBanks.level, ['PRI-JSS1', 'JSS3-SS1', 'SS3-UNI']))
      .orderBy(questionBanks.displayOrder);
    const results: {
      id: string; title: string; level: string; description: string;
      questionCount: number; timeLimitMinutes: number; sections: { name: string; count: number }[];
      requiresDepartment?: boolean;
    }[] = [];
    for (const bank of banks) {
      const slug = bank.level === "PRI-JSS1" ? "primary-to-jss1"
        : bank.level === "JSS3-SS1" ? "jss3-to-ss1"
        : "ss3-to-university";
      const configs = await db.select().from(questionBankConfigs)
        .where(eq(questionBankConfigs.bankId, bank.id))
        .orderBy(questionBankConfigs.displayOrder);
      const [qCount] = await db.select({ count: sql<number>`count(*)` }).from(questionsTable)
        .where(and(eq(questionsTable.bankId, bank.id), sql`${questionsTable.deletedAt} IS NULL`));
      const totalQ = Math.min(35, qCount?.count || 0);
      results.push({
        id: slug,
        title: bank.title,
        level: slug,
        description: bank.description || "",
        questionCount: totalQ,
        timeLimitMinutes: 45,
        requiresDepartment: slug === "ss3-to-university",
        sections: configs.map((c) => ({
          name: c.sectionName,
          count: Math.min(c.questionCount ?? 10, Math.ceil(totalQ / configs.length)),
        })),
      });
    }
    return results;
  }),

  getReports: protectedProcedure.query(async ({ ctx }) => {
    const { deepReports } = await import("@/lib/db/schemas/reports");
    const reports = await db.select().from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id)).orderBy(desc(basicReports.createdAt));

    const userDeepReports = await db.select({ basicReportId: deepReports.basicReportId, id: deepReports.id, status: deepReports.status })
      .from(deepReports).where(eq(deepReports.userId, ctx.user.id));
    const deepMap: Record<string, { id: string; status: string | null }> = {};
    for (const dr of userDeepReports) deepMap[dr.basicReportId] = { id: dr.id, status: dr.status };

    return reports.map((r) => {
      const deep = deepMap[r.id];
      return {
        id: r.id,
        instanceId: r.instanceId,
        title: "Assessment Report",
        score: Number(r.overallScore),
        category: r.category,
        date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
        hasDeep: deep?.status === "completed" || false,
        deepId: deep?.id || null,
      };
    });
  }),

  getBasicReport: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [report] = await db.select().from(basicReports).where(eq(basicReports.id, input.id)).limit(1);
      if (!report) return null;
      return {
        id: report.id,
        score: Number(report.overallScore),
        category: report.category,
        topics: (report.topicBreakdown as { name: string; score: number; correct: number; total: number; classification: string }[]) || [],
        strengths: (report.strengths as string[]) || [],
        weaknesses: (report.weaknesses as string[]) || [],
        recommendations: (report.recommendations as { title: string; description: string; priority: string }[]) || [],
        createdAt: report.createdAt?.toISOString?.()?.split("T")[0] || "",
      };
    }),

  getDeepReport: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { deepReports } = await import("@/lib/db/schemas/reports");
      const [report] = await db.select().from(deepReports).where(eq(deepReports.id, input.id)).limit(1);
      if (!report) return null;
      return {
        id: report.id,
        status: report.status,
        cognitiveProfile: report.cognitiveProfile as { label: string; score: number; average: number }[] | null,
        conceptMap: report.conceptMap as { name: string; score: number; status: string; correct: number; total: number }[] | null,
        learningStyle: report.learningStyle,
        masteryProgression: report.masteryProgression,
        personalizedPlan: report.personalizedPlan,
        predictedPerformance: report.predictedPerformance,
        studyRecommendations: report.studyRecommendations as { priority: string; title: string; description: string }[] | null,
        aiSummary: report.aiSummary,
        generatedAt: report.generatedAt?.toISOString?.() || "",
      };
    }),

  requestDeepReport: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { deepReports, reportRequests } = await import("@/lib/db/schemas/reports");
      const { subscriptionCredits } = await import("@/lib/db/schemas/payments");

      const [basicReport] = await db.select().from(basicReports)
        .where(and(eq(basicReports.instanceId, input.instanceId), eq(basicReports.userId, ctx.user.id)))
        .limit(1);
      if (!basicReport) return { success: false, message: "Assessment report not found" };

      const [existingDeep] = await db.select().from(deepReports)
        .where(eq(deepReports.basicReportId, basicReport.id)).limit(1);
      if (existingDeep && existingDeep.status === "completed") {
        return { success: true, deepReportId: existingDeep.id, message: "Deep report already available" };
      }

      const [credits] = await db.select({ total: sql<number>`coalesce(sum(${subscriptionCredits.creditsRemaining}), 0)` })
        .from(subscriptionCredits).where(eq(subscriptionCredits.userId, ctx.user.id));
      if ((credits?.total || 0) <= 0) {
        return { success: false, message: "No deep report credits remaining. Please purchase a plan.", paymentUrl: "/pricing" };
      }

      await db.update(subscriptionCredits).set({
        creditsRemaining: sql`${subscriptionCredits.creditsRemaining} - 1`,
      }).where(and(
        eq(subscriptionCredits.userId, ctx.user.id),
        sql`${subscriptionCredits.creditsRemaining} > 0`
      ));

      const { generateDeepReport } = await import("@/lib/engine/report-generator");
      const result = await generateDeepReport({ userId: ctx.user.id, instanceId: input.instanceId });

      if (!result.success) {
        return { success: false, message: result.error || "Failed to generate deep report" };
      }

      await db.insert(reportRequests).values({
        requesterId: ctx.user.id,
        requesterRole: "student",
        instanceId: input.instanceId,
        assessmentType: "academic",
        status: "completed",
        deepReportId: result.reportId,
      });

      return { success: true, deepReportId: result.reportId, message: "Deep report generated successfully" };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    };
  }),

  updateProfile: protectedProcedure
    .input(z.object({ firstName: z.string().min(1), lastName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await db.update(users).set({ firstName: input.firstName, lastName: input.lastName, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  getGamification: protectedProcedure.query(async ({ ctx }) => {
    const { getUserGamification, getLeaderboard } = await import("@/lib/engine/gamification");
    const gamification = await getUserGamification(ctx.user.id);
    const leaderboardData = await getLeaderboard("weekly", 20);
    return { ...gamification, leaderboard: leaderboardData };
  }),

  getSpacedRepetitionSchedule: protectedProcedure.query(async ({ ctx }) => {
    const { generateBatchSchedule } = await import("@/lib/engine/spaced-repetition");

    const masteries = await db.select({
      topicId: masteryScores.topicId,
      abilityEstimate: masteryScores.abilityEstimate,
      responsesCount: masteryScores.responsesCount,
      lastUpdated: masteryScores.lastUpdated,
    }).from(masteryScores).where(eq(masteryScores.userId, ctx.user.id));

    const topicIds = masteries.map((m) => m.topicId);
    const topicNames = topicIds.length > 0
      ? await db.select({ id: topics.id, name: topics.name })
          .from(topics).where(inArray(topics.id, topicIds))
      : [];
    const nameMap = new Map(topicNames.map((t) => [t.id, t.name]));

    const schedules = generateBatchSchedule(
      masteries.map((m) => ({
        topicId: m.topicId,
        currentMastery: parseFloat(String(m.abilityEstimate || "0")),
        stability: Math.max(1, parseFloat(String(m.abilityEstimate || "0")) * 10 + 5),
        reviewCount: m.responsesCount || 0,
        easeFactor: 2.5,
        currentInterval: Math.max(1, (m.responsesCount || 0) * 2),
        lastSession: null,
      })),
    );

    return schedules.map((s) => ({
      ...s,
      topicName: nameMap.get(s.topicId) || "Unknown Topic",
      nextReviewDate: s.nextReviewDate.toISOString(),
    }));
  }),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
