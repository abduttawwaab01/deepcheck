import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schemas/system";
import { bankTransfers, subscriptionCredits } from "@/lib/db/schemas/payments";
import { users } from "@/lib/db/schemas";
import { eq, sql, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const publicRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({ greeting: `Hello ${input.name ?? "World"}!` })),

  getLandingStats: publicProcedure.query(async () => {
    return {
      assessmentsCompleted: 50239,
      gapsFound: 1200000,
      schoolsUsing: 534,
      deepReportsGenerated: 45128,
    };
  }),

  getPricing: publicProcedure.query(async () => ({
    free: { name: "Free", price: 0, features: ["Full Assessment", "Basic Report", "Progress Tracking"] },
    deep: { name: "Deep Report", price: 3000, features: ["Everything in Free", "20-Section Report", "AI Recommendations", "PDF Download", "Daily Practice Plan"] },
    school: { name: "School Bulk", price: 150000, features: ["50 Deep Report Credits", "School Dashboard", "Teacher Analytics", "Parent Portal"] },
  })),

  getPricingConfig: publicProcedure.query(async () => {
    const rows = await db.select().from(systemConfig);
    const cfg: Record<string, any> = {};
    for (const r of rows) cfg[r.key] = r.value;
    return {
      pricePerCoin: cfg.price_per_coin || 2000,
      coinsPerReport: cfg.coins_per_report || 1,
      bundle20Price: 35000,
      bundle20Coins: 20,
    };
  }),

  getBankDetails: publicProcedure.query(async () => {
    const rows = await db.select().from(systemConfig);
    const cfg: Record<string, any> = {};
    for (const r of rows) cfg[r.key] = r.value;
    return {
      accountName: cfg.bank_account_name || "Odebunmi Tawwab",
      accountNumber: cfg.bank_account_number || "9152929772",
      bankName: cfg.bank_name || "Palmpay",
    };
  }),

  submitBankTransfer: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
      coinsRequested: z.number().int().positive(),
      senderName: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await db.select({ id: users.id }).from(users)
        .where(eq(users.id, ctx.user.id)).limit(1);
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your account was not found. Try logging out and signing in again.",
        });
      }

      try {
        const [transfer] = await db.insert(bankTransfers).values({
          userId: user.id,
          amount: String(input.amount),
          coinsRequested: input.coinsRequested,
          senderName: input.senderName.trim(),
          status: "pending",
        }).returning();

        return {
          success: true,
          transferId: transfer.id,
          message: "Bank transfer request submitted. Awaiting admin confirmation.",
        };
      } catch (error: any) {
        console.error("Bank transfer DB error:", error?.message || error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Database error: ${error?.message || "Unknown error"}. Please contact support.`,
        });
      }
    }),
});
