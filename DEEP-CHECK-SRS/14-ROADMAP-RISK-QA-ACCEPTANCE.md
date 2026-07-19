# DEEP CHECK — Software Requirements Specification

## Phase 14: Future Roadmap, Risk Assessment, QA Plan & Acceptance Criteria

---

## 1. PHASED IMPLEMENTATION ROADMAP

### Phase 1 — MVP (Months 1-4)

| Component | Deliverable | Priority |
|-----------|-------------|----------|
| **Auth** | Email + Google login, registration, password reset, OTP | P0 |
| **Landing Page** | Hero, How It Works, Features, Pricing, FAQ, Footer | P0 |
| **Assessment Engine** | Fixed-form (non-adaptive) assessment, manual theta calc | P0 |
| **Basic Report** | Readiness score + radar chart + top weaknesses | P0 |
| **Deep Report** | Deep report generation + Paystack payment + PDF | P0 |
| **Guest Dashboard** | Single-user dashboard, assessment history | P0 |
| **Admin Panel** | User CRUD, question CRUD, basic system settings | P0 |
| **Content** | P6→JSS1 subjects + 100 seed questions per subject | P0 |
| **Deployment** | Vercel + Neon + Upstash setup, CI/CD | P0 |
| **Milestone:** | **50 pilot students complete assessment** | |

### Phase 2 — School & Parent (Months 5-8)

| Component | Deliverable | Priority |
|-----------|-------------|----------|
| **School Portal** | Registration, class management, teacher management | P0 |
| **Parent Portal** | Registration, link children, view reports | P0 |
| **School Dashboard** | KPIs, class comparison, subject analysis | P0 |
| **Parent Dashboard** | Multi-child view, progress tracking | P0 |
| **Teacher Dashboard** | Class view, student detail, gap analysis | P0 |
| **Adaptive Engine** | Full CAT algorithm (3PL IRT, EAP) | P1 |
| **Bulk Credit System** | School credit purchase, distribution | P1 |
| **Content Expansion** | JSS3→SS1 subjects + 200 questions | P1 |
| **Milestone:** | **10 schools onboarded, 1000 students** | |

### Phase 3 — AI & Analytics (Months 9-12)

| Component | Deliverable | Priority |
|-----------|-------------|----------|
| **AI Recommendations** | LLM-based recommendations for all 4 roles | P0 |
| **Misconception Detection** | BKT + error pattern matching | P0 |
| **Knowledge Graph** | Concept network visualization | P1 |
| **Advanced Charts** | Heatmap, learning curve, gap distribution | P1 |
| **School Quality Report** | Full school diagnostic | P1 |
| **Parent Diagnostic** | Parent Support Index + questionnaire | P1 |
| **Learning Velocity** | Tracking + projection | P1 |
| **Prediction Engine** | Score projection + risk analysis | P1 |
| **Content Expansion** | SS3→University + 300 questions | P1 |
| **Milestone:** | **50 schools, 10,000 users** | |

### Phase 4 — Enterprise (Months 13-18)

| Component | Deliverable | Priority |
|-----------|-------------|----------|
| **Institution License** | Full school management, custom branding | P1 |
| **White-Label** | Custom domain, logo, colors for schools | P2 |
| **Advanced Admin** | All permissions, audit dashboard, feature flags UI | P1 |
| **CMS** | Blog, pages, SEO management UI | P1 |
| **Full RBAC** | Admin UI for permission management | P1 |
| **Notification Engine** | Email (Resend), SMS (Termii), WhatsApp templates | P1 |
| **Localization** | Yoruba, Hausa, Igbo, French (content + UI) | P2 |
| **Accessibility** | WCAG 2.1 AA compliance audit + fixes | P1 |
| **Flutterwave + Stripe** | Additional payment providers | P1 |
| **Milestone:** | **200 schools, 50,000 users** | |

### Phase 5 — Scale & Platform (Months 19-24)

| Component | Deliverable | Priority |
|-----------|-------------|----------|
| **All Class Levels** | Complete curriculum coverage P1→SS3 | P1 |
| **Subscription Model** | Monthly/yearly subscription plans | P1 |
| **Mobile Apps** | React Native (Android + iOS) | P2 |
| **Offline-First** | PWA with full offline assessment capability | P2 |
| **Voice Interface** | Question read-aloud, voice answer input | P2 |
| **Advanced AI** | Automated item generation, essay scoring | P2 |
| **Government Portal** | State/national-level dashboards | P2 |
| **API Marketplace** | Third-party integration API with docs | P2 |
| **Milestone:** | **500+ schools, 100,000+ users, ₦150M ARR** | |

---

## 2. RISK ASSESSMENT

| Risk | Probability | Impact | Mitigation | Contingency |
|------|------------|--------|------------|-------------|
| **Low internet penetration in target regions** | High (80%) | High | PWA with offline caching; SMS-based result delivery; USSD integration | Data-free access partnerships with telcos |
| **Low willingness to pay for reports** | Medium (50%) | High | Free basic report must be genuinely valuable; school bulk purchasing; demonstrate ROI with case studies | Introduce subscription model with lower per-report cost; government funding |
| **IRT calibration requires large sample** | Medium (60%) | Medium | Start with fixed-form assessment; pilot with expert-calibrated items; Bayesian calibration with priors | Use 2PL instead of 3PL initially (fewer parameters); manual expert calibration |
| **Cheating / gaming the adaptive system** | Medium (40%) | Medium | Response time analysis; pattern detection; item exposure control; proctored mode | Flag suspicious sessions; require re-assessment |
| **Data privacy incident** | Low (20%) | Critical | Encryption at rest/transit; strict RBAC; audit logs; penetration testing; DPO | Incident response plan; 72-hour breach notification; user notification |
| **Churn after first assessment** | Medium (50%) | Medium | Engagement emails at day 3, 7, 14, 30; push notifications; parent/school involvement | Discount on next deep report; free follow-up mini-assessment |
| **Content quality inconsistent** | Medium (40%) | Medium | Multi-stage review workflow; subject matter experts on retainer; pilot testing with students | Continuous calibration; flag low-quality items; community feedback |
| **Scalability costs exceed free tier** | Medium (50%) | Medium | Monitor usage dashboard; set budget alerts; optimize queries; aggressive caching | Gradual upgrade of individual services; fundraising for infrastructure |
| **Teacher resistance to adoption** | High (70%) | Medium | Teacher-centric UI design; training materials; demonstrable time savings; integration with existing gradebook | Start with enthusiastic teachers; build case studies; provide printable reports |
| **Regulatory changes (data localization)** | Low (20%) | High | Architecture supports multi-region deployment; choose cloud providers with Nigeria regions | Migrate database to Nigeria region; legal counsel on retainer |

---

## 3. QUALITY ASSURANCE PLAN

### 3.1 Testing Strategy

| Test Type | Scope | Tool | Frequency | Target |
|-----------|-------|------|-----------|--------|
| **Unit Tests** | Functions, utilities, hooks, IRT calculations | Vitest | Every commit | >90% coverage |
| **Integration Tests** | API routes, database queries, tRPC procedures | Vitest + MSW | Every PR | All critical paths |
| **Component Tests** | UI components, chart rendering | Testing Library + Storybook | Every PR | All components |
| **E2E Tests** | Full user flows (registration → assessment → report) | Playwright | Every merge to main | 10 critical flows |
| **Accessibility Tests** | WCAG 2.1 AA compliance | axe-core + Playwright | Every PR | Zero critical violations |
| **Performance Tests** | Assessment engine, report generation, API latency | k6 | Weekly | p95 < 500ms |
| **Security Tests** | OWASP Top 10, dependency scanning, SAST | OWASP ZAP + Snyk | Monthly | Zero critical findings |
| **Psychometric Validation** | Item fit, test information, DIF, reliability | R + mirt package | Per 500 responses | Infit/outfit MNSQ 0.7-1.3 |
| **Load Tests** | Concurrent users, assessment submissions | Artillery | Pre-launch + quarterly | 1000 concurrent users |
| **Regression Tests** | Full suite of above | CI pipeline | Every merge to main | All pass |

### 3.2 Critical Test Scenarios (E2E)

| # | Scenario | Steps | Expected Outcome |
|---|----------|-------|-----------------|
| TC1 | Guest registration → assessment → basic report | 1. Visit landing page 2. Click "Start Free Assessment" 3. Register as guest 4. Complete 30-item assessment 5. View basic report | Readiness score displayed, radar chart renders, "Upgrade to Deep" CTA shown |
| TC2 | School setup → student invite → student assessment | 1. School registers 2. Uploads class CSV 3. Invites students 4. Student logs in 5. Completes assessment | Student appears in school dashboard, readiness score visible to admin |
| TC3 | Deep report purchase → PDF download | 1. Complete assessment 2. View basic report 3. Click "Unlock Deep" 4. Pay via Paystack 5. View deep report 6. Download PDF | Full 20-section report renders, PDF generates and downloads |
| TC4 | Parent links child → views report | 1. Parent registers 2. Enters child code 3. Verifies relationship 4. Views child dashboard 5. Views deep report | Parent sees child's data only, cannot access other children |
| TC5 | Admin question workflow | 1. Admin creates question 2. Submits for review 3. Reviewer approves 4. Question appears in pool | Question state transitions: draft → review → approved → published |
| TC6 | Adaptive algorithm accuracy | 1. Mock student with known theta 2. Run CAT simulation 3. Compare estimated vs actual theta | |θ̂ - θ| < 0.5 within 30 items |

### 3.3 Psychometric Validation Tests

```typescript
// Automated psychometric checks run after each calibration batch
interface PsychometricValidation {
  // Item fit statistics
  infitMNSQ: number;  // acceptable: 0.7 - 1.3
  outfitMNSQ: number; // acceptable: 0.7 - 1.3
  
  // Test reliability
  empiricalReliability: number; // target: > 0.85
  
  // Differential Item Functioning (DIF)
  difMagnitude: 'negligible' | 'moderate' | 'large';
  
  // Information at key theta levels
  testInfoAtMinus2: number; // target: > 5
  testInfoAt0: number;      // target: > 10
  testInfoAtPlus2: number;  // target: > 5
  
  // Score distribution
  skewness: number; // acceptable: -1 to 1
  kurtosis: number; // acceptable: -1 to 3
}

// If any value falls outside acceptable range → alert admin with detailed report
// Items with infit/outfit > 1.3 → flag for review
// Items with DIF magnitude 'large' → flag for bias review
```

---

## 4. ACCEPTANCE CRITERIA

### 4.1 Functional Acceptance Criteria

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| F1 | Guest user can register, complete assessment, and view basic report | E2E test TC1 |
| F2 | Deep report can be purchased via Paystack and PDF generated | E2E test TC3 |
| F3 | School admin can create classes, upload students, and invite teachers | Manual QA + E2E |
| F4 | Parent can link multiple children and view independent reports per child | E2E test TC4 |
| F5 | Admin can create, review, approve, and publish questions | E2E test TC5 |
| F6 | Adaptive algorithm selects next item based on current theta estimate | Unit test + simulation |
| F7 | Misconception probability updates after each response | Unit test |
| F8 | Report template can be customized by admin (sections, colors) | Manual QA |
| F9 | Notification sent via email/SMS after assessment complete | Integration test |
| F10 | Coupon applied correctly during payment | Unit test + E2E |

### 4.2 Non-Functional Acceptance Criteria

| ID | Criterion | Target | Measurement |
|----|-----------|--------|-------------|
| NF1 | Landing page loads within 2s on 3G network | < 2s | Lighthouse |
| NF2 | Assessment question renders within 1s | < 1s | Lighthouse |
| NF3 | Deep report PDF generates within 10s | < 10s | Server timing |
| NF4 | Dashboard loads all widgets within 3s | < 3s | Lighthouse |
| NF5 | API p95 response time < 500ms | < 500ms | API monitoring |
| NF6 | Supports 1000 concurrent assessment takers | 1000 concurrent | Load test |
| NF7 | 99.5% uptime (monthly) | 99.5% | Uptime monitoring |
| NF8 | Zero PII leaked in logs, URLs, or error messages | Zero | Security audit |
| NF9 | Dark mode toggle persists across sessions | Persists | Manual check |
| NF10 | WCAG 2.1 AA compliance | Zero level A/AA violations | axe-core scan |
| NF11 | All text content translatable (i18n architecture) | All UI strings | Code review |
| NF12 | Assessment progress preserved on network interruption | Progress saved | E2E test |

### 4.3 Launch Gate Criteria

| Gate | Criteria | Sign-off Required |
|------|----------|-------------------|
| **Alpha** | Core assessment flow works end-to-end (guest). Basic report renders. | Tech Lead |
| **Beta** | All 4 roles functional. Payment works. Admin panel operational. 50 pilot users testing. | Product Manager |
| **Public Beta** | No critical bugs open. All P0 features complete. Psychometric validation passes. 200 users active. | CEO / Product Director |
| **V1 Launch** | All P0 + P1 features complete. 500+ active users. First school onboarded. 99.5% uptime for 30 days. | CEO |
| **V2 Launch** | AI recommendations live. 50+ schools. Fully adaptive engine. Positive psychometric validation report. | Board |

---

## 5. APPENDIX: GLOSSARY

| Term | Definition |
|------|-----------|
| **3PL** | Three-Parameter Logistic model for Item Response Theory |
| **BKT** | Bayesian Knowledge Tracing — probabilistic model for misconception detection |
| **CAT** | Computerized Adaptive Testing — algorithm that selects items based on ability estimate |
| **CBT** | Computer-Based Testing (traditional exam platform) |
| **EAP** | Expected a Posteriori — Bayesian theta estimation method |
| **IRT** | Item Response Theory — psychometric framework for item analysis |
| **MLE** | Maximum Likelihood Estimation — theta estimation method |
| **NERDC** | Nigerian Educational Research and Development Council |
| **PII** | Personally Identifiable Information |
| **RBAC** | Role-Based Access Control |
| **SRS** | Software Requirements Specification |
| **tRPC** | TypeScript Remote Procedure Call — type-safe API framework |
| **Theta (θ)** | Latent ability estimate in IRT |
| **WAEC/NECO/JAMB** | Nigerian examination bodies |

---

*End of Phase 14 — Future Roadmap, Risk Assessment, QA Plan & Acceptance Criteria*

**Deep Check SRS Complete — 14 phases, 10+ files, ~2,500+ specification lines.**
