import { z } from "zod";
import { teacherProcedure as protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { teacherProfiles } from "@/lib/db/schemas/teachers";
import { studentProfiles } from "@/lib/db/schemas/users";
import { questions, questionOptions } from "@/lib/db/schemas/questions";
import { assessmentConfigs, assessmentInstances, assessmentResponses } from "@/lib/db/schemas/assessments";
import { basicReports } from "@/lib/db/schemas/reports";
import { masteryScores, forgettingCurves, masteryProgression, thetaHistory } from "@/lib/db/schemas/scoring";
import { userStreaks } from "@/lib/db/schemas/gamification";
import { topics } from "@/lib/db/schemas/content";
import { eq, sql, desc, and, inArray, isNull } from "drizzle-orm";
import { classify, thetaToScaledScore, estimateTheta } from "@/lib/engine/irt";
import type { ItemParams } from "@/lib/engine/irt";
import { computeEarlyWarning, extractStudentInput, computeBatchWarnings, computeClassRiskSummary } from "@/lib/engine/early-warning";
import { computeClassInsights, computeStudentDetail, type StudentRecord } from "@/lib/engine/class-insights";

export const teacherRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    const [tp] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, ctx.user.id)).limit(1);

    const allReports = await db.select().from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id)).orderBy(desc(basicReports.createdAt)).limit(20);

    const latestReport = allReports[0] || null;
    const prevReport = allReports[1] || null;

    const topicBreakdown = latestReport?.topicBreakdown as { name: string; score: number }[] | null;
    const strengths = topicBreakdown?.filter((t) => t.score >= 70).map((t) => t.name) || [];
    const improvements = topicBreakdown?.filter((t) => t.score < 50).map((t) => t.name) || [];

    const history = allReports.reverse().map((r) => ({
      date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
      score: Number(r.overallScore),
    }));

    const [school] = tp?.schoolId
      ? await db.select().from((await import("@/lib/db/schemas/schools")).schools)
          .where(eq((await import("@/lib/db/schemas/schools")).schools.id, tp.schoolId)).limit(1)
      : [null];

    return {
      name: user ? `${user.firstName} ${user.lastName}` : "",
      subject: tp?.subject || "",
      school: school?.name || "",
      assessed: !!latestReport,
      lastScore: latestReport ? Number(latestReport.overallScore) : 0,
      category: latestReport?.category || "pending",
      assessmentHistory: history,
      strengths,
      improvements,
      pendingAssessments: 0,
    };
  }),

  getAssessment: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const [config] = await db.select().from(assessmentConfigs).where(eq(assessmentConfigs.id, input.assessmentId)).limit(1);
      if (!config) return null;
      const qs = await db.select().from(questions)
        .where(and(eq(questions.assessmentType, config.assessmentType), sql`${questions.deletedAt} IS NULL`))
        .limit(config.questionCount || 10);
      const qIds = qs.map((q) => q.id);
      const opts = qIds.length > 0 ? await db.select().from(questionOptions)
        .where(inArray(questionOptions.questionId, qIds)) : [];
      const optsByQ: Record<string, typeof opts> = {};
      for (const o of opts) {
        if (!optsByQ[o.questionId]) optsByQ[o.questionId] = [];
        optsByQ[o.questionId].push(o);
      }
      const items = qs.map((q) => ({
        id: q.id,
        text: q.questionText,
        questionType: q.questionType,
        options: (optsByQ[q.id] || []).map((o) => ({ id: o.id, text: o.optionText, order: o.optionOrder })),
      }));
      return {
        id: config.id,
        title: config.title,
        type: config.assessmentType,
        totalItems: items.length,
        timeLimitMinutes: config.timeLimitMinutes || 30,
        currentItem: items[0] || { id: "", text: "", questionType: "multiple_choice", options: [] },
        items,
      };
    }),

  submitAnswer: protectedProcedure
    .input(z.object({ instanceId: z.string(), itemId: z.string(), selectedOptions: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      let [inst] = await db.select().from(assessmentInstances).where(eq(assessmentInstances.id, input.instanceId)).limit(1);
      if (!inst) {
        [inst] = await db.insert(assessmentInstances).values({
          configId: input.instanceId,
          userId: ctx.user.id,
          status: "in_progress",
        }).returning();
      }
      for (const optId of input.selectedOptions) {
        await db.insert(assessmentResponses).values({
          instanceId: inst.id,
          questionId: input.itemId,
          selectedOptionId: optId,
          orderIndex: (inst.currentQuestionIndex || 0) + 1,
        }).onConflictDoNothing({ target: [assessmentResponses.id] });
      }
      const [respCount] = await db.select({ count: sql<number>`count(*)` }).from(assessmentResponses)
        .where(eq(assessmentResponses.instanceId, inst.id));
      return { type: "next", itemsCompleted: respCount?.count || 0, totalItems: 0, timeRemainingSeconds: 0 };
    }),

  completeAssessment: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.update(assessmentInstances).set({ status: "completed", completedAt: new Date() })
        .where(eq(assessmentInstances.id, input.instanceId));

      const responses = await db.select().from(assessmentResponses)
        .where(eq(assessmentResponses.instanceId, input.instanceId));
      const qIds = responses.map((r) => r.questionId);
      const dbQs = qIds.length > 0 ? await db.select().from(questions).where(inArray(questions.id, qIds)) : [];
      const opts = qIds.length > 0 ? await db.select().from(questionOptions).where(inArray(questionOptions.questionId, qIds)) : [];

      const correctMap: Record<string, string> = {};
      for (const o of opts) { if (o.isCorrect) correctMap[o.questionId] = o.id; }

      let correctCount = 0;
      const itemParams: ItemParams[] = [];
      const itemResponses: { item: ItemParams; correct: boolean }[] = [];

      for (const r of responses) {
        const q = dbQs.find((dq) => dq.id === r.questionId);
        const isCorrect = correctMap[r.questionId] === r.selectedOptionId;
        if (isCorrect) correctCount++;

        const param: ItemParams = {
          id: r.questionId,
          a: q ? parseFloat(String(q.discriminationParam || "1")) || 1 : 1,
          b: q ? parseFloat(String(q.difficultyParam || "0")) || 0 : 0,
          c: q ? parseFloat(String(q.guessingParam || "0.25")) || 0.25 : 0.25,
        };
        itemParams.push(param);
        itemResponses.push({ item: param, correct: isCorrect });

        await db.update(assessmentResponses).set({ isCorrect }).where(eq(assessmentResponses.id, r.id));
      }

      const { theta } = estimateTheta(itemResponses);
      const score = thetaToScaledScore(theta);
      const category = classify(theta);

      await db.update(assessmentInstances).set({
        thetaEstimate: String(theta.toFixed(4)),
      }).where(eq(assessmentInstances.id, input.instanceId));

      const [existingReport] = await db.select().from(basicReports)
        .where(eq(basicReports.instanceId, input.instanceId)).limit(1);

      let reportId = existingReport?.id;
      if (!existingReport) {
        const [report] = await db.insert(basicReports).values({
          instanceId: input.instanceId,
          userId: ctx.user.id,
          overallScore: String(score),
          category: category as any,
          topicBreakdown: [],
          strengths: [],
          weaknesses: [],
          recommendations: [],
        }).returning();
        reportId = report.id;
      }

      const [inst] = await db.select().from(assessmentInstances).where(eq(assessmentInstances.id, input.instanceId)).limit(1);
      return {
        score,
        category,
        itemsCompleted: inst?.currentQuestionIndex || 0,
        redirectUrl: reportId ? `/teacher/reports/basic/${reportId}` : "/teacher",
      };
    }),

  getReports: protectedProcedure.query(async ({ ctx }) => {
    const reports = await db.select().from(basicReports)
      .where(eq(basicReports.userId, ctx.user.id)).orderBy(desc(basicReports.createdAt));
    return reports.map((r) => ({
      id: r.id,
      type: "Teacher Quality",
      score: Number(r.overallScore),
      category: r.category,
      date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
      hasDeep: r.isDeepReportAvailable || false,
    }));
  }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    const [tp] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, ctx.user.id)).limit(1);
    let schoolName = "";
    if (tp?.schoolId) {
      const { schools } = await import("@/lib/db/schemas/schools");
      const [school] = await db.select().from(schools).where(eq(schools.id, tp.schoolId)).limit(1);
      schoolName = school?.name || "";
    }
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      subject: tp?.subject || "",
      schoolName,
    };
  }),

  getInstances: protectedProcedure.query(async ({ ctx }) => {
    const instances = await db.select({
      id: assessmentInstances.id,
      assessmentType: assessmentConfigs.assessmentType,
      startedAt: assessmentInstances.startedAt,
      completedAt: assessmentInstances.completedAt,
      thetaEstimate: assessmentInstances.thetaEstimate,
      status: assessmentInstances.status,
    }).from(assessmentInstances)
      .leftJoin(assessmentConfigs, eq(assessmentInstances.configId, assessmentConfigs.id))
      .where(eq(assessmentInstances.userId, ctx.user.id))
      .orderBy(desc(assessmentInstances.startedAt))
      .limit(50);
    return instances;
  }),

  getAtRiskCount: protectedProcedure.query(async ({ ctx }) => {
    const [tp] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, ctx.user.id)).limit(1);
    if (!tp?.schoolId) return 0;

    const students = await db.select({ userId: studentProfiles.userId })
      .from(studentProfiles)
      .where(eq(studentProfiles.currentSchoolId, tp.schoolId));
    const studentIds = students.map((s) => s.userId);
    if (studentIds.length === 0) return 0;

    // Quick heuristic: count students whose latest report is critical or weak
    const reports = await db.select({ userId: basicReports.userId, category: basicReports.category })
      .from(basicReports)
      .where(inArray(basicReports.userId, studentIds))
      .orderBy(desc(basicReports.createdAt));

    const latestByStudent: Record<string, string> = {};
    for (const r of reports) {
      if (!latestByStudent[r.userId]) latestByStudent[r.userId] = r.category || "";
    }

    return Object.values(latestByStudent).filter((c) => c === "critical" || c === "weak").length;
  }),

  getSchoolStudents: protectedProcedure.query(async ({ ctx }) => {
    const [tp] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, ctx.user.id)).limit(1);
    if (!tp?.schoolId) return [];

    const students = await db.select({
      userId: studentProfiles.userId,
      studentCode: studentProfiles.studentCode,
      currentSchoolId: studentProfiles.currentSchoolId,
      enrollmentStatus: studentProfiles.enrollmentStatus,
      firstName: users.firstName,
      lastName: users.lastName,
    }).from(studentProfiles)
      .innerJoin(users, eq(studentProfiles.userId, users.id))
      .where(eq(studentProfiles.currentSchoolId, tp.schoolId));

    return students.map((s) => ({
      studentId: s.userId,
      name: `${s.firstName} ${s.lastName}`,
      studentCode: s.studentCode || "",
      enrollmentStatus: s.enrollmentStatus || "active",
    }));
  }),

  getSchoolInsights: protectedProcedure.query(async ({ ctx }) => {
    const [tp] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, ctx.user.id)).limit(1);
    if (!tp?.schoolId) return null;

    const [{ schoolName }] = await db.select({ schoolName: sql<string>`COALESCE((SELECT name FROM schools WHERE id = ${tp.schoolId}), '')` }).from(users).limit(1);

    // Get all students at this school
    const students = await db.select({
      userId: studentProfiles.userId,
      firstName: users.firstName,
      lastName: users.lastName,
    }).from(studentProfiles)
      .innerJoin(users, eq(studentProfiles.userId, users.id))
      .where(eq(studentProfiles.currentSchoolId, tp.schoolId));

    const studentIds = students.map((s) => s.userId);
    if (studentIds.length === 0) {
      return {
        schoolId: tp.schoolId,
        schoolName,
        totalStudents: 0,
        studentsWithAssessments: 0,
        avgScore: 0,
        medianScore: 0,
        scoreStdDev: 0,
        riskDistribution: { critical: 0, high: 0, moderate: 0, low: 0, none: 0 },
        atRiskCount: 0,
        cohorts: [],
        topicDifficulty: [],
        conceptHeatmap: [],
        performanceTrend: [],
        engagementSummary: { activeThisWeek: 0, activeThisMonth: 0, inactiveOver30Days: 0, avgStreak: 0 },
        topPerformers: [],
        needsAttention: [],
      };
    }

    // Batch fetch all data
    const [allReports, allInstances, allMastery, allStreaks, allForgettingCurves] = await Promise.all([
      db.select().from(basicReports).where(inArray(basicReports.userId, studentIds)).orderBy(desc(basicReports.createdAt)),
      db.select().from(assessmentInstances).where(inArray(assessmentInstances.userId, studentIds)).orderBy(desc(assessmentInstances.startedAt)),
      db.select().from(masteryScores).where(inArray(masteryScores.userId, studentIds)),
      db.select().from(userStreaks).where(inArray(userStreaks.userId, studentIds)),
      db.select().from(forgettingCurves).where(inArray(forgettingCurves.userId, studentIds)),
    ]);

    // Fetch topic names for mastery scores
    const topicIds = [...new Set(allMastery.map((m) => m.topicId))];
    const topicNames = topicIds.length > 0
      ? await db.select().from(topics).where(inArray(topics.id, topicIds))
      : [];
    const topicNameMap: Record<string, string> = {};
    for (const t of topicNames) topicNameMap[t.id] = t.name;

    // Build per-student data
    const studentRecords: StudentRecord[] = students.map((s) => {
      const studentReports = allReports.filter((r) => r.userId === s.userId);
      const studentInstances = allInstances.filter((i) => i.userId === s.userId);
      const studentMastery = allMastery.filter((m) => m.userId === s.userId);
      const studentStreak = allStreaks.find((st) => st.userId === s.userId);
      const studentCurves = allForgettingCurves.filter((fc) => fc.userId === s.userId);

      const latestReport = studentReports[0];
      const topicScores = studentMastery.map((m) => ({
        topicName: topicNameMap[m.topicId] || "Unknown Topic",
        score: (Number(m.abilityEstimate) + 2) / 4 * 100, // Normalize theta to 0-100
      }));

      return {
        studentId: s.userId,
        studentName: `${s.firstName} ${s.lastName}`,
        latestScore: latestReport ? Number(latestReport.overallScore) : null,
        assessmentCount: studentReports.length,
        category: latestReport?.category || null,
        theta: studentInstances.length > 0 ? Number(studentInstances[0].thetaEstimate) : null,
        topicScores,
        retentionAvg: studentCurves.length > 0
          ? studentCurves.reduce((sum, fc) => sum + Number(fc.currentRetention), 0) / studentCurves.length
          : null,
        streak: studentStreak?.currentStreak || 0,
        lastActive: studentStreak?.lastActivityDate || null,
      };
    });

    // Compute warnings
    const warningInputs = students.map((s) => {
      const studentReports = allReports.filter((r) => r.userId === s.userId);
      const studentInstances = allInstances.filter((i) => i.userId === s.userId);
      const studentMastery = allMastery.filter((m) => m.userId === s.userId);
      const studentStreak = allStreaks.find((st) => st.userId === s.userId);
      const studentCurves = allForgettingCurves.filter((fc) => fc.userId === s.userId);

      return extractStudentInput({
        studentId: s.userId,
        studentName: `${s.firstName} ${s.lastName}`,
        reports: studentReports.map((r) => ({
          overallScore: r.overallScore,
          category: r.category,
          createdAt: r.createdAt,
        })),
        instances: studentInstances.map((i) => ({
          thetaEstimate: i.thetaEstimate,
          startedAt: i.startedAt,
        })),
        forgettingCurves: studentCurves.map((fc) => ({
          currentRetention: fc.currentRetention,
          topicId: fc.topicId,
        })),
        streak: studentStreak ? {
          currentStreak: studentStreak.currentStreak || 0,
          longestStreak: studentStreak.longestStreak || 0,
          lastActivityDate: studentStreak.lastActivityDate,
          totalXp: studentStreak.totalXp || 0,
        } : null,
        masteryScores: studentMastery.map((m) => ({
          abilityEstimate: m.abilityEstimate,
          topicId: m.topicId,
        })),
      });
    });

    const warnings = computeBatchWarnings(warningInputs);

    return computeClassInsights({
      schoolId: tp.schoolId,
      schoolName,
      students: studentRecords,
      warnings,
    });
  }),

  getStudentEarlyWarning: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input }) => {
      const [student] = await db.select().from(users).where(eq(users.id, input.studentId)).limit(1);
      if (!student) return null;

      const [reports, instances, mastery, streak, curves, progression, thetaHist] = await Promise.all([
        db.select().from(basicReports).where(eq(basicReports.userId, input.studentId)).orderBy(desc(basicReports.createdAt)),
        db.select().from(assessmentInstances).where(eq(assessmentInstances.userId, input.studentId)).orderBy(desc(assessmentInstances.startedAt)),
        db.select().from(masteryScores).where(eq(masteryScores.userId, input.studentId)),
        db.select().from(userStreaks).where(eq(userStreaks.userId, input.studentId)).limit(1),
        db.select().from(forgettingCurves).where(eq(forgettingCurves.userId, input.studentId)),
        db.select().from(masteryProgression).where(eq(masteryProgression.userId, input.studentId)).orderBy(desc(masteryProgression.recordedAt)),
        db.select().from(thetaHistory).innerJoin(assessmentInstances, eq(thetaHistory.instanceId, assessmentInstances.id))
          .where(eq(assessmentInstances.userId, input.studentId)).orderBy(desc(thetaHistory.recordedAt)),
      ]);

      const topicIds = [...new Set(mastery.map((m) => m.topicId))];
      const topicNames = topicIds.length > 0
        ? await db.select().from(topics).where(inArray(topics.id, topicIds))
        : [];
      const topicNameMap: Record<string, string> = {};
      for (const t of topicNames) topicNameMap[t.id] = t.name;

      const warningInput = extractStudentInput({
        studentId: input.studentId,
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
        studentId: input.studentId,
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

      const detail = computeStudentDetail({
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

      return detail;
    }),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
