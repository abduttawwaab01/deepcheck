export interface ItemAnalysisResult {
  questionId: string;
  questionText?: string;
  discriminationIndex: number;
  pointBiserial: number;
  upperGroupAccuracy: number;
  lowerGroupAccuracy: number;
  distractorAnalysis: DistractorAnalysis[];
  difficultyIndex: number;
  responseTimeStats: ResponseTimeStats;
  qualityRating: ItemQualityRating;
}

export interface DistractorAnalysis {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
  selectedByUpper: number;
  selectedByLower: number;
  selectedByTotal: number;
  upperGroupPct: number;
  lowerGroupPct: number;
  totalPct: number;
  discrimination: number;
  isEffective: boolean;
}

export interface ResponseTimeStats {
  median: number;
  mean: number;
  std: number;
  fastest10pct: number;
  slowest10pct: number;
  pValue: number;
  timeDiscrimination: number;
}

export type ItemQualityRating =
  | "excellent"
  | "good"
  | "acceptable"
  | "marginal"
  | "poor"
  | "reject";

export interface ItemAnalysisReport {
  items: ItemAnalysisResult[];
  summary: {
    totalItems: number;
    meanDiscrimination: number;
    meanDifficulty: number;
    meanPointBiserial: number;
    itemsByQuality: Record<ItemQualityRating, number>;
    problemItems: string[];
    suggestedRevisions: string[];
  };
  responseTimeAnalysis: {
    overallMedianTime: number;
    timeOutliers: string[];
    fastGuessers: string[];
  };
}

interface ResponseRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

// ─── Item Analysis Engine ─────────────────────────────────────────────

export function analyzeItems(
  responses: ResponseRecord[],
  totalRespondents: number,
): ItemAnalysisReport {
  const questionIds = [...new Set(responses.map((r) => r.questionId))];
  const items: ItemAnalysisResult[] = [];

  // Sort respondents by total score to identify upper/lower groups
  const respondentScores = new Map<string, number>();
  for (const r of responses) {
    respondentScores.set(
      r.questionId,
      (respondentScores.get(r.questionId) || 0) + (r.isCorrect ? 1 : 0),
    );
  }

  // Group responses by question
  const questionResponses = new Map<string, ResponseRecord[]>();
  for (const r of responses) {
    if (!questionResponses.has(r.questionId)) questionResponses.set(r.questionId, []);
    questionResponses.get(r.questionId)!.push(r);
  }

  // Compute per-respondent total scores
  const respondentTotalScores = new Map<string, number>();
  for (const r of responses) {
    respondentTotalScores.set(
      r.questionId,
      (respondentTotalScores.get(r.questionId) || 0) + (r.isCorrect ? 1 : 0),
    );
  }

  // Upper 27% and lower 27% cutoffs
  const allScores = Array.from(respondentTotalScores.values()).sort((a, b) => b - a);
  const upperCutoff = Math.ceil(allScores.length * 0.27);
  const lowerCutoff = Math.floor(allScores.length * 0.27);

  for (const qId of questionIds) {
    const qResps = questionResponses.get(qId) || [];
    const totalN = qResps.length;
    if (totalN < 5) continue;

    // Sort respondents by total score
    const sortedByScore = [...qResps].sort(
      (a, b) => (respondentTotalScores.get(a.questionId) || 0) - (respondentTotalScores.get(b.questionId) || 0),
    );

    const upperGroup = sortedByScore.slice(0, upperCutoff);
    const lowerGroup = sortedByScore.slice(-lowerCutoff);

    // Correct/incorrect counts
    const upperCorrect = upperGroup.filter((r) => r.isCorrect).length;
    const lowerCorrect = lowerGroup.filter((r) => r.isCorrect).length;
    const totalCorrect = qResps.filter((r) => r.isCorrect).length;

    const upperAccuracy = upperGroup.length > 0 ? upperCorrect / upperGroup.length : 0;
    const lowerAccuracy = lowerGroup.length > 0 ? lowerCorrect / lowerGroup.length : 0;
    const totalAccuracy = totalN > 0 ? totalCorrect / totalN : 0;

    // Discrimination Index: D = (upperAccuracy - lowerAccuracy)
    const discriminationIndex = upperAccuracy - lowerAccuracy;

    // Point-biserial correlation (simplified)
    const pointBiserial = computePointBiserial(qResps);

    // Difficulty index = proportion correct (p-value)
    const difficultyIndex = totalAccuracy;

    // Distractor analysis
    const distractorAnalysis = analyzeDistractors(
      qResps,
      upperGroup,
      lowerGroup,
    );

    // Response time stats
    const responseTimeStats = computeResponseTimeStats(qResps);

    // Quality rating
    const qualityRating = rateItemQuality(discriminationIndex, pointBiserial, difficultyIndex);

    items.push({
      questionId: qId,
      discriminationIndex,
      pointBiserial,
      upperGroupAccuracy: upperAccuracy,
      lowerGroupAccuracy: lowerAccuracy,
      distractorAnalysis,
      difficultyIndex,
      responseTimeStats,
      qualityRating,
    });
  }

  // Compute summary statistics
  const meanDiscrimination =
    items.length > 0 ? items.reduce((a, b) => a + b.discriminationIndex, 0) / items.length : 0;
  const meanDifficulty =
    items.length > 0 ? items.reduce((a, b) => a + b.difficultyIndex, 0) / items.length : 0;
  const meanPointBiserial =
    items.length > 0 ? items.reduce((a, b) => a + b.pointBiserial, 0) / items.length : 0;

  const itemsByQuality: Record<ItemQualityRating, number> = {
    excellent: 0,
    good: 0,
    acceptable: 0,
    marginal: 0,
    poor: 0,
    reject: 0,
  };
  for (const item of items) itemsByQuality[item.qualityRating]++;

  const problemItems = items
    .filter((i) => i.qualityRating === "poor" || i.qualityRating === "reject")
    .map((i) => i.questionId);

  const suggestedRevisions: string[] = [];
  for (const item of items) {
    if (item.discriminationIndex < 0.2) {
      suggestedRevisions.push(
        `${item.questionId}: Low discrimination (${item.discriminationIndex.toFixed(2)}). Consider revising the item stem or distractors.`,
      );
    }
    if (item.difficultyIndex > 0.9 || item.difficultyIndex < 0.1) {
      suggestedRevisions.push(
        `${item.questionId}: Extreme difficulty (${item.difficultyIndex.toFixed(2)}). May be too easy or too hard.`,
      );
    }
    const badDistractors = item.distractorAnalysis.filter((d) => !d.isEffective && !d.isCorrect);
    if (badDistractors.length > 0) {
      suggestedRevisions.push(
        `${item.questionId}: ${badDistractors.length} ineffective distractor(s). Replace or revise.`,
      );
    }
  }

  // Response time analysis
  const allTimes = items.map((i) => i.responseTimeStats.median).sort((a, b) => a - b);
  const overallMedianTime = allTimes.length > 0 ? allTimes[Math.floor(allTimes.length / 2)] : 0;

  const timeOutliers = items
    .filter((i) => i.responseTimeStats.median > overallMedianTime * 3)
    .map((i) => i.questionId);

  const fastGuessers = items
    .filter(
      (i) =>
        i.responseTimeStats.median < overallMedianTime * 0.15 &&
        i.difficultyIndex < 0.3,
    )
    .map((i) => i.questionId);

  return {
    items,
    summary: {
      totalItems: items.length,
      meanDiscrimination,
      meanDifficulty,
      meanPointBiserial,
      itemsByQuality,
      problemItems,
      suggestedRevisions,
    },
    responseTimeAnalysis: {
      overallMedianTime,
      timeOutliers,
      fastGuessers,
    },
  };
}

// ─── Point-Biserial Correlation ───────────────────────────────────────

function computePointBiserial(responses: ResponseRecord[]): number {
  const n = responses.length;
  if (n < 2) return 0;

  const correctScores = responses.filter((r) => r.isCorrect).map((r) => r.timeSpentSeconds);
  const incorrectScores = responses.filter((r) => !r.isCorrect).map((r) => r.timeSpentSeconds);

  if (correctScores.length === 0 || incorrectScores.length === 0) return 0;

  const meanCorrect = correctScores.reduce((a, b) => a + b, 0) / correctScores.length;
  const meanIncorrect = incorrectScores.reduce((a, b) => a + b, 0) / incorrectScores.length;

  const p = correctScores.length / n;
  const q = 1 - p;

  // Standard deviation of time spent
  const allTimes = responses.map((r) => r.timeSpentSeconds);
  const meanAll = allTimes.reduce((a, b) => a + b, 0) / n;
  const variance =
    allTimes.reduce((a, t) => a + Math.pow(t - meanAll, 2), 0) / n;
  const sd = Math.sqrt(variance);

  if (sd === 0) return 0;

  // Point-biserial = (M1 - M0) / SD * sqrt(p * q)
  const rpbi = ((meanCorrect - meanIncorrect) / sd) * Math.sqrt(p * q);
  return Math.min(1, Math.max(-1, rpbi));
}

// ─── Distractor Analysis ──────────────────────────────────────────────

function analyzeDistractors(
  allResponses: ResponseRecord[],
  upperGroup: ResponseRecord[],
  lowerGroup: ResponseRecord[],
): DistractorAnalysis[] {
  const optionIds = [...new Set(allResponses.map((r) => r.selectedOptionId))];
  const analysis: DistractorAnalysis[] = [];

  const totalN = allResponses.length;
  const upperN = upperGroup.length;
  const lowerN = lowerGroup.length;

  for (const optId of optionIds) {
    const selectedByAll = allResponses.filter((r) => r.selectedOptionId === optId).length;
    const selectedByUpper = upperGroup.filter((r) => r.selectedOptionId === optId).length;
    const selectedByLower = lowerGroup.filter((r) => r.selectedOptionId === optId).length;

    // Check if this is the correct option
    const isCorrect = allResponses.some(
      (r) => r.selectedOptionId === optId && r.isCorrect,
    );

    const upperPct = upperN > 0 ? selectedByUpper / upperN : 0;
    const lowerPct = lowerN > 0 ? selectedByLower / lowerN : 0;
    const totalPct = totalN > 0 ? selectedByAll / totalN : 0;

    // Effective distractor: more lower group selected it than upper group (for wrong options)
    const discrimination = isCorrect ? upperPct - lowerPct : lowerPct - upperPct;
    const isEffective = isCorrect ? discrimination > 0.05 : discrimination > 0.05;

    analysis.push({
      optionId: optId,
      optionText: "",
      isCorrect,
      selectedByUpper,
      selectedByLower,
      selectedByTotal: selectedByAll,
      upperGroupPct: upperPct,
      lowerGroupPct: lowerPct,
      totalPct,
      discrimination,
      isEffective,
    });
  }

  return analysis;
}

// ─── Response Time Stats ──────────────────────────────────────────────

function computeResponseTimeStats(responses: ResponseRecord[]): ResponseTimeStats {
  const times = responses.map((r) => r.timeSpentSeconds).sort((a, b) => a - b);
  const n = times.length;
  if (n === 0) {
    return { median: 0, mean: 0, std: 0, fastest10pct: 0, slowest10pct: 0, pValue: 0, timeDiscrimination: 0 };
  }

  const median = times[Math.floor(n / 2)];
  const mean = times.reduce((a, b) => a + b, 0) / n;
  const variance = times.reduce((a, t) => a + Math.pow(t - mean, 2), 0) / n;
  const std = Math.sqrt(variance);
  const fastest10pct = times[Math.floor(n * 0.1)];
  const slowest10pct = times[Math.floor(n * 0.9)];

  const pValue = responses.filter((r) => r.isCorrect).length / n;

  // Time discrimination: correlation between time and correctness
  const correctTimes = responses.filter((r) => r.isCorrect).map((r) => r.timeSpentSeconds);
  const incorrectTimes = responses.filter((r) => !r.isCorrect).map((r) => r.timeSpentSeconds);

  let timeDiscrimination = 0;
  if (correctTimes.length > 0 && incorrectTimes.length > 0) {
    const meanCorrect = correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length;
    const meanIncorrect = incorrectTimes.reduce((a, b) => a + b, 0) / incorrectTimes.length;
    timeDiscrimination = meanCorrect > meanIncorrect ? 1 : meanCorrect < meanIncorrect ? -1 : 0;
  }

  return { median, mean, std, fastest10pct, slowest10pct, pValue, timeDiscrimination };
}

// ─── Item Quality Rating ──────────────────────────────────────────────

function rateItemQuality(
  discriminationIndex: number,
  pointBiserial: number,
  difficultyIndex: number,
): ItemQualityRating {
  // Excellent: high discrimination, moderate difficulty
  if (discriminationIndex >= 0.4 && difficultyIndex >= 0.3 && difficultyIndex <= 0.7) {
    return "excellent";
  }
  // Good: moderate discrimination
  if (discriminationIndex >= 0.3 && difficultyIndex >= 0.2 && difficultyIndex <= 0.8) {
    return "good";
  }
  // Acceptable: decent discrimination
  if (discriminationIndex >= 0.2 && pointBiserial >= 0.1) {
    return "acceptable";
  }
  // Marginal: low discrimination or extreme difficulty
  if (discriminationIndex >= 0.15 || difficultyIndex > 0.85 || difficultyIndex < 0.15) {
    return "marginal";
  }
  // Poor: very low discrimination
  if (discriminationIndex < 0.15 && pointBiserial < 0.1) {
    return "poor";
  }
  // Reject: negative discrimination
  return "reject";
}

// ─── Item Analysis Report Generator ───────────────────────────────────

export function generateItemAnalysisReport(
  responses: ResponseRecord[],
  totalRespondents: number,
): ItemAnalysisReport {
  return analyzeItems(responses, totalRespondents);
}
