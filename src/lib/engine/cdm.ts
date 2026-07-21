import {
  estimateTheta,
  classify,
  thetaToScaledScore,
  type ItemParams,
  type ConceptMastery,
} from "./irt";

// ─── Q-Matrix & Cognitive Diagnostic Model Types ───────────────────────

export interface CognitiveAttribute {
  id: string;
  code: string;
  name: string;
  category: string;
  parentAttributeId?: string;
  hierarchyLevel: number;
}

export interface QMatrixEntry {
  questionId: string;
  attributeId: string;
  weight: number;
  isRequired: boolean;
}

export interface DINAParameters {
  slip: number;
  guess: number;
}

export interface StudentAttributeProfile {
  attributeId: string;
  attributeCode: string;
  attributeName: string;
  estimated: number;
  probability: number;
  classification: "mastered" | "not_mastered";
}

export interface CDMDiagnosis {
  overallTheta: number;
  overallScore: number;
  overallCategory: string;
  attributeProfiles: StudentAttributeProfile[];
  latentClass: string;
  itemFitStatistics: ItemFitResult[];
  attributeMasteryMap: Map<string, number>;
  conceptualGapAnalysis: GapAnalysis[];
}

export interface ItemFitResult {
  questionId: string;
  observedAccuracy: number;
  expectedAccuracy: number;
  residual: number;
  outfit: number;
  infit: number;
}

export interface GapAnalysis {
  attributeCode: string;
  attributeName: string;
  mastery: number;
  classification: string;
  dependentAttributes: string[];
  prerequisiteGaps: string[];
  priority: "critical" | "high" | "medium" | "low";
  recommendedActions: string[];
}

// ─── Q-Matrix Builder ─────────────────────────────────────────────────

export function buildQMatrix(
  qMatrixEntries: QMatrixEntry[],
  attributeMap: Map<string, CognitiveAttribute>,
): QMatrixRow[] {
  const questionIds = [...new Set(qMatrixEntries.map((e) => e.questionId))];
  const attributeIds = [...new Set(qMatrixEntries.map((e) => e.attributeId))];

  const matrix: QMatrixRow[] = questionIds.map((questionId) => {
    const row: QMatrixRow = { questionId, attributes: {} };
    for (const attrId of attributeIds) {
      const entry = qMatrixEntries.find(
        (e) => e.questionId === questionId && e.attributeId === attrId,
      );
      row.attributes[attrId] = entry ? entry.weight * (entry.isRequired ? 1 : 0.5) : 0;
    }
    return row;
  });

  return matrix;
}

export interface QMatrixRow {
  questionId: string;
  attributes: Record<string, number>;
}

// ─── DINA Model Estimation ────────────────────────────────────────────

export function estimateDINA(
  itemParams: ItemParams[],
  responses: { itemId: string; correct: boolean }[],
  qMatrix: QMatrixRow[],
  attributes: CognitiveAttribute[],
): CDMDiagnosis {
  const attributeIds = attributes.map((a) => a.id);
  const correctMap = new Map(responses.map((r) => [r.itemId, r.correct]));

  // Step 1: Overall IRT-based theta
  const thetaResult = estimateTheta(
    itemParams.map((item) => {
      const resp = responses.find((r) => r.itemId === item.id);
      return { item, correct: resp?.correct ?? false };
    }),
  );
  const theta = thetaResult.theta;
  const overallScore = thetaToScaledScore(theta);
  const overallCategory = classify(theta);

  // Step 2: Per-attribute mastery estimation using EM-like procedure
  const attributeMasteries = estimateAttributeMastery(
    itemParams,
    qMatrix,
    correctMap,
    attributeIds,
  );

  // Step 3: Compute DINA slip/guess per item
  const dinaParams = computeDINAParameters(
    qMatrix,
    attributeMasteries,
    correctMap,
  );

  // Step 4: Compute item fit statistics
  const itemFit = computeItemFit(itemParams, qMatrix, dinaParams, attributeMasteries, correctMap);

  // Step 5: Build attribute profiles
  const attributeProfiles: StudentAttributeProfile[] = attributes.map((attr) => {
    const mastery = attributeMasteries.get(attr.id) || 0;
    return {
      attributeId: attr.id,
      attributeCode: attr.code,
      attributeName: attr.name,
      estimated: mastery,
      probability: mastery,
      classification: mastery >= 0.7 ? "mastered" : "not_mastered",
    };
  });

  // Step 6: Determine latent class (dominant attribute pattern)
  const latentPattern = attributeMasteries.size > 0
    ? Array.from(attributeMasteries.entries())
        .map(([id, val]) => (val >= 0.7 ? "1" : "0"))
        .join("")
    : "unknown";
  const latentClass = `Pattern: ${latentPattern}`;

  // Step 7: Gap analysis
  const gapAnalysis = computeGapAnalysis(attributeMasteries, attributes);

  return {
    overallTheta: theta,
    overallScore,
    overallCategory,
    attributeProfiles,
    latentClass,
    itemFitStatistics: itemFit,
    attributeMasteryMap: attributeMasteries,
    conceptualGapAnalysis: gapAnalysis,
  };
}

// ─── Attribute Mastery Estimation ─────────────────────────────────────

function estimateAttributeMastery(
  itemParams: ItemParams[],
  qMatrix: QMatrixRow[],
  correctMap: Map<string, boolean>,
  attributeIds: string[],
): Map<string, number> {
  const masteries = new Map<string, number>();

  for (const attrId of attributeIds) {
    const relevantItems = qMatrix.filter(
      (row) => row.attributes[attrId] > 0,
    );
    if (relevantItems.length === 0) {
      masteries.set(attrId, 0.5);
      continue;
    }

    // Weighted accuracy across items requiring this attribute
    let totalWeight = 0;
    let weightedCorrect = 0;
    for (const row of relevantItems) {
      const correct = correctMap.get(row.questionId) ?? false;
      const weight = row.attributes[attrId];
      totalWeight += weight;
      if (correct) weightedCorrect += weight;
    }

    const accuracy = totalWeight > 0 ? weightedCorrect / totalWeight : 0.5;

    // Apply Bayesian shrinkage toward 0.5 based on number of observations
    const shrinkage = Math.max(0.1, 1 - relevantItems.length / (relevantItems.length + 5));
    const estimated = accuracy * (1 - shrinkage) + 0.5 * shrinkage;

    masteries.set(attrId, Math.min(1, Math.max(0, estimated)));
  }

  return masteries;
}

// ─── DINA Slip & Guess Parameters ─────────────────────────────────────

function computeDINAParameters(
  qMatrix: QMatrixRow[],
  attributeMasteries: Map<string, number>,
  correctMap: Map<string, boolean>,
): Map<string, DINAParameters> {
  const params = new Map<string, DINAParameters>();

  for (const row of qMatrix) {
    const attributeIds = Object.keys(row.attributes).filter(
      (id) => row.attributes[id] > 0,
    );

    // Probability of mastering all required attributes (AND gate)
    let eta = 1;
    for (const attrId of attributeIds) {
      const mastery = attributeMasteries.get(attrId) || 0;
      eta *= mastery;
    }
    const observedCorrect = correctMap.get(row.questionId) ?? false;

    // Slip = P(Wrong | all attributes mastered)
    // Guess = P(Correct | missing at least one attribute)
    // We estimate these empirically
    params.set(row.questionId, {
      slip: observedCorrect ? 0 : eta * 0.1,
      guess: observedCorrect ? (1 - eta) * 0.1 : 0,
    });
  }

  return params;
}

// ─── Item Fit Statistics ──────────────────────────────────────────────

function computeItemFit(
  itemParams: ItemParams[],
  qMatrix: QMatrixRow[],
  dinaParams: Map<string, DINAParameters>,
  attributeMasteries: Map<string, number>,
  correctMap: Map<string, boolean>,
): ItemFitResult[] {
  const results: ItemFitResult[] = [];

  for (const item of itemParams) {
    const row = qMatrix.find((r) => r.questionId === item.id);
    const params = dinaParams.get(item.id);

    let expectedAcc = 0.5;
    if (row) {
      const attributeIds = Object.keys(row.attributes).filter(
        (id) => row.attributes[id] > 0,
      );
      let eta = 1;
      for (const attrId of attributeIds) {
        eta *= attributeMasteries.get(attrId) || 0.5;
      }
      const slip = params?.slip || 0.1;
      const guess = params?.guess || 0.1;
      expectedAcc = (1 - slip) * eta + guess * (1 - eta);
    }

    const observedAcc = correctMap.get(item.id) ? 1 : 0;
    const residual = observedAcc - expectedAcc;

    // Simplified outfit/infit (residual-based)
    const outfit = residual * residual;
    const infit = Math.abs(residual);

    results.push({
      questionId: item.id,
      observedAccuracy: observedAcc,
      expectedAccuracy: expectedAcc,
      residual,
      outfit,
      infit,
    });
  }

  return results;
}

// ─── Gap Analysis ─────────────────────────────────────────────────────

function computeGapAnalysis(
  attributeMasteries: Map<string, number>,
  attributes: CognitiveAttribute[],
): GapAnalysis[] {
  const analysis: GapAnalysis[] = [];
  const attributeMap = new Map(attributes.map((a) => [a.id, a]));

  for (const attr of attributes) {
    const mastery = attributeMasteries.get(attr.id) || 0;
    if (mastery >= 0.7) continue;

    // Find dependent attributes (children)
    const dependentAttrs = attributes
      .filter((a) => a.parentAttributeId === attr.id)
      .map((a) => a.code);

    // Find prerequisite gaps
    const prerequisiteGaps: string[] = [];
    if (attr.parentAttributeId) {
      const parentMastery = attributeMasteries.get(attr.parentAttributeId) || 0;
      if (parentMastery < 0.7) {
        const parent = attributeMap.get(attr.parentAttributeId);
        if (parent) prerequisiteGaps.push(parent.code);
      }
    }

    // Priority classification
    let priority: GapAnalysis["priority"] = "low";
    if (mastery < 0.3) priority = "critical";
    else if (mastery < 0.5) priority = "high";
    else if (mastery < 0.7) priority = "medium";

    // Recommended actions
    const recommendedActions: string[] = [];
    if (priority === "critical") {
      recommendedActions.push(`Focus intensive practice on ${attr.name}`);
      recommendedActions.push(`Review foundational concepts before proceeding`);
    } else if (priority === "high") {
      recommendedActions.push(`Complete additional exercises on ${attr.name}`);
      recommendedActions.push(`Seek teacher feedback on weak areas`);
    } else {
      recommendedActions.push(`Practice application-level problems`);
    }

    analysis.push({
      attributeCode: attr.code,
      attributeName: attr.name,
      mastery,
      classification: mastery >= 0.7 ? "mastered" : mastery >= 0.5 ? "developing" : "weak",
      dependentAttributes: dependentAttrs,
      prerequisiteGaps,
      priority,
      recommendedActions,
    });
  }

  return analysis.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });
}

// ─── Batch Diagnostics ───────────────────────────────────────────────

export function batchDiagnose(
  studentResponses: Map<string, { itemId: string; correct: boolean }[]>,
  itemParams: ItemParams[],
  qMatrix: QMatrixRow[],
  attributes: CognitiveAttribute[],
): Map<string, CDMDiagnosis> {
  const diagnoses = new Map<string, CDMDiagnosis>();

  for (const [studentId, responses] of studentResponses) {
    const diagnosis = estimateDINA(itemParams, responses, qMatrix, attributes);
    diagnoses.set(studentId, diagnosis);
  }

  return diagnoses;
}

// ─── Class-Level Attribute Mastery ────────────────────────────────────

export function computeClassAttributeMastery(
  diagnoses: CDMDiagnosis[],
  attributes: CognitiveAttribute[],
): Map<string, { mean: number; std: number; masteryRate: number; histogram: number[] }> {
  const stats = new Map<string, { mean: number; std: number; masteryRate: number; histogram: number[] }>();

  for (const attr of attributes) {
    const values = diagnoses
      .map((d) => d.attributeMasteryMap.get(attr.id) || 0)
      .filter((v) => v > 0);

    if (values.length === 0) {
      stats.set(attr.id, { mean: 0, std: 0, masteryRate: 0, histogram: [] });
      continue;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    const masteryRate = values.filter((v) => v >= 0.7).length / values.length;

    // Histogram: bins of 0.1 width
    const histogram = new Array(10).fill(0);
    for (const v of values) {
      const bin = Math.min(9, Math.floor(v * 10));
      histogram[bin]++;
    }

    stats.set(attr.id, { mean, std, masteryRate, histogram });
  }

  return stats;
}
