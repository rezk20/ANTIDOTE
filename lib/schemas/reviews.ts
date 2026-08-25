import { z } from "zod";

export const REVIEW_TYPES = ["weekly", "monthly", "quarterly", "yearly", "daily"] as const;
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
  period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
  scores: dimensionScoresSchema,
  answers: weeklyReviewAnswersSchema,
});
export type WeeklyReviewFormData = z.infer<typeof weeklyReviewFormSchema>;
