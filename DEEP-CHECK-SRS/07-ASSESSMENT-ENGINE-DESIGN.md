# DEEP CHECK — Software Requirements Specification

## Phase 7: Assessment Engine Design

---

## 1. ASSESSMENT ENGINE PHILOSOPHY

| Principle | Rationale |
|-----------|-----------|
| **Psychometric Validity** | Every score is grounded in Item Response Theory, not classical test theory |
| **Maximum Information per Item** | Each question is selected to extract the most diagnostic value |
| **Fair to All Ability Levels** | Adaptive algorithm ensures no floor/ceiling effects |
| **Misconception-Centric** | Wrong answers are more informative than right answers |
| **Real-Time Adaptation** | Theta estimate updates after every response |
| **Explainable Scores** | Every output includes confidence intervals and evidence |

---

## 2. ITEM RESPONSE THEORY (IRT) MODEL

### 2.1 Three-Parameter Logistic (3PL) Model

The probability that a student with ability θ answers item i correctly:

**P(Xᵢ = 1 | θ) = cᵢ + (1 - cᵢ) × 1 / (1 + e^(-aᵢ(θ - bᵢ)))**

Where:

| Parameter | Symbol | Range | Description |
|-----------|--------|-------|-------------|
| Ability | θ | -∞ to +∞ (typically -3 to +3) | Latent trait estimate |
| Discrimination | aᵢ | 0 to 3 (typically 0.5-2.5) | How well item differentiates ability levels |
| Difficulty | bᵢ | -3 to +3 | Ability level where P(correct) = (1+cᵢ)/2 |
| Guessing | cᵢ | 0 to 0.5 | Lower asymptote — probability low-ability student answers correctly |

### 2.2 Item Characteristic Curve (ICC)

```
P(correct)
   1.0 ┤          ┌─────────────── a=2.0, b=0.0, c=0.25
       │         ╱
       │        ╱
   0.5 ┤      ╱        ← b parameter (inflection point)
       │    ╱
   0.25 ┤──╱                          ← c parameter (guessing)
       │  ╱
   0.0 ┤─┴──────┼──────┼──────┼──────┼──→ θ
       -3.0    -1.0    0.0    1.0    3.0
```

### 2.3 Item Information Function

The Fisher Information that item i provides at ability θ:

**Iᵢ(θ) = [aᵢ² × (1 - cᵢ)²] / [e^(aᵢ(θ - bᵢ)) × (1 + e^(-aᵢ(θ - bᵢ)))²] × [Pᵢ(θ) - cᵢ]² / [Pᵢ(θ) × (1 - Pᵢ(θ))] × [1 - cᵢ]²**

Simplified for computation:

**Iᵢ(θ) = aᵢ² × (1 - cᵢ) / (e^(aᵢ(θ - bᵢ)) × (1 + e^(-aᵢ(θ - bᵢ)))²)**

Information is maximized when θ ≈ bᵢ (item difficulty matches student ability).

### 2.4 Standard Error of Measurement

**SE(θ̂) = 1 / √(Σᵢ Iᵢ(θ̂))**

The standard error decreases as more items are administered and as items provide more information at the current theta estimate.

---

## 3. COMPUTERIZED ADAPTIVE TESTING (CAT) ALGORITHM

### 3.1 Algorithm Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAT ALGORITHM FLOW                           │
│                                                                      │
│  START                                                                   │
│    │                                                                     │
│    ├─→ Initialize: θ₀ = 0, SE₀ = large                                  │
│    │                                                                     │
│    ├─→ Check item pool → filter by constraints                           │
│    │                                                                     │
│    ├─→ Select first item (medium difficulty, high discrimination)        │
│    │    │                                                                │
│    │    ▼                                                                │
│    └─→ FOR each item:                                                    │
│         │                                                               │
│         ├─→ Deliver item → record response                               │
│         │                                                               │
│         ├─→ Update θ using EAP estimator                                 │
│         │                                                               │
│         ├─→ Update misconception probability vector                      │
│         │                                                               │
│         ├─→ Check termination criteria:                                  │
│         │    ├─ SE(θ) < 0.30? → EXIT (high confidence)                  │
│         │    ├─ Items ≥ MIN_ITEMS (30) AND SE < 0.35? → EXIT            │
│         │    ├─ Items ≥ MAX_ITEMS (50)? → EXIT                          │
│         │    ├─ Time ≥ 45 minutes? → EXIT                              │
│         │    └─ Content coverage met? → EXIT                            │
│         │                                                               │
│         └─→ Select next item: maximize Iᵢ(θ̂) at current θ               │
│              │                                                          │
│              └─→ Apply constraints:                                     │
│                   ├─ Content balancing (subject/topic coverage)        │
│                   ├─ Exposure control (no item >80% exposure)          │
│                   ├─ Item not yet administered to this student          │
│                   └─ Avoid recently seen items                          │
│                                                                         │
│  EXIT → Save θ̂, SE, misconception probabilities                        │
│       → Generate readiness scores                                       │
│       → Generate report                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Starting Ability (θ₀)

| Starting Location | Strategy |
|-------------------|----------|
| θ₀ = 0 | Default — assumes average ability |
| θ₀ from prior assessment | Use last known theta if < 90 days old |
| θ₀ = -1.0 | For primary-level assessments (lower starting point) |
| θ₀ = +0.5 | For SS3-level assessments (higher starting point) |
| θ₀ from item | First item is a "routing" item at θ = 0 |

### 3.3 First Item Selection

Select from items where:
- `bᵢ` is closest to θ₀ (or θ₀ ± 0.5 for exploration)
- `aᵢ` ≥ 1.0 (good discrimination)
- Item is calibrated (calibration sample ≥ 100)
- Covers an early-concept topic

### 3.4 Theta Estimation (Expected a Posteriori — EAP)

EAP uses Bayesian updating with a standard normal prior (θ ∼ N(0, 1)):

**θ̂ₙ = ∫ θ × L(u|θ) × φ(θ) dθ / ∫ L(u|θ) × φ(θ) dθ**

Where:
- L(u|θ) = likelihood of response vector u given ability θ
- φ(θ) = standard normal prior density
- u = response vector (1 = correct, 0 = incorrect)

**Computational implementation (quadrature):**

The integral is approximated using adaptive quadrature with 41 points from -4 to +4.

```typescript
function estimateThetaEAP(
  responses: { item: ItemParams; correct: boolean }[],
  prior: { mean: number; sd: number } = { mean: 0, sd: 1 }
): { theta: number; se: number } {
  const QUAD_POINTS = 41;
  const quadPoints = linspace(-4, 4, QUAD_POINTS);
  const h = 8 / (QUAD_POINTS - 1); // step size
  const priorSD = prior.sd;
  const priorMean = prior.mean;

  // Compute posterior density at each quadrature point
  const likelihoods = quadPoints.map(theta => {
    // Prior density
    const priorDensity = normalPDF(theta, priorMean, priorSD);

    // Likelihood of response vector
    let logLikelihood = 0;
    for (const r of responses) {
      const p = threePL(r.item.a, r.item.b, r.item.c, theta);
      if (r.correct) {
        logLikelihood += Math.log(p);
      } else {
        logLikelihood += Math.log(1 - p);
      }
    }

    return { theta, density: priorDensity * Math.exp(logLikelihood) };
  });

  // Normalize to get posterior
  const totalDensity = likelihoods.reduce((sum, l) => sum + l.density, 0);
  const normalized = likelihoods.map(l => ({
    ...l,
    density: l.density / totalDensity
  }));

  // EAP estimate
  const thetaEAP = normalized.reduce((sum, l) => sum + l.theta * l.density, 0);

  // Posterior variance
  const variance = normalized.reduce(
    (sum, l) => sum + Math.pow(l.theta - thetaEAP, 2) * l.density,
    0
  );

  return {
    theta: thetaEAP,
    se: Math.sqrt(variance)
  };
}
```

### 3.5 Maximum Likelihood Estimation (MLE) — Alternative

Used when theta is in a stable range and EAP prior influence should be minimal:

**θ̂ = argmax_θ [ Σᵢ uᵢ × log(Pᵢ(θ)) + (1 - uᵢ) × log(1 - Pᵢ(θ)) ]**

Solved via Newton-Raphson iteration:
1. Start with current theta estimate
2. Compute first derivative (score function): S(θ) = Σᵢ aᵢ × (uᵢ - Pᵢ(θ)) × (Pᵢ(θ) - cᵢ) / [Pᵢ(θ) × (1 - Pᵢ(θ)) × (1 - cᵢ)]
3. Compute second derivative (information): I(θ) = -∂S/∂θ = Σᵢ Iᵢ(θ)
4. Update: θₜ₊₁ = θₜ + S(θₜ) / I(θₜ)
5. Repeat until |θₜ₊₁ - θₜ| < 0.001

**Limitations:** MLE cannot be computed with all-correct or all-incorrect response patterns (θ → ±∞). EAP is the default; MLE is fallback for intermediate patterns.

### 3.6 Next Item Selection

Select item i that maximizes Fisher Information at current theta estimate, subject to constraints:

```typescript
function selectNextItem(
  currentTheta: number,
  availableItems: ItemParams[],
  administeredItems: Set<string>,
  constraints: ContentConstraints,
  exposureCounts: Map<string, number>,
  totalAssessments: number
): ItemParams | null {
  // Filter out already administered items
  let candidates = availableItems.filter(
    item => !administeredItems.has(item.id)
  );

  // Apply exposure control
  const maxExposure = 0.8; // 80% max exposure
  candidates = candidates.filter(item => {
    const exposure = (exposureCounts.get(item.id) || 0) / Math.max(totalAssessments, 1);
    return exposure < maxExposure;
  });

  // Apply content balancing constraints
  candidates = applyContentBalancing(candidates, constraints, administeredItems);

  if (candidates.length === 0) {
    // Relax constraints — pick least-exposed item
    candidates = availableItems.filter(item => !administeredItems.has(item.id));
  }

  // Compute Fisher Information at current theta for each candidate
  const withInfo = candidates.map(item => ({
    item,
    information: fisherInformation(item.a, item.b, item.c, currentTheta)
  }));

  // Sort by information (descending) and select top
  withInfo.sort((a, b) => b.information - a.information);

  // Add random exploration: select randomly from top 5 items
  // (prevents item pool from being over-predictable)
  const topN = Math.min(5, withInfo.length);
  const randomIndex = Math.floor(Math.random() * topN);

  return withInfo[randomIndex].item;
}

function fisherInformation(
  a: number, b: number, c: number, theta: number
): number {
  const p = threePL(a, b, c, theta);
  const q = 1 - p;
  const numerator = a * a * Math.pow(p - c, 2);
  const denominator = p * q * Math.pow(1 - c, 2);
  return numerator / denominator;
}
```

### 3.7 Content Balancing Constraints

```typescript
const contentConstraints = {
  // Subject coverage
  subjects: [
    { id: 'math', minItems: 8, maxItems: 15 },
    { id: 'english', minItems: 8, maxItems: 15 },
    { id: 'science', minItems: 6, maxItems: 12 },
    { id: 'social-studies', minItems: 4, maxItems: 8 },
  ],
  // Bloom's Taxonomy distribution
  bloomLevels: {
    remember: { target: 0.10, min: 0.05, max: 0.20 },    // 10%
    understand: { target: 0.20, min: 0.10, max: 0.30 },   // 20%
    apply: { target: 0.30, min: 0.20, max: 0.40 },        // 30%
    analyze: { target: 0.20, min: 0.10, max: 0.30 },      // 20%
    evaluate: { target: 0.10, min: 0.05, max: 0.20 },     // 10%
    create: { target: 0.10, min: 0.05, max: 0.20 },       // 10%
  },
  // Difficulty distribution
  difficultyTargets: {
    easy: { target: 0.10, b: [-3, -1] },
    medium: { target: 0.40, b: [-1, 1] },
    hard: { target: 0.30, b: [1, 2] },
    veryHard: { target: 0.20, b: [2, 3] },
  },
  // Concept coverage: minimum 2 items per concept (if available)
  conceptCoverageMin: 2,
};

function applyContentBalancing(
  candidates: ItemParams[],
  constraints: ContentConstraints,
  administered: Set<string>
): ItemParams[] {
  const remaining = constraints.subjects.map(sub => ({
    ...sub,
    remaining: sub.maxItems - countAdministeredBySubject(administered, sub.id)
  }));

  // Prioritize subjects that still have headroom
  const underMax = remaining.filter(r => r.remaining > 0);
  const subjectIds = new Set(underMax.map(r => r.id));

  candidates = candidates.filter(item => subjectIds.has(item.subjectId));

  // Check Bloom level distribution
  const bloomCounts = countBloomLevels(administered);
  const deficitBlooms = Object.entries(constraints.bloomLevels)
    .filter(([level, cfg]) => {
      const count = bloomCounts[level] || 0;
      const total = administered.size;
      const proportion = total > 0 ? count / total : 0;
      return proportion < cfg.min;
    })
    .map(([level]) => level);

  if (deficitBlooms.length > 0) {
    // Prioritize items from deficit bloom levels
    candidates = candidates.filter(item =>
      deficitBlooms.includes(item.bloomLevel)
    );
  }

  return candidates;
}
```

### 3.8 Termination Criteria

```typescript
function shouldTerminate(
  theta: number,
  se: number,
  itemsAdministered: number,
  timeElapsedSeconds: number,
  constraints: AssessmentConstraints
): { terminate: boolean; reason?: string } {
  // Criterion 1: High precision (primary)
  if (itemsAdministered >= constraints.minItems && se < 0.30) {
    return { terminate: true, reason: 'high_precision' };
  }

  // Criterion 2: Minimum items met with acceptable precision
  if (itemsAdministered >= constraints.minItems && se < 0.35) {
    return { terminate: true, reason: 'acceptable_precision' };
  }

  // Criterion 3: Maximum items reached
  if (itemsAdministered >= constraints.maxItems) {
    return { terminate: true, reason: 'max_items_reached' };
  }

  // Criterion 4: Time limit exceeded
  if (timeElapsedSeconds >= constraints.timeLimitSeconds) {
    return { terminate: true, reason: 'time_limit' };
  }

  // Criterion 5: Unable to improve precision
  // (no available items provide information > 0.05 at current theta)
  // → checked in item selection

  return { terminate: false };
}
```

**Default constraints:**
- `minItems`: 30
- `maxItems`: 50
- `targetThetaSe`: 0.30
- `acceptableThetaSe`: 0.35
- `timeLimitMinutes`: 45

---

## 4. MISCONCEPTION DETECTION ENGINE

### 4.1 Dual Approach: BKT + Error Pattern Matching

Deep Check uses two complementary approaches to detect misconceptions:

| Approach | Method | When Used |
|----------|--------|-----------|
| **Bayesian Knowledge Tracing (BKT)** | Probabilistic model updates misconception belief per response | During assessment (real-time) |
| **Error Pattern Matching** | Compare response pattern against known misconception signatures | Post-assessment (batch) |

### 4.2 Bayesian Knowledge Tracing

For each misconception m, maintain a probability P(Mₘ = true | responses) that the student holds this misconception.

**Initialization:** P₀(Mₘ) = base rate of misconception (from historical data, typically 0.01-0.30)

**Update Rule (per item response):**

When a student selects option o on question q:

```
P(Mₘ | response) = 
  [P(response | Mₘ) × P₀(Mₘ)] / 
  [P(response | Mₘ) × P₀(Mₘ) + P(response | ¬Mₘ) × (1 - P₀(Mₘ))]
```

Where:
- P(response | Mₘ) = probability of selecting this option if student holds misconception m
- P(response | ¬Mₘ) = probability of selecting this option if student does NOT hold misconception m

**Emission probabilities are derived from question-misconception mappings:**

Each question option can be tagged with:
- `misconception_id`: the misconception this option reveals
- `strength`: how indicative this option is of the misconception (0.0 - 1.0)

```typescript
interface MisconceptionEmission {
  misconceptionId: string;
  emissionIfCorrect: number;  // P(select correct | has misconception)
  emissionIfIncorrect: number; // P(select this wrong option | has misconception)
}

// Example: Fraction addition misconception
// Question: 1/2 + 1/3 = ?
// Options:
//   A) 2/5  ← mapped to MISCON-FRAC-ADD-001 (add numerator + denominator separately)
//   B) 5/6  ← correct
//   C) 2/6  ← mapped to MISCON-FRAC-ADD-002 (add numerators only)
//   D) 1/5  ← (no specific misconception, random error)

function updateMisconceptionProbability(
  currentProb: number,
  selectedOption: Option,
  questionMisconceptions: MisconceptionEmission[],
  isCorrect: boolean
): number {
  // For each misconception linked to this question
  let posterior = currentProb;

  for (const emission of questionMisconceptions) {
    const likelihood = isCorrect
      ? emission.emissionIfCorrect
      : (selectedOption.misconceptionId === emission.misconceptionId
          ? emission.emissionIfIncorrect
          : 0.01); // small probability of random selection

    const likelihoodNot = isCorrect
      ? (1 - emission.emissionIfCorrect)
      : 0.5; // generic wrong answer rate

    const numerator = likelihood * currentProb;
    const denominator = likelihood * currentProb + likelihoodNot * (1 - currentProb);

    if (denominator > 0) {
      posterior = numerator / denominator;
    }
  }

  // Clip to avoid numerical issues
  return Math.max(0.001, Math.min(0.999, posterior));
}
```

### 4.3 Misconception Detection Thresholds

| Probability Range | Classification | Action |
|------------------|----------------|--------|
| 0.00 - 0.30 | Unlikely | Ignore |
| 0.31 - 0.60 | Possible | Flag for further observation |
| 0.61 - 0.85 | Probable | Include in report as "suspected misconception" |
| 0.86 - 1.00 | Highly Probable | Include in report as "identified misconception" |

### 4.4 Error Pattern Matching (Post-Assessment)

Maintain a **Misconception Signature Matrix**:

```
                    Question 1    Question 2    Question 3    ...
                    Q1-O1  Q1-O2  Q2-O1  Q2-O2  Q3-O1  Q3-O2
Misconception 1      0.8    0.1    0.0    0.0    0.6    0.1
Misconception 2      0.0    0.7    0.9    0.0    0.0    0.0
Misconception 3      0.1    0.0    0.1    0.8    0.0    0.9
```

Each cell = probability that a student with this misconception selects this option.

After assessment, compute the **pattern match score** for each misconception:

```typescript
function computePatternMatchScore(
  responses: StudentResponse[],
  signatureMatrix: MisconceptionSignature[],
  threshold: number = 0.65
): MisconceptionMatch[] {
  const matches: MisconceptionMatch[] = [];

  for (const misconception of signatureMatrix) {
    let totalLogLikelihood = 0;
    let responseCount = 0;

    for (const response of responses) {
      const expectedProb = misconception.signature[response.questionId]?.[response.optionId];
      if (expectedProb !== undefined) {
        // Log-likelihood of this response given the misconception
        totalLogLikelihood += Math.log(expectedProb);
        responseCount++;
      }
    }

    // Average log-likelihood
    const avgLogLikelihood = responseCount > 0
      ? totalLogLikelihood / responseCount
      : -Infinity;

    // Convert to a 0-1 score using sigmoid
    const score = 1 / (1 + Math.exp(-5 * (avgLogLikelihood + 2)));

    if (score >= threshold) {
      matches.push({
        misconceptionId: misconception.id,
        misconception: misconception.name,
        confidence: Math.round(score * 100) / 100,
        evidenceCount: responseCount,
      });
    }
  }

  // Sort by confidence descending
  matches.sort((a, b) => b.confidence - a.confidence);
  return matches;
}
```

### 4.5 Misconception Bank (Seed Examples)

| ID | Concept | Misconception | Detection Pattern |
|----|---------|---------------|-------------------|
| MC-FRAC-01 | Fraction Addition | Adds numerators and denominators separately (½ + ⅓ = ²̸₅) | Selects answer that sums both parts |
| MC-FRAC-02 | Fraction Addition | Adds numerators only (½ + ⅓ = ²̸₆) | Selects answer with summed numerator, same denominator |
| MC-DEC-01 | Decimal Place Value | Ignores decimal alignment (0.1 + 0.02 = 0.12✓ but 0.1 + 0.02 = 0.03✗) | Aligns decimals as whole numbers |
| MC-ALG-01 | Equation Solving | Applies inverse operation to only one side | Solves x + 3 = 7 → x = 10 |
| MC-RDG-01 | Reading Comprehension | Selects answer based on keyword matching rather than meaning | Chooses options containing same words as passage |
| MC-GRA-01 | Grammar | Subject-verb agreement with collective nouns | Uses plural verb with "team" / "committee" |
| MC-LOG-01 | Logical Reasoning | Affirming the consequent | If P→Q and Q is true, concludes P must be true |
| MC-LOG-02 | Logical Reasoning | Denying the antecedent | If P→Q and P is false, concludes Q must be false |

---

## 5. READINESS SCORING

### 5.1 Overall Readiness Score

Composite score combining theta estimates across subjects, weighted by curriculum importance:

**Readiness = Σᵢ (wᵢ × θ-to-score(θᵢ)) / Σᵢ wᵢ**

Where:
- wᵢ = importance weight of subject i (1-10, set per assessment)
- θ-to-score function maps theta (-3 to +3) to score (0-100):

```typescript
function thetaToScore(theta: number): number {
  // Logistic mapping from theta (-3 to +3) to score (0 to 100)
  // Theta = 0 → Score = 50
  // Theta = -3 → Score ≈ 5
  // Theta = +3 → Score ≈ 95
  return Math.round(100 / (1 + Math.exp(-1.1 * theta)));
}
```

### 5.2 Readiness Categories

| Score Range | Category | Color | Description |
|------------|----------|-------|-------------|
| 0 - 29 | Critical | Red (#DC2626) | Major gaps detected; immediate intervention required |
| 30 - 44 | Weak | Orange (#EA580C) | Significant gaps; structured remediation needed |
| 45 - 59 | Developing | Yellow (#CA8A04) | Some gaps; targeted practice recommended |
| 60 - 74 | Competent | Lime (#65A30D) | Most concepts mastered; minor gaps remain |
| 75 - 89 | Strong | Green (#16A34A) | Well-prepared; ready for next level |
| 90 - 100 | Mastered | Emerald (#059669) | Fully prepared; exceeding expectations |

### 5.3 Subject Readiness Score

Per-subject readiness computed separately using only items from that subject:

```typescript
function computeSubjectReadiness(
  responses: StudentResponse[],
  subjectId: string,
  itemParams: Map<string, ItemParams>
): SubjectReadiness {
  const subjectResponses = responses.filter(
    r => itemParams.get(r.itemId)?.subjectId === subjectId
  );

  if (subjectResponses.length < 5) {
    return { subjectId, score: null, confidence: 'insufficient_data' };
  }

  const { theta, se } = estimateThetaEAP(subjectResponses);
  const score = thetaToScore(theta);

  return {
    subjectId,
    score,
    theta,
    se,
    confidence: se < 0.5 ? 'high' : se < 0.8 ? 'medium' : 'low',
    itemsUsed: subjectResponses.length,
  };
}
```

### 5.4 Concept Mastery Score

Computed using the last 3 responses per concept (or all available):

```typescript
function computeConceptMastery(
  studentId: string,
  conceptId: string,
  responseHistory: ResponseHistory[]
): ConceptMastery {
  const conceptResponses = responseHistory
    .filter(r => r.conceptId === conceptId)
    .slice(-5); // last 5 responses for this concept

  if (conceptResponses.length === 0) {
    return { conceptId, masteryLevel: 0, category: 'not_attempted' };
  }

  // Bayesian mastery estimate: simple proportion with prior
  const correct = conceptResponses.filter(r => r.isCorrect).length;
  const total = conceptResponses.length;
  const priorCorrect = 1; // Beta(1,1) prior
  const priorTotal = 2;

  const masteryEstimate = (correct + priorCorrect) / (total + priorTotal);
  const masteryScore = Math.round(masteryEstimate * 100);

  return {
    conceptId,
    masteryLevel: masteryScore,
    category: categorizeMastery(masteryScore),
    assessmentsUsed: total,
  };
}

function categorizeMastery(score: number): string {
  if (score >= 85) return 'mastered';
  if (score >= 65) return 'competent';
  if (score >= 45) return 'practicing';
  if (score >= 25) return 'introduced';
  return 'not_attempted';
}
```

---

## 6. LEARNING VELOCITY

### 6.1 Definition

Learning velocity v is the rate of change of theta over time:

**v = Δθ / Δt**

Where Δθ is the change in theta between two assessments and Δt is the time between them in days.

### 6.2 Computation

```typescript
interface AssessmentPoint {
  instanceId: string;
  theta: number;
  thetaSe: number;
  completedAt: Date;
}

function computeLearningVelocity(
  assessments: AssessmentPoint[]
): LearningVelocityResult {
  if (assessments.length < 2) {
    return { velocity: null, trend: 'insufficient_data' };
  }

  // Sort by date
  const sorted = [...assessments].sort(
    (a, b) => a.completedAt.getTime() - b.completedAt.getTime()
  );

  // Compute velocity between consecutive assessments
  const velocities: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const deltaTheta = sorted[i].theta - sorted[i - 1].theta;
    const deltaDays = (sorted[i].completedAt.getTime() - sorted[i - 1].completedAt.getTime())
      / (1000 * 60 * 60 * 24);
    if (deltaDays > 0) {
      velocities.push(deltaTheta / deltaDays);
    }
  }

  if (velocities.length === 0) {
    return { velocity: null, trend: 'insufficient_data' };
  }

  // Weighted average (more recent assessments weighted more)
  const weights = velocities.map((_, i) => Math.pow(1.2, i));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedVelocity = velocities.reduce(
    (sum, v, i) => sum + v * weights[i], 0
  ) / totalWeight;

  // Trend direction
  const accelerating = velocities.length >= 3
    ? velocities[velocities.length - 1] > velocities[0]
    : null;

  return {
    velocity: Math.round(weightedVelocity * 1000) / 1000, // theta change per day
    trend: accelerating === true ? 'accelerating'
      : accelerating === false ? 'declining'
      : 'stable',
    dataPoints: assessments.length,
  };
}
```

### 6.3 Velocity Interpretation

| Velocity (θ/day) | Interpretation |
|------------------|----------------|
| > 0.10 | Rapid progress |
| 0.03 - 0.10 | Good progress |
| 0.01 - 0.03 | Steady progress |
| -0.01 - 0.01 | Plateaued |
| -0.10 - -0.01 | Declining |
| < -0.10 | Rapid decline — urgent intervention |

---

## 7. ITEM POOL MANAGEMENT

### 7.1 Item Calibration

New items enter the pool uncalibrated and are seeded with:
- `a = 1.0` (default discrimination)
- `b = 0.0` (default difficulty, adjusted by content expert)
- `c = 1/n` where n = number of options (e.g., 0.25 for 4 options)

Items are calibrated after 100+ responses using marginal maximum likelihood (MML) via the EM algorithm:

```typescript
async function calibrateItems(
  questionId: string,
  responseData: { theta: number; correct: boolean }[]
): Promise<ItemParams> {
  if (responseData.length < 100) {
    return null; // insufficient data
  }

  // Use fixed theta estimates from concurrent items to estimate
  // this item's parameters via logistic regression

  // Joint MML estimation would require full IRT software (MIRT, flexMIRT)
  // For in-platform use, use a simplified approach:
  const result = logisticRegression(responseData);
  // result returns a, b parameters; c is fixed to 1/n

  return {
    a: result.discrimination,
    b: result.difficulty,
    c: 1 / nOptions, // fixed guessing parameter
  };
}
```

### 7.2 Item Exposure Control

Prevent overexposure of high-quality items:

```typescript
// Randomesque exposure control
// Each item's exposure rate is capped at 80%
// When selecting next item, prefer items with lower exposure rates
// among the top 5 information-providing items

function exposureControl(
  candidates: ItemWithInfo[],
  exposureRates: Map<string, number>,
  randomFactor: number = 0.3
): ItemWithInfo {
  // Add small random noise to information to diversify selection
  const diversified = candidates.map(item => ({
    ...item,
    adjustedInfo: item.information * (1 + randomFactor * (Math.random() - 0.5))
  }));

  // Sort by adjusted information
  diversified.sort((a, b) => b.adjustedInfo - a.adjustedInfo);

  // From top 5, apply exposure penalty
  const topN = diversified.slice(0, 5);
  topN.forEach(item => {
    const exposure = exposureRates.get(item.item.id) || 0;
    item.adjustedInfo *= (1 - exposure * 0.3); // penalize exposed items
  });

  topN.sort((a, b) => b.adjustedInfo - a.adjustedInfo);
  return topN[0];
}
```

---

## 8. ASSESSMENT EVENT HANDLING

### 8.1 Network Interruption Recovery

```typescript
// Implementation plan for interrupted assessment recovery:

// 1. Client-side: Store responses in IndexedDB before sending
// 2. Client sends response via POST /api/assessment/submit-answer
// 3. If request fails, keep in IndexedDB queue
// 4. On reconnect, replay queued responses
// 5. Server accepts responses in any order (uses item_order for sequencing)
// 6. Server deduplicates by (instance_id, item_id)

interface AssessmentRecoveryState {
  instanceId: string;
  currentItemIndex: number;
  currentTheta: number;
  thetaSe: number;
  completedItems: SubmittedAnswer[];
  pendingItems: SubmittedAnswer[]; // queued locally
  startedAt: string;
  timeElapsedSeconds: number;
}
```

### 8.2 Suspicious Behavior Detection

```typescript
function detectSuspiciousBehavior(
  responses: AssessmentResponse[],
  norms: BehaviorNorms
): SuspiciousFlag[] {
  const flags: SuspiciousFlag[] = [];

  // Too fast responses (guessing)
  const fastResponses = responses.filter(r => r.responseTimeMs < 2000);
  if (fastResponses.length / responses.length > 0.5) {
    flags.push({
      type: 'too_fast',
      severity: 'warning',
      detail: '50%+ responses in under 2 seconds — possible guessing',
    });
  }

  // Suspiciously consistent response times (bot detection)
  const times = responses.map(r => r.responseTimeMs);
  const cv = standardDeviation(times) / mean(times);
  if (cv < 0.1 && responses.length > 10) {
    flags.push({
      type: 'too_uniform',
      severity: 'warning',
      detail: 'Response times unusually uniform — possible automation',
    });
  }

  // Ability inconsistency
  const firstHalf = estimateThetaFromSubset(responses, 0, Math.floor(responses.length / 2));
  const secondHalf = estimateThetaFromSubset(responses, Math.floor(responses.length / 2));
  if (Math.abs(firstHalf.theta - secondHalf.theta) > 2.0) {
    flags.push({
      type: 'ability_inconsistency',
      severity: 'flag',
      detail: 'Large inconsistent ability across assessment halves',
    });
  }

  // Answer pattern analysis (all same answer, alternating, etc.)
  const options = responses.map(r => r.selectedOptionId);
  if (detectPattern(options)) {
    flags.push({
      type: 'pattern_detected',
      severity: 'flag',
      detail: 'Non-random pattern detected in answer choices',
    });
  }

  return flags;
}
```

---

## 9. SCORING PIPELINE

```
┌──────────────────────────────────────────────────────────┐
│                ASSESSMENT SCORING PIPELINE                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Answer Submitted]                                      │
│       │                                                  │
│       ▼                                                  │
│  ┌─────────────┐                                         │
│  │ Validate    │ → Check item belongs to instance        │
│  │ Response    │ → Check within time limit               │
│  └──────┬──────┘ → Check not already submitted           │
│          │                                               │
│          ▼                                               │
│  ┌─────────────┐                                         │
│  │ Score       │ → Compare selected vs correct options   │
│  │ Response    │ → Compute partial credit if applicable  │
│  └──────┬──────┘                                         │
│          │                                               │
│          ▼                                               │
│  ┌─────────────┐                                         │
│  │ Update      │ → EAP estimation with new response      │
│  │ Theta       │ → Update standard error                 │
│  └──────┬──────┘                                         │
│          │                                               │
│          ▼                                               │
│  ┌─────────────┐                                         │
│  │ Update      │ → BKT update for each misconception     │
│  │ Misconcep-  │ → Pattern match score                   │
│  │ tions       │                                         │
│  └──────┬──────┘                                         │
│          │                                               │
│          ▼                                               │
│  ┌─────────────┐                                         │
│  │ Select      │ → Maximize Fisher Info at new θ         │
│  │ Next Item   │ → Apply content/exposure constraints    │
│  └──────┬──────┘                                         │
│          │                                               │
│          ▼                                               │
│  ┌─────────────┐                                         │
│  │ Check       │ → SE < threshold? Items ≥ min?          │
│  │ Terminate   │ → Time limit? Content covered?          │
│  └──────┬──────┘                                         │
│          │                                               │
│     ┌────┴────┐                                          │
│     ▼         ▼                                          │
│  [Next Item] [Complete → Generate Report]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 10. ASSESSMENT ENGINE VALIDATION

| Validation | Method | Frequency |
|------------|--------|-----------|
| Item fit | Infit/Outfit MNSQ (acceptable: 0.7 - 1.3) | Per 500 responses |
| Test information | TIF at each theta level | Per assessment type |
| Model fit | Comparison of 2PL vs 3PL (likelihood ratio test) | Per 1000 responses |
| DIF (Differential Item Functioning) | Mantel-Haenszel for gender/school type | Per 500 responses |
| Reliability | Empirical reliability = var(θ̂) / [var(θ̂) + mean(SE²)] | Per 100 assessments |
| Score validity | Correlation with external criteria (WAEC, term exams) | Per term |

---

*End of Phase 7 — Assessment Engine Design*

**Complete IRT-3PL model, CAT algorithm, EAP estimation, misconception detection (BKT + Error Pattern Matching), readiness scoring, learning velocity, item pool management, validation framework.**

**Next: Phase 8 — Analytics & AI Recommendation Engine**

*Confirm readiness to proceed to Phase 8.*
