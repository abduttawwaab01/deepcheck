import { z } from "zod";
import { adminProcedure, router } from "../server";
import { db } from "@/lib/db";
import { schools } from "@/lib/db/schemas/schools";
import { questionBanks, questionBankConfigs } from "@/lib/db/schemas/question-banks";
import { questions, questionOptions, users, userRoles, roles } from "@/lib/db/schemas";
import { paymentTransactions, subscriptionCredits, subscriptionPlans, bankTransfers } from "@/lib/db/schemas/payments";
import { reportRequests, basicReports } from "@/lib/db/schemas/reports";
import { systemConfig } from "@/lib/db/schemas/system";
import { assessmentInstances } from "@/lib/db/schemas/assessments";
import { eq, sql, like, and, desc, inArray } from "drizzle-orm";

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async () => {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.deletedAt} IS NULL`);
    const [schoolCount] = await db.select({ count: sql<number>`count(*)` }).from(schools).where(sql`${schools.deletedAt} IS NULL`);
    const [assessmentCount] = await db.select({ count: sql<number>`count(*)` }).from(assessmentInstances).where(eq(assessmentInstances.status, "completed"));
    const [questionCount] = await db.select({ count: sql<number>`count(*)` }).from(questions).where(sql`${questions.deletedAt} IS NULL`);
    const [pendingReports] = await db.select({ count: sql<number>`count(*)` }).from(reportRequests).where(eq(reportRequests.status, "pending"));
    const [bankCount] = await db.select({ count: sql<number>`count(*)` }).from(questionBanks);
    const [configCount] = await db.select({ count: sql<number>`count(*)` }).from(questionBankConfigs);
    const [revenue] = await db.select({ total: sql<number>`coalesce(sum(${paymentTransactions.amount}), 0)` })
      .from(paymentTransactions).where(eq(paymentTransactions.status, "success"));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [recentUsers] = await db.select({ count: sql<number>`count(*)` }).from(users)
      .where(sql`${users.createdAt} > ${thirtyDaysAgo.toISOString()}`);

    return {
      totalUsers: userCount?.count || 0,
      totalSchools: schoolCount?.count || 0,
      totalAssessments: assessmentCount?.count || 0,
      revenueMTD: `₦${Number(revenue?.total || 0).toLocaleString()}`,
      pendingReports: pendingReports?.count || 0,
      questionCount: questionCount?.count || 0,
      bankCount: bankCount?.count || 0,
      sectionCount: configCount?.count || 0,
      recentUsers: recentUsers?.count || 0,
      userGrowth: [],
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
      const opts = qIds.length > 0 ? await db.select().from(questionOptions).where(inArray(questionOptions.questionId, qIds)) : [];
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
      const userRolesData = userIds.length > 0 ? await db.select().from(userRoles).where(inArray(userRoles.userId, userIds)) : [];
      const roleIds = [...new Set(userRolesData.map((r) => r.roleId))];
      const roleNames = roleIds.length > 0 ? await db.select({ id: roles.id, name: roles.name }).from(roles).where(inArray(roles.id, roleIds)) : [];
      const roleNameMap: Record<string, string> = {};
      for (const r of roleNames) roleNameMap[r.id] = r.name;
      const rolesByUser: Record<string, string[]> = {};
      for (const r of userRolesData) {
        if (!rolesByUser[r.userId]) rolesByUser[r.userId] = [];
        rolesByUser[r.userId].push(roleNameMap[r.roleId] || r.roleId);
      }
      return {
        items: items.map((u) => ({ ...u, roleNames: rolesByUser[u.id] || [] })),
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

  // ─── SCHOOLS ────────────────────────────────────────────────────────
  getSchools: adminProcedure.query(async () => {
    return db.select({
      id: schools.id,
      name: schools.name,
      city: schools.city,
      state: schools.state,
      email: schools.email,
      phone: schools.phone,
      address: schools.address,
      schoolType: schools.schoolType,
      students: schools.studentCount,
      teachers: schools.teacherCount,
      status: schools.verificationStatus,
      subscription: schools.subscriptionStatus,
      credits: schools.deepReportCredits,
      isActive: schools.isActive,
      createdAt: schools.createdAt,
    }).from(schools).where(sql`${schools.deletedAt} IS NULL`).orderBy(schools.name);
  }),

  verifySchool: adminProcedure
    .input(z.object({ schoolId: z.string(), status: z.enum(["verified", "pending", "rejected"]) }))
    .mutation(async ({ input }) => {
      await db.update(schools).set({ verificationStatus: input.status, updatedAt: new Date() }).where(eq(schools.id, input.schoolId));
      return { success: true };
    }),

  updateSchoolCredits: adminProcedure
    .input(z.object({ schoolId: z.string(), credits: z.number().min(0).max(9999) }))
    .mutation(async ({ input }) => {
      await db.update(schools).set({ deepReportCredits: input.credits, updatedAt: new Date() }).where(eq(schools.id, input.schoolId));
      return { success: true };
    }),

  updateSchoolSubscription: adminProcedure
    .input(z.object({ schoolId: z.string(), status: z.enum(["free", "basic", "pro", "enterprise"]) }))
    .mutation(async ({ input }) => {
      await db.update(schools).set({ subscriptionStatus: input.status, updatedAt: new Date() }).where(eq(schools.id, input.schoolId));
      return { success: true };
    }),

  toggleSchoolActive: adminProcedure
    .input(z.object({ schoolId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.update(schools).set({ isActive: input.isActive, updatedAt: new Date() }).where(eq(schools.id, input.schoolId));
      return { success: true };
    }),

  deleteSchool: adminProcedure
    .input(z.object({ schoolId: z.string() }))
    .mutation(async ({ input }) => {
      await db.update(schools).set({ deletedAt: new Date() }).where(eq(schools.id, input.schoolId));
      return { success: true };
    }),

  // ─── QUESTIONS (generic) ────────────────────────────────────────────
  getQuestions: adminProcedure.query(async () => {
    return db.select().from(questions).where(sql`${questions.deletedAt} IS NULL`).limit(200);
  }),

  // ─── REPORT REQUESTS ────────────────────────────────────────────────
  getReportRequests: adminProcedure.query(async () => {
    const requests = await db.select({
      id: reportRequests.id,
      requesterId: reportRequests.requesterId,
      requesterRole: reportRequests.requesterRole,
      targetUserId: reportRequests.targetUserId,
      assessmentType: reportRequests.assessmentType,
      status: reportRequests.status,
      createdAt: reportRequests.createdAt,
    }).from(reportRequests).orderBy(desc(reportRequests.createdAt));
    const userIds = [...new Set(requests.flatMap((r) => [r.requesterId, r.targetUserId].filter(Boolean) as string[]))];
    const userMap: Record<string, { firstName: string; lastName: string }> = {};
    if (userIds.length > 0) {
      const found = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
        .from(users).where(inArray(users.id, userIds));
      for (const u of found) userMap[u.id] = u;
    }
    return requests.map((r) => ({
      id: r.id,
      requester: userMap[r.requesterId] ? `${userMap[r.requesterId].firstName} ${userMap[r.requesterId].lastName}` : r.requesterId,
      target: r.targetUserId && userMap[r.targetUserId] ? `${userMap[r.targetUserId].firstName} ${userMap[r.targetUserId].lastName}` : r.targetUserId,
      assessmentType: r.assessmentType,
      status: r.status,
      createdAt: r.createdAt?.toISOString?.() || String(r.createdAt),
    }));
  }),

  generateDeepReport: adminProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ input }) => {
      const [request] = await db.select().from(reportRequests)
        .where(eq(reportRequests.id, input.requestId)).limit(1);
      if (!request) return { success: false, message: "Request not found" };

      await db.update(reportRequests).set({ status: "processing", updatedAt: new Date() })
        .where(eq(reportRequests.id, input.requestId));

      const { generateDeepReport } = await import("@/lib/engine/report-generator");
      const userId = request.targetUserId || request.requesterId;
      const instanceId = request.instanceId;

      if (!userId || !instanceId) {
        await db.update(reportRequests).set({ status: "failed", updatedAt: new Date() })
          .where(eq(reportRequests.id, input.requestId));
        return { success: false, message: "Missing user or assessment instance" };
      }

      const result = await generateDeepReport({ userId, instanceId });

      if (result.success) {
        await db.update(reportRequests).set({
          status: "completed",
          deepReportId: result.reportId,
          updatedAt: new Date(),
        }).where(eq(reportRequests.id, input.requestId));
        return { success: true, reportId: result.reportId, message: "Deep report generated successfully" };
      } else {
        await db.update(reportRequests).set({ status: "failed", updatedAt: new Date() })
          .where(eq(reportRequests.id, input.requestId));
        return { success: false, message: result.error || "Generation failed" };
      }
    }),

  // ─── PAYMENTS ───────────────────────────────────────────────────────
  getPaymentHistory: adminProcedure.query(async () => {
    const payments = await db.select({
      id: paymentTransactions.id,
      userId: paymentTransactions.userId,
      amount: paymentTransactions.amount,
      reference: paymentTransactions.reference,
      status: paymentTransactions.status,
      createdAt: paymentTransactions.createdAt,
    }).from(paymentTransactions).orderBy(desc(paymentTransactions.createdAt)).limit(50);
    const userIds = [...new Set(payments.map((p) => p.userId))];
    const userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const found = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
        .from(users).where(inArray(users.id, userIds));
      for (const u of found) userMap[u.id] = `${u.firstName} ${u.lastName}`;
    }
    return payments.map((p) => ({
      id: p.id,
      user: userMap[p.userId] || p.userId,
      amount: `₦${p.amount}`,
      reference: p.reference,
      status: p.status,
      date: p.createdAt?.toISOString?.()?.split("T")[0] || String(p.createdAt),
    }));
  }),

  getSystemConfig: adminProcedure.query(async () => {
    const rows = await db.select().from(systemConfig);
    const config: Record<string, any> = {};
    for (const r of rows) {
      config[r.key] = r.value;
    }
    return {
      appName: config.app_name || "Deep Check",
      supportEmail: config.support_email || "support@deepcheck.app",
      platformUrl: config.platform_url || "https://deepcheck.app",
      smtpHost: config.smtp_host || "smtp.sendgrid.net",
      smtpPort: config.smtp_port || "587",
      fromAddress: config.from_address || "noreply@deepcheck.app",
      sendTransactional: config.send_transactional ?? true,
      currency: config.currency || "NGN",
      taxRate: config.tax_rate || "7.5",
      paymentGatewayKey: config.payment_gateway_key || "sk_live_••••••••••••••••",
      pricePerCoin: config.price_per_coin || 2000,
      coinsPerReport: config.coins_per_report || 1,
      bankAccountName: config.bank_account_name || "Odebunmi Tawwab",
      bankAccountNumber: config.bank_account_number || "9152929772",
      bankName: config.bank_name || "Palmpay",
    };
  }),

  updateSystemConfig: adminProcedure
    .input(z.object({
      appName: z.string().optional(),
      supportEmail: z.string().optional(),
      platformUrl: z.string().optional(),
      smtpHost: z.string().optional(),
      smtpPort: z.string().optional(),
      fromAddress: z.string().optional(),
      sendTransactional: z.boolean().optional(),
      currency: z.string().optional(),
      taxRate: z.string().optional(),
      paymentGatewayKey: z.string().optional(),
      pricePerCoin: z.number().optional(),
      coinsPerReport: z.number().optional(),
      bankAccountName: z.string().optional(),
      bankAccountNumber: z.string().optional(),
      bankName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      for (const [key, value] of Object.entries(input)) {
        if (value === undefined) continue;
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        const [existing] = await db.select().from(systemConfig)
          .where(eq(systemConfig.key, dbKey)).limit(1);
        if (existing) {
          await db.update(systemConfig).set({ value, updatedAt: new Date() })
            .where(eq(systemConfig.key, dbKey));
        } else {
          await db.insert(systemConfig).values({ key: dbKey, value });
        }
      }
      return { success: true };
    }),

  // ─── BANK TRANSFERS ─────────────────────────────────────────────────
  getBankTransfers: adminProcedure.query(async () => {
    const transfers = await db.select().from(bankTransfers)
      .orderBy(desc(bankTransfers.createdAt)).limit(50);
    const userIds = [...new Set(transfers.map((t) => t.userId))];
    const userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const found = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
        .from(users).where(inArray(users.id, userIds));
      for (const u of found) userMap[u.id] = `${u.firstName} ${u.lastName}`;
    }
    return transfers.map((t) => ({
      id: t.id,
      user: userMap[t.userId] || t.userId,
      amount: t.amount,
      coinsRequested: t.coinsRequested,
      senderName: t.senderName,
      status: t.status,
      adminNote: t.adminNote,
      createdAt: t.createdAt?.toISOString?.()?.split("T")[0] || String(t.createdAt),
      confirmedAt: t.confirmedAt?.toISOString?.()?.split("T")[0] || null,
    }));
  }),

  confirmBankTransfer: adminProcedure
    .input(z.object({ transferId: z.string(), coinsGranted: z.number().min(1) }))
    .mutation(async ({ input }) => {
      const [transfer] = await db.select().from(bankTransfers)
        .where(eq(bankTransfers.id, input.transferId)).limit(1);
      if (!transfer) return { success: false, message: "Transfer not found" };
      if (transfer.status !== "pending") return { success: false, message: "Transfer already processed" };

      const [plan] = await db.select().from(subscriptionPlans)
        .where(eq(subscriptionPlans.code, "coins_custom")).limit(1);

      await db.insert(paymentTransactions).values({
        userId: transfer.userId,
        reference: `BT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        amount: transfer.amount,
        status: "success",
        provider: "bank_transfer",
        metadata: { sender_name: transfer.senderName, bank_transfer_id: transfer.id },
        paidAt: new Date(),
      });

      if (plan) {
        await db.insert(subscriptionCredits).values({
          userId: transfer.userId,
          planId: plan.id,
          creditsRemaining: input.coinsGranted,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
      }

      await db.update(bankTransfers).set({
        status: "confirmed",
        adminNote: `Granted ${input.coinsGranted} coins`,
        confirmedAt: new Date(),
      }).where(eq(bankTransfers.id, input.transferId));

      return { success: true };
    }),

  rejectBankTransfer: adminProcedure
    .input(z.object({ transferId: z.string(), note: z.string().optional() }))
    .mutation(async ({ input }) => {
      await db.update(bankTransfers).set({
        status: "rejected",
        adminNote: input.note || "Rejected by admin",
      }).where(eq(bankTransfers.id, input.transferId));
      return { success: true };
    }),
});
