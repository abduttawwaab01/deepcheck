CREATE TABLE "ai_analysis_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"instance_id" uuid,
	"job_type" text NOT NULL,
	"status" text DEFAULT 'queued',
	"prompt_tokens" integer DEFAULT 0,
	"completion_tokens" integer DEFAULT 0,
	"model" text DEFAULT 'openrouter/default',
	"result" jsonb,
	"error_message" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assessment_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"assessment_type" varchar(20) DEFAULT 'academic' NOT NULL,
	"subject_id" uuid,
	"topic_ids" uuid[] DEFAULT '{}',
	"question_count" integer DEFAULT 35,
	"time_limit_minutes" integer DEFAULT 30,
	"difficulty_distribution" jsonb DEFAULT '{"easy":0.3,"medium":0.5,"hard":0.2}'::jsonb,
	"bloom_distribution" jsonb DEFAULT '{"remember":0.15,"understand":0.25,"apply":0.3,"analyze":0.2,"evaluate":0.1}'::jsonb,
	"is_adaptive" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"school_only" boolean DEFAULT false,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assessment_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_id" uuid,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'pending',
	"current_question_index" integer DEFAULT 0,
	"question_order" uuid[] DEFAULT '{}',
	"theta_estimate" numeric DEFAULT '0',
	"theta_se" numeric DEFAULT '0',
	"started_at" timestamp,
	"completed_at" timestamp,
	"time_spent_seconds" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assessment_proctoring" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assessment_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"selected_option_id" uuid,
	"response_text" text,
	"is_correct" boolean,
	"confidence_score" numeric,
	"time_spent_seconds" integer,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cognitive_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(30) NOT NULL,
	"description" text,
	"category" varchar(50),
	"subject_id" uuid,
	"parent_attribute_id" uuid,
	"hierarchy_level" integer DEFAULT 0,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cognitive_attributes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "cognitive_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(30),
	"description" text,
	"category" varchar(50),
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cognitive_skills_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "concept_misconceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"concept_id" uuid NOT NULL,
	"misconception" text NOT NULL,
	"code" varchar(50),
	"description" text,
	"severity" varchar(20) DEFAULT 'moderate',
	"correction_strategy" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "concept_misconceptions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "concept_prerequisites" (
	"concept_id" uuid NOT NULL,
	"prerequisite_id" uuid NOT NULL,
	"strength" numeric(3, 2) DEFAULT '1',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "concept_prerequisites_concept_id_prerequisite_id_pk" PRIMARY KEY("concept_id","prerequisite_id")
);
--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subtopic_id" uuid,
	"name" varchar(300) NOT NULL,
	"code" varchar(50),
	"description" text,
	"bloom_level" varchar(20),
	"estimated_mastery_hours" numeric(5, 1),
	"importance_weight" integer DEFAULT 5,
	"is_foundational" boolean DEFAULT false,
	"curriculum_code" varchar(50),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "concepts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "item_attribute_matrix" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"attribute_id" uuid NOT NULL,
	"weight" numeric(3, 2) DEFAULT '1',
	"is_required" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20),
	"description" text,
	"icon_url" text,
	"color" varchar(7),
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "subjects_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"code" varchar(30),
	"description" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period" varchar(20) NOT NULL,
	"total_xp" integer DEFAULT 0,
	"assessment_count" integer DEFAULT 0,
	"avg_score" integer DEFAULT 0,
	"rank" integer,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_code" varchar(50) NOT NULL,
	"badge_name" varchar(100) NOT NULL,
	"description" text,
	"icon_url" text,
	"xp_awarded" integer DEFAULT 0,
	"awarded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_activity_date" text,
	"total_xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_streaks_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "guardian_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guardian_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"relationship" varchar(50),
	"is_primary" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"module" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"is_allowed" boolean DEFAULT true,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"session_token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"student_code" varchar(50),
	"date_of_birth" timestamp,
	"gender" varchar(10),
	"current_school_id" uuid,
	"enrollment_status" varchar(20) DEFAULT 'active',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "student_profiles_student_code_unique" UNIQUE("student_code")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assigned_by" uuid,
	"assigned_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"phone" varchar(20),
	"password_hash" text,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"avatar_url" text,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_locked" boolean DEFAULT false,
	"lock_reason" text,
	"last_login_at" timestamp with time zone,
	"login_count" integer DEFAULT 0,
	"locale" varchar(10) DEFAULT 'en',
	"timezone" varchar(50) DEFAULT 'Africa/Lagos',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token"),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "school_settings" (
	"school_id" uuid PRIMARY KEY NOT NULL,
	"default_assessment_duration" integer DEFAULT 45,
	"enable_parent_portal" boolean DEFAULT true,
	"enable_teacher_reports" boolean DEFAULT true,
	"auto_generate_school_report" boolean DEFAULT true,
	"notify_on_assessment_complete" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"email" text,
	"phone" varchar(20),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100) DEFAULT 'Nigeria',
	"school_type" varchar(50),
	"logo_url" text,
	"website" text,
	"student_count" integer DEFAULT 0,
	"teacher_count" integer DEFAULT 0,
	"verification_status" varchar(20) DEFAULT 'pending',
	"subscription_status" varchar(20) DEFAULT 'free',
	"deep_report_credits" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "schools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "teacher_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"school_id" uuid NOT NULL,
	"employee_code" varchar(50),
	"subject" varchar(100),
	"qualification" text,
	"years_of_experience" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_bank_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bank_id" uuid NOT NULL,
	"section_name" varchar(100) NOT NULL,
	"question_count" integer DEFAULT 10,
	"time_limit_minutes" integer DEFAULT 15,
	"difficulty_distribution" jsonb DEFAULT '{"easy":0.35,"medium":0.45,"hard":0.2}'::jsonb,
	"bloom_distribution" jsonb DEFAULT '{"remember":0.1,"understand":0.2,"apply":0.3,"analyze":0.25,"evaluate":0.15}'::jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "question_banks_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE "question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"option_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"option_order" integer NOT NULL,
	"misconception_id" uuid,
	"explanation" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"review_status" varchar(20) NOT NULL,
	"comments" text,
	"reviewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50),
	"bank_id" uuid,
	"question_text" text NOT NULL,
	"question_type" varchar(20) DEFAULT 'multiple_choice' NOT NULL,
	"assessment_type" varchar(20) DEFAULT 'academic' NOT NULL,
	"renderer_type" varchar(20) DEFAULT 'standard',
	"subject_id" uuid,
	"topic_id" uuid,
	"concept_id" uuid,
	"concept" varchar(200),
	"department" varchar(30) DEFAULT 'general',
	"difficulty_level" varchar(10) DEFAULT 'medium',
	"difficulty_param" numeric(5, 2) DEFAULT '0',
	"discrimination_param" numeric(5, 2) DEFAULT '1',
	"guessing_param" numeric(3, 2) DEFAULT '0.25',
	"bloom_level" varchar(20),
	"cognitive_skill_id" uuid,
	"difficulty_rating" integer,
	"expected_time_secs" integer NOT NULL,
	"weight" numeric(5, 2) DEFAULT '1',
	"allows_calculator" boolean DEFAULT false,
	"passage_text" text,
	"chart_data" jsonb,
	"geometry_data" jsonb,
	"interactive_data" jsonb,
	"explanation" text,
	"is_active" boolean DEFAULT true,
	"status" varchar(20) DEFAULT 'approved',
	"language" varchar(10) DEFAULT 'en',
	"version" integer DEFAULT 1,
	"created_by" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "questions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "ability_estimates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"subject_id" uuid,
	"theta" numeric DEFAULT '0' NOT NULL,
	"theta_se" numeric DEFAULT '0' NOT NULL,
	"discrimination" numeric DEFAULT '1',
	"guess_probability" numeric DEFAULT '0.25',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forgetting_curves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"mastery_at_acquisition" numeric NOT NULL,
	"acquisition_date" timestamp NOT NULL,
	"stability_parameter" numeric DEFAULT '1',
	"decay_rate" numeric DEFAULT '0.5',
	"next_review_date" timestamp,
	"review_count" integer DEFAULT 0,
	"ease_factor" numeric DEFAULT '2.5',
	"interval_days" numeric DEFAULT '1',
	"current_retention" numeric DEFAULT '1',
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mastery_progression" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"instance_id" uuid,
	"theta_before" numeric DEFAULT '0',
	"theta_after" numeric DEFAULT '0',
	"delta_theta" numeric DEFAULT '0',
	"responses_count" integer DEFAULT 0,
	"retention_estimate" numeric,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mastery_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"ability_estimate" numeric DEFAULT '0' NOT NULL,
	"ability_se" numeric DEFAULT '0' NOT NULL,
	"responses_count" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "theta_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid,
	"theta" numeric NOT NULL,
	"se" numeric NOT NULL,
	"question_index" integer NOT NULL,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "basic_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"subject_id" uuid,
	"overall_score" numeric NOT NULL,
	"category" text NOT NULL,
	"topic_breakdown" jsonb,
	"strengths" jsonb DEFAULT '[]'::jsonb,
	"weaknesses" jsonb DEFAULT '[]'::jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"is_deep_report_available" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deep_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"basic_report_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text DEFAULT 'pending',
	"concept_map" jsonb,
	"mastery_progression" jsonb,
	"cognitive_profile" jsonb,
	"learning_style" jsonb,
	"personalized_plan" jsonb,
	"predicted_performance" jsonb,
	"study_recommendations" jsonb,
	"ai_summary" text,
	"pdf_url" text,
	"generated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "report_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"requester_role" varchar(30) NOT NULL,
	"target_user_id" uuid,
	"instance_id" uuid,
	"assessment_type" varchar(20) NOT NULL,
	"payment_reference" text,
	"amount_paid" numeric,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"deep_report_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reference" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'NGN',
	"status" text DEFAULT 'pending',
	"provider" text DEFAULT 'paystack',
	"metadata" jsonb,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "subscription_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid,
	"transaction_id" uuid,
	"credits_remaining" integer DEFAULT 0,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"amount" numeric NOT NULL,
	"interval" text DEFAULT 'one_time',
	"credits" integer DEFAULT 0,
	"features" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscription_plans_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" numeric NOT NULL,
	"balance" numeric NOT NULL,
	"description" text,
	"reference" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "app_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity" text,
	"entity_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "school_assessment_deep_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"response_id" uuid NOT NULL,
	"school_id" uuid NOT NULL,
	"requested_by" uuid,
	"status" text DEFAULT 'pending',
	"overall_score" numeric,
	"domain_analysis" jsonb,
	"critical_gaps" jsonb,
	"strengths" jsonb,
	"priority_action_plan" jsonb,
	"benchmark_comparison" jsonb,
	"resource_recommendations" jsonb,
	"improvement_timeline" jsonb,
	"ai_summary" text,
	"payment_reference" text,
	"amount_paid" numeric,
	"pdf_url" text,
	"generated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "school_assessment_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"option_text" text NOT NULL,
	"option_order" integer NOT NULL,
	"score" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "school_assessment_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text,
	"domain" text NOT NULL,
	"dimension" text NOT NULL,
	"question_text" text NOT NULL,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "school_assessment_questions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "school_assessment_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"submitted_by" uuid,
	"responses" jsonb NOT NULL,
	"total_score" integer,
	"max_possible_score" integer,
	"domain_scores" jsonb,
	"category" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parent_assessment_deep_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"response_id" uuid NOT NULL,
	"parent_id" uuid NOT NULL,
	"child_id" uuid,
	"status" text DEFAULT 'pending',
	"overall_score" numeric,
	"domain_analysis" jsonb,
	"parenting_style" jsonb,
	"strengths" jsonb,
	"areas_for_growth" jsonb,
	"age_specific_insights" jsonb,
	"action_plan" jsonb,
	"resource_recommendations" jsonb,
	"red_flags" jsonb,
	"ai_summary" text,
	"payment_reference" text,
	"amount_paid" numeric,
	"pdf_url" text,
	"generated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parent_assessment_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"option_text" text NOT NULL,
	"option_order" integer NOT NULL,
	"score" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "parent_assessment_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"domain" text NOT NULL,
	"question_text" text NOT NULL,
	"dimension" text NOT NULL,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "parent_assessment_questions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "parent_assessment_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"child_id" uuid,
	"responses" jsonb NOT NULL,
	"total_score" integer,
	"max_possible_score" integer,
	"domain_scores" jsonb,
	"category" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_analysis_jobs" ADD CONSTRAINT "ai_analysis_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_analysis_jobs" ADD CONSTRAINT "ai_analysis_jobs_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_configs" ADD CONSTRAINT "assessment_configs_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_configs" ADD CONSTRAINT "assessment_configs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_instances" ADD CONSTRAINT "assessment_instances_config_id_assessment_configs_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."assessment_configs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_instances" ADD CONSTRAINT "assessment_instances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_proctoring" ADD CONSTRAINT "assessment_proctoring_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cognitive_attributes" ADD CONSTRAINT "cognitive_attributes_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_misconceptions" ADD CONSTRAINT "concept_misconceptions_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_prerequisites" ADD CONSTRAINT "concept_prerequisites_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concept_prerequisites" ADD CONSTRAINT "concept_prerequisites_prerequisite_id_concepts_id_fk" FOREIGN KEY ("prerequisite_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_attribute_matrix" ADD CONSTRAINT "item_attribute_matrix_attribute_id_cognitive_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."cognitive_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_relations" ADD CONSTRAINT "guardian_relations_guardian_id_users_id_fk" FOREIGN KEY ("guardian_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_relations" ADD CONSTRAINT "guardian_relations_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_bank_configs" ADD CONSTRAINT "question_bank_configs_bank_id_question_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."question_banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_reviews" ADD CONSTRAINT "question_reviews_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_bank_id_question_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."question_banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ability_estimates" ADD CONSTRAINT "ability_estimates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ability_estimates" ADD CONSTRAINT "ability_estimates_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forgetting_curves" ADD CONSTRAINT "forgetting_curves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forgetting_curves" ADD CONSTRAINT "forgetting_curves_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery_progression" ADD CONSTRAINT "mastery_progression_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery_progression" ADD CONSTRAINT "mastery_progression_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery_progression" ADD CONSTRAINT "mastery_progression_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery_scores" ADD CONSTRAINT "mastery_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery_scores" ADD CONSTRAINT "mastery_scores_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theta_history" ADD CONSTRAINT "theta_history_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basic_reports" ADD CONSTRAINT "basic_reports_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basic_reports" ADD CONSTRAINT "basic_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basic_reports" ADD CONSTRAINT "basic_reports_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deep_reports" ADD CONSTRAINT "deep_reports_basic_report_id_basic_reports_id_fk" FOREIGN KEY ("basic_report_id") REFERENCES "public"."basic_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deep_reports" ADD CONSTRAINT "deep_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_instance_id_assessment_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."assessment_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_credits" ADD CONSTRAINT "subscription_credits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_credits" ADD CONSTRAINT "subscription_credits_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_credits" ADD CONSTRAINT "subscription_credits_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_sessions" ADD CONSTRAINT "app_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_assessment_deep_reports" ADD CONSTRAINT "school_assessment_deep_reports_response_id_school_assessment_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."school_assessment_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_assessment_deep_reports" ADD CONSTRAINT "school_assessment_deep_reports_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_assessment_deep_reports" ADD CONSTRAINT "school_assessment_deep_reports_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_assessment_options" ADD CONSTRAINT "school_assessment_options_question_id_school_assessment_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."school_assessment_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_assessment_responses" ADD CONSTRAINT "school_assessment_responses_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_assessment_responses" ADD CONSTRAINT "school_assessment_responses_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_assessment_deep_reports" ADD CONSTRAINT "parent_assessment_deep_reports_response_id_parent_assessment_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."parent_assessment_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_assessment_deep_reports" ADD CONSTRAINT "parent_assessment_deep_reports_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_assessment_deep_reports" ADD CONSTRAINT "parent_assessment_deep_reports_child_id_users_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_assessment_options" ADD CONSTRAINT "parent_assessment_options_question_id_parent_assessment_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."parent_assessment_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_assessment_responses" ADD CONSTRAINT "parent_assessment_responses_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_assessment_responses" ADD CONSTRAINT "parent_assessment_responses_child_id_users_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ai_jobs_user" ON "ai_analysis_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_jobs_status" ON "ai_analysis_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_proctoring_instance" ON "assessment_proctoring" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "idx_response_instance" ON "assessment_responses" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "idx_cognitive_attributes_subject" ON "cognitive_attributes" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "idx_concepts_bloom" ON "concepts" USING btree ("bloom_level");--> statement-breakpoint
CREATE INDEX "idx_item_attribute_question" ON "item_attribute_matrix" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "idx_item_attribute_attr" ON "item_attribute_matrix" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "idx_topics_subject" ON "topics" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "idx_leaderboard_period" ON "leaderboard" USING btree ("period");--> statement-breakpoint
CREATE INDEX "idx_badge_user" ON "user_badges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_streak_user" ON "user_streaks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_guardian_guardian" ON "guardian_relations" USING btree ("guardian_id");--> statement-breakpoint
CREATE INDEX "idx_guardian_student" ON "guardian_relations" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_phone" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_schools_slug" ON "schools" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_schools_verification" ON "schools" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_teacher_school" ON "teacher_profiles" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "idx_bank_config" ON "question_bank_configs" USING btree ("bank_id");--> statement-breakpoint
CREATE INDEX "idx_questions_bank" ON "questions" USING btree ("bank_id");--> statement-breakpoint
CREATE INDEX "idx_questions_subject" ON "questions" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "idx_questions_concept_id" ON "questions" USING btree ("concept_id");--> statement-breakpoint
CREATE INDEX "idx_questions_difficulty_level" ON "questions" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "idx_questions_bloom" ON "questions" USING btree ("bloom_level");--> statement-breakpoint
CREATE INDEX "idx_questions_status" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ability_user_subject" ON "ability_estimates" USING btree ("user_id","subject_id");--> statement-breakpoint
CREATE INDEX "idx_forgetting_curves_user_topic" ON "forgetting_curves" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE INDEX "idx_forgetting_curves_review" ON "forgetting_curves" USING btree ("next_review_date");--> statement-breakpoint
CREATE INDEX "idx_mastery_progression_user_topic" ON "mastery_progression" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE INDEX "idx_mastery_user_topic" ON "mastery_scores" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE INDEX "idx_basic_report_user" ON "basic_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_deep_report_user" ON "deep_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_report_requests_requester" ON "report_requests" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "idx_report_requests_status" ON "report_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payment_user" ON "payment_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_reference" ON "payment_transactions" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "idx_wallet_user" ON "wallet_transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_user" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_action" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_created" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_school_assessment_deep_reports_school" ON "school_assessment_deep_reports" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "idx_school_assessment_deep_reports_response" ON "school_assessment_deep_reports" USING btree ("response_id");--> statement-breakpoint
CREATE INDEX "idx_school_assessment_responses_school" ON "school_assessment_responses" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "idx_parent_assessment_deep_reports_parent" ON "parent_assessment_deep_reports" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_parent_assessment_deep_reports_response" ON "parent_assessment_deep_reports" USING btree ("response_id");--> statement-breakpoint
CREATE INDEX "idx_parent_assessment_responses_parent" ON "parent_assessment_responses" USING btree ("parent_id");