import { z } from "zod";
import { adminProcedure, router } from "../server";
import { db } from "@/lib/db";
import { questionBanks, questionBankConfigs } from "@/lib/db/schemas/question-banks";
import { questions, questionOptions, users, userRoles } from "@/lib/db/schemas";
import { eq, sql, like, and, desc } from "drizzle-orm";

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async () => {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.deletedAt} IS NULL`);
    const [questionCount] = await db.select({ count: sql<number>`count(*)` }).from(questions).where(sql`${questions.deletedAt} IS NULL`);
    const [bankCount] = await db.select({ count: sql<number>`count(*)` }).from(questionBanks);
    const [configCount] = await db.select({ count: sql<number>`count(*)` }).from(questionBankConfigs);
    return {
      totalUsers: userCount?.count || 0,
      totalSchools: 134,
      totalAssessments: 15039,
      revenueMTD: "₦1,420,000",
      pendingReports: 8,
      questionCount: questionCount?.count || 0,
      bankCount: bankCount?.count || 0,
      sectionCount: configCount?.count || 0,
      userGrowth: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 50),
    };
  }),

  // ─── BANKS ──────────────────────────────────────────────────────────
  getQuestionBanks: adminProcedure.query(async () => {
    return db.select().from(questionBanks).where(eq(questionBanks.isActive, true)).orderBy(questionBanks.displayOrder);
  }),

  getBankConfigs: adminProcedure.input(z.object({ bankId: z.string() })).query(async ({ input }) => {
    return db.select().from(questionBankConfigs).where(eq(questionBankConfigs.bankId, input.bankId)).orderBy(questionBankConfigs.displayOrder);
  }),

  updateBankConfig: adminProcedure
    .input(z.object({
      configId: z.string(),
      questionCount: z.number().min(1).max(200),
      timeLimitMinutes: z.number().min(1).max(180),
    }))
    .mutation(async ({ input }) => {
      await db.update(questionBankConfigs)
        .set({ questionCount: input.questionCount, timeLimitMinutes: input.timeLimitMinutes, updatedAt: new Date() })
        .where(eq(questionBankConfigs.id, input.configId));
      return { success: true };
    }),

  // ─── QUESTIONS ──────────────────────────────────────────────────────
  getQuestionsByBank: adminProcedure
    .input(z.object({ bankId: z.string(), search: z.string().optional(), difficulty: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(25) }))
    .query(async ({ input }) => {
      const conditions = [sql`${questions.deletedAt} IS NULL`, eq(questions.bankId, input.bankId)];
      if (input.search) conditions.push(like(questions.questionText, `%${input.search}%`));
      if (input.difficulty && input.difficulty !== "all") conditions.push(eq(questions.difficultyLevel, input.difficulty));
      const offset = (input.page - 1) * input.pageSize;
      const [items, totalResult] = await Promise.all([
        db.select().from(questions).where(and(...conditions)).orderBy(questions.code).limit(input.pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(questions).where(and(...conditions)),
      ]);
      const qIds = items.map((q) => q.id);
      const opts = qIds.length > 0 ? await db.select().from(questionOptions).where(sql`${questionOptions.questionId} IN (${qIds.join(",")})`) : [];
      const optsByQ: Record<string, typeof opts> = {};
      for (const o of opts) {
        if (!optsByQ[o.questionId]) optsByQ[o.questionId] = [];
        optsByQ[o.questionId].push(o);
      }
      return {
        items: items.map((q) => ({ ...q, options: optsByQ[q.id] || [] })),
        total: totalResult[0]?.count || 0,
        page: input.page,
        pageSize: input.pageSize,
      };
    }),

  createQuestion: adminProcedure
    .input(z.object({
      bankId: z.string(),
      questionText: z.string().min(1),
      rendererType: z.enum(["standard", "passage", "chart", "geometry", "interactive"]).default("standard"),
      concept: z.string().default(""),
      difficultyLevel: z.enum(["easy", "medium", "hard"]).default("medium"),
      bloomLevel: z.enum(["remember", "understand", "apply", "analyze", "evaluate"]).default("understand"),
      expectedTimeSecs: z.number().default(60),
      allowsCalculator: z.boolean().default(false),
      passageText: z.string().optional(),
      chartData: z.any().optional(),
      geometryData: z.any().optional(),
      interactiveData: z.any().optional(),
      explanation: z.string().default(""),
      options: z.array(z.object({ optionText: z.string().min(1), isCorrect: z.boolean(), optionOrder: z.number() })).min(2).max(6),
    }))
    .mutation(async ({ input }) => {
      const { options: opts, ...rest } = input;
      const [q] = await db.insert(questions).values({ ...rest, assessmentType: "academic", status: "approved" }).returning();
      await db.insert(questionOptions).values(
        opts.map((o) => ({ questionId: q.id, optionText: o.optionText, isCorrect: o.isCorrect, optionOrder: o.optionOrder })),
      );
      return q;
    }),

  updateQuestion: adminProcedure
    .input(z.object({
      id: z.string(),
      questionText: z.string().optional(),
      rendererType: z.enum(["standard", "passage", "chart", "geometry", "interactive"]).optional(),
      concept: z.string().optional(),
      difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
      bloomLevel: z.enum(["remember", "understand", "apply", "analyze", "evaluate"]).optional(),
      expectedTimeSecs: z.number().optional(),
      allowsCalculator: z.boolean().optional(),
      passageText: z.string().optional().nullable(),
      chartData: z.any().optional().nullable(),
      geometryData: z.any().optional().nullable(),
      interactiveData: z.any().optional().nullable(),
      explanation: z.string().optional(),
      options: z.array(z.object({ id: z.string().optional(), optionText: z.string(), isCorrect: z.boolean(), optionOrder: z.number() })).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, options: opts, ...rest } = input;
      const toUpdate: any = { ...rest, updatedAt: new Date() };
      Object.keys(toUpdate).forEach((k) => { if (toUpdate[k] === undefined) delete toUpdate[k]; });
      if (Object.keys(toUpdate).length > 0) {
        await db.update(questions).set(toUpdate).where(eq(questions.id, id));
      }
      if (opts) {
        await db.delete(questionOptions).where(eq(questionOptions.questionId, id));
        if (opts.length > 0) {
          await db.insert(questionOptions).values(
            opts.map((o) => ({ questionId: id, optionText: o.optionText, isCorrect: o.isCorrect, optionOrder: o.optionOrder })),
          );
        }
      }
      return { success: true };
    }),

  deleteQuestion: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.update(questions).set({ deletedAt: new Date() }).where(eq(questions.id, input.id));
      return { success: true };
    }),

  // ─── USERS ──────────────────────────────────────────────────────────
  getAllUsers: adminProcedure
    .input(z.object({ search: z.string().optional(), role: z.string().optional(), page: z.number().default(1), pageSize: z.number().default(25) }))
    .query(async ({ input }) => {
      const conditions: any[] = [sql`${users.deletedAt} IS NULL`];
      if (input.search) {
        conditions.push(sql`(${users.firstName} ILIKE ${`%${input.search}%`} OR ${users.lastName} ILIKE ${`%${input.search}%`} OR ${users.email} ILIKE ${`%${input.search}%`})`);
      }
      const offset = (input.page - 1) * input.pageSize;
      const items = await db.select().from(users).where(and(...conditions)).orderBy(desc(users.createdAt)).limit(input.pageSize).offset(offset);
      const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(users).where(and(...conditions));
      const userIds = items.map((u) => u.id);
      const roles = userIds.length > 0 ? await db.select().from(userRoles).where(sql`${userRoles.userId} IN (${userIds.join(",")})`) : [];
      const rolesByUser: Record<string, string[]> = {};
      for (const r of roles) {
        if (!rolesByUser[r.userId]) rolesByUser[r.userId] = [];
        rolesByUser[r.userId].push(r.roleId);
      }
      return {
        items: items.map((u) => ({ ...u, roleIds: rolesByUser[u.id] || [] })),
        total: totalResult?.count || 0,
      };
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  toggleUserStatus: adminProcedure
    .input(z.object({ userId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.update(users).set({ isActive: input.isActive, updatedAt: new Date() }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Legacy endpoints (keep for compat)
  getUsers: adminProcedure.query(async () => [
    { id: "u1", name: "Gracefield Principal", email: "principal@gracefield.ng", role: "school_admin", status: "active", createdAt: "2026-01-15" },
    { id: "u2", name: "Chioma Okafor", email: "chioma@gracefield.ng", role: "teacher", status: "active", createdAt: "2026-02-01" },
    { id: "u3", name: "Adeola Ogunlesi", email: "adeola@school.edu.ng", role: "student", status: "active", createdAt: "2026-01-20" },
    { id: "u4", name: "Ngozi Ogunlesi", email: "parent@family.ng", role: "parent", status: "active", createdAt: "2026-03-10" },
  ]),
  getSchools: adminProcedure.query(async () => [
    { id: "s1", name: "Gracefield College", city: "Lagos", students: 456, teachers: 28, status: "verified", subscription: "premium" },
    { id: "s2", name: "Excel Comprehensive Academy", city: "Abuja", students: 312, teachers: 19, status: "verified", subscription: "free" },
  ]),
  getQuestions: adminProcedure.query(async () => [
    { id: "Q001", text: "What is 1/2 + 1/3?", subject: "Mathematics", type: "academic", bloom: "Apply", status: "approved" },
    { id: "Q002", text: "How often do you prepare lesson plans?", subject: "Teacher Quality", type: "teacher_quality", bloom: "Evaluate", status: "approved" },
    { id: "Q003", text: "Does your school have functioning labs?", subject: "School Quality", type: "school_quality", bloom: "Understand", status: "approved" },
  ]),
  getReportRequests: adminProcedure.query(async () => [
    { id: "r1", requester: "Gracefield College", type: "school_admin", target: "Adeola Ogunlesi", assessmentType: "academic", status: "pending", createdAt: "2026-07-18" },
    { id: "r2", requester: "Ngozi Ogunlesi", type: "parent", target: "Chidi Okonkwo", assessmentType: "academic", status: "pending", createdAt: "2026-07-17" },
    { id: "r3", requester: "Chioma Okafor", type: "teacher", target: "Chioma Okafor", assessmentType: "teacher_quality", status: "completed", createdAt: "2026-07-15" },
  ]),
  generateDeepReport: adminProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ input }) => ({ success: true, reportId: `dr-${input.requestId}`, message: "Deep report generated successfully" })),
  getPaymentHistory: adminProcedure.query(async () => [
    { id: "p1", user: "Gracefield College", amount: "₦150,000", item: "School Term License", status: "completed", date: "2026-07-10" },
    { id: "p2", user: "Ngozi Ogunlesi", amount: "₦3,000", item: "Deep Report - Adeola", status: "completed", date: "2026-07-12" },
  ]),
});
