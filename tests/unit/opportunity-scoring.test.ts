import { describe, it, expect } from "vitest";
import {
  calculateOpportunityScore,
  prioritizeOpportunities,
} from "@/lib/logic/opportunity";
import type { OpportunityRow } from "@/lib/supabase/types";

describe("Opportunity Prioritization Logic (§50)", () => {
  const mockOpportunities: OpportunityRow[] = [
    {
      id: "opp-1",
      user_id: "user-1",
      title: "Gig A - Fast Bot",
      kind: "discord_client",
      expected_value: 5000,
      probability: 0.8,
      time_required_hours: 5, // Score = (5000 * 0.8) / 5 = 800
      risk: "low",
      next_action: "Send invoice",
      status: "open",
      created_at: "2026-08-01T10:00:00Z",
      updated_at: "2026-08-01T10:00:00Z",
    },
    {
      id: "opp-2",
      user_id: "user-1",
      title: "Gig B - Large Platform",
      kind: "freelance",
      expected_value: 30000,
      probability: 0.4,
      time_required_hours: 40, // Score = (30000 * 0.4) / 40 = 300
      risk: "high",
      next_action: "Draft proposal",
      status: "open",
      created_at: "2026-08-01T10:00:00Z",
      updated_at: "2026-08-01T10:00:00Z",
    },
    {
      id: "opp-3",
      user_id: "user-1",
      title: "Gig C - High Retainer",
      kind: "remote",
      expected_value: 20000,
      probability: 0.9,
      time_required_hours: 15, // Score = (20000 * 0.9) / 15 = 1200
      risk: "low",
      next_action: "Final interview",
      status: "pursuing",
      created_at: "2026-08-01T10:00:00Z",
      updated_at: "2026-08-01T10:00:00Z",
    },
  ];

  it("calculates individual opportunity score using EV * Prob / Hours", () => {
    expect(calculateOpportunityScore(mockOpportunities[0])).toBe(800);
    expect(calculateOpportunityScore(mockOpportunities[1])).toBe(300);
    expect(calculateOpportunityScore(mockOpportunities[2])).toBe(1200);
  });

  it("sorts opportunities descending by score and recommends top viable pick", () => {
    const result = prioritizeOpportunities(mockOpportunities);

    expect(result.scoredOpportunities[0].id).toBe("opp-3");
    expect(result.scoredOpportunities[0].score).toBe(1200);
    expect(result.scoredOpportunities[1].id).toBe("opp-1");
    expect(result.scoredOpportunities[2].id).toBe("opp-2");

    expect(result.recommendedOpportunity?.id).toBe("opp-3");
    expect(result.recommendationReasonAr).toContain("Gig C - High Retainer");
    expect(result.recommendationReasonAr).toContain("1,200 ج.م/ساعة متوقعة");
  });

  it("handles empty list gracefully without throwing", () => {
    const result = prioritizeOpportunities([]);
    expect(result.scoredOpportunities).toHaveLength(0);
    expect(result.recommendedOpportunity).toBeNull();
  });
});
