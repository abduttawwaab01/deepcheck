import { pgTable, uuid, text, timestamp, boolean, integer, varchar, jsonb, index } from "drizzle-orm/pg-core";

export const schools = pgTable("schools", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  email: text("email"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Nigeria"),
  schoolType: varchar("school_type", { length: 50 }),
  logoUrl: text("logo_url"),
  website: text("website"),
  studentCount: integer("student_count").default(0),
  teacherCount: integer("teacher_count").default(0),
  verificationStatus: varchar("verification_status", { length: 20 }).default("pending"),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default("free"),
  deepReportCredits: integer("deep_report_credits").default(0),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("idx_schools_slug").on(table.slug),
  index("idx_schools_verification").on(table.verificationStatus),
]);

export const schoolSettings = pgTable("school_settings", {
  schoolId: uuid("school_id").primaryKey().references(() => schools.id, { onDelete: "cascade" }),
  defaultAssessmentDuration: integer("default_assessment_duration").default(45),
  enableParentPortal: boolean("enable_parent_portal").default(true),
  enableTeacherReports: boolean("enable_teacher_reports").default(true),
  autoGenerateSchoolReport: boolean("auto_generate_school_report").default(true),
  notifyOnAssessmentComplete: boolean("notify_on_assessment_complete").default(true),
  metadata: jsonb("metadata").default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});
