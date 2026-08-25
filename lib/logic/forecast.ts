import type { TransactionRow, ProfileRow } from "@/lib/supabase/types";

export interface ForecastScenario {
  name: "conservative" | "base" | "aggressive";
  labelAr: string;
  labelEn: string;
  monthlySavingsPace: number;
  monthsToGoal: number;
  projectedReachDate: string; // YYYY-MM
  projectedBalanceIn12Months: number;
}

export interface FinancialForecastResult {
  currentSavings: number;
  targetGoal: number;
  gap: number;
  historicalAvgMonthlySavings: number;
  conservative: ForecastScenario;
  base: ForecastScenario;
  aggressive: ForecastScenario;
  realityCheckWarning: string | null;
  realityCheckWarningEn: string | null;
}

export function calculateFinancialForecast(params: {
  transactions: TransactionRow[];
  currentSavings: number;
  targetGoal?: number;
  profile?: ProfileRow | null;
}): FinancialForecastResult {
  const { transactions, currentSavings, targetGoal = 250000, profile } = params;

  // Derive comfort or custom target if present in profile settings
  const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
  const marriageGoal = Number(rawSettings.marriageTargetAmount || targetGoal);

  // Group historical savings by month
  const monthlyBalances: Record<string, { income: number; expense: number }> = {};
  for (const t of transactions) {
    const m = t.occurred_on.slice(0, 7);
    if (!monthlyBalances[m]) {
      monthlyBalances[m] = { income: 0, expense: 0 };
    }
    if (t.kind === "income") monthlyBalances[m].income += Number(t.amount || 0);
    if (t.kind === "expense") monthlyBalances[m].expense += Number(t.amount || 0);
  }

  const monthlyNetArray = Object.values(monthlyBalances).map(
    (b) => b.income - b.expense,
  );

  let avgMonthlySavings = 10000; // baseline sensible default if fresh user
  if (monthlyNetArray.length > 0) {
    const sum = monthlyNetArray.reduce((acc, v) => acc + v, 0);
    const calculatedAvg = Math.round(sum / monthlyNetArray.length);
    if (calculatedAvg > 0) {
      avgMonthlySavings = calculatedAvg;
    }
  }

  const gap = Math.max(0, marriageGoal - currentSavings);

  const buildScenario = (
    name: "conservative" | "base" | "aggressive",
    multiplier: number,
    labelAr: string,
    labelEn: string,
  ): ForecastScenario => {
    const pace = Math.max(1000, Math.round(avgMonthlySavings * multiplier));
    const months = pace > 0 ? Math.ceil(gap / pace) : 99;
    const now = new Date();
    const reachDateObj = new Date(now.getFullYear(), now.getMonth() + months, 1);
    const projectedReachDate = `${reachDateObj.getFullYear()}-${String(reachDateObj.getMonth() + 1).padStart(2, "0")}`;
    const projectedBalanceIn12Months = currentSavings + pace * 12;

    return {
      name,
      labelAr,
      labelEn,
      monthlySavingsPace: pace,
      monthsToGoal: months,
      projectedReachDate,
      projectedBalanceIn12Months,
    };
  };

  const conservative = buildScenario("conservative", 0.7, "المتحفظ", "Conservative");
  const base = buildScenario("base", 1.0, "الأساسي", "Base Case");
  const aggressive = buildScenario("aggressive", 1.35, "المتفائل", "Aggressive");

  // Reality Check Warning (§Rule 6)
  let realityCheckWarning: string | null = null;
  let realityCheckWarningEn: string | null = null;

  if (base.monthsToGoal > 12) {
    const monthlyNeededFor12Months = Math.round(gap / 12);
    realityCheckWarning = `بوتيرة الادخار الحالية (${avgMonthlySavings.toLocaleString()} ج.م/شهر)، ستحتاج إلى ${base.monthsToGoal} شهراً للوصول للهدف. لتحقيق هدف الـ 12 شهراً، يلزم رفع الفائض الشهري إلى ${monthlyNeededFor12Months.toLocaleString()} ج.م من خلال زيادة صفقات الفريلانس.`;
    realityCheckWarningEn = `At current savings pace (${avgMonthlySavings.toLocaleString()} EGP/mo), achieving the goal will take ${base.monthsToGoal} months. To hit the 12-month target, monthly surplus needs to reach ${monthlyNeededFor12Months.toLocaleString()} EGP via higher freelance output.`;
  }

  return {
    currentSavings,
    targetGoal: marriageGoal,
    gap,
    historicalAvgMonthlySavings: avgMonthlySavings,
    conservative,
    base,
    aggressive,
    realityCheckWarning,
    realityCheckWarningEn,
  };
}
