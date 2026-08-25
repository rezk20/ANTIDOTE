import type { DimensionScores } from "@/lib/schemas/reviews";

export interface WeeklyAggregatedMetrics {
  incomeThisWeek: number;
  expensesThisWeek: number;
  netSavings: number;
  tasksDone: number;
  highPriorityDone: number;
  proposalsSent: number;
  dealsWon: number;
  daysPlanned: number;
}

/**
 * Calculates overall balance rating across the 6 dimensions (scale 1.0 to 5.0).
 */
export function calculateOverallBalance(scores: DimensionScores): number {
  if (!scores) return 0;
  const values = [
    scores.revenue || 0,
    scores.career || 0,
    scores.financial || 0,
    scores.relationship || 0,
    scores.execution || 0,
    scores.routine || 0,
  ];

  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = sum / values.length;
  return Number(avg.toFixed(1));
}

/**
 * Converts a 1-5 scale score to percentage (0 - 100%).
 */
export function formatScoreToPercentage(score: number): number {
  const clamped = Math.max(1, Math.min(5, score));
  return Math.round((clamped / 5) * 100);
}

/**
 * Returns a color token / tier based on dimension score.
 */
export function getScoreColor(score: number): string {
  if (score >= 4.5) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800";
  if (score >= 3.5) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800";
  if (score >= 2.5) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
  return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800";
}
