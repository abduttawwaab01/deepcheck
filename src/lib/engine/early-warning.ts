/**
 * Early Warning System Engine
 *
 * Multi-signal risk scoring for students using:
 * - IRT theta trajectory (declining ability)
 * - Forgetting curve retention estimates
 * - Assessment category distribution
 * - Engagement patterns (time, consistency)
 * - Gamification signals (streak, activity)
 * - Concept mastery gaps
 *
 * Produces a composite risk score with per-signal breakdown and actionable recommendations.
 */

export type RiskLevel = "critical" | "high" | "moderate" | "low" | "none";

export interface SignalResult {
  signal: string;
  label: string;
  score: number; // 0-100, higher = worse
  weight: number;
  weightedScore: number;
  detail: string;
  data?: Record<string, unknown>;
}

export interface EarlyWarningResult {
  overallRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  signals: SignalResult[];
  topConcerns: string[];
  recommendations: string[];
  studentId: string;
  studentName: string;
  assessedAt: string;
}

export interface StudentInput {
  studentId: string;
  studentName: string;
  // Theta trajectory: list of theta values over time (newest last)
  thetaTrajectory: number[];
  // Forgetting curves: retention estimates per topic
  retentionEstimates: number[]; // 0-1 per topic
  // Assessment scores (most recent first)
  assessmentScores: number[]; // 0-1 scaled scores
  // Assessment categories
  categories: string[]; // critical, weak, developing, competent, strong, mastered
  // Engagement
  totalAssessments: number;
  daysSinceLastAssessment: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  lastActivityDate: string | null;
  // Time patterns
  averageTimePerQuestion: number; // seconds
  // Concept mastery
  weakTopics: number; // count of topics below 40%
  totalTopics: number;
}

const SIGNAL_WEIGHTS: Record<string, number> = {
  thetaDecline: 0.25,
  lowRetention: 0.18,
  poorPerformance: 0.20,
  categoryWarning: 0.15,
  inactivity: 0.12,
  weakConcepts: 0.10,
};

/**
 * Compute early warning for a single student.
 */
export function computeEarlyWarning(input: StudentInput): EarlyWarningResult {
  const signals: SignalResult[] = [];

  // 1. Theta Decline Signal
  signals.push(scoreThetaDecline(input.thetaTrajectory));

  // 2. Low Retention Signal
  signals.push(scoreLowRetention(input.retentionEstimates));

  // 3. Poor Performance Signal
  signals.push(scorePoorPerformance(input.assessmentScores));

  // 4. Category Warning Signal
  signals.push(scoreCategoryWarning(input.categories));

  // 5. Inactivity Signal
  signals.push(scoreInactivity(
    input.daysSinceLastAssessment,
    input.currentStreak,
    input.longestStreak,
    input.lastActivityDate,
  ));

  // 6. Weak Concepts Signal
  signals.push(scoreWeakConcepts(input.weakTopics, input.totalTopics));

  const overallScore = signals.reduce((sum, s) => sum + s.weightedScore, 0);
  const riskLevel = scoreToLevel(overallScore);
  const topConcerns = signals
    .filter((s) => s.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => `${s.label}: ${s.detail}`);
  const recommendations = generateRecommendations(signals, input);

  return {
    overallRiskScore: Math.round(overallScore),
    riskLevel,
    signals,
    topConcerns,
    recommendations,
    studentId: input.studentId,
    studentName: input.studentName,
    assessedAt: new Date().toISOString(),
  };
}

/**
 * Compute early warnings for a batch of students and sort by risk (highest first).
 */
export function computeBatchWarnings(inputs: StudentInput[]): EarlyWarningResult[] {
  return inputs
    .map(computeEarlyWarning)
    .sort((a, b) => b.overallRiskScore - a.overallRiskScore);
}

/**
 * Compute class-level risk summary from batch results.
 */
export function computeClassRiskSummary(warnings: EarlyWarningResult[]): {
  totalStudents: number;
  distribution: Record<RiskLevel, number>;
  avgRiskScore: number;
  atRiskCount: number; // critical + high
  trendDirection: "improving" | "stable" | "declining";
  commonConcerns: { label: string; count: number }[];
  classAverageScore: number;
} {
  const distribution: Record<RiskLevel, number> = {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    none: 0,
  };

  let totalScore = 0;
  const concernCounts: Record<string, number> = {};

  for (const w of warnings) {
    distribution[w.riskLevel]++;
    totalScore += w.overallRiskScore;
    for (const signal of w.signals) {
      if (signal.score >= 50) {
        concernCounts[signal.label] = (concernCounts[signal.label] || 0) + 1;
      }
    }
  }

  const commonConcerns = Object.entries(concernCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalStudents: warnings.length,
    distribution,
    avgRiskScore: warnings.length > 0 ? Math.round(totalScore / warnings.length) : 0,
    atRiskCount: distribution.critical + distribution.high,
    trendDirection: "stable", // Would need historical data to compute
    commonConcerns,
    classAverageScore: 0,
  };
}

// ─── Individual Signal Scorers ──────────────────────────────────────────

function scoreThetaDecline(trajectory: number[]): SignalResult {
  const weight = SIGNAL_WEIGHTS.thetaDecline;
  let score = 0;
  let detail = "No assessment data available";

  if (trajectory.length >= 2) {
    const recent = trajectory.slice(-5);
    const older = trajectory.slice(0, Math.max(1, trajectory.length - 5));

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    const decline = olderAvg - recentAvg;

    if (decline > 0.8) {
      score = 90;
      detail = `Severe decline: θ dropped by ${decline.toFixed(2)} (from ${olderAvg.toFixed(2)} to ${recentAvg.toFixed(2)})`;
    } else if (decline > 0.4) {
      score = 65;
      detail = `Moderate decline: θ dropped by ${decline.toFixed(2)}`;
    } else if (decline > 0.1) {
      score = 35;
      detail = `Slight decline: θ dropped by ${decline.toFixed(2)}`;
    } else if (decline < -0.3) {
      score = 0;
      detail = `Improving: θ increased by ${Math.abs(decline).toFixed(2)}`;
    } else {
      score = 10;
      detail = `Stable performance (θ ≈ ${recentAvg.toFixed(2)})`;
    }
  } else if (trajectory.length === 1) {
    score = trajectory[0] < -1.0 ? 70 : trajectory[0] < 0 ? 40 : 10;
    detail = `Single assessment: θ = ${trajectory[0].toFixed(2)}`;
  }

  return {
    signal: "thetaDecline",
    label: "Performance Trajectory",
    score,
    weight,
    weightedScore: score * weight,
    detail,
    data: { trajectory, trajectoryLength: trajectory.length },
  };
}

function scoreLowRetention(retentionEstimates: number[]): SignalResult {
  const weight = SIGNAL_WEIGHTS.lowRetention;
  let score = 0;
  let detail = "No retention data available";

  if (retentionEstimates.length > 0) {
    const avgRetention = retentionEstimates.reduce((a, b) => a + b, 0) / retentionEstimates.length;
    const criticallyLow = retentionEstimates.filter((r) => r < 0.3).length;
    const lowCount = retentionEstimates.filter((r) => r < 0.5).length;

    if (criticallyLow > 0) {
      score = Math.min(95, 60 + criticallyLow * 10);
      detail = `${criticallyLow} topic(s) critically low retention (<30%), avg: ${Math.round(avgRetention * 100)}%`;
    } else if (avgRetention < 0.5) {
      score = 70;
      detail = `Low average retention: ${Math.round(avgRetention * 100)}% across ${retentionEstimates.length} topics`;
    } else if (avgRetention < 0.7) {
      score = 40;
      detail = `Below-target retention: ${Math.round(avgRetention * 100)}% average`;
    } else {
      score = 10;
      detail = `Good retention: ${Math.round(avgRetention * 100)}% average across ${retentionEstimates.length} topics`;
    }
  }

  return {
    signal: "lowRetention",
    label: "Knowledge Retention",
    score,
    weight,
    weightedScore: score * weight,
    detail,
    data: { retentionEstimates, count: retentionEstimates.length },
  };
}

function scorePoorPerformance(scores: number[]): SignalResult {
  const weight = SIGNAL_WEIGHTS.poorPerformance;
  let score = 0;
  let detail = "No assessment scores available";

  if (scores.length > 0) {
    const recent = scores.slice(0, 3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const latest = scores[0];

    if (latest < 0.3) {
      score = 90;
      detail = `Critical: latest score ${Math.round(latest * 100)}%`;
    } else if (avg < 0.4) {
      score = 75;
      detail = `Poor recent average: ${Math.round(avg * 100)}% (last ${recent.length} assessments)`;
    } else if (avg < 0.6) {
      score = 45;
      detail = `Below average: ${Math.round(avg * 100)}% recent average`;
    } else if (avg < 0.8) {
      score = 20;
      detail = `Competent: ${Math.round(avg * 100)}% recent average`;
    } else {
      score = 0;
      detail = `Strong performance: ${Math.round(avg * 100)}% recent average`;
    }
  }

  return {
    signal: "poorPerformance",
    label: "Assessment Performance",
    score,
    weight,
    weightedScore: score * weight,
    detail,
    data: { scores, recentAvg: scores.length > 0 ? scores.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, scores.length) : null },
  };
}

function scoreCategoryWarning(categories: string[]): SignalResult {
  const weight = SIGNAL_WEIGHTS.categoryWarning;
  let score = 0;
  let detail = "No category data available";

  if (categories.length > 0) {
    const critical = categories.filter((c) => c === "critical").length;
    const weak = categories.filter((c) => c === "weak").length;
    const developing = categories.filter((c) => c === "developing").length;
    const positive = categories.filter((c) => ["competent", "strong", "mastered"].includes(c)).length;

    const negativeRatio = (critical + weak) / categories.length;

    if (critical > 0) {
      score = Math.min(95, 50 + critical * 15);
      detail = `${critical} critical assessment(s), ${weak} weak — ${Math.round(negativeRatio * 100)}% below developing`;
    } else if (weak > 1) {
      score = 60;
      detail = `${weak} weak assessments — needs targeted support`;
    } else if (developing > positive) {
      score = 40;
      detail = `${developing} developing vs ${positive} competent+ — more developing than proficient`;
    } else {
      score = 10;
      detail = `${positive}/${categories.length} assessments competent or above`;
    }
  }

  return {
    signal: "categoryWarning",
    label: "Performance Category",
    score,
    weight,
    weightedScore: score * weight,
    detail,
    data: { categories, distribution: getCategoryDistribution(categories) },
  };
}

function scoreInactivity(
  daysSinceLast: number,
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: string | null,
): SignalResult {
  const weight = SIGNAL_WEIGHTS.inactivity;
  let score = 0;
  let detail = "No activity data available";

  if (lastActivityDate) {
    if (daysSinceLast > 30) {
      score = 90;
      detail = `Inactive for ${daysSinceLast} days — urgent re-engagement needed`;
    } else if (daysSinceLast > 14) {
      score = 70;
      detail = `No activity for ${daysSinceLast} days`;
    } else if (daysSinceLast > 7) {
      score = 45;
      detail = `${daysSinceLast} days since last activity`;
    } else if (currentStreak === 0 && longestStreak > 3) {
      score = 35;
      detail = `Streak broken (was ${longestStreak} days)`;
    } else if (currentStreak >= 3) {
      score = 5;
      detail = `Active: ${currentStreak}-day streak`;
    } else {
      score = 20;
      detail = `Active within ${daysSinceLast} day(s)`;
    }
  }

  return {
    signal: "inactivity",
    label: "Learning Activity",
    score,
    weight,
    weightedScore: score * weight,
    detail,
    data: { daysSinceLast, currentStreak, longestStreak, lastActivityDate },
  };
}

function scoreWeakConcepts(weakTopics: number, totalTopics: number): SignalResult {
  const weight = SIGNAL_WEIGHTS.weakConcepts;
  let score = 0;
  let detail = "No concept data available";

  if (totalTopics > 0) {
    const weakRatio = weakTopics / totalTopics;

    if (weakRatio > 0.7) {
      score = 90;
      detail = `${weakTopics}/${totalTopics} topics below 40% — widespread gaps`;
    } else if (weakRatio > 0.5) {
      score = 70;
      detail = `${weakTopics}/${totalTopics} topics weak — majority struggling`;
    } else if (weakRatio > 0.3) {
      score = 45;
      detail = `${weakTopics}/${totalTopics} topics need attention`;
    } else if (weakTopics > 0) {
      score = 20;
      detail = `${weakTopics}/${totalTopics} topics slightly weak`;
    } else {
      score = 0;
      detail = `All ${totalTopics} topics at or above target`;
    }
  }

  return {
    signal: "weakConcepts",
    label: "Concept Mastery",
    score,
    weight,
    weightedScore: score * weight,
    detail,
    data: { weakTopics, totalTopics },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────

function scoreToLevel(score: number): RiskLevel {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "moderate";
  if (score >= 10) return "low";
  return "none";
}

function getCategoryDistribution(categories: string[]): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const c of categories) {
    dist[c] = (dist[c] || 0) + 1;
  }
  return dist;
}

function generateRecommendations(signals: SignalResult[], input: StudentInput): string[] {
  const recs: string[] = [];
  const sorted = [...signals].sort((a, b) => b.score - a.score);

  for (const signal of sorted) {
    if (signal.score < 40) continue;

    switch (signal.signal) {
      case "thetaDecline":
        recs.push("Schedule a one-on-one diagnostic session to identify root causes of declining performance");
        if (input.thetaTrajectory.length >= 3) {
          const recentTheta = input.thetaTrajectory.slice(-1)[0];
          if (recentTheta < -1) {
            recs.push("Consider reviewing foundational concepts — student may have gaps in prerequisite knowledge");
          }
        }
        break;
      case "lowRetention":
        recs.push("Implement spaced repetition reviews for topics with low retention (<50%)");
        recs.push("Schedule brief daily review sessions on recently learned material");
        break;
      case "poorPerformance":
        recs.push("Assign targeted practice exercises on weak topics identified in recent assessments");
        recs.push("Consider peer tutoring or group study sessions");
        break;
      case "categoryWarning":
        recs.push("Prioritize intervention for critical-level assessments — these indicate fundamental gaps");
        recs.push("Create a structured remediation plan with weekly check-ins");
        break;
      case "inactivity":
        recs.push("Reach out to the student to understand barriers to engagement");
        recs.push("Set up automated reminders for daily practice goals");
        if (input.daysSinceLastAssessment > 14) {
          recs.push("Consider parent/guardian involvement for re-engagement");
        }
        break;
      case "weakConcepts":
        recs.push("Focus on building foundational concept mastery before advancing to complex topics");
        recs.push("Use diagnostic questioning to identify specific misconceptions");
        break;
    }
  }

  // Always add a positive recommendation
  if (signals.some((s) => s.score < 30)) {
    recs.push("Continue encouraging areas of strength while addressing gaps");
  }

  return recs.slice(0, 6);
}

/**
 * Extract risk signals from raw DB data for use in tRPC endpoints.
 */
export function extractStudentInput(params: {
  studentId: string;
  studentName: string;
  reports: { overallScore: string | number | null; category: string | null; createdAt: Date | null }[];
  instances: { thetaEstimate: string | number | null; startedAt: Date | null }[];
  forgettingCurves: { currentRetention: string | number | null; topicId: string }[];
  streak: { currentStreak: number; longestStreak: number; lastActivityDate: string | null; totalXp: number } | null;
  masteryScores: { abilityEstimate: string | number | null; topicId: string }[];
}): StudentInput {
  const thetaTrajectory = params.instances
    .filter((i) => i.thetaEstimate != null)
    .sort((a, b) => (a.startedAt?.getTime() || 0) - (b.startedAt?.getTime() || 0))
    .map((i) => Number(i.thetaEstimate));

  const assessmentScores = params.reports
    .filter((r) => r.overallScore != null)
    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
    .map((r) => Number(r.overallScore));

  const categories = params.reports.map((r) => r.category || "unknown");
  const retentionEstimates = params.forgettingCurves.map((f) => Number(f.currentRetention || 0));
  const weakTopics = params.masteryScores.filter((m) => Number(m.abilityEstimate || 0) < -0.5).length;
  const totalTopics = params.masteryScores.length || 1;

  const lastReport = params.reports.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];
  const daysSinceLastAssessment = lastReport?.createdAt
    ? Math.floor((Date.now() - lastReport.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  return {
    studentId: params.studentId,
    studentName: params.studentName,
    thetaTrajectory,
    retentionEstimates,
    assessmentScores,
    categories,
    totalAssessments: params.reports.length,
    daysSinceLastAssessment,
    currentStreak: params.streak?.currentStreak || 0,
    longestStreak: params.streak?.longestStreak || 0,
    totalXp: params.streak?.totalXp || 0,
    lastActivityDate: params.streak?.lastActivityDate || null,
    averageTimePerQuestion: 0,
    weakTopics,
    totalTopics,
  };
}
