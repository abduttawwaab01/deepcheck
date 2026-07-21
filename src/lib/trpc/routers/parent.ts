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

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
