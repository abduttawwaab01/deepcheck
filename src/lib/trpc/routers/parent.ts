import { z } from "zod";
import { parentProcedure as protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { guardianRelations } from "@/lib/db/schemas/guardians";
import { basicReports } from "@/lib/db/schemas/reports";
import { assessmentInstances } from "@/lib/db/schemas/assessments";
import { masteryScores, forgettingCurves, masteryProgression, thetaHistory } from "@/lib/db/schemas/scoring";
import { userStreaks } from "@/lib/db/schemas/gamification";
import { topics } from "@/lib/db/schemas/content";
import { eq, sql, desc, inArray, and } from "drizzle-orm";
import { computeEarlyWarning, extractStudentInput } from "@/lib/engine/early-warning";
import { computeStudentDetail, type StudentRecord } from "@/lib/engine/class-insights";
import { parentAssessmentQuestions, parentAssessmentOptions, parentAssessmentResponses, parentAssessmentDeepReports } from "@/lib/db/schemas/parent-assessments";
import { generateParentDeepReport } from "@/lib/engine/parent-report-generator";
import { subscriptionCredits } from "@/lib/db/schemas/payments";

export const parentRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    const children = await db.select({ studentId: guardianRelations.studentId })
      .from(guardianRelations).where(eq(guardianRelations.guardianId, ctx.user.id));
    const childIds = children.map((c) => c.studentId);
    const childData: { id: string; name: string; lastScore: number; lastAssessment: string; date: string; hasDeep: boolean }[] = [];
    if (childIds.length > 0) {
      const childUsers = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
        .from(users).where(inArray(users.id, childIds));
      for (const cu of childUsers) {
        const [report] = await db.select().from(basicReports).where(eq(basicReports.userId, cu.id))
          .orderBy(desc(basicReports.createdAt)).limit(1);
        childData.push({
          id: cu.id,
          name: `${cu.firstName} ${cu.lastName}`,
          lastScore: report ? Number(report.overallScore) : 0,
          lastAssessment: report ? "Diagnostic" : "None",
          date: report?.createdAt?.toISOString?.()?.split("T")[0] || "",
          hasDeep: report?.isDeepReportAvailable || false,
        });
      }
    }

    const { subscriptionCredits } = await import("@/lib/db/schemas/payments");
    const [credits] = await db.select({ total: sql<number>`coalesce(sum(${subscriptionCredits.creditsRemaining}), 0)` })
      .from(subscriptionCredits).where(eq(subscriptionCredits.userId, ctx.user.id));

    return {
      name: user ? `${user.firstName} ${user.lastName}` : "",
      children: childData,
      recentActivity: [] as { child: string; action: string; date: string }[],
      deepReportCredits: credits?.total || 0,
    };
  }),

  getChildren: protectedProcedure.query(async ({ ctx }) => {
    const relations = await db.select({ studentId: guardianRelations.studentId, relationship: guardianRelations.relationship })
      .from(guardianRelations).where(eq(guardianRelations.guardianId, ctx.user.id));
    const childIds = relations.map((r) => r.studentId);
    if (childIds.length === 0) return [];
    const childUsers = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName, email: users.email, createdAt: users.createdAt })
      .from(users).where(inArray(users.id, childIds));

    const { assessmentInstances } = await import("@/lib/db/schemas/assessments");
    const relMap: Record<string, string | null> = {};
    for (const r of relations) relMap[r.studentId] = r.relationship;

    const results = [];
    for (const cu of childUsers) {
      const [assessCount] = await db.select({ count: sql<number>`count(*)` }).from(assessmentInstances)
        .where(eq(assessmentInstances.userId, cu.id));
      results.push({
        id: cu.id,
        name: `${cu.firstName} ${cu.lastName}`,
        email: cu.email || "",
        relationship: relMap[cu.id] || "ward",
        assessments: assessCount?.count || 0,
        lastActive: cu.createdAt?.toISOString?.()?.split("T")[0] || "",
      });
    }
    return results;
  }),

  getChildReports: protectedProcedure
    .input(z.object({ childId: z.string() }))
    .query(async ({ input }) => {
      const reports = await db.select().from(basicReports)
        .where(eq(basicReports.userId, input.childId)).orderBy(desc(basicReports.createdAt));
      return reports.map((r) => ({
        id: r.id,
        title: "Assessment Report",
        score: Number(r.overallScore),
        category: r.category,
        date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
        hasDeep: r.isDeepReportAvailable || false,
        deepId: null,
      }));
    }),

  addChild: protectedProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string(), relationship: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [child] = await db.select({ id: users.id }).from(users)
        .where(sql`LOWER(${users.email}) = LOWER(${input.email})`).limit(1);
      if (child) {
        const [existing] = await db.select().from(guardianRelations)
          .where(and(eq(guardianRelations.guardianId, ctx.user.id), eq(guardianRelations.studentId, child.id)))
          .limit(1);
        if (!existing) {
          await db.insert(guardianRelations).values({
            guardianId: ctx.user.id,
            studentId: child.id,
            relationship: input.relationship,
            isPrimary: false,
            isActive: true,
          });
        }
        return { success: true, message: `${input.firstName} ${input.lastName} added as your child` };
      }
      return { success: false, message: `No account found with email ${input.email}. Your child needs to register first.` };
    }),

  requestDeepReport: protectedProcedure
    .input(z.object({ childId: z.string(), instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { reportRequests } = await import("@/lib/db/schemas/reports");
      const { subscriptionCredits } = await import("@/lib/db/schemas/payments");

      const [credits] = await db.select({ total: sql<number>`coalesce(sum(${subscriptionCredits.creditsRemaining}), 0)` })
        .from(subscriptionCredits).where(eq(subscriptionCredits.userId, ctx.user.id));

      if ((credits?.total || 0) <= 0) {
        return { success: false, message: "No deep report credits remaining. Please purchase a plan.", paymentUrl: "/pricing" };
      }

      await db.insert(reportRequests).values({
        requesterId: ctx.user.id,
        requesterRole: "parent",
        targetUserId: input.childId,
        instanceId: input.instanceId,
        assessmentType: "academic",
        status: "pending",
      });

      return { success: true, message: "Deep report request submitted", paymentUrl: "" };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    };
  }),

  getChildEarlyWarning: protectedProcedure
    .input(z.object({ childId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Verify this child belongs to this parent
      const [relation] = await db.select().from(guardianRelations)
        .where(and(eq(guardianRelations.guardianId, ctx.user.id), eq(guardianRelations.studentId, input.childId)))
        .limit(1);
      if (!relation) return null;

      const [student] = await db.select().from(users).where(eq(users.id, input.childId)).limit(1);
      if (!student) return null;

      const [reports, instances, mastery, streak, curves, progression, thetaHist] = await Promise.all([
        db.select().from(basicReports).where(eq(basicReports.userId, input.childId)).orderBy(desc(basicReports.createdAt)),
        db.select().from(assessmentInstances).where(eq(assessmentInstances.userId, input.childId)).orderBy(desc(assessmentInstances.startedAt)),
        db.select().from(masteryScores).where(eq(masteryScores.userId, input.childId)),
        db.select().from(userStreaks).where(eq(userStreaks.userId, input.childId)).limit(1),
        db.select().from(forgettingCurves).where(eq(forgettingCurves.userId, input.childId)),
        db.select().from(masteryProgression).where(eq(masteryProgression.userId, input.childId)).orderBy(desc(masteryProgression.recordedAt)),
        db.select().from(thetaHistory).innerJoin(assessmentInstances, eq(thetaHistory.instanceId, assessmentInstances.id))
          .where(eq(assessmentInstances.userId, input.childId)).orderBy(desc(thetaHistory.recordedAt)),
      ]);

      const topicIds = [...new Set(mastery.map((m) => m.topicId))];
      const topicNames = topicIds.length > 0
        ? await db.select().from(topics).where(inArray(topics.id, topicIds))
        : [];
      const topicNameMap: Record<string, string> = {};
      for (const t of topicNames) topicNameMap[t.id] = t.name;

      const warningInput = extractStudentInput({
        studentId: input.childId,
        studentName: `${student.firstName} ${student.lastName}`,
        reports: reports.map((r) => ({
          overallScore: r.overallScore,
          category: r.category,
          createdAt: r.createdAt,
        })),
        instances: instances.map((i) => ({
          thetaEstimate: i.thetaEstimate,
          startedAt: i.startedAt,
        })),
        forgettingCurves: curves.map((fc) => ({
          currentRetention: fc.currentRetention,
          topicId: fc.topicId,
        })),
        streak: streak[0] ? {
          currentStreak: streak[0].currentStreak || 0,
          longestStreak: streak[0].longestStreak || 0,
          lastActivityDate: streak[0].lastActivityDate,
          totalXp: streak[0].totalXp || 0,
        } : null,
        masteryScores: mastery.map((m) => ({
          abilityEstimate: m.abilityEstimate,
          topicId: m.topicId,
        })),
      });

      const warning = computeEarlyWarning(warningInput);

      const studentRecord: StudentRecord = {
        studentId: input.childId,
        studentName: `${student.firstName} ${student.lastName}`,
        latestScore: reports[0] ? Number(reports[0].overallScore) : null,
        assessmentCount: reports.length,
        category: reports[0]?.category || null,
        theta: instances[0] ? Number(instances[0].thetaEstimate) : null,
        topicScores: mastery.map((m) => ({
          topicName: topicNameMap[m.topicId] || "Unknown",
          score: (Number(m.abilityEstimate) + 2) / 4 * 100,
        })),
        retentionAvg: curves.length > 0
          ? curves.reduce((s, c) => s + Number(c.currentRetention), 0) / curves.length
          : null,
        streak: streak[0]?.currentStreak || 0,
        lastActive: streak[0]?.lastActivityDate || null,
      };

      return computeStudentDetail({
        warning,
        student: studentRecord,
        reports: reports.map((r) => ({
          overallScore: Number(r.overallScore),
          category: r.category,
          topicBreakdown: (r.topicBreakdown as { name: string; score: number }[]) || [],
          createdAt: r.createdAt,
        })),
        thetaHistory: thetaHist.map((t) => ({
          theta: Number(t.theta_history.theta),
          se: Number(t.theta_history.se),
          recordedAt: t.theta_history.recordedAt,
        })),
        retentionData: curves.map((c) => ({
          topicName: topicNameMap[c.topicId] || "Unknown",
          retention: Number(c.currentRetention),
          nextReview: c.nextReviewDate,
        })),
        masteryProgression: progression.map((p) => ({
          topicName: topicNameMap[p.topicId] || "Unknown",
          thetaBefore: Number(p.thetaBefore),
          thetaAfter: Number(p.thetaAfter),
          delta: Number(p.deltaTheta),
          date: p.recordedAt,
        })),
      });
    }),

  getParentAssessment: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db.select({
      id: parentAssessmentQuestions.id,
      code: parentAssessmentQuestions.code,
      text: parentAssessmentQuestions.questionText,
      domain: parentAssessmentQuestions.domain,
      dimension: parentAssessmentQuestions.dimension,
      order: parentAssessmentQuestions.displayOrder,
    }).from(parentAssessmentQuestions)
      .where(eq(parentAssessmentQuestions.isActive, true))
      .orderBy(parentAssessmentQuestions.displayOrder);
    
    const qIds = rows.map((r) => r.id);
    const opts = qIds.length > 0 ? await db.select().from(parentAssessmentOptions)
      .where(inArray(parentAssessmentOptions.questionId, qIds))
      .orderBy(parentAssessmentOptions.optionOrder) : [];
    
    const optsByQ: Record<string, typeof opts> = {};
    for (const o of opts) {
      if (!optsByQ[o.questionId]) optsByQ[o.questionId] = [];
      optsByQ[o.questionId].push(o);
    }
    
    return rows.map((q) => ({
      id: q.id,
      code: q.code,
      text: q.text,
      domain: q.domain,
      dimension: q.dimension,
      options: (optsByQ[q.id] || []).map((o) => ({ id: o.id, text: o.optionText, score: o.score || 0, order: o.optionOrder })),
    }));
  }),

  submitParentAssessment: protectedProcedure
    .input(z.object({
      responses: z.array(z.object({ questionId: z.string(), optionId: z.string() })),
      childId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Fetch options with scores
      const optIds = input.responses.map((r) => r.optionId);
      const optData = optIds.length > 0 ? await db.select({
        id: parentAssessmentOptions.id,
        score: parentAssessmentOptions.score,
        questionId: parentAssessmentOptions.questionId,
      }).from(parentAssessmentOptions).where(inArray(parentAssessmentOptions.id, optIds)) : [];
      
      const scoreMap: Record<string, number> = {};
      for (const o of optData) scoreMap[o.id] = o.score || 0;

      // Fetch questions to get domains
      const qIds = input.responses.map((r) => r.questionId);
      const questionData = qIds.length > 0 ? await db.select({
        id: parentAssessmentQuestions.id,
        domain: parentAssessmentQuestions.domain,
      }).from(parentAssessmentQuestions).where(inArray(parentAssessmentQuestions.id, qIds)) : [];
      
      const domainMap: Record<string, string> = {};
      for (const q of questionData) domainMap[q.id] = q.domain;

      // Calculate total and domain scores
      const totalScore = input.responses.reduce((sum, r) => sum + (scoreMap[r.optionId] || 0), 0);
      const maxPossible = input.responses.length * 5;
      
      // Build domain scores
      const domainScores: Record<string, number> = {};
      const domainCounts: Record<string, { score: number; max: number }> = {};
      for (const r of input.responses) {
        const domain = domainMap[r.questionId] || "Unknown";
        if (!domainCounts[domain]) domainCounts[domain] = { score: 0, max: 0 };
        domainCounts[domain].score += scoreMap[r.optionId] || 0;
        domainCounts[domain].max += 5;
      }
      for (const [domain, data] of Object.entries(domainCounts)) {
        domainScores[domain] = Math.round((data.score / data.max) * 100);
      }

      // Determine category
      const pct = Math.round((totalScore / maxPossible) * 100);
      let category: "needs_guidance" | "developing" | "adequate" | "proficient" | "exemplary";
      if (pct < 20) category = "needs_guidance";
      else if (pct < 40) category = "developing";
      else if (pct < 60) category = "adequate";
      else if (pct < 80) category = "proficient";
      else category = "exemplary";

      const enrichedResponses = input.responses.map((r) => ({
        ...r,
        score: scoreMap[r.optionId] || 0,
        domain: domainMap[r.questionId] || "Unknown",
      }));

      const [response] = await db.insert(parentAssessmentResponses).values({
        parentId: ctx.user.id,
        childId: input.childId || null,
        responses: enrichedResponses,
        totalScore,
        maxPossibleScore: maxPossible,
        domainScores,
        category,
        completedAt: new Date(),
      }).returning();

      return {
        success: true,
        score: totalScore,
        maxScore: maxPossible,
        percentage: pct,
        category,
        domainScores,
        responseId: response.id,
      };
    }),

  getParentAssessmentResults: protectedProcedure
    .input(z.object({ responseId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let response;
      if (input.responseId) {
        const [r] = await db.select().from(parentAssessmentResponses)
          .where(and(eq(parentAssessmentResponses.id, input.responseId), eq(parentAssessmentResponses.parentId, ctx.user.id)))
          .limit(1);
        response = r;
      } else {
        const [r] = await db.select().from(parentAssessmentResponses)
          .where(eq(parentAssessmentResponses.parentId, ctx.user.id))
          .orderBy(desc(parentAssessmentResponses.createdAt)).limit(1);
        response = r;
      }
      if (!response) return null;
      
      // Check for existing deep report
      const [deepReport] = await db.select().from(parentAssessmentDeepReports)
        .where(eq(parentAssessmentDeepReports.responseId, response.id))
        .orderBy(desc(parentAssessmentDeepReports.createdAt)).limit(1);
      
      return {
        id: response.id,
        totalScore: response.totalScore,
        maxPossibleScore: response.maxPossibleScore,
        percentage: response.maxPossibleScore ? Math.round((response.totalScore || 0) / response.maxPossibleScore * 100) : 0,
        category: response.category,
        domainScores: response.domainScores,
        completedAt: response.completedAt,
        childId: response.childId,
        deepReport: deepReport ? {
          id: deepReport.id,
          status: deepReport.status,
          overallScore: deepReport.overallScore,
          aiSummary: deepReport.aiSummary,
        } : null,
      };
    }),

  getParentAssessmentHistory: protectedProcedure.query(async ({ ctx }) => {
    const responses = await db.select().from(parentAssessmentResponses)
      .where(eq(parentAssessmentResponses.parentId, ctx.user.id))
      .orderBy(desc(parentAssessmentResponses.createdAt));
    return responses.map((r) => ({
      id: r.id,
      totalScore: r.totalScore,
      maxPossibleScore: r.maxPossibleScore,
      percentage: r.maxPossibleScore ? Math.round((r.totalScore || 0) / r.maxPossibleScore * 100) : 0,
      category: r.category,
      completedAt: r.completedAt,
      childId: r.childId,
    }));
  }),

  requestParentDeepReport: protectedProcedure
    .input(z.object({ responseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the response belongs to this parent
      const [response] = await db.select().from(parentAssessmentResponses)
        .where(and(eq(parentAssessmentResponses.id, input.responseId), eq(parentAssessmentResponses.parentId, ctx.user.id)))
        .limit(1);
      if (!response) throw new Error("Assessment response not found");
      
      // Check if deep report already exists
      const [existing] = await db.select().from(parentAssessmentDeepReports)
        .where(eq(parentAssessmentDeepReports.responseId, input.responseId)).limit(1);
      if (existing && existing.status === "completed") {
        return { success: true, deepReportId: existing.id, message: "Deep report already exists" };
      }
      
      // Check parent credits
      const [credits] = await db.select({ total: sql<number>`coalesce(sum(${subscriptionCredits.creditsRemaining}), 0)` })
        .from(subscriptionCredits).where(eq(subscriptionCredits.userId, ctx.user.id));
      
      if ((credits?.total || 0) <= 0) {
        return { success: false, message: "No deep report credits remaining. Please purchase a plan.", paymentUrl: "/pricing" };
      }
      
      // Deduct credit
      await db.update(subscriptionCredits).set({
        creditsRemaining: sql`${subscriptionCredits.creditsRemaining} - 1`,
      }).where(and(
        eq(subscriptionCredits.userId, ctx.user.id),
        sql`${subscriptionCredits.creditsRemaining} > 0`
      ));
      
      // Generate the deep report
      const responseData = response.responses as { questionId: string; optionId: string; score: number; domain: string }[];
      const report = generateParentDeepReport(
        responseData.map((r) => ({
          questionId: r.questionId,
          score: r.score,
          domain: r.domain,
          dimension: "",
        }))
      );
      
      const [deepReport] = await db.insert(parentAssessmentDeepReports).values({
        responseId: input.responseId,
        parentId: ctx.user.id,
        childId: response.childId,
        status: "completed",
        overallScore: String(report.overallScore),
        domainAnalysis: report.domainAnalysis,
        parentingStyle: report.parentingStyle,
        strengths: report.strengths,
        areasForGrowth: report.criticalGaps,
        ageSpecificInsights: report.ageSpecificInsights,
        actionPlan: report.actionPlan,
        resourceRecommendations: report.resourceRecommendations,
        redFlags: report.redFlags,
        aiSummary: report.aiSummary,
        generatedAt: new Date(),
      }).returning();
      
      return { success: true, deepReportId: deepReport.id, message: "Deep report generated successfully" };
    }),

  getParentDeepReport: protectedProcedure
    .input(z.object({ deepReportId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [report] = await db.select().from(parentAssessmentDeepReports)
        .where(and(
          eq(parentAssessmentDeepReports.id, input.deepReportId),
          eq(parentAssessmentDeepReports.parentId, ctx.user.id)
        )).limit(1);
      if (!report) return null;
      
      return {
        id: report.id,
        status: report.status,
        overallScore: report.overallScore,
        domainAnalysis: report.domainAnalysis,
        parentingStyle: report.parentingStyle,
        strengths: report.strengths,
        areasForGrowth: report.areasForGrowth,
        ageSpecificInsights: report.ageSpecificInsights,
        actionPlan: report.actionPlan,
        resourceRecommendations: report.resourceRecommendations,
        redFlags: report.redFlags,
        aiSummary: report.aiSummary,
        generatedAt: report.generatedAt,
      };
    }),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
