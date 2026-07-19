import { primaryToJss1, jss3ToSs1, ss3ToUniversity } from "./index";
import type { AssessmentConfig } from "./types";

const assessments: Record<string, AssessmentConfig> = {
  "primary-to-jss1": primaryToJss1,
  "jss3-to-ss1": jss3ToSs1,
  "ss3-to-university": ss3ToUniversity,
};

export function getAssessmentById(id: string): AssessmentConfig | undefined {
  return assessments[id];
}

/**
 * Returns a randomized subset from a question bank.
 * Each call shuffles and picks a different set, so retakes are always unique.
 * If count is omitted, uses the bank's configured questionCount.
 * Maintains section distribution proportions.
 */
export function getRandomizedAssessment(
  id: string,
  count?: number,
): AssessmentConfig | undefined {
  const bank = assessments[id];
  if (!bank) return undefined;

  const targetCount = count || bank.questionCount;
  if (bank.questions.length <= targetCount) {
    // Shuffle all if bank is smaller than target
    return {
      ...bank,
      questionCount: bank.questions.length,
      questions: [...bank.questions].sort(() => Math.random() - 0.5),
    };
  }

  // Shuffle entire pool
  const shuffled = [...bank.questions].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, targetCount);

  // Recalculate sections based on what was picked
  const sectionMap: Record<string, number> = {};
  for (const q of picked) {
    // Determine section by concept key
    let section = "General";
    for (const s of bank.sections) {
      if (s.concepts.includes(q.concept)) {
        section = s.name;
        break;
      }
    }
    sectionMap[section] = (sectionMap[section] || 0) + 1;
  }

  return {
    ...bank,
    questionCount: picked.length,
    questions: picked.sort(() => Math.random() - 0.5),
    sections: bank.sections.map((s) => ({
      ...s,
      count: sectionMap[s.name] || 0,
    })).filter((s) => s.count > 0),
  };
}

export function getAllAssessmentMeta() {
  return Object.values(assessments).map((a) => ({
    id: a.id,
    title: a.title,
    level: a.level,
    description: a.description,
    questionCount: a.questionCount,
    timeLimitMinutes: a.timeLimitMinutes,
    sections: a.sections,
    totalBankSize: a.questions.length,
  }));
}
