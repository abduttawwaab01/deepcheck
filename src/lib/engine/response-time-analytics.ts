// ─── Types ─────────────────────────────────────────────────────────────

export interface ResponseTimeRecord {
  questionId: string;
  timeSpentSeconds: number;
  isCorrect: boolean;
  questionOrder: number;
  expectedTimeSecs?: number;
  difficultyLevel?: string;
  bloomLevel?: string;
}

export interface TimeDistribution {
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  coefficientOfVariation: number;
  outlierLowerBound: number;
  outlierUpperBound: number;
  outliers: string[];
  min: number;
  max: number;
  range: number;
  totalQuestions: number;
  totalTimeSeconds: number;
}

export interface RushingResult {
  percentageBelowThreshold: number;
  sequentialFastRuns: SequentialFastRun[];
  rushingScore: number;
  isRushing: boolean;
  fastAnswerIndices: number[];
}

export interface SequentialFastRun {
  startIndex: number;
  endIndex: number;
  length: number;
  averageTimeSeconds: number;
}

export interface EngagementPattern {
  fatigue: FatigueResult;
  boredom: BoredomResult;
  anxiety: AnxietyResult;
  peakPerformanceWindow: PeakPerformanceWindow | null;
}

export interface FatigueResult {
  detected: boolean;
  firstThirdAccuracy: number;
  lastThirdAccuracy: number;
  accuracyDrop: number;
}

export interface BoredomResult {
  detected: boolean;
  fastLowAccuracyCount: number;
  fastLowAccuracyRate: number;
}

export interface AnxietyResult {
  detected: boolean;
  slowDecliningCount: number;
  slowDecliningRate: number;
}

export interface PeakPerformanceWindow {
  startQuestionOrder: number;
  endQuestionOrder: number;
  accuracy: number;
  averageTimeSeconds: number;
}

export interface ItemTimeQuality {
  questionId: string;
  questionOrder: number;
  timeSpentSeconds: number;
  expectedTimeSecs?: number;
  difficultyLevel?: string;
  isCorrect: boolean;
  appropriatenessScore: number;
  difficultyTimeAlignment: number;
  efficiencyScore: number;
}

export interface ResponseTimeAnalysis {
  distribution: TimeDistribution;
  rushingDetection: RushingResult;
  engagementPattern: EngagementPattern;
  itemTimeQuality: ItemTimeQuality[];
  overallTimeEfficiency: number;
  recommendations: string[];
}

// ─── Constants ─────────────────────────────────────────────────────────

const RUSHING_TIME_RATIO = 0.25;
const RUSHING_SEQUENTIAL_MIN = 3;
const RUSHING_THRESHOLD_SCORE = 0.5;
const FAST_LOW_ACCURACY_TIME_RATIO = 0.25;
const FAST_LOW_ACCURACY_MAX = 0.3;
const SLOW_DECLINING_TIME_RATIO = 2.5;
const SLOW_DECLINING_WINDOW = 3;
const IQR_MULTIPLIER = 1.5;
const EXPECTED_TIME_TOLERANCE = 0.5;

// ─── Main Entry Point ──────────────────────────────────────────────────

export function analyzeResponseTimes(records: ResponseTimeRecord[]): ResponseTimeAnalysis {
  if (records.length === 0) {
    return emptyAnalysis();
  }

  const sorted = [...records].sort((a, b) => a.questionOrder - b.questionOrder);
  const times = sorted.map((r) => r.timeSpentSeconds);
  const distribution = computeDistribution(times, sorted);
  const rushingDetection = detectRushing(sorted, distribution.mean);
  const engagementPattern = analyzeEngagement(sorted);
  const itemTimeQuality = analyzeItemTimeQuality(sorted);
  const overallTimeEfficiency = computeOverallTimeEfficiency(sorted);
  const recommendations = generateRecommendations(distribution, rushingDetection, engagementPattern, itemTimeQuality);

  return {
    distribution,
    rushingDetection,
    engagementPattern,
    itemTimeQuality,
    overallTimeEfficiency,
    recommendations,
  };
}

// ─── Distribution Analysis ─────────────────────────────────────────────

function computeDistribution(times: number[], records: ResponseTimeRecord[]): TimeDistribution {
  const sorted = [...times].sort((a, b) => a - b);
  const n = sorted.length;

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = computeMedian(sorted);
  const mode = computeMode(sorted);
  const standardDeviation = computeStdDev(sorted, mean);
  const skewness = computeSkewness(sorted, mean, standardDeviation);
  const kurtosis = computeKurtosis(sorted, mean, standardDeviation);
  const percentiles = computePercentiles(sorted);
  const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0;

  const { lower: outlierLowerBound, upper: outlierUpperBound } = computeIQRBounds(sorted);
  const outliers = records
    .filter((r) => r.timeSpentSeconds < outlierLowerBound || r.timeSpentSeconds > outlierUpperBound)
    .map((r) => r.questionId);

  return {
    mean,
    median,
    mode,
    standardDeviation,
    skewness,
    kurtosis,
    percentiles,
    coefficientOfVariation,
    outlierLowerBound,
    outlierUpperBound,
    outliers,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    totalQuestions: n,
    totalTimeSeconds: sum,
  };
}

function computeMedian(sorted: number[]): number {
  const n = sorted.length;
  if (n % 2 === 1) return sorted[Math.floor(n / 2)];
  return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
}

function computeMode(sorted: number[]): number {
  const freq = new Map<number, number>();
  for (const v of sorted) {
    freq.set(v, (freq.get(v) || 0) + 1);
  }
  let maxFreq = 0;
  let mode = sorted[0];
  Array.from(freq.entries()).forEach(([value, count]) => {
    if (count > maxFreq) {
      maxFreq = count;
      mode = value;
    }
  });
  return mode;
}

function computeStdDev(sorted: number[], mean: number): number {
  const n = sorted.length;
  const variance = sorted.reduce((a, t) => a + Math.pow(t - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

function computeSkewness(sorted: number[], mean: number, sd: number): number {
  if (sd === 0) return 0;
  const n = sorted.length;
  const m3 = sorted.reduce((a, t) => a + Math.pow(t - mean, 3), 0) / n;
  return m3 / Math.pow(sd, 3);
}

function computeKurtosis(sorted: number[], mean: number, sd: number): number {
  if (sd === 0) return 0;
  const n = sorted.length;
  const m4 = sorted.reduce((a, t) => a + Math.pow(t - mean, 4), 0) / n;
  return m4 / Math.pow(sd, 4) - 3;
}

function computePercentiles(sorted: number[]): { p10: number; p25: number; p50: number; p75: number; p90: number } {
  return {
    p10: percentile(sorted, 10),
    p25: percentile(sorted, 25),
    p50: percentile(sorted, 50),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
  };
}

function percentile(sorted: number[], p: number): number {
  const n = sorted.length;
  if (n === 0) return 0;
  const index = (p / 100) * (n - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function computeIQRBounds(sorted: number[]): { lower: number; upper: number } {
  const q1 = percentile(sorted, 25);
  const q3 = percentile(sorted, 75);
  const iqr = q3 - q1;
  return {
    lower: q1 - IQR_MULTIPLIER * iqr,
    upper: q3 + IQR_MULTIPLIER * iqr,
  };
}

// ─── Rushing Detection ─────────────────────────────────────────────────

function detectRushing(
  records: ResponseTimeRecord[],
  meanTime: number,
): RushingResult {
  const n = records.length;
  if (n === 0) {
    return {
      percentageBelowThreshold: 0,
      sequentialFastRuns: [],
      rushingScore: 0,
      isRushing: false,
      fastAnswerIndices: [],
    };
  }

  const threshold = meanTime * RUSHING_TIME_RATIO;

  const fastAnswerIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (records[i].timeSpentSeconds < threshold) {
      fastAnswerIndices.push(i);
    }
  }

  const percentageBelowThreshold = fastAnswerIndices.length / n;
  const sequentialFastRuns = findSequentialFastRuns(records, threshold);
  const rushingScore = computeRushingScore(percentageBelowThreshold, sequentialFastRuns, n);

  return {
    percentageBelowThreshold,
    sequentialFastRuns,
    rushingScore,
    isRushing: rushingScore >= RUSHING_THRESHOLD_SCORE,
    fastAnswerIndices,
  };
}

function findSequentialFastRuns(
  records: ResponseTimeRecord[],
  threshold: number,
): SequentialFastRun[] {
  const runs: SequentialFastRun[] = [];
  let start = -1;

  for (let i = 0; i < records.length; i++) {
    if (records[i].timeSpentSeconds < threshold) {
      if (start === -1) start = i;
    } else {
      if (start !== -1 && i - start >= RUSHING_SEQUENTIAL_MIN) {
        const segment = records.slice(start, i);
        runs.push({
          startIndex: start,
          endIndex: i - 1,
          length: i - start,
          averageTimeSeconds:
            segment.reduce((a, r) => a + r.timeSpentSeconds, 0) / segment.length,
        });
      }
      start = -1;
    }
  }

  if (start !== -1 && records.length - start >= RUSHING_SEQUENTIAL_MIN) {
    const segment = records.slice(start);
    runs.push({
      startIndex: start,
      endIndex: records.length - 1,
      length: records.length - start,
      averageTimeSeconds:
        segment.reduce((a, r) => a + r.timeSpentSeconds, 0) / segment.length,
    });
  }

  return runs;
}

function computeRushingScore(
  fastRate: number,
  sequentialRuns: SequentialFastRun[],
  totalQuestions: number,
): number {
  let score = 0;

  // Weight fast-rate contribution
  score += fastRate * 0.5;

  // Weight sequential rushing contribution
  const sequentialRushedCount = sequentialRuns.reduce((a, r) => a + r.length, 0);
  const sequentialRate = totalQuestions > 0 ? sequentialRushedCount / totalQuestions : 0;
  score += sequentialRate * 0.5;

  return Math.min(1, Math.max(0, score));
}

// ─── Engagement Pattern Analysis ───────────────────────────────────────

function analyzeEngagement(records: ResponseTimeRecord[]): EngagementPattern {
  return {
    fatigue: detectFatigue(records),
    boredom: detectBoredom(records),
    anxiety: detectAnxiety(records),
    peakPerformanceWindow: findPeakPerformanceWindow(records),
  };
}

function detectFatigue(records: ResponseTimeRecord[]): FatigueResult {
  const n = records.length;
  const thirdSize = Math.max(1, Math.floor(n / 3));

  const firstThird = records.slice(0, thirdSize);
  const lastThird = records.slice(n - thirdSize);

  const firstCorrect = firstThird.filter((r) => r.isCorrect).length;
  const lastCorrect = lastThird.filter((r) => r.isCorrect).length;

  const firstThirdAccuracy = firstThird.length > 0 ? firstCorrect / firstThird.length : 0;
  const lastThirdAccuracy = lastThird.length > 0 ? lastCorrect / lastThird.length : 0;
  const accuracyDrop = firstThirdAccuracy - lastThirdAccuracy;

  return {
    detected: accuracyDrop > 0.15,
    firstThirdAccuracy,
    lastThirdAccuracy,
    accuracyDrop,
  };
}

function detectBoredom(records: ResponseTimeRecord[]): BoredomResult {
  const n = records.length;
  if (n === 0) {
    return { detected: false, fastLowAccuracyCount: 0, fastLowAccuracyRate: 0 };
  }

  const meanTime = records.reduce((a, r) => a + r.timeSpentSeconds, 0) / n;
  const threshold = meanTime * FAST_LOW_ACCURACY_TIME_RATIO;

  let count = 0;
  for (const r of records) {
    if (r.timeSpentSeconds < threshold && !r.isCorrect) {
      count++;
    }
  }

  const rate = count / n;
  return {
    detected: rate > FAST_LOW_ACCURACY_MAX,
    fastLowAccuracyCount: count,
    fastLowAccuracyRate: rate,
  };
}

function detectAnxiety(records: ResponseTimeRecord[]): AnxietyResult {
  const n = records.length;
  if (n < SLOW_DECLINING_WINDOW) {
    return { detected: false, slowDecliningCount: 0, slowDecliningRate: 0 };
  }

  const meanTime = records.reduce((a, r) => a + r.timeSpentSeconds, 0) / n;
  const slowThreshold = meanTime * SLOW_DECLINING_TIME_RATIO;

  let count = 0;
  for (let i = 0; i <= n - SLOW_DECLINING_WINDOW; i++) {
    const window = records.slice(i, i + SLOW_DECLINING_WINDOW);
    const allSlow = window.every((r) => r.timeSpentSeconds > slowThreshold);
    const decliningAccuracy = window.every(
      (r, idx) => idx === 0 || !r.isCorrect,
    );
    if (allSlow && decliningAccuracy) {
      count++;
    }
  }

  const maxPossible = n - SLOW_DECLINING_WINDOW + 1;
  const rate = maxPossible > 0 ? count / maxPossible : 0;

  return {
    detected: rate > 0.3,
    slowDecliningCount: count,
    slowDecliningRate: rate,
  };
}

function findPeakPerformanceWindow(records: ResponseTimeRecord[]): PeakPerformanceWindow | null {
  const n = records.length;
  if (n < 3) return null;

  let bestAccuracy = -1;
  let bestStart = 0;
  let bestEnd = 0;
  const windowSize = Math.max(2, Math.floor(n / 3));

  for (let i = 0; i <= n - windowSize; i++) {
    const window = records.slice(i, i + windowSize);
    const accuracy = window.filter((r) => r.isCorrect).length / window.length;

    if (accuracy > bestAccuracy) {
      bestAccuracy = accuracy;
      bestStart = window[0].questionOrder;
      bestEnd = window[window.length - 1].questionOrder;
    }
  }

  if (bestAccuracy < 0.5) return null;

  const windowRecords = records.filter(
    (r) => r.questionOrder >= bestStart && r.questionOrder <= bestEnd,
  );
  const avgTime =
    windowRecords.reduce((a, r) => a + r.timeSpentSeconds, 0) / windowRecords.length;

  return {
    startQuestionOrder: bestStart,
    endQuestionOrder: bestEnd,
    accuracy: bestAccuracy,
    averageTimeSeconds: avgTime,
  };
}

// ─── Per-Item Time Quality ─────────────────────────────────────────────

function analyzeItemTimeQuality(records: ResponseTimeRecord[]): ItemTimeQuality[] {
  const n = records.length;
  if (n === 0) return [];

  const meanTime = records.reduce((a, r) => a + r.timeSpentSeconds, 0) / n;
  const sd = computeStdDev(records.map((r) => r.timeSpentSeconds), meanTime);

  // Compute difficulty-to-time mapping
  const difficultyTimeMap = computeDifficultyTimeMap(records);

  return records.map((r) => {
    const appropriatenessScore = computeAppropriatenessScore(r, meanTime, sd);
    const difficultyTimeAlignment = computeDifficultyTimeAlignment(r, difficultyTimeMap);
    const efficiencyScore = computeItemEfficiencyScore(r);

    return {
      questionId: r.questionId,
      questionOrder: r.questionOrder,
      timeSpentSeconds: r.timeSpentSeconds,
      expectedTimeSecs: r.expectedTimeSecs,
      difficultyLevel: r.difficultyLevel,
      isCorrect: r.isCorrect,
      appropriatenessScore,
      difficultyTimeAlignment,
      efficiencyScore,
    };
  });
}

function computeDifficultyTimeMap(records: ResponseTimeRecord[]): Map<string, number> {
  const map = new Map<string, { total: number; count: number }>();

  for (const r of records) {
    if (!r.difficultyLevel) continue;
    const entry = map.get(r.difficultyLevel) || { total: 0, count: 0 };
    entry.total += r.timeSpentSeconds;
    entry.count += 1;
    map.set(r.difficultyLevel, entry);
  }

  const avgMap = new Map<string, number>();
  Array.from(map.entries()).forEach(([key, val]) => {
    avgMap.set(key, val.count > 0 ? val.total / val.count : 0);
  });
  return avgMap;
}

function computeAppropriatenessScore(
  record: ResponseTimeRecord,
  meanTime: number,
  sd: number,
): number {
  if (record.expectedTimeSecs && record.expectedTimeSecs > 0) {
    const ratio = record.timeSpentSeconds / record.expectedTimeSecs;
    if (ratio >= 0.5 && ratio <= 2.0) return 1;
    if (ratio < 0.5) return Math.max(0, 1 - (0.5 - ratio) * 2);
    return Math.max(0, 1 - (ratio - 2.0) * 0.5);
  }

  if (sd === 0) return 1;
  const zScore = (record.timeSpentSeconds - meanTime) / sd;
  if (Math.abs(zScore) <= 1.5) return 1;
  if (Math.abs(zScore) <= 3) return Math.max(0, 1 - (Math.abs(zScore) - 1.5) / 3);
  return 0;
}

function computeDifficultyTimeAlignment(
  record: ResponseTimeRecord,
  difficultyTimeMap: Map<string, number>,
): number {
  if (!record.difficultyLevel || !difficultyTimeMap.has(record.difficultyLevel)) return 0.5;

  // Sort difficulties from easy to hard and assign expected relative times
  const difficultyOrder: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    "very hard": 4,
    "very_easy": 1,
    "very_hard": 4,
  };

  const currentDifficultyRank = difficultyOrder[record.difficultyLevel] || 2;
  const totalTime = Array.from(difficultyTimeMap.values()).reduce((a, b) => a + b, 0);
  const avgTimePerDifficulty = totalTime / difficultyTimeMap.size;

  if (avgTimePerDifficulty === 0) return 0.5;

  const expectedRelativeTime = currentDifficultyRank / 2.5;
  const actualRelativeTime = record.timeSpentSeconds / avgTimePerDifficulty;
  const deviation = Math.abs(actualRelativeTime - expectedRelativeTime);

  return Math.max(0, 1 - deviation * 0.3);
}

function computeItemEfficiencyScore(record: ResponseTimeRecord): number {
  if (!record.expectedTimeSecs || record.expectedTimeSecs <= 0) return 0.5;

  const ratio = record.timeSpentSeconds / record.expectedTimeSecs;

  if (record.isCorrect) {
    if (ratio <= 1.0) return Math.min(1.0, 0.8 + (1.0 - ratio) * 0.2);
    return Math.max(0, 1.0 - (ratio - 1.0) * 0.3);
  }

  if (ratio <= 0.5) return Math.max(0, 0.2 - ratio * 0.4);
  if (ratio <= 1.5) return 0.3;
  return Math.min(0.6, 0.3 + (ratio - 1.5) * 0.2);
}

// ─── Overall Time Efficiency ───────────────────────────────────────────

function computeOverallTimeEfficiency(records: ResponseTimeRecord[]): number {
  if (records.length === 0) return 0;

  let totalEfficiency = 0;
  let count = 0;

  for (const r of records) {
    totalEfficiency += computeItemEfficiencyScore(r);
    count++;
  }

  return count > 0 ? totalEfficiency / count : 0;
}

// ─── Recommendations ───────────────────────────────────────────────────

function generateRecommendations(
  distribution: TimeDistribution,
  rushing: RushingResult,
  engagement: EngagementPattern,
  itemQuality: ItemTimeQuality[],
): string[] {
  const recs: string[] = [];

  if (rushing.isRushing) {
    recs.push(
      `Rushing detected (score: ${rushing.rushingScore.toFixed(2)}). ${(rushing.percentageBelowThreshold * 100).toFixed(0)}% of answers were given in less than 25% of expected time.`,
    );
  }

  if (rushing.sequentialFastRuns.length > 0) {
    const totalRushed = rushing.sequentialFastRuns.reduce((a, r) => a + r.length, 0);
    recs.push(
      `${rushing.sequentialFastRuns.length} sequential fast-answer run(s) detected covering ${totalRushed} question(s). Results may not reflect true understanding.`,
    );
  }

  if (engagement.fatigue.detected) {
    const drop = (engagement.fatigue.accuracyDrop * 100).toFixed(1);
    recs.push(
      `Fatigue detected: accuracy dropped ${drop}% from first to last third of assessment. Consider shorter assessment sessions.`,
    );
  }

  if (engagement.boredom.detected) {
    recs.push(
      `Boredom indicators found: ${engagement.boredom.fastLowAccuracyCount} fast-and-wrong answers (${(engagement.boredom.fastLowAccuracyRate * 100).toFixed(0)}% of total). Content may be too easy or not engaging.`,
    );
  }

  if (engagement.anxiety.detected) {
    recs.push(
      `Anxiety patterns detected: ${engagement.anxiety.slowDecliningCount} slow-declining sequences. Student may benefit from anxiety support or extended time.`,
    );
  }

  if (engagement.peakPerformanceWindow) {
    const wp = engagement.peakPerformanceWindow;
    recs.push(
      `Peak performance window: questions ${wp.startQuestionOrder}-${wp.endQuestionOrder} with ${(wp.accuracy * 100).toFixed(0)}% accuracy.`,
    );
  }

  if (distribution.coefficientOfVariation > 0.5) {
    recs.push(
      `High time variance (CV: ${distribution.coefficientOfVariation.toFixed(2)}). Some questions may have unclear instructions or uneven difficulty.`,
    );
  }

  if (distribution.outliers.length > 0) {
    recs.push(
      `${distribution.outliers.length} time outlier(s) detected. Review questions: ${distribution.outliers.slice(0, 5).join(", ")}${distribution.outliers.length > 5 ? "..." : ""}.`,
    );
  }

  const lowEfficiencyItems = itemQuality.filter((i) => i.efficiencyScore < 0.3);
  if (lowEfficiencyItems.length > 0) {
    recs.push(
      `${lowEfficiencyItems.length} question(s) had low time efficiency. Consider reviewing expected time estimates or question clarity.`,
    );
  }

  if (distribution.skewness > 2) {
    recs.push(
      "Heavily right-skewed time distribution: most students answered quickly but a few took much longer. Check for accessibility issues.",
    );
  }

  return recs;
}

// ─── Empty State ───────────────────────────────────────────────────────

function emptyAnalysis(): ResponseTimeAnalysis {
  return {
    distribution: {
      mean: 0,
      median: 0,
      mode: 0,
      standardDeviation: 0,
      skewness: 0,
      kurtosis: 0,
      percentiles: { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 },
      coefficientOfVariation: 0,
      outlierLowerBound: 0,
      outlierUpperBound: 0,
      outliers: [],
      min: 0,
      max: 0,
      range: 0,
      totalQuestions: 0,
      totalTimeSeconds: 0,
    },
    rushingDetection: {
      percentageBelowThreshold: 0,
      sequentialFastRuns: [],
      rushingScore: 0,
      isRushing: false,
      fastAnswerIndices: [],
    },
    engagementPattern: {
      fatigue: { detected: false, firstThirdAccuracy: 0, lastThirdAccuracy: 0, accuracyDrop: 0 },
      boredom: { detected: false, fastLowAccuracyCount: 0, fastLowAccuracyRate: 0 },
      anxiety: { detected: false, slowDecliningCount: 0, slowDecliningRate: 0 },
      peakPerformanceWindow: null,
    },
    itemTimeQuality: [],
    overallTimeEfficiency: 0,
    recommendations: [],
  };
}
