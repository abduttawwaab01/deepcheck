# DEEP CHECK — Software Requirements Specification

## Phase 5: API Design

---

## 1. API PHILOSOPHY

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Protocol** | tRPC v11 | Type-safe, zero-code-gen, auto-completion on frontend, batchable |
| **Public REST** | Next.js Route Handlers | For webhooks, public data, third-party integrations |
| **Real-time** | WebSocket (via `server-socket.io` or native WebSocket) | Assessment live monitoring, notifications |
| **Auth** | NextAuth v5 (Auth.js) sessions + JWT | Stateless for API, session for SSR |
| **Rate Limiting** | Upstash Ratelimit | Serverless-compatible, sliding window |
| **Validation** | Zod | Shared types between frontend and backend via tRPC |
| **Documentation** | Swagger/OpenAPI (for REST) + tRPC auto-docs | Dual coverage |

### 1.1 API Architecture

```
                   ┌──────────────────────┐
                   │    Client (Next.js)   │
                   │  tRPC Client + React  │
                   └──────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │  tRPC Router  │ │  REST Routes │ │ WebSocket    │
     │  /api/trpc/** │ │  /api/**     │ │  /ws         │
     └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Next.js App Dir │
                    │  Server Actions  │
                    │  (mutations)     │
                    └──────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Drizzle ORM    │
                    │   + Neon (PG)    │
                    └──────────────────┘
```

### 1.2 Naming Conventions

| Convention | Standard | Example |
|-----------|----------|---------|
| **tRPC Procedures** | camelCase | `getUser`, `createAssessment` |
| **REST Endpoints** | kebab-case plural | `/api/v1/schools`, `/api/v1/assessment-instances` |
| **Query Parameters** | camelCase | `?pageSize=10&sortBy=createdAt` |
| **Request Body** | camelCase JSON | `{ "firstName": "John" }` |
| **Response Envelope** | Consistent | `{ "data": ..., "meta": ..., "error": ... }` |
| **Error Codes** | UPPER_SNAKE | `UNAUTHORIZED`, `VALIDATION_ERROR` |

### 1.3 Response Envelope (REST)

```typescript
// Success
{
  "status": "success",
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 50,
    "total": 1234,
    "totalPages": 25
  }
}

// Error
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## 2. tRPC ROUTER STRUCTURE

```typescript
// Root router
export const appRouter = router({
  // Public procedures (no auth)
  public: publicRouter,
  
  // Authenticated procedures
  auth: authRouter,
  
  // Admin-only procedures
  admin: adminRouter,
  
  // School procedures
  school: schoolRouter,
  
  // Teacher procedures
  teacher: teacherRouter,
  
  // Student procedures
  student: studentRouter,
  
  // Parent procedures
  parent: parentRouter,
  
  // Assessment procedures
  assessment: assessmentRouter,
  
  // Report procedures
  report: reportRouter,
  
  // Payment procedures
  payment: paymentRouter,
  
  // AI/Recommendation procedures
  ai: aiRouter,
  
  // Notification procedures
  notification: notificationRouter,
  
  // Content management procedures
  content: contentRouter,
});

export type AppRouter = typeof appRouter;
```

### 2.1 Middleware Chain

```typescript
// Procedure resolution order:
// 1. rateLimit (global)
// 2. auditLog (configurable per procedure)
// 3. authenticate (verifies JWT/session)
// 4. authorize (checks permissions)
// 5. validate (Zod schema)
// 6. resolve (business logic)
// 7. cache (optional, Upstash Redis)
```

---

## 3. COMPLETE PROCEDURE INVENTORY

### 3.1 Public Router (`public.*`)

| Procedure | Method | Input | Output | Auth |
|-----------|--------|-------|--------|------|
| `public.landing.stats` | QUERY | — | `LandingStats` | None |
| `public.landing.testimonials` | QUERY | `{ page?: number }` | `Testimonial[]` | None |
| `public.landing.faq` | QUERY | — | `FAQ[]` | None |
| `public.landing.pricing` | QUERY | — | `PricingPlan[]` | None |
| `public.blog.list` | QUERY | `{ page, category?, tag? }` | `Paginated<BlogPost>` | None |
| `public.blog.getBySlug` | QUERY | `{ slug: string }` | `BlogPost` | None |
| `public.schools.search` | QUERY | `{ query: string }` | `SchoolBasic[]` | None |
| `public.auth.register` | MUTATION | `RegisterInput` | `AuthResult` | None |
| `public.auth.login` | MUTATION | `LoginInput` | `AuthResult` | None |
| `public.auth.verifyEmail` | MUTATION | `{ token: string }` | `{ verified: boolean }` | None |
| `public.auth.verifyPhone` | MUTATION | `{ otp: string }` | `{ verified: boolean }` | None |
| `public.auth.forgotPassword` | MUTATION | `{ email: string }` | `{ sent: boolean }` | None |
| `public.auth.resetPassword` | MUTATION | `{ token, password }` | `{ success: boolean }` | None |
| `public.auth.sendOtp` | MUTATION | `{ phone: string }` | `{ sent: boolean }` | None |
| `public.demo.request` | MUTATION | `DemoRequestInput` | `{ submitted: boolean }` | None |
| `public.contact.submit` | MUTATION | `ContactInput` | `{ submitted: boolean }` | None |
| `public.partners.apply` | MUTATION | `PartnerInput` | `{ submitted: boolean }` | None |

### 3.2 Auth Router (`auth.*`)

| Procedure | Method | Input | Output | Auth |
|-----------|--------|-------|--------|------|
| `auth.me` | QUERY | — | `UserProfile` | Required |
| `auth.updateProfile` | MUTATION | `UpdateProfileInput` | `UserProfile` | Required |
| `auth.changePassword` | MUTATION | `{ currentPassword, newPassword }` | `{ success: boolean }` | Required |
| `auth.updateAvatar` | MUTATION | `{ url: string }` | `{ url: string }` | Required |
| `auth.deleteAccount` | MUTATION | `{ password: string }` | `{ deleted: boolean }` | Required |
| `auth.sessions.list` | QUERY | — | `Session[]` | Required |
| `auth.sessions.revoke` | MUTATION | `{ sessionId: string }` | `{ revoked: boolean }` | Required |
| `auth.sessions.revokeAll` | MUTATION | — | `{ revoked: number }` | Required |
| `auth.notificationPreferences` | QUERY | — | `NotificationPrefs` | Required |
| `auth.updateNotificationPrefs` | MUTATION | `NotificationPrefs` | `NotificationPrefs` | Required |

### 3.3 Admin Router (`admin.*`)

#### 3.3.1 Dashboard

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.dashboard.stats` | QUERY | — | `AdminDashboardStats` |
| `admin.dashboard.userGrowth` | QUERY | `{ days?: number }` | `TimeSeriesData[]` |
| `admin.dashboard.revenue` | QUERY | `{ period?: 'day'|'week'|'month'|'year' }` | `RevenueData` |
| `admin.dashboard.systemHealth` | QUERY | — | `SystemHealth` |

#### 3.3.2 User Management

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.users.list` | QUERY | `UserListInput` | `Paginated<UserProfile>` |
| `admin.users.get` | QUERY | `{ id: string }` | `UserFullProfile` |
| `admin.users.create` | MUTATION | `CreateUserInput` | `UserProfile` |
| `admin.users.update` | MUTATION | `{ id, ...update }` | `UserProfile` |
| `admin.users.delete` | MUTATION | `{ id: string }` | `{ deleted: boolean }` |
| `admin.users.lock` | MUTATION | `{ id, reason }` | `UserProfile` |
| `admin.users.unlock` | MUTATION | `{ id: string }` | `UserProfile` |
| `admin.users.impersonate` | MUTATION | `{ id: string }` | `{ sessionToken: string }` |
| `admin.users.bulkCreate` | MUTATION | `{ users: CreateUserInput[] }` | `BulkCreateResult` |
| `admin.users.export` | MUTATION | `UserListInput` | `{ downloadUrl: string }` |

#### 3.3.3 School Management

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.schools.list` | QUERY | `SchoolListInput` | `Paginated<SchoolProfile>` |
| `admin.schools.get` | QUERY | `{ id: string }` | `SchoolFullProfile` |
| `admin.schools.create` | MUTATION | `CreateSchoolInput` | `SchoolProfile` |
| `admin.schools.update` | MUTATION | `{ id, ...update }` | `SchoolProfile` |
| `admin.schools.delete` | MUTATION | `{ id: string }` | `{ deleted: boolean }` |
| `admin.schools.verify` | MUTATION | `{ id, status, notes? }` | `SchoolProfile` |
| `admin.schools.suspend` | MUTATION | `{ id, reason }` | `SchoolProfile` |
| `admin.schools.billing` | QUERY | `{ id: string }` | `SchoolBillingInfo` |

#### 3.3.4 Question Management

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.questions.list` | QUERY | `QuestionListInput` | `Paginated<QuestionDetail>` |
| `admin.questions.get` | QUERY | `{ id: string }` | `QuestionFullDetail` |
| `admin.questions.create` | MUTATION | `CreateQuestionInput` | `QuestionDetail` |
| `admin.questions.update` | MUTATION | `{ id, ...update }` | `QuestionDetail` |
| `admin.questions.delete` | MUTATION | `{ id: string }` | `{ deleted: boolean }` |
| `admin.questions.submitReview` | MUTATION | `{ id, status, comments? }` | `QuestionDetail` |
| `admin.questions.bulkImport` | MUTATION | `{ format: 'csv'|'json', data: string }` | `BulkImportResult` |
| `admin.questions.bulkExport` | MUTATION | `QuestionListInput` | `{ downloadUrl: string }` |
| `admin.questions.versions` | QUERY | `{ id: string }` | `QuestionVersion[]` |
| `admin.questions.calibrate` | MUTATION | `{ questionIds: string[] }` | `CalibrationResult` |

#### 3.3.5 Content Management

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.subjects.list` | QUERY | — | `Subject[]` |
| `admin.subjects.create` | MUTATION | `CreateSubjectInput` | `Subject` |
| `admin.subjects.update` | MUTATION | `{ id, ...update }` | `Subject` |
| `admin.topics.list` | QUERY | `{ subjectId }` | `Topic[]` |
| `admin.topics.create` | MUTATION | `CreateTopicInput` | `Topic` |
| `admin.concepts.list` | QUERY | `{ topicId? }` | `Concept[]` |
| `admin.concepts.create` | MUTATION | `CreateConceptInput` | `Concept` |
| `admin.concepts.update` | MUTATION | `{ id, ...update }` | `Concept` |
| `admin.concepts.linkPrerequisite` | MUTATION | `{ conceptId, prerequisiteId, strength }` | `Success` |
| `admin.misconceptions.list` | QUERY | `{ conceptId? }` | `Misconception[]` |
| `admin.misconceptions.create` | MUTATION | `CreateMisconceptionInput` | `Misconception` |

#### 3.3.6 Payment & Pricing

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.payments.transactions` | QUERY | `TransactionListInput` | `Paginated<Transaction>` |
| `admin.payments.getTransaction` | QUERY | `{ id: string }` | `TransactionDetail` |
| `admin.payments.refund` | MUTATION | `{ id, amount?, reason }` | `Transaction` |
| `admin.payments.pricing` | QUERY | — | `PricingConfig` |
| `admin.payments.updatePricing` | MUTATION | `PricingConfig` | `PricingConfig` |
| `admin.payments.coupons.list` | QUERY | — | `Coupon[]` |
| `admin.payments.coupons.create` | MUTATION | `CreateCouponInput` | `Coupon` |
| `admin.payments.coupons.update` | MUTATION | `{ id, ...update }` | `Coupon` |
| `admin.payments.coupons.delete` | MUTATION | `{ id: string }` | `{ deleted: boolean }` |
| `admin.payments.subscriptions.list` | QUERY | — | `Paginated<Subscription>` |
| `admin.payments.plans.list` | QUERY | — | `SubscriptionPlan[]` |
| `admin.payments.plans.create` | MUTATION | `CreatePlanInput` | `SubscriptionPlan` |
| `admin.payments.plans.update` | MUTATION | `{ id, ...update }` | `SubscriptionPlan` |

#### 3.3.7 System & Settings

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.system.config` | QUERY | `{ key?: string }` | `SystemConfig[]` |
| `admin.system.updateConfig` | MUTATION | `{ key, value }` | `SystemConfig` |
| `admin.system.featureFlags` | QUERY | — | `FeatureFlag[]` |
| `admin.system.createFeatureFlag` | MUTATION | `CreateFeatureFlagInput` | `FeatureFlag` |
| `admin.system.toggleFeature` | MUTATION | `{ key, enabled }` | `FeatureFlag` |
| `admin.system.apiKeys.list` | QUERY | — | `ApiKey[]` |
| `admin.system.apiKeys.create` | MUTATION | `CreateApiKeyInput` | `ApiKeyWithSecret` |
| `admin.system.apiKeys.revoke` | MUTATION | `{ id: string }` | `{ revoked: boolean }` |
| `admin.system.auditLogs` | QUERY | `AuditLogInput` | `Paginated<AuditLogEntry>` |
| `admin.system.backup.create` | MUTATION | `{ type: 'full'|'incremental' }` | `BackupResult` |
| `admin.system.backup.restore` | MUTATION | `{ backupId: string }` | `BackupResult` |
| `admin.system.backup.list` | QUERY | — | `BackupLog[]` |

#### 3.3.8 AI Management

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.ai.prompts.list` | QUERY | — | `AiPromptTemplate[]` |
| `admin.ai.prompts.update` | MUTATION | `{ type, template }` | `AiPromptTemplate` |
| `admin.ai.models.list` | QUERY | — | `AiModelConfig[]` |
| `admin.ai.models.setDefault` | MUTATION | `{ modelName: string }` | `AiModelConfig` |
| `admin.ai.models.update` | MUTATION | `{ modelName, ...config }` | `AiModelConfig` |
| `admin.ai.effectiveness` | QUERY | `{ period? }` | `AiEffectivenessReport` |

#### 3.3.9 CMS & Appearance

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `admin.cms.pages.list` | QUERY | — | `CmsPage[]` |
| `admin.cms.pages.get` | QUERY | `{ slug: string }` | `CmsPageDetail` |
| `admin.cms.pages.update` | MUTATION | `{ slug, ...content }` | `CmsPage` |
| `admin.cms.blog.list` | QUERY | `BlogListInput` | `Paginated<BlogPost>` |
| `admin.cms.blog.create` | MUTATION | `CreateBlogPostInput` | `BlogPost` |
| `admin.cms.blog.update` | MUTATION | `{ id, ...update }` | `BlogPost` |
| `admin.cms.blog.delete` | MUTATION | `{ id: string }` | `{ deleted: boolean }` |
| `admin.appearance.themes.list` | QUERY | — | `Theme[]` |
| `admin.appearance.themes.setActive` | MUTATION | `{ id: string }` | `{ success: boolean }` |
| `admin.appearance.branding` | QUERY | — | `BrandingConfig` |
| `admin.appearance.updateBranding` | MUTATION | `BrandingConfig` | `BrandingConfig` |

### 3.4 School Router (`school.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `school.dashboard.stats` | QUERY | `{ termId? }` | `SchoolDashboardStats` |
| `school.dashboard.charts` | QUERY | `{ termId? }` | `SchoolCharts` |
| `school.profile.get` | QUERY | — | `SchoolProfile` |
| `school.profile.update` | MUTATION | `UpdateSchoolInput` | `SchoolProfile` |
| `school.classes.list` | QUERY | `{ termId? }` | `Class[]` |
| `school.classes.create` | MUTATION | `CreateClassInput` | `Class` |
| `school.classes.update` | MUTATION | `{ id, ...update }` | `Class` |
| `school.classes.delete` | MUTATION | `{ id: string }` | `{ deleted: boolean }` |
| `school.classes.get` | QUERY | `{ id: string }` | `ClassDetail` |
| `school.classes.analytics` | QUERY | `{ id, termId? }` | `ClassAnalytics` |
| `school.students.list` | QUERY | `StudentListInput` | `Paginated<StudentProfile>` |
| `school.students.get` | QUERY | `{ id: string }` | `StudentFullProfile` |
| `school.students.create` | MUTATION | `CreateStudentInput` | `StudentProfile` |
| `school.students.bulkCreate` | MUTATION | `{ students: CreateStudentInput[], classId }` | `BulkCreateResult` |
| `school.students.update` | MUTATION | `{ id, ...update }` | `StudentProfile` |
| `school.students.moveClass` | MUTATION | `{ id, newClassId }` | `StudentProfile` |
| `school.teachers.list` | QUERY | — | `TeacherProfile[]` |
| `school.teachers.get` | QUERY | `{ id: string }` | `TeacherFullProfile` |
| `school.teachers.create` | MUTATION | `CreateTeacherInput` | `TeacherProfile` |
| `school.teachers.assign` | MUTATION | `{ teacherId, classId, subjectId }` | `Assignment` |
| `school.teachers.analytics` | QUERY | `{ id, termId? }` | `TeacherAnalytics` |
| `school.sessions.list` | QUERY | — | `AcademicSession[]` |
| `school.sessions.create` | MUTATION | `CreateSessionInput` | `AcademicSession` |
| `school.sessions.setCurrent` | MUTATION | `{ id: string }` | `AcademicSession` |
| `school.terms.list` | QUERY | `{ sessionId }` | `Term[]` |
| `school.terms.create` | MUTATION | `CreateTermInput` | `Term` |
| `school.terms.setCurrent` | MUTATION | `{ id: string }` | `Term` |
| `school.assessments.schedule` | QUERY | — | `ScheduledAssessment[]` |
| `school.assessments.create` | MUTATION | `ScheduleAssessmentInput` | `ScheduledAssessment` |
| `school.assessments.results` | QUERY | `{ assessmentId, classId? }` | `AssessmentResults` |
| `school.assessments.liveMonitor` | QUERY | `{ assessmentId }` | `LiveMonitorData` |
| `school.analytics.classComparison` | QUERY | `{ termId? }` | `ClassComparisonData` |
| `school.analytics.subjectAnalysis` | QUERY | `{ termId? }` | `SubjectAnalysisData` |
| `school.analytics.genderAnalysis` | QUERY | `{ termId? }` | `GenderAnalysisData` |
| `school.analytics.teacherTrends` | QUERY | `{ termId? }` | `TeacherTrendsData` |
| `school.report.generate` | MUTATION | — | `{ reportId: string }` |
| `school.report.get` | QUERY | — | `SchoolQualityReport` |
| `school.report.download` | QUERY | — | `{ downloadUrl: string }` |
| `school.billing.credits` | QUERY | — | `SchoolCredits` |
| `school.billing.purchase` | MUTATION | `{ quantity: number }` | `CheckoutUrl` |
| `school.billing.distribute` | MUTATION | `{ studentIds, quantity }` | `DistributionResult` |
| `school.billing.invoices` | QUERY | — | `Invoice[]` |

### 3.5 Teacher Router (`teacher.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `teacher.dashboard.stats` | QUERY | — | `TeacherDashboardStats` |
| `teacher.students.list` | QUERY | `ClassListInput` | `StudentProfile[]` |
| `teacher.students.get` | QUERY | `{ id: string }` | `StudentAcademicProfile` |
| `teacher.students.atRisk` | QUERY | — | `AtRiskStudent[]` |
| `teacher.assessments.results` | QUERY | `{ assessmentId?, classId? }` | `AssessmentResults` |
| `teacher.analytics.class` | QUERY | `{ classId?, termId? }` | `ClassAnalytics` |
| `teacher.analytics.gaps` | QUERY | `{ classId? }` | `GapAnalysisData` |
| `teacher.analytics.growth` | QUERY | `{ classId? }` | `GrowthData` |
| `teacher.reports.class` | QUERY | `{ classId, termId? }` | `{ downloadUrl: string }` |
| `teacher.reports.student` | QUERY | `{ studentId }` | `{ downloadUrl: string }` |
| `teacher.recommendations.get` | QUERY | — | `TeacherRecommendation[]` |
| `teacher.recommendations.markActioned` | MUTATION | `{ id: string }` | `Success` |
| `teacher.lessonPlans.suggest` | QUERY | `{ classId, conceptIds }` | `SuggestedLessonPlan[]` |

### 3.6 Student Router (`student.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `student.dashboard` | QUERY | — | `StudentDashboardData` |
| `student.assessments.available` | QUERY | — | `AvailableAssessment[]` |
| `student.assessments.history` | QUERY | `{ page?, pageSize? }` | `Paginated<AssessmentHistory>` |
| `student.assessments.start` | MUTATION | `{ assessmentId: string }` | `AssessmentSession` |
| `student.assessments.submitAnswer` | MUTATION | `SubmitAnswerInput` | `NextItem | TerminationSignal` |
| `student.assessments.pause` | MUTATION | `{ instanceId: string }` | `Success` |
| `student.assessments.resume` | QUERY | `{ instanceId: string }` | `ResumeSessionData` |
| `student.assessments.abandon` | MUTATION | `{ instanceId: string }` | `Success` |
| `student.assessments.complete` | MUTATION | `{ instanceId: string }` | `AssessmentResult` |
| `student.assessments.getState` | QUERY | `{ instanceId: string }` | `AssessmentState` |
| `student.progress.overview` | QUERY | — | `ProgressOverview` |
| `student.progress.readiness` | QUERY | — | `ReadinessScore[]` |
| `student.progress.conceptMastery` | QUERY | `{ subjectId? }` | `ConceptMastery[]` |
| `student.progress.learningJourney` | QUERY | — | `LearningJourneyData` |
| `student.progress.weaknessTimeline` | QUERY | — | `TimelineData` |
| `student.progress.strengthTimeline` | QUERY | — | `TimelineData` |
| `student.progress.growthCharts` | QUERY | — | `GrowthChartData` |
| `student.progress.velocity` | QUERY | — | `LearningVelocity` |
| `student.progress.prediction` | QUERY | — | `PredictionData` |
| `student.progress.compare` | QUERY | — | `PeerComparisonData` |
| `student.plans.daily` | QUERY | `{ date?: string }` | `DailyPlan` |
| `student.plans.weekly` | QUERY | `{ weekStart?: string }` | `WeeklyPlan` |
| `student.plans.monthly` | QUERY | `{ month?: string }` | `MonthlyPlan` |
| `student.plans.quarterly` | QUERY | — | `QuarterlyPlan` |
| `student.recommendations.list` | QUERY | — | `Recommendation[]` |
| `student.recommendations.markActioned` | MUTATION | `{ id: string }` | `Success` |
| `student.reports.basic` | QUERY | `{ instanceId: string }` | `BasicReport` |
| `student.reports.deep` | QUERY | `{ instanceId: string }` | `DeepReport` |
| `student.reports.deep.purchase` | MUTATION | `{ instanceId: string }` | `CheckoutUrl` |
| `student.reports.deep.download` | QUERY | `{ reportId: string }` | `{ downloadUrl: string }` |
| `student.achievements.list` | QUERY | — | `Achievement[]` |

### 3.7 Parent Router (`parent.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `parent.dashboard` | QUERY | — | `ParentDashboardData` |
| `parent.children.list` | QUERY | — | `ChildSummary[]` |
| `parent.children.get` | QUERY | `{ id: string }` | `ChildFullProfile` |
| `parent.children.link` | MUTATION | `{ studentCode, consentCode }` | `ChildSummary` |
| `parent.children.unlink` | MUTATION | `{ id: string }` | `Success` |
| `parent.children.compare` | QUERY | — | `ChildrenComparisonData` |
| `parent.reports.list` | QUERY | `{ childId }` | `ReportSummary[]` |
| `parent.reports.get` | QUERY | `{ childId, reportId }` | `DeepReport` |
| `parent.reports.purchase` | MUTATION | `{ childId, instanceId }` | `CheckoutUrl` |
| `parent.reports.bundles` | QUERY | — | `Bundle[]` |
| `parent.reports.purchaseBundle` | MUTATION | `{ bundleId: string }` | `CheckoutUrl` |
| `parent.progress.overview` | QUERY | `{ childId }` | `ProgressOverview` |
| `parent.progress.journey` | QUERY | `{ childId }` | `LearningJourneyData` |
| `parent.diagnostic.get` | QUERY | — | `ParentDiagnostic` |
| `parent.diagnostic.submit` | MUTATION | `ParentDiagnosticInput` | `ParentDiagnosticResult` |
| `parent.plans.family` | QUERY | — | `FamilyPlan` |
| `parent.plans.weeklyTasks` | QUERY | — | `WeeklyTask[]` |
| `parent.plans.monthlyTargets` | QUERY | — | `MonthlyTarget[]` |
| `parent.purchases.history` | QUERY | — | `PurchaseHistory[]` |

### 3.8 Assessment Engine Router (`assessment.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `assessment.selectNextItem` | MUTATION | `SelectNextItemInput` | `NextItemResult` |
| `assessment.calculateTheta` | MUTATION | `CalculateThetaInput` | `ThetaResult` |
| `assessment.detectMisconceptions` | MUTATION | `DetectMisconceptionInput` | `MisconceptionResult[]` |
| `assessment.calculateReadiness` | MUTATION | `{ instanceId: string }` | `ReadinessResult` |
| `assessment.validateAnswer` | MUTATION | `{ questionId, optionIds }` | `AnswerValidation` |

### 3.9 Report Router (`report.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `report.generate` | MUTATION | `{ instanceId, type }` | `{ reportId: string }` |
| `report.regenerate` | MUTATION | `{ reportId: string }` | `{ reportId: string }` |
| `report.getData` | QUERY | `{ reportId: string }` | `ReportData` |
| `report.downloadPdf` | QUERY | `{ reportId: string }` | `{ downloadUrl: string }` |
| `report.sendEmail` | MUTATION | `{ reportId, email? }` | `{ sent: boolean }` |
| `report.share` | MUTATION | `{ reportId, userIds }` | `{ shared: boolean }` |

### 3.10 Payment Router (`payment.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `payment.initialize` | MUTATION | `InitializePaymentInput` | `CheckoutUrl` |
| `payment.verify` | MUTATION | `{ reference: string }` | `PaymentResult` |
| `payment.methods.list` | QUERY | — | `PaymentMethod[]` |
| `payment.methods.add` | MUTATION | `AddPaymentMethodInput` | `PaymentMethod` |
| `payment.methods.remove` | MUTATION | `{ id: string }` | `Success` |
| `payment.coupon.validate` | QUERY | `{ code, amount }` | `CouponValidation` |

### 3.11 AI Router (`ai.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `ai.recommendations.generate` | MUTATION | `{ userId, targetRole }` | `Recommendation[]` |
| `ai.recommendations.forStudent` | QUERY | — | `StudentRecommendation[]` |
| `ai.recommendations.forTeacher` | QUERY | `{ classId? }` | `TeacherRecommendation[]` |
| `ai.recommendations.forParent` | QUERY | `{ childId? }` | `ParentRecommendation[]` |
| `ai.recommendations.forSchool` | QUERY | — | `SchoolRecommendation[]` |
| `ai.explainQuestion` | QUERY | `{ questionId, responseData }` | `QuestionExplanation` |
| `ai.generateLearningTip` | QUERY | `{ conceptId, studentLevel }` | `LearningTip` |

### 3.12 Notification Router (`notification.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `notification.list` | QUERY | `{ page?, unreadOnly? }` | `Paginated<Notification>` |
| `notification.markRead` | MUTATION | `{ id: string }` | `Success` |
| `notification.markAllRead` | MUTATION | — | `Success` |
| `notification.preferences` | QUERY | — | `NotificationPrefs` |
| `notification.updatePreferences` | MUTATION | `NotificationPrefs` | `NotificationPrefs` |

### 3.13 Content Router (`content.*`)

| Procedure | Method | Input | Output |
|-----------|--------|-------|--------|
| `content.subjects.list` | QUERY | `{ level? }` | `Subject[]` |
| `content.topics.list` | QUERY | `{ subjectId }` | `Topic[]` |
| `content.concepts.list` | QUERY | `{ topicId }` | `Concept[]` |
| `content.concepts.get` | QUERY | `{ id: string }` | `ConceptDetail` |
| `content.concepts.prerequisites` | QUERY | `{ id: string }` | `ConceptPrerequisite[]` |
| `content.concepts.knowledgeGraph` | QUERY | `{ conceptId? }` | `GraphData` |

---

## 4. REST ENDPOINTS (For Webhooks & Public)

### 4.1 Payment Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks/paystack` | Paystack transaction webhook |
| POST | `/api/webhooks/flutterwave` | Flutterwave transaction webhook |
| POST | `/api/webhooks/stripe` | Stripe transaction webhook |

**Webhook Payload Handling (Paystack example):**

```typescript
// POST /api/webhooks/paystack
// Headers: x-paystack-signature (validated)
{
  "event": "charge.success",
  "data": {
    "reference": "DC-2026-05-15-A1B2C3",
    "amount": 300000, // in kobo = ₦3,000
    "currency": "NGN",
    "customer": { "email": "parent@example.com" },
    "paid_at": "2026-05-15T10:30:00.000Z"
  }
}

// Server validates signature with secret key
// Matches reference to pending transaction
// Updates transaction status to 'completed'
// Unlocks deep report or adds credits
// Triggers notification queue
// Returns 200 OK
```

### 4.2 Public Data Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/public/stats` | Platform statistics for landing |
| GET | `/api/public/testimonials` | Public testimonials |
| GET | `/api/public/pricing` | Pricing plans |
| GET | `/api/public/faq` | FAQ content |
| GET | `/api/public/blog` | Blog posts (paginated) |
| GET | `/api/public/schools/search` | School search for registration |
| GET | `/api/public/contact` | Submit contact form |

### 4.3 File Upload

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload/avatar` | Upload user avatar |
| POST | `/api/upload/question-image` | Upload question image |
| POST | `/api/upload/school-logo` | Upload school logo |
| POST | `/api/upload/report-asset` | Upload report asset |

---

## 5. WEBSOCKET EVENTS

### 5.1 Assessment Live Monitoring

```typescript
// Client connects to /ws?token=<jwt>&assessmentId=<id>

// Server → Client events
ws.send({
  type: 'assessment:student:started',
  payload: { studentId, studentName, startedAt }
});

ws.send({
  type: 'assessment:student:progress',
  payload: { studentId, itemsCompleted, totalItems, currentTheta, timeSpent }
});

ws.send({
  type: 'assessment:student:completed',
  payload: { studentId, theta, rawScore, timeTaken }
});

ws.send({
  type: 'assessment:student:disconnected',
  payload: { studentId, lastItemAt }
});

ws.send({
  type: 'assessment:student:flagged',
  payload: { studentId, reason: 'too_fast'|'too_slow'|'suspicious_pattern' }
});

// Client → Server events
ws.send({ type: 'assessment:monitor:subscribe', payload: { assessmentId } });
ws.send({ type: 'assessment:monitor:unsubscribe', payload: { assessmentId } });
```

### 5.2 Real-time Notifications

```typescript
// Server → Client
ws.send({ type: 'notification:new', payload: Notification });
ws.send({ type: 'notification:count', payload: { unread: 5 } });
```

### 5.3 Admin System Monitor

```typescript
// Server → Client (admin only)
ws.send({ type: 'system:health:update', payload: SystemHealthMetrics });
ws.send({ type: 'system:error:alert', payload: { level, message, source } });
ws.send({ type: 'system:user:surge', payload: { concurrentUsers, activeAssessments } });
```

---

## 6. KEY REQUEST/RESPONSE CONTRACTS

### 6.1 Submit Assessment Answer

```typescript
// MUTATION student.assessments.submitAnswer
// Input
{
  instanceId: string;        // UUID of active assessment
  itemId: string;            // UUID of current assessment_item
  questionId: string;        // UUID of question
  selectedOptions: string[]; // UUIDs of selected option(s)
  responseTimeMs: number;    // Time spent on this item
  confidence?: 'low' | 'medium' | 'high';
  answerChanges?: number;    // Times answer was changed before final
}

// Output — either a new item or termination
| {
    type: 'next';
    item: {
      itemId: string;
      itemOrder: number;
      question: {
        id: string;
        text: string;           // Rendered HTML/Markdown
        type: 'multiple_choice' | 'multiple_select' | 'true_false';
        options: {
          id: string;
          text: string;
          order: number;
        }[];
        media?: { type: string; url: string; altText?: string }[];
      };
      timeLimitSeconds?: number;
      thetaAtDelivery: number;
      itemsCompleted: number;
      totalItems: number;
      timeRemainingSeconds: number;
    };
    theta: { current: number; se: number };
  }
| {
    type: 'complete';
    message: string;
    readinessScore: number;
    redirectUrl: string;
    theta: { final: number; se: number };
    itemsCompleted: number;
    timeSpentSeconds: number;
  }
```

### 6.2 Deep Report Response

```typescript
// QUERY student.reports.deep
{
  reportId: string;
  generatedAt: string;
  
  // Executive Summary
  overallReadinessScore: number;        // 0-100
  readinessCategory: 'critical' | 'weak' | 'developing' | 'competent' | 'strong';
  keyFindings: string[];
  riskLevel: 'low' | 'medium' | 'high';
  
  // Subject Scores
  subjectReadiness: {
    subjectId: string;
    subjectName: string;
    score: number;
    category: string;
    trend: 'improving' | 'stable' | 'declining';
  }[];
  
  // Radar Chart Data
  radarData: {
    dimension: string;
    score: number;
    peerAverage?: number;
  }[];
  
  // Concept Analysis
  strongConcepts: ConceptSummary[];
  developingConcepts: ConceptSummary[];
  weakConcepts: ConceptSummary[];
  
  // Gap Ranking
  gapRanking: {
    rank: number;
    conceptId: string;
    conceptName: string;
    score: number;
    impact: 'critical' | 'high' | 'medium' | 'low';
    prerequisiteFor: string[];
  }[];
  
  // Heatmap
  heatmap: {
    subject: string;
    bloomLevel: string;
    score: number;
    itemsCount: number;
  }[][];
  
  // Cognitive Skills
  cognitiveSkills: {
    skill: string;
    score: number;
    peerAverage?: number;
  }[];
  
  // Learning Velocity
  learningVelocity: {
    currentRate: number;
    projectedToTarget: number;     // days
    projectedScore: number;
    withPracticeProjection: number;
    riskIfUnchanged: number;
  };
  
  // Growth Projection
  growthProjection: {
    date: string;
    projectedScore: number;
    confidenceInterval: [number, number];
  }[];
  
  // Risk Analysis
  riskAnalysis: {
    atRiskSubjects: string[];
    atRiskConcepts: string[];
    impactDescription: string;
    compoundingRisks: string[];
  };
  
  // Opportunity Analysis
  opportunityAnalysis: {
    highImpactFixes: string[];
    quickWins: string[];
    leverageAreas: string[];
  };
  
  // Question Explanations
  questionExplanations: QuestionExplanation[];
  
  // Improvement Plans
  improvementPlan: {
    phase1: ImmediateAction[];    // Days 1-3
    phase2: ShortTermAction[];    // Days 4-14
    phase3: MediumTermAction[];   // Days 15-30
    phase4: LongTermAction[];     // Days 31-90
  };
  
  // AI Recommendations
  aiRecommendations: {
    forStudent: RecommendationItem[];
    forTeacher: RecommendationItem[];
    forParent: RecommendationItem[];
    forSchool: RecommendationItem[];
  };
  
  // Resources
  resources: LearningResource[];
}
```

---

## 7. RATE LIMITING

| Endpoint Group | Limit | Window | Strategy |
|---------------|-------|--------|----------|
| Public endpoints | 100 req/min | 1 min | Sliding window |
| Auth (login) | 5 req/min | 1 min | Per IP |
| Auth (register) | 3 req/hour | 1 hour | Per IP |
| Assessment answers | 2 req/sec | 1 sec | Per user |
| Report generation | 5 req/hour | 1 hour | Per user |
| Admin endpoints | 200 req/min | 1 min | Per admin |
| Webhooks | 100 req/min | 1 min | Per IP whitelist |
| API keys (external) | 1000 req/min | 1 min | Per key |
| File upload | 10 req/hour | 1 hour | Per user |

---

## 8. CACHING STRATEGY

| Data | Cache Key | TTL | Cache Type |
|------|-----------|-----|------------|
| Landing page stats | `landing:stats` | 5 min | Upstash Redis |
| Public pricing | `pricing:plans` | 1 hour | Upstash Redis |
| User profile | `user:{id}:profile` | 15 min | Upstash Redis |
| School info | `school:{id}:info` | 15 min | Upstash Redis |
| Subject list | `content:subjects` | 1 hour | Upstash Redis |
| Concept graph | `content:graph:{id}` | 1 hour | Upstash Redis |
| Active assessment state | `assess:{instanceId}:state` | 24 hours | Upstash Redis |
| Questions (published) | `qbank:*` | 30 min | Upstash Redis |
| Session tokens | `session:{token}` | Until expiry | Upstash Redis |
| Rate limit counters | `ratelimit:{identifier}` | Window | Upstash Redis |

---

*End of Phase 5 — API Design*

**~200+ tRPC procedures + REST endpoints + WebSocket events defined with type contracts.**

**Next: Phase 6 — RBAC Matrix**

*Confirm readiness to proceed to Phase 6.*
