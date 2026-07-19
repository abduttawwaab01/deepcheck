import { pgTable, uuid, text, timestamp, boolean, varchar, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const guardianRelations = pgTable("guardian_relations", {
  id: uuid("id").defaultRandom().primaryKey(),
  guardianId: uuid("guardian_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  studentId: uuid("student_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  relationship: varchar("relationship", { length: 50 }),
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_guardian_guardian").on(table.guardianId),
  index("idx_guardian_student").on(table.studentId),
]);
