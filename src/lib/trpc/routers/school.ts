import { z } from "zod";
import { schoolProcedure, router } from "../server";

export const schoolRouter = router({
  getDashboard: schoolProcedure.query(async () => ({
    name: "Gracefield College",
    city: "Lagos",
    studentCount: 456,
    teacherCount: 28,
    assessmentsTaken: 189,
    deepReportsGenerated: 45,
    reportCreditsRemaining: 5,
    recentAssessments: [
      { student: "Adeola Ogunlesi", type: "Mathematics", score: 62, date: "2026-07-15" },
      { student: "Chidi Okonkwo", type: "English", score: 48, date: "2026-07-14" },
      { student: "Zainab Abdullahi", type: "Mathematics", score: 78, date: "2026-07-13" },
    ],
    teacherStatus: [
      { name: "Chioma Okafor", subject: "Mathematics", assessed: true, score: 72 },
      { name: "David Adeyemi", subject: "English", assessed: true, score: 65 },
    ],
  })),

  getTeachers: schoolProcedure.query(async () => [
    { id: "t1", name: "Chioma Okafor", email: "chioma@gracefield.ng", subject: "Mathematics", assessed: true, status: "active" },
    { id: "t2", name: "David Adeyemi", email: "david@gracefield.ng", subject: "English", assessed: true, status: "active" },
  ]),

  getStudents: schoolProcedure.query(async () => [
    { id: "s1", name: "Adeola Ogunlesi", email: "adeola@school.edu.ng", class: "SS2", assessments: 3, lastActive: "2026-07-15" },
    { id: "s2", name: "Chidi Okonkwo", email: "chidi@school.edu.ng", class: "SS2", assessments: 2, lastActive: "2026-07-14" },
    { id: "s3", name: "Zainab Abdullahi", email: "zainab@school.edu.ng", class: "SS1", assessments: 1, lastActive: "2026-07-13" },
  ]),

  getReports: schoolProcedure.query(async () => [
    { id: "r1", student: "Adeola Ogunlesi", type: "Math Diagnostic", basicScore: 62, hasDeep: true, deepStatus: "completed", date: "2026-07-15" },
    { id: "r2", student: "Chidi Okonkwo", type: "English Diagnostic", basicScore: 48, hasDeep: false, deepStatus: null, date: "2026-07-14" },
    { id: "r3", student: "Zainab Abdullahi", type: "Math Diagnostic", basicScore: 78, hasDeep: true, deepStatus: "pending", date: "2026-07-13" },
  ]),

  getStudentsBasicReport: schoolProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async () => ({
      score: 62,
      category: "developing",
      strengths: ["Vocabulary", "Basic Geometry"],
      weaknesses: ["Fraction Operations", "Logical Deduction"],
      topics: [
        { name: "Algebra", score: 65 },
        { name: "Geometry", score: 72 },
        { name: "Trigonometry", score: 45 },
        { name: "Statistics", score: 58 },
      ],
    })),

  requestDeepReport: schoolProcedure
    .input(z.object({ targetUserId: z.string(), instanceId: z.string(), assessmentType: z.string() }))
    .mutation(async () => ({
      success: true,
      message: "Deep report request submitted. You will be redirected to payment.",
      paymentUrl: "/payment/initialize",
    })),

  inviteTeacher: schoolProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string(), subject: z.string() }))
    .mutation(async ({ input }) => ({
      success: true,
      message: `Invitation sent to ${input.email}`,
    })),

  registerStudent: schoolProcedure
    .input(z.object({ email: z.string().email(), firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ input }) => ({
      success: true,
      message: `Student ${input.firstName} ${input.lastName} registered`,
    })),
});
