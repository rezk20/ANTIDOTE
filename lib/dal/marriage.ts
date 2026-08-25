import { cache } from "react";
import { verifySession, getProfile } from "./auth";
import { getBuckets, getTransactions, getMarriageExpenses } from "./finance";
import {
  calculateBucketBalances,
  calculateMarriageGoalMetrics,
  calculateMarriageExpensesSummary,
} from "@/lib/logic/finance";
import {
  evaluateMarriageReadiness,
  type MarriageReadinessAssessment,
} from "@/lib/logic/marriage";
import type { MarriageExpenseRow } from "@/lib/supabase/types";
import type {
  MarriageGoalMetrics,
  MarriageExpensesSummary,
} from "@/lib/logic/finance";

export { getMarriageExpenses };

export interface MarriagePageData {
  goalMetrics: MarriageGoalMetrics;
  expensesSummary: MarriageExpensesSummary;
  expenses: MarriageExpenseRow[];
  readiness: MarriageReadinessAssessment;
  targetBudget: number;
  targetDate: string;
}

export const getMarriageDashboardData = cache(
  async (): Promise<MarriagePageData> => {
    await verifySession();
    const [profile, buckets, txs, expenses] = await Promise.all([
      getProfile(),
      getBuckets(),
      getTransactions(),
      getMarriageExpenses(),
    ]);

    const computedBuckets = calculateBucketBalances(buckets, txs);
    const marriageBucket = computedBuckets.find((b) => b.kind === "marriage");
    const emergencyBucket = computedBuckets.find((b) => b.kind === "emergency");

    const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
    const marriageSettings = (rawSettings.marriage ?? {}) as Record<
      string,
      unknown
    >;

    const targetBudget =
      Number(marriageSettings.targetBudget) ||
      Number(marriageBucket?.target_amount) ||
      250000;

    const targetDate = (marriageSettings.targetDate as string) || "2027-12-31";

    // Dynamically calculate months remaining to target date
    const now = new Date();
    const target = new Date(targetDate);
    const diffMonths = Math.max(
      1,
      (target.getFullYear() - now.getFullYear()) * 12 +
        (target.getMonth() - now.getMonth()),
    );
    const targetMonths = isNaN(diffMonths) ? 12 : diffMonths;

    // Saved amount calculation: current balance of marriage bucket or total paid expenses
    const paidExpensesTotal = expenses.reduce(
      (acc, curr) => acc + Number(curr.paid_amount || 0),
      0,
    );
    const savedAmount = marriageBucket
      ? Math.max(marriageBucket.currentBalance, paidExpensesTotal)
      : paidExpensesTotal;

    const goalMetrics = calculateMarriageGoalMetrics({
      targetAmount: targetBudget,
      currentSaved: savedAmount,
      targetMonths,
    });

    const expensesSummary = calculateMarriageExpensesSummary(expenses);

    const readiness = evaluateMarriageReadiness({
      targetAmount: targetBudget,
      savedAmount,
      expenses,
      emergencyBucket,
      hasRecentCheckin: true,
    });

    return {
      goalMetrics,
      expensesSummary,
      expenses,
      readiness,
      targetBudget,
      targetDate,
    };
  },
);
