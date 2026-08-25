import { describe, it, expect } from "vitest";
import {
  dimensionScoresSchema,
  weeklyReviewAnswersSchema,
  weeklyReviewFormSchema,
} from "@/lib/schemas/reviews";
import {
  calculateOverallBalance,
  formatScoreToPercentage,
  getScoreColor,
} from "@/lib/logic/review-metrics";

describe("Reviews Schema Validation", () => {
  it("validates 6 dimension scores within range 1 to 5", () => {
    const validScores = {
      revenue: 5,
      career: 4,
      financial: 3,
      relationship: 4,
      execution: 5,
      routine: 3,
    };

    const parsed = dimensionScoresSchema.safeParse(validScores);
    expect(parsed.success).toBe(true);
  });

  it("rejects dimension score out of range (< 1 or > 5)", () => {
    const invalidScoresLow = {
      revenue: 0,
      career: 3,
      financial: 3,
      relationship: 3,
      execution: 3,
      routine: 3,
    };
    const invalidScoresHigh = {
      revenue: 6,
      career: 3,
      financial: 3,
      relationship: 3,
      execution: 3,
      routine: 3,
    };

    expect(dimensionScoresSchema.safeParse(invalidScoresLow).success).toBe(false);
    expect(dimensionScoresSchema.safeParse(invalidScoresHigh).success).toBe(false);
  });

  it("validates all 13 weekly review question answers with defaults", () => {
    const parsed = weeklyReviewAnswersSchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.q_wins).toBe("");
      expect(parsed.data.q_misses).toBe("");
      expect(parsed.data.q_start).toBe("");
      expect(parsed.data.q_stop).toBe("");
      expect(parsed.data.q_continue).toBe("");
      expect(parsed.data.q_next_top_three).toBe("");
      expect(parsed.data.q_system_tweak).toBe("");
    }
  });

  it("validates full weekly review form schema with valid date formatting", () => {
    const validForm = {
      period_start: "2026-08-18",
      period_end: "2026-08-24",
      scores: {
        revenue: 4,
        career: 4,
        financial: 5,
        relationship: 4,
        execution: 4,
        routine: 3,
      },
      answers: {
        q_wins: "Landed new client",
        q_misses: "Missed 1 gym session",
        q_revenue_reflection: "Hit 45k target",
        q_time_drain: "Discord notifications",
        q_client_health: "Delivery on schedule",
        q_learning_growth: "Mastered Next 16 Turbopack",
        q_relationship_check: "Had great dinner date",
        q_habits_energy: "Sleep average 7.5 hours",
        q_start: "Start morning deep work",
        q_stop: "Stop late night scrolling",
        q_continue: "Daily shutdown ritual",
        q_next_top_three: "1. Ship MVP\n2. Transfer savings\n3. 3 outreach calls",
        q_system_tweak: "Protect Friday 3 PM for review",
      },
    };

    const parsed = weeklyReviewFormSchema.safeParse(validForm);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid date format in weekly review form", () => {
    const invalidForm = {
      period_start: "18-08-2026", // Invalid format
      period_end: "2026-08-24",
      scores: {
        revenue: 3,
        career: 3,
        financial: 3,
        relationship: 3,
        execution: 3,
        routine: 3,
      },
      answers: {},
    };

    const parsed = weeklyReviewFormSchema.safeParse(invalidForm);
    expect(parsed.success).toBe(false);
  });
});

describe("Reviews Metrics & Balance Calculation Logic", () => {
  it("correctly calculates average overall balance score out of 5.0", () => {
    const scores = {
      revenue: 4,
      career: 4,
      financial: 4,
      relationship: 4,
      execution: 4,
      routine: 4,
    };
    expect(calculateOverallBalance(scores)).toBe(4.0);

    const mixedScores = {
      revenue: 5,
      career: 4,
      financial: 3,
      relationship: 5,
      execution: 4,
      routine: 3,
    };
    // Sum = 24, Avg = 24 / 6 = 4.0
    expect(calculateOverallBalance(mixedScores)).toBe(4.0);
  });

  it("converts 1-5 score to percentage correctly", () => {
    expect(formatScoreToPercentage(5)).toBe(100);
    expect(formatScoreToPercentage(4)).toBe(80);
    expect(formatScoreToPercentage(3)).toBe(60);
    expect(formatScoreToPercentage(2.5)).toBe(50);
    expect(formatScoreToPercentage(1)).toBe(20);
  });

  it("returns appropriate color tokens based on score thresholds", () => {
    expect(getScoreColor(4.8)).toContain("emerald");
    expect(getScoreColor(3.8)).toContain("blue");
    expect(getScoreColor(2.8)).toContain("amber");
    expect(getScoreColor(1.8)).toContain("rose");
  });
});
