# DEEP CHECK — Software Requirements Specification

## Phase 9: Reporting Engine

---

## 1. REPORT TYPES OVERVIEW

| Report Type | Cost | Audience | Content Depth | Format |
|-------------|------|----------|---------------|--------|
| **Basic Report** | Free | Student, Guest | Summary stats, radar chart, top 3 weaknesses | Web only |
| **Deep Report** | ₦3,000 (configurable) | Student, Parent, Guest | Full diagnostic, all charts, improvement plans, AI recommendations | Web + PDF |
| **School Quality Diagnostic** | Included with subscription | School Admin, Proprietor | School-wide analytics, teacher effectiveness, curriculum gaps, benchmarks | Web + PDF |
| **Parent Diagnostic** | Included with Deep Report | Parent | Parent Support Index, home learning score, weekly tasks | Web + PDF |
| **Teacher Class Report** | Included with school account | Teacher | Class performance, gap analysis, student groupings | Web + PDF |
| **Certificate of Readiness** | Free (with Deep Report) | Student | Formal certificate with readiness score | PDF |

---

## 2. BASIC REPORT SPECIFICATION

### 2.1 Content Structure

```typescript
interface BasicReport {
  reportId: string;
  reportType: 'basic';
  generatedAt: string;
  
  student: {
    id: string;
    name: string;
    class?: string;
    school?: string;
  };
  
  assessment: {
    id: string;
    date: string;
    subjectCoverage: string[];
    itemsCompleted: number;
    timeSpentMinutes: number;
  };
  
  overallReadiness: {
    score: number;        // 0-100
    category: string;     // 'critical'|'weak'|'developing'|'competent'|'strong'
    previousScore?: number;
    changeDirection?: 'improved'|'declined'|'stable';
  };
  
  radarChart: {
    dimension: string;
    score: number;
    maxScore: number;
  }[];
  
  topWeaknesses: {
    conceptId: string;
    name: string;
    score: number;
    category: string;
  }[];  // max 5
  
  topStrengths: {
    conceptId: string;
    name: string;
    score: number;
  }[];  // max 3
  
  deepReportPrompt: {
    available: boolean;  // false if already purchased
    price: number;
    currency: string;
    description: string;
  };
}
```

### 2.2 Generation Logic

```typescript
async function generateBasicReport(
  instanceId: string,
  userId: string
): Promise<BasicReport> {
  // 1. Fetch assessment instance
  const instance = await db.query.assessmentInstances.findFirst({
    where: eq(assessmentInstances.id, instanceId),
    with: { assessment: true },
  });

  // 2. Fetch readiness scores
  const overall = await db.query.readinessScores.findFirst({
    where: and(
      eq(readinessScores.instanceId, instanceId),
      eq(readinessScores.scoreType, 'overall')
    ),
  });

  // 3. Fetch subject/skill scores for radar
  const radarScores = await db.query.readinessScores.findMany({
    where: and(
      eq(readinessScores.instanceId, instanceId),
      inArray(readinessScores.scoreType, ['subject', 'cognitive_skill'])
    ),
  });

  // 4. Fetch concept mastery (top weaknesses)
  const conceptMasteries = await db.query.conceptMastery.findMany({
    where: eq(conceptMastery.userId, userId),
    orderBy: [asc(conceptMastery.masteryLevel)],
    limit: 5,
  });

  // 5. Fetch previous assessment for comparison
  const previousInstance = await db.query.assessmentInstances.findFirst({
    where: and(
      eq(assessmentInstances.userId, userId),
      eq(assessmentInstances.status, 'completed'),
      lt(assessmentInstances.completedAt, instance.completedAt)
    ),
    orderBy: [desc(assessmentInstances.completedAt)],
  });

  // 6. Construct report
  return {
    reportId: generateId('rpt'),
    reportType: 'basic',
    generatedAt: new Date().toISOString(),
    student: await getStudentInfo(userId),
    assessment: {
      id: instanceId,
      date: instance.completedAt.toISOString(),
      subjectCoverage: instance.assessment.subjectIds,
      itemsCompleted: instance.currentItemIndex,
      timeSpentMinutes: Math.round(instance.timeSpentSeconds / 60),
    },
    overallReadiness: {
      score: Math.round(overall.score),
      category: overall.category,
      previousScore: previousInstance
        ? await getPreviousReadinessScore(previousInstance.id)
        : undefined,
    },
    radarChart: radarScores.map(r => ({
      dimension: getDimensionName(r.scoreType, r.referenceId),
      score: Math.round(r.score),
      maxScore: 100,
    })),
    topWeaknesses: conceptMasteries.slice(0, 5).map(cm => ({
      conceptId: cm.conceptId,
      name: getConceptName(cm.conceptId),
      score: cm.masteryLevel,
      category: cm.masteryCategory,
    })),
    topStrengths: conceptMasteries.slice(-3).map(cm => ({
      conceptId: cm.conceptId,
      name: getConceptName(cm.conceptId),
      score: cm.masteryLevel,
    })),
    deepReportPrompt: {
      available: !(await hasPurchasedDeepReport(instanceId)),
      price: await getDeepReportPrice(),
      currency: 'NGN',
      description: 'Unlock your complete learning diagnostic with personalized improvement plan',
    },
  };
}
```

---

## 3. DEEP REPORT SPECIFICATION

### 3.1 Complete Section Inventory (20 sections)

```
┌─────────────────────────────────────────────────────┐
│                  DEEP REPORT                          │
├─────────────────────────────────────────────────────┤
│ 1. REPORT HEADER                                    │
│    - Report title, student info, date, report ID    │
│    - QR code linking to web version                 │
│                                                      │
│ 2. EXECUTIVE SUMMARY                                │
│    - Readiness score (large, prominent)             │
│    - Category label with color                      │
│    - 3 key findings (bullet points)                 │
│    - Risk level indicator                           │
│    - "Start Here" call-to-action                    │
│                                                      │
│ 3. READINESS SCORES (per subject)                   │
│    - Horizontal bar chart                           │
│    - Score + category per subject                   │
│    - Peer average comparison                        │
│                                                      │
│ 4. RADAR / SPIDER CHART                             │
│    - 5-8 dimensions (subjects + cognitive skills)   │
│    - Student score (filled)                         │
│    - Peer average (dashed outline)                  │
│    - Dimension labels with scores                   │
│                                                      │
│ 5. COGNITIVE SKILLS ANALYSIS                        │
│    - Bloom's Taxonomy breakdown                     │
│    - 6 levels: Remember → Create                    │
│    - Score per level + trend indicator              │
│                                                      │
│ 6. CONCEPT ANALYSIS                                 │
│    - Strong Concepts (green, mastered)              │
│    - Developing Concepts (yellow, in progress)      │
│    - Weak Concepts (red, gaps)                      │
│    - Each concept: name, score, category, trend     │
│                                                      │
│ 7. GAP RANKING (Priority Order)                     │
│    - Ranked by: gap severity × prerequisite impact  │
│    - Each gap: concept name, score, impact level    │
│    - Prerequisite blocked concepts listed           │
│                                                      │
│ 8. HEATMAP (Subject × Bloom's Level)                │
│    - Color-coded mastery matrix                     │
│    - 6 columns (Bloom levels) × N rows (subjects)   │
│                                                      │
│ 9. LEARNING VELOCITY                                │
│    - Current rate (θ/day)                           │
│    - Trend direction (accelerating/stable/declining)│
│    - Projected time to target                       │
│    - Comparison to peer average                     │
│                                                      │
│ 10. GROWTH PROJECTION                               │
│     - Historical + forecast line chart              │
│     - 3 scenarios: current path, with practice, risk│
│     - Target readiness line (80%)                   │
│     - Estimated date to reach target                │
│                                                      │
│ 11. RISK ANALYSIS                                   │
│     - At-risk subjects identified                   │
│     - At-risk concepts identified                   │
│     - Compounding risk explanation                  │
│     - Impact on transition readiness                │
│                                                      │
│ 12. OPPORTUNITY ANALYSIS                            │
│     - High-impact fixes (concepts blocking most)    │
│     - Quick wins (concepts near mastery threshold)  │
│     - Leverage areas (strengths to build confidence)│
│                                                      │
│ 13. QUESTION EXPLANATIONS (per item)                │
│     - Question text                                 │
│     - Student's answer vs correct answer            │
│     - Detailed explanation                          │
│     - Common mistake explanation (if wrong)         │
│     - Learning tip                                  │
│     - Reference material link                       │
│                                                      │
│ 14. MISCONCEPTION ANALYSIS                          │
│     - Identified misconceptions with probability    │
│     - Correction strategies                         │
│     - Practice exercises to address each            │
│                                                      │
│ 15. IMPROVEMENT PLAN                                │
│     - Phase 1: Immediate (Days 1-3)                 │
│     - Phase 2: Short-term (Days 4-14)               │
│     - Phase 3: Medium-term (Days 15-30)             │
│     - Phase 4: Long-term (Days 31-90)               │
│     - Each phase: actions, time commitment, goals   │
│                                                      │
│ 16. DAILY PRACTICE PLAN (30 Days)                   │
│     - Day-by-day table                              │
│     - Each day: focus concept, activity, time       │
│     - Checklist format (printable)                  │
│                                                      │
│ 17. AI RECOMMENDATIONS                              │
│     - For Student (3-5 items)                       │
│     - For Teacher (3-5 items)                       │
│     - For Parent (3-5 items)                        │
│     - Each: title, description, timeframe           │
│                                                      │
│ 18. LEARNING RESOURCES                              │
│     - Videos (concept → YouTube/own content links)  │
│     - Interactive exercises                         │
│     - Printable worksheets                          │
│     - Book recommendations                          │
│                                                      │
│ 19. NEXT STEPS                                      │
│     - "Start your daily plan today"                 │
│     - "Schedule your next assessment"               │
│     - "Share this report with..."                   │
│     - "Compare with peers" (if opted in)            │
│                                                      │
│ 20. FOOTER                                          │
│     - Disclaimers                                   │
│     - Psychometric validity statement               │
│     - Contact/support information                   │
│     - Report generation date and version            │
│     - QR code to regenerate or verify               │
└─────────────────────────────────────────────────────┘
```

### 3.2 Report Generation Pipeline

```typescript
async function generateDeepReport(
  instanceId: string,
  userId: string,
  options?: { includePdf?: boolean }
): Promise<DeepReport> {
  // Step 1: Fetch all assessment data
  const [
    instance,
    responses,
    theta,
    misconceptions,
    readinessScores,
    conceptMasteries,
    velocity,
    previousAssessments,
  ] = await Promise.all([
    getAssessmentInstance(instanceId),
    getAssessmentResponses(instanceId),
    getThetaEstimate(instanceId),
    getMisconceptionProbabilities(instanceId),
    getAllReadinessScores(instanceId),
    getAllConceptMastery(userId),
    getLearningVelocity(userId),
    getPreviousAssessmentSummary(userId, instanceId),
  ]);

  // Step 2: Compute derived data
  const gapRanking = computeGapRanking(conceptMasteries);
  const growthProjection = projectScore(
    readinessScores.find(s => s.scoreType === 'overall')?.score || 50,
    velocity.velocity || 0,
    velocity.trend || 'stable',
    90 // 90-day projection
  );
  const riskAnalysis = analyzeRisk(conceptMasteries, readinessScores);
  const opportunityAnalysis = analyzeOpportunities(conceptMasteries, gapRanking);

  // Step 3: Generate AI recommendations (async, can be cached)
  const aiRecommendations = await generateAIRecommendations(userId, {
    readinessScore: readinessScores.find(s => s.scoreType === 'overall')?.score || 0,
    weakConcepts: conceptMasteries.filter(c => c.masteryLevel < 50).map(c => ({
      name: getConceptName(c.conceptId),
      score: c.masteryLevel,
    })),
    strongConcepts: conceptMasteries.filter(c => c.masteryLevel >= 75).map(c => ({
      name: getConceptName(c.conceptId),
      score: c.masteryLevel,
    })),
    velocity: velocity.velocity,
    misconceptions: misconceptions.filter(m => m.probability > 0.5).map(m => ({
      name: getMisconceptionName(m.misconceptionId),
      probability: m.probability,
    })),
  });

  // Step 4: Generate daily plan
  const dailyPlan = generateDailyPlan({
    weakConcepts: conceptMasteries.filter(c => c.masteryLevel < 60),
    strongConcepts: conceptMasteries.filter(c => c.masteryLevel >= 75),
    detectedMisconceptions: misconceptions,
    velocity: velocity.velocity,
    streakDays: 0, // from user stats
  }, aiRecommendations.forStudent || []);

  // Step 5: Build report data structure
  const report: DeepReport = {
    reportId: generateId('drpt'),
    reportType: 'deep',
    generatedAt: new Date().toISOString(),
    
    student: { /* ... */ },
    assessment: { /* ... */ },
    overallReadiness: { /* ... */ },
    subjectReadiness: readinessScores.filter(s => s.scoreType === 'subject'),
    radarData: /* ... */,
    cognitiveSkills: /* ... */,
    conceptAnalysis: {
      strong: conceptMasteries.filter(c => c.masteryLevel >= 75),
      developing: conceptMasteries.filter(c => c.masteryLevel >= 45 && c.masteryLevel < 75),
      weak: conceptMasteries.filter(c => c.masteryLevel < 45),
    },
    gapRanking: gapRanking.slice(0, 10),
    heatmap: computeHeatmap(responses, conceptMasteries),
    learningVelocity: velocity,
    growthProjection,
    riskAnalysis,
    opportunityAnalysis,
    questionExplanations: await generateQuestionExplanations(responses),
    misconceptionAnalysis: misconceptions.filter(m => m.probability > 0.4),
    improvementPlan: generateImprovementPlan(gapRanking, velocity),
    dailyPlan,
    aiRecommendations,
    learningResources: await getLearningResources(conceptMasteries),
    nextSteps: generateNextSteps(instanceId, userId),
    footer: generateFooter(userId),
  };

  // Step 6: Cache and optionally generate PDF
  await cacheReport(report);

  if (options?.includePdf) {
    // Trigger async PDF generation
    await queuePdfGeneration(report.reportId);
  }

  return report;
}
```

### 3.3 PDF Generation

```typescript
// PDF generation using @react-pdf/renderer (server-side)

// Architecture:
// 1. Report data is fetched and stored as JSON
// 2. A React PDF document component renders the report
// 3. PDF is rendered server-side in a Vercel serverless function or Inngest step
// 4. PDF is uploaded to Vercel Blob / S3
// 5. URL stored in reports table

// PDF Document Template (React):
const DeepReportPDF = ({ report }: { report: DeepReport }) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.coverSection}>
        <Text style={styles.reportTitle}>Deep Diagnostic Report</Text>
        <Text style={styles.studentName}>{report.student.name}</Text>
        <Text style={styles.schoolName}>{report.student.school}</Text>
        <Text style={styles.date}>{formatDate(report.generatedAt)}</Text>
        
        {/* Large readiness score */}
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{report.overallReadiness.score}</Text>
          <Text style={styles.scoreLabel}>Readiness Score</Text>
        </View>
        
        <Text style={styles.categoryBadge}>{report.overallReadiness.category}</Text>
        <Text style={styles.keyFinding}>{report.keyFindings[0]}</Text>
      </View>
    </Page>

    {/* Radar Chart Page */}
    <Page size="A4">
      <View>
        <Text style={styles.sectionTitle}>Multi-Dimensional Analysis</Text>
        {/* Radar chart rendered as SVG */}
        <SVG width={400} height={400}>
          {/* ... radar chart paths */}
        </SVG>
        {/* Legend */}
        <View style={styles.legend}>
          <Text>■ You ({report.student.name})</Text>
          <Text>--- Peer Average</Text>
        </View>
      </View>
    </Page>

    {/* Gap Ranking Page */}
    <Page size="A4">
      <Text style={styles.sectionTitle}>Concept Gap Ranking</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colRank}>#</Text>
          <Text style={styles.colConcept}>Concept</Text>
          <Text style={styles.colScore}>Score</Text>
          <Text style={styles.colImpact}>Impact</Text>
          <Text style={styles.colBlocks}>Blocks</Text>
        </View>
        {report.gapRanking.map((gap, i) => (
          <View key={gap.conceptId} style={styles.tableRow}>
            <Text style={styles.colRank}>{i + 1}</Text>
            <Text style={styles.colConcept}>{gap.name}</Text>
            <Text style={styles.colScore}>{gap.score}%</Text>
            <Text style={styles.colImpact}>{gap.impact}</Text>
            <Text style={styles.colBlocks}>{gap.prerequisiteFor.join(', ')}</Text>
          </View>
        ))}
      </View>
    </Page>

    {/* Daily Plan Pages (compact table) */}
    <Page size="A4">
      <Text style={styles.sectionTitle}>30-Day Daily Practice Plan</Text>
      {/* Day-by-day table */}
      {report.dailyPlan.exercises.map((exercise, i) => (
        <View key={i} style={styles.exerciseRow}>
          <Text style={styles.exerciseDay}>Day {i + 1}</Text>
          <Text style={styles.exerciseDesc}>{exercise.description}</Text>
          <Text style={styles.exerciseTime}>{exercise.estimatedMinutes} min</Text>
        </View>
      ))}
    </Page>

    {/* ... Additional pages for all sections */}
    
    {/* Footer Page */}
    <Page size="A4">
      <Text style={styles.footerText}>
        This report was generated by Deep Check's proprietary diagnostic engine, 
        powered by Item Response Theory (3PL model) and Bayesian Knowledge Tracing.
        Validity: The reported scores have a measurement precision of SE &lt; 0.35 
        on the theta scale (equivalent to ±5% on the readiness scale).
      </Text>
      <Text>Report ID: {report.reportId}</Text>
      <Text>Generated: {report.generatedAt}</Text>
      <Text>Verify at: https://deepcheck.app/verify/{report.reportId}</Text>
    </Page>
  </Document>
);

// PDF generation function
async function generatePdf(reportId: string): Promise<string> {
  const report = await getReportData(reportId);
  const pdfStream = await renderToStream(<DeepReportPDF report={report} />);
  
  // Upload to blob storage
  const blob = await put(`reports/${reportId}.pdf`, pdfStream, {
    access: 'public',
    contentType: 'application/pdf',
  });
  
  // Update database
  await db.update(reports)
    .set({ pdfUrl: blob.url, pdfGeneratedAt: new Date() })
    .where(eq(reports.id, reportId));
  
  return blob.url;
}
```

### 3.4 Deep Report Pricing Flow

```typescript
// Deep report is NOT generated until payment is confirmed.
// The report_purchases table tracks the purchase.

async function purchaseDeepReport(
  instanceId: string,
  buyerId: string,
  couponCode?: string
): Promise<{ checkoutUrl: string; reportId: string }> {
  // 1. Check if already purchased
  const existing = await db.query.reportPurchases.findFirst({
    where: and(
      eq(reportPurchases.reportId, getReportId(instanceId)),
      eq(reportPurchases.status, 'completed')
    ),
  });
  if (existing) {
    throw new Error('Report already purchased');
  }

  // 2. Get current price
  const price = await getDeepReportPrice();
  let finalAmount = price.NGN;
  let discountAmount = 0;
  let couponId: string | null = null;

  // 3. Validate coupon
  if (couponCode) {
    const coupon = await validateCoupon(couponCode, finalAmount, buyerId);
    if (coupon) {
      discountAmount = coupon.discountType === 'percentage'
        ? finalAmount * coupon.discountValue / 100
        : Math.min(coupon.discountValue, finalAmount);
      finalAmount -= discountAmount;
      couponId = coupon.id;
    }
  }

  // 4. Initialize payment with provider
  const paymentProvider = getPaymentProvider('paystack');
  const transactionRef = `DC-${Date.now()}-${randomString(6)}`;
  
  const payment = await paymentProvider.initialize({
    amount: Math.round(finalAmount * 100), // in kobo
    email: getBuyerEmail(buyerId),
    reference: transactionRef,
    metadata: {
      reportId: getReportId(instanceId),
      instanceId,
      buyerId,
    },
  });

  // 5. Create pending purchase record
  await db.insert(reportPurchases).values({
    reportId: getReportId(instanceId),
    buyerId,
    buyerType: await getBuyerType(buyerId),
    amount: finalAmount,
    couponId,
    discountAmount,
    paymentProvider: 'paystack',
    paymentReference: transactionRef,
    status: 'pending',
  });

  return { checkoutUrl: payment.authorizationUrl, reportId: getReportId(instanceId) };
}

// Webhook handler (Paystack)
async function handlePaystackWebhook(event: PaystackEvent): Promise<void> {
  if (event.event === 'charge.success') {
    const { reference } = event.data;
    
    // Find pending purchase
    const purchase = await db.query.reportPurchases.findFirst({
      where: eq(reportPurchases.paymentReference, reference),
    });
    
    if (purchase && purchase.status === 'pending') {
      // Mark as completed
      await db.update(reportPurchases)
        .set({ status: 'completed', purchasedAt: new Date() })
        .where(eq(reportPurchases.id, purchase.id));
      
      // Generate the deep report
      const report = await generateDeepReport(
        getInstanceIdFromReportId(purchase.reportId),
        purchase.buyerId,
        { includePdf: true }
      );
      
      // Notify buyer
      await sendNotification({
        userId: purchase.buyerId,
        type: 'report_ready',
        data: { reportId: purchase.reportId },
      });
    }
  }
}
```

---

## 4. SCHOOL QUALITY DIAGNOSTIC REPORT

### 4.1 Report Metrics

| Metric | Formula | Weight |
|--------|---------|--------|
| **Teaching Quality Indicator** | avg(teacher_effectiveness_score) across all teachers | 25% |
| **Curriculum Alignment** | % of curriculum concepts assessed vs total required | 15% |
| **Learning Gap Distribution** | % of students with < 50% readiness per subject | 15% |
| **Average Concept Mastery** | avg(concept_mastery) across all students | 15% |
| **Critical Thinking Development** | avg(critical_thinking_score) across all students | 10% |
| **Retention Performance** | avg(theta_change between terms) across all students | 10% |
| **Subject Risk Index** | % of subjects where avg readiness < 45 | 5% |
| **Assessment Quality** | avg(item_discrimination) of questions used | 5% |

### 4.2 Report Sections

```
1. EXECUTIVE SUMMARY
   - School Performance Score (0-100)
   - Quality Category (Exceptional, Good, Developing, Needs Improvement, Critical)
   - 5 Key Findings
   - Comparison to similar schools (benchmark)

2. TEACHING QUALITY
   - Teacher effectiveness scores (bar chart)
   - Top-performing teachers
   - Teachers needing support
   - Recommendation: "Increase inquiry-based learning. Critical Thinking score is low."

3. CURRICULUM COVERAGE
   - Concepts covered vs required (gauge)
   - Missing concepts by subject
   - Over-covered concepts

4. STUDENT PERFORMANCE DISTRIBUTION
   - Readiness distribution histogram
   - At-risk student identification
   - Class-by-class comparison

5. SUBJECT RISK INDEX
   - Risk score per subject
   - Trend over terms
   - Recommended interventions

6. GENDER ANALYSIS
   - Performance by gender (per subject)
   - Gap identification
   - Equity recommendations

7. COMPARATIVE ANALYSIS
   - Class comparison (bar chart)
   - Teacher comparison
   - Term-over-term trend

8. PRIORITY ACTIONS
   - Top 5 recommended actions
   - Expected impact
   - Timeline for each

9. SCHOOL PERFORMANCE SUMMARY
   - Score breakdown with trend
   - Benchmark percentile
```

---

## 5. PARENT DIAGNOSTIC REPORT

### 5.1 Data Collection

Collected via optional questionnaire (submitted once, can be updated quarterly):

```typescript
interface ParentDiagnosticQuestionnaire {
  // Learning Environment (1-5 scale)
  hasDedicatedStudySpace: number;
  studySpaceQuality: number; // quiet, well-lit, organized
  hasLearningMaterials: number; // books, stationery, devices
  
  // Study Routine (1-5 scale)
  hasFixedStudyTime: number;
  studyRoutineConsistency: number;
  homeworkCompletionRate: number;
  
  // Support Behaviors
  helpsWithHomework: number; // times per week
  discussesSchoolDay: number; // times per week
  readsWithChild: number; // times per week
  monitorsDeviceUsage: boolean;
  limitsScreenTime: boolean;
  
  // Communication
  talksAboutEffort_notResults: number; // 1-5
  encouragesCuriosity: number; // 1-5
  
  // Health & Wellness
  childSleepHours: number;
  childHasBreakfast: boolean;
  extracurricularActivities: number; // count
  
  // Emotional Support
  supportsAfterFailure: number; // 1-5
  celebratesEffort: number; // 1-5
  growthMindsetLanguage: number; // 1-5
}
```

### 5.2 Report Sections

```
1. PARENT SUPPORT INDEX (0-100)
   - Overall score
   - Category: Excellent, Good, Needs Improvement, Critical
   - Comparison to peer parents (anonymized)

2. WHAT YOU'RE DOING RIGHT
   - Top 3 strengths identified from questionnaire
   - Positive reinforcement

3. WHAT TO IMPROVE
   - Bottom 3 areas
   - Specific, actionable suggestions
   - Example: "Your child averages 6 hours of sleep. Increasing to 9 hours can improve cognitive function by 15%."

4. HOME LEARNING SCORE (0-100)
   - Learning environment assessment
   - Study routine effectiveness
   - Resource availability

5. WEEKLY TASKS
   - 5 specific tasks for the next 7 days
   - Each with estimated time commitment
   - Example: "Monday: Read with Adeola for 15 minutes. Ask 3 'why' questions."

6. MONTHLY TARGETS
   - 3 monthly goals
   - Progress tracking

7. FAMILY LEARNING PLAN
   - Weekend activities
   - Holiday learning suggestions
   - Educational outings

8. EXPECTED IMPROVEMENT TIMELINE
   - "If you follow this plan, expect your child's readiness to improve by 10-15% in 60 days."
```

---

## 6. REPORT TEMPLATE MANAGEMENT (Admin)

```typescript
interface ReportTemplate {
  id: string;
  name: string;
  templateType: 'deep' | 'basic' | 'school' | 'parent' | 'teacher';
  
  // Configuration for which sections to include and their order
  sections: {
    id: string;
    name: string;
    enabled: boolean;
    order: number;
    config?: Record<string, any>; // section-specific settings
  }[];
  
  // Styling
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoPosition: 'top-left' | 'top-center' | 'none';
  showWatermark: boolean;
  watermarkText: string;
  
  // PDF settings
  pageSize: 'A4' | 'Letter';
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  
  // Default
  isDefault: boolean;
  isActive: boolean;
}

// Admin can:
// 1. Create multiple templates
// 2. Set one as default per report type
// 3. Reorder sections
// 4. Toggle sections on/off
// 5. Customize colors and branding
// 6. Preview template before saving
```

---

## 7. REPORT CACHING & STORAGE

```typescript
// Report data is cached in Redis for fast web access
// PDFs are stored in blob storage (Vercel Blob / S3)

// Cache keys:
// report:data:{reportId} → full JSON report data (TTL: 1 hour)
// report:pdf:{reportId} → PDF URL (TTL: 24 hours)

// Storage paths:
// reports/{reportType}/{year}/{month}/{reportId}.json
// reports/{reportType}/{year}/{month}/{reportId}.pdf

// Report data is immutable after generation.
// Regeneration creates a new report ID and marks old as superseded.

async function getReport(reportId: string): Promise<ReportData> {
  // 1. Check cache
  const cached = await redis.get(`report:data:${reportId}`);
  if (cached) return JSON.parse(cached);

  // 2. Fetch from database
  const report = await db.query.reports.findFirst({
    where: eq(reports.id, reportId),
  });
  if (!report || !report.reportData) throw new Error('Report not found');

  // 3. Cache and return
  await redis.set(`report:data:${reportId}`, JSON.stringify(report.reportData), { ex: 3600 });
  return report.reportData;
}
```

---

*End of Phase 9 — Reporting Engine*

**Complete specification for Basic Report, Deep Report (20 sections), School Quality Diagnostic, Parent Diagnostic, PDF generation pipeline (React-PDF), payment flow, template management, and caching strategy.**

**Next: Phase 10 — UI/UX & Dashboard Specifications**

*Confirm readiness to proceed to Phase 10.*
