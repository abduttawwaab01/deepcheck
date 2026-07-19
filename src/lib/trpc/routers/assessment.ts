import { z } from "zod";
import { protectedProcedure, router } from "../server";

export const assessmentRouter = router({
  getAssessment: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      return {
        id: input.assessmentId,
        title: "Primary 6 → JSS1 Readiness Assessment",
        subject: "Mathematics",
        totalItems: 35,
        timeLimitMinutes: 45,
        currentItem: {
          id: "q1",
          text: "What is 1/2 + 1/3?",
          type: "multiple_choice",
          options: [
            { id: "a", text: "2/5", order: 1 },
            { id: "b", text: "5/6", order: 2 },
            { id: "c", text: "2/6", order: 3 },
            { id: "d", text: "1/5", order: 4 },
          ],
        },
        itemsCompleted: 0,
        timeRemainingSeconds: 2700,
      };
    }),

  submitAnswer: protectedProcedure
    .input(z.object({
      instanceId: z.string(),
      itemId: z.string(),
      questionId: z.string(),
      selectedOptions: z.array(z.string()),
      responseTimeMs: z.number(),
    }))
    .mutation(async ({ input }) => {
      return {
        type: "next" as const,
        item: {
          id: "q2",
          text: "If x + 5 = 12, what is x?",
          type: "multiple_choice",
          options: [
            { id: "a", text: "5", order: 1 },
            { id: "b", text: "7", order: 2 },
            { id: "c", text: "17", order: 3 },
            { id: "d", text: "60", order: 4 },
          ],
        },
        itemsCompleted: 1,
        totalItems: 35,
        timeRemainingSeconds: 2650,
        theta: { current: 0.2, se: 0.45 },
      };
    }),

  completeAssessment: protectedProcedure
    .input(z.object({ instanceId: z.string() }))
    .mutation(async () => {
      return {
        readinessScore: 62,
        category: "developing",
        theta: 0.45,
        se: 0.28,
        itemsCompleted: 35,
        timeSpentSeconds: 2400,
        redirectUrl: "/student/reports/basic/new",
      };
    }),
});
