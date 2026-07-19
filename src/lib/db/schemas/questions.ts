import { pgTable, uuid, text, timestamp, boolean, integer, varchar, numeric, jsonb, index } from "drizzle-orm/pg-core";
import { subjects } from "./content";
import { questionBanks } from "./question-banks";

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).unique(),
  bankId: uuid("bank_id").references(() => questionBanks.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 20 }).notNull().default("multiple_choice"),
  assessmentType: varchar("assessment_type", { length: 20 }).notNull().default("academic"),
  rendererType: varchar("renderer_type", { length: 20 }).default("standard"),
  subjectId: uuid("subject_id"),
  topicId: uuid("topic_id"),
  conceptId: uuid("concept_id"),
  concept: varchar("concept", { length: 200 }),
  difficultyLevel: varchar("difficulty_level", { length: 10 }).default("medium"),
  difficultyParam: numeric("difficulty_param", { precision: 5, scale: 2 }).default("0"),
  discriminationParam: numeric("discrimination_param", { precision: 5, scale: 2 }).default("1"),
  guessingParam: numeric("guessing_param", { precision: 3, scale: 2 }).default("0.25"),
  bloomLevel: varchar("bloom_level", { length: 20 }),
  cognitiveSkillId: uuid("cognitive_skill_id"),
  difficultyRating: integer("difficulty_rating"),
  expectedTimeSecs: integer("expected_time_secs").notNull(),
  weight: numeric("weight", { precision: 5, scale: 2 }).default("1"),
  allowsCalculator: boolean("allows_calculator").default(false),
  passageText: text("passage_text"),
  chartData: jsonb("chart_data"),
  geometryData: jsonb("geometry_data"),
  interactiveData: jsonb("interactive_data"),
  explanation: text("explanation"),
  isActive: boolean("is_active").default(true),
  status: varchar("status", { length: 20 }).default("approved"),
  language: varchar("language", { length: 10 }).default("en"),
  version: integer("version").default(1),
  createdBy: uuid("created_by"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("idx_questions_bank").on(table.bankId),
  index("idx_questions_subject").on(table.subjectId),
  index("idx_questions_concept_id").on(table.conceptId),
  index("idx_questions_difficulty_level").on(table.difficultyLevel),
  index("idx_questions_bloom").on(table.bloomLevel),
  index("idx_questions_status").on(table.status),
]);

export const questionOptions = pgTable("question_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => questions.id, { onDelete: "cascade" }).notNull(),
  optionText: text("option_text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  optionOrder: integer("option_order").notNull(),
  misconceptionId: uuid("misconception_id"),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionReviews = pgTable("question_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => questions.id, { onDelete: "cascade" }).notNull(),
  reviewerId: uuid("reviewer_id").notNull(),
  reviewStatus: varchar("review_status", { length: 20 }).notNull(),
  comments: text("comments"),
  reviewedAt: timestamp("reviewed_at").defaultNow(),
});
