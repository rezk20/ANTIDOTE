import type {
  TransactionRow,
  BucketRow,
  MarriageExpenseRow,
} from "@/lib/supabase/types";

export interface MonthlyTotals {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}

export function calculateMonthlyTotals(
  transactions: TransactionRow[],
): MonthlyTotals {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of transactions) {
    const amt = Number(t.amount) || 0;
    if (t.kind === "income") {
      totalIncome += amt;
    } else if (t.kind === "expense") {
      totalExpenses += amt;
    }
  }

  const netSavings = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? Math.max(0, (netSavings / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate: Math.round(savingsRate * 10) / 10,
  };
}

export interface ComputedBucket extends BucketRow {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  netChange: number;
  progressPercent: number | null;
  gap: number | null;
}

export function calculateBucketBalances(
  buckets: BucketRow[],
  transactions: TransactionRow[],
): ComputedBucket[] {
  const bucketSums: Record<string, { income: number; expenses: number }> = {};

  for (const b of buckets) {
    bucketSums[b.id] = { income: 0, expenses: 0 };
  }

  for (const t of transactions) {
    if (t.bucket_id && bucketSums[t.bucket_id]) {
      const amt = Number(t.amount) || 0;
      if (t.kind === "income") {
        bucketSums[t.bucket_id].income += amt;
      } else if (t.kind === "expense") {
        bucketSums[t.bucket_id].expenses += amt;
      }
    }
  }

  return buckets.map((bucket) => {
    const sums = bucketSums[bucket.id] || { income: 0, expenses: 0 };
    const starting = Number(bucket.starting_balance) || 0;
    const currentBalance = starting + sums.income - sums.expenses;
    const netChange = sums.income - sums.expenses;
    const target = bucket.target_amount ? Number(bucket.target_amount) : null;

    let progressPercent: number | null = null;
    let gap: number | null = null;

    if (target && target > 0) {
      progressPercent = Math.min(100, Math.max(0, (currentBalance / target) * 100));
      gap = Math.max(0, target - currentBalance);
    }

    return {
      ...bucket,
      totalIncome: sums.income,
      totalExpenses: sums.expenses,
      currentBalance,
      netChange,
      progressPercent:
        progressPercent != null ? Math.round(progressPercent * 10) / 10 : null,
      gap,
    };
  });
}

export interface MarriageGoalMetrics {
  targetAmount: number;
  currentSaved: number;
  targetGap: number;
  progressPercent: number;
  monthsRemaining: number;
  requiredMonthlySavings: number;
  requiredWeeklySavings: number;
  requiredDailySavings: number;
  isCompleted: boolean;
}

export function calculateMarriageGoalMetrics(params: {
  targetAmount?: number;
  currentSaved: number;
  targetMonths?: number;
}): MarriageGoalMetrics {
  const targetAmount = params.targetAmount && params.targetAmount > 0 ? params.targetAmount : 250000;
  const currentSaved = Math.max(0, params.currentSaved);
  const targetGap = Math.max(0, targetAmount - currentSaved);
  const progressPercent =
    targetAmount > 0
      ? Math.min(100, Math.round((currentSaved / targetAmount) * 1000) / 10)
      : 100;
  const monthsRemaining =
    params.targetMonths != null && params.targetMonths > 0
      ? params.targetMonths
      : 12;

  const requiredMonthlySavings =
    targetGap > 0 ? Math.round(targetGap / monthsRemaining) : 0;
  const requiredWeeklySavings =
    requiredMonthlySavings > 0
      ? Math.round(requiredMonthlySavings / 4.33)
      : 0;
  const requiredDailySavings =
    requiredMonthlySavings > 0 ? Math.round(requiredMonthlySavings / 30) : 0;

  return {
    targetAmount,
    currentSaved,
    targetGap,
    progressPercent,
    monthsRemaining,
    requiredMonthlySavings,
    requiredWeeklySavings,
    requiredDailySavings,
    isCompleted: currentSaved >= targetAmount,
  };
}

export interface IncomeTargetProgress {
  min: number;
  comfort: number;
  stretch: number;
  income: number;
  minProgress: number;
  comfortProgress: number;
  stretchProgress: number;
}

export function calculateIncomeTargets(
  income: number,
  targets?: { min?: number; comfort?: number; stretch?: number },
): IncomeTargetProgress {
  const min = targets?.min && targets.min > 0 ? targets.min : 15000;
  const comfort = targets?.comfort && targets.comfort > 0 ? targets.comfort : 30000;
  const stretch = targets?.stretch && targets.stretch > 0 ? targets.stretch : 50000;
  const validIncome = Math.max(0, income);

  return {
    min,
    comfort,
    stretch,
    income: validIncome,
    minProgress: Math.min(100, Math.round((validIncome / min) * 100)),
    comfortProgress: Math.min(100, Math.round((validIncome / comfort) * 100)),
    stretchProgress: Math.min(100, Math.round((validIncome / stretch) * 100)),
  };
}

export interface MarriageExpensesSummary {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remainingToPay: number;
  progressPercent: number;
  itemsCount: number;
  paidCount: number;
}

export function calculateMarriageExpensesSummary(
  expenses: MarriageExpenseRow[],
): MarriageExpensesSummary {
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;
  let paidCount = 0;

  for (const exp of expenses) {
    if (exp.status === "dropped") continue;

    const est = Number(exp.estimated_cost) || 0;
    const act = exp.actual_cost != null ? Number(exp.actual_cost) : est;
    const paid = Number(exp.paid_amount) || 0;

    totalEstimated += est;
    totalActual += act;
    totalPaid += paid;

    if (exp.status === "paid" || (act > 0 && paid >= act)) {
      paidCount++;
    }
  }

  const remainingToPay = Math.max(0, totalActual - totalPaid);
  const progressPercent =
    totalActual > 0
      ? Math.min(100, Math.round((totalPaid / totalActual) * 1000) / 10)
      : 0;

  return {
    totalEstimated,
    totalActual,
    totalPaid,
    remainingToPay,
    progressPercent,
    itemsCount: expenses.filter((e) => e.status !== "dropped").length,
    paidCount,
  };
}
