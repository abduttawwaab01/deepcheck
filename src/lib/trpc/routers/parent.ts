import { z } from "zod";
import { protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";

export const parentRouter = router({
  getDashboard: protectedProcedure.query(async () => ({
    name: "Ngozi Ogunlesi",
    children: [
      { id: "c1", name: "Adeola Ogunlesi", lastScore: 62, lastAssessment: "Math Diagnostic", date: "2026-07-15", hasDeep: true },
      { id: "c2", name: "Chidi Okonkwo", lastScore: 48, lastAssessment: "English Diagnostic", date: "2026-07-14", hasDeep: false },
    ],
    recentActivity: [
      { child: "Adeola", action: "Completed Math Diagnostic", date: "2026-07-15" },
      { child: "Chidi", action: "Completed English Diagnostic", date: "2026-07-14" },
      { child: "Adeola", action: "Deep Report Generated", date: "2026-07-16" },
    ],
    deepReportCredits: 3,
  })),

  getChildren: protectedProcedure.query(async () => [
    { id: "c1", name: "Adeola Ogunlesi", email: "adeola@school.edu.ng", relationship: "son", assessments: 3, lastActive: "2026-07-15" },
    { id: "c2", name: "Chidi Okonkwo", email: "chidi@school.edu.ng", relationship: "ward", assessments: 2, lastActive: "2026-07-14" },
  ]),

  getChildReports: protectedProcedure
    .input(z.object({ childId: z.string() }))
    .query(async () => [
      { id: "r1", title: "Math Diagnostic", score: 62, category: "developing", date: "2026-07-15", hasDeep: true, deepId: "dr1" },
      { id: "r2", title: "English Diagnostic", score: 48, category: "weak", date: "2026-06-20", hasDeep: false },
    ]),

  addChild: protectedProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string(), relationship: z.string() }))
    .mutation(async ({ input }) => ({
      success: true,
      message: `${input.firstName} ${input.lastName} added as your child`,
    })),

  requestDeepReport: protectedProcedure
    .input(z.object({ childId: z.string(), instanceId: z.string() }))
    .mutation(async () => ({
      success: true,
      paymentUrl: "/payment/initialize?type=parent_deep",
    })),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
