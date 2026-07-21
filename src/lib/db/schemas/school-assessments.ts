import { pgTable, uuid, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { schools } from "./schools";
import { users } from "./users";

export const schoolAssessmentQuestions = pgTable("school_assessment_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
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
  createdAt: timestamp("created_at").defaultNow(),
});
