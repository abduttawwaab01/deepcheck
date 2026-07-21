import { pgTable, uuid, text, timestamp, boolean, integer, numeric, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const parentAssessmentQuestions = pgTable("parent_assessment_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique().notNull(),
  domain: text("domain").notNull(),
  questionText: text("question_text").notNull(),
  dimension: text("dimension").notNull(),
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parentAssessmentOptions = pgTable("parent_assessment_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => parentAssessmentQuestions.id, { onDelete: "cascade" }).notNull(),
  optionText: text("option_text").notNull(),
  optionOrder: integer("option_order").notNull(),
  score: integer("score").default(1),
});

export const parentAssessmentResponses = pgTable("parent_assessment_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id").references(() => users.id).notNull(),
  childId: uuid("child_id").references(() => users.id),
  responses: jsonb("responses").notNull(),
  totalScore: integer("total_score"),
  maxPossibleScore: integer("max_possible_score"),
  domainScores: jsonb("domain_scores"),
  category: text("category", { enum: ["needs_guidance", "developing", "adequate", "proficient", "exemplary"] }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_parent_assessment_responses_parent").on(t.parentId),
]);

export const parentAssessmentDeepReports = pgTable("parent_assessment_deep_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  responseId: uuid("response_id").references(() => parentAssessmentResponses.id).notNull(),
  parentId: uuid("parent_id").references(() => users.id).notNull(),
  childId: uuid("child_id").references(() => users.id),
  status: text("status", { enum: ["pending", "generating", "completed", "failed"] }).default("pending"),
  overallScore: numeric("overall_score"),
  domainAnalysis: jsonb("domain_analysis"),
  parentingStyle: jsonb("parenting_style"),
  strengths: jsonb("strengths"),
  areasForGrowth: jsonb("areas_for_growth"),
  ageSpecificInsights: jsonb("age_specific_insights"),
  actionPlan: jsonb("action_plan"),
  resourceRecommendations: jsonb("resource_recommendations"),
  redFlags: jsonb("red_flags"),
  aiSummary: text("ai_summary"),
  paymentReference: text("payment_reference"),
  amountPaid: numeric("amount_paid"),
  pdfUrl: text("pdf_url"),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_parent_assessment_deep_reports_parent").on(t.parentId),
  index("idx_parent_assessment_deep_reports_response").on(t.responseId),
]);
