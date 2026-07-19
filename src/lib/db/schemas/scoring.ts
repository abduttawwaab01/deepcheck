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
