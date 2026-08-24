import type { TaskPriority, TaskRow } from "@/lib/supabase/types";

export interface PriorityScoreInput {
  revenue_impact?: number | null;
  strategic_impact?: number | null;
  urgency?: number | null;
  relationship_impact?: number | null;
  effort?: number | null;
  is_top_three?: boolean | null;
  deadline?: string | null;
}

/**
 * Calculates a task's priority score (§31):
 * - revenue_impact weight: 3x
 * - strategic_impact weight: 2x
 * - urgency weight: 2x
 * - relationship_impact weight: 1.5x
 * - effort penalty: -1x
 * - Top 3 boost: +10
 */
export function calculatePriorityScore(input: PriorityScoreInput): number {
  const rev = Math.max(0, Math.min(5, input.revenue_impact ?? 0));
  const strat = Math.max(0, Math.min(5, input.strategic_impact ?? 0));
  let urg = Math.max(0, Math.min(5, input.urgency ?? 0));
  const rel = Math.max(0, Math.min(5, input.relationship_impact ?? 0));
  const eff = Math.max(1, Math.min(5, input.effort ?? 3));

  // If deadline is within 24 hours and urgency is 0, infer high urgency
  if (input.deadline && urg === 0) {
    const hoursUntilDeadline =
      (new Date(input.deadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilDeadline > 0 && hoursUntilDeadline <= 24) {
      urg = 5;
    } else if (hoursUntilDeadline > 24 && hoursUntilDeadline <= 48) {
      urg = 4;
    }
  }

  const baseScore =
    rev * 3 + strat * 2 + urg * 2 + rel * 1.5 - eff + (input.is_top_three ? 10 : 0);

  return Math.round(baseScore * 10) / 10;
}

/**
 * Maps a numerical priority score to a standard TaskPriority tier.
 */
export function inferPriorityTier(score: number): TaskPriority {
  if (score >= 20) return "critical";
  if (score >= 12) return "high";
  if (score >= 6) return "medium";
  return "low";
}

/**
 * Helper to sort tasks by priority score descending.
 */
export function sortTasksByPriority(tasks: TaskRow[]): TaskRow[] {
  return [...tasks].sort((a, b) => {
    // Top 3 tasks first
    if (a.is_top_three && !b.is_top_three) return -1;
    if (!a.is_top_three && b.is_top_three) return 1;

    // Then by computed score
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Tie-breaker by sort_order
    return a.sort_order - b.sort_order;
  });
}
