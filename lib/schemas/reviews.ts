import { z } from "zod";

export const REVIEW_TYPES = [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "daily",
] as const;
export type ReviewType = (typeof REVIEW_TYPES)[number];

export const DIMENSIONS = [
  "revenue",
  "career",
  "financial",
  "relationship",
  "execution",
  "routine",
] as const;
export type ProgressDimension = (typeof DIMENSIONS)[number];

export const dimensionScoresSchema = z.object({
  revenue: z.number().int().min(1).max(5).default(3),
  career: z.number().int().min(1).max(5).default(3),
  financial: z.number().int().min(1).max(5).default(3),
  relationship: z.number().int().min(1).max(5).default(3),
  execution: z.number().int().min(1).max(5).default(3),
  routine: z.number().int().min(1).max(5).default(3),
});
export type DimensionScores = z.infer<typeof dimensionScoresSchema>;

/* ---------------- WEEKLY REVIEW ---------------- */
export const weeklyReviewAnswersSchema = z.object({
  q_wins: z.string().default(""),
  q_misses: z.string().default(""),
  q_revenue_reflection: z.string().default(""),
  q_time_drain: z.string().default(""),
  q_client_health: z.string().default(""),
  q_learning_growth: z.string().default(""),
  q_relationship_check: z.string().default(""),
  q_habits_energy: z.string().default(""),
  q_start: z.string().default(""),
  q_stop: z.string().default(""),
  q_continue: z.string().default(""),
  q_next_top_three: z.string().default(""),
  q_system_tweak: z.string().default(""),
});
export type WeeklyReviewAnswers = z.infer<typeof weeklyReviewAnswersSchema>;

export const weeklyReviewFormSchema = z.object({
  id: z.string().uuid().optional(),
  period_start: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  period_end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
  scores: dimensionScoresSchema,
  answers: weeklyReviewAnswersSchema,
});
export type WeeklyReviewFormData = z.infer<typeof weeklyReviewFormSchema>;

/* ---------------- MONTHLY REVIEW  ---------------- */
export const monthlyReviewAnswersSchema = z.object({
  keep: z.string().default(""),
  start: z.string().default(""),
  stop: z.string().default(""),
  double_down: z.string().default(""),
  reflection: z.string().default(""),
  q_wins: z.string().default(""),
  q_challenges: z.string().default(""),
  q_relationship: z.string().default(""),
  q_next_month_focus: z.string().default(""),
});
export type MonthlyReviewAnswers = z.infer<typeof monthlyReviewAnswersSchema>;

export const monthlyReviewFormSchema = z.object({
  id: z.string().uuid().optional(),
  period_start: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  period_end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
  scores: dimensionScoresSchema,
  answers: monthlyReviewAnswersSchema,
});
export type MonthlyReviewFormData = z.infer<typeof monthlyReviewFormSchema>;

/* ---------------- QUARTERLY REVIEW  ---------------- */
export const quarterlyReviewAnswersSchema = z.object({
  q_revenue_evaluation: z.string().default(""),
  q_pipeline_health: z.string().default(""),
  q_marriage_readiness: z.string().default(""),
  q_strategy_pivot: z.string().default(""),
  q_time_reallocation: z.string().default(""),
  q_next_quarter_goals: z.string().default(""),
});
export type QuarterlyReviewAnswers = z.infer<
  typeof quarterlyReviewAnswersSchema
>;

export const quarterlyReviewFormSchema = z.object({
  id: z.string().uuid().optional(),
  period_start: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  period_end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
  scores: dimensionScoresSchema,
  answers: quarterlyReviewAnswersSchema,
});
export type QuarterlyReviewFormData = z.infer<typeof quarterlyReviewFormSchema>;

/* ---------------- YEAR IN REVIEW  ---------------- */
export const yearlyReviewAnswersSchema = z.object({
  biggest_client: z.string().default(""),
  best_project: z.string().default(""),
  biggest_mistake: z.string().default(""),
  biggest_lesson: z.string().default(""),
  relationship_highlights: z.string().default(""),
  career_growth: z.string().default(""),
  what_changed: z.string().default(""),
  next_year_plan: z.string().default(""),
});
export type YearlyReviewAnswers = z.infer<typeof yearlyReviewAnswersSchema>;

export const yearlyReviewFormSchema = z.object({
  id: z.string().uuid().optional(),
  period_start: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  period_end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
  scores: dimensionScoresSchema,
  answers: yearlyReviewAnswersSchema,
});
export type YearlyReviewFormData = z.infer<typeof yearlyReviewFormSchema>;
