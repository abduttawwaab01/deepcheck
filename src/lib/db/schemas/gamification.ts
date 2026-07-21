import { pgTable, uuid, text, timestamp, integer, jsonb, index, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userStreaks = pgTable("user_streaks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: text("last_activity_date"),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  index("idx_streak_user").on(t.userId),
]);

export const userBadges = pgTable("user_badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeCode: varchar("badge_code", { length: 50 }).notNull(),
  badgeName: varchar("badge_name", { length: 100 }).notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  xpAwarded: integer("xp_awarded").default(0),
  awardedAt: timestamp("awarded_at").defaultNow(),
}, (t) => [
  index("idx_badge_user").on(t.userId),
]);

export const leaderboard = pgTable("leaderboard", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  period: varchar("period", { length: 20 }).notNull(),
  totalXp: integer("total_xp").default(0),
  assessmentCount: integer("assessment_count").default(0),
  avgScore: integer("avg_score").default(0),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => [
  index("idx_leaderboard_period").on(t.period),
]);
