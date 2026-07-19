# DEEP CHECK — Software Requirements Specification

## Phase 8: Analytics & AI Recommendation Engine

---

## 1. ANALYTICS ARCHITECTURE

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Assessment     │     │   Event Bus      │     │  Analytics       │
│   Engine         │────▶│   (Postgres      │────▶│  Pipeline        │
│                  │     │    + Inngest)    │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
                                               ┌──────────────────┐
                                               │  Materialized    │
                                               │  Views / Denorm  │
                                               │  Tables          │
                                               └──────────────────┘
                                                          │
                                                          ▼
                                               ┌──────────────────┐
                                               │  Analytics API   │
                                               │  (tRPC queries)  │
                                               └──────────────────┘
                                                          │
                                                          ▼
                                               ┌──────────────────┐
                                               │  Chart Renderer  │
                                               │  (Recharts/D3)   │
                                               └──────────────────┘
```

### 1.1 Event-Driven Analytics

Events are fired after key actions and consumed by the analytics pipeline:

| Event | Trigger | Consumers |
|-------|---------|-----------|
| `assessment.completed` | Student finishes assessment | Score computation, report generation, recommendation engine |
| `report.purchased` | Deep report purchased | Revenue analytics, sales dashboard |
| `recommendation.actioned` | User marks recommendation as done | Effectiveness tracking, ML retraining |
| `student.enrolled` | Student added to class | School analytics, class counts |
| `teacher.assigned` | Teacher assigned to class | Teacher analytics |
| `payment.completed` | Transaction successful | Revenue dashboard, credit allocation |
| `school.registered` | New school joins | Admin dashboard, growth metrics |

---

## 2. MATERIALIZED VIEWS (Pre-computed Analytics)

### 2.1 `mv_student_progress_snapshot`

```sql
-- Refreshed after every assessment completion
CREATE MATERIALIZED VIEW mv_student_progress_snapshot AS
SELECT
  s.user_id AS student_id,
  s.current_school_id,
  se.class_id,
  cs.subject_id,
  -- Current readiness
  rs.score AS readiness_score,
  rs.category AS readiness_category,
  -- Learning velocity (last 2 assessments)
  lv.velocity AS learning_velocity,
  lv.trend AS velocity_trend,
  -- Concept mastery
  (SELECT COUNT(*) FROM concept_mastery cm
   WHERE cm.user_id = s.user_id AND cm.mastery_category = 'mastered') AS concepts_mastered,
  (SELECT COUNT(*) FROM concept_mastery cm
   WHERE cm.user_id = s.user_id AND cm.mastery_category IN ('practicing', 'competent')) AS concepts_in_progress,
  (SELECT COUNT(*) FROM concept_mastery cm
   WHERE cm.user_id = s.user_id AND cm.mastery_category = 'not_attempted') AS concepts_not_attempted,
  -- Assessment count
  (SELECT COUNT(*) FROM assessment_instances ai
   WHERE ai.user_id = s.user_id AND ai.status = 'completed') AS assessment_count,
  -- Last assessment date
  (SELECT MAX(ai.completed_at) FROM assessment_instances ai
   WHERE ai.user_id = s.user_id AND ai.status = 'completed') AS last_assessment_at
FROM student_profiles s
LEFT JOIN student_enrollments se ON se.student_id = s.user_id AND se.is_active = true
LEFT JOIN classes c ON c.id = se.class_id
LEFT JOIN readiness_scores rs ON rs.user_id = s.user_id
  AND rs.score_type = 'overall'
  AND rs.created_at = (
    SELECT MAX(rs2.created_at) FROM readiness_scores rs2 WHERE rs2.user_id = s.user_id
  )
LEFT JOIN learning_velocity lv ON lv.user_id = s.user_id
  AND lv.created_at = (
    SELECT MAX(lv2.created_at) FROM learning_velocity lv2 WHERE lv2.user_id = s.user_id
  )
WHERE s.enrollment_status = 'active';
```

### 2.2 `mv_school_dashboard`

```sql
CREATE MATERIALIZED VIEW mv_school_dashboard AS
SELECT
  s.id AS school_id,
  s.name AS school_name,
  -- Active counts
  (SELECT COUNT(*) FROM student_profiles sp
   WHERE sp.current_school_id = s.id AND sp.enrollment_status = 'active') AS total_students,
  (SELECT COUNT(*) FROM classes c WHERE c.school_id = s.id AND c.is_active = true) AS total_classes,
  (SELECT COUNT(*) FROM teacher_profiles tp
   WHERE tp.school_id = s.id AND tp.employment_status = 'active') AS total_teachers,
  -- Assessment stats
  (SELECT COUNT(*) FROM assessment_instances ai
   JOIN student_enrollments se ON se.student_id = ai.student_id
   JOIN classes c ON c.id = se.class_id
   WHERE c.school_id = s.id AND ai.status = 'completed') AS total_assessments,
  -- Average readiness
  (SELECT AVG(rs.score) FROM readiness_scores rs
   JOIN student_profiles sp ON sp.user_id = rs.user_id
   WHERE sp.current_school_id = s.id AND rs.score_type = 'overall'
   AND rs.created_at = (
     SELECT MAX(rs2.created_at) FROM readiness_scores rs2 WHERE rs2.user_id = rs.user_id
   )) AS avg_readiness_score,
  -- Risk count (students in critical/weak)
  (SELECT COUNT(*) FROM readiness_scores rs
   JOIN student_profiles sp ON sp.user_id = rs.user_id
   WHERE sp.current_school_id = s.id AND rs.score_type = 'overall'
   AND rs.category IN ('critical', 'weak')
   AND rs.created_at = (
     SELECT MAX(rs2.created_at) FROM readiness_scores rs2 WHERE rs2.user_id = rs.user_id
   )) AS at_risk_count,
  -- Revenue
  (SELECT COALESCE(SUM(t.amount), 0) FROM transactions t
   JOIN school_credits sc ON sc.school_id = s.id
   JOIN transaction_items ti ON ti.transaction_id = t.id AND ti.item_id::uuid = sc.id
   WHERE t.status = 'completed') AS total_revenue
FROM schools s
WHERE s.is_active = true;
```

---

## 3. FEATURE ENGINEERING

### 3.1 Derived Metrics & Their Formulas

| Metric | Formula | Range | Update Frequency |
|--------|---------|-------|------------------|
| **Readiness Score** | theta-to-score(θ̂) | 0-100 | Per assessment |
| **Concept Mastery** | (correct + 1) / (total + 2) × 100 | 0-100 | Per response |
| **Learning Velocity** | Δθ / Δdays | -∞ to +∞ | Per assessment pair |
| **Growth Rate** | (score_t - score₀) / t | % per day | Per assessment |
| **Cognitive Score** | avg(theta-to-score(θ̂)) per cognitive skill | 0-100 | Per assessment |
| **Confidence Index** | 1 - (SE(θ̂) / max_SE) | 0-100 | Per assessment |
| **Retention Score** | theta_assessmentN - theta_assessmentN-1 | -∞ to +∞ | Per assessment pair |
| **Time Efficiency** | avg(response_time) / expected_time | ratio | Per response |
| **Critical Thinking Score** | avg(theta-to-score for analyze+evaluate+create items) | 0-100 | Per assessment |
| **Knowledge Transfer** | correlation(concept A mastery, concept B mastery) | -1 to +1 | Per 5 assessments |

### 3.2 Risk Prediction Features

Features used for the risk prediction model:

| Feature | Description | Type |
|---------|-------------|------|
| `readiness_score` | Current overall readiness | Continuous (0-100) |
| `readiness_trend` | Slope of last 3 readiness scores | Continuous |
| `velocity` | Learning velocity (θ/day) | Continuous |
| `velocity_trend` | Is velocity accelerating? | Boolean |
| `concepts_critical` | Count of concepts in 'critical' state | Count |
| `concepts_declining` | Count of concepts with declining trend | Count |
| `days_since_last_assessment` | Days since last completed assessment | Continuous |
| `avg_response_time` | Average response time | Continuous |
| `completion_rate` | Fraction of assessments completed | Continuous (0-1) |
| `peer_percentile` | Percentile vs same-class peers | Continuous (0-100) |
| `subject_variance` | Variance across subject scores | Continuous |
| `attendance_pattern` | Weekly assessment regularity | Cyclical |
| `misconception_count` | Number of probable misconceptions | Count |
| `parent_engagement_score` | Parent dashboard login frequency | Continuous (0-100) |

---

## 4. CHART SPECIFICATIONS

### 4.1 Radar / Spider Chart

```
Specification:
- Type: Polar area chart
- Dimensions: 5-8 axes (subjects or cognitive skills)
- Each axis: 0-100 scale
- Data: Student score + peer average (overlay)
- Color: Primary fill (semi-transparent), peer average dashed line
- Interaction: Hover shows exact values, tap filters to subject
- Animation: Radial reveal on load

D3 Implementation outline:
- d3.scaleLinear() for each axis (domain: [0, 100])
- d3.lineRadial() for data paths
- d3.areaRadial() for fill
- d3.interpolate for animation
- Grid: concentric polygons at 20, 40, 60, 80, 100

Example data:
[
  { axis: 'Mathematics', student: 55, peerAvg: 62 },
  { axis: 'English', student: 78, peerAvg: 70 },
  { axis: 'Science', student: 61, peerAvg: 58 },
  { axis: 'Reasoning', student: 42, peerAvg: 50 },
  { axis: 'Critical Thinking', student: 38, peerAvg: 45 },
]
```

### 4.2 Heatmap (Subject × Bloom's Level)

```
Specification:
- Type: Matrix heatmap
- X-axis: Bloom's Taxonomy levels (Remember → Create)
- Y-axis: Subjects (Mathematics, English, Science, etc.)
- Cell value: Mastery score (0-100)
- Color scale: Red (#DC2626) → Yellow (#CA8A04) → Green (#16A34A)
  - 0-29: #DC2626 (Critical)
  - 30-44: #EA580C (Weak)
  - 45-59: #CA8A04 (Developing)
  - 60-74: #65A30D (Competent)
  - 75-89: #16A34A (Strong)
  - 90-100: #059669 (Mastered)
- Cell interaction: Click → drill-down to concept list
- Tooltip: "Mathematics × Apply: 58% — 4 concepts assessed"
- Empty cells: Grey #E5E7EB (no data)

Example data:
{
  subject: 'Mathematics',
  levels: [
    { level: 'Remember', score: 85 },
    { level: 'Understand', score: 72 },
    { level: 'Apply', score: 58 },
    { level: 'Analyze', score: 42 },
    { level: 'Evaluate', score: 35 },
    { level: 'Create', score: 28 },
  ],
}
```

### 4.3 Learning Curve (Theta Over Time)

```
Specification:
- Type: Line chart with confidence band
- X-axis: Time (assessment dates)
- Y-axis: Theta (-3 to +3)
- Data: Theta estimate per assessment
- Band: ±1 SE around theta (shaded region)
- Trend line: Local regression (LOESS) or linear
- Marker: Assessment point (size proportional to items)
- Annotations: Event markers (intervention, practice start)
- Color: Blue (#2563EB) line, light blue band (#DBEAFE)

D3: d3.line() + d3.area() for band, d3.curveMonotoneX for smoothness

Example data:
[
  { date: '2026-01-15', theta: -0.8, se: 0.32, items: 35 },
  { date: '2026-02-15', theta: -0.3, se: 0.30, items: 40 },
  { date: '2026-03-15', theta: 0.1, se: 0.28, items: 38 },
  { date: '2026-04-15', theta: 0.4, se: 0.27, items: 42 },
  { date: '2026-05-15', theta: 0.6, se: 0.26, items: 36 },
]
```

### 4.4 Gap Distribution (Waterfall)

```
Specification:
- Type: Horizontal bar chart (sorted)
- X-axis: Score (0-100)
- Y-axis: Concepts (sorted weakest → strongest)
- Color: 
  - Red if score < 45
  - Yellow if 45-59
  - Green if ≥ 60
- Bar: Filled to score value
- Annotation: "Prerequisite for: Algebra" on relevant bars
- Interaction: Click → show practice resources

Example data:
[
  { concept: 'Logical Deduction', score: 28, prerequisiteFor: ['Algebra', 'Geometry'] },
  { concept: 'Fraction Operations', score: 34, prerequisiteFor: ['Ratios', 'Decimals'] },
  { concept: 'Inference Making', score: 30, prerequisiteFor: ['Comprehension'] },
  { concept: 'Scientific Method', score: 40, prerequisiteFor: ['Experimentation'] },
  { concept: 'Reading Comprehension', score: 45, prerequisiteFor: [] },
  { concept: 'Vocabulary', score: 72, prerequisiteFor: [] },
  { concept: 'Grammar', score: 78, prerequisiteFor: [] },
]
```

### 4.5 Mastery Matrix (Table with Sparklines)

```
Specification:
- Type: Table with mini charts
- Columns: Concept | Mastery | Trend (sparkline) | Last Assessed | Action
- Each row: A concept
- Mastery: Progress bar with color
- Trend: Mini line chart (last 5 scores)
- Sort: By mastery ascending (weakest first)
- Filter: By subject, status
- Export: Download as CSV

Sparkline: Mini line chart, 50px wide, 20px tall
- d3.line() on tiny SVG
- Color: Green if trend up, Red if down
```

### 4.6 Knowledge Graph (Network)

```
Specification:
- Type: Force-directed graph
- Nodes: Concepts
- Edges: Prerequisite relationships
- Node size: Importance weight
- Node color: Mastery level (red → yellow → green)
- Edge width: Relationship strength
- Interaction: 
  - Drag nodes to rearrange
  - Click node → show concept detail
  - Hover → highlight path to mastery
  - Zoom/Pan
- Layout: d3.forceSimulation()
  - d3.forceLink() for edges
  - d3.forceManyBody() for repulsion
  - d3.forceCenter() for centering
  - d3.forceCollide() to prevent overlap
- Only show concepts relevant to the student's current level
- Limit display to ~50 nodes max (cluster the rest)

Styling:
- Node radius: 8-24px (based on importance_weight 1-10)
- Label: Concept name (truncated, show full on hover)
- Arrow: Directed edges from prerequisite → concept
```

### 4.7 Prediction / Forecast Chart

```
Specification:
- Type: Line chart with forecast extension
- X-axis: Time (past + future)
- Y-axis: Readiness Score (0-100)
- Data: Historical scores (solid line)
- Forecast: Dashed line with confidence interval (fan chart)
- Annotations: 
  - "Target: JSS1 Readiness (80)" horizontal line
  - "Current trajectory: January 2027" intersection marker
  - "With daily practice: September 2026" intersection marker
- Color: Solid blue for historical, dashed purple for forecast

Fan chart: d3.area() with graduated opacity bands for confidence intervals
```

---

## 5. DASHBOARD DATA SPECIFICATIONS

### 5.1 Student Dashboard

```typescript
interface StudentDashboardData {
  // Header
  greeting: string;
  streakDays: number;
  nextAction: string;
  
  // Overall readiness (large gauge)
  overallReadiness: {
    score: number;
    previousScore: number;
    change: number;
    category: string;
  };
  
  // Radar chart data
  radarData: {
    dimension: string;
    score: number;
    peerAverage: number;
  }[];
  
  // Quick stats
  stats: {
    assessmentsCompleted: number;
    weakConcepts: number;
    strongConcepts: number;
    deepReportsPurchased: number;
  };
  
  // Weak concepts (top 5)
  weakConcepts: {
    conceptId: string;
    name: string;
    score: number;
    prerequisiteOf: string[];
    practiceUrl: string;
  }[];
  
  // Daily practice card
  dailyPractice: {
    title: string;
    description: string;
    estimatedMinutes: number;
    exercises: PracticeExercise[];
  } | null;
  
  // Learning journey (last 5 assessments)
  journey: {
    date: string;
    score: number;
    assessmentType: string;
    instanceId: string;
  }[];
  
  // AI recommendations (top 3)
  recommendations: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  
  // Quick actions
  quickActions: {
    type: 'new_assessment' | 'view_report' | 'invite_parent' | 'practice';
    label: string;
    url: string;
    disabled: boolean;
    disabledReason?: string;
  }[];
}
```

### 5.2 School Dashboard

```typescript
interface SchoolDashboardData {
  // School identity
  school: {
    id: string;
    name: string;
    logo: string;
    currentTerm: string;
  };
  
  // KPI cards
  kpis: {
    totalStudents: number;
    activeStudents: number;
    totalTeachers: number;
    totalClasses: number;
    assessmentsThisTerm: number;
    averageReadiness: number;
    atRiskCount: number;
    atRiskPercent: number;
  };
  
  // Readiness distribution (histogram)
  readinessDistribution: {
    range: string; // '0-29', '30-44', '45-59', '60-74', '75-89', '90-100'
    count: number;
    color: string;
  }[];
  
  // Subject comparison (bar chart)
  subjectComparison: {
    subject: string;
    averageScore: number;
    studentCount: number;
  }[];
  
  // Class comparison (bar chart)
  classComparison: {
    className: string;
    averageScore: number;
    studentCount: number;
    trend: 'improving' | 'stable' | 'declining';
  }[];
  
  // Trend (last 12 months)
  trend: {
    month: string;
    averageReadiness: number;
    studentCount: number;
  }[];
  
  // At-risk students (top 10)
  atRiskStudents: {
    id: string;
    name: string;
    className: string;
    readinessScore: number;
    criticalConcepts: number;
    lastAssessment: string;
  }[];
  
  // Recent activities
  recentActivity: {
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }[];
}
```

### 5.3 Parent Dashboard

```typescript
interface ParentDashboardData {
  children: {
    id: string;
    name: string;
    school: string;
    class: string;
    
    // Quick snapshot
    readinessScore: number;
    readinessCategory: string;
    scoreChange: number;
    lastAssessed: string;
    
    // Weak concepts (3)
    topWeaknesses: { concept: string; score: number }[];
    
    // Radar mini
    radarData: { dimension: string; score: number }[];
    
    // Has new report
    hasNewReport: boolean;
    latestReportId: string;
  }[];
  
  // Parent support index (if completed)
  parentSupportIndex?: {
    score: number;
    category: string;
    lastUpdated: string;
  };
  
  // Recommended actions for parent
  recommendedActions: {
    childId: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}
```

---

## 6. AI RECOMMENDATION ENGINE

### 6.1 Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Assessment      │     │  Rule Engine     │     │  LLM Service     │
│  Results +       │────▶│  (deterministic) │────▶│  (GPT-4o-mini)   │
│  Analytics       │     │                  │     │                  │
│                  │     │                  │     │                  │
│  - Theta scores  │     │  Categories:     │     │  Template-based  │
│  - Misconception │     │  • Score gaps    │     │  prompts with    │
│  - Velocities    │     │  • Trends        │     │  student data    │
│  - Mastery data  │     │  • Risk flags    │     │  injected        │
│  - Behaviors     │     │  • Prerequisites │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                 │                          │
                                 ▼                          ▼
                         ┌──────────────────┐     ┌──────────────────┐
                         │  Fusion Layer    │────▶│  Output:         │
                         │  (prioritize,    │     │  Recommendations │
                         │  deduplicate,    │     │  array           │
                         │  format)         │     │  with reasoning  │
                         └──────────────────┘     └──────────────────┘
```

### 6.2 Rule Engine (Deterministic)

Rule engine runs first and generates structured recommendation triggers:

```typescript
interface RuleTrigger {
  type: string;
  priority: number; // 1-5 (5 = highest)
  targetRole: 'student' | 'parent' | 'teacher' | 'school_admin';
  condition: string; // human-readable
  suggestedAction: string;
  data: Record<string, any>;
}

class RecommendationRuleEngine {
  evaluate(studentData: AggregatedStudentData): RuleTrigger[] {
    const triggers: RuleTrigger[] = [];

    // Rule 1: Concept at critical level
    for (const concept of studentData.weakConcepts) {
      if (concept.score < 30) {
        triggers.push({
          type: 'critical_concept',
          priority: 5,
          targetRole: 'student',
          condition: `${concept.name} is at critical level (${concept.score}%)`,
          suggestedAction: `Focus 10 minutes daily on ${concept.name} exercises`,
          data: { conceptId: concept.id, score: concept.score },
        });
        // Also alert teacher and parent
        triggers.push({
          type: 'critical_concept_teacher_alert',
          priority: 5,
          targetRole: 'teacher',
          condition: `${studentData.name} has critical gap in ${concept.name}`,
          suggestedAction: `Provide additional support on ${concept.name} in class`,
          data: { studentId: studentData.id, conceptId: concept.id },
        });
      }
    }

    // Rule 2: Rapid decline detected
    if (studentData.velocity < -0.05 && studentData.velocityTrend === 'declining') {
      triggers.push({
        type: 'rapid_decline',
        priority: 5,
        targetRole: 'parent',
        condition: `${studentData.name}'s learning rate is declining rapidly`,
        suggestedAction: 'Review study habits and ensure adequate sleep and nutrition',
        data: { velocity: studentData.velocity },
      });
    }

    // Rule 3: Prerequisite gaps blocking progress
    for (const gap of studentData.prerequisiteGaps) {
      if (gap.isBlocking) {
        triggers.push({
          type: 'prerequisite_blocker',
          priority: 4,
          targetRole: 'teacher',
          condition: `${gap.missingConcept} is blocking ${gap.blockedConcept}`,
          suggestedAction: `Re-teach ${gap.missingConcept} before proceeding with ${gap.blockedConcept}`,
          data: { missingConceptId: gap.missingConceptId, blockedConceptId: gap.blockedConceptId },
        });
      }
    }

    // Rule 4: High potential with low engagement
    if (studentData.theta > 1.0 && studentData.daysSinceLastAssessment > 30) {
      triggers.push({
        type: 'disengaged_high_potential',
        priority: 3,
        targetRole: 'student',
        condition: 'You have strong potential but haven't assessed recently',
        suggestedAction: 'Take a new assessment to track your continued growth',
        data: { daysSinceLast: studentData.daysSinceLastAssessment },
      });
    }

    // Rule 5: Misconception detected
    for (const mc of studentData.detectedMisconceptions) {
      if (mc.probability > 0.7) {
        triggers.push({
          type: 'misconception_detected',
          priority: 4,
          targetRole: 'student',
          condition: `You may have a misconception: ${mc.name}`,
          suggestedAction: mc.correctionStrategy,
          data: { misconceptionId: mc.id, probability: mc.probability },
        });
      }
    }

    // Rule 6: Parent engagement opportunity
    if (studentData.parentEngagementScore < 30) {
      triggers.push({
        type: 'low_parent_engagement',
        priority: 3,
        targetRole: 'parent',
        condition: 'Parent engagement is below recommended level',
        suggestedAction: 'Log in weekly to review your child's progress',
        data: { engagementScore: studentData.parentEngagementScore },
      });
    }

    // Rule 7: School-level curriculum gaps
    if (studentData.schoolAverageReadiness < 50) {
      triggers.push({
        type: 'school_curriculum_gap',
        priority: 4,
        targetRole: 'school_admin',
        condition: 'School-wide readiness below 50% — curriculum review recommended',
        suggestedAction: 'Review curriculum alignment and teaching methods',
        data: { schoolAverage: studentData.schoolAverageReadiness },
      });
    }

    return triggers;
  }
}
```

### 6.3 LLM Prompt Templates

```typescript
const PROMPT_TEMPLATES = {
  student_recommendations: `You are an expert educational diagnostician. 
Based on the following student data, generate 3 specific, actionable recommendations 
for the student to improve their learning. Keep recommendations concise (1-2 sentences each) 
and encouraging. Use language appropriate for a {{studentAge}}-year-old.

Student Data:
- Overall Readiness: {{readinessScore}}/100
- Weakest Concepts: {{weakConcepts}} (scores: {{weakScores}})
- Strongest Concepts: {{strongConcepts}}
- Learning Velocity: {{velocity}} ({{velocityTrend}})
- Detected Misconceptions: {{misconceptions}}
- Time Since Last Assessment: {{daysSinceLast}} days

Generate exactly 3 recommendations in JSON format:
[{"title": "...", "description": "...", "timeFrame": "today|this_week|this_month"}]
`,

  parent_recommendations: `You are an expert in educational psychology and parenting support.
Based on the following parent and child data, generate 3 specific recommendations 
for the parent to better support their child's learning. 

Parent Data:
- Parent Support Index: {{parentSupportIndex}}/100
- Home Learning Score: {{homeLearningScore}}/100

Child Data:
- Overall Readiness: {{readinessScore}}/100
- Weakest Concepts: {{weakConcepts}}
- Identified Misconceptions: {{misconceptions}}

Generate exactly 3 recommendations in JSON format:
[{"title": "...", "description": "...", "timeFrame": "this_week|this_month"}]
`,

  teacher_recommendations: `You are an expert instructional coach. 
Based on the following class data, generate 3 specific teaching recommendations.

Class Data:
- Class Average Readiness: {{classAverage}}/100
- Subject Breakdown: {{subjectBreakdown}}
- Common Gaps: {{commonGaps}}
- At-Risk Students: {{atRiskCount}} of {{totalStudents}}
- Distribution: {{distribution}}

Generate exactly 3 recommendations in JSON format:
[{"title": "...", "description": "...", "focusArea": "lesson_plan|teaching_method|assessment"}]
`,

  school_recommendations: `You are an expert school improvement consultant.
Based on the following school data, generate 3 strategic recommendations.

School Data:
- School Performance Score: {{schoolScore}}/100
- Teaching Quality Indicator: {{teachingQuality}}
- Critical Thinking Score: {{criticalThinkingScore}}
- Curriculum Alignment: {{curriculumAlignment}}
- Subject Risk Index: {{subjectRiskIndex}}
- Benchmark vs Similar Schools: {{benchmark}}

Generate exactly 3 recommendations in JSON format:
[{"title": "...", "description": "...", "priority": "high|medium|low", "timeline": "this_term|next_term|this_year"}]
`,
};
```

### 6.4 LLM Service Integration

```typescript
class RecommendationLLMService {
  private model: string;
  private apiKey: string;

  constructor(config: AiModelConfig) {
    this.model = config.modelName;
    this.apiKey = config.apiKey;
  }

  async generateRecommendations(
    templateType: string,
    variables: Record<string, string>,
    promptTemplates: Map<string, string>
  ): Promise<Recommendation[]> {
    const template = promptTemplates.get(templateType);
    if (!template) {
      // Fallback to rule-based
      return this.generateRuleBasedFallback(templateType, variables);
    }

    // Inject variables into template
    const prompt = this.fillTemplate(template, variables);

    try {
      // Call LLM API (OpenRouter / OpenAI compatible)
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an educational diagnostic expert. Return ONLY valid JSON.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3, // Low temperature for consistency
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const recommendations = JSON.parse(content);

      return this.validateAndFormat(recommendations, templateType);
    } catch (error) {
      console.error('LLM recommendation failed:', error);
      return this.generateRuleBasedFallback(templateType, variables);
    }
  }

  private fillTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  private validateAndFormat(
    raw: any[],
    templateType: string
  ): Recommendation[] {
    // Validate structure, sanitize, ensure required fields
    return raw.slice(0, 5).map((r, i) => ({
      id: `rec-${templateType}-${Date.now()}-${i}`,
      title: r.title || 'Recommendation',
      description: r.description || '',
      timeframe: r.timeFrame || r.timeline || 'this_week',
      priority: r.priority || 3,
      isGenerated: true,
      createdAt: new Date().toISOString(),
    }));
  }

  private generateRuleBasedFallback(
    templateType: string,
    variables: Record<string, string>
  ): Recommendation[] {
    const score = parseInt(variables.readinessScore || '50');
    const fallbacks: Recommendation[] = [];

    if (score < 45) {
      fallbacks.push({
        id: `rule-${templateType}-1`,
        title: 'Focus on fundamentals',
        description: 'Review the core concepts you are struggling with. Start with the prerequisites and build up.',
        timeframe: 'this_week',
        priority: 5,
        isGenerated: false,
        createdAt: new Date().toISOString(),
      });
    }

    fallbacks.push({
      id: `rule-${templateType}-2`,
      title: 'Practice consistently',
      description: 'Set aside 15 minutes daily for focused practice on your weakest areas.',
      timeframe: 'today',
      priority: 4,
      isGenerated: false,
      createdAt: new Date().toISOString(),
    });

    return fallbacks;
  }
}
```

### 6.5 Daily Plan Generation

```typescript
function generateDailyPlan(
  studentData: AggregatedStudentData,
  recommendations: Recommendation[],
  date: Date = new Date()
): DailyPlan {
  // 1. Identify today's focus concept (weakest with highest priority)
  const focusConcept = studentData.weakConcepts
    .filter(c => c.score < 60)
    .sort((a, b) => a.score - b.score)[0];

  // 2. Generate quick exercises
  const exercises: PracticeExercise[] = [];
  
  if (focusConcept) {
    exercises.push({
      type: 'concept_review',
      conceptId: focusConcept.id,
      conceptName: focusConcept.name,
      description: `Read a 2-minute overview of ${focusConcept.name}`,
      estimatedMinutes: 2,
    });
    
    exercises.push({
      type: 'practice_questions',
      conceptId: focusConcept.id,
      conceptName: focusConcept.name,
      questionCount: 3,
      estimatedMinutes: 5,
    });
  }

  // 3. Add a misconception correction if applicable
  const topMisconception = studentData.detectedMisconceptions?.[0];
  if (topMisconception && topMisconception.probability > 0.6) {
    exercises.push({
      type: 'misconception_correction',
      misconceptionId: topMisconception.id,
      description: topMisconception.correctionStrategy,
      estimatedMinutes: 3,
    });
  }

  // 4. Add a review exercise from a strong concept (confidence boost)
  const strongConcept = studentData.strongConcepts?.[0];
  if (strongConcept) {
    exercises.push({
      type: 'review',
      conceptId: strongConcept.id,
      conceptName: strongConcept.name,
      description: `Quick review: ${strongConcept.name} (1 question)`,
      estimatedMinutes: 1,
    });
  }

  // 5. Add a reading or resource recommendation
  const topRec = recommendations[0];
  if (topRec) {
    exercises.push({
      type: 'recommendation',
      recommendationId: topRec.id,
      description: topRec.description,
      estimatedMinutes: 4,
    });
  }

  return {
    date: date.toISOString().split('T')[0],
    totalEstimatedMinutes: exercises.reduce((sum, e) => sum + e.estimatedMinutes, 0),
    exercises,
    focusArea: focusConcept?.name || null,
    motivationTip: getMotivationalTip(studentData),
  };
}

function getMotivationalTip(data: AggregatedStudentData): string {
  if (data.streakDays >= 7) return 'Amazing 7-day streak! You're building a powerful habit.';
  if (data.velocity > 0.05) return 'Your learning speed is impressive. Keep going!';
  if (data.readinessScore > data.previousReadinessScore) return 'You're improving! Every day counts.';
  return 'Small steps every day lead to big results. You've got this!';
}
```

---

## 7. PREDICTION ENGINE

### 7.1 Score Projection

```typescript
function projectScore(
  currentScore: number,
  velocity: number, // score change per day
  velocityTrend: 'accelerating' | 'stable' | 'declining',
  daysUntilTarget: number,
  withDailyPractice: boolean = false
): ScoreProjection {
  // Adjust velocity based on trend
  let adjustedVelocity = velocity;
  if (velocityTrend === 'accelerating') {
    adjustedVelocity *= 1.2; // 20% acceleration
  } else if (velocityTrend === 'declining') {
    adjustedVelocity *= 0.8; // 20% deceleration
  }

  // Base projection (current trajectory)
  const baseProjected = Math.min(100, Math.max(0,
    currentScore + (adjustedVelocity * daysUntilTarget)
  ));

  // With daily practice (improved trajectory)
  const practiceBoost = withDailyPractice ? 1.5 : 1.0;
  const practiceProjected = Math.min(100, Math.max(0,
    currentScore + (adjustedVelocity * practiceBoost * daysUntilTarget)
  ));

  // Risk projection (if nothing changes: slight decay)
  const riskProjected = Math.max(0,
    currentScore + (adjustedVelocity * 0.5 * daysUntilTarget)
  );

  // Projection per month
  const monthlyProjections: MonthlyProjection[] = [];
  for (let m = 1; m <= Math.ceil(daysUntilTarget / 30); m++) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() + m);

    monthlyProjections.push({
      month: monthDate.toISOString().slice(0, 7),
      baseProjection: Math.min(100, Math.max(0,
        currentScore + (adjustedVelocity * m * 30)
      )),
      practiceProjection: Math.min(100, Math.max(0,
        currentScore + (adjustedVelocity * practiceBoost * m * 30)
      )),
      upperBound: Math.min(100, Math.max(0,
        currentScore + (adjustedVelocity * practiceBoost * m * 30) + 8
      )),
      lowerBound: Math.min(100, Math.max(0,
        currentScore + (adjustedVelocity * practiceBoost * m * 30) - 8
      )),
    });
  }

  return {
    currentScore,
    currentVelocity: adjustedVelocity,
    targetDate: new Date(Date.now() + daysUntilTarget * 86400000).toISOString(),
    baseProjectedScore: Math.round(baseProjected),
    practiceProjectedScore: Math.round(practiceProjected),
    riskProjectedScore: Math.round(riskProjected),
    monthlyProjections,
    confidenceInterval: velocityTrend === 'accelerating' ? 'moderate'
      : velocityTrend === 'declining' ? 'low'
      : 'moderate',
  };
}
```

### 7.2 Readiness Classification using Decision Tree

```typescript
function classifyReadiness(studentData: AggregatedStudentData): ReadinessClassification {
  // Decision tree for readiness classification
  // Used alongside continuous score for categorical output

  // Node 1: Check if sufficient data
  if (studentData.assessmentCount < 1) {
    return {
      classification: 'insufficient_data',
      description: 'Complete at least one assessment to receive readiness classification.',
    };
  }

  // Node 2: Check for critical gaps
  const criticalCount = studentData.weakConcepts.filter(c => c.score < 30).length;
  const decliningTrend = studentData.velocityTrend === 'declining';

  if (criticalCount >= 3 || (criticalCount >= 2 && decliningTrend)) {
    return {
      classification: 'critical_intervention',
      description: `Multiple critical gaps detected (${criticalCount} concepts below 30%). Immediate intervention required.`,
      severity: 'critical',
      recommendedAction: 'Schedule intensive remediation sessions. Consider postponing transition.',
    };
  }

  // Node 3: Check for moderate gaps
  const moderateGaps = studentData.weakConcepts.filter(c => c.score < 50).length;
  if (moderateGaps >= 5 || studentData.readinessScore < 50) {
    return {
      classification: 'needs_development',
      description: `Significant gaps in ${moderateGaps} concepts. Structured remediation recommended.`,
      severity: 'warning',
      recommendedAction: 'Create a 4-week remediation plan targeting weakest concepts first.',
    };
  }

  // Node 4: Check readiness level
  if (studentData.readinessScore >= 75) {
    return {
      classification: 'ready',
      description: 'Student is well-prepared. Maintain current learning pace.',
      severity: 'success',
      recommendedAction: 'Proceed to next level. Re-assess in 3 months.',
    };
  }

  // Default
  return {
    classification: 'moderate_preparation',
    description: 'Some gaps remain but student is making progress. Targeted practice recommended.',
    severity: 'info',
    recommendedAction: 'Follow personalized daily plan. Re-assess in 30 days.',
  };
}
```

---

## 8. CACHE STRATEGY FOR ANALYTICS

| Cache Key | Data | TTL | Invalidation |
|-----------|------|-----|--------------|
| `dash:student:{userId}` | Student dashboard data | 5 min | On assessment complete |
| `dash:school:{schoolId}` | School dashboard data | 15 min | On assessment complete (batch) |
| `dash:parent:{parentId}` | Parent dashboard data | 5 min | On new report for any child |
| `dash:admin:stats` | Admin KPIs | 30 min | Manual refresh |
| `report:basic:{instanceId}` | Basic report data | 1 hour | Never (immutable) |
| `report:deep:{reportId}` | Deep report data | 1 hour | On regeneration |
| `chart:radar:{userId}` | Radar chart data | 1 hour | On new assessment |
| `chart:heatmap:{userId}` | Heatmap data | 1 hour | On new assessment |
| `chart:trend:{schoolId}` | School trend data | 1 hour | Daily batch update |
| `ai:rec:{userId}:{role}` | AI recommendations | 1 hour | On new assessment |
| `public:stats` | Landing page stats | 5 min | Daily batch |

---

*End of Phase 8 — Analytics & AI Recommendation Engine*

**Complete analytics architecture, materialized views, derived metrics, 7 chart specifications, dashboard data contracts, rule-based + LLM recommendation engine, prediction engine, decision tree classifier, caching strategy.**

**Next: Phase 9 — Reporting Engine**

*Confirm readiness to proceed to Phase 9.*
