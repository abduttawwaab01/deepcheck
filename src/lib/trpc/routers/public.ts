import { z } from "zod";
import { publicProcedure, router } from "../server";

export const publicRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => ({ greeting: `Hello ${input.name ?? "World"}!` })),

  getLandingStats: publicProcedure.query(async ({ ctx }) => {
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
});
