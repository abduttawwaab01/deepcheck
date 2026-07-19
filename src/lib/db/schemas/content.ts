import { pgTable, uuid, text, timestamp, boolean, integer, varchar, numeric, jsonb, primaryKey, index } from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).unique(),
  description: text("description"),
  iconUrl: text("icon_url"),
  color: varchar("color", { length: 7 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  code: varchar("code", { length: 30 }),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("idx_topics_subject").on(table.subjectId),
]);

export const concepts = pgTable("concepts", {
  id: uuid("id").defaultRandom().primaryKey(),
  subtopicId: uuid("subtopic_id"),
  name: varchar("name", { length: 300 }).notNull(),
  code: varchar("code", { length: 50 }).unique(),
  description: text("description"),
  bloomLevel: varchar("bloom_level", { length: 20 }),
  estimatedMasteryHours: numeric("estimated_mastery_hours", { precision: 5, scale: 1 }),
  importanceWeight: integer("importance_weight").default(5),
  isFoundational: boolean("is_foundational").default(false),
  curriculumCode: varchar("curriculum_code", { length: 50 }),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("idx_concepts_bloom").on(table.bloomLevel),
]);

export const conceptPrerequisites = pgTable("concept_prerequisites", {
  conceptId: uuid("concept_id").references(() => concepts.id, { onDelete: "cascade" }).notNull(),
  prerequisiteId: uuid("prerequisite_id").references(() => concepts.id, { onDelete: "cascade" }).notNull(),
  strength: numeric("strength", { precision: 3, scale: 2 }).default("1"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.conceptId, table.prerequisiteId] }),
}));

export const conceptMisconceptions = pgTable("concept_misconceptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  conceptId: uuid("concept_id").references(() => concepts.id, { onDelete: "cascade" }).notNull(),
  misconception: text("misconception").notNull(),
  code: varchar("code", { length: 50 }).unique(),
  description: text("description"),
  severity: varchar("severity", { length: 20 }).default("moderate"),
  correctionStrategy: text("correction_strategy"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cognitiveSkills = pgTable("cognitive_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 30 }).unique(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
