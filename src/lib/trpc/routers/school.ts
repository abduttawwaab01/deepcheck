import { z } from "zod";
import { schoolProcedure, router } from "../server";
import { db } from "@/lib/db";
import { schools } from "@/lib/db/schemas/schools";
import { teacherProfiles } from "@/lib/db/schemas/teachers";
import { users, studentProfiles, roles, userRoles } from "@/lib/db/schemas/users";
import { assessmentInstances } from "@/lib/db/schemas/assessments";
import { basicReports, reportRequests } from "@/lib/db/schemas/reports";
import { schoolAssessmentQuestions, schoolAssessmentOptions, schoolAssessmentResponses } from "@/lib/db/schemas/school-assessments";
import { eq, sql, and, desc, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function getSchoolId(userId: string): Promise<string | null> {
  const tp = await db.select({ schoolId: teacherProfiles.schoolId })
    .from(teacherProfiles).where(eq(teacherProfiles.userId, userId)).limit(1);
  return tp[0]?.schoolId || null;
}

export const schoolRouter = router({
  getDashboard: schoolProcedure.query(async ({ ctx }) => {
    const schoolId = await getSchoolId(ctx.user.id);
    if (!schoolId) return null;
    const [school] = await db.select().from(schools).where(eq(schools.id, schoolId)).limit(1);
    if (!school) return null;
    const [studentCnt] = await db.select({ count: sql<number>`count(*)` }).from(studentProfiles)
      .where(sql`${studentProfiles.currentSchoolId} = ${schoolId}::uuid AND ${studentProfiles.enrollmentStatus} = 'active'`);
    const [teacherCnt] = await db.select({ count: sql<number>`count(*)` }).from(teacherProfiles)
      .where(eq(teacherProfiles.schoolId, schoolId));

    const sps = await db.select({ userId: studentProfiles.userId })
      .from(studentProfiles).where(eq(studentProfiles.currentSchoolId, schoolId));
    const studentUserIds = sps.map((s) => s.userId);
    const recentReports = studentUserIds.length > 0
      ? await db.select({
          id: basicReports.id,
          userId: basicReports.userId,
          overallScore: basicReports.overallScore,
          category: basicReports.category,
          createdAt: basicReports.createdAt,
        }).from(basicReports)
          .where(inArray(basicReports.userId, studentUserIds))
          .orderBy(desc(basicReports.createdAt))
          .limit(10)
      : [];

    const userMap: Record<string, string> = {};
    if (recentReports.length > 0) {
      const reportUserIds = [...new Set(recentReports.map((r) => r.userId))];
      const reportUsers = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
        .from(users).where(inArray(users.id, reportUserIds));
      for (const u of reportUsers) userMap[u.id] = `${u.firstName} ${u.lastName}`;
    }

    return {
      id: school.id,
      name: school.name,
      city: school.city,
      studentCount: studentCnt?.count || 0,
      teacherCount: teacherCnt?.count || 0,
      assessmentsTaken: recentReports.length,
      deepReportsGenerated: 0,
      reportCreditsRemaining: school.deepReportCredits || 0,
      recentAssessments: recentReports.map((r) => ({
        student: userMap[r.userId] || "Unknown",
        type: "Diagnostic",
        score: Number(r.overallScore),
        date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
      })),
      teacherStatus: [] as { name: string; subject: string; assessed: boolean; score: number }[],
    };
  }),

  getTeachers: schoolProcedure.query(async ({ ctx }) => {
    const schoolId = await getSchoolId(ctx.user.id);
    if (!schoolId) return [];
    const tps = await db.select({
      id: teacherProfiles.userId,
      subject: teacherProfiles.subject,
      status: teacherProfiles.isActive,
    }).from(teacherProfiles).where(eq(teacherProfiles.schoolId, schoolId));
    const userIds = tps.map((t) => t.id);
    if (userIds.length === 0) return [];
    const userMap: Record<string, { firstName: string; lastName: string; email: string | null }> = {};
    const found = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName, email: users.email })
      .from(users).where(inArray(users.id, userIds));
    for (const u of found) userMap[u.id] = u;

    const { assessmentInstances: ai } = await import("@/lib/db/schemas/assessments");
    const results = [];
    for (const t of tps) {
      const [assessed] = await db.select({ count: sql<number>`count(*)` }).from(ai)
        .where(and(eq(ai.userId, t.id), eq(ai.status, "completed")));
      results.push({
        id: t.id,
        name: userMap[t.id] ? `${userMap[t.id].firstName} ${userMap[t.id].lastName}` : t.id,
        email: userMap[t.id]?.email || "",
        subject: t.subject || "",
        assessed: (assessed?.count || 0) > 0,
        status: t.status ? "active" : "inactive",
      });
    }
    return results;
  }),

  getStudents: schoolProcedure.query(async ({ ctx }) => {
    const schoolId = await getSchoolId(ctx.user.id);
    if (!schoolId) return [];
    const sps = await db.select({
      userId: studentProfiles.userId,
      enrollmentStatus: studentProfiles.enrollmentStatus,
    }).from(studentProfiles).where(eq(studentProfiles.currentSchoolId, schoolId));
    const userIds = sps.map((s) => s.userId);
    if (userIds.length === 0) return [];
    const found = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName, email: users.email, createdAt: users.createdAt })
      .from(users).where(inArray(users.id, userIds));

    const { assessmentInstances: ai } = await import("@/lib/db/schemas/assessments");
    const results = [];
    for (const u of found) {
      const [assessCount] = await db.select({ count: sql<number>`count(*)` }).from(ai).where(eq(ai.userId, u.id));
      results.push({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email || "",
        assessments: assessCount?.count || 0,
        lastActive: u.createdAt?.toISOString?.()?.split("T")[0] || "",
      });
    }
    return results;
  }),

  getReports: schoolProcedure.query(async ({ ctx }) => {
    const schoolId = await getSchoolId(ctx.user.id);
    if (!schoolId) return [];
    const sps = await db.select({ userId: studentProfiles.userId })
      .from(studentProfiles).where(eq(studentProfiles.currentSchoolId, schoolId));
    const userIds = sps.map((s) => s.userId);
    if (userIds.length === 0) return [];
    const userMap: Record<string, string> = {};
    const found = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
      .from(users).where(inArray(users.id, userIds));
    for (const u of found) userMap[u.id] = `${u.firstName} ${u.lastName}`;
    const reports = await db.select({
      id: basicReports.id,
      userId: basicReports.userId,
      overallScore: basicReports.overallScore,
      category: basicReports.category,
      createdAt: basicReports.createdAt,
    }).from(basicReports).where(inArray(basicReports.userId, userIds)).orderBy(desc(basicReports.createdAt)).limit(50);
    return reports.map((r) => ({
      id: r.id,
      student: userMap[r.userId] || r.userId,
      type: "Diagnostic",
      basicScore: Number(r.overallScore),
      hasDeep: false,
      deepStatus: null,
      date: r.createdAt?.toISOString?.()?.split("T")[0] || "",
    }));
  }),

  getStudentsBasicReport: schoolProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ input }) => {
      const [report] = await db.select().from(basicReports)
        .where(eq(basicReports.userId, input.studentId))
        .orderBy(desc(basicReports.createdAt)).limit(1);
      if (!report) return null;
      return {
        score: Number(report.overallScore),
        category: report.category,
        strengths: (report.strengths as string[]) || [],
        weaknesses: (report.weaknesses as string[]) || [],
        topics: (report.topicBreakdown as { name: string; score: number }[]) || [],
      };
    }),

  requestDeepReport: schoolProcedure
    .input(z.object({ targetUserId: z.string(), instanceId: z.string(), assessmentType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.insert(reportRequests).values({
        requesterId: ctx.user.id,
        requesterRole: "school_admin",
        targetUserId: input.targetUserId,
        instanceId: input.instanceId,
        assessmentType: input.assessmentType,
        status: "pending",
      });
      return { success: true, message: "Deep report request submitted", paymentUrl: "" };
    }),

  getSchoolAssessment: schoolProcedure.query(async ({ ctx }) => {
    const rows = await db.select({
      id: schoolAssessmentQuestions.id,
      text: schoolAssessmentQuestions.questionText,
      order: schoolAssessmentQuestions.displayOrder,
    }).from(schoolAssessmentQuestions)
      .where(eq(schoolAssessmentQuestions.isActive, true))
      .orderBy(schoolAssessmentQuestions.displayOrder);
    const qIds = rows.map((r) => r.id);
    const opts = qIds.length > 0 ? await db.select().from(schoolAssessmentOptions)
      .where(inArray(schoolAssessmentOptions.questionId, qIds))
      .orderBy(schoolAssessmentOptions.optionOrder) : [];
    const optsByQ: Record<string, typeof opts> = {};
    for (const o of opts) {
      if (!optsByQ[o.questionId]) optsByQ[o.questionId] = [];
      optsByQ[o.questionId].push(o);
    }
    return rows.map((q) => ({
      id: q.id,
      text: q.text,
      options: (optsByQ[q.id] || []).map((o) => ({ id: o.id, text: o.optionText, order: o.optionOrder })),
    }));
  }),

  submitSchoolAssessment: schoolProcedure
    .input(z.object({
      responses: z.array(z.object({ questionId: z.string(), optionId: z.string() })),
    }))
    .mutation(async ({ ctx, input }) => {
      const schoolId = await getSchoolId(ctx.user.id);
      if (!schoolId) throw new Error("School not found");
      const optIds = input.responses.map((r) => r.optionId);
      const optScores = optIds.length > 0 ? await db.select({ id: schoolAssessmentOptions.id, score: schoolAssessmentOptions.score })
        .from(schoolAssessmentOptions).where(inArray(schoolAssessmentOptions.id, optIds)) : [];
      const scoreMap: Record<string, number> = {};
      for (const o of optScores) scoreMap[o.id] = o.score || 0;
      const totalScore = input.responses.reduce((sum, r) => sum + (scoreMap[r.optionId] || 0), 0);
      await db.insert(schoolAssessmentResponses).values({
        schoolId,
        submittedBy: ctx.user.id,
        responses: input.responses,
        totalScore,
      });
      return { success: true, score: totalScore, maxScore: input.responses.length * 4 };
    }),

  getSettings: schoolProcedure.query(async ({ ctx }) => {
    const schoolId = await getSchoolId(ctx.user.id);
    if (!schoolId) return null;
    const [school] = await db.select().from(schools).where(eq(schools.id, schoolId)).limit(1);
    if (!school) return null;
    return {
      name: school.name,
      city: school.city,
      email: school.email || "",
      phone: school.phone || "",
      address: school.address || "",
      subscriptionStatus: school.subscriptionStatus || "free",
      deepReportCredits: school.deepReportCredits || 0,
      studentCount: school.studentCount || 0,
      teacherCount: school.teacherCount || 0,
    };
  }),

  inviteTeacher: schoolProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string(), subject: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const schoolId = await getSchoolId(ctx.user.id);
      if (!schoolId) return { success: false, message: "School not found" };

      const [existing] = await db.select({ id: users.id }).from(users)
        .where(sql`LOWER(${users.email}) = LOWER(${input.email})`).limit(1);

      if (existing) {
        const [tp] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, existing.id)).limit(1);
        if (tp) {
          return { success: false, message: "This email is already registered as a teacher." };
        }
        const [teacherRole] = await db.select().from(roles).where(eq(roles.name, "teacher")).limit(1);
        if (teacherRole) {
          await db.insert(userRoles).values({ userId: existing.id, roleId: teacherRole.id }).onConflictDoNothing();
        }
        await db.insert(teacherProfiles).values({
          userId: existing.id,
          schoolId,
          subject: input.subject,
          employeeCode: `TCH-${Date.now().toString(36).toUpperCase()}`,
        });
        return { success: true, message: `${input.firstName} ${input.lastName} has been added as a teacher.` };
      }

      const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
      const passwordHash = await bcrypt.hash(tempPassword, 12);
      const [newUser] = await db.insert(users).values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        passwordHash,
        isActive: true,
      }).returning();

      const [teacherRole] = await db.select().from(roles).where(eq(roles.name, "teacher")).limit(1);
      if (teacherRole) {
        await db.insert(userRoles).values({ userId: newUser.id, roleId: teacherRole.id });
      }

      await db.insert(teacherProfiles).values({
        userId: newUser.id,
        schoolId,
        subject: input.subject,
        employeeCode: `TCH-${Date.now().toString(36).toUpperCase()}`,
      });

      return {
        success: true,
        message: `Teacher account created. Temporary password: ${tempPassword}. Share this securely.`,
        tempPassword,
      };
    }),

  registerStudent: schoolProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const schoolId = await getSchoolId(ctx.user.id);
      if (!schoolId) return { success: false, message: "School not found" };

      const [existing] = await db.select({ id: users.id }).from(users)
        .where(sql`LOWER(${users.email}) = LOWER(${input.email})`).limit(1);

      if (existing) {
        const [sp] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, existing.id)).limit(1);
        if (sp) {
          return { success: false, message: "This student is already registered." };
        }
        const [studentRole] = await db.select().from(roles).where(eq(roles.name, "student")).limit(1);
        if (studentRole) {
          await db.insert(userRoles).values({ userId: existing.id, roleId: studentRole.id }).onConflictDoNothing();
        }
        await db.insert(studentProfiles).values({
          userId: existing.id,
          currentSchoolId: schoolId,
          enrollmentStatus: "active",
          studentCode: `STU-${Date.now().toString(36).toUpperCase()}`,
        });
        return { success: true, message: `${input.firstName} ${input.lastName} has been enrolled.` };
      }

      const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
      const passwordHash = await bcrypt.hash(tempPassword, 12);
      const [newUser] = await db.insert(users).values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        passwordHash,
        isActive: true,
      }).returning();

      const [studentRole] = await db.select().from(roles).where(eq(roles.name, "student")).limit(1);
      if (studentRole) {
        await db.insert(userRoles).values({ userId: newUser.id, roleId: studentRole.id });
      }

      await db.insert(studentProfiles).values({
        userId: newUser.id,
        currentSchoolId: schoolId,
        enrollmentStatus: "active",
        studentCode: `STU-${Date.now().toString(36).toUpperCase()}`,
      });

      await db.update(schools).set({
        studentCount: sql`${schools.studentCount} + 1`,
        updatedAt: new Date(),
      }).where(eq(schools.id, schoolId));

      return {
        success: true,
        message: `Student account created. Temporary password: ${tempPassword}.`,
        tempPassword,
      };
    }),

  bulkImportStudents: schoolProcedure
    .input(z.object({
      students: z.array(z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })).min(1).max(200),
    }))
    .mutation(async ({ ctx, input }) => {
      const schoolId = await getSchoolId(ctx.user.id);
      if (!schoolId) return { success: false, message: "School not found", imported: 0, failed: 0 };

      let imported = 0;
      let failed = 0;
      const [studentRole] = await db.select().from(roles).where(eq(roles.name, "student")).limit(1);
      const results: { email: string; status: string; tempPassword?: string }[] = [];

      for (const s of input.students) {
        try {
          const [existing] = await db.select({ id: users.id }).from(users)
            .where(sql`LOWER(${users.email}) = LOWER(${s.email})`).limit(1);

          if (existing) {
            const [sp] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, existing.id)).limit(1);
            if (sp) {
              results.push({ email: s.email, status: "already_registered" });
              failed++;
              continue;
            }
            if (studentRole) {
              await db.insert(userRoles).values({ userId: existing.id, roleId: studentRole.id }).onConflictDoNothing();
            }
            await db.insert(studentProfiles).values({
              userId: existing.id,
              currentSchoolId: schoolId,
              enrollmentStatus: "active",
              studentCode: `STU-${Date.now().toString(36).toUpperCase()}${imported}`,
            });
            results.push({ email: s.email, status: "enrolled_existing" });
            imported++;
          } else {
            const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
            const passwordHash = await bcrypt.hash(tempPassword, 12);
            const [newUser] = await db.insert(users).values({
              email: s.email,
              firstName: s.firstName,
              lastName: s.lastName,
              passwordHash,
              isActive: true,
            }).returning();

            if (studentRole) {
              await db.insert(userRoles).values({ userId: newUser.id, roleId: studentRole.id });
            }
            await db.insert(studentProfiles).values({
              userId: newUser.id,
              currentSchoolId: schoolId,
              enrollmentStatus: "active",
              studentCode: `STU-${Date.now().toString(36).toUpperCase()}${imported}`,
            });
            results.push({ email: s.email, status: "created", tempPassword });
            imported++;
          }
        } catch (e) {
          results.push({ email: s.email, status: "error" });
          failed++;
        }
      }

      if (imported > 0) {
        await db.update(schools).set({
          studentCount: sql`${schools.studentCount} + ${imported}`,
          updatedAt: new Date(),
        }).where(eq(schools.id, schoolId));
      }

      return { success: true, imported, failed, results };
    }),

  getClassroomAnalytics: schoolProcedure.query(async ({ ctx }) => {
    const schoolId = await getSchoolId(ctx.user.id);
    if (!schoolId) return null;

    const sps = await db.select({ userId: studentProfiles.userId })
      .from(studentProfiles).where(eq(studentProfiles.currentSchoolId, schoolId));
    const userIds = sps.map((s) => s.userId);
    if (userIds.length === 0) return { students: 0, avgScore: 0, subjectPerformance: [], topWeaknesses: [], topStrengths: [] };

    const { basicReports: br } = await import("@/lib/db/schemas/reports");
    const reports = userIds.length > 0 ? await db.select().from(br)
      .where(inArray(br.userId, userIds)).orderBy(desc(br.createdAt)) : [];

    const latestPerStudent = new Map<string, typeof reports[0]>();
    for (const r of reports) {
      if (!latestPerStudent.has(r.userId)) latestPerStudent.set(r.userId, r);
    }

    const scores = Array.from(latestPerStudent.values()).map((r) => Number(r.overallScore));
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const allTopicBreakdowns = Array.from(latestPerStudent.values())
      .flatMap((r) => (r.topicBreakdown as { name: string; score: number }[]) || []);

    const topicAggregates = new Map<string, { total: number; count: number }>();
    for (const t of allTopicBreakdowns) {
      const existing = topicAggregates.get(t.name) || { total: 0, count: 0 };
      existing.total += t.score;
      existing.count++;
      topicAggregates.set(t.name, existing);
    }

    const subjectPerformance = Array.from(topicAggregates.entries()).map(([name, agg]) => ({
      name,
      avgScore: Math.round(agg.total / agg.count),
      studentCount: agg.count,
    })).sort((a, b) => a.avgScore - b.avgScore);

    const topWeaknesses = subjectPerformance.filter((s) => s.avgScore < 50).slice(0, 5);
    const topStrengths = subjectPerformance.filter((s) => s.avgScore >= 70).sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);

    const excellent = scores.filter((s) => s >= 80).length;
    const good = scores.filter((s) => s >= 60 && s < 80).length;
    const needsWork = scores.filter((s) => s < 60).length;

    return {
      students: userIds.length,
      avgScore,
      excellent,
      good,
      needsWork,
      subjectPerformance,
      topWeaknesses,
      topStrengths,
      totalAssessments: reports.length,
    };
  }),
});
