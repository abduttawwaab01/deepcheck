import { pgTable, uuid, text, timestamp, numeric, jsonb, integer, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { assessmentInstances } from "./assessments";
import { subjects, topics } from "./content";

export const masteryScores = pgTable("mastery_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  topicId: uuid("topic_id").references(() => topics.id).notNull(),
  abilityEstimate: numeric("ability_estimate").default("0").notNull(),
  abilitySE: numeric("ability_se").default("0").notNull(),
  responsesCount: integer("responses_count").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (t) => [
  index("idx_mastery_user_topic").on(t.userId, t.topicId),
]);

export const abilityEstimates = pgTable("ability_estimates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id),
  theta: numeric("theta").default("0").notNull(),
  thetaSE: numeric("theta_se").default("0").notNull(),
  discrimination: numeric("discrimination").default("1"),
  guessProbability: numeric("guess_probability").default("0.25"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  index("idx_ability_user_subject").on(t.userId, t.subjectId),
]);

export const thetaHistory = pgTable("theta_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id),
  theta: numeric("theta").notNull(),
  se: numeric("se").notNull(),
  questionIndex: integer("question_index").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const forgettingCurves = pgTable("forgetting_curves", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  topicId: uuid("topic_id").references(() => topics.id).notNull(),
  masteryAtAcquisition: numeric("mastery_at_acquisition").notNull(),
  acquisitionDate: timestamp("acquisition_date").notNull(),
  stabilityParameter: numeric("stability_parameter").default("1"),
  decayRate: numeric("decay_rate").default("0.5"),
  nextReviewDate: timestamp("next_review_date"),
  reviewCount: integer("review_count").default(0),
  easeFactor: numeric("ease_factor").default("2.5"),
  intervalDays: numeric("interval_days").default("1"),
  currentRetention: numeric("current_retention").default("1"),
  lastCalculated: timestamp("last_calculated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  index("idx_forgetting_curves_user_topic").on(t.userId, t.topicId),
  index("idx_forgetting_curves_review").on(t.nextReviewDate),
]);

export const masteryProgression = pgTable("mastery_progression", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  topicId: uuid("topic_id").references(() => topics.id).notNull(),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id),
  thetaBefore: numeric("theta_before").default("0"),
  thetaAfter: numeric("theta_after").default("0"),
  deltaTheta: numeric("delta_theta").default("0"),
  responsesCount: integer("responses_count").default(0),
  retentionEstimate: numeric("retention_estimate"),
  recordedAt: timestamp("recorded_at").defaultNow(),
}, (t) => [
  index("idx_mastery_progression_user_topic").on(t.userId, t.topicId),
]);
