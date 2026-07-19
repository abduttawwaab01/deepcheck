import { pgTable, uuid, text, timestamp, numeric, jsonb, boolean, integer, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { assessmentInstances } from "./assessments";

export const aiAnalysisJobs = pgTable("ai_analysis_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  instanceId: uuid("instance_id").references(() => assessmentInstances.id),
  jobType: text("job_type", { enum: ["deep_report", "concept_map", "recommendations", "plagiarism_check", "essay_grading"] }).notNull(),
  status: text("status", { enum: ["queued", "processing", "completed", "failed"] }).default("queued"),
  promptTokens: integer("prompt_tokens").default(0),
  completionTokens: integer("completion_tokens").default(0),
  model: text("model").default("openrouter/default"),
  result: jsonb("result"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_ai_jobs_user").on(t.userId),
  index("idx_ai_jobs_status").on(t.status),
]);
