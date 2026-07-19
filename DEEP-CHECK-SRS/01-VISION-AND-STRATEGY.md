# DEEP CHECK — Software Requirements Specification

## Phase 1: Product Vision & Strategy

---

## 1. EXECUTIVE SUMMARY

**Product Name:** Deep Check  
**Tagline:** Deep Learning Diagnostic Intelligence Platform  
**Version:** 1.0.0  
**Status:** SRS v1.0  
**Author:** Product & Strategy Team  

Deep Check is a **learning diagnostic intelligence platform** that identifies every learning gap, misconception, and cognitive weakness before a learner progresses to the next educational level. Unlike traditional examination platforms that measure what a student knows, Deep Check measures **what a student is missing** and prescribes a precise remediation path.

The platform serves four distinct user roles — Ultimate Admin, School Portal, Parent Portal, and Guest Learners — across three critical transition points in the Nigerian (and global) educational system: Primary 6 → JSS1, JSS3 → SS1, and SS3 → University, with architecture designed to expand to every class globally.

Deep Check is not a Computer-Based Test (CBT) platform. It is not an examination website. It is not a quiz system. It is a **diagnostic intelligence engine** that combines educational psychology, cognitive science, psychometrics (Item Response Theory), Bayesian Knowledge Tracing, adaptive testing (Computerized Adaptive Testing), learning analytics, and AI-powered recommendation systems to produce the deepest possible understanding of each learner's mind.

The platform generates:
- **Deep Reports** (₦3,000 per report; free basic reports)
- **Personalized Learning Plans** (daily, weekly, monthly, 90-day)
- **Institutional Quality Diagnostics** (school-level analytics)
- **Parenting Diagnostics** (home learning environment evaluation)
- **AI Recommendations** for students, teachers, parents, schools, and administrators

---

## 2. VISION STATEMENT

To become the world's definitive learning diagnostic platform — the essential prerequisite before any learner, anywhere, advances to the next level of their educational journey.

We envision a world where no learner progresses with hidden gaps. Every weakness is known. Every misconception is catalogued. Every cognitive skill is measured. Every learner receives a precise, personalized, and actionable roadmap to mastery before it is too late.

---

## 3. MISSION STATEMENT

To uncover every hidden weakness preventing learner mastery through advanced psychometric diagnostics, AI-powered analytics, and deeply personalized recommendations — empowering students, parents, teachers, schools, and governments with the intelligence needed to make informed educational decisions.

---

## 4. CORE VALUES

| Value | Definition |
|-------|-----------|
| **Diagnostic Truth** | We measure what is missing, not just what is present. We surface weaknesses even when learners and teachers do not know they exist. |
| **Scientific Rigor** | Every algorithm is grounded in peer-reviewed psychometric research, cognitive science, and learning analytics. |
| **Radical Personalization** | No two learners are the same. Every report, plan, and recommendation is unique to the individual. |
| **Actionable Intelligence** | Insights must lead to action. Every data point comes with a "what to do next." |
| **Fairness & Equity** | The system must not disadvantage any learner based on language, socioeconomic status, disability, or school type. |
| **Privacy First** | Learner data is sacred. Maximum data utility with minimum data exposure. |

---

## 5. PRODUCT STRATEGY

### 5.1 Strategic Pillars

| Pillar | Description |
|--------|-------------|
| **Diagnostic Depth** | Go deeper than any competitor in identifying root causes of learning difficulties. |
| **Adaptive Intelligence** | Every question is chosen algorithmically to extract maximum diagnostic information per item. |
| **Multi-Stakeholder Insight** | Serve not just the learner but everyone who influences learning outcomes. |
| **Scalable Architecture** | Free-forever tech stack capable of scaling to millions of concurrent users. |
| **Revenue Through Value** | Free basic diagnostics; premium deep reports; institutional licenses. |

### 5.2 Competitive Positioning

| Competitor Type | Key Players | Deep Check Difference |
|----------------|-------------|----------------------|
| CBT Platforms | ExamSoft, ProProfs, local CBTs | We do not grade; we diagnose. We do not test memory; we test cognition. |
| Quiz Platforms | Kahoot, Quizlet, Quizizz | We are adaptive and psychometric, not gamified recall. |
| Learning Platforms | Khan Academy, Coursera, Udemy | We are diagnostic-first, not content-first. We identify gaps before prescribing content. |
| Assessment Tools | NWEA MAP, Renaissance Star | We are more affordable, more detailed, AI-powered, and multi-stakeholder. |
| Analytics Tools | Power BI, Tableau (in education) | We are purpose-built for learning diagnostics, not generic dashboards. |

### 5.3 Target Market (Phase 1)

| Segment | Description | Size Estimate (Nigeria) |
|---------|-------------|------------------------|
| Primary 6 → JSS1 | Transition students | ~3M/year |
| JSS3 → SS1 | Transition students | ~2.5M/year |
| SS3 → University | University aspirants | ~2M/year |
| Private Schools | K-12 institutions | ~20,000 schools |
| Public Schools | K-12 institutions | ~80,000 schools |
| Parents | Middle/upper income | ~10M parents |

### 5.4 Revenue Model

| Revenue Stream | Description | Price |
|----------------|-------------|-------|
| Free Basic Diagnostic | 1 free assessment + basic report per user | Free |
| Deep Report | Full diagnostic deep report per assessment | ₦3,000 (admin-configurable) |
| School Bulk Plan | Bulk deep report credits for schools | ₦100–500/student (tiered) |
| Parent Bundle | 5, 10, 25 deep report packs | ₦10,000–40,000 |
| Institution License | Unlimited school-wide diagnostics + admin | ₦500k–5M/year |
| Subscription Pro | Monthly deep reports + personalized daily plan | ₦5,000/month |
| White Label | Enterprise white-label deployment | Custom pricing |

### 5.5 Success Metrics (KPIs)

| Metric | Target (Year 1) | Target (Year 3) |
|--------|-----------------|-----------------|
| Registered Users | 100,000 | 2,000,000 |
| Active Schools | 500 | 5,000 |
| Assessments Completed | 500,000 | 20,000,000 |
| Deep Reports Purchased | 50,000 | 1,500,000 |
| Revenue (Annual) | ₦150M | ₦3B |
| Net Promoter Score (NPS) | 60+ | 80+ |
| Assessment Completion Rate | >85% | >92% |
| Report Use Rate (read full report) | >70% | >85% |
| Recommendation Follow-Through | >40% | >65% |
| Uptime (SLA) | 99.5% | 99.9% |

---

## 6. PRODUCT PRINCIPLES

1. **Diagnosis Before Treatment** — No recommendation is made without sufficient diagnostic data. Minimum assessment length: 30 items. Maximum: adaptive until theta error < 0.3.
2. **One Gap Is Too Many** — The system must surface every detectable gap. False negatives (missing a gap) are worse than false positives.
3. **Transparent Algorithms** — Every score, recommendation, and classification must be explainable to educators and (in simplified form) to parents and students.
4. **Continuous Improvement** — Item parameters are recalibrated after every 500 responses. Misconception models are updated weekly. Recommendation effectiveness is measured and optimized monthly.
5. **Offline Resilience** — Core assessment engine must be capable of eventual consistency. Network interruption mid-assessment must not lose progress.
6. **Mobile-First** — 80%+ of Nigerian users will access via mobile. All UIs must be responsive and performant on 3G-class networks.
7. **Free Tier Is Generous** — The free tier must provide genuine value (full assessment + basic report) to build trust and demonstrate diagnostic depth before purchase.

---

## 7. COMPETITIVE LANDSCAPE (Detailed)

### 7.1 Direct Competitors

| Feature | Deep Check | NWEA MAP Growth | Renaissance Star 360 | Khan Academy Diagnostics | Local CBTs |
|---------|-----------|-----------------|---------------------|------------------------|------------|
| Adaptive Testing | ✅ CAT (3PL IRT) | ✅ CAT | ✅ CAT | ❌ Fixed | ❌ Fixed |
| Misconception Detection | ✅ BKT + Pattern Match | ❌ | ❌ | Partial | ❌ |
| Multi-Role Dashboards | ✅ 4 roles | ❌ Teacher only | ❌ Teacher only | ❌ Learner only | ❌ |
| Deep Reports | ✅ AI-Powered | ❌ Basic | ❌ Basic | ❌ | ❌ |
| AI Recommendations | ✅ Personalized | ❌ | ❌ | ❌ | ❌ |
| School Diagnostic | ✅ Yes | Partial | Partial | ❌ | ❌ |
| Parent Diagnostic | ✅ Yes | ❌ | ❌ | ❌ | ❌ |
| Cognitive Skill Analysis | ✅ Yes | ❌ | ❌ | ❌ | ❌ |
| Learning Velocity | ✅ Yes | Partial | Partial | ❌ | ❌ |
| Growth Projection | ✅ Yes | ✅ Yes | ✅ Yes | ❌ | ❌ |
| Pricing | Low (Free+) | High ($5-15/student) | High ($4-12/student) | Free | Low |
| Nigerian Curriculum | ✅ Full | ❌ | ❌ | ❌ | ✅ Partial |

### 7.2 Indirect Competitors

- **Google Classroom** — Not diagnostic but widely adopted
- **Microsoft Teams for Education** — Collaboration, not diagnostics
- **Edmodo** — Social learning, not diagnostic
- **SchoolPoint** — School management, not diagnostic

Deep Check occupies a unique position: pure diagnostic intelligence that integrates with (rather than competes with) existing school management platforms.

---

## 8. REGULATORY & COMPLIANCE CONSIDERATIONS

| Domain | Requirement |
|--------|-------------|
| **Data Protection (NDPR)** | Nigerian Data Protection Regulation compliance required |
| **GDPR** | Must be GDPR-compliant for international expansion |
| **COPPA** | Children's Online Privacy Protection Act (users under 13) |
| **FERPA** | US Family Educational Rights and Privacy Act (future US expansion) |
| **NUC/NERDC Standards** | Must align with Nigerian national curriculum standards |
| **WAEC/NECO/JAMB Alignment** | Assessment content must align with national exam syllabi |
| **UNESCO ICT in Education** | Should align with UNESCO competency framework |

---

## 9. TECH STACK PHILOSOPHY (Free-Forever)

All infrastructure decisions prioritize:

1. **Generous free tiers** — Every service must have a free tier sufficient for MVP launch (up to 100K users)
2. **No vendor lock-in** — Where possible, use open standards so migration is feasible
3. **Pay-as-you-grow** — Costs should scale linearly with usage, not jump at tier boundaries
4. **Serverless-first** — Zero idle cost, auto-scaling, low operational overhead
5. **Edge-ready** — Low latency for global users

| Layer | Primary Choice | Free Tier Capacity | Rationale |
|-------|---------------|-------------------|-----------|
| **Frontend** | Next.js 14+ (React) | Unlimited (Vercel Hobby) | SSR, API routes, App Router, edge functions |
| **Backend** | Next.js API routes + tRPC | Unlimited (Vercel Hobby) | Single codebase, type-safe, no extra server cost |
| **Database** | Neon (PostgreSQL) | 0.5GB storage, 100h compute/month | Serverless Postgres, branching, generous free tier |
| **ORM** | Drizzle ORM | Free | Lightweight, type-safe, better DX than Prisma for serverless |
| **Auth** | NextAuth.js (Auth.js) v5 | Free | Open-source, supports 80+ providers, built for Next.js |
| **Caching** | Upstash Redis | 10K commands/day, 256MB | Serverless Redis, REST API, no persistent connection needed |
| **Queue / Jobs** | Inngest | 2K runs/month free | Serverless queues, cron, step functions |
| **File Storage** | Vercel Blob / Uploadthing | 2GB / 2GB | Image/uploads for avatars, question images |
| **Search** | Meilisearch Cloud (Free) | 10K docs, 1GB storage | Typo-tolerant full-text search |
| **Email** | Resend | 100 emails/day free | React email components, high deliverability |
| **SMS** | Termii / Twilio | Pay-as-you-go | Nigerian SMS gateway |
| **Payments** | Paystack + Flutterwave + Stripe | Free | Nigerian + International payment processing |
| **AI / LLM** | Vercel AI SDK + OpenRouter | Pay-per-token (~$0.50/1M tokens) | Multi-model access, no monthly fee |
| **Charts** | Recharts + D3.js | Free | React-native charts, highly customizable |
| **Maps / Graphs** | Cytoscape.js / vis-network | Free | Knowledge graph visualization |
| **PDF** | @react-pdf/renderer | Free | Server-side PDF generation for reports |
| **Analytics** | PostHog Cloud (Free) | 1M events/month | Product analytics, session recording, feature flags |
| **Monitoring** | Sentry (Free) | 5K errors/month | Error tracking, performance monitoring |
| **CI/CD** | GitHub Actions | 2000 min/month free | Build, test, deploy automation |
| **DNS** | Cloudflare (Free) | Unlimited | CDN, DDoS protection, SSL |
| **State** | Zustand + TanStack Query | Free | Client state + server state management |
| **Styling** | Tailwind CSS + shadcn/ui | Free | Utility-first CSS + accessible component library |
| **Animations** | Framer Motion | Free | Declarative animations, gesture support |
| **Documentation** | Nextra / Mintlify | Free (self-hosted) / Free tier | Developer documentation |

---

## 10. CONSTRAINTS & ASSUMPTIONS

### 10.1 Constraints

1. **Free tier infrastructure must support first 100,000 users** without paid upgrades
2. **Nigerian mobile-first** — Optimize for Android (70%+ market share), Chrome, 3G/4G networks
3. **Local currency pricing** — All Nigerian pricing in Naira (₦); international in USD
4. **Low bandwidth tolerance** — Core assessment must work on connections as low as 200kbps
5. **Offline completion** — If network drops mid-assessment, answers must be preserved and submitted when connectivity resumes

### 10.2 Assumptions

1. Users have access to a smartphone or shared device with internet connectivity at least once per week
2. Schools have at least one administrator capable of basic computer operations
3. Parents are willing to pay for diagnostic depth that translates to actionable improvement
4. The Nigerian education system continues to use the NERDC 9-Year Basic Education Curriculum and Senior Secondary curriculum
5. WAEC, NECO, and JAMB remain the primary terminal assessment bodies

---

## 11. PHASED ROADMAP

### Phase 1 — MVP (Months 1-4)
- Core assessment engine (Primary 6 → JSS1)
- Guest mode (individual learner)
- Basic report (free)
- Deep Report (paid, ₦3,000)
- Paystack integration
- Landing page (light/dark mode)
- NextAuth authentication (email + Google)
- Basic analytics dashboard

### Phase 2 — School & Parent (Months 5-8)
- School Portal (registration, teachers, classes, sessions, terms)
- Parent Portal (link children, view reports)
- JSS3 → SS1 assessment content
- School Quality Diagnostic Report
- Parent Diagnostic Report
- Bulk payment system
- Admin Panel (Phase 1: users, questions, reports, payments)

### Phase 3 — AI & Analytics (Months 9-12)
- SS3 → University assessment content
- AI Recommendation Engine (students, parents, teachers, schools)
- Full analytics dashboard suite
- Knowledge graph visualization
- Learning velocity tracking
- Prediction engine
- Growth projection

### Phase 4 — Enterprise (Months 13-18)
- Institution License system
- White-label deployment
- API marketplace
- Advanced Admin Panel (all permissions, audit logs, CMS, feature flags)
- Full RBAC implementation
- Multi-language support (Yoruba, Hausa, Igbo, French)
- Accessibility (WCAG 2.1 AA)

### Phase 5 — Scale (Months 19-24)
- All remaining class transitions (every class level)
- Flutterwave + Stripe
- Subscription model
- Mobile apps (React Native)
- Offline-first mode (PWA + native)
- Advanced analytics (ML models for recommendation effectiveness)
- Government/State-level dashboards

---

## 12. RISK REGISTER (High-Level)

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Low internet penetration in target regions | High | High | Offline-capable PWA; SMS-based result delivery |
| Low willingness to pay for reports | Medium | High | Free basic report must demonstrate clear value; school bulk purchasing reduces individual friction |
| Psychometric validity challenged | Medium | Critical | Engage educational psychologists in item design; continuous IRT calibration; transparent methodology |
| Competitor copies core features | Medium | Medium | Network effects (school data moat); continuous AI recommendation improvement; brand trust |
| Regulatory changes (data privacy) | Low | High | Privacy-by-design architecture; data localization in Nigeria; legal counsel on retainer |
| Scaling costs exceed free tier limits | Medium | Medium | Designed for linear scaling; reserve paid tier at each layer; aggressive caching strategy |
| Teacher resistance to adoption | High | Medium | Teacher-centric UI; training materials; demonstrable time savings; integration with existing tools |

---

## 13. STRATEGIC PARTNERSHIPS (Target)

| Partner Type | Target Organizations | Value |
|-------------|---------------------|-------|
| **Telcos** | MTN, Glo, Airtel, 9mobile | Zero-rated data for Deep Check; USSD-based result delivery |
| **Exam Bodies** | WAEC, NECO, JAMB | Official curriculum alignment; post-exam diagnostic integration |
| **Schools Association** | ANCOPPS, NAPPS | Bulk adoption across member schools |
| **EdTech Hubs** | CcHUB, Co-Creation Hub | Ecosystem integration, credibility, distribution |
| **Government** | UBEC, SUBEB, Ministry of Education | State-level adoption, public school access, funding |
| **Payment** | Paystack, Flutterwave | Preferential processing rates; feature access |

---

## 14. AI & DATA MOAT STRATEGY

Deep Check's long-term defensibility comes from data network effects:

1. **Item Response Data** — Every response improves item parameter estimates (item pool gets smarter with each use)
2. **Misconception Database** — The system builds the largest known database of learner misconceptions mapped to curriculum concepts
3. **Recommendation Effectiveness** — Track whether recommendations were followed and their impact, continuously improving the recommendation engine
4. **Learning Trajectory Data** — Longitudinal data of how learners progress across transition points creates a unique dataset for predicting future performance
5. **School Benchmarking** — As more schools join, the comparative analytics become exponentially more valuable

The combination of these five data moats makes Deep Check progressively harder to replicate over time.

---

*End of Phase 1 — Product Vision & Strategy*

**Next: Phase 2 — User Personas & Flows**

*Confirm readiness to proceed to Phase 2.*
