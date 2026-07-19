import { z } from "zod";
import { protectedProcedure, router } from "../server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";

export const teacherRouter = router({
  getDashboard: protectedProcedure.query(async () => ({
    name: "Chioma Okafor",
    subject: "Mathematics",
    school: "Gracefield College",
    assessed: true,
    lastScore: 72,
    category: "competent",
    assessmentHistory: [
      { date: "2026-07-15", score: 72 },
      { date: "2026-06-10", score: 68 },
    ],
    strengths: ["Lesson Planning", "Student Engagement", "Punctuality"],
    improvements: ["Technology Integration", "Parent Communication"],
    pendingAssessments: 0,
  })),

  getAssessment: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async () => ({
      id: "tq-001",
      title: "Teacher Quality Assessment",
      type: "teacher_quality",
      totalItems: 12,
      timeLimitMinutes: 20,
      currentItem: {
        id: "tq1",
        text: "How do you handle a student who is struggling with a topic?",
        type: "multiple_choice",
        options: [
          { id: "a", text: "Ignore and move on", order: 1 },
          { id: "b", text: "Provide extra support", order: 2 },
          { id: "c", text: "Tell them to catch up", order: 3 },
          { id: "d", text: "Send to principal", order: 4 },
        ],
      },
      itemsCompleted: 0,
      timeRemainingSeconds: 1200,
    })),

  submitAnswer: protectedProcedure
    .input(z.object({
      instanceId: z.string(), itemId: z.string(), selectedOptions: z.array(z.string()),
    }))
    .mutation(async () => ({
      type: "next",
      itemsCompleted: 1,
      totalItems: 12,
      timeRemainingSeconds: 1150,
    })),

  completeAssessment: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async () => ({
      score: 72,
      category: "competent",
      itemsCompleted: 12,
      redirectUrl: "/teacher/reports/basic",
    })),

  getReports: protectedProcedure.query(async () => [
    { id: "r1", type: "Teacher Quality", score: 72, category: "competent", date: "2026-07-15", hasDeep: false },
  ]),

  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE") }))
    .mutation(async ({ ctx }) => {
      await db.update(users).set({ deletedAt: new Date(), isActive: false }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
});
