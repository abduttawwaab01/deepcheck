import { pgTable, uuid, text, timestamp, boolean, integer, varchar, jsonb, index } from "drizzle-orm/pg-core";

export const questionBanks = pgTable("question_banks", {
  id: uuid("id").defaultRandom().primaryKey(),
  level: varchar("level", { length: 50 }).unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questionBankConfigs = pgTable("question_bank_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  bankId: uuid("bank_id").references(() => questionBanks.id, { onDelete: "cascade" }).notNull(),
  sectionName: varchar("section_name", { length: 100 }).notNull(),
  questionCount: integer("question_count").default(10),
  timeLimitMinutes: integer("time_limit_minutes").default(15),
  difficultyDistribution: jsonb("difficulty_distribution").default({ easy: 0.35, medium: 0.45, hard: 0.2 }),
  bloomDistribution: jsonb("bloom_distribution").default({ remember: 0.1, understand: 0.2, apply: 0.3, analyze: 0.25, evaluate: 0.15 }),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_bank_config").on(table.bankId),
]);
