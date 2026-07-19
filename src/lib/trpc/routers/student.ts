import { z } from "zod";
import { protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";

export const studentRouter = router({
  getDashboard: protectedProcedure.query(async () => ({
    name: "Adeola",
    streak: 5,
    assessments: 3,
    weakConcepts: 7,
    conceptsMastered: 4,
    deepReports: 1,
    overallReadiness: { score: 62, previousScore: 55, category: "developing" },
    radarData: [
      { dimension: "Number Sense", score: 72, peerAverage: 65 },
      { dimension: "Algebra", score: 55, peerAverage: 58 },
      { dimension: "Geometry", score: 68, peerAverage: 60 },
      { dimension: "Statistics", score: 50, peerAverage: 55 },
      { dimension: "Problem Solving", score: 45, peerAverage: 52 },
    ],
    weakConceptsList: [
      { id: "c1", name: "Fraction Operations", score: 34 },
      { id: "c2", name: "Logical Deduction", score: 28 },
      { id: "c3", name: "Word Problems", score: 38 },
    ],
    journey: [
      { date: "2026-06-01", score: 45 },
      { date: "2026-06-15", score: 52 },
      { date: "2026-07-01", score: 55 },
      { date: "2026-07-15", score: 62 },
    ],
    recommendations: [
      { id: "rec1", title: "Focus on Fractions", description: "Master fraction operations through daily practice" },
      { id: "rec2", title: "Build Logical Reasoning", description: "Practice with puzzles and pattern exercises" },
    ],
  })),

  getAssessments: protectedProcedure.query(async () => [
    { id: "a1", title: "Mathematics Diagnostic", subject: "Mathematics", questions: 10, timeLimit: 15, type: "academic" },
    { id: "a2", title: "English Language Diagnostic", subject: "English", questions: 10, timeLimit: 15, type: "academic" },
  ]),

  getReports: protectedProcedure.query(async () => [
    { id: "r1", title: "Math Diagnostic", score: 62, category: "developing", date: "2026-07-15", hasDeep: true, deepId: "dr1" },
    { id: "r2", title: "English Diagnostic", score: 48, category: "weak", date: "2026-06-20", hasDeep: false },
  ]),

  requestDeepReport: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async () => ({
      success: true,
      paymentUrl: "/payment/initialize?type=student_deep",
    })),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
