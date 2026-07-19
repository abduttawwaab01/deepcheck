# DEEP CHECK — Software Requirements Specification

## Phase 2: User Personas & Flows

---

## 1. PRIMARY PERSONAS

### 1.1 Persona A — Ultimate Admin

| Field | Value |
|-------|-------|
| **Name** | Mr. Chidi Okonkwo |
| **Age** | 38 |
| **Role** | Platform Administrator / Product Owner |
| **Location** | Lagos, Nigeria |
| **Education** | B.Sc. Computer Science, M.Sc. Educational Technology |
| **Experience** | 10 years in EdTech platform management |
| **Technical Level** | Expert |

**Goals:**
- Maintain 99.9% platform uptime
- Onboard 500+ schools in Year 1
- Ensure data integrity across all user segments
- Manage pricing, promotions, and revenue optimization
- Review and approve all question content before publication
- Monitor system health and respond to incidents
- Generate business intelligence reports for stakeholders

**Pain Points:**
- Currently no centralized view of platform health
- Question quality control is manual and time-consuming
- Cannot A/B test pricing models
- Limited visibility into user behavior patterns before problems appear
- Audit trail is fragmented across systems

**Behavioral Traits:**
- Data-driven decision maker
- Prefers dashboards to raw data
- Checks system metrics 3-5x daily
- Authoritative but collaborative with school partners
- Security-conscious

**Technical Requirements:**
- Real-time system monitoring dashboard
- Bulk user management with CSV/Excel import/export
- Role-based access control with granular permissions
- Question banking with workflow (draft → review → approve → publish)
- Payment analytics with refund processing
- Audit log with search and export
- Feature flag management for gradual rollouts
- AI prompt template editor
- CMS for landing page and content pages
- Email/SMS template editor
- Backup and restore with one-click restore
- API key management with rate limiting

---

### 1.2 Persona B — School Administrator

| Field | Value |
|-------|-------|
| **Name** | Mrs. Funmilayo Adebayo |
| **Age** | 45 |
| **Role** | School Administrator / ICT Coordinator |
| **School** | Gracefield International College, Ibadan |
| **Education** | B.Ed. Educational Administration |
| **Experience** | 15 years in school administration |
| **Technical Level** | Intermediate (comfortable with web apps, not with code) |

**Goals:**
- Diagnose every student's learning gaps before promotion exams
- Provide parents with evidence-based progress reports
- Identify weak teachers and subjects needing intervention
- Improve school's overall academic performance metrics
- Streamline assessment processes (replace paper-based exams)
- Generate comprehensive school quality reports for board meetings

**Pain Points:**
- Teachers create exams manually; inconsistency in quality
- Cannot easily identify which students need remediation
- Parents demand detailed progress data she cannot provide
- No way to benchmark school performance against others
- Assessment results take weeks to process manually
- Cannot track learning velocity across terms

**Behavioral Traits:**
- Values structured workflows
- Print-oriented (likes physical reports for meetings)
- Budget-conscious (needs to justify every expense)
- Status-conscious (wants school to rank highly)
- Delegates technical work to ICT staff

**User Flow (Typical Session):**
1. Login to School Portal
2. View school dashboard (overall readiness score, performance trends)
3. Drill into Class 5A → see student rankings
4. Select student "Adeola S." → view full profile
5. See Adeola's weak concepts list → Critical Thinking score of 34%
6. Access Deep Report for Adeola → download PDF
7. Schedule parent-teacher meeting using built-in scheduler
8. View Teaching Quality dashboard → see Teacher "Mr. Bala" has low student reasoning scores
9. Send automated notification to Mr. Bala with recommendation
10. Generate School Quality Diagnostic Report → download for board meeting

---

### 1.3 Persona C — Student (Primary/Secondary)

| Field | Value |
|-------|-------|
| **Name** | Adeola Samuel |
| **Age** | 11 |
| **Role** | Primary 6 Student |
| **School** | Gracefield International College, Ibadan |
| **Class** | Primary 6A |
| **Technical Level** | Intermediate (uses phone for games and TikTok) |

**Goals:**
- Know if she is ready for JSS1
- Understand subjects she is struggling with
- Get a clear plan to improve
- See her progress visually (charts, badges)
- Avoid embarrassment of failing promotion exams

**Pain Points:**
- Teachers explain topics but she does not know what she does not know
- Parents ask "why is your score low?" and she cannot explain
- Gets anxious about exams
- Does not know how to study effectively
- Spends time reviewing what she already knows instead of what she does not

**Behavioral Traits:**
- Short attention span (needs gamification elements)
- Responds to visual feedback (charts > numbers)
- Competitive (wants to see how she compares — anonymized)
- Social (wants to share achievements with friends)
- Mobile-first (prefers phone over laptop)

**User Flow (Typical Session):**
1. Receive SMS/email: "Adeola, your JSS1 readiness assessment is ready!"
2. Click link → Login with school-provided credentials
3. Onboarding screen: "We'll find your hidden gaps. No studying needed. Just answer honestly."
4. Begin assessment (adaptive — 30-50 questions depending on responses)
5. See question: reads carefully, selects answer, submits
6. After question 15: "Great progress! 50% complete."
7. Complete assessment → Confetti animation → "Assessment Complete!"
8. View Basic Report (free): Overall Readiness Score — 62%
9. See Radar Chart: Reading 78%, Math 55%, Science 61%, Reasoning 42%, Critical Thinking 38%
10. See "Your weakest concept: Logical Deduction — 28%"
11. Receive offer: "Unlock your Deep Report for ₦3,000 — includes full improvement plan"
12. Parent purchases Deep Report
13. Adeola views personalized daily practice plan
14. Completes Day 1 practice (5 minutes)
15. Returns next day for Day 2

---

### 1.4 Persona D — Parent

| Field | Value |
|-------|-------|
| **Name** | Mr. Samuel Adeyemi |
| **Age** | 42 |
| **Role** | Father of 2 (Adeola, 11 and Tunde, 8) |
| **Location** | Ibadan, Nigeria |
| **Occupation** | Bank Manager |
| **Technical Level** | Proficient (uses smartphone heavily for banking, social media, email) |

**Goals:**
- Know exactly how each child is performing academically
- Understand what each child needs to improve
- Get a clear, actionable plan to support each child
- Know if his children are on track for top secondary schools
- Feel confident that he is doing the right things as a parent

**Pain Points:**
- Teachers say "she is doing fine" but provides no evidence
- Does not know how to help with homework effectively
- Unsure if his children have learning gaps that will compound later
- Worried about JSS1 readiness but cannot quantify the risk
- Argues with wife about study routines without data
- Wastes money on expensive tutors without knowing what to focus on

**Behavioral Traits:**
- Values expertise and data (banking background)
- Willing to invest in children's education
- Short on time — wants executive summaries with drill-down
- Compares children's performance (needs to be handled sensitively)
- Prefers WhatsApp/email notifications over app-based communication

**User Flow (Typical Session):**
1. Receives WhatsApp notification: "Adeola's JSS1 Readiness Report is ready"
2. Opens link → Login with phone number + OTP
3. Views Parent Dashboard: shows both children side by side (color-coded)
4. Taps Adeola's card → sees radar chart, readiness score (62%), 3 weakest concepts
5. Scans summary: "Adeola struggles with Logical Deduction and Critical Thinking"
6. Sees Parent Support Index: 71/100
7. Reads: "What you're doing right: Consistent study routine. What to improve: Reduce phone time before bed."
8. Purchases Deep Report (₦3,000 via Paystack)
9. Receives full report: 30-page PDF with improvement plans for Adeola
10. Scrolls to "Daily Plan" — sees 5-minute daily exercises
11. Reads "Family Learning Plan" — scheduled weekend activities
12. Shares plan with wife via WhatsApp
13. Books a call with school counselor (integrated scheduling)

---

### 1.5 Persona E — Teacher

| Field | Value |
|-------|-------|
| **Name** | Mr. Bala Musa |
| **Age** | 34 |
| **Role** | Mathematics Teacher, JSS1 |
| **School** | Government Secondary School, Kaduna |
| **Education** | NCE, B.Ed. Mathematics |
| **Experience** | 8 years |
| **Technical Level** | Basic (can use WhatsApp, struggles with complex UIs) |

**Goals:**
- Know exactly which concepts each student has not mastered
- Identify which teaching methods are working
- Spend less time marking and more time teaching
- Get differentiated lesson plans for mixed-ability classes
- Prove his effectiveness to the school administration

**Pain Points:**
- Over 40 students per class; cannot personalize
- Has no data on prerequisite knowledge before starting a topic
- Administrators evaluate him based on exam scores, not learning growth
- Spends weekends marking papers instead of preparing lessons
- Frustrated when students fail despite his effort — does not know why

**Behavioral Traits:**
- Values practical, classroom-ready outputs
- Overwhelmed by dashboards with too much data
- Trusts recommendations from "experts" (the platform)
- Needs recommendations that account for limited classroom time
- Prefers printed reports for lesson planning

---

## 2. SECONDARY & EDGE-CASE PERSONAS

### 2.1 Persona F — Guest Learner (Individual)

| Field | Value |
|-------|-------|
| **Name** | Chidera Okeke |
| **Age** | 17 |
| **Role** | SS2 Student (no school account) |
| **Location** | Onitsha, Anambra |
| **Technical Level** | High (uses smartphone for everything) |

**Use Case:** Discovered platform via social media ad. Registered independently. Takes assessment to know if she is ready for SS3. Has no school or parent linked.

**Special Requirements:**
- Simple registration (email + password or Google OAuth)
- Single-user dashboard
- Purchase Deep Report individually
- No school affiliation required
- Can later link to a school
- Can later invite a parent

---

### 2.2 Persona G — Parent with Multiple Children in Different Schools

| Field | Value |
|-------|-------|
| **Name** | Dr. Ngozi Eze |
| **Age** | 48 |
| **Occupation** | Medical Doctor |
| **Children** | 3 (one in P6, two in SS2) |
| **Schools** | 2 different schools |

**Special Requirements:**
- Link multiple children from different schools to one parent account
- Unified dashboard with per-child toggle
- Cross-school comparison view (same parent, multiple children)
- Bulk purchase of deep reports (discount for 3+)

---

### 2.3 Persona H — Ultimate Admin (System Engineer Delegated)

| Field | Value |
|-------|-------|
| **Name** | Tunde Balogun |
| **Age** | 29 |
| **Role** | Platform Engineer (delegated admin) |
| **Technical Level** | Expert (DevOps, backend, security) |

**Special Requirements:**
- API key management for third-party integrations
- Server log access (via admin or directly)
- Database migration tools
- Backup verification
- Deploy rollback capability
- Feature flag configuration

---

### 2.4 Persona I — School Owner / Proprietor

| Field | Value |
|-------|-------|
| **Name** | Chief Mrs. Folashade Williams |
| **Age** | 55 |
| **Role** | Proprietress, Excel College |
| **Technical Level** | Low (uses assistant for technology) |

**Special Requirements:**
- Executive dashboard (high-level KPIs only)
- Can delegate school admin role to ICT Coordinator
- Receives monthly school diagnostic report via email
- Board-ready PDF exports
- Can authorize payments

---

## 3. USER JOURNEY MAPS

### 3.1 Student Journey (School-Registered)

| Stage | Actions | Touchpoints | Emotions | Opportunities |
|-------|---------|-------------|----------|---------------|
| **Discovery** | School announces assessment day; sends login credentials | School notice, email, SMS | Curious, slightly anxious | Explain purpose clearly: "Not an exam. No grading. Just finding gaps." |
| **Registration** | Click link → OTP verification → Complete profile | Landing page, Auth | Neutral | Pre-filled data from school. Avatar selection. |
| **Onboarding** | Welcome animation → "How it works" (3 steps) → Sample question | Onboarding screens | Engaged | Gamified intro. Show radar chart preview. "See your brain's strengths!" |
| **Assessment** | Answer adaptive questions (30-50 items) | Assessment module | Focused, some fatigue | Progress bar. Break every 10 items. Motivational messages. Time remaining (non-stressful). |
| **Completion** | Submit → Processing animation → Confetti → Score preview | Results screen | Excited, curious | Shareable score card (if opted in). "You completed more than 85% of peers!" |
| **Basic Report** | View free report (readiness score, radar chart, top 3 weaknesses) | Report viewer | Hopeful, wanting more | Clear CTA to Deep Report. "Unlock your full brain map — ₦3,000" |
| **Deep Report** | Purchase → Full report with all charts, plans, recommendations | Report viewer + PDF | Impressed, motivated | Comprehensive. Downloadable. Printable. |
| **Daily Practice** | Complete daily 5-min exercises | Practice module | Habitual | Streak counter. Notification reminders. |
| **Follow Assessment** | Re-assess after 30 days → see growth | Assessment module | Proud, confident | Growth visualization. "You improved 15% in Critical Thinking!" |

### 3.2 School Administrator Journey

| Stage | Actions | Touchpoints | Emotions | Opportunities |
|-------|---------|-------------|----------|---------------|
| **Discovery** | Sees ad at education conference / referral from another school | Conference, referral, ad | Skeptical, interested | Request demo. Free trial for 1 class. |
| **Registration** | Sign up → Verify school email → Complete school profile | Onboarding flow | Cautious | Show case study of similar school. 5-minute onboarding video. |
| **Setup** | Upload class list (CSV) → Assign teachers → Define sessions/terms | Setup wizard | Overwhelmed | Bulk upload template. Drag-and-drop class creation. |
| **Invite Students** | System sends invites to all students via SMS/email | Invitation system | Satisfied | Progress bar: "347/400 students activated" |
| **First Assessment** | Schedule assessment window for all P6 students | Assessment scheduler | Anticipating | Choose date range. Set time limits. Proctoring options. |
| **Monitor Live** | Watch real-time completion dashboard | Live dashboard | Anxious | Completion rate. Average time. Flagged students (disconnected, too fast, etc.). |
| **Results Overview** | View class-level results after all complete | Results dashboard | Curious | Compare sections. Identify trends. |
| **Deep Dive** | Drill into individual student → Export reports → Identify interventions | Student detail | Analytical | Sort by weakness. Batch actions. "Send remediation plan to all students with <50% in Math." |
| **School Report** | Generate School Quality Diagnostic Report | School report | Proud or concerned | Benchmark against similar schools. Year-over-year comparison. |
| **Action** | Share reports with teachers → Schedule parent meetings → Implement recommendations | Communications hub | Proactive | One-click send to parents. Auto-generate teacher improvement plans. |
| **Review** | End-of-term review → Compare with previous term | Dashboard | Reflective | Highlight improvements. Identify persistent gaps. Plan next term. |

### 3.3 Parent Journey

| Stage | Actions | Touchpoints | Emotions | Opportunities |
|-------|---------|-------------|----------|---------------|
| **Discovery** | School sends onboarding email: "Track your child's readiness" | Email/WhatsApp from school | Interested | Welcome message from school principal. |
| **Registration** | Click link → OTP (phone) → Link child via code | Mobile-optimized flow | Cautious | Demonstrate value before asking for payment. |
| **First View** | See child's basic dashboard (free) | Parent dashboard | Curious | "Here's what we know about your child's learning so far." |
| **Basic Report** | View radar chart, readiness score | Report viewer | Wanting more | "See what's inside the Deep Report" — preview carousel. |
| **Purchase Deep Report** | Pay ₦3,000 via Paystack | Payment flow | Investment-minded | One-click purchase. Save card for future. Bundle discount. |
| **Report Review** | Read full report → watch video explanation | Report viewer + PDF | Enlightened | Highlight actionable items. "Start with these 3 things tonight." |
| **Parent Diagnostic** | Complete parent questionnaire → receive Parent Support Index | Questionnaire | Reflective | Non-judgmental tone. "No parent is perfect. Let's find your strengths." |
| **Take Action** | Implement daily plan → Adjust study routine → Reduce phone time | Action plan | Motivated | Weekly check-in notifications. Progress tracking. |
| **Follow-up** | Receive monthly progress update → Compare reports | Notification | Satisfied | "Your child improved 12% since last month. Here's why." |

### 3.4 Guest Learner Journey

| Stage | Actions | Touchpoints | Emotions | Opportunities |
|-------|---------|-------------|----------|---------------|
| **Discovery** | Social media ad: "How ready are you for SS1?" | Instagram, Facebook, Google | Intrigued | Clear value proposition. "2 minutes to discover what you don't know." |
| **Registration** | Email + password or Google OAuth → Complete profile | Simple form | Fast, frictionless | No school required. No parent required. Personal autonomy. |
| **Free Assessment** | Take adaptive assessment | Assessment module | Engaged | Same quality as school users. No feature gating on assessment. |
| **Basic Report** | Free report with readiness score + radar chart + top gaps | Report viewer | Impressed | "Here's what you're missing. Want the full picture?" |
| **Deep Report** | Purchase deep report → Full analytics | Payment + Report | Committed | Compare with school-based peers (anonymized). |
| **Ongoing** | Retake assessments → Track growth over time | Dashboard | Progress-oriented | Personal learning journey. No school boundaries. |
| **Optional Link** | Connect to school or invite parent | Settings | Flexible | "Would you like to share this with your school?" |

---

## 4. USER FLOWS (Detailed Step-by-Step)

### 4.1 Authentication & Registration Flows

#### Flow A1: Email / Social Registration (Guest)

```
START
  │
  ├─→ [Click "Get Started" on Landing Page]
  │
  ├─→ Choose Registration Type:
  │     ├─ Student (Individual)
  │     ├─ Parent
  │     ├─ School
  │     └─ Teacher (via School invite)
  │
  ├─→ Student (Individual):
  │     ├─ Enter: Full Name, Email, Phone Number, Class Level
  │     ├─ Choose: Password OR Google OAuth
  │     ├─ Verify: Email (link) OR Phone (OTP)
  │     ├─ Profile Setup: Avatar, State, School (optional)
  │     └─ → Redirect to Dashboard (Onboarding Tour)
  │
  ├─→ Parent:
  │     ├─ Enter: Full Name, Email, Phone Number
  │     ├─ Choose: Password OR Google OAuth
  │     ├─ Verify: Phone (OTP) — required for parent communications
  │     ├─ Link Child: Enter child code (from school) OR search by name/class
  │     ├─ Verify Relationship: consent code sent to child's school contact
  │     └─ → Redirect to Parent Dashboard
  │
  ├─→ School:
  │     ├─ Enter: School Name, Official Email, Phone, Address
  │     ├─ Upload: CAC registration document (for verification)
  │     ├─ Set: Admin credentials (email + password)
  │     ├─ Verify: Official email (link) + Admin phone (OTP)
  │     ├─ Approval: Pending admin approval OR auto-approve (risk-based)
  │     └─ → Redirect to School Setup Wizard
  │
  └─→ Teacher (via School Invite):
        ├─ Receive: Invite email/SMS from School Admin
        ├─ Click: Invite link (token-encoded)
        ├─ Set: Password
        ├─ Verify: Phone (OTP)
        └─ → Redirect to Teacher Dashboard
```

#### Flow A2: Login (All Users)

```
START
  │
  ├─→ [Login Page]
  │
  ├─→ Enter: Email/Phone + Password
  │     ├─ OR Google OAuth
  │     ├─ OR OTP (phone)
  │     └─ OR Magic Link (email)
  │
  ├─→ Validate Credentials
  │     ├─ Success: Issue JWT + Refresh Token
  │     └─ Fail: Show error (max 5 attempts → 15min lockout)
  │
  ├─→ Check MFA (if enabled for admin roles)
  │     ├─ Send OTP to authenticator app
  │     └─ Verify OTP
  │
  ├─→ Route to Role-Based Dashboard:
  │     ├─ Admin → Admin Dashboard
  │     ├─ School Admin → School Dashboard
  │     ├─ Teacher → Teacher Dashboard
  │     ├─ Student → Student Dashboard
  │     ├─ Parent → Parent Dashboard
  │     └─ Guest → Guest Dashboard
  │
  └─→ [END]
```

### 4.2 Assessment Flows

#### Flow AS1: Start Assessment

```
START
  │
  ├─→ [User clicks "Start Assessment"]
  │
  ├─→ Check Eligibility:
  │     ├─ User has active subscription OR school has credits
  │     ├─ Not within cooldown period (min 7 days between assessments)
  │     ├─ No incomplete assessment (prompt to resume)
  │     └─ No technical issues (browser compatibility check)
  │
  ├─→ Pre-Assessment Setup:
  │     ├─ Confirm subject(s) to assess
  │     ├─ Set time expectations ("30-50 questions, ~25 minutes")
  │     ├─ Environment check: "Find a quiet place, you cannot pause"
  │     └─ Consent: "I agree to complete this assessment honestly"
  │
  ├─→ Load Assessment Engine:
  │     ├─ Fetch initial item (starting difficulty: theta = 0)
  │     ├─ Render question interface
  │     └─ Start timer
  │
  └─→ [Assessment In Progress]
```

#### Flow AS2: Answer Question (Adaptive Loop)

```
[Question Rendered]
  │
  ├─→ User reads question
  │
  ├─→ User selects answer (or skips — skip marked as incorrect with flag)
  │
  ├─→ Record:
  │     ├─ Answer selected
  │     ├─ Response time (ms)
  │     ├─ Answer changes (if any, track hover activity)
  │     └─ Confidence indicator (optional slider or implicit from timing)
  │
  ├─→ Evaluate:
  │     ├─ Correct? → Update theta estimate upward
  │     ├─ Incorrect? → Update theta estimate downward
  │     └─ Update misconception probability vector
  │
  ├─→ Check Termination Criteria:
  │     ├─ MAX_ITEMS reached (50)
  │     ├─ Theta standard error < 0.30 (high confidence)
  │     ├─ MIN_ITEMS completed (30) AND SE < 0.35
  │     ├─ Time limit exceeded (45 min absolute max)
  │     └─ OR user requests to end (honored with warning)
  │
  ├─→ If continue:
  │     ├─ Select next item: maximize Fisher Information at current theta
  │     ├─ Ensure content constraints (subject/topic coverage)
  │     ├─ Avoid item exposure > 80% (item pool management)
  │     └─ → Render next question
  │
  └─→ If terminate:
        ├─ Save all responses
        ├─ Run final theta estimate (Bayesian EAP)
        ├─ Run misconception detection algorithm
        ├─ Generate readiness scores
        └─ → [Assessment Complete]
```

#### Flow AS3: Resume Interrupted Assessment

```
START
  │
  ├─→ User logs in → dashboard shows "Incomplete Assessment"
  │
  ├─→ Click "Resume Assessment"
  │
  ├─→ Load saved state:
  │     ├─ All previous answers stored locally (IndexedDB) + synced to server
  │     ├─ Current theta estimate
  │     ├─ Current item index
  │     ├─ Time remaining
  │     └─ Items already shown
  │
  ├─→ Verify session not expired (>24 hours = force restart)
  │
  ├─→ Restore question interface with last question in view
  │
  └─→ [Continue Adaptive Loop]
```

### 4.3 Payment Flows

#### Flow P1: Purchase Deep Report (Individual)

```
START
  │
  ├─→ [User completes assessment → sees Basic Report]
  │
  ├─→ Click "Unlock Deep Report — ₦3,000"
  │
  ├─→ Payment Options:
  │     ├─ Paystack (Card, Bank Transfer, USSD, QR)
  │     ├─ Flutterwave (Card, Bank, Mobile Money)
  │     └─ Stripe (International cards)
  │
  ├─→ Select Payment Method:
  │     ├─ Card: Enter card details → Paystack/Flutterwave iframe
  │     ├─ Bank Transfer: Get virtual account number → User transfers → System confirms
  │     ├─ USSD: Get USSD code → User dials → System confirms
  │     └─ Wallet (future): Use stored balance
  │
  ├─→ Transaction:
  │     ├─ Generate unique transaction ID
  │     ├─ Amount: ₦3000 (or current price from admin settings)
  │     ├─ Apply coupon if applicable
  │     ├─ Send to payment provider
  │     └─ Handle callback/webhook
  │
  ├─→ On Success:
  │     ├─ Mark report as unlocked
  │     ├─ Send receipt via email + SMS
  │     ├─ Generate Deep Report
  │     ├─ Redirect to Deep Report viewer
  │     └─ Trigger post-purchase email sequence (tips, next steps)
  │
  ├─→ On Failure:
  │     ├─ Show friendly error (specific: "card declined", "insufficient funds")
  │     ├─ Offer alternative payment method
  │     └─ Save progress — user can retry within 7 days
  │
  └─→ [END]
```

#### Flow P2: School Bulk Purchase

```
START
  │
  ├─→ [School Admin → "Purchase Credits"]
  │
  ├─→ Select Plan:
  │     ├─ 50 Credits: ₦150,000 (₦3,000/report)
  │     ├─ 200 Credits: ₦450,000 (₦2,250/report — 25% off)
  │     ├─ 500 Credits: ₦875,000 (₦1,750/report — 42% off)
  │     └─ Custom: Enter number of credits
  │
  ├─→ Assign Credits:
  │     ├─ Distribute to specific students immediately
  │     ├─ Keep in pool for teacher/manual assignment
  │     └─ Auto-distribute based on assessment completion
  │
  ├─→ Payment:
  │     ├─ Invoice generation (for bank transfer)
  │     ├─ Online payment (card/bank via Paystack)
  │     └─ Purchase order (for approved schools, 30-day net)
  │
  ├─→ On Success:
  │     ├─ Credits added to school account
  │     ├─ Students with assigned credits get notification
  │     └─ Receipt and invoice sent
  │
  └─→ [END]
```

### 4.4 Admin Flows

#### Flow A1: Question Management (CRUD + Workflow)

```
START
  │
  ├─→ [Admin → Questions → Create / Import]
  │
  ├─→ Create Single Question:
  │     ├─ Select: Subject → Topic → Subtopic → Concept
  │     ├─ Enter: Question text (rich text, supports LaTeX for math)
  │     ├─ Add: Options (4-6 options)
  │     ├─ Mark: Correct answer
  │     ├─ Set: Difficulty (1-5 or IRT parameters: a, b, c)
  │     ├─ Select: Bloom Level (Remember → Create)
  │     ├─ Select: Cognitive Skill (Problem Solving, Reasoning, etc.)
  │     ├─ Add: Explanation (correct answer reasoning)
  │     ├─ Add: Common mistakes (for each wrong option)
  │     ├─ Add: Learning tip
  │     ├─ Add: Reference material
  │     ├─ Add: Prerequisites (linked concepts)
  │     ├─ Add: Common misconception IDs
  │     └─ Set: Expected time (seconds)
  │
  ├─→ Import Bulk (CSV/Excel/JSON):
  │     ├─ Download template
  │     ├─ Upload file
  │     ├─ Preview parsed questions (validation report)
  │     ├─ Fix errors → re-upload
  │     └─ Confirm import
  │
  ├─→ Workflow:
  │     ├─ Draft (creator only)
  │     ├─ Review → Reviewer checks quality, accuracy, bias
  │     ├─ Changes Requested → Back to Draft
  │     ├─ Approved → Ready for publishing
  │     └─ Published → Available in item pool
  │
  └─→ [Question enters item pool]
```

---

## 5. USER FLOW DIAGRAMS (Text-Based)

### 5.1 Complete User Lifecycle (Student)

```
                        ┌──────────────────────┐
                        │   SCHOOL REGISTERS    │
                        │   ON DEEP CHECK       │
                        └──────────┬───────────┘
                                   │
                        ┌──────────▼───────────┐
                        │   SCHOOL ADMIN       │
                        │   UPLOADS CLASS LIST │
                        └──────────┬───────────┘
                                   │
                        ┌──────────▼───────────┐
                        │ SYSTEM SENDS INVITES │
                        │ (SMS + EMAIL)        │
                        └──────────┬───────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
     │ STUDENT ACTIVATES│  │ PARENT LINKS    │  │ TEACHER ASSIGNS │
     │ ACCOUNT          │  │ ACCOUNT         │  │ ASSESSMENT      │
     └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                        ┌──────────▼───────────┐
                        │   STUDENT COMPLETES  │
                        │   ASSESSMENT         │
                        └──────────┬───────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
     │  BASIC REPORT   │  │  DEEP REPORT    │  │  DEEP REPORT    │
     │  (FREE)         │  │  (PURCHASED)    │  │  (SCHOOL-PAID)  │
     └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                        ┌──────────▼───────────┐
                        │   RECOMMENDATIONS    │
                        │   GENERATED          │
                        └──────────┬───────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
     ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
     │ STUDENT FOLLOWS │  │ TEACHER ADJUSTS │  │ PARENT IMPLEMENTS│
     │ DAILY PLAN      │  │ LESSON PLAN     │  │ SUPPORT PLAN     │
     └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                        ┌──────────▼───────────┐
                        │   RE-ASSESSMENT      │
                        │   AFTER 30 DAYS      │
                        └──────────┬───────────┘
                                   │
                        ┌──────────▼───────────┐
                        │   GROWTH VISUALIZED  │
                        │   "You improved X%"  │
                        └──────────────────────┘
```

---

## 6. ACCESSIBILITY & INCLUSIVITY REQUIREMENTS

| Requirement | Implementation |
|-------------|---------------|
| **Low Literacy Users** | Audio instructions in local languages (Yoruba, Hausa, Igbo, Pidgin). Voice-over for each question. |
| **Visually Impaired** | WCAG 2.1 AA compliant. Screen reader support. High contrast mode. Font size scaling. |
| **Hearing Impaired** | Captions on all videos. Visual indicators for audio cues. |
| **Dyslexia-Friendly** | OpenDyslexic font option. Reduced visual clutter. Pastel background option. |
| **Motor Disabilities** | Larger touch targets (min 48px). Extended time (2x). Voice input for answers (future). |
| **Slow Internet** | Assessment works on 2G. Assets under 50KB per page. Offline answer caching. |
| **Low-End Devices** | Target Android 8+ with 2GB RAM. Lightweight bundle (<500KB initial JS). |
| **Cost Barriers** | Free basic report with genuine value. School bulk pricing. Sliding scale for low-income schools. |

---

## 7. NOTIFICATION PREFERENCES (Per User Type)

| User Type | Email | SMS | WhatsApp | In-App | Push |
|-----------|-------|-----|----------|--------|------|
| Student | ⭐ Assessment ready, Report ready | ⭐ Assessment ready | ❌ | ⭐ All | Optional |
| Parent | ⭐ Report ready, Purchase receipt | ⭐ Urgent (child at risk) | ⭐ Weekly summary | ⭐ All | Optional |
| Teacher | ⭐ Class report ready | ❌ | ❌ | ⭐ All | Optional |
| School Admin | ⭐ School report, Billing | ⭐ System alerts | ❌ | ⭐ All | Optional |
| Guest | ⭐ Report ready, Promotions | ❌ | Optional | ⭐ All | ❌ |
| Admin | ⭐ System alerts, Error reports | ❌ | ❌ | ⭐ All | ⭐ Critical |

⭐ = default enabled

---

*End of Phase 2 — User Personas & Flows*

**Next: Phase 3 — Information Architecture & Navigation**

*Confirm readiness to proceed to Phase 3.*
