import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, numeric, index } from "drizzle-orm/pg-core";
import { schools } from "./schools";
import { users } from "./users";

export const schoolAssessmentQuestions = pgTable("school_assessment_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique(),
  domain: text("domain").notNull(),
  dimension: text("dimension").notNull(),
  questionText: text("question_text").notNull(),
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schoolAssessmentOptions = pgTable("school_assessment_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => schoolAssessmentQuestions.id, { onDelete: "cascade" }).notNull(),
  optionText: text("option_text").notNull(),
  optionOrder: integer("option_order").notNull(),
  score: integer("score").default(1),
});

export const schoolAssessmentResponses = pgTable("school_assessment_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id").references(() => schools.id).notNull(),
  submittedBy: uuid("submitted_by").references(() => users.id),
  responses: jsonb("responses").notNull(),
  totalScore: integer("total_score"),
  maxPossibleScore: integer("max_possible_score"),
  domainScores: jsonb("domain_scores"),
  category: text("category", { enum: ["needs_improvement", "developing", "adequate", "good", "excellent"] }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_school_assessment_responses_school").on(t.schoolId),
]);

export const schoolAssessmentDeepReports = pgTable("school_assessment_deep_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  responseId: uuid("response_id").references(() => schoolAssessmentResponses.id).notNull(),
  schoolId: uuid("school_id").references(() => schools.id).notNull(),
  requestedBy: uuid("requested_by").references(() => users.id),
  status: text("status", { enum: ["pending", "generating", "completed", "failed"] }).default("pending"),
  overallScore: numeric("overall_score"),
  domainAnalysis: jsonb("domain_analysis"),
  criticalGaps: jsonb("critical_gaps"),
  strengths: jsonb("strengths"),
  priorityActionPlan: jsonb("priority_action_plan"),
  benchmarkComparison: jsonb("benchmark_comparison"),
  resourceRecommendations: jsonb("resource_recommendations"),
  improvementTimeline: jsonb("improvement_timeline"),
  aiSummary: text("ai_summary"),
  paymentReference: text("payment_reference"),
  amountPaid: numeric("amount_paid"),
  pdfUrl: text("pdf_url"),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_school_assessment_deep_reports_school").on(t.schoolId),
  index("idx_school_assessment_deep_reports_response").on(t.responseId),
]);
