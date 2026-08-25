import { cache } from "react";
import { verifySession } from "./auth";
import { getBuckets, getTransactions, getMarriageExpenses } from "./finance";
import { calculateBucketBalances, calculateMarriageGoalMetrics, calculateMarriageExpensesSummary } from "@/lib/logic/finance";
import { evaluateMarriageReadiness, type MarriageReadinessAssessment } from "@/lib/logic/marriage";
import type { MarriageExpenseRow } from "@/lib/supabase/types";
import type { MarriageGoalMetrics, MarriageExpensesSummary } from "@/lib/logic/finance";

export { getMarriageExpenses };

export interface MarriagePageData {
  goalMetrics: MarriageGoalMetrics;
  expensesSummary: MarriageExpensesSummary;
  expenses: MarriageExpenseRow[];
  readiness: MarriageReadinessAssessment;
}

export const getMarriageDashboardData = cache(
  async (): Promise<MarriagePageData> => {
    await verifySession();
    const [buckets, txs, expenses] = await Promise.all([
      getBuckets(),
      getTransactions(),
      getMarriageExpenses(),
    ]);

    const computedBuckets = calculateBucketBalances(buckets, txs);
    const marriageBucket = computedBuckets.find((b) => b.kind === "marriage");
    const emergencyBucket = computedBuckets.find((b) => b.kind === "emergency");

    const savedAmount = marriageBucket ? marriageBucket.currentBalance : 18000;
    const targetAmount = marriageBucket?.target_amount ? Number(marriageBucket.target_amount) : 250000;

    const goalMetrics = calculateMarriageGoalMetrics({
      targetAmount,
      currentSaved: savedAmount,
      targetMonths: 12,
    });

    const expensesSummary = calculateMarriageExpensesSummary(expenses);

    const readiness = evaluateMarriageReadiness({
      targetAmount,
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
    };
  },
);
