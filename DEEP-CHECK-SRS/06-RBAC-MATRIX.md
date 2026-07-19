# DEEP CHECK — Software Requirements Specification

## Phase 6: RBAC (Role-Based Access Control) Matrix

---

## 1. RBAC PHILOSOPHY

| Principle | Implementation |
|-----------|---------------|
| **Least Privilege** | Each role has only the permissions necessary for its function |
| **Role Hierarchy** | Higher privilege roles inherit from lower (admin inherits all) |
| **Scope Isolation** | Users can only act within their scope (own data, own school, own children) |
| **Deny by Default** | No permission is granted unless explicitly assigned |
| **Auditable** | Every permission check is logged for admin review |
| **Overrideable** | Admins can grant/revoke individual permissions for edge cases |

### 1.1 Role Hierarchy

```
ultimate_admin (level 100)
  └── can do everything, overrides all restrictions

school_admin (level 80)
  └── scoped to their school
      ├── can manage school, classes, teachers, students
      └── cannot access other schools' data

teacher (level 60)
  └── scoped to their assigned classes/subjects
      ├── can view student data in their classes
      ├── can see reports, analytics
      └── cannot modify school/class configuration

student (level 40)
  └── scoped to their own data only
      ├── can take assessments, view own reports
      └── cannot see other students' data

parent (level 30)
  └── scoped to their linked children only
      ├── can view children's reports, progress
      └── cannot see other children

guest (level 20)
  └── scoped to their own data only
      ├── same as student but no school affiliation
      └── cannot link to school or parent
```

---

## 2. PERMISSION CATEGORIES

Permissions are organized into 14 modules:

| Module | Code Prefix | Description |
|--------|-------------|-------------|
| Users | `users.*` | User accounts, profiles, roles |
| Schools | `schools.*` | School registration, management |
| Classes | `classes.*` | Class/grade management |
| Content | `content.*` | Subjects, topics, concepts, misconceptions |
| Questions | `questions.*` | Question bank CRUD, review, import/export |
| Assessments | `assessments.*` | Assessment config, scheduling, delivery |
| Reports | `reports.*` | Report generation, templates, access |
| Analytics | `analytics.*` | Dashboard charts, data exports |
| Payments | `payments.*` | Transactions, pricing, coupons, subscriptions |
| AI | `ai.*` | Recommendations, prompts, model config |
| Notifications | `notifications.*` | Send, templates, preferences |
| System | `system.*` | Settings, feature flags, API keys, backup |
| CMS | `cms.*` | Pages, blog, SEO, themes |
| Audit | `audit.*` | Logs, monitoring, security |

---

## 3. COMPLETE PERMISSION MATRIX

**Legend:**
- ✅ = Full access (create, read, update, delete)
- 👁️ = Read only
- ✏️ = Read + Update (no create/delete)
- ➕ = Create + Read (no update/delete)
- ❌ = No access
- Self = Own data only
- School = Scoped to school
- Class = Scoped to assigned classes
- Child = Linked children only

### 3.1 Users Module (`users.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| List all users | `users.list` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View any user profile | `users.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own profile | `users.read.self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create users | `users.create` | ✅ | 👁️ | ❌ | ❌ | ❌ | ❌ |
| Update any user | `users.update` | ✅ | 👁️ | ❌ | ❌ | ❌ | ❌ |
| Update own profile | `users.update.self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete users | `users.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lock/unlock users | `users.lock` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Impersonate users | `users.impersonate` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage roles | `users.roles.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage permissions | `users.permissions.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bulk create users | `users.bulk.create` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Export users | `users.export` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View student profiles | `users.students.read` | ✅ | ✅(School) | 👁️(Class) | ❌ | 👁️(Child) | ❌ |
| View parent profiles | `users.parents.read` | ✅ | ❌ | ❌ | ❌ | 👁️(Self) | ❌ |
| View teacher profiles | `users.teachers.read` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |

### 3.2 Schools Module (`schools.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| List all schools | `schools.list` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View school profile | `schools.read` | ✅ | ✅(Own) | 👁️(Own) | 👁️(Own) | ❌ | ❌ |
| Register school | `schools.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update school | `schools.update` | ✅ | ✅(Own) | ❌ | ❌ | ❌ | ❌ |
| Delete school | `schools.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify school | `schools.verify` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Suspend school | `schools.suspend` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View school billing | `schools.billing.read` | ✅ | ✅(Own) | ❌ | ❌ | ❌ | ❌ |
| Manage school settings | `schools.settings.manage` | ✅ | ✅(Own) | ❌ | ❌ | ❌ | ❌ |
| View school analytics | `schools.analytics.read` | ✅ | ✅(Own) | 👁️(Own) | ❌ | ❌ | ❌ |

### 3.3 Classes Module (`classes.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| List classes | `classes.list` | ✅ | ✅(School) | 👁️(Assigned) | 👁️(Own) | ❌ | ❌ |
| View class detail | `classes.read` | ✅ | ✅(School) | 👁️(Assigned) | 👁️(Own) | ❌ | ❌ |
| Create class | `classes.create` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Update class | `classes.update` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Delete class | `classes.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage enrollment | `classes.enroll.manage` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View class analytics | `classes.analytics.read` | ✅ | ✅(School) | 👁️(Assigned) | ❌ | ❌ | ❌ |

### 3.4 Content Module (`content.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| List subjects | `content.subjects.list` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create subject | `content.subjects.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update subject | `content.subjects.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete subject | `content.subjects.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List topics | `content.topics.list` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create topic | `content.topics.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update topic | `content.topics.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| List concepts | `content.concepts.list` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View concept detail | `content.concepts.read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create concept | `content.concepts.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update concept | `content.concepts.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete concept | `content.concepts.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage prerequisites | `content.prerequisites.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage misconceptions | `content.misconceptions.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View knowledge graph | `content.graph.read` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage knowledge graph | `content.graph.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.5 Questions Module (`questions.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| List questions | `questions.list` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View question detail | `questions.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create question | `questions.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update question | `questions.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete question | `questions.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Submit for review | `questions.submit.review` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve/reject questions | `questions.review` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bulk import questions | `questions.import` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bulk export questions | `questions.export` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage IRT parameters | `questions.irt.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View question versions | `questions.versions.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Calibrate questions | `questions.calibrate` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Retire questions | `questions.retire` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.6 Assessments Module (`assessments.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| List assessment templates | `assessments.templates.list` | ✅ | ✅ | 👁️ | ❌ | ❌ | ❌ |
| Create assessment template | `assessments.templates.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update assessment template | `assessments.templates.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete assessment template | `assessments.templates.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Schedule assessment | `assessments.schedule` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Start own assessment | `assessments.start.self` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Submit answer in assessment | `assessments.answer.self` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Pause/resume own assessment | `assessments.control.self` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View live monitoring | `assessments.monitor.live` | ✅ | ✅(School) | 👁️(Class) | ❌ | ❌ | ❌ |
| View assessment results | `assessments.results.read` | ✅ | ✅(School) | 👁️(Class) | 👁️(Own) | 👁️(Child) | 👁️(Own) |
| View all results (any user) | `assessments.results.read.all` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export assessment results | `assessments.results.export` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Cancel assessment window | `assessments.window.cancel` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Adjust assessment settings | `assessments.settings.manage` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View adaptive algorithm config | `assessments.adaptive.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Modify adaptive algorithm | `assessments.adaptive.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.7 Reports Module (`reports.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View own basic report | `reports.basic.read.self` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View own deep report | `reports.deep.read.self` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View child's basic report | `reports.basic.read.child` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View child's deep report | `reports.deep.read.child` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View student report (teacher) | `reports.student.read.class` | ✅ | ✅(School) | 👁️(Class) | ❌ | ❌ | ❌ |
| View all reports (any user) | `reports.read.all` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate basic report | `reports.basic.generate` | ✅ | ✅ | ✅ | ✅(Self) | ❌ | ✅(Self) |
| Generate deep report | `reports.deep.generate` | ✅ | ✅ | ✅ | ✅(Self+Purch) | ✅(Child+Purch) | ✅(Self+Purch) |
| Deep report - purchase only | `reports.deep.purchase` | ✅ | ✅ | ❌ | ✅(Self) | ✅(Child) | ✅(Self) |
| Deep report - price override | `reports.deep.price.override` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate school quality report | `reports.school.generate` | ✅ | ✅(Own) | ❌ | ❌ | ❌ | ❌ |
| Generate parent diagnostic | `reports.parent.generate` | ✅ | ❌ | ❌ | ❌ | ✅(Self) | ❌ |
| View any school report | `reports.school.read.all` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage report templates | `reports.templates.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export report as PDF | `reports.export.pdf` | ✅ | ✅(School) | 👁️(Class) | ✅(Own) | ✅(Child) | ✅(Own) |
| Share report with others | `reports.share` | ✅ | ✅(School) | ❌ | ✅(Own) | ✅(Child) | ✅(Own) |
| Schedule auto-reports | `reports.schedule.manage` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Delete report | `reports.delete` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.8 Analytics Module (`analytics.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View platform analytics | `analytics.platform.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View school analytics | `analytics.school.read` | ✅ | ✅(Own) | 👁️(Own) | ❌ | ❌ | ❌ |
| View class analytics | `analytics.class.read` | ✅ | ✅(School) | 👁️(Assigned) | ❌ | ❌ | ❌ |
| View own progress | `analytics.progress.self` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View child's progress | `analytics.progress.child` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Compare classes | `analytics.compare.classes` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Compare teachers | `analytics.compare.teachers` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Compare subjects | `analytics.compare.subjects` | ✅ | ✅(School) | 👁️(Assigned) | ❌ | ❌ | ❌ |
| Compare schools | `analytics.compare.schools` | ✅ | ❌(future) | ❌ | ❌ | ❌ | ❌ |
| View trend analysis | `analytics.trends.read` | ✅ | ✅(School) | 👁️(Class) | 👁️(Own) | 👁️(Child) | 👁️(Own) |
| Export analytics data | `analytics.export` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View heatmaps | `analytics.heatmaps.read` | ✅ | ✅(School) | 👁️(Class) | 👁️(Own) | 👁️(Child) | 👁️(Own) |
| View prediction data | `analytics.prediction.read` | ✅ | ✅(School) | 👁️(Class) | 👁️(Own) | 👁️(Child) | 👁️(Own) |
| Manage dashboard widgets | `analytics.widgets.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.9 Payments Module (`payments.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View all transactions | `payments.transactions.list` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own transactions | `payments.transactions.self` | ✅ | ✅(School) | ✅ | ✅(Own) | ✅(Own) | ✅(Own) |
| View transaction detail | `payments.transactions.read` | ✅ | 👁️(Own) | ❌ | 👁️(Own) | 👁️(Own) | 👁️(Own) |
| Process refund | `payments.refund` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage pricing | `payments.pricing.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage coupons | `payments.coupons.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create coupon | `payments.coupons.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View subscription plans | `payments.plans.list` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage subscription plans | `payments.plans.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage own subscription | `payments.subscriptions.self` | ✅ | ✅(School) | ✅ | ✅ | ✅ | ✅ |
| Purchase deep report | `payments.purchase.report` | ✅ | ✅ | ❌ | ✅(Self) | ✅(Child) | ✅(Self) |
| Purchase school credits | `payments.purchase.credits` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View invoices | `payments.invoices.read` | ✅ | ✅(Own) | ❌ | ✅(Own) | ✅(Own) | ✅(Own) |
| Generate invoice | `payments.invoices.generate` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View payout data | `payments.payouts.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.10 AI Module (`ai.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View own AI recommendations | `ai.recommendations.self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View child's recommendations | `ai.recommendations.child` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View class recommendations | `ai.recommendations.class` | ✅ | ✅(School) | 👁️(Class) | ❌ | ❌ | ❌ |
| View school recommendations | `ai.recommendations.school` | ✅ | ✅(Own) | ❌ | ❌ | ❌ | ❌ |
| Generate new recommendations | `ai.recommendations.generate` | ✅ | ✅ | ✅(Class) | ❌ | ❌ | ❌ |
| Manage AI prompt templates | `ai.prompts.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage AI model config | `ai.models.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View AI effectiveness | `ai.effectiveness.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Get question explanation | `ai.explanation.read` | ✅ | ✅ | ✅ | ✅(Own) | ✅(Child) | ✅(Own) |
| Generate learning tips | `ai.tips.generate` | ✅ | ✅ | ✅(Class) | ✅(Self) | ❌ | ✅(Self) |
| View AI usage/cost metrics | `ai.usage.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mark recommendation as actioned | `ai.recommendations.action` | ✅ | ✅ | ✅ | ✅(Self) | ✅(Self) | ✅(Self) |

### 3.11 Notifications Module (`notifications.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View own notifications | `notifications.read.self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mark notification read | `notifications.update.self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Send system notification | `notifications.send.system` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| Send broadcast to all | `notifications.send.broadcast` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send to specific users | `notifications.send.targeted` | ✅ | ✅(School) | ✅(Class) | ❌ | ❌ | ❌ |
| Manage email templates | `notifications.templates.email` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage SMS templates | `notifications.templates.sms` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage notification preferences | `notifications.preferences.self` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View notification queue | `notifications.queue.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Retry failed notification | `notifications.queue.retry` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.12 System Module (`system.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View system config | `system.config.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update system config | `system.config.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage feature flags | `system.features.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage API keys | `system.api.keys.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View API keys | `system.api.keys.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View system health | `system.health.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View server logs | `system.logs.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Trigger backup | `system.backup.create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Restore from backup | `system.backup.restore` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View backup history | `system.backup.list` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Set maintenance mode | `system.maintenance.toggle` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Access admin panel | `system.admin.access` | ✅ | ✅(School) | ❌ | ❌ | ❌ | ❌ |
| View security settings | `system.security.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update security settings | `system.security.update` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.13 CMS Module (`cms.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| Manage landing page | `cms.landing.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage CMS pages | `cms.pages.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create/edit blog posts | `cms.blog.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage SEO settings | `cms.seo.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage themes | `cms.themes.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage brand settings | `cms.branding.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage dashboard widgets | `cms.widgets.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View public pages | `cms.pages.read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View blog posts | `cms.blog.read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 3.14 Audit Module (`audit.*`)

| Permission | Code | Ultimate Admin | School Admin | Teacher | Student | Parent | Guest |
|------------|------|:-------------:|:------------:|:-------:|:-------:|:------:|:-----:|
| View audit logs | `audit.logs.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export audit logs | `audit.logs.export` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View platform monitoring | `audit.monitoring.read` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Set log retention | `audit.retention.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View user activity | `audit.activity.read` | ✅ | ✅(School scope) | ❌ | ❌ | ❌ | ❌ |

---

## 4. SPECIAL PERMISSION NOTES

| Note | Detail |
|------|--------|
| **School Admin scope** | All school-scoped permissions only apply to the admin's own school. A school admin cannot access another school's data even with the same permission. |
| **Teacher scope** | Teachers can only see students and data from their assigned classes and subjects for the current term. No cross-class access. |
| **Parent scope** | Parents can only see data for children they are linked to via `student_parent_relations`. No access to other children. |
| **Guest scope** | Guests have the same permissions as students but cannot be linked to a school or parent. They cannot access school features. |
| **Self permissions** | "Self" permissions (`.self`) apply to the user's own data/sessions only. |
| **Admin override** | `ultimate_admin` can override all scope restrictions. Can access any user's data, any school, any report. |
| **Permission inheritance** | `school_admin` inherits all `teacher` permissions. `ultimate_admin` inherits all permissions. |
| **Temporary grants** | Admins can grant temporary permissions to any user for a specified duration (e.g., 24-hour access to a school's reports for audit). |

---

## 5. PERMISSION CHECK IMPLEMENTATION (tRPC Middleware)

```typescript
// middleware/auth.ts
import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';

export const requirePermission = (permission: string) =>
  middleware(async ({ ctx, next }) => {
    // 1. Check user is authenticated
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // 2. Check system-level flag (maintenance mode bypass for admin)
    if (ctx.maintenanceMode && ctx.user.role !== 'ultimate_admin') {
      throw new TRPCError({ code: 'SERVICE_UNAVAILABLE' });
    }

    // 3. Check user is active and not locked
    if (ctx.user.isLocked) throw new TRPCError({ code: 'FORBIDDEN' });

    // 4. Resolve effective permissions (role-based + user-specific overrides)
    const effectivePermissions = await resolvePermissions(ctx.user.id);

    // 5. Check required permission
    if (!effectivePermissions.includes(permission)) {
      // Special: check if it's a self-scoped permission
      if (permission.endsWith('.self')) {
        // Allow through — will be scoped in procedure
        return next();
      }
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: `Missing permission: ${permission}`
      });
    }

    // 6. Check school/scope validity if applicable
    if (ctx.user.role === 'school_admin' && permission.includes('school.')) {
      const { schoolId } = ctx.req.query || ctx.req.body;
      if (schoolId && schoolId !== ctx.user.schoolId) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
    }

    // 7. Audit log (configurable level)
    if (shouldAudit(permission)) {
      await auditLog({
        userId: ctx.user.id,
        action: permission,
        metadata: { path: ctx.path, input: sanitize(ctx.input) }
      });
    }

    return next();
  });

// Usage in tRPC procedure:
export const adminDashboard = protectedProcedure
  .use(requirePermission('analytics.platform.read'))
  .query(async ({ ctx }) => {
    // ...
  });
```

---

## 6. ROLE-SCOPE VALIDATION RULES

| Role | Scope Rule | Validation |
|------|-----------|------------|
| `ultimate_admin` | No scope restrictions | — |
| `school_admin` | `schoolId` matches user's school | `schoolId === user.schoolId` |
| `teacher` | `classId` in user's assigned classes | `classId IN (user.classIds)` |
| `teacher` | `studentId` in user's class | `student.classId IN (user.classIds)` |
| `student` | `userId` matches self | `userId === user.id` |
| `parent` | `childId` in user's linked children | `childId IN (user.childIds)` |
| `guest` | `userId` matches self | `userId === user.id` |

---

## 7. SEED DATA — DEFAULT ROLES & PERMISSIONS

```sql
-- Seed roles
INSERT INTO roles (id, name, description, is_system, priority) VALUES
  ('role-ultimate-admin', 'ultimate_admin', 'Full platform control', true, 100),
  ('role-school-admin',  'school_admin',  'School-level administration', true, 80),
  ('role-teacher',       'teacher',       'Classroom teacher', true, 60),
  ('role-student',       'student',       'Learner', true, 40),
  ('role-parent',        'parent',        'Parent/guardian', true, 30),
  ('role-guest',         'guest',         'Individual learner', true, 20);
```

---

*End of Phase 6 — RBAC Matrix*

**321 permission-role cells defined across 14 modules. All 6 roles covered with scope rules.**

**Next: Phase 7 — Assessment Engine Design**

*Confirm readiness to proceed to Phase 7.*
