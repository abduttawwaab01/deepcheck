# DEEP CHECK — Software Requirements Specification

## Phase 3: Information Architecture & Navigation

---

## 1. INFORMATION ARCHITECTURE PRINCIPLES

| Principle | Application |
|-----------|-------------|
| **Progressive Disclosure** | Show summary first, allow drill-down into detail. Dashboard → Section → Detail → Report. |
| **Role-Based Views** | Each role sees only what they need. Admin sees everything; student sees only their own data. |
| **Consistent Navigation** | Sidebar for primary navigation, top bar for context/user actions, breadcrumbs for depth. |
| **Mobile-First Hierarchy** | Bottom tab navigation on mobile; collapsible sidebar on desktop. |
| **Search Everything** | Global search available from all pages (indexed content per role permissions). |
| **Less Than 3 Clicks** | Any piece of information reachable within 3 clicks from dashboard. |
| **Contextual Actions** | Action buttons appear where relevant, not in global menus. |

---

## 2. GLOBAL NAVIGATION STRUCTURE

### 2.1 Top Navigation Bar (All Authenticated Users)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]  [Global Search...]         [Notifications ⬇] [Profile ⬇]   │
│                                         🔔 3      👤 Chidi ▼       │
│                                        ┌────────┐ ┌──────────────┐ │
│                                        │ Alert 1│ │ Dashboard    │ │
│                                        │ Alert 2│ │ Settings     │ │
│                                        │ Alert 3│ │ Logout       │ │
│                                        │ View All│ └──────────────┘ │
│                                        └────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Sidebar Navigation (Desktop) — By Role

#### 2.2.1 Ultimate Admin Sidebar

```
┌──────────────────────┐
│ ┌──┐                 │
│ │DC│  Deep Check     │  ← Logo + Platform name
│ └──┘                 │
├──────────────────────┤
│ 🏠 Dashboard         │  ← Main analytics overview
│ ├─ System Health     │
│ └─ Quick Actions     │
│                      │
│ 👥 Users             │  ← User management hub
│ ├─ All Users         │
│ ├─ Students          │
│ ├─ Teachers          │
│ ├─ Parents           │
│ ├─ Schools           │
│ ├─ Guests            │
│ └─ Roles & Permissions│
│                      │
│ 📚 Content           │  ← Question & assessment management
│ ├─ Questions         │
│ ├─ Question Bank     │
│ ├─ Subjects          │
│ ├─ Topics            │
│ ├─ Concepts          │
│ ├─ Assessments       │
│ ├─ Difficulty Levels │
│ └─ Import/Export     │
│                      │
│ 📊 Analytics Engine  │  ← System-wide analytics
│ ├─ Usage Analytics   │
│ ├─ Performance       │
│ ├─ Trends            │
│ ├─ Reports           │
│ └─ Export            │
│                      │
│ 🤖 AI Engine         │  ← AI configuration
│ ├─ Recommendation    │
│ ├─ Prompt Templates  │
│ ├─ Model Settings    │
│ └─ Effectiveness     │
│                      │
│ 💰 Payments          │  ← Financial management
│ ├─ Transactions      │
│ ├─ Pricing           │
│ ├─ Coupons           │
│ ├─ Subscriptions     │
│ ├─ Invoice           │
│ └─ Payouts           │
│                      │
│ 🎨 Appearance        │  ← Brand & UI management
│ ├─ Landing Page      │
│ ├─ Themes            │
│ ├─ Branding          │
│ └─ Widgets           │
│                      │
│ 📬 Communications    │  ← Notification & messaging
│ ├─ Notifications     │
│ ├─ Email Templates   │
│ ├─ SMS Templates     │
│ ├─ Announcements     │
│ └─ Audit Log         │
│                      │
│ ⚙️ Settings          │  ← Platform configuration
│ ├─ General           │
│ ├─ Security          │
│ ├─ API Keys          │
│ ├─ Feature Flags     │
│ ├─ Backup            │
│ ├─ Restore           │
│ └─ System Logs       │
│                      │
│ 📋 Reports           │  ← Report management
│ ├─ Report Templates  │
│ ├─ Generated Reports │
│ ├─ Scheduled Reports │
│ └─ Certificates      │
│                      │
│ 📈 SEO & CMS         │  ← Content management
│ ├─ Pages             │
│ ├─ Blog              │
│ ├─ SEO Settings      │
│ └─ Sitemap           │
└──────────────────────┘
```

#### 2.2.2 School Admin Sidebar

```
┌──────────────────────┐
│ ┌──┐                 │
│ │DC│  School Name    │
│ └──┘                 │
├──────────────────────┤
│ 🏠 Dashboard         │
│                      │
│ 👨‍🎓 Students         │
│ ├─ All Students      │
│ ├─ Classes           │
│ ├─ Sessions          │
│ ├─ Terms             │
│ └─ Assessments       │
│                      │
│ 👩‍🏫 Teachers          │
│ ├─ All Teachers      │
│ ├─ Performance       │
│ └─ Assignments       │
│                      │
│ 📊 Analytics         │
│ ├─ Class Comparison  │
│ ├─ Subject Analysis  │
│ ├─ Teacher Trends    │
│ ├─ Gender Analysis   │
│ └─ School Report     │
│                      │
│ 📋 Deep Reports      │
│ ├─ Generate Report   │
│ ├─ Report History    │
│ └─ Bulk Purchase     │
│                      │
│ 💳 Billing           │
│ ├─ Credits           │
│ ├─ Invoices          │
│ └─ Payment History   │
│                      │
│ ⚙️ Settings          │
│ ├─ School Profile    │
│ ├─ Class Management  │
│ ├─ Academic Calendar │
│ └─ Team Management   │
│                      │
│ ❓ Help & Support     │
└──────────────────────┘
```

#### 2.2.3 Student / Guest Sidebar

```
┌──────────────────────┐
│ ┌──┐                 │
│ │DC│  Deep Check     │
│ └──┘                 │
├──────────────────────┤
│ 🏠 Dashboard         │
│                      │
│ 📝 Assessments       │
│ ├─ Start Assessment  │
│ ├─ Assessment History│
│ └─ Pending           │
│                      │
│ 📊 My Reports        │
│ ├─ Basic Report      │
│ ├─ Deep Report       │
│ └── (if purchased)   │
│                      │
│ 📈 My Progress       │
│ ├─ Overview          │
│ ├─ Charts            │
│ ├─ Learning Journey  │
│ └─ Growth Timeline   │
│                      │
│ 🎯 My Plan           │
│ ├─ Daily Plan        │
│ ├─ Weekly Plan       │
│ ├─ Monthly Plan      │
│ └─ Recommendations   │
│                      │
│ 🏆 Achievements      │
│                      │
│ ⚙️ Settings          │
│ ├─ Profile           │
│ ├─ Password          │
│ └─ Notifications     │
│                      │
│ ❓ Help               │
└──────────────────────┘
```

#### 2.2.4 Parent Sidebar

```
┌──────────────────────┐
│ ┌──┐                 │
│ │DC│  Deep Check     │
│ └──┘                 │
├──────────────────────┤
│ 🏠 Dashboard         │
│   [Child Selector ▼] │
│   ├─ Adeola (P6)     │
│   └─ Tunde (P4)      │
│                      │
│ 📊 Reports           │
│ ├─ Adeola's Reports  │
│ ├─ Tunde's Reports   │
│ └─ Compare Children  │
│                      │
│ 📈 Progress          │
│ ├─ Adeola's Journey  │
│ ├─ Tunde's Journey   │
│ └─ Growth Timeline   │
│                      │
│ 🏡 Family Plan       │
│ ├─ Daily Plan        │
│ ├─ Weekly Plan       │
│ └─ Monthly Targets   │
│                      │
│ 📋 My Parenting      │
│ ├─ Parent Support    │
│ ├─ Home Learning     │
│ └─ Improvement       │
│                      │
│ 💳 Purchases         │
│ ├─ Buy Deep Report   │
│ ├─ Bundles           │
│ └─ History           │
│                      │
│ ⚙️ Settings          │
│ ├─ Profile           │
│ ├─ Children          │
│ ├─ Notifications     │
│ └─ Preferences       │
│                      │
│ ❓ Help               │
└──────────────────────┘
```

#### 2.2.5 Teacher Sidebar

```
┌──────────────────────┐
│ ┌──┐                 │
│ │DC│  Deep Check     │
│ └──┘                 │
├──────────────────────┤
│ 🏠 Dashboard         │
│                      │
│ 👨‍🎓 My Students       │
│ ├─ All Students      │
│ ├─ By Class          │
│ └─ At Risk           │
│                      │
│ 📝 Assessments       │
│ ├─ View Results      │
│ ├─ Scheduled         │
│ └─ History           │
│                      │
│ 📊 Class Analytics   │
│ ├─ Overview          │
│ ├─ Subject Analysis  │
│ ├─ Gap Analysis      │
│ └─ Growth Tracking   │
│                      │
│ 📋 Reports           │
│ ├─ Class Report      │
│ ├─ Student Reports   │
│ └─ Export            │
│                      │
│ 🎯 Recommendations   │
│ ├─ Teaching Strategy │
│ ├─ Lesson Plans      │
│ └─ Interventions     │
│                      │
│ ⚙️ Settings          │
│ ├─ Profile           │
│ └─ Notifications     │
│                      │
│ ❓ Help               │
└──────────────────────┘
```

### 2.3 Bottom Tab Navigation (Mobile)

#### Student Mobile Tabs

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│   🏠     │   📝     │   📊     │   🎯     │   👤     │
│ Dashboard│ Assess   │ Reports  │ Plans    │ Profile  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

#### Parent Mobile Tabs

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│   🏠     │   📊     │   🏡     │   💳     │   👤     │
│ Dashboard│ Reports  │ Family   │ Shop     │ Profile  │
│          │          │ Plan     │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 3. COMPLETE PAGE INVENTORY

### 3.1 Public Pages (No Auth Required)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| P1 | Landing Page | `/` | Full marketing homepage |
| P2 | Features | `/features` | Detailed feature breakdown |
| P3 | How It Works | `/how-it-works` | Step-by-step explanation |
| P4 | Pricing | `/pricing` | Pricing plans and comparison |
| P5 | FAQ | `/faq` | Frequently asked questions |
| P6 | About | `/about` | Company/mission page |
| P7 | Contact | `/contact` | Contact form |
| P8 | Blog | `/blog` | Educational content |
| P9 | Blog Post | `/blog/[slug]` | Individual article |
| P10 | For Schools | `/for-schools` | School-specific landing |
| P11 | For Parents | `/for-parents` | Parent-specific landing |
| P12 | Privacy Policy | `/privacy` | Data privacy policy |
| P13 | Terms of Service | `/terms` | Terms and conditions |
| P14 | Refund Policy | `/refund` | Refund/cancellation policy |
| P15 | Login | `/auth/login` | Authentication page |
| P16 | Register | `/auth/register` | Registration page |
| P17 | Forgot Password | `/auth/forgot-password` | Password reset request |
| P18 | Reset Password | `/auth/reset-password` | Password reset form |
| P19 | Verify Email | `/auth/verify-email` | Email verification |
| P20 | Verify Phone | `/auth/verify-phone` | Phone verification |
| P21 | Demo Request | `/demo` | School demo request form |
| P22 | Partners | `/partners` | Partner program page |
| P23 | Testimonials | `/testimonials` | User stories and testimonials |
| P24 | Careers | `/careers` | Job listings |
| P25 | Press Kit | `/press` | Media resources |
| P26 | Sitemap | `/sitemap.xml` | SEO sitemap |
| P27 | Robots | `/robots.txt` | Crawler directives |
| P28 | 404 | `/404` | Not found page |
| P29 | 500 | `/500` | Server error page |
| P30 | Maintenance | `/maintenance` | Scheduled maintenance |

### 3.2 Student Pages (Authenticated)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| S1 | Student Dashboard | `/dashboard` | Personal analytics overview |
| S2 | Start Assessment | `/assessment/start` | Pre-assessment setup |
| S3 | Assessment In Progress | `/assessment/[id]` | Active assessment |
| S4 | Assessment Complete | `/assessment/[id]/complete` | Results preview |
| S5 | Basic Report | `/reports/basic/[id]` | Free report view |
| S6 | Deep Report | `/reports/deep/[id]` | Premium report (purchased) |
| S7 | Report PDF | `/reports/deep/[id]/pdf` | PDF download |
| S8 | Assessment History | `/assessments` | All past assessments |
| S9 | Progress Overview | `/progress` | Charts and metrics |
| S10 | Learning Journey | `/progress/journey` | Timeline of growth |
| S11 | Mastery Map | `/progress/mastery` | Concept mastery heatmap |
| S12 | Weakness Timeline | `/progress/weaknesses` | Weakness trends |
| S13 | Strength Timeline | `/progress/strengths` | Strength trends |
| S14 | Growth Charts | `/progress/charts` | Full chart view |
| S15 | Daily Plan | `/plans/daily` | Today's practice tasks |
| S16 | Weekly Plan | `/plans/weekly` | 7-day learning plan |
| S17 | Monthly Plan | `/plans/monthly` | 30-day learning plan |
| S18 | 90-Day Plan | `/plans/quarterly` | 90-day roadmap |
| S19 | Recommendations | `/recommendations` | AI-generated tips |
| S20 | Learning Velocity | `/progress/velocity` | Learning speed metric |
| S21 | Readiness Index | `/progress/readiness` | Readiness score breakdown |
| S22 | Prediction Score | `/progress/prediction` | Future performance projection |
| S23 | Compare My Scores | `/progress/compare` | Anonymized peer comparison |
| S24 | Achievements | `/achievements` | Badges and milestones |
| S25 | Settings | `/settings` | Profile, password, notifications |
| S26 | Help Center | `/help` | Support articles |
| S27 | Support Ticket | `/help/ticket` | Submit support request |

### 3.3 Parent Pages (Authenticated)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| PA1 | Parent Dashboard | `/parent/dashboard` | Overview of all children |
| PA2 | Child Detail | `/parent/child/[id]` | Single child's overview |
| PA3 | Child Reports | `/parent/child/[id]/reports` | All reports for child |
| PA4 | Child Deep Report | `/parent/child/[id]/report/[rid]` | Specific deep report |
| PA5 | Child Progress | `/parent/child/[id]/progress` | Child's progress charts |
| PA6 | Child Journey | `/parent/child/[id]/journey` | Learning journey timeline |
| PA7 | Compare Children | `/parent/compare` | Side-by-side comparison |
| PA8 | Family Learning Plan | `/parent/family-plan` | Whole-family plan |
| PA9 | Parent Support Index | `/parent/parenting` | Parenting diagnostic |
| PA10 | Home Learning Score | `/parent/home-learning` | Home environment assessment |
| PA11 | Parent Improvement | `/parent/improvement` | Personalized parenting tips |
| PA12 | Weekly Tasks | `/parent/weekly-tasks` | Assigned parent actions |
| PA13 | Monthly Targets | `/parent/monthly-targets` | Monthly parenting goals |
| PA14 | Purchase Report | `/parent/purchase/report/[id]` | Buy deep report for child |
| PA15 | Purchase Bundles | `/parent/purchase/bundles` | Multi-report packs |
| PA16 | Purchase History | `/parent/purchases` | All past transactions |
| PA17 | Parent Settings | `/parent/settings` | Profile, children, notifications |

### 3.4 School Admin Pages (Authenticated)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| SC1 | School Dashboard | `/school/dashboard` | School-level KPIs |
| SC2 | All Students | `/school/students` | Student list with search/filter |
| SC3 | Student Detail | `/school/students/[id]` | Full student profile |
| SC4 | Student Report | `/school/students/[id]/reports` | Student's reports |
| SC5 | Student Deep Report | `/school/students/[id]/report/[rid]` | Specific student report |
| SC6 | Class Management | `/school/classes` | CRUD classes |
| SC7 | Class Detail | `/school/classes/[id]` | Students, teachers, results |
| SC8 | Class Analytics | `/school/classes/[id]/analytics` | Class performance |
| SC9 | Session Management | `/school/sessions` | Academic sessions |
| SC10 | Term Management | `/school/terms` | Term setup per session |
| SC11 | All Teachers | `/school/teachers` | Teacher list |
| SC12 | Teacher Detail | `/school/teachers/[id]` | Teacher profile + performance |
| SC13 | Teacher Performance | `/school/teachers/analytics` | Teacher effectiveness |
| SC14 | Assessment Windows | `/school/assessments` | Schedule and manage |
| SC15 | Assessment Results | `/school/assessments/[id]/results` | Results by class |
| SC16 | Live Monitoring | `/school/assessments/[id]/live` | Real-time completion |
| SC17 | School Analytics | `/school/analytics` | Full analytics suite |
| SC18 | Class Comparison | `/school/analytics/class-comparison` | Compare classes |
| SC19 | Subject Analysis | `/school/analytics/subjects` | Per-subject breakdown |
| SC20 | Gender Analysis | `/school/analytics/gender` | Gender-based comparison |
| SC21 | Teacher Trends | `/school/analytics/teachers` | Teacher performance over time |
| SC22 | School Report | `/school/report` | School Quality Diagnostic |
| SC23 | School Report PDF | `/school/report/pdf` | Downloadable PDF |
| SC24 | Bulk Purchase | `/school/billing/credits` | Buy assessment credits |
| SC25 | Credit Distribution | `/school/billing/distribute` | Assign credits to students |
| SC26 | Invoices | `/school/billing/invoices` | Billing history |
| SC27 | School Settings | `/school/settings` | Profile, calendar, team |
| SC28 | Team Management | `/school/settings/team` | Manage admin/teacher accounts |

### 3.5 Teacher Pages (Authenticated)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| T1 | Teacher Dashboard | `/teacher/dashboard` | Class overview |
| T2 | My Students | `/teacher/students` | All assigned students |
| T3 | Student Detail | `/teacher/students/[id]` | Student profile |
| T4 | At-Risk Students | `/teacher/at-risk` | Students needing intervention |
| T5 | Assessment Results | `/teacher/assessments` | Past assessment results |
| T6 | Class Analytics | `/teacher/analytics` | Class performance analytics |
| T7 | Gap Analysis | `/teacher/analytics/gaps` | Concept gap overview |
| T8 | Growth Tracking | `/teacher/analytics/growth` | Student growth metrics |
| T9 | Class Report | `/teacher/reports/class` | Printable class report |
| T10 | Student Reports | `/teacher/reports/students` | Individual student reports |
| T11 | Teaching Recommendations | `/teacher/recommendations` | AI teaching strategy tips |
| T12 | Lesson Plan Suggestions | `/teacher/lesson-plans` | AI-generated lesson plans |
| T13 | Intervention Planner | `/teacher/interventions` | Plan student interventions |
| T14 | Teacher Settings | `/teacher/settings` | Profile, notifications |

### 3.6 Ultimate Admin Pages (Authenticated)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| A1 | Admin Dashboard | `/admin` | System-wide overview |
| A2 | System Health | `/admin/system` | Server status, uptime, errors |
| A3 | All Users | `/admin/users` | Searchable user table |
| A4 | User Detail | `/admin/users/[id]` | Full user profile + activity |
| A5 | Students List | `/admin/users/students` | Filtered student list |
| A6 | Teachers List | `/admin/users/teachers` | Filtered teacher list |
| A7 | Parents List | `/admin/users/parents` | Filtered parent list |
| A8 | Schools List | `/admin/schools` | All registered schools |
| A9 | School Detail | `/admin/schools/[id]` | School profile + stats |
| A10 | School Approval | `/admin/schools/pending` | Pending school verifications |
| A11 | Guests List | `/admin/users/guests` | Guest user list |
| A12 | Roles & Permissions | `/admin/roles` | RBAC matrix editor |
| A13 | Questions | `/admin/questions` | Question bank manager |
| A14 | Question Create | `/admin/questions/create` | New question form |
| A15 | Question Edit | `/admin/questions/[id]` | Edit question |
| A16 | Question Review | `/admin/questions/review` | Approval workflow |
| A17 | Import Questions | `/admin/questions/import` | Bulk import |
| A18 | Export Questions | `/admin/questions/export` | Bulk export |
| A19 | Subjects | `/admin/subjects` | Subject CRUD |
| A20 | Topics | `/admin/topics` | Topic CRUD |
| A21 | Concepts | `/admin/concepts` | Concept CRUD (knowledge graph) |
| A22 | Difficulty Levels | `/admin/difficulty` | IRT parameters management |
| A23 | Assessments | `/admin/assessments` | Assessment templates |
| A24 | Assessment Create | `/admin/assessments/create` | New assessment config |
| A25 | Assessment Edit | `/admin/assessments/[id]` | Edit assessment |
| A26 | Usage Analytics | `/admin/analytics` | Platform usage metrics |
| A27 | Performance Analytics | `/admin/analytics/performance` | System performance |
| A28 | Trend Reports | `/admin/analytics/trends` | Trend analysis |
| A29 | AI Settings | `/admin/ai` | AI engine configuration |
| A30 | Prompt Templates | `/admin/ai/prompts` | Edit AI prompt templates |
| A31 | Model Settings | `/admin/ai/models` | Configure AI models |
| A32 | AI Effectiveness | `/admin/ai/effectiveness` | Recommendation success metrics |
| A33 | Transactions | `/admin/payments/transactions` | All financial transactions |
| A34 | Pricing Settings | `/admin/payments/pricing` | Price configuration |
| A35 | Coupons | `/admin/payments/coupons` | Coupon CRUD |
| A36 | Subscriptions | `/admin/payments/subscriptions` | Manage subscriptions |
| A37 | Invoices | `/admin/payments/invoices` | All invoices |
| A38 | Payouts | `/admin/payments/payouts` | School/seller payouts |
| A39 | Landing Page Editor | `/admin/cms/landing` | Edit landing page sections |
| A40 | Theme Editor | `/admin/appearance/themes` | Theme customization |
| A41 | Brand Settings | `/admin/appearance/branding` | Logo, colors, fonts |
| A42 | Dashboard Widgets | `/admin/appearance/widgets` | Configure dashboard widgets |
| A43 | Notifications | `/admin/communications/notifications` | Send system notifications |
| A44 | Email Templates | `/admin/communications/email` | Edit email templates |
| A45 | SMS Templates | `/admin/communications/sms` | Edit SMS templates |
| A46 | Announcements | `/admin/communications/announcements` | Create announcements |
| A47 | Audit Log | `/admin/audit` | Full audit trail |
| A48 | General Settings | `/admin/settings` | Platform-wide settings |
| A49 | Security Settings | `/admin/settings/security` | Security configuration |
| A50 | API Keys | `/admin/settings/api-keys` | Manage API keys |
| A51 | Feature Flags | `/admin/settings/feature-flags` | Feature toggle management |
| A52 | Backup | `/admin/settings/backup` | Database backup |
| A53 | Restore | `/admin/settings/restore` | Database restore |
| A54 | System Logs | `/admin/settings/logs` | Server logs viewer |
| A55 | Report Templates | `/admin/reports/templates` | Configure report layouts |
| A56 | Generated Reports | `/admin/reports/generated` | All generated reports |
| A57 | Scheduled Reports | `/admin/reports/scheduled` | Auto-report schedules |
| A58 | Certificates | `/admin/certificates` | Certificate management |
| A59 | CMS Pages | `/admin/cms/pages` | Manage content pages |
| A60 | Blog Posts | `/admin/cms/blog` | Blog CRUD |
| A61 | SEO Settings | `/admin/cms/seo` | Meta tags, sitemap config |
| A62 | Email | `/admin/settings/email` | SMTP configuration |
| A63 | SMS | `/admin/settings/sms` | SMS provider config |
| A64 | Search Settings | `/admin/settings/search` | Search index config |
| A65 | Privacy Settings | `/admin/settings/privacy` | Privacy controls |
| A66 | Data Export | `/admin/settings/data-export` | GDPR data export |
| A67 | Maintenance Mode | `/admin/settings/maintenance` | Toggle maintenance |
| A68 | API Documentation | `/admin/api-docs` | Interactive API docs |

### 3.7 Guest Pages (Authenticated)

| # | Page | URL Path | Description |
|---|------|----------|-------------|
| G1 | Guest Dashboard | `/dashboard` | Same as student but no school info |
| G2-G27 | Same as Student pages S2-S26 | Same paths | Complete assessment and report access |

---

## 4. BREADCRUMB STRUCTURE

Every authenticated page provides breadcrumb navigation:

**Examples:**

```
Admin > Users > Schools > Gracefield College > Students > Adeola Samuel > Report #1234

School > Analytics > Class Comparison > JSS1A vs JSS1B

Parent > Adeola > Reports > Deep Report > March 2026

Student > Progress > Learning Journey > Assessment #5
```

---

## 5. CONTENT HIERARCHY

### 5.1 Landing Page Content Hierarchy

```
1.0 LANDING PAGE
├── 1.1 Top Navigation
│   ├── Logo
│   ├── Features
│   ├── How It Works
│   ├── Pricing
│   ├── For Schools
│   ├── For Parents
│   ├── Blog
│   └── Get Started (CTA)
│
├── 1.2 Hero Section
│   ├── Headline: "Discover What Your Child Doesn't Know"
│   ├── Subheadline: "The world's most advanced learning diagnostic platform"
│   ├── Animated Dashboard Preview (3D rotating card)
│   ├── Trust Bar: "Trusted by XXX schools across Nigeria"
│   └── CTAs: "Start Free Assessment" / "Watch Demo"
│
├── 1.3 Statistics Counter
│   ├── Assessments Completed: 50,000+
│   ├── Gaps Identified: 1.2M+
│   ├── Schools: 500+
│   └── Reports Generated: 45,000+
│
├── 1.4 How It Works (3-step)
│   ├── Step 1: Take Adaptive Assessment
│   ├── Step 2: Receive Deep Diagnostic
│   └── Step 3: Follow Personalized Plan
│
├── 1.5 Deep Intelligence Section
│   ├── AI Analytics Showcase
│   ├── Report Preview Carousel
│   │   ├── Radar Chart Preview
│   │   ├── Heatmap Preview
│   │   ├── Gap Analysis Preview
│   │   └── Recommendation Preview
│   └── Progress Tracking Preview
│
├── 1.6 Features Grid
│   ├── Adaptive Intelligence
│   ├── Misconception Detection
│   ├── Deep Reports
│   ├── AI Recommendations
│   ├── School Analytics
│   ├── Parent Dashboard
│   └── Progress Tracking
│
├── 1.7 Assessment Journey Section
│   ├── Before/After comparison
│   └── Student growth story
│
├── 1.8 Testimonials Carousel
│   ├── Student Stories
│   ├── School Stories
│   └── Parent Stories
│
├── 1.9 Pricing Section
│   ├── Free Tier Card
│   ├── Deep Report Card (₦3,000)
│   ├── School Plans
│   └── Enterprise
│
├── 1.10 FAQ Section (accordion)
│   └── 10-15 common questions
│
├── 1.11 Partners / Logos
│   └── School logos, partner logos
│
├── 1.12 Final CTA
│   └── "Start Your Child's Diagnostic Journey"
│
└── 1.13 Footer
    ├── Product links
    ├── Company links
    ├── Legal links
    ├── Social media
    ├── Newsletter signup
    └── Copyright
```

### 5.2 Dashboard Content Hierarchy (Student)

```
2.0 STUDENT DASHBOARD
├── 2.1 Welcome Section
│   ├── Greeting: "Good morning, Adeola!"
│   ├── Avatar + Streak counter: "5-day streak!"
│   └── Next action: "Your daily practice is ready"
│
├── 2.2 Readiness Score Card (large, center)
│   ├── Overall: 62%
│   ├── Gauge chart
│   └── Trend: "↑ 5% from last month"
│
├── 2.3 Radar Chart (5 dimensions)
│   ├── Reading: 78%
│   ├── Mathematics: 55%
│   ├── Science: 61%
│   ├── Reasoning: 42%
│   └── Critical Thinking: 38%
│
├── 2.4 Quick Stats Row
│   ├── Assessments: 3 completed
│   ├── Weak Concepts: 7 identified
│   ├── Strengths: 4 concepts mastered
│   └── Deep Reports: 1 purchased
│
├── 2.5 Weak Concepts Section
│   ├── List of top 5 weakest concepts
│   ├── Progress bar per concept
│   └── "Practice Now" button per concept
│
├── 2.6 Daily Practice Card
│   ├── Today's task description
│   ├── Time estimate: "5 minutes"
│   └── Start button
│
├── 2.7 Learning Journey Timeline
│   ├── Assessment 1: March 1 (Score: 45%)
│   ├── Assessment 2: April 1 (Score: 55%)
│   └── Assessment 3: May 1 (Score: 62%)
│
├── 2.8 Recommended For You
│   ├── 3 AI-generated tips
│   └── Link to full recommendations
│
└── 2.9 Quick Actions
    ├── Start New Assessment
    ├── View Full Report
    └── Invite Parent
```

### 5.3 Report Content Hierarchy (Deep Report)

```
3.0 DEEP REPORT
├── 3.1 Report Header
│   ├── Title: "Deep Diagnostic Report"
│   ├── Student: Adeola Samuel
│   ├── Class: Primary 6A
│   ├── Date: May 15, 2026
│   └── Report ID: DC-2026-05-15-A1B2C3
│
├── 3.2 Executive Summary
│   ├── Overall Readiness Score: 62/100
│   ├── Recommendation: "Moderate Preparation — Further Development Needed"
│   ├── 3 Key Findings (bullet points)
│   └── Risk Level: "Medium — 3 concepts at critical risk"
│
├── 3.3 Readiness Scores (per subject)
│   ├── Mathematics: 55%
│   ├── English: 78%
│   ├── Science: 61%
│   ├── Social Studies: 65%
│   └── Critical Thinking: 38%
│
├── 3.4 Radar / Spider Chart
│   └── Multi-dimensional visualization
│
├── 3.5 Concept Analysis
│   ├── Strong Concepts (mastered)
│   ├── Developing Concepts (in progress)
│   └── Weak Concepts (gaps)
│       ├── Logical Deduction: 28%
│       ├── Fraction Operations: 34%
│       ├── Reading Comprehension: 45%
│       ├── Scientific Method: 40%
│       └── Inference Making: 30%
│
├── 3.6 Gap Ranking (priority order)
│   ├── #1: Logical Deduction (prerequisite for Algebra)
│   ├── #2: Fraction Operations (prerequisite for Ratios)
│   └── #3: Inference Making (critical for English)
│
├── 3.7 Heatmap (Subject × Concept × Bloom Level)
│   └── Color-coded mastery matrix
│
├── 3.8 Cognitive Skills Analysis
│   ├── Knowledge: 85%
│   ├── Understanding: 72%
│   ├── Application: 58%
│   ├── Analysis: 45%
│   ├── Evaluation: 35%
│   └── Creation: 30%
│
├── 3.9 Learning Velocity
│   ├── Current rate: 12 points/month
│   ├── Projected to target: 2.5 months
│   └── Recommendations to accelerate
│
├── 3.10 Growth Projection
│   ├── If current pace continues: 82% by August
│   ├── With daily practice: 92% by August
│   └── Risk if unchanged: 55% by August (declining)
│
├── 3.11 Risk Analysis
│   ├── At-risk subjects: Mathematics
│   ├── At-risk concepts: Logical Deduction, Fractions
│   ├── Impact on JSS1 readiness
│   └── Compounding risk if unaddressed
│
├── 3.12 Opportunity Analysis
│   ├── High-impact concepts to fix first
│   ├── Quick wins (concepts close to mastery)
│   └── Leverage areas (strengths to build on)
│
├── 3.13 Question Explanations (per question)
│   ├── Question number + text
│   ├── Selected answer vs correct answer
│   ├── Detailed explanation
│   ├── Common mistake explanation
│   ├── Learning tip
│   └── Reference / recommended practice
│
├── 3.14 Improvement Plan
│   ├── Phase 1: Immediate Actions (Days 1-3)
│   ├── Phase 2: Short-term (Days 4-14)
│   ├── Phase 3: Medium-term (Days 15-30)
│   └── Phase 4: Long-term (Days 31-90)
│
├── 3.15 Daily Practice Plan
│   ├── Day 1: Logical Deduction (5 min)
│   ├── Day 2: Fraction Operations (5 min)
│   ├── Day 3: Inference Exercise (5 min)
│   └── (30-day plan)
│
├── 3.16 Weekly Plan
│   ├── Week 1: Focus on Critical Thinking
│   ├── Week 2: Mathematics Foundations
│   └── (4-week plan)
│
├── 3.17 Monthly Plan
│   └── Goals and milestones by month
│
├── 3.18 AI Recommendations
│   ├── For Student: "Practice one logic puzzle daily"
│   ├── For Teacher: "Use fraction manipulatives in class"
│   ├── For Parent: "Read stories and ask prediction questions"
│   └── For School: "Increase inquiry-based learning in P6"
│
├── 3.19 Resource Links
│   ├── Recommended videos
│   ├── Practice worksheets
│   ├── Interactive exercises
│   └── Reading materials
│
└── 3.20 Report Footer
    ├── Disclaimer
    ├── Psychometric validity statement
    ├── Next assessment date recommendation
    └── Share / Export options
```

---

## 6. WIREFRAMES (Text-Based)

### 6.1 Landing Page — Hero Section Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Logo]  Features  How It Works  Pricing  For Schools  [Get Started] │
├──────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ ┌──────────────┐│
│ │                                                 │ │ ┌──────────┐ ││
│ │  Discover What Your Child                       │ │ │  Radar   │ ││
│ │  Doesn't Know                                   │ │ │  Chart   │ ││
│ │                                                 │ │ │  Anim.   │ ││
│ │  The world's most advanced learning             │ │ │  62%     │ ││
│ │  diagnostic intelligence platform               │ │ └──────────┘ ││
│ │                                                 │ │ ┌──────────┐ ││
│ │  [Start Free Assessment →]  [Watch Demo ▸]      │ │ │  Score   │ ││
│ │                                                 │ │ │  Card    │ ││
│ │  ⭐ Trusted by 500+ schools across Nigeria      │ │ └──────────┘ ││
│ └─────────────────────────────────────────────────┘ └──────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│  📊 50K+ Assessments  🎯 1.2M+ Gaps Found  🏫 500+ Schools  📋 45K+│
└──────────────────────────────────────────────────────────────────────┘
```

### 6.2 Student Dashboard Wireframe (Mobile View)

```
┌──────────────────────┐
│ 9:41                  │
│ ┌──────────────────┐ │
│ │ 👋 Good morning, │ │
│ │ Adeola! 🔥 5-day │ │
│ │ streak           │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │  Overall         │ │
│ │  Readiness       │ │
│ │    62%           │ │
│ │    ↑ 5%          │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │  Radar Chart     │ │
│ │  (5-dimensional) │ │
│ └──────────────────┘ │
│ ┌────┐ ┌────┐ ┌────┐ │
│ │    │ │    │ │    │ │
│ │ 3  │ │ 7  │ │ 4  │ │
│ │Ass.│ │Gaps│ │Str.│ │
│ └────┘ └────┘ └────┘ │
│ ┌──────────────────┐ │
│ │ Weak Concepts    │ │
│ │ ■ Logical Deduct │ │
│ │ ████████░░░ 28%  │ │
│ │ ■ Fraction Ops   │ │
│ │ █████████░░ 34%  │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Daily Practice   │ │
│ │ 5-min logic      │ │
│ │ exercise ready!  │ │
│ │ [Start Practice] │ │
│ └──────────────────┘ │
├──────────┬──────────┤
│ 🏠       │ 📝       │
│Dashboard │Assess    │
├──────────┼──────────┤
│ 📊      │ 🎯       │
│ Reports  │ Plans    │
└──────────┴──────────┘
```

### 6.3 Admin Dashboard Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Logo]  [Search...]              🔔3  👤Chidi ▼  ⚙️  📄            │
├──────────────────────────────────────────────────────────────────────┤
│ 🏠 Dashboard                                                       │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                  │
│ │Users  │ │Schools│ │Assess │ │Revenue│ │Active │                  │
│ │12,847 │ │ 534   │ │50,239 │ │₦4.2M  │ │ 78%   │                  │
│ │↑ 12%  │ │↑ 8%   │ │↑ 22%  │ │this mo│ │users  │                  │
│ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘                  │
│ ┌─────────────────────────────────────────┐ ┌─────────────────────┐ │
│ │ User Growth Chart (30 days)            │ │ System Health       │ │
│ │ ▁▂▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃             │ │ 🟢 All Systems Go   │ │
│ └─────────────────────────────────────────┘ │ 🟢 Database: 12ms  │ │
│ ┌─────────────────────────────────────────┐ │ 🟢 API: 45ms       │ │
│ │ Recent Transactions                     │ │ 🟡 Queue: 234 ms   │ │
│ │ • Gracefield College — ₦150,000 ✅      │ └─────────────────────┘ │
│ │ • Mrs. Adeyemi — ₦3,000 ✅              │                          │
│ │ • Excel College — ₦450,000 ⏳           │                          │
│ └─────────────────────────────────────────┘                          │
│ ┌─────────────────────────────────────────┐                          │
│ │ Pending Actions                         │                          │
│ │ 🔴 12 schools pending verification     │                          │
│ │ 🟡 45 questions pending review         │                          │
│ │ 🔵 3 reports required attention        │                          │
│ └─────────────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. NAVIGATION RULES & BEHAVIOR

| Rule | Behavior |
|------|----------|
| **Active State** | Current page's nav item is highlighted |
| **Collapsible Sidebar** | Admin sidebar collapses to icon-only on desktop (≥1024px) |
| **Bottom Nav** | Mobile (<768px) uses bottom tab navigation |
| **Breadcrumbs** | Present on all interior pages except dashboards |
| **Back Button** | Mobile: hardware back button goes to previous logical page |
| **Scroll Position** | Preserved when navigating back in history |
| **Deep Links** | Every internal page has a unique, shareable URL |
| **404 Handling** | Unknown routes show branded 404 with search and suggestions |
| **Role Guarding** | Accessing unauthorized URL → 403 page with "contact admin" message |

---

*End of Phase 3 — Information Architecture & Navigation*

**Next: Phase 4 — Full Database Schema**

*Confirm readiness to proceed to Phase 4.*
