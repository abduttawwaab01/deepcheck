import { pgTable, uuid, text, timestamp, boolean, integer, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { schools } from "./schools";

export const teacherProfiles = pgTable("teacher_profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  schoolId: uuid("school_id").references(() => schools.id, { onDelete: "cascade" }).notNull(),
  employeeCode: varchar("employee_code", { length: 50 }),
  subject: varchar("subject", { length: 100 }),
  qualification: text("qualification"),
  yearsOfExperience: integer("years_of_experience").default(0),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_teacher_school").on(table.schoolId),
]);
