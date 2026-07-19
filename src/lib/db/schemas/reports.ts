import { pgTable, uuid, text, timestamp, numeric, jsonb, boolean, varchar, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { assessmentInstances } from "./assessments";
import { subjects } from "./content";

export const basicReports = pgTable("basic_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id),
  overallScore: numeric("overall_score").notNull(),
  category: text("category", { enum: ["critical", "weak", "developing", "competent", "strong", "mastered"] }).notNull(),
  topicBreakdown: jsonb("topic_breakdown"),
  strengths: jsonb("strengths").default([]),
  weaknesses: jsonb("weaknesses").default([]),
  recommendations: jsonb("recommendations").default([]),
  isDeepReportAvailable: boolean("is_deep_report_available").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_basic_report_user").on(t.userId),
]);

export const reportRequests = pgTable("report_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  requesterId: uuid("requester_id").references(() => users.id).notNull(),
  requesterRole: varchar("requester_role", { length: 30 }).notNull(),
  targetUserId: uuid("target_user_id").references(() => users.id),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id),
  assessmentType: varchar("assessment_type", { length: 20 }).notNull(),
  paymentReference: text("payment_reference"),
  amountPaid: numeric("amount_paid"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  deepReportId: uuid("deep_report_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  index("idx_report_requests_requester").on(t.requesterId),
  index("idx_report_requests_status").on(t.status),
]);

export const deepReports = pgTable("deep_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  basicReportId: uuid("basic_report_id").references(() => basicReports.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "generating", "completed", "failed"] }).default("pending"),
  conceptMap: jsonb("concept_map"),
  masteryProgression: jsonb("mastery_progression"),
  cognitiveProfile: jsonb("cognitive_profile"),
  learningStyle: jsonb("learning_style"),
  personalizedPlan: jsonb("personalized_plan"),
  predictedPerformance: jsonb("predicted_performance"),
  studyRecommendations: jsonb("study_recommendations"),
  aiSummary: text("ai_summary"),
  pdfUrl: text("pdf_url"),
  generatedAt: timestamp("generated_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_deep_report_user").on(t.userId),
]);
