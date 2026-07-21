export interface AssessmentQuestion {
  id: string;
  renderer: "standard" | "passage" | "chart" | "geometry" | "interactive";
  questionText: string;
  passageText?: string;
  chartData?: ChartData;
  geometryData?: GeometryData;
  interactiveData?: InteractiveData;
  options: { id: string; text: string }[];
  correctOptionId?: string;
  concept: string;
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate";
  difficulty: number;
  discrimination: number;
  guessing: number;
  expectedTimeSecs: number;
  allowsCalculator: boolean;
  department?: string;
}

export interface ChartData {
  type: "bar" | "pie" | "line";
  title: string;
  labels: string[];
  values: number[];
  colors?: string[];
  unit?: string;
}

export interface GeometryData {
  type: "triangle" | "circle" | "right_triangle" | "graph" | "number_line" | "quadrilateral";
  label: string;
  dimensions: Record<string, number>;
  markings?: string[];
}

export interface InteractiveData {
  type: "ordering" | "fill_blanks";
  items?: string[];
  correctOrder?: string[];
  blanks?: { id: string; textBefore: string; textAfter: string; correctAnswer: string }[];
}

export interface AssessmentConfig {
  id: string;
  title: string;
  level: string;
  description: string;
  questionCount: number;
  timeLimitMinutes: number;
  sections: { name: string; count: number; concepts: string[] }[];
  questions: AssessmentQuestion[];
}
