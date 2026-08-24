import { describe, it, expect } from "vitest";
import {
  calculateMonthlyTotals,
  calculateBucketBalances,
  calculateMarriageGoalMetrics,
  calculateIncomeTargets,
  calculateMarriageExpensesSummary,
} from "@/lib/logic/finance";
import { transactionSchema } from "@/lib/schemas/finance";
import type {
  TransactionRow,
  BucketRow,
  MarriageExpenseRow,
} from "@/lib/supabase/types";

describe("Finance Logic & Wallet Math", () => {
  describe("transactionSchema validation", () => {
    it("accepts valid transaction input with empty optional strings & UUIDs", () => {
      const input = {
        amount: "5000",
        kind: "income",
        category: "freelance",
        occurred_on: "2026-08-24",
        source: "",
        project_id: "",
        lead_id: "",
        bucket_id: "",
        note: "",
        is_recurring: "false",
        currency: "EGP",
      };

      const parsed = transactionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.amount).toBe(5000);
        expect(parsed.data.kind).toBe("income");
        expect(parsed.data.source).toBeNull();
        expect(parsed.data.project_id).toBeNull();
        expect(parsed.data.lead_id).toBeNull();
        expect(parsed.data.bucket_id).toBeNull();
        expect(parsed.data.note).toBeNull();
        expect(parsed.data.is_recurring).toBe(false);
      }
    });

    it("rejects non-positive amount or invalid dates", () => {
      const invalid = {
        amount: "-100",
        kind: "income",
        category: "freelance",
        occurred_on: "invalid-date",
      };

      const parsed = transactionSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("calculateMonthlyTotals", () => {
    it("calculates income, expenses, net savings and savings rate accurately", () => {
      const transactions = [
        { amount: 15000, kind: "income" },
        { amount: 10000, kind: "income" },
        { amount: 5000, kind: "expense" },
        { amount: 2500, kind: "expense" },
      ] as TransactionRow[];

      const result = calculateMonthlyTotals(transactions);
      expect(result.totalIncome).toBe(25000);
      expect(result.totalExpenses).toBe(7500);
      expect(result.netSavings).toBe(17500);
      expect(result.savingsRate).toBe(70); // (17500/25000) * 100
    });

    it("handles zero income gracefully without dividing by zero", () => {
      const transactions = [
        { amount: 3000, kind: "expense" },
      ] as TransactionRow[];

      const result = calculateMonthlyTotals(transactions);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(3000);
      expect(result.netSavings).toBe(-3000);
      expect(result.savingsRate).toBe(0);
    });
  });

  describe("calculateBucketBalances", () => {
    it("computes starting balance plus incomes minus expenses for each bucket", () => {
      const buckets = [
        {
          id: "b-marriage",
          name: "Marriage",
          kind: "marriage",
          starting_balance: 18000,
          target_amount: 250000,
          is_active: true,
        },
        {
          id: "b-emergency",
          name: "Emergency",
          kind: "emergency",
          starting_balance: 5000,
          target_amount: 20000,
          is_active: true,
        },
      ] as BucketRow[];

      const transactions = [
        { amount: 10000, kind: "income", bucket_id: "b-marriage" },
        { amount: 2000, kind: "expense", bucket_id: "b-marriage" },
        { amount: 1000, kind: "expense", bucket_id: "b-emergency" },
        { amount: 5000, kind: "income", bucket_id: null }, // no bucket
      ] as TransactionRow[];

      const computed = calculateBucketBalances(buckets, transactions);

      const marriage = computed.find((b) => b.id === "b-marriage")!;
      expect(marriage.totalIncome).toBe(10000);
      expect(marriage.totalExpenses).toBe(2000);
      expect(marriage.currentBalance).toBe(26000); // 18000 + 10000 - 2000
      expect(marriage.netChange).toBe(8000);
      expect(marriage.gap).toBe(224000); // 250000 - 26000
      expect(marriage.progressPercent).toBe(10.4); // 26000 / 250000

      const emergency = computed.find((b) => b.id === "b-emergency")!;
      expect(emergency.currentBalance).toBe(4000); // 5000 - 1000
      expect(emergency.gap).toBe(16000);
    });
  });

  describe("calculateMarriageGoalMetrics", () => {
    it("calculates 250k goal gap, required monthly run-rate, and remaining time", () => {
      const metrics = calculateMarriageGoalMetrics({
        targetAmount: 250000,
        currentSaved: 26000,
        targetMonths: 12,
      });

      expect(metrics.targetAmount).toBe(250000);
      expect(metrics.currentSaved).toBe(26000);
      expect(metrics.targetGap).toBe(224000);
      expect(metrics.progressPercent).toBe(10.4);
      expect(metrics.requiredMonthlySavings).toBe(18667); // 224000 / 12
      expect(metrics.requiredWeeklySavings).toBe(4311); // 18667 / 4.33
      expect(metrics.requiredDailySavings).toBe(622); // 18667 / 30
      expect(metrics.isCompleted).toBe(false);
    });

    it("handles zero remaining months or fully completed goal safely", () => {
      const completed = calculateMarriageGoalMetrics({
        targetAmount: 250000,
        currentSaved: 260000,
        targetMonths: 0,
      });

      expect(completed.targetGap).toBe(0);
      expect(completed.progressPercent).toBe(100);
      expect(completed.requiredMonthlySavings).toBe(0);
      expect(completed.isCompleted).toBe(true);
    });
  });

  describe("calculateIncomeTargets", () => {
    it("calculates progression percentages towards Min, Comfort, and Stretch tiers", () => {
      const result = calculateIncomeTargets(22500, {
        min: 15000,
        comfort: 30000,
        stretch: 50000,
      });

      expect(result.minProgress).toBe(100); // 22.5k >= 15k
      expect(result.comfortProgress).toBe(75); // 22.5k / 30k = 75%
      expect(result.stretchProgress).toBe(45); // 22.5k / 50k = 45%
    });
  });

  describe("calculateMarriageExpensesSummary", () => {
    it("aggregates estimated, actual, paid costs and ignores dropped items", () => {
      const expenses = [
        {
          item: "Bedroom Furniture",
          estimated_cost: 60000,
          actual_cost: 65000,
          paid_amount: 30000,
          status: "in_progress",
        },
        {
          item: "Hall Reservation",
          estimated_cost: 40000,
          actual_cost: 40000,
          paid_amount: 40000,
          status: "paid",
        },
        {
          item: "Cancelled Decor",
          estimated_cost: 15000,
          actual_cost: 15000,
          paid_amount: 0,
          status: "dropped",
        },
      ] as MarriageExpenseRow[];

      const summary = calculateMarriageExpensesSummary(expenses);
      expect(summary.totalEstimated).toBe(100000); // 60k + 40k (excludes dropped)
      expect(summary.totalActual).toBe(105000); // 65k + 40k
      expect(summary.totalPaid).toBe(70000); // 30k + 40k
      expect(summary.remainingToPay).toBe(35000); // 105k - 70k
      expect(summary.progressPercent).toBe(66.7);
      expect(summary.itemsCount).toBe(2);
      expect(summary.paidCount).toBe(1);
    });
  });
});
