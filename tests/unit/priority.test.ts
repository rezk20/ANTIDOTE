import { describe, it, expect } from "vitest";
import {
  calculatePriorityScore,
  inferPriorityTier,
  sortTasksByPriority,
} from "@/lib/logic/priority";
import type { TaskRow } from "@/lib/supabase/types";

describe("Priority Calculation Algorithm (§31)", () => {
  it("should calculate score with impact weights and effort deduction", () => {
    // Formula: (rev * 3) + (strat * 2) + (urg * 2) + (rel * 1.5) - eff + (top3 ? 10 : 0)
    // rev=5 (15), strat=4 (8), urg=3 (6), rel=0 (0), eff=2 (-2), top3=false (0)
    // 15 + 8 + 6 + 0 - 2 = 27
    const score = calculatePriorityScore({
      revenue_impact: 5,
      strategic_impact: 4,
      urgency: 3,
      relationship_impact: 0,
      effort: 2,
      is_top_three: false,
    });

    expect(score).toBe(27);
  });

  it("should apply +10 boost for Top 3 tasks", () => {
    const scoreNormal = calculatePriorityScore({
      revenue_impact: 2,
      effort: 3,
      is_top_three: false,
    });
    const scoreTop3 = calculatePriorityScore({
      revenue_impact: 2,
      effort: 3,
      is_top_three: true,
    });

    expect(scoreTop3 - scoreNormal).toBe(10);
  });

  it("should map scores to correct priority tiers", () => {
    expect(inferPriorityTier(25)).toBe("critical");
    expect(inferPriorityTier(15)).toBe("high");
    expect(inferPriorityTier(8)).toBe("medium");
    expect(inferPriorityTier(3)).toBe("low");
  });

  it("should sort tasks with Top 3 first and higher scores next", () => {
    const mockTasks: TaskRow[] = [
      {
        id: "1",
        user_id: "u1",
        title: "Low priority task",
        description: null,
        area: "admin",
        task_type: "admin",
        priority: "low",
        effort: 4,
        duration_min: null,
        scheduled_date: null,
        deadline: null,
        status: "backlog",
        is_top_three: false,
        recurring_rule: null,
        recurring_source_id: null,
        energy_level: 2,
        revenue_impact: 0,
        strategic_impact: 0,
        relationship_impact: 0,
        urgency: 1,
        goal_id: null,
        project_id: null,
        lead_id: null,
        completed_at: null,
        sort_order: 1,
        created_at: "2026-08-24T00:00:00Z",
        updated_at: "2026-08-24T00:00:00Z",
      },
      {
        id: "2",
        user_id: "u1",
        title: "High revenue proposal",
        description: null,
        area: "work",
        task_type: "revenue",
        priority: "critical",
        effort: 2,
        duration_min: null,
        scheduled_date: null,
        deadline: null,
        status: "backlog",
        is_top_three: false,
        recurring_rule: null,
        recurring_source_id: null,
        energy_level: 4,
        revenue_impact: 5,
        strategic_impact: 4,
        relationship_impact: 0,
        urgency: 4,
        goal_id: null,
        project_id: null,
        lead_id: null,
        completed_at: null,
        sort_order: 2,
        created_at: "2026-08-24T00:00:00Z",
        updated_at: "2026-08-24T00:00:00Z",
      },
      {
        id: "3",
        user_id: "u1",
        title: "Top 3 Focus Task",
        description: null,
        area: "marriage",
        task_type: "marriage",
        priority: "high",
        effort: 2,
        duration_min: null,
        scheduled_date: null,
        deadline: null,
        status: "backlog",
        is_top_three: true,
        recurring_rule: null,
        recurring_source_id: null,
        energy_level: 3,
        revenue_impact: 1,
        strategic_impact: 2,
        relationship_impact: 5,
        urgency: 2,
        goal_id: null,
        project_id: null,
        lead_id: null,
        completed_at: null,
        sort_order: 3,
        created_at: "2026-08-24T00:00:00Z",
        updated_at: "2026-08-24T00:00:00Z",
      },
    ];

    const sorted = sortTasksByPriority(mockTasks);
    // Task 3 is Top 3 -> goes first
    expect(sorted[0].id).toBe("3");
    // Task 2 has high revenue/strategy score -> goes second
    expect(sorted[1].id).toBe("2");
    // Task 1 has low score -> goes last
    expect(sorted[2].id).toBe("1");
  });
});
