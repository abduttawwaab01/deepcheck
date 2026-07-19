export type Role = "admin" | "school_admin" | "teacher" | "student" | "parent" | "guest";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId?: string;
  image?: string;
}

export interface AuthResult {
  user: SessionUser;
  token: string;
}

// Assessment Types
export interface ItemParams {
  id: string;
  a: number; // discrimination
  b: number; // difficulty
  c: number; // guessing
  subjectId: string;
  bloomLevel: BloomLevel;
  conceptId?: string;
}

export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export interface ThetaEstimate {
  theta: number;
  se: number;
  method: "eap" | "mle" | "map";
}

export interface MisconceptionProb {
  misconceptionId: string;
  probability: number;
  confidence: number;
}

export interface ReadinessScoreData {
  score: number;
  category: ReadinessCategory;
  previousScore?: number;
  change?: number;
}

export type ReadinessCategory = "critical" | "weak" | "developing" | "competent" | "strong" | "mastered";

export interface DashboardData {
  overallReadiness: ReadinessScoreData;
  radarData: { dimension: string; score: number; peerAverage?: number }[];
  weakConcepts: { id: string; name: string; score: number }[];
  strongConcepts: { id: string; name: string; score: number }[];
  journey: { date: string; score: number }[];
  streak: number;
  recommendations: { id: string; title: string; description: string }[];
}

// Deep Report Types
export interface DeepReportData {
  id: string;
  overallReadiness: ReadinessScoreData;
  subjectReadiness: { subject: string; score: number }[];
  radarData: { dimension: string; score: number }[];
  cognitiveSkills: { skill: string; score: number }[];
  gapRanking: { concept: string; score: number; impact: string }[];
  heatmap: { subject: string; level: string; score: number }[][];
  learningVelocity: { rate: number; trend: string };
  riskAnalysis: { atRiskSubjects: string[]; description: string };
  improvementPlan: { phase: string; actions: string[] }[];
  dailyPlan: { exercise: string; minutes: number }[];
}

// Payment Types
export interface PaymentInit {
  amount: number;
  email: string;
  reference: string;
  metadata: Record<string, string>;
}

export type PaymentProvider = "paystack" | "flutterwave" | "stripe";

// Chart Types
export interface RadarDataPoint {
  dimension: string;
  student: number;
  peerAverage?: number;
}

export interface HeatmapData {
  subject: string;
  bloomLevel: BloomLevel;
  score: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  upperBound?: number;
  lowerBound?: number;
}

// API Response Types
export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  error?: { code: string; message: string; details?: any[] };
  meta?: { page: number; pageSize: number; total: number; totalPages: number };
}
