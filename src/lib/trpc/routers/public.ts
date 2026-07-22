import { z } from "zod";
import { publicProcedure, router } from "../server";
import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schemas/system";
import { eq } from "drizzle-orm";

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
});
