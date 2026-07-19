import { pgTable, uuid, text, timestamp, boolean, integer, numeric, jsonb, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { subjects, topics } from "./content";

export const assessmentConfigs = pgTable("assessment_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  assessmentType: varchar("assessment_type", { length: 20 }).notNull().default("academic"),
  subjectId: uuid("subject_id").references(() => subjects.id),
  topicIds: uuid("topic_ids").array().default([]),
  questionCount: integer("question_count").default(35),
  timeLimitMinutes: integer("time_limit_minutes").default(30),
  difficultyDistribution: jsonb("difficulty_distribution").default({ easy: 0.3, medium: 0.5, hard: 0.2 }),
  bloomDistribution: jsonb("bloom_distribution").default({ remember: 0.15, understand: 0.25, apply: 0.3, analyze: 0.2, evaluate: 0.1 }),
  isAdaptive: boolean("is_adaptive").default(true),
  isPublic: boolean("is_public").default(false),
  schoolOnly: boolean("school_only").default(false),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentInstances = pgTable("assessment_instances", {
  id: uuid("id").defaultRandom().primaryKey(),
  configId: uuid("config_id").references(() => assessmentConfigs.id),
  userId: uuid("user_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "in_progress", "paused", "completed", "timed_out"] }).default("pending"),
  currentQuestionIndex: integer("current_question_index").default(0),
  questionOrder: uuid("question_order").array().default([]),
  thetaEstimate: numeric("theta_estimate").default("0"),
  thetaSE: numeric("theta_se").default("0"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  timeSpentSeconds: integer("time_spent_seconds").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id).notNull(),
  questionId: uuid("question_id").notNull(),
  selectedOptionId: uuid("selected_option_id"),
  responseText: text("response_text"),
  isCorrect: boolean("is_correct"),
  confidenceScore: numeric("confidence_score"),
  timeSpentSeconds: integer("time_spent_seconds"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_response_instance").on(t.instanceId),
]);

export const assessmentProctoring = pgTable("assessment_proctoring", {
  id: uuid("id").defaultRandom().primaryKey(),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id).notNull(),
  eventType: text("event_type", { enum: ["tab_switch", "copy", "paste", "idle", "face_detected", "multiple_faces", "phone_detected", "audio_anomaly"] }).notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
}, (t) => [
  index("idx_proctoring_instance").on(t.instanceId),
]);
