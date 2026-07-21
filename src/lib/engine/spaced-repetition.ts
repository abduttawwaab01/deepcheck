export interface ForgettingCurveParams {
  stability: number;
  decayRate: number;
  daysSinceAcquisition: number;
  reviewCount: number;
  easeFactor: number;
}

export interface RetentionEstimate {
  currentRetention: number;
  daysUntilCritical: number;
  optimalReviewDate: Date;
  reviewUrgency: "overdue" | "due_soon" | "on_track" | "fresh";
  stabilityIndex: number;
}

export interface SpacedRepetitionSchedule {
  topicId: string;
  currentInterval: number;
  nextInterval: number;
  nextReviewDate: Date;
  easeFactor: number;
  retentionAtNextReview: number;
  estimatedMasteryChange: number;
}

export interface LearningSessionRecord {
  topicId: string;
  correctCount: number;
  totalCount: number;
  timeSpentSeconds: number;
  difficulty: "easy" | "medium" | "hard";
  timestamp: Date;
}

// ─── Ebbinghaus Forgetting Curve Model ────────────────────────────────

export function computeRetention(
  stability: number,
  daysSinceAcquisition: number,
  decayRate: number = 0.5,
): number {
  // R = e^(-t/S) where t = time, S = stability
  const retention = Math.exp(-decayRate * daysSinceAcquisition / Math.max(stability, 0.1));
  return Math.max(0, Math.min(1, retention));
}

export function computeDaysUntilCritical(
  stability: number,
  decayRate: number = 0.5,
  criticalThreshold: number = 0.5,
): number {
  // t = -S * ln(R) / decayRate
  const days = (-stability * Math.log(criticalThreshold)) / decayRate;
  return Math.max(0, days);
}

export function estimateStability(
  previousStability: number,
  performance: "easy" | "medium" | "hard",
  reviewCount: number,
  easeFactor: number,
): number {
  // Stability increase depends on performance and review history
  const multiplier =
    performance === "easy" ? 1.5 :
    performance === "medium" ? 1.2 :
    0.8;

  // Stability grows logarithmically with review count
  const reviewBonus = Math.log2(reviewCount + 1) * 0.3;

  const newStability = previousStability * multiplier * (1 + reviewBonus * easeFactor / 2.5);
  return Math.max(0.5, Math.min(365, newStability));
}

// ─── SM-2 Algorithm (SuperMemo) ──────────────────────────────────────

export function sm2Algorithm(
  currentEaseFactor: number,
  currentInterval: number,
  quality: number, // 0-5: 0=complete blackout, 5=perfect
): { easeFactor: number; interval: number } {
  // Update ease factor
  let newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  // Update interval
  let newInterval: number;
  if (quality < 3) {
    // Failed: reset to 1 day
    newInterval = 1;
  } else {
    if (currentInterval < 1) {
      newInterval = 1;
    } else if (currentInterval < 6) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
  }

  return { easeFactor: newEaseFactor, interval: newInterval };
}

// ─── Adaptive Forgetting Curve ────────────────────────────────────────

export function computeAdaptiveRetention(
  params: ForgettingCurveParams,
  sessionHistory: LearningSessionRecord[],
): RetentionEstimate {
  const now = new Date();
  const daysSinceAcquisition = params.daysSinceAcquisition;

  // Base retention from Ebbinghaus curve
  const baseRetention = computeRetention(
    params.stability,
    daysSinceAcquisition,
    params.decayRate,
  );

  // Adjust for recent session performance
  let recentPerformanceBoost = 0;
  const recentSessions = sessionHistory.slice(-5); // Last 5 sessions
  for (const session of recentSessions) {
    const sessionAge = (now.getTime() - session.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const recencyWeight = Math.exp(-sessionAge / 7); // Decay over 7 days
    const accuracy = session.totalCount > 0 ? session.correctCount / session.totalCount : 0.5;
    recentPerformanceBoost += accuracy * recencyWeight * 0.1;
  }

  const adjustedRetention = Math.min(1, baseRetention + recentPerformanceBoost);

  // Days until retention drops to critical threshold (50%)
  const daysUntilCritical = computeDaysUntilCritical(
    params.stability,
    params.decayRate,
    0.5,
  );

  // Optimal review date: when retention drops to 70%
  const optimalReviewDays = computeDaysUntilCritical(
    params.stability,
    params.decayRate,
    0.7,
  );
  const optimalReviewDate = new Date(now.getTime() + optimalReviewDays * 24 * 60 * 60 * 1000);

  // Review urgency
  let reviewUrgency: RetentionEstimate["reviewUrgency"];
  if (adjustedRetention < 0.5) {
    reviewUrgency = "overdue";
  } else if (adjustedRetention < 0.7) {
    reviewUrgency = "due_soon";
  } else if (adjustedRetention < 0.85) {
    reviewUrgency = "on_track";
  } else {
    reviewUrgency = "fresh";
  }

  // Stability index (0-100)
  const stabilityIndex = Math.min(100, (params.stability / 30) * 100);

  return {
    currentRetention: adjustedRetention,
    daysUntilCritical,
    optimalReviewDate,
    reviewUrgency,
    stabilityIndex,
  };
}

// ─── Spaced Repetition Schedule Generator ─────────────────────────────

export function generateSpacedRepetitionSchedule(
  topicId: string,
  currentEaseFactor: number,
  currentInterval: number,
  lastSession: LearningSessionRecord | null,
): SpacedRepetitionSchedule {
  const now = new Date();

  // Convert session performance to SM-2 quality (0-5)
  let quality = 3; // default: "medium"
  if (lastSession) {
    const accuracy = lastSession.totalCount > 0 ? lastSession.correctCount / lastSession.totalCount : 0;
    if (accuracy >= 0.9) quality = 5;
    else if (accuracy >= 0.8) quality = 4;
    else if (accuracy >= 0.6) quality = 3;
    else if (accuracy >= 0.4) quality = 2;
    else if (accuracy >= 0.2) quality = 1;
    else quality = 0;
  }

  // Apply SM-2
  const { easeFactor, interval } = sm2Algorithm(currentEaseFactor, currentInterval, quality);

  // Calculate retention at next review
  const nextReviewDays = interval;
  const retentionAtNextReview = computeRetention(10, nextReviewDays, 0.5);

  // Estimate mastery change
  const accuracy = lastSession
    ? (lastSession.totalCount > 0 ? lastSession.correctCount / lastSession.totalCount : 0.5)
    : 0.5;
  const masteryChange = (accuracy - 0.5) * 0.1;

  return {
    topicId,
    currentInterval,
    nextInterval: interval,
    nextReviewDate: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
    easeFactor,
    retentionAtNextReview,
    estimatedMasteryChange: masteryChange,
  };
}

// ─── Batch Schedule Generation ────────────────────────────────────────

export function generateBatchSchedule(
  topicMasteryData: Array<{
    topicId: string;
    currentMastery: number;
    stability: number;
    reviewCount: number;
    easeFactor: number;
    currentInterval: number;
    lastSession: LearningSessionRecord | null;
  }>,
): SpacedRepetitionSchedule[] {
  const schedules: SpacedRepetitionSchedule[] = [];

  for (const data of topicMasteryData) {
    const schedule = generateSpacedRepetitionSchedule(
      data.topicId,
      data.easeFactor,
      data.currentInterval,
      data.lastSession,
    );
    schedules.push(schedule);
  }

  // Sort by urgency: topics with lowest next retention first
  schedules.sort((a, b) => a.retentionAtNextReview - b.retentionAtNextReview);

  return schedules;
}

// ─── Learning Analytics ───────────────────────────────────────────────

export interface LearningAnalytics {
  totalStudyTime: number;
  averageSessionLength: number;
  sessionCount: number;
  averageAccuracy: number;
  improvementRate: number;
  studyConsistency: number; // 0-1
  topicsAtRisk: string[];
  recommendedFocusTopics: string[];
  learningMomentum: "accelerating" | "steady" | "decelerating" | "stagnant";
}

export function computeLearningAnalytics(
  sessions: LearningSessionRecord[],
  topicMastery: Map<string, number>,
): LearningAnalytics {
  if (sessions.length === 0) {
    return {
      totalStudyTime: 0,
      averageSessionLength: 0,
      sessionCount: 0,
      averageAccuracy: 0,
      improvementRate: 0,
      studyConsistency: 0,
      topicsAtRisk: [],
      recommendedFocusTopics: [],
      learningMomentum: "stagnant",
    };
  }

  // Basic stats
  const totalStudyTime = sessions.reduce((a, s) => a + s.timeSpentSeconds, 0);
  const averageSessionLength = totalStudyTime / sessions.length;
  const sessionCount = sessions.length;

  // Accuracy
  const totalCorrect = sessions.reduce((a, s) => a + s.correctCount, 0);
  const totalQuestions = sessions.reduce((a, s) => a + s.totalCount, 0);
  const averageAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

  // Improvement rate: compare first half to second half
  const mid = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, mid);
  const secondHalf = sessions.slice(mid);
  const firstHalfAcc =
    firstHalf.length > 0
      ? firstHalf.reduce((a, s) => a + s.correctCount, 0) /
        firstHalf.reduce((a, s) => a + s.totalCount, 0)
      : 0;
  const secondHalfAcc =
    secondHalf.length > 0
      ? secondHalf.reduce((a, s) => a + s.correctCount, 0) /
        secondHalf.reduce((a, s) => a + s.totalCount, 0)
      : 0;
  const improvementRate = secondHalfAcc - firstHalfAcc;

  // Study consistency: coefficient of variation of session intervals
  const sortedSessions = [...sessions].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
  const intervals: number[] = [];
  for (let i = 1; i < sortedSessions.length; i++) {
    const diff =
      (sortedSessions[i].timestamp.getTime() - sortedSessions[i - 1].timestamp.getTime()) /
      (1000 * 60 * 60 * 24);
    intervals.push(diff);
  }
  let studyConsistency = 0;
  if (intervals.length > 1) {
    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const stdInterval = Math.sqrt(
      intervals.reduce((a, i) => a + Math.pow(i - meanInterval, 2), 0) / intervals.length,
    );
    studyConsistency = meanInterval > 0 ? Math.min(1, 1 - stdInterval / meanInterval) : 0;
  }

  // Topics at risk: mastery < 0.5
  const topicsAtRisk: string[] = [];
  for (const [topicId, mastery] of topicMastery) {
    if (mastery < 0.5) topicsAtRisk.push(topicId);
  }

  // Recommended focus topics: lowest mastery
  const recommendedFocusTopics = [...topicMastery.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5)
    .map(([topicId]) => topicId);

  // Learning momentum
  let learningMomentum: LearningAnalytics["learningMomentum"];
  if (improvementRate > 0.1) learningMomentum = "accelerating";
  else if (improvementRate > 0) learningMomentum = "steady";
  else if (improvementRate > -0.1) learningMomentum = "decelerating";
  else learningMomentum = "stagnant";

  return {
    totalStudyTime,
    averageSessionLength,
    sessionCount,
    averageAccuracy,
    improvementRate,
    studyConsistency,
    topicsAtRisk,
    recommendedFocusTopics,
    learningMomentum,
  };
}
