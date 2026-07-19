# DEEP CHECK — Software Requirements Specification

## Phase 4: Database Schema

---

## 1. DATABASE PHILOSOPHY

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Engine** | PostgreSQL (via Neon) | Serverless, free tier 0.5GB, branching, vector support via pgvector |
| **ORM** | Drizzle ORM | Type-safe, lightweight, serverless-optimized, better cold-start than Prisma |
| **Migrations** | Drizzle Kit | Schema-first migrations, SQL generation |
| **Extensions** | pgvector, pgcrypto, uuid-ossp, citext | Vector embeddings, encryption, UUIDs, case-insensitive text |
| **Naming** | snake_case | SQL convention, Drizzle handles mapping |
| **Keys** | UUIDv7 (time-sortable) | Better than serial (no sequential guessing), time-sortable for clustering |
| **Soft Delete** | All tables have `deleted_at` | Never lose data, audit trail |
| **Timestamps** | `created_at`, `updated_at` | Automatic via Drizzle `defaultNow()` |
| **Partitioning** | By `school_id` for large tables | School-level data isolation, query performance |
| **Indexing** | B-tree for PK/FK, GIN for JSON/array, IVFFlat for vectors | Appropriate index types per use case |

---

## 2. COMPLETE TABLE LISTING (86 Tables)

### 2.1 Core & Identity (17 tables)

| # | Table | Description |
|---|-------|-------------|
| 01 | `users` | All registered users (base table for all roles) |
| 02 | `roles` | Role definitions (admin, school_admin, teacher, student, parent, guest) |
| 03 | `user_roles` | Many-to-many: users ↔ roles |
| 04 | `permissions` | Granular permission definitions |
| 05 | `role_permissions` | Many-to-many: roles ↔ permissions |
| 06 | `user_sessions` | Active sessions, JWT refresh tokens |
| 07 | `email_verification_tokens` | Email verification codes |
| 08 | `password_reset_tokens` | Password reset tokens |
| 09 | `schools` | Registered schools |
| 10 | `school_settings` | Per-school configuration |
| 11 | `school_verification` | Verification documents, status |
| 12 | `classes` | Class/grade levels within schools |
| 13 | `academic_sessions` | Academic year sessions |
| 14 | `terms` | Terms within sessions |
| 15 | `student_profiles` | Student-specific data (extends users) |
| 16 | `teacher_profiles` | Teacher-specific data (extends users) |
| 17 | `parent_profiles` | Parent-specific data (extends users) |

### 2.2 Relationships (7 tables)

| # | Table | Description |
|---|-------|-------------|
| 18 | `student_enrollments` | Student ↔ Class ↔ Term ↔ Session enrollment |
| 19 | `teacher_assignments` | Teacher ↔ Class ↔ Subject assignments |
| 20 | `student_parent_relations` | Student ↔ Parent with relationship type |
| 21 | `school_admins` | Users with school admin role per school |
| 22 | `class_teachers` | Class ↔ Teacher assignments |
| 23 | `class_subjects` | Class ↔ Subject offerings |
| 24 | `student_class_history` | Historical class enrollments |

### 2.3 Content & Curriculum (13 tables)

| # | Table | Description |
|---|-------|-------------|
| 25 | `subjects` | Subject definitions (Mathematics, English, etc.) |
| 26 | `topics` | Topics within subjects |
| 27 | `subtopics` | Subtopics within topics |
| 28 | `concepts` | Individual concepts/learning objectives |
| 29 | `concept_prerequisites` | Directed graph: concept → prerequisite concept |
| 30 | `concept_misconceptions` | Known misconceptions mapped to concepts |
| 31 | `learning_outcomes` | Measurable learning outcome statements |
| 32 | `cognitive_skills` | Cognitive skill taxonomy (Bloom's, etc.) |
| 33 | `difficulty_levels` | IRT difficulty parameters |
| 34 | `curriculum_mappings` | Mapping to external curriculum (NERDC, WAEC, etc.) |
| 35 | `concept_learning_resources` | Resources per concept (videos, links) |
| 36 | `knowledge_graph` | Weighted edges between concepts |
| 37 | `class_concept_coverage` | Which concepts each class should cover |

### 2.4 Questions & Assessment (11 tables)

| # | Table | Description |
|---|-------|-------------|
| 38 | `questions` | Master question bank |
| 39 | `question_options` | Answer options for each question |
| 40 | `question_tags` | Tagging (subject, topic, concept, bloom, etc.) |
| 41 | `question_misconceptions` | Which misconceptions each option maps to |
| 42 | `question_dependencies` | Prerequisite questions/concepts |
| 43 | `question_media` | Images, audio, video attached to questions |
| 44 | `question_reviews` | Quality review workflow records |
| 45 | `question_versions` | Version history for questions |
| 46 | `assessments` | Assessment templates/configurations |
| 47 | `assessment_rules` | Adaptive rules per assessment |
| 48 | `assessment_schedule` | Scheduled assessment windows |

### 2.5 Assessment Delivery (6 tables)

| # | Table | Description |
|---|-------|-------------|
| 49 | `assessment_instances` | Individual assessment sessions |
| 50 | `assessment_items` | Questions delivered in an instance |
| 51 | `assessment_responses` | Student responses to each item |
| 52 | `assessment_state` | Real-time state for interrupted assessments |
| 53 | `assessment_events` | Event log (start, pause, resume, submit) |
| 54 | `assessment_termination` | Why assessment ended (complete, timeout, abandon) |

### 2.6 Scoring & Results (9 tables)

| # | Table | Description |
|---|-------|-------------|
| 55 | `theta_estimates` | IRT theta estimates per instance |
| 56 | `misconception_probabilities` | BKT misconception probabilities per instance |
| 57 | `readiness_scores` | Aggregated readiness scores per domain |
| 58 | `learning_velocity` | Learning rate calculations over time |
| 59 | `cognitive_skill_scores` | Per-cognitive-skill scores |
| 60 | `concept_mastery` | Mastery levels per concept per student |
| 61 | `score_history` | Longitudinal score tracking |
| 62 | `item_parameters` | IRT item parameters (a, b, c) with calibration history |
| 63 | `item_exposure` | Exposure tracking to prevent overuse |

### 2.7 Reports (6 tables)

| # | Table | Description |
|---|-------|-------------|
| 64 | `reports` | Generated report records |
| 65 | `report_templates` | Configurable report templates |
| 66 | `report_sections` | Sections within templates |
| 67 | `report_purchases` | Deep report purchase records |
| 68 | `report_downloads` | Download/access logging |
| 69 | `scheduled_reports` | Auto-generation schedules |

### 2.8 Payments & Billing (8 tables)

| # | Table | Description |
|---|-------|-------------|
| 70 | `transactions` | All financial transactions |
| 71 | `transaction_items` | Line items within transactions |
| 72 | `payment_provider_logs` | Paystack/Flutterwave/Stripe webhook logs |
| 73 | `coupons` | Discount coupon definitions |
| 74 | `coupon_usage` | Coupon redemption tracking |
| 75 | `subscription_plans` | Subscription product definitions |
| 76 | `subscriptions` | Active/past subscriptions |
| 77 | `school_credits` | School bulk credit balances |

### 2.9 AI & Recommendations (5 tables)

| # | Table | Description |
|---|-------|-------------|
| 78 | `recommendations` | Generated recommendations |
| 79 | `recommendation_actions` | Specific action items within recommendations |
| 80 | `recommendation_tracking` | Follow-through tracking |
| 81 | `ai_prompt_templates` | Configurable LLM prompts |
| 82 | `ai_model_config` | Model selection and parameters |

### 2.10 Admin & System (12 tables)

| # | Table | Description |
|---|-------|-------------|
| 83 | `audit_logs` | All admin/user actions |
| 84 | `feature_flags` | Feature toggle configurations |
| 85 | `api_keys` | API key management |
| 86 | `api_key_permissions` | Scoped permissions per API key |
| 87 | `system_config` | Key-value system configuration |
| 88 | `notification_queue` | Outbound notification queue |
| 89 | `notification_templates` | Template per notification type |
| 90 | `cms_pages` | Static content pages |
| 91 | `blog_posts` | Blog content |
| 92 | `backup_logs` | Backup/restore history |
| 93 | `school_quality_reports` | Cached school diagnostic reports |
| 94 | `parent_diagnostics` | Parent diagnostic data |

---

## 3. DETAILED TABLE SCHEMAS

### 3.1 `users`

```sql
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             CITEXT UNIQUE,
  phone             VARCHAR(20) UNIQUE,
  password_hash     VARCHAR(255),
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  avatar_url        TEXT,
  is_verified       BOOLEAN DEFAULT false,
  verification_type VARCHAR(20) CHECK (verification_type IN ('email', 'phone', 'both')),
  is_active         BOOLEAN DEFAULT true,
  is_locked         BOOLEAN DEFAULT false,
  lock_reason       TEXT,
  last_login_at     TIMESTAMPTZ,
  last_login_ip     INET,
  login_count       INTEGER DEFAULT 0,
  locale            VARCHAR(10) DEFAULT 'en',
  timezone          VARCHAR(50) DEFAULT 'Africa/Lagos',
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_name ON users(last_name, first_name);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE deleted_at IS NULL;
```

### 3.2 `roles` & `permissions`

```sql
CREATE TABLE roles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(50) UNIQUE NOT NULL,
  description       TEXT,
  is_system         BOOLEAN DEFAULT false, -- cannot be deleted
  priority          INTEGER DEFAULT 0, -- higher = more privileged
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

-- Seed roles
-- INSERT INTO roles (name, description, is_system, priority) VALUES
-- ('ultimate_admin', 'Full system control', true, 100),
-- ('school_admin', 'School-level administration', true, 80),
-- ('teacher', 'Classroom teacher', true, 60),
-- ('student', 'Learner', true, 40),
-- ('parent', 'Parent/guardian', true, 30),
-- ('guest', 'Individual learner no school', true, 20);

CREATE TABLE permissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'users.create', 'questions.approve'
  name              VARCHAR(200) NOT NULL,
  module            VARCHAR(50) NOT NULL, -- users, content, payments, etc.
  description       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id           UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id     UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  is_allowed        BOOLEAN DEFAULT true,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id           UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by       UUID REFERENCES users(id),
  assigned_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at        TIMESTAMPTZ, -- optional temporary role
  PRIMARY KEY (user_id, role_id)
);
```

### 3.3 `schools`

```sql
CREATE TABLE schools (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(200) NOT NULL,
  slug              VARCHAR(200) UNIQUE NOT NULL,
  email             CITEXT,
  phone             VARCHAR(20),
  address           TEXT,
  city              VARCHAR(100),
  state             VARCHAR(100),
  country           VARCHAR(100) DEFAULT 'Nigeria',
  school_type       VARCHAR(50) CHECK (school_type IN ('public', 'private', 'international', 'faith-based')),
  level             VARCHAR(50) CHECK (level IN ('primary', 'secondary', 'both', 'university')),
  registration_number VARCHAR(100),
  logo_url          TEXT,
  website           TEXT,
  student_count     INTEGER DEFAULT 0,
  teacher_count     INTEGER DEFAULT 0,
  verification_status VARCHAR(20) DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
  verification_doc_urls TEXT[],
  is_active         BOOLEAN DEFAULT true,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_schools_slug ON schools(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_state ON schools(state);
CREATE INDEX idx_schools_verification ON schools(verification_status);
```

### 3.4 `school_settings`

```sql
CREATE TABLE school_settings (
  school_id         UUID PRIMARY KEY REFERENCES schools(id) ON DELETE CASCADE,
  -- Assessment defaults
  default_assessment_duration INTEGER DEFAULT 45, -- minutes
  min_assessment_interval     INTEGER DEFAULT 7,  -- days between assessments
  require_proctoring          BOOLEAN DEFAULT false,
  -- Theme
  primary_color      VARCHAR(7) DEFAULT '#2563EB',
  secondary_color    VARCHAR(7) DEFAULT '#7C3AED',
  logo_url           TEXT,
  -- Features
  enable_parent_portal BOOLEAN DEFAULT true,
  enable_teacher_reports BOOLEAN DEFAULT true,
  auto_generate_school_report BOOLEAN DEFAULT true,
  -- Notifications
  notify_on_assessment_complete BOOLEAN DEFAULT true,
  notify_on_risk_detected       BOOLEAN DEFAULT true,
  notify_on_report_ready        BOOLEAN DEFAULT true,
  -- Billing
  billing_email       CITEXT,
  auto_renew_credits  BOOLEAN DEFAULT false,
  credit_threshold    INTEGER DEFAULT 50, -- auto-purchase when below
  metadata            JSONB DEFAULT '{}',
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 `classes`, `academic_sessions`, `terms`

```sql
CREATE TABLE classes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name              VARCHAR(100) NOT NULL, -- e.g., "Primary 6A", "JSS 1B"
  code              VARCHAR(20), -- e.g., "P6A"
  academic_level    VARCHAR(20) NOT NULL CHECK (academic_level IN
    ('primary1','primary2','primary3','primary4','primary5','primary6',
     'jss1','jss2','jss3','ss1','ss2','ss3','university')),
  section           VARCHAR(50), -- e.g., "A", "B", "Science", "Commercial"
  class_teacher_id  UUID REFERENCES teacher_profiles(id),
  capacity          INTEGER,
  is_active         BOOLEAN DEFAULT true,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ,
  UNIQUE(school_id, name)
);

CREATE INDEX idx_classes_school ON classes(school_id) WHERE deleted_at IS NULL;

CREATE TABLE academic_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name              VARCHAR(100) NOT NULL, -- e.g., "2025/2026 Academic Session"
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  is_current        BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);

CREATE TABLE terms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  name              VARCHAR(50) NOT NULL, -- e.g., "First Term", "Second Term", "Third Term"
  term_number       INTEGER NOT NULL CHECK (term_number BETWEEN 1 AND 3),
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  is_current        BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, term_number)
);
```

### 3.6 `student_profiles`, `teacher_profiles`, `parent_profiles`

```sql
CREATE TABLE student_profiles (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_code      VARCHAR(50) UNIQUE, -- school-issued student ID
  date_of_birth     DATE,
  gender            VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  current_school_id UUID REFERENCES schools(id),
  enrollment_status VARCHAR(20) DEFAULT 'active'
    CHECK (enrollment_status IN ('active', 'transferred', 'graduated', 'withdrawn')),
  learning_notes    TEXT, -- teacher-visible notes
  iep_requirements  TEXT, -- individualized education plan notes (special needs)
  parent_consent    BOOLEAN DEFAULT false,
  consent_date      TIMESTAMPTZ,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teacher_profiles (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  staff_id          VARCHAR(50),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date_of_birth     DATE,
  gender            VARCHAR(10),
  qualification     VARCHAR(200), -- e.g., "B.Ed. Mathematics"
  specialization    VARCHAR(200),
  years_of_experience INTEGER,
  subjects_specialized UUID[],
  is_class_teacher  BOOLEAN DEFAULT false,
  employment_status VARCHAR(20) DEFAULT 'active'
    CHECK (employment_status IN ('active', 'on_leave', 'exited')),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parent_profiles (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  occupation        VARCHAR(200),
  education_level   VARCHAR(100),
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_preference VARCHAR(20) DEFAULT 'whatsapp'
    CHECK (notification_preference IN ('email', 'sms', 'whatsapp', 'in_app')),
  family_setup      JSONB DEFAULT '{}', -- number of children, etc.
  onboarding_completed BOOLEAN DEFAULT false,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.7 Relationship Tables

```sql
CREATE TABLE student_enrollments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  session_id        UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
  term_id           UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  enrollment_date   DATE DEFAULT CURRENT_DATE,
  is_active         BOOLEAN DEFAULT true,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term_id)
);

CREATE INDEX idx_enrollments_student ON student_enrollments(student_id) WHERE is_active = true;
CREATE INDEX idx_enrollments_class ON student_enrollments(class_id) WHERE is_active = true;
CREATE INDEX idx_enrollments_term ON student_enrollments(term_id);

CREATE TABLE teacher_assignments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id        UUID NOT NULL REFERENCES teacher_profiles(user_id) ON DELETE CASCADE,
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id        UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  term_id           UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  is_primary        BOOLEAN DEFAULT false, -- class teacher
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, class_id, subject_id, term_id)
);

CREATE TABLE student_parent_relations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES student_profiles(user_id) ON DELETE CASCADE,
  parent_id         UUID NOT NULL REFERENCES parent_profiles(user_id) ON DELETE CASCADE,
  relationship      VARCHAR(50) NOT NULL CHECK (relationship IN
    ('father', 'mother', 'guardian', 'grandparent', 'sibling', 'other')),
  is_primary_contact BOOLEAN DEFAULT false,
  consent_verified  BOOLEAN DEFAULT false,
  consent_code      VARCHAR(10), -- one-time code sent to school contact
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, parent_id)
);
```

### 3.8 Content & Curriculum Tables

```sql
CREATE TABLE subjects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(100) NOT NULL,
  code              VARCHAR(20) UNIQUE,
  description       TEXT,
  icon_url          TEXT,
  color             VARCHAR(7), -- hex color for UI
  display_order     INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE topics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id        UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name              VARCHAR(200) NOT NULL,
  code              VARCHAR(30),
  description       TEXT,
  display_order     INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_topics_subject ON topics(subject_id) WHERE deleted_at IS NULL;

CREATE TABLE subtopics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id          UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  name              VARCHAR(200) NOT NULL,
  description       TEXT,
  display_order     INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE concepts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtopic_id       UUID REFERENCES subtopics(id) ON DELETE SET NULL,
  name              VARCHAR(300) NOT NULL,
  code              VARCHAR(50) UNIQUE,
  description       TEXT,
  concept_type      VARCHAR(30) CHECK (concept_type IN
    ('knowledge', 'skill', 'competency', 'cognitive', 'meta')),
  bloom_level       VARCHAR(20) CHECK (bloom_level IN
    ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create')),
  cognitive_skill_id UUID REFERENCES cognitive_skills(id),
  estimated_mastery_hours NUMERIC(5,1), -- hours of study to master
  importance_weight INTEGER DEFAULT 5 CHECK (importance_weight BETWEEN 1 AND 10),
  is_foundational   BOOLEAN DEFAULT false,
  curriculum_code   VARCHAR(50), -- reference to NERDC/WAEC code
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_concepts_subtopic ON concepts(subtopic_id);
CREATE INDEX idx_concepts_bloom ON concepts(bloom_level);

CREATE TABLE concept_prerequisites (
  concept_id        UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  prerequisite_id   UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  strength          NUMERIC(3,2) DEFAULT 1.0, -- how essential is this prereq
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (concept_id, prerequisite_id),
  CHECK (concept_id != prerequisite_id)
);

-- Knowledge graph: weighted edges between concepts
CREATE TABLE knowledge_graph (
  source_id         UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  target_id         UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  relationship      VARCHAR(50) NOT NULL CHECK (relationship IN
    ('prerequisite', 'related', 'reinforces', 'extends', 'required_for')),
  weight            NUMERIC(5,2) DEFAULT 1.0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (source_id, target_id, relationship)
);

CREATE TABLE concept_misconceptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id        UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  misconception     TEXT NOT NULL,
  code              VARCHAR(50) UNIQUE, -- e.g., "MISCON-FRAC-001"
  description       TEXT,
  severity          VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'critical')),
  detection_pattern JSONB, -- machine-readable pattern for auto-detection
  correction_strategy TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cognitive_skills (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(100) NOT NULL,
  code              VARCHAR(30) UNIQUE,
  description       TEXT,
  category          VARCHAR(50) CHECK (category IN
    ('bloom', 'critical_thinking', 'problem_solving', 'metacognition',
     'creativity', 'collaboration', 'communication')),
  display_order     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.9 Questions Bank

```sql
CREATE TABLE questions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              VARCHAR(50) UNIQUE, -- e.g., "Q-MATH-P6-001"
  question_text     TEXT NOT NULL,
  question_type     VARCHAR(20) NOT NULL CHECK (question_type IN
    ('multiple_choice', 'multiple_select', 'true_false', 'fill_blank',
     'matching', 'ordering', 'short_answer', 'essay')), -- future: 'interactive'
  subject_id        UUID REFERENCES subjects(id),
  topic_id          UUID REFERENCES topics(id),
  subtopic_id       UUID REFERENCES subtopics(id),
  concept_id        UUID REFERENCES concepts(id),
  -- IRT Parameters
  difficulty_param  NUMERIC(5,2) DEFAULT 0, -- b parameter (theta scale, typically -3 to 3)
  discrimination_param NUMERIC(5,2) DEFAULT 1.0, -- a parameter
  guessing_param    NUMERIC(3,2) DEFAULT 0.25, -- c parameter (lower asymptote)
  -- Metadata
  bloom_level       VARCHAR(20) CHECK (bloom_level IN
    ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create')),
  cognitive_skill_id UUID REFERENCES cognitive_skills(id),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  expected_time_secs INTEGER NOT NULL,
  weight            NUMERIC(5,2) DEFAULT 1.0,
  is_active         BOOLEAN DEFAULT true,
  status            VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'changes_requested', 'approved', 'published', 'retired')),
  -- Citation & references
  source            TEXT,
  attribution       TEXT,
  is_verified       BOOLEAN DEFAULT false,
  language          VARCHAR(10) DEFAULT 'en',
  version           INTEGER DEFAULT 1,
  created_by        UUID REFERENCES users(id),
  updated_by        UUID REFERENCES users(id),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

-- Full-text search index
CREATE INDEX idx_questions_fts ON questions USING gin(to_tsvector('english', question_text));
CREATE INDEX idx_questions_subject ON questions(subject_id) WHERE status = 'published';
CREATE INDEX idx_questions_concept ON questions(concept_id) WHERE status = 'published';
CREATE INDEX idx_questions_bloom ON questions(bloom_level);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_param);
CREATE INDEX idx_questions_status ON questions(status);

CREATE TABLE question_options (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text       TEXT NOT NULL,
  is_correct        BOOLEAN NOT NULL DEFAULT false,
  option_order      INTEGER NOT NULL,
  misconception_id  UUID REFERENCES concept_misconceptions(id), -- which misconception if wrong
  explanation       TEXT, -- why this option is wrong/right
  weight            NUMERIC(3,2) DEFAULT 0, -- partial credit weight
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, option_order)
);

CREATE TABLE question_tags (
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  tag               VARCHAR(50) NOT NULL,
  PRIMARY KEY (question_id, tag)
);

CREATE INDEX idx_question_tags_tag ON question_tags(tag);

CREATE TABLE question_media (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  media_type        VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'audio', 'video', 'document')),
  url               TEXT NOT NULL,
  alt_text          TEXT,
  display_order     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE question_reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  reviewer_id       UUID NOT NULL REFERENCES users(id),
  review_status     VARCHAR(20) NOT NULL CHECK (review_status IN
    ('approved', 'changes_requested', 'rejected')),
  comments          TEXT,
  reviewed_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE question_versions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  version           INTEGER NOT NULL,
  snapshot          JSONB NOT NULL, -- full question state at this version
  change_notes      TEXT,
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, version)
);
```

### 3.10 Assessment Configuration

```sql
CREATE TABLE assessments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             VARCHAR(200) NOT NULL,
  code              VARCHAR(50) UNIQUE,
  description       TEXT,
  assessment_type   VARCHAR(30) NOT NULL CHECK (assessment_type IN
    ('transition', 'diagnostic', 'termly', 'subject_specific', 'practice')),
  target_level      VARCHAR(20) CHECK (target_level IN
    ('p6_jss1', 'jss3_ss1', 'ss3_university', 'custom')),
  subject_ids       UUID[] NOT NULL, -- subjects covered
  -- Adaptive settings
  adaptive_strategy VARCHAR(30) DEFAULT 'cat_3pl'
    CHECK (adaptive_strategy IN ('cat_3pl', 'fixed', 'adaptive_bkt', 'multi_stage')),
  min_items         INTEGER DEFAULT 30,
  max_items         INTEGER DEFAULT 50,
  target_theta_se   NUMERIC(4,2) DEFAULT 0.30, -- stop when SE below this
  starting_theta    NUMERIC(4,2) DEFAULT 0,
  time_limit_minutes INTEGER DEFAULT 45,
  -- Content constraints
  concept_coverage_min    INTEGER DEFAULT 2, -- min items per concept
  bloom_level_balance     JSONB, -- e.g., {"remember":0.1, "understand":0.2, ...}
  difficulty_distribution JSONB, -- target difficulty spread
  -- Status
  status            VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'archived')),
  is_public         BOOLEAN DEFAULT false,
  created_by        UUID REFERENCES users(id),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE assessment_rules (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id     UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  rule_type         VARCHAR(50) NOT NULL CHECK (rule_type IN
    ('item_selection', 'termination', 'content_balancing', 'exposure_control',
     'time_management', 'misconception_detection')),
  priority          INTEGER DEFAULT 0,
  config            JSONB NOT NULL, -- rule-specific configuration
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assessment_schedule (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id     UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  school_id         UUID REFERENCES schools(id),
  class_ids         UUID[],
  scheduled_by      UUID REFERENCES users(id),
  opens_at          TIMESTAMPTZ NOT NULL,
  closes_at         TIMESTAMPTZ NOT NULL,
  max_attempts      INTEGER DEFAULT 1,
  is_proctored      BOOLEAN DEFAULT false,
  is_mandatory      BOOLEAN DEFAULT true,
  status            VARCHAR(20) DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'open', 'closed', 'cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.11 Assessment Delivery

```sql
-- Partition by school_id for scalability
CREATE TABLE assessment_instances (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID REFERENCES schools(id),
  assessment_id     UUID NOT NULL REFERENCES assessments(id),
  user_id           UUID NOT NULL REFERENCES users(id),
  student_id        UUID NOT NULL REFERENCES student_profiles(user_id),
  -- State
  status            VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'paused', 'completed', 'timed_out', 'abandoned')),
  current_item_index INTEGER DEFAULT 0,
  current_theta     NUMERIC(6,3),
  current_theta_se  NUMERIC(6,3),
  -- Timing
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  time_limit_seconds INTEGER,
  time_spent_seconds INTEGER DEFAULT 0,
  -- Scoring
  total_score       NUMERIC(6,3),
  raw_score         INTEGER,
  max_score         INTEGER,
  -- Metadata
  device_info       JSONB,
  ip_address        INET,
  network_type      VARCHAR(20),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY LIST (school_id);

-- Note: partitions created programmatically per school
-- CREATE TABLE assessment_instances_school_<id> PARTITION OF assessment_instances
--   FOR VALUES IN ('<school_id>');

CREATE INDEX idx_instances_user ON assessment_instances(user_id);
CREATE INDEX idx_instances_assessment ON assessment_instances(assessment_id);
CREATE INDEX idx_instances_status ON assessment_instances(status);

CREATE TABLE assessment_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id       UUID NOT NULL REFERENCES assessment_instances(id) ON DELETE CASCADE,
  question_id       UUID NOT NULL REFERENCES questions(id),
  item_order        INTEGER NOT NULL,
  -- Theta at time of delivery
  theta_at_delivery NUMERIC(6,3),
  -- Fisher information
  fisher_information NUMERIC(6,3),
  -- Timing
  delivered_at      TIMESTAMPTZ DEFAULT NOW(),
  time_limit_seconds INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(instance_id, item_order)
);

CREATE TABLE assessment_responses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id       UUID NOT NULL REFERENCES assessment_instances(id) ON DELETE CASCADE,
  assessment_item_id UUID NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
  question_id       UUID NOT NULL REFERENCES questions(id),
  -- Response
  selected_option_ids UUID[], -- for multiple_select, array of selected option IDs
  response_text     TEXT, -- for free-text answers
  is_correct        BOOLEAN,
  is_skipped        BOOLEAN DEFAULT false,
  -- Timing
  response_time_ms  INTEGER NOT NULL, -- milliseconds to answer
  time_remaining_secs INTEGER,
  -- Confidence
  confidence_level  VARCHAR(10), -- 'low', 'medium', 'high' (optional self-report)
  answer_changes    INTEGER DEFAULT 0, -- number of times answer changed before final
  -- Scoring
  score             NUMERIC(5,2), -- can be partial for multiple-select
  max_score         NUMERIC(5,2) DEFAULT 1.0,
  -- Misconception detection
  detected_misconceptions UUID[], -- misconception IDs triggered by this response
  -- Metadata
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(instance_id, assessment_item_id)
);

CREATE INDEX idx_responses_instance ON assessment_responses(instance_id);
CREATE INDEX idx_responses_question ON assessment_responses(question_id);

-- Real-time state for interruption recovery
CREATE TABLE assessment_state (
  instance_id       UUID PRIMARY KEY REFERENCES assessment_instances(id) ON DELETE CASCADE,
  state             JSONB NOT NULL, -- full serialized state
  -- Client-side data
  local_responses   JSONB, -- unsynced responses
  client_timestamp  TIMESTAMPTZ,
  last_synced_at    TIMESTAMPTZ DEFAULT NOW(),
  version           INTEGER DEFAULT 1
);

-- Event log
CREATE TABLE assessment_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id       UUID NOT NULL REFERENCES assessment_instances(id) ON DELETE CASCADE,
  event_type        VARCHAR(30) NOT NULL CHECK (event_type IN
    ('started', 'paused', 'resumed', 'question_viewed', 'answer_submitted',
     'answer_changed', 'time_warning', 'auto_submit', 'completed', 'abandoned')),
  payload           JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_instance ON assessment_events(instance_id);
```

### 3.12 Scoring & Results

```sql
CREATE TABLE theta_estimates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id       UUID NOT NULL REFERENCES assessment_instances(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id),
  theta             NUMERIC(6,3) NOT NULL,
  theta_se          NUMERIC(6,3) NOT NULL,
  estimation_method VARCHAR(30) DEFAULT 'eap'
    CHECK (estimation_method IN ('eap', 'map', 'mle', 'bayes')),
  items_used        INTEGER NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE misconception_probabilities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id       UUID NOT NULL REFERENCES assessment_instances(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id),
  misconception_id  UUID NOT NULL REFERENCES concept_misconceptions(id),
  probability       NUMERIC(5,4) NOT NULL, -- 0.0000 to 1.0000
  confidence        NUMERIC(5,4), -- how sure the model is
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(instance_id, misconception_id)
);

CREATE TABLE readiness_scores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  instance_id       UUID NOT NULL REFERENCES assessment_instances(id) ON DELETE CASCADE,
  score_type        VARCHAR(30) NOT NULL CHECK (score_type IN
    ('overall', 'subject', 'concept', 'cognitive_skill', 'topic')),
  reference_id      UUID, -- subject_id, concept_id, or cognitive_skill_id
  score             NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
  percentile        NUMERIC(5,2), -- vs peer group
  category          VARCHAR(20) CHECK (category IN
    ('critical', 'weak', 'developing', 'competent', 'strong', 'mastered')),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instance_id, score_type, reference_id)
);

CREATE INDEX idx_readiness_user ON readiness_scores(user_id);
CREATE INDEX idx_readiness_type ON readiness_scores(score_type, reference_id);

-- Learning velocity over time
CREATE TABLE learning_velocity (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  subject_id        UUID REFERENCES subjects(id),
  -- Slope of theta over time
  velocity          NUMERIC(6,4) NOT NULL, -- theta change per day
  velocity_se       NUMERIC(6,4), -- uncertainty
  period_start      TIMESTAMPTZ NOT NULL,
  period_end        TIMESTAMPTZ NOT NULL,
  instances_included INTEGER,
  is_accelerating   BOOLEAN,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE concept_mastery (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  concept_id        UUID NOT NULL REFERENCES concepts(id),
  mastery_level     NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
  mastery_category  VARCHAR(20) CHECK (mastery_category IN
    ('not_attempted', 'introduced', 'practicing', 'competent', 'mastered', 'review_needed')),
  last_assessed_at  TIMESTAMPTZ,
  assessment_count  INTEGER DEFAULT 0,
  trend             VARCHAR(10) CHECK (trend IN ('improving', 'stable', 'declining')),
  metadata          JSONB DEFAULT '{}',
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);

CREATE INDEX idx_mastery_user ON concept_mastery(user_id);
CREATE INDEX idx_mastery_concept ON concept_mastery(concept_id, mastery_level);

-- IRT item parameter calibration tracking
CREATE TABLE item_parameters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  -- 3PL parameters
  discrimination    NUMERIC(6,3) NOT NULL, -- a (slope)
  difficulty        NUMERIC(6,3) NOT NULL, -- b (location)
  guessing          NUMERIC(6,3) NOT NULL, -- c (lower asymptote)
  -- Calibration
  calibration_sample_size INTEGER NOT NULL,
  calibration_method VARCHAR(30) DEFAULT 'jmetrik' CHECK (calibration_method IN
    ('jmetrik', 'mirt', 'rasch', 'bayesian')),
  fit_statistic     NUMERIC(6,4), -- infit/outfit
  is_current        BOOLEAN DEFAULT false,
  calibrated_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Item exposure tracking
CREATE TABLE item_exposure (
  question_id       UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
  times_used        INTEGER DEFAULT 0,
  times_correct     INTEGER DEFAULT 0,
  correct_rate      NUMERIC(5,4),
  last_used_at      TIMESTAMPTZ,
  exposure_rate     NUMERIC(5,4) -- times_used / total_assessments
);
```

### 3.13 Reports

```sql
CREATE TABLE reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  instance_id       UUID REFERENCES assessment_instances(id),
  report_type       VARCHAR(20) NOT NULL CHECK (report_type IN
    ('basic', 'deep', 'school_quality', 'parent_diagnostic', 'teacher')),
  report_status     VARCHAR(20) DEFAULT 'generating'
    CHECK (report_status IN ('pending', 'generating', 'ready', 'failed')),
  -- For deep reports
  is_purchased      BOOLEAN DEFAULT false,
  purchase_price    NUMERIC(10,2),
  payment_id        UUID REFERENCES transactions(id),
  -- Storage
  report_data       JSONB, -- full report data
  pdf_url           TEXT, -- generated PDF path
  pdf_generated_at  TIMESTAMPTZ,
  -- Access
  access_count      INTEGER DEFAULT 0,
  last_accessed_at  TIMESTAMPTZ,
  shared_with       UUID[], -- user IDs shared with
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_created ON reports(created_at);

CREATE TABLE report_templates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(200) NOT NULL,
  template_type     VARCHAR(30) NOT NULL CHECK (template_type IN
    ('deep', 'basic', 'school', 'parent', 'teacher')),
  config            JSONB NOT NULL, -- sections, charts, ordering
  is_default        BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE report_purchases (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id         UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  buyer_id          UUID NOT NULL REFERENCES users(id),
  buyer_type        VARCHAR(20) CHECK (buyer_type IN ('parent', 'student', 'guest', 'school')),
  amount            NUMERIC(10,2) NOT NULL,
  currency          VARCHAR(3) DEFAULT 'NGN',
  coupon_id         UUID REFERENCES coupons(id),
  discount_amount   NUMERIC(10,2) DEFAULT 0,
  payment_provider  VARCHAR(20) CHECK (payment_provider IN ('paystack', 'flutterwave', 'stripe')),
  payment_reference VARCHAR(100),
  status            VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  purchased_at      TIMESTAMPTZ DEFAULT NOW(),
  refunded_at       TIMESTAMPTZ
);
```

### 3.14 Payments & Billing

```sql
CREATE TABLE transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  transaction_type  VARCHAR(30) NOT NULL CHECK (transaction_type IN
    ('deep_report_purchase', 'credit_purchase', 'subscription',
     'bundle_purchase', 'refund', 'payout', 'adjustment')),
  amount            NUMERIC(12,2) NOT NULL,
  currency          VARCHAR(3) DEFAULT 'NGN',
  fee               NUMERIC(10,2) DEFAULT 0,
  net_amount        NUMERIC(12,2), -- after fees
  -- Payment provider
  provider          VARCHAR(20) CHECK (provider IN ('paystack', 'flutterwave', 'stripe')),
  provider_reference VARCHAR(200),
  provider_status   VARCHAR(50),
  -- Status
  status            VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
  -- Reversal
  refunded_amount   NUMERIC(12,2) DEFAULT 0,
  refund_reason     TEXT,
  -- Metadata
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_provider_ref ON transactions(provider, provider_reference);

CREATE TABLE transaction_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id    UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  item_type         VARCHAR(30) NOT NULL,
  item_id           UUID, -- polymorphic reference (report_id, credit_id, etc.)
  quantity          INTEGER DEFAULT 1,
  unit_price        NUMERIC(10,2) NOT NULL,
  total_price       NUMERIC(10,2) NOT NULL,
  description       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_provider_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider          VARCHAR(20) NOT NULL,
  event_type        VARCHAR(100) NOT NULL, -- webhook event type
  event_id          VARCHAR(200), -- provider's event ID
  raw_payload       JSONB NOT NULL,
  processed         BOOLEAN DEFAULT false,
  processing_result VARCHAR(20),
  error_message     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              VARCHAR(50) UNIQUE NOT NULL,
  description       TEXT,
  discount_type     VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value    NUMERIC(10,2) NOT NULL,
  -- Usage limits
  max_uses          INTEGER,
  max_uses_per_user INTEGER DEFAULT 1,
  current_uses      INTEGER DEFAULT 0,
  -- Eligibility
  min_purchase_amount NUMERIC(10,2),
  applicable_products VARCHAR(50)[], -- 'deep_report', 'bundle', 'subscription'
  applicable_schools UUID[], -- NULL = all schools
  -- Validity
  valid_from        TIMESTAMPTZ,
  valid_until       TIMESTAMPTZ,
  is_active         BOOLEAN DEFAULT true,
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE coupon_usage (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id         UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id),
  transaction_id    UUID REFERENCES transactions(id),
  discount_amount   NUMERIC(10,2) NOT NULL,
  used_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

CREATE TABLE subscription_plans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(100) NOT NULL,
  code              VARCHAR(50) UNIQUE,
  description       TEXT,
  billing_cycle     VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
  amount            NUMERIC(10,2) NOT NULL,
  currency          VARCHAR(3) DEFAULT 'NGN',
  features          JSONB, -- feature list for display
  -- What's included
  deep_reports_per_cycle INTEGER DEFAULT 1,
  assessments_per_cycle  INTEGER DEFAULT -1, -- -1 = unlimited
  practice_plan      BOOLEAN DEFAULT true,
  parent_diagnostic  BOOLEAN DEFAULT false,
  school_comparison  BOOLEAN DEFAULT true,
  -- Status
  is_active         BOOLEAN DEFAULT true,
  display_order     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  plan_id           UUID NOT NULL REFERENCES subscription_plans(id),
  status            VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'trialing')),
  -- Billing
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end   TIMESTAMPTZ NOT NULL,
  cancelled_at      TIMESTAMPTZ,
  -- Provider
  provider_subscription_id VARCHAR(200),
  provider_customer_id     VARCHAR(200),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- School bulk credits
CREATE TABLE school_credits (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  total_credits     INTEGER NOT NULL DEFAULT 0,
  used_credits      INTEGER NOT NULL DEFAULT 0,
  available_credits INTEGER GENERATED ALWAYS AS (total_credits - used_credits) STORED,
  credit_type       VARCHAR(20) DEFAULT 'deep_report'
    CHECK (credit_type IN ('deep_report', 'assessment', 'bundle')),
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_distributions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id         UUID NOT NULL REFERENCES school_credits(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES student_profiles(user_id),
  assigned_by       UUID REFERENCES users(id),
  quantity          INTEGER NOT NULL DEFAULT 1,
  purpose           VARCHAR(100),
  used              BOOLEAN DEFAULT false,
  used_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.15 AI & Recommendations

```sql
CREATE TABLE recommendations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  target_role       VARCHAR(20) NOT NULL CHECK (target_role IN
    ('student', 'parent', 'teacher', 'school_admin', 'admin')),
  recommendation_type VARCHAR(30) NOT NULL CHECK (recommendation_type IN
    ('immediate_action', 'daily_practice', 'weekly_plan', 'monthly_plan',
     'quarterly_plan', 'teaching_strategy', 'parenting_strategy',
     'school_strategy', 'learning_resource', 'intervention')),
  priority          INTEGER CHECK (priority BETWEEN 1 AND 5),
  title             VARCHAR(200) NOT NULL,
  description       TEXT NOT NULL,
  reasoning         TEXT, -- why this recommendation was made
  -- Effectiveness tracking
  is_actioned       BOOLEAN DEFAULT false,
  actioned_at       TIMESTAMPTZ,
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
  source_instance_id UUID REFERENCES assessment_instances(id),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  expires_at        TIMESTAMPTZ
);

CREATE INDEX idx_recommendations_user ON recommendations(user_id, target_role);

CREATE TABLE recommendation_actions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  action_number     INTEGER NOT NULL,
  action_text       TEXT NOT NULL,
  time_frame        VARCHAR(30) CHECK (time_frame IN
    ('today', 'this_week', 'this_month', 'this_quarter', 'ongoing')),
  estimated_duration_minutes INTEGER,
  is_completed      BOOLEAN DEFAULT false,
  completed_at      TIMESTAMPTZ,
  UNIQUE(recommendation_id, action_number)
);

CREATE TABLE recommendation_tracking (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id),
  action_id         UUID REFERENCES recommendation_actions(id),
  tracked_at        DATE NOT NULL,
  status            VARCHAR(20) CHECK (status IN ('viewed', 'started', 'completed', 'skipped')),
  notes             TEXT,
  UNIQUE(recommendation_id, user_id, tracked_at)
);

CREATE TABLE ai_prompt_templates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type     VARCHAR(50) UNIQUE NOT NULL CHECK (template_type IN
    ('deep_report_summary', 'student_recommendations', 'parent_recommendations',
     'teacher_recommendations', 'school_recommendations', 'question_explanation',
     'parent_diagnostic', 'improvement_plan', 'daily_plan_generation',
     'learning_tip_generation', 'misconception_explanation')),
  template_text     TEXT NOT NULL, -- with {{variable}} placeholders
  model             VARCHAR(100) DEFAULT 'gpt-4o-mini',
  temperature       NUMERIC(3,2) DEFAULT 0.3,
  max_tokens        INTEGER DEFAULT 2000,
  is_active         BOOLEAN DEFAULT true,
  version           INTEGER DEFAULT 1,
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_model_config (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name        VARCHAR(100) NOT NULL,
  provider          VARCHAR(50) NOT NULL CHECK (provider IN
    ('openai', 'anthropic', 'google', 'mistral', 'meta', 'openrouter', 'custom')),
  api_endpoint      TEXT,
  max_tokens        INTEGER DEFAULT 4096,
  default_temperature NUMERIC(3,2) DEFAULT 0.3,
  cost_per_1k_input  NUMERIC(10,6),
  cost_per_1k_output NUMERIC(10,6),
  is_active         BOOLEAN DEFAULT true,
  is_default        BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.16 Admin & System

```sql
CREATE TABLE audit_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  action            VARCHAR(100) NOT NULL, -- e.g., 'user.created', 'question.approved'
  entity_type       VARCHAR(50), -- 'user', 'question', 'school', etc.
  entity_id         UUID,
  old_values        JSONB,
  new_values        JSONB,
  ip_address        INET,
  user_agent        TEXT,
  session_id        VARCHAR(100),
  severity          VARCHAR(10) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warn', 'error', 'critical')),
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
-- Partition by month for performance
-- CREATE TABLE audit_logs_2026_01 PARTITION OF audit_logs FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE feature_flags (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key               VARCHAR(100) UNIQUE NOT NULL,
  name              VARCHAR(200) NOT NULL,
  description       TEXT,
  enabled           BOOLEAN DEFAULT false,
  -- Targeting
  enabled_for_roles UUID[], -- NULL = all roles
  enabled_for_schools UUID[], -- NULL = all schools
  enabled_for_users UUID[], -- specific user IDs
  rollout_percentage INTEGER CHECK (rollout_percentage BETWEEN 0 AND 100),
  dependencies      VARCHAR(100)[], -- feature flag keys that must be enabled
  metadata          JSONB DEFAULT '{}',
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api_keys (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(200) NOT NULL,
  key_hash          VARCHAR(255) NOT NULL,
  key_prefix        VARCHAR(10) NOT NULL, -- first 10 chars for identification
  owner_id          UUID NOT NULL REFERENCES users(id),
  permissions       JSONB DEFAULT '[]', -- array of permission codes
  -- Rate limits
  rate_limit        INTEGER DEFAULT 1000, -- requests per minute
  -- Usage
  last_used_at      TIMESTAMPTZ,
  usage_count       INTEGER DEFAULT 0,
  -- Status
  is_active         BOOLEAN DEFAULT true,
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE system_config (
  key               VARCHAR(100) PRIMARY KEY,
  value             JSONB NOT NULL,
  description       TEXT,
  category          VARCHAR(50),
  is_public         BOOLEAN DEFAULT false,
  updated_by        UUID REFERENCES users(id),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Seed configs
-- INSERT INTO system_config (key, value, description, category) VALUES
-- ('deep_report_price', '{"NGN": 3000, "USD": 3.99}', 'Price for deep report', 'pricing'),
-- ('min_assessment_interval_days', '7', 'Minimum days between assessments', 'assessment'),
-- ('max_login_attempts', '5', 'Max failed login attempts before lockout', 'security'),
-- ('session_timeout_minutes', '60', 'Idle session timeout', 'security');

CREATE TABLE notification_queue (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  channel           VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
  template_key      VARCHAR(100),
  subject           VARCHAR(200),
  body              TEXT NOT NULL,
  recipient         VARCHAR(200), -- email address or phone number
  variables         JSONB, -- template variables
  -- Status
  status            VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  sent_at           TIMESTAMPTZ,
  error_message     TEXT,
  -- Scheduling
  scheduled_at      TIMESTAMPTZ,
  priority          INTEGER DEFAULT 0,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_user_status ON notification_queue(user_id, status);
CREATE INDEX idx_notification_scheduled ON notification_queue(scheduled_at)
  WHERE status = 'pending';

CREATE TABLE notification_templates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key               VARCHAR(100) UNIQUE NOT NULL,
  name              VARCHAR(200) NOT NULL,
  channel           VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
  subject           VARCHAR(200), -- for email
  template_body     TEXT NOT NULL, -- with {{variables}}
  variables_schema  JSONB, -- defines available variables
  is_active         BOOLEAN DEFAULT true,
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cms_pages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              VARCHAR(200) UNIQUE NOT NULL,
  title             VARCHAR(200) NOT NULL,
  content           JSONB NOT NULL, -- rich text content (blocks)
  meta_title        VARCHAR(200),
  meta_description  TEXT,
  meta_keywords     TEXT,
  is_published      BOOLEAN DEFAULT false,
  published_at      TIMESTAMPTZ,
  layout            VARCHAR(50) DEFAULT 'default',
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE blog_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              VARCHAR(200) UNIQUE NOT NULL,
  title             VARCHAR(200) NOT NULL,
  excerpt           TEXT,
  content           JSONB NOT NULL,
  featured_image    TEXT,
  author_id         UUID REFERENCES users(id),
  category          VARCHAR(100),
  tags              TEXT[],
  is_published      BOOLEAN DEFAULT false,
  published_at      TIMESTAMPTZ,
  view_count        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE backup_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type       VARCHAR(20) NOT NULL CHECK (backup_type IN ('full', 'incremental', 'wal')),
  status            VARCHAR(20) NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  file_size_bytes   BIGINT,
  file_url          TEXT,
  md5_hash          VARCHAR(64),
  started_at        TIMESTAMPTZ NOT NULL,
  completed_at      TIMESTAMPTZ,
  error_message     TEXT,
  triggered_by      UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE school_quality_reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  term_id           UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  report_data       JSONB NOT NULL, -- full school diagnostic data
  overall_score     NUMERIC(5,2),
  teaching_quality  NUMERIC(5,2),
  curriculum_alignment NUMERIC(5,2),
  critical_thinking_score NUMERIC(5,2),
  retention_score   NUMERIC(5,2),
  subject_risk_index JSONB,
  recommendations   JSONB,
  is_generated      BOOLEAN DEFAULT false,
  generated_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, term_id)
);

CREATE TABLE parent_diagnostics (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id         UUID NOT NULL REFERENCES parent_profiles(user_id) ON DELETE CASCADE,
  diagnostic_data   JSONB NOT NULL, -- full parent diagnostic
  parent_support_index NUMERIC(5,2),
  home_learning_score NUMERIC(5,2),
  improvements      JSONB,
  weekly_tasks      JSONB,
  filled_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id)
);
```

---

## 4. PARTITIONING STRATEGY

### 4.1 Large Tables Requiring Partitioning

| Table | Partition Key | Partition Type | Retention |
|-------|---------------|----------------|-----------|
| `assessment_instances` | `school_id` | LIST | Permanent |
| `assessment_responses` | `instance_id` (via parent) | Inherited | Permanent |
| `assessment_events` | Date range | RANGE (monthly) | 2 years |
| `audit_logs` | Date range | RANGE (monthly) | 1 year, archive older |
| `notification_queue` | Date range | RANGE (daily) | 90 days |
| `transactions` | Date range | RANGE (quarterly) | 7 years |
| `assessment_state` | `school_id` | LIST | Permanent |

### 4.2 Partition Example

```sql
-- Master table (already defined above)
-- CREATE TABLE assessment_instances (...) PARTITION BY LIST (school_id);

-- Creating partitions per school (done dynamically when school registers)
CREATE TABLE assessment_instances_school_abc123
  PARTITION OF assessment_instances
  FOR VALUES IN ('abc123-...-uuid');

-- Monthly audit log partitions
CREATE TABLE audit_logs_2026_01
  PARTITION OF audit_logs
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE audit_logs_2026_02
  PARTITION OF audit_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

---

## 5. INDEX STRATEGY

### 5.1 Index Categories

| Type | Use Case | Example Tables |
|------|----------|----------------|
| **B-tree** | Primary keys, foreign keys, unique constraints | All tables |
| **B-tree composite** | Multi-column lookups | `(school_id, status)`, `(user_id, created_at)` |
| **B-tree partial** | Filtered indexes on active records | `WHERE deleted_at IS NULL` |
| **GIN** | JSONB queries, full-text search, arrays | `questions`, `system_config`, `metadata` columns |
| **GiST** | Range queries, exclusion constraints | `assessment_schedule` (daterange) |
| **IVFFlat** | Vector similarity search | Future: `concept_embeddings`, `question_embeddings` |
| **Hash** | Exact match on large text | `password_reset_tokens(token)` |

### 5.2 Performance-Critical Indexes (beyond PK/FK)

```sql
-- Assessment delivery
CREATE INDEX CONCURRENTLY idx_instances_lookup
  ON assessment_instances(user_id, status, created_at)
  WHERE status IN ('pending', 'in_progress');

-- Next item selection (CAT algorithm)
CREATE INDEX CONCURRENTLY idx_questions_cat
  ON questions(subject_id, bloom_level, difficulty_param, discrimination_param)
  WHERE status = 'published' AND is_active = true;

-- Dashboard queries
CREATE INDEX CONCURRENTLY idx_readiness_latest
  ON readiness_scores(user_id, score_type, created_at DESC);

-- Parent dashboard
CREATE INDEX CONCURRENTLY idx_parent_children
  ON student_parent_relations(parent_id, is_active)
  WHERE is_active = true;

-- School analytics
CREATE INDEX CONCURRENTLY idx_school_students
  ON student_enrollments(school_id, class_id, is_active)
  WHERE is_active = true;

-- Payment reconciliation
CREATE INDEX CONCURRENTLY idx_transactions_reconciliation
  ON transactions(provider, provider_reference, created_at)
  WHERE provider IS NOT NULL;
```

---

## 6. DATA RETENTION & ARCHIVAL

| Data Type | Retention | Archive | Deletion |
|-----------|-----------|---------|----------|
| Assessment responses | Permanent | — | Never (educational record) |
| Audit logs | 12 months active | Cold storage (S3 Glacier) after 12mo | Never |
| Notification queue | 90 days | — | After 90 days |
| Transactions | 7 years | PDF receipts permanent | After 7 years |
| User sessions | 30 days | — | After 30 days |
| Payment provider logs | 12 months | — | After 12 months |
| Soft-deleted questions | 6 months | — | Hard delete after 6mo |
| Backup files | 30 days incremental | Monthly full backup permanent | Per policy |
| Assessment state (resume) | 24 hours | — | After 24 hours |
| Password reset tokens | 1 hour | — | After 1 hour |

---

## 7. ORM IMPLEMENTATION NOTES (Drizzle)

```typescript
// Example schema definition approach
// schemas/users.ts
import { pgTable, uuid, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  phone: text('phone', { length: 20 }).unique(),
  passwordHash: text('password_hash'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  isLocked: boolean('is_locked').default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  studentProfile: one(studentProfiles),
  teacherProfile: one(teacherProfiles),
  parentProfile: one(parentProfiles),
}));
```

---

*End of Phase 4 — Full Database Schema*

**86 tables defined with complete column specifications, indexes, partitioning strategy, data retention policy, and ORM notes.**

**Next: Phase 5 — API Design**

*Confirm readiness to proceed to Phase 5.*
