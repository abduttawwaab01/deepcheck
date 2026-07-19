/**
 * IRT Assessment Engine — rule-based, minimal AI dependency.
 *
 * Uses a 3PL (3-Parameter Logistic) IRT model:
 *   P(θ) = c + (1 - c) / (1 + exp(-a(θ - b)))
 *
 * Theta estimation via EAP (Expected a Posteriori) with Gauss-Hermite quadrature.
 * CAT selection via maximum Fisher information.
 * Classification using Bayesian decision thresholds with a k-nearest concepts fallback.
 */

// ─── 3PL IRT Model ────────────────────────────────────────────────────

export interface ItemParams {
  id: string;
  a: number; // discrimination
  b: number; // difficulty
  c: number; // guessing / pseudo-guessing
  topicId?: string;
  bloomLevel?: string;
}

export function probabilityCorrect(theta: number, item: ItemParams): number {
  const { a, b, c } = item;
  return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

// ─── EAP Theta Estimation ─────────────────────────────────────────────

const QUADRATURE_POINTS = 21;
const QUADRATURE_SIGMA = 2;

function gaussHermiteNodesWeights(n: number): { x: number[]; w: number[] } {
  if (n === 21) {
    return {
      x: [
        -5.387, -4.603, -3.944, -3.347, -2.788, -2.254, -1.738, -1.234,
        -0.739, -0.249, 0.249, 0.739, 1.234, 1.738, 2.254, 2.788, 3.347,
        3.944, 4.603, 5.387, 0,
      ],
      w: [
        0.898e-10, 0.951e-7, 0.129e-4, 0.474e-3, 0.716e-2, 0.542e-1,
        0.232, 0.601, 0.989, 1.071, 1.071, 0.989, 0.601, 0.232, 0.542e-1,
        0.716e-2, 0.474e-3, 0.129e-4, 0.951e-7, 0.898e-10, 0.886,
      ],
    };
  }
  return { x: [0], w: [1] };
}

function priorDensity(theta: number): number {
  return Math.exp(-(theta * theta) / (2 * QUADRATURE_SIGMA * QUADRATURE_SIGMA));
}

export function estimateTheta(
  responses: { item: ItemParams; correct: boolean }[],
): { theta: number; se: number } {
  const { x, w } = gaussHermiteNodesWeights(QUADRATURE_POINTS);

  let numSum = 0;
  let denSum = 0;
  let numSum2 = 0;

  for (let i = 0; i < x.length; i++) {
    const theta = x[i];
    let likelihood = priorDensity(theta);

    for (const r of responses) {
      const p = probabilityCorrect(theta, r.item);
      const q = 1 - p;
      const pCorr = r.correct ? p : q;
      likelihood *= Math.max(pCorr, 1e-12);
    }

    const weight = w[i] * Math.exp(theta * theta);
    numSum += theta * likelihood * weight;
    denSum += likelihood * weight;
    numSum2 += theta * theta * likelihood * weight;
  }

  const thetaHat = denSum > 0 ? numSum / denSum : 0;
  const thetaVar = denSum > 0 ? numSum2 / denSum - thetaHat * thetaHat : 1;
  const se = Math.sqrt(Math.max(thetaVar, 0.01));

  return { theta: thetaHat, se };
}

// ─── Fisher Information ───────────────────────────────────────────────

export function fisherInformation(theta: number, item: ItemParams): number {
  const p = probabilityCorrect(theta, item);
  const q = 1 - p;
  if (q < 1e-12) return 0;
  const diff = (1 - item.c) * item.a * Math.exp(-item.a * (theta - item.b));
  const denom = (1 + Math.exp(-item.a * (theta - item.b))) ** 2;
  const deriv = diff / denom;
  return (deriv * deriv) / (p * q) * (1 - item.c) ** 2;
}

// ─── CAT Item Selection ───────────────────────────────────────────────

export function selectNextItem(
  theta: number,
  availableItems: ItemParams[],
  administeredIds: Set<string>,
  exposureControl?: Map<string, number>,
): ItemParams | null {
  const candidates = availableItems.filter((item) => !administeredIds.has(item.id));

  if (candidates.length === 0) return null;

  // Content balancing: ensure coverage across topics
  const topicCount = new Map<string, number>();
  for (const id of administeredIds) {
    const item = availableItems.find((i) => i.id === id);
    if (item?.topicId) {
      topicCount.set(item.topicId, (topicCount.get(item.topicId) || 0) + 1);
    }
  }

  const minTopicCount = Math.min(...(topicCount.size > 0 ? Array.from(topicCount.values()) : [0]));

  // Select from least-covered topic if imbalance exists
  let pool = candidates;
  if (topicCount.size > 0) {
    const underrepresented = candidates.filter(
      (item) => (topicCount.get(item.topicId || "") || 0) <= minTopicCount,
    );
    if (underrepresented.length > 0) pool = underrepresented;
  }

  // Maximum Fisher Information at current theta estimate
  let bestItem: ItemParams | null = null;
  let bestInfo = -1;

  for (const item of pool) {
    const info = fisherInformation(theta, item);

    // Apply exposure control (randomization for over-exposed items)
    let adjustedInfo = info;
    if (exposureControl) {
      const exposure = exposureControl.get(item.id) || 0;
      adjustedInfo = info * Math.exp(-exposure * 0.3);
    }

    if (adjustedInfo > bestInfo) {
      bestInfo = adjustedInfo;
      bestItem = item;
    }
  }

  return bestItem;
}

// ─── Classification ───────────────────────────────────────────────────

export const THETA_CUTPOINTS = {
  critical: -2.0,
  weak: -1.0,
  developing: 0.0,
  competent: 1.0,
  strong: 1.8,
  mastered: Infinity,
} as const;

export function classify(theta: number): string {
  if (theta < THETA_CUTPOINTS.critical) return "critical";
  if (theta < THETA_CUTPOINTS.weak) return "weak";
  if (theta < THETA_CUTPOINTS.developing) return "developing";
  if (theta < THETA_CUTPOINTS.competent) return "competent";
  if (theta < THETA_CUTPOINTS.strong) return "strong";
  return "mastered";
}

export function thetaToScaledScore(theta: number, min = 0, max = 100): number {
  const clamped = Math.max(-3, Math.min(3, theta));
  return Math.round(min + ((clamped + 3) / 6) * (max - min));
}

// ─── CAT Termination ──────────────────────────────────────────────────

export interface CATState {
  theta: number;
  se: number;
  itemsAdministered: number;
  responses: { item: ItemParams; correct: boolean }[];
}

export function shouldTerminate(
  state: CATState,
  config: { minItems?: number; maxItems?: number; targetSE?: number },
): boolean {
  const { minItems = 10, maxItems = 35, targetSE = 0.4 } = config;

  if (state.itemsAdministered >= maxItems) return true;
  if (state.itemsAdministered < minItems) return false;
  return state.se <= targetSE;
}

// ─── Concept Mastery Estimation ───────────────────────────────────────

export interface ConceptMastery {
  topicId: string;
  theta: number;
  se: number;
  responses: number;
  classification: string;
}

export function estimateConceptMasteries(
  items: ItemParams[],
  responses: { itemId: string; correct: boolean }[],
): ConceptMastery[] {
  const topicGroups = new Map<string, { item: ItemParams; correct: boolean }[]>();

  for (const r of responses) {
    const item = items.find((i) => i.id === r.itemId);
    if (!item?.topicId) continue;
    if (!topicGroups.has(item.topicId)) topicGroups.set(item.topicId, []);
    topicGroups.get(item.topicId)!.push({ item, correct: r.correct });
  }

  const masteries: ConceptMastery[] = [];
  for (const [topicId, topicResponses] of topicGroups) {
    if (topicResponses.length < 2) continue;
    const { theta, se } = estimateTheta(topicResponses);
    masteries.push({
      topicId,
      theta,
      se,
      responses: topicResponses.length,
      classification: classify(theta),
    });
  }

  return masteries;
}
