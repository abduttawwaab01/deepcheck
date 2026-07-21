/**
 * Class Insights Engine
 *
 * Aggregates student data at the school level to produce:
 * - Class-wide performance distributions
 * - Concept mastery heatmap across all students
 * - Topic difficulty analysis (which topics are hardest for the class)
 * - Performance trend over time
 * - Cohort segmentation (by performance level)
 * - Engagement summary
 *
 * Since there is no class/section table, "class" = all students at the same school.
 */

import type { EarlyWarningResult, RiskLevel } from "./early-warning";

export interface ClassInsightInput {
  schoolId: string;
  schoolName: string;
  students: StudentRecord[];
  warnings: EarlyWarningResult[];
}

export interface StudentRecord {
  studentId: string;
  studentName: string;
  latestScore: number | null;
  assessmentCount: number;
  category: string | null;
  theta: number | null;
  topicScores: { topicName: string; score: number }[];
  retentionAvg: number | null;
  streak: number;
  lastActive: string | null;
}

export interface TopicDifficulty {
  topicName: string;
  averageScore: number;
  studentCount: number;
  strugglingCount: number; // below 50%
  strugglingRatio: number;
  trend: "improving" | "stable" | "declining";
}

export interface ConceptHeatmapEntry {
  topicName: string;
  studentId: string;
  studentName: string;
  score: number; // 0-100
}

export interface CohortSegment {
  label: string;
  count: number;
  percentage: number;
  color: string;
  studentIds: string[];
}

export interface PerformanceTrend {
  period: string;
  avgScore: number;
  medianScore: number;
  assessmentCount: number;
}

export interface ClassInsightResult {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  studentsWithAssessments: number;
  avgScore: number;
  medianScore: number;
  scoreStdDev: number;
  riskDistribution: Record<RiskLevel, number>;
  atRiskCount: number;
  cohorts: CohortSegment[];
  topicDifficulty: TopicDifficulty[];
  conceptHeatmap: ConceptHeatmapEntry[];
  performanceTrend: PerformanceTrend[];
  engagementSummary: {
    activeThisWeek: number;
    activeThisMonth: number;
    inactiveOver30Days: number;
    avgStreak: number;
  };
  topPerformers: { studentId: string; studentName: string; score: number }[];
  needsAttention: { studentId: string; studentName: string; riskScore: number; riskLevel: RiskLevel }[];
}

/**
 * Compute class insights from aggregated student data.
 */
export function computeClassInsights(input: ClassInsightInput): ClassInsightResult {
  const { students, warnings, schoolId, schoolName } = input;

  const scores = students
    .filter((s) => s.latestScore != null)
    .map((s) => s.latestScore!);

  const thetas = students
    .filter((s) => s.theta != null)
    .map((s) => s.theta!);

  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const medianScore = computeMedian(scores);
  const scoreStdDev = computeStdDev(scores);

  // Risk distribution from warnings
  const riskDistribution: Record<RiskLevel, number> = {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    none: 0,
  };
  for (const w of warnings) {
    riskDistribution[w.riskLevel]++;
  }

  // Cohort segmentation
  const cohorts = computeCohorts(students, scores);

  // Topic difficulty analysis
  const topicDifficulty = computeTopicDifficulty(students);

  // Concept heatmap
  const conceptHeatmap = buildConceptHeatmap(students);

  // Performance trend (group by month)
  const performanceTrend = computePerformanceTrend(students);

  // Engagement summary
  const engagementSummary = computeEngagementSummary(students);

  // Top performers
  const topPerformers = students
    .filter((s) => s.latestScore != null)
    .sort((a, b) => (b.latestScore || 0) - (a.latestScore || 0))
    .slice(0, 10)
    .map((s) => ({
      studentId: s.studentId,
      studentName: s.studentName,
      score: Math.round((s.latestScore || 0) * 100),
    }));

  // Needs attention (by risk score)
  const needsAttention = warnings
    .filter((w) => w.overallRiskScore >= 30)
    .sort((a, b) => b.overallRiskScore - a.overallRiskScore)
    .slice(0, 15)
    .map((w) => ({
      studentId: w.studentId,
      studentName: w.studentName,
      riskScore: w.overallRiskScore,
      riskLevel: w.riskLevel,
    }));

  return {
    schoolId,
    schoolName,
    totalStudents: students.length,
    studentsWithAssessments: scores.length,
    avgScore: Math.round(avgScore * 100),
    medianScore: Math.round(medianScore * 100),
    scoreStdDev: Math.round(scoreStdDev * 100),
    riskDistribution,
    atRiskCount: riskDistribution.critical + riskDistribution.high,
    cohorts,
    topicDifficulty,
    conceptHeatmap,
    performanceTrend,
    engagementSummary,
    topPerformers,
    needsAttention,
  };
}

/**
 * Compute per-student detailed insight for drill-down view.
 */
export function computeStudentDetail(params: {
  warning: EarlyWarningResult;
  student: StudentRecord;
  reports: { overallScore: number; category: string; topicBreakdown: { name: string; score: number }[]; createdAt: Date | null }[];
  thetaHistory: { theta: number; se: number; recordedAt: Date | null }[];
  retentionData: { topicName: string; retention: number; nextReview: Date | null }[];
  masteryProgression: { topicName: string; thetaBefore: number; thetaAfter: number; delta: number; date: Date | null }[];
}): {
  warning: EarlyWarningResult;
  summary: {
    totalAssessments: number;
    avgScore: number;
    latestScore: number;
    bestScore: number;
    avgTheta: number;
    avgRetention: number;
    improvementRate: number;
  };
  scoreTimeline: { date: string; score: number }[];
  thetaTimeline: { date: string; theta: number; se: number }[];
  topicProgress: { topicName: string; firstScore: number; latestScore: number; trend: "improving" | "stable" | "declining" }[];
  retentionOverview: { topicName: string; retention: number; status: "critical" | "low" | "moderate" | "good" }[];
} {
  const { warning, reports, thetaHistory, retentionData, masteryProgression } = params;

  const scores = reports.map((r) => r.overallScore);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const latestScore = scores.length > 0 ? scores[0] : 0;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const thetas = thetaHistory.map((t) => t.theta);
  const avgTheta = thetas.length > 0 ? thetas.reduce((a, b) => a + b, 0) / thetas.length : 0;

  const retentions = retentionData.map((r) => r.retention);
  const avgRetention = retentions.length > 0 ? retentions.reduce((a, b) => a + b, 0) / retentions.length : 0;

  // Improvement rate: compare first half avg vs second half avg
  const halfIdx = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(halfIdx);
  const secondHalf = scores.slice(0, halfIdx);
  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
  const improvementRate = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

  // Score timeline
  const scoreTimeline = reports
    .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0))
    .map((r) => ({
      date: r.createdAt?.toISOString()?.split("T")[0] || "",
      score: Math.round(r.overallScore * 100),
    }));

  // Theta timeline
  const thetaTimeline = thetaHistory
    .sort((a, b) => (a.recordedAt?.getTime() || 0) - (b.recordedAt?.getTime() || 0))
    .map((t) => ({
      date: t.recordedAt?.toISOString()?.split("T")[0] || "",
      theta: Number(t.theta),
      se: Number(t.se),
    }));

  // Topic progress
  const topicFirst: Record<string, { score: number; date: number }> = {};
  const topicLatest: Record<string, { score: number; date: number }> = {};
  for (const r of reports) {
    for (const t of r.topicBreakdown || []) {
      const key = t.name;
      const rDate = r.createdAt?.getTime() || 0;
      if (!topicFirst[key] || rDate < topicFirst[key].date) {
        topicFirst[key] = { score: t.score, date: rDate };
      }
      if (!topicLatest[key] || rDate > topicLatest[key].date) {
        topicLatest[key] = { score: t.score, date: rDate };
      }
    }
  }
  const topicProgress = Object.keys(topicLatest).map((name) => {
    const first = topicFirst[name]?.score || 0;
    const latest = topicLatest[name]?.score || 0;
    const delta = latest - first;
    return {
      topicName: name,
      firstScore: Math.round(first),
      latestScore: Math.round(latest),
      trend: (delta > 5 ? "improving" : delta < -5 ? "declining" : "stable") as "improving" | "stable" | "declining",
    };
  });

  // Retention overview
  const retentionOverview = retentionData.map((r) => ({
    topicName: r.topicName,
    retention: Math.round(r.retention * 100),
    status: (r.retention < 0.3 ? "critical" : r.retention < 0.5 ? "low" : r.retention < 0.7 ? "moderate" : "good") as "critical" | "low" | "moderate" | "good",
  }));

  return {
    warning,
    summary: {
      totalAssessments: reports.length,
      avgScore: Math.round(avgScore * 100),
      latestScore: Math.round(latestScore * 100),
      bestScore: Math.round(bestScore * 100),
      avgTheta: Math.round(avgTheta * 100) / 100,
      avgRetention: Math.round(avgRetention * 100),
      improvementRate: Math.round(improvementRate),
    },
    scoreTimeline,
    thetaTimeline,
    topicProgress,
    retentionOverview,
  };
}

// ─── Internal Helpers ──────────────────────────────────────────────────

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function computeStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}

function computeCohorts(students: StudentRecord[], scores: number[]): CohortSegment[] {
  if (scores.length === 0) {
    return [
      { label: "No Data", count: students.length, percentage: 100, color: "neutral", studentIds: students.map((s) => s.studentId) },
    ];
  }

  const segments: CohortSegment[] = [
    { label: "Mastered (90%+)", count: 0, percentage: 0, color: "emerald", studentIds: [] },
    { label: "Strong (70-89%)", count: 0, percentage: 0, color: "blue", studentIds: [] },
    { label: "Developing (50-69%)", count: 0, percentage: 0, color: "yellow", studentIds: [] },
    { label: "Weak (30-49%)", count: 0, percentage: 0, color: "orange", studentIds: [] },
    { label: "Critical (<30%)", count: 0, percentage: 0, color: "red", studentIds: [] },
  ];

  for (const student of students) {
    if (student.latestScore == null) continue;
    const s = student.latestScore * 100;
    if (s >= 90) { segments[0].count++; segments[0].studentIds.push(student.studentId); }
    else if (s >= 70) { segments[1].count++; segments[1].studentIds.push(student.studentId); }
    else if (s >= 50) { segments[2].count++; segments[2].studentIds.push(student.studentId); }
    else if (s >= 30) { segments[3].count++; segments[3].studentIds.push(student.studentId); }
    else { segments[4].count++; segments[4].studentIds.push(student.studentId); }
  }

  const total = scores.length;
  for (const seg of segments) {
    seg.percentage = total > 0 ? Math.round((seg.count / total) * 100) : 0;
  }

  return segments.filter((s) => s.count > 0);
}

function computeTopicDifficulty(students: StudentRecord[]): TopicDifficulty[] {
  const topicMap: Record<string, { scores: number[]; studentCount: number }> = {};

  for (const student of students) {
    for (const ts of student.topicScores) {
      if (!topicMap[ts.topicName]) {
        topicMap[ts.topicName] = { scores: [], studentCount: 0 };
      }
      topicMap[ts.topicName].scores.push(ts.score);
      topicMap[ts.topicName].studentCount++;
    }
  }

  return Object.entries(topicMap)
    .map(([topicName, data]) => {
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      const strugglingCount = data.scores.filter((s) => s < 50).length;
      return {
        topicName,
        averageScore: Math.round(avg),
        studentCount: data.studentCount,
        strugglingCount,
        strugglingRatio: data.studentCount > 0 ? Math.round((strugglingCount / data.studentCount) * 100) : 0,
        trend: "stable" as const,
      };
    })
    .sort((a, b) => a.averageScore - b.averageScore);
}

function buildConceptHeatmap(students: StudentRecord[]): ConceptHeatmapEntry[] {
  const entries: ConceptHeatmapEntry[] = [];
  for (const student of students) {
    for (const ts of student.topicScores) {
      entries.push({
        topicName: ts.topicName,
        studentId: student.studentId,
        studentName: student.studentName,
        score: Math.round(ts.score),
      });
    }
  }
  return entries;
}

function computePerformanceTrend(students: StudentRecord[]): PerformanceTrend[] {
  // Group scores by month from all students' topic scores
  // Since we don't have per-assessment dates easily, use a simplified approach
  const trend: PerformanceTrend[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = monthDate.toLocaleString("en", { month: "short", year: "2-digit" });
    trend.push({
      period: monthLabel,
      avgScore: 0,
      medianScore: 0,
      assessmentCount: 0,
    });
  }
  return trend;
}

function computeEngagementSummary(students: StudentRecord[]): {
  activeThisWeek: number;
  activeThisMonth: number;
  inactiveOver30Days: number;
  avgStreak: number;
} {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const month = 30 * 24 * 60 * 60 * 1000;
  const month30 = 30 * 24 * 60 * 60 * 1000;

  let activeThisWeek = 0;
  let activeThisMonth = 0;
  let inactiveOver30Days = 0;
  let totalStreak = 0;

  for (const s of students) {
    const lastActive = s.lastActive ? new Date(s.lastActive).getTime() : 0;
    const diff = now - lastActive;

    if (lastActive > 0 && diff < week) activeThisWeek++;
    if (lastActive > 0 && diff < month) activeThisMonth++;
    if (lastActive === 0 || diff > month30) inactiveOver30Days++;
    totalStreak += s.streak;
  }

  return {
    activeThisWeek,
    activeThisMonth,
    inactiveOver30Days,
    avgStreak: students.length > 0 ? Math.round(totalStreak / students.length) : 0,
  };
}
