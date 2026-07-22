import { z } from "zod";
import { protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { questionBanks, questionBankConfigs } from "@/lib/db/schemas/question-banks";
import { questions as questionsTable, questionOptions } from "@/lib/db/schemas/questions";
import { assessmentInstances, assessmentResponses, assessmentProctoring } from "@/lib/db/schemas/assessments";
import { basicReports } from "@/lib/db/schemas/reports";
import { masteryScores, abilityEstimates, thetaHistory } from "@/lib/db/schemas/scoring";
import { topics } from "@/lib/db/schemas/content";
import { eq, sql, and, inArray } from "drizzle-orm";
import { estimateTheta, classify, thetaToScaledScore, estimateConceptMasteries } from "@/lib/engine/irt";
import type { ItemParams } from "@/lib/engine/irt";
import { logProctorEvent, getIntegrityReport } from "@/lib/engine/proctoring";
import { processAssessmentCompletion } from "@/lib/engine/gamification";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const assessmentRouter = router({
  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string(), department: z.string().optional() }))
    .query(async ({ input }) => {
      const slugToLevel: Record<string, string> = {
        "primary-to-jss1": "PRI-JSS1",
        "jss3-to-ss1": "JSS3-SS1",
        "ss3-to-university": "SS3-UNI",
        "teacher-quality": "TCH-QUALITY",
      };
      const level = slugToLevel[input.slug];
      if (!level) return null;

      const [bank] = await db.select().from(questionBanks)
        .where(eq(questionBanks.level, level)).limit(1);
      if (!bank) return null;

      const configs = await db.select().from(questionBankConfigs)
        .where(eq(questionBankConfigs.bankId, bank.id))
        .orderBy(questionBankConfigs.displayOrder);

      const whereConditions = [eq(questionsTable.bankId, bank.id), sql`${questionsTable.deletedAt} IS NULL`, eq(questionsTable.isActive, true)];
      if (input.department && input.department !== "general") {
        whereConditions.push(sql`${questionsTable.department} IN (${input.department}, 'general')`);
      }
      const qs = await db.select().from(questionsTable)
        .where(and(...whereConditions));

      const qIds = qs.map((q: any) => q.id);
      const opts = qIds.length > 0 ? await db.select().from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds)) : [];

      const optsByQ: Record<string, typeof opts> = {};
      for (const o of opts) {
        if (!optsByQ[o.questionId]) optsByQ[o.questionId] = [];
        optsByQ[o.questionId].push(o);
      }

      const questions = qs.map((q: any) => {
        const qOpts = optsByQ[q.id] || [];
        const shuffledOpts = shuffleArray(qOpts).map((o: any, i: number) => ({
          id: o.id,
          text: o.optionText,
          label: String.fromCharCode(65 + i),
        }));
        return {
          id: q.id,
          renderer: q.rendererType || "standard",
          questionText: q.questionText,
          passageText: q.passageText,
          chartData: q.chartData,
          geometryData: q.geometryData,
          interactiveData: q.interactiveData,
          options: shuffledOpts,
          concept: q.concept || "",
          topicId: q.topicId || "",
          bloomLevel: q.bloomLevel || "understand",
          difficulty: parseFloat(String(q.difficultyParam || "0")) || 0,
          discrimination: parseFloat(String(q.discriminationParam || "1")) || 1,
          guessing: parseFloat(String(q.guessingParam || "0.25")) || 0.25,
          expectedTimeSecs: q.expectedTimeSecs || 60,
          allowsCalculator: q.allowsCalculator || false,
          explanation: q.explanation || "",
        };
      });

      const targetCount = input.slug === "teacher-quality" ? 6 : 35;
      const picked = shuffleArray(questions).slice(0, Math.min(targetCount, questions.length));

      const sections = configs.length > 0
        ? configs.map((c: any) => ({
            name: c.sectionName,
            count: Math.min(c.questionCount, Math.ceil(picked.length / configs.length)),
            concepts: [] as string[],
          }))
        : [];

      return {
        id: input.slug,
        title: bank.title,
        level: input.slug,
        description: bank.description || "",
        questionCount: picked.length,
        timeLimitMinutes: 45,
        sections,
        questions: picked,
      };
    }),

  startAssessment: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const levelMap: Record<string, string> = {
        "primary-to-jss1": "PRI-JSS1", "jss3-to-ss1": "JSS3-SS1",
        "ss3-to-university": "SS3-UNI", "teacher-quality": "TCH-QUALITY",
      };
      const level = levelMap[input.slug];
      if (!level) return { error: "Invalid assessment type" };

      const [bank] = await db.select().from(questionBanks)
        .where(eq(questionBanks.level, level)).limit(1);
      if (!bank) return { error: "Assessment not found" };

      const { assessmentInstances: aiTable } = await import("@/lib/db/schemas/assessments");
      const [instance] = await db.insert(aiTable).values({
        userId: ctx.user.id,
        status: "in_progress",
        startedAt: new Date(),
      }).returning();

      return { instanceId: instance.id };
    }),

  submitAnswer: protectedProcedure
    .input(z.object({
      instanceId: z.string(),
      questionId: z.string(),
      selectedOptionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [inst] = await db.select().from(assessmentInstances)
        .where(eq(assessmentInstances.id, input.instanceId)).limit(1);
      if (!inst || inst.userId !== ctx.user.id) {
        return { error: "Invalid assessment session" };
      }
      if (input.selectedOptionId) {
        const [existing] = await db.select().from(assessmentResponses)
          .where(and(
            eq(assessmentResponses.instanceId, inst.id),
            eq(assessmentResponses.questionId, input.questionId),
          )).limit(1);
        if (!existing) {
          await db.insert(assessmentResponses).values({
            instanceId: inst.id,
            questionId: input.questionId,
            selectedOptionId: input.selectedOptionId,
            orderIndex: (inst.currentQuestionIndex || 0) + 1,
          });
        }
      }
      return { success: true };
    }),

  completeAssessment: protectedProcedure
    .input(z.object({
      instanceId: z.string(),
      answers: z.record(z.string(), z.string()),
      timeSpentSeconds: z.number().default(0),
      questionTimes: z.record(z.string(), z.number()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const inst = (await db.select().from(assessmentInstances)
        .where(eq(assessmentInstances.id, input.instanceId)).limit(1))[0];
      if (!inst || inst.userId !== ctx.user.id) {
        return { score: 0, category: "critical", correctCount: 0, total: 0, reportId: "", error: "Invalid session" };
      }
      await db.update(assessmentInstances).set({
        status: "completed",
        completedAt: new Date(),
        timeSpentSeconds: input.timeSpentSeconds,
      }).where(eq(assessmentInstances.id, input.instanceId));

      const qIds = Object.keys(input.answers);
      if (qIds.length === 0) {
        return { score: 0, category: "critical", correctCount: 0, total: 0, reportId: "" };
      }

      const dbQuestions = qIds.length > 0 ? await db.select().from(questionsTable)
        .where(inArray(questionsTable.id, qIds)) : [];

      const opts = qIds.length > 0 ? await db.select().from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds)) : [];
      const correctMap: Record<string, string> = {};
      for (const o of opts) {
        if (o.isCorrect) correctMap[o.questionId] = o.id;
      }

      let correctCount = 0;
      let idx = 0;
      for (const [qId, selectedId] of Object.entries(input.answers)) {
        const isCorrect = correctMap[qId] === selectedId;
        if (isCorrect) correctCount++;
        // Delete any prior response from submitAnswer to avoid duplicates
        await db.delete(assessmentResponses).where(and(
          eq(assessmentResponses.instanceId, inst.id),
          eq(assessmentResponses.questionId, qId),
        ));
        await db.insert(assessmentResponses).values({
          instanceId: inst.id,
          questionId: qId,
          selectedOptionId: selectedId,
          isCorrect,
          orderIndex: ++idx,
          timeSpentSeconds: input.questionTimes?.[qId] || 0,
        });
      }

      const itemParams: ItemParams[] = dbQuestions.map((q) => ({
        id: q.id,
        a: parseFloat(String(q.discriminationParam || "1")) || 1,
        b: parseFloat(String(q.difficultyParam || "0")) || 0,
        c: parseFloat(String(q.guessingParam || "0.25")) || 0.25,
        topicId: q.topicId || undefined,
        bloomLevel: q.bloomLevel || undefined,
      }));

      const itemResponses = qIds.map((qId) => {
        const item = itemParams.find((p) => p.id === qId);
        return {
          item: item || { id: qId, a: 1, b: 0, c: 0.25 },
          correct: correctMap[qId] === input.answers[qId],
        };
      });

      const { theta, se } = estimateTheta(itemResponses);
      const overallScore = thetaToScaledScore(theta);
      const category = classify(theta) as "critical" | "weak" | "developing" | "competent" | "strong" | "mastered";

      await db.update(assessmentInstances).set({
        thetaEstimate: String(theta.toFixed(4)),
        thetaSE: String(se.toFixed(4)),
      }).where(eq(assessmentInstances.id, inst.id));

      await db.insert(thetaHistory).values({
        instanceId: inst.id,
        theta: String(theta.toFixed(4)),
        se: String(se.toFixed(4)),
        questionIndex: qIds.length,
      });

      const topicGroups = new Map<string, { correct: number; total: number; name: string }>();
      for (const qId of qIds) {
        const q = dbQuestions.find((dq) => dq.id === qId);
        const topicId = q?.topicId || "general";
        if (!topicGroups.has(topicId)) {
          topicGroups.set(topicId, { correct: 0, total: 0, name: q?.concept || topicId });
        }
        const g = topicGroups.get(topicId)!;
        g.total++;
        if (correctMap[qId] === input.answers[qId]) g.correct++;
      }

      const topicBreakdown = Array.from(topicGroups.entries()).map(([topicId, g]) => ({
        topicId,
        name: g.name,
        score: Math.round((g.correct / g.total) * 100),
        correct: g.correct,
        total: g.total,
        classification: classify((g.correct / g.total) * 6 - 3),
      }));

      const sorted = [...topicBreakdown].sort((a, b) => b.score - a.score);
      const strengths = sorted.filter((t) => t.score >= 70).slice(0, 5).map((t) => t.name);
      const weaknesses = sorted.filter((t) => t.score < 50).slice(0, 5).map((t) => t.name);

      const bloomBreakdown: Record<string, { correct: number; total: number }> = {};
      for (const qId of qIds) {
        const q = dbQuestions.find((dq) => dq.id === qId);
        const bloom = q?.bloomLevel || "understand";
        if (!bloomBreakdown[bloom]) bloomBreakdown[bloom] = { correct: 0, total: 0 };
        bloomBreakdown[bloom].total++;
        if (correctMap[qId] === input.answers[qId]) bloomBreakdown[bloom].correct++;
      }

      const recommendations: { title: string; description: string; priority: string }[] = [];
      for (const w of weaknesses.slice(0, 3)) {
        recommendations.push({
          title: `Improve: ${w}`,
          description: `Focus on strengthening ${w} through targeted practice and review of foundational concepts.`,
          priority: recommendations.length === 0 ? "high" : recommendations.length === 1 ? "medium" : "low",
        });
      }
      if (strengths.length > 0) {
        recommendations.push({
          title: "Maintain your strengths",
          description: `Continue practicing ${strengths[0]} and ${strengths[1] || strengths[0]} to keep proficiency.`,
          priority: "low",
        });
      }

      const [report] = await db.insert(basicReports).values({
        instanceId: inst.id,
        userId: ctx.user.id,
        overallScore: String(overallScore),
        category,
        topicBreakdown,
        strengths,
        weaknesses,
        recommendations,
      }).returning();

      const conceptMastery = estimateConceptMasteries(itemParams, itemResponses.map((r) => ({ itemId: r.item.id, correct: r.correct })));
      for (const cm of conceptMastery) {
        const topicId = cm.topicId;
        if (!topicId || topicId === "general") continue;
        const [existing] = await db.select().from(masteryScores)
          .where(and(eq(masteryScores.userId, ctx.user.id), eq(masteryScores.topicId, topicId))).limit(1);
        const thetaBefore = existing ? parseFloat(String(existing.abilityEstimate)) : 0;
        const responsesBefore = existing?.responsesCount || 0;
        if (existing) {
          const newCount = (existing.responsesCount || 0) + cm.responses;
          const oldTheta = parseFloat(String(existing.abilityEstimate)) || 0;
          const oldCount = existing.responsesCount || 0;
          const weightedTheta = oldCount > 0
            ? (oldTheta * oldCount + cm.theta * cm.responses) / newCount
            : cm.theta;
          await db.update(masteryScores).set({
            abilityEstimate: String(weightedTheta.toFixed(4)),
            abilitySE: String(cm.se.toFixed(4)),
            responsesCount: newCount,
            lastUpdated: new Date(),
          }).where(eq(masteryScores.id, existing.id));
        } else {
          await db.insert(masteryScores).values({
            userId: ctx.user.id,
            topicId,
            abilityEstimate: String(cm.theta.toFixed(4)),
            abilitySE: String(cm.se.toFixed(4)),
            responsesCount: cm.responses,
          });
        }

        // ── Mastery Progression Tracking ──────────────────────────────
        try {
          const { masteryProgression: mpTable } = await import("@/lib/db/schemas/scoring");
          await db.insert(mpTable).values({
            userId: ctx.user.id,
            topicId,
            instanceId: inst.id,
            thetaBefore: String(thetaBefore.toFixed(4)),
            thetaAfter: String(cm.theta.toFixed(4)),
            deltaTheta: String((cm.theta - thetaBefore).toFixed(4)),
            responsesCount: cm.responses,
            retentionEstimate: String(Math.min(1, Math.max(0, (cm.theta + 3) / 6)).toFixed(3)),
          });
        } catch (e) {
          console.error("Mastery progression write error:", e);
        }

        // ── Forgetting Curve Update ──────────────────────────────────
        try {
          const { forgettingCurves: fcTable } = await import("@/lib/db/schemas/scoring");
          const [existingFC] = await db.select().from(fcTable)
            .where(and(eq(fcTable.userId, ctx.user.id), eq(fcTable.topicId, topicId))).limit(1);
          const retention = Math.min(1, Math.max(0, (cm.theta + 3) / 6));
          const now = new Date();
          if (existingFC) {
            const daysSinceLast = existingFC.lastCalculated
              ? (now.getTime() - new Date(existingFC.lastCalculated).getTime()) / (1000 * 60 * 60 * 24)
              : 1;
            const newStability = Math.max(0.5, parseFloat(String(existingFC.stabilityParameter || "1")) * (retention > 0.7 ? 1.2 : 0.9));
            const nextReviewDays = Math.round(newStability * parseFloat(String(existingFC.easeFactor || "2.5")) * Math.log(2));
            await db.update(fcTable).set({
              currentRetention: String(retention.toFixed(3)),
              stabilityParameter: String(newStability.toFixed(3)),
              reviewCount: (existingFC.reviewCount || 0) + 1,
              nextReviewDate: new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000),
              lastCalculated: now,
              updatedAt: now,
            }).where(eq(fcTable.id, existingFC.id));
          } else {
            const stability = Math.max(0.5, retention * 10 + 2);
            const easeFactor = 2.5;
            const nextReviewDays = Math.round(stability * easeFactor * Math.log(2));
            await db.insert(fcTable).values({
              userId: ctx.user.id,
              topicId,
              masteryAtAcquisition: String(retention.toFixed(3)),
              acquisitionDate: now,
              stabilityParameter: String(stability.toFixed(3)),
              decayRate: "0.5",
              nextReviewDate: new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000),
              reviewCount: 1,
              easeFactor: String(easeFactor),
              intervalDays: String(nextReviewDays),
              currentRetention: String(retention.toFixed(3)),
            });
          }
        } catch (e) {
          console.error("Forgetting curve write error:", e);
        }
      }

      const total = Object.keys(input.answers).length;

      let gamification = null;
      try {
        gamification = await processAssessmentCompletion(ctx.user.id, overallScore);
      } catch (e) {
        console.error("Gamification error:", e);
      }

      try {
        const { sendEmail, assessmentCompleteEmail } = await import("@/lib/notifications/email");
        const emailContent = assessmentCompleteEmail(ctx.user.name, overallScore, category);
        await sendEmail({ to: ctx.user.email, subject: emailContent.subject, html: emailContent.html });
      } catch (e) {
        console.error("Assessment email error:", e);
      }

      return {
        score: overallScore,
        category,
        correctCount,
        total,
        reportId: report.id,
        theta: theta.toFixed(4),
        se: se.toFixed(4),
        topicBreakdown,
        strengths,
        weaknesses,
        gamification,
      };
    }),

  getPracticeQuestions: protectedProcedure
    .input(z.object({ slug: z.string(), conceptFilter: z.string().optional() }))
    .query(async ({ input }) => {
      const slugToLevel: Record<string, string> = {
        "primary-to-jss1": "PRI-JSS1",
        "jss3-to-ss1": "JSS3-SS1",
        "ss3-to-university": "SS3-UNI",
      };
      const level = slugToLevel[input.slug];
      if (!level) return null;

      const [bank] = await db.select().from(questionBanks)
        .where(eq(questionBanks.level, level)).limit(1);
      if (!bank) return null;

      let qs = await db.select().from(questionsTable)
        .where(and(eq(questionsTable.bankId, bank.id), sql`${questionsTable.deletedAt} IS NULL`, eq(questionsTable.isActive, true)));

      if (input.conceptFilter) {
        qs = qs.filter((q) => q.concept?.toLowerCase().includes(input.conceptFilter!.toLowerCase()));
      }

      const qIds = qs.map((q) => q.id);
      const opts = qIds.length > 0 ? await db.select().from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds)) : [];

      const optsByQ: Record<string, typeof opts> = {};
      for (const o of opts) {
        if (!optsByQ[o.questionId]) optsByQ[o.questionId] = [];
        optsByQ[o.questionId].push(o);
      }

      const questions = shuffleArray(qs).slice(0, 10).map((q) => {
        const qOpts = optsByQ[q.id] || [];
        return {
          id: q.id,
          questionText: q.questionText,
          renderer: q.rendererType || "standard",
          passageText: q.passageText,
          chartData: q.chartData,
          geometryData: q.geometryData,
          options: qOpts.map((o) => ({ id: o.id, text: o.optionText, isCorrect: o.isCorrect })),
          explanation: q.explanation || "No explanation available.",
          concept: q.concept || "",
          difficulty: q.difficultyLevel || "medium",
          bloomLevel: q.bloomLevel || "understand",
        };
      });

      return { questions, total: questions.length };
    }),

  logProctorEvent: protectedProcedure
    .input(z.object({
      instanceId: z.string(),
      eventType: z.enum(["tab_switch", "copy", "paste", "idle", "face_detected", "multiple_faces", "phone_detected", "audio_anomaly"]),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      await logProctorEvent({
        instanceId: input.instanceId,
        eventType: input.eventType,
        metadata: input.metadata,
      });
      return { success: true };
    }),

  getProctoringReport: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .query(async ({ input }) => {
      return getIntegrityReport(input.instanceId);
    }),

  getItemAnalysis: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .query(async ({ input }) => {
      const { analyzeItems } = await import("@/lib/engine/item-analysis");
      const { assessmentResponses: respTable } = await import("@/lib/db/schemas/assessments");

      const responses = await db.select().from(respTable)
        .where(eq(respTable.instanceId, input.instanceId));

      if (responses.length === 0) return { items: [], summary: null };

      const records = responses.map((r) => ({
        questionId: r.questionId,
        selectedOptionId: r.selectedOptionId || "",
        isCorrect: r.isCorrect || false,
        timeSpentSeconds: r.timeSpentSeconds || 0,
      }));

      return analyzeItems(records, responses.length);
    }),

  getCDMDiagnosis: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .query(async ({ input }) => {
      const { estimateDINA } = await import("@/lib/engine/cdm");
      const { assessmentResponses: respTable } = await import("@/lib/db/schemas/assessments");
      const { cognitiveAttributes: caTable, itemAttributeMatrix: iamTable } = await import("@/lib/db/schemas/content");

      const responses = await db.select().from(respTable)
        .where(eq(respTable.instanceId, input.instanceId));
      if (responses.length === 0) return null;

      const qIds = responses.map((r) => r.questionId);
      const dbQs = qIds.length > 0 ? await db.select().from(questionsTable)
        .where(inArray(questionsTable.id, qIds)) : [];
      const dbOpts = qIds.length > 0 ? await db.select().from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds)) : [];

      const correctMap: Record<string, string> = {};
      for (const o of dbOpts) { if (o.isCorrect) correctMap[o.questionId] = o.id; }

      const itemParams = dbQs.map((q) => ({
        id: q.id, a: parseFloat(String(q.discriminationParam || "1")) || 1,
        b: parseFloat(String(q.difficultyParam || "0")) || 0,
        c: parseFloat(String(q.guessingParam || "0.25")) || 0.25,
        topicId: q.topicId || undefined, bloomLevel: q.bloomLevel || undefined,
      }));

      const itemResponses = responses.map((r) => ({
        itemId: r.questionId,
        correct: r.isCorrect || correctMap[r.questionId] === r.selectedOptionId,
      }));

      const attributes = await db.select().from(caTable).where(eq(caTable.isActive, true));
      const qMatrixEntries = await db.select().from(iamTable)
        .where(inArray(iamTable.questionId, qIds));

      if (qMatrixEntries.length === 0 || attributes.length === 0) return null;

      const { buildQMatrix } = await import("@/lib/engine/cdm");
      const qMatrix = buildQMatrix(
        qMatrixEntries.map((e) => ({ questionId: e.questionId, attributeId: e.attributeId, weight: parseFloat(String(e.weight || "1")), isRequired: e.isRequired ?? true })),
        new Map(attributes.map((a) => [a.id, { id: a.id, code: a.code, name: a.name, category: a.category || "", parentAttributeId: a.parentAttributeId || undefined, hierarchyLevel: a.hierarchyLevel || 0 }])),
      );

      return estimateDINA(itemParams, itemResponses, qMatrix, attributes.map((a) => ({
        id: a.id, code: a.code, name: a.name, category: a.category || "",
        parentAttributeId: a.parentAttributeId || undefined, hierarchyLevel: a.hierarchyLevel || 0,
      })));
    }),
});
