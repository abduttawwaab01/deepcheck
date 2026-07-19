/**
 * OpenRouter AI integration — used ONLY for deep report enhancement.
 * The primary assessment engine (IRT, scoring, classification) is rule-based.
 * AI is used to:
 *   1. Generate natural-language study recommendations
 *   2. Summarize concept mastery into human-readable text
 *   3. Suggest learning resources based on weak areas
 *   4. Generate cognitive profile narrative
 */

interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const DEFAULT_CONFIG: AIConfig = {
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  model: "deepseek/deepseek-chat-v3-0324:free",
};

const FALLBACK_MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-2b-it:free",
  "cohere/command-r7b-12-2024:free",
];

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIPayload {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
}

async function tryModel(
  config: AIConfig,
  messages: AIMessage[],
  model: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const payload: AIPayload = {
      model,
      messages,
      temperature: 0.3,
      max_tokens: 2048,
    };

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "HTTP-Referer": "https://deepcheck.app",
        "X-Title": "Deep Check",
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function callAI(
  messages: AIMessage[],
  config: Partial<AIConfig> = {},
  timeoutMs = 15000,
): Promise<string | null> {
  const merged = { ...DEFAULT_CONFIG, ...config };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const models = [merged.model, ...FALLBACK_MODELS.filter((m) => m !== merged.model)];

    for (const model of models) {
      const result = await tryModel(merged, messages, model, controller.signal);
      if (result !== null) return result;
    }

    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Prompt Templates ─────────────────────────────────────────────────

export interface DeepReportInput {
  studentName: string;
  overallScore: number;
  category: string;
  theta: number;
  conceptMasteries: Array<{
    topicName: string;
    score: number;
    classification: string;
    responses: number;
  }>;
  strengths: string[];
  weaknesses: string[];
  cognitiveProfile: Record<string, number>;
}

export async function generateRecommendations(data: DeepReportInput): Promise<{
  studyPlan: string;
  resourceSuggestions: string[];
  summary: string;
}> {
  const systemPrompt =
    "You are an expert educational analyst for Nigerian secondary school students (WASSCE curriculum). " +
    "Provide concise, actionable recommendations. Respond in valid JSON only with keys: studyPlan, resourceSuggestions (array of 3), summary.";

  const userPrompt = `Generate a personalized study plan for a ${data.category} student (score: ${data.overallScore}%) based on:
- Strengths: ${data.strengths.join(", ")}
- Weaknesses: ${data.weaknesses.join(", ")}
- Concept mastery: ${data.conceptMasteries.map((c) => `${c.topicName}: ${c.classification} (${c.score}%)`).join("; ")}
- Cognitive profile: ${JSON.stringify(data.cognitiveProfile)}`;

  const result = await callAI([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  if (!result) {
    return {
      studyPlan: generateRuleBasedPlan(data),
      resourceSuggestions: getResourceSuggestions(data.weaknesses),
      summary: `${data.studentName} scored ${data.overallScore}% (${data.category}). Focus on ${data.weaknesses.slice(0, 2).join(" and ")}.`,
    };
  }

  try {
    const parsed = JSON.parse(result);
    return {
      studyPlan: parsed.studyPlan || generateRuleBasedPlan(data),
      resourceSuggestions: parsed.resourceSuggestions || getResourceSuggestions(data.weaknesses),
      summary: parsed.summary || `${data.studentName} scored ${data.overallScore}%.`,
    };
  } catch {
    return {
      studyPlan: generateRuleBasedPlan(data),
      resourceSuggestions: getResourceSuggestions(data.weaknesses),
      summary: result.slice(0, 300),
    };
  }
}

export async function generateCognitiveProfile(data: {
  strengths: string[];
  weaknesses: string[];
  bloomBreakdown: Record<string, number>;
}): Promise<string> {
  const result = await callAI([
    {
      role: "system",
      content:
        "You are an educational psychologist. Write a 2-3 sentence cognitive profile for a Nigerian secondary student based on assessment data. Be encouraging but honest.",
    },
    {
      role: "user",
      content: `Strengths: ${data.strengths.join(", ")}. Weaknesses: ${data.weaknesses.join(", ")}. Bloom's taxonomy breakdown: ${JSON.stringify(data.bloomBreakdown)}`,
    },
  ]);

  return (
    result ||
    `This student demonstrates strengths in ${data.strengths.slice(0, 2).join(" and ")}. ` +
      `Areas for growth include ${data.weaknesses.slice(0, 2).join(" and ")}. ` +
      `With targeted practice, significant improvement is expected within 4-6 weeks.`
  );
}

// ─── Rule-Based Fallbacks (zero AI dependency) ─────────────────────────

function generateRuleBasedPlan(data: DeepReportInput): string {
  const weakAreas = data.weaknesses.map((w) => `- ${w}`).join("\n");
  const strongAreas = data.strengths.map((s) => `- ${s}`).join("\n");

  return `## Personalized Study Plan for ${data.studentName}\n\n` +
    `### Current Status: ${data.category} (${data.overallScore}%)\n\n` +
    `### Strengths to Leverage\n${strongAreas}\n\n` +
    `### Priority Improvement Areas\n${weakAreas}\n\n` +
    `### Recommended Weekly Schedule\n` +
    `1. **Daily (20 min)**: Review one weak concept using past questions\n` +
    `2. **Twice weekly (30 min)**: Practice mixed-topic quizzes\n` +
    `3. **Weekly (45 min)**: Full-length timed practice assessment\n\n` +
    `### Focus Topics (Next 2 Weeks)\n` +
    `${data.conceptMasteries.filter((c) => c.score < 50).slice(0, 3).map((c) => `- ${c.topicName}`).join("\n") || "- Review all core topics"}`;
}

function getResourceSuggestions(weaknesses: string[]): string[] {
  const resourceMap: Record<string, string[]> = {
    algebra: ["Khan Academy - Algebra Basics", "JAMB Past Questions on Algebra", "YouTube: Algebraic Expressions Explained"],
    geometry: ["GeoGebra Interactive Geometry", "WASSCE Geometry Past Papers", "YouTube: Geometry for WASSCE"],
    trigonometry: ["Khan Academy - Trigonometry", "Unit Circle Practice App", "YouTube: Trigonometry Made Simple"],
    fraction: ["Math Antics - Fractions", "Fractions Practice Worksheets", "IXL: Fraction Operations"],
    grammar: ["Grammarly Handbook", "English Grammar for WASSCE", "BBC Bitesize - Grammar"],
    vocabulary: ["Vocabulary.com", "Wordly Wise 3000", "Daily Vocabulary Builder App"],
    comprehension: ["ReadTheory.org", "CommonLit Reading Passages", "WASSCE Comprehension Practice"],
  };

  const suggestions = new Set<string>();
  for (const w of weaknesses) {
    const lower = w.toLowerCase();
    for (const [key, resources] of Object.entries(resourceMap)) {
      if (lower.includes(key)) {
        resources.forEach((r) => suggestions.add(r));
      }
    }
  }

  return suggestions.size >= 3
    ? Array.from(suggestions).slice(0, 3)
    : [
        "Khan Academy - Topic Review",
        "WASSCE/NECO Past Question Bank",
        "Deep Check Practice Quizzes",
      ];
}
