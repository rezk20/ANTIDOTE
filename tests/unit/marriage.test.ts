import { describe, it, expect } from "vitest";
import {
  marriageExpenseFormSchema,
  recordPaymentSchema,
} from "@/lib/schemas/marriage";
import { evaluateMarriageReadiness } from "@/lib/logic/marriage";
import { calculateMarriageGoalMetrics } from "@/lib/logic/finance";
import type { MarriageExpenseRow } from "@/lib/supabase/types";

describe("Marriage Schemas & Logic", () => {
  describe("marriageExpenseFormSchema", () => {
    it("validates a valid marriage expense item", () => {
      const valid = {
        item: "غرفة نوم ماستر",
        category: "furniture",
        estimated_cost: 45000,
        actual_cost: 42000,
        paid_amount: 15000,
        deadline: "2026-11-30",
        priority: "high",
        status: "in_progress",
        notes: "تم الاتفاق مع المعرض على دفعتين",
      };
      const result = marriageExpenseFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects empty item name", () => {
      const invalid = {
        item: "",
        category: "appliances",
        estimated_cost: 10000,
      };
      const result = marriageExpenseFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("validates record payment schema", () => {
      const valid = {
        expense_id: "123e4567-e89b-12d3-a456-426614174000",
        amount: 5000,
      };
      const result = recordPaymentSchema.safeParse(valid);
      expect(result.success).toBe(true);

      const invalid = {
        expense_id: "123e4567-e89b-12d3-a456-426614174000",
        amount: -500,
      };
      expect(recordPaymentSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("evaluateMarriageReadiness", () => {
    it("evaluates 7 holistic dimensions and overall score correctly", () => {
      const sampleExpenses: MarriageExpenseRow[] = [
        {
          id: "1",
          user_id: "u1",
          item: "مقدم الشقة",
          category: "rent_deposit",
          estimated_cost: 20000,
          actual_cost: 20000,
          paid_amount: 20000,
          deadline: "2026-10-01",
          priority: "critical",
          status: "paid",
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_id: "u1",
          item: "غرفة النوم",
          category: "furniture",
          estimated_cost: 40000,
          actual_cost: null,
          paid_amount: 20000,
          deadline: "2026-12-01",
          priority: "high",
          status: "in_progress",
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const assessment = evaluateMarriageReadiness({
        targetAmount: 250000,
        savedAmount: 50000,
        expenses: sampleExpenses,
        emergencyBucket: {
          id: "b1",
          user_id: "u1",
          name: "صندوق الطوارئ",
          kind: "emergency",
          target_amount: 15000,
          starting_balance: 15000,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        hasRecentCheckin: true,
      });

      expect(assessment.dimensions.length).toBe(7);
      expect(assessment.overallScore).toBeGreaterThan(0);
      expect(assessment.overallScore).toBeLessThanOrEqual(100);

      const housingDim = assessment.dimensions.find((d) => d.id === "housing");
      expect(housingDim?.progressPercent).toBe(100);

      const furnitureDim = assessment.dimensions.find((d) => d.id === "furniture");
      expect(furnitureDim?.progressPercent).toBe(50);

      expect(assessment.antiChaosTip.length).toBeGreaterThan(10);
    });
  });

  describe("calculateMarriageGoalMetrics with dynamic targets", () => {
    it("dynamically computes metrics for custom target budget and months", () => {
      const customMetrics = calculateMarriageGoalMetrics({
        targetAmount: 360000,
        currentSaved: 120000,
        targetMonths: 18,
      });

      expect(customMetrics.targetAmount).toBe(360000);
      expect(customMetrics.currentSaved).toBe(120000);
      expect(customMetrics.targetGap).toBe(240000);
      expect(customMetrics.progressPercent).toBe(33.3);
      expect(customMetrics.monthsRemaining).toBe(18);
      expect(customMetrics.requiredMonthlySavings).toBe(13333);
      expect(customMetrics.isCompleted).toBe(false);
    });

    it("marks completion when currentSaved >= targetAmount", () => {
      const completedMetrics = calculateMarriageGoalMetrics({
        targetAmount: 300000,
        currentSaved: 310000,
        targetMonths: 6,
      });

      expect(completedMetrics.isCompleted).toBe(true);
      expect(completedMetrics.targetGap).toBe(0);
      expect(completedMetrics.progressPercent).toBe(100);
      expect(completedMetrics.requiredMonthlySavings).toBe(0);
    });
  });
});
