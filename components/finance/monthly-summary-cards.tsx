"use client";

import { useLocale } from "@/components/providers/locale-provider";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  PiggyBank,
} from "lucide-react";
import type { MonthlyTotals } from "@/lib/logic/finance";

export function MonthlySummaryCards({
  totals,
  incomeCount = 0,
  expenseCount = 0,
}: {
  totals: MonthlyTotals;
  incomeCount?: number;
  expenseCount?: number;
}) {
  const { t, isRtl } = useLocale();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-bold">
          <span>{t.finances.totalIncome}</span>
          <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <ArrowDownLeft className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
          +{totals.totalIncome.toLocaleString()}{" "}
          <span className="text-xs font-semibold text-zinc-400">EGP</span>
        </p>
        <p className="text-[11px] text-zinc-400">
          {incomeCount} {isRtl ? "عمليات إيداع ودخل وارد" : "inflow transactions"}
        </p>
      </div>

      {/* Total Expenses */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-bold">
          <span>{t.finances.totalExpenses}</span>
          <div className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
          -{totals.totalExpenses.toLocaleString()}{" "}
          <span className="text-xs font-semibold text-zinc-400">EGP</span>
        </p>
        <p className="text-[11px] text-zinc-400">
          {expenseCount} {isRtl ? "عمليات صرف ومصروفات" : "outflow transactions"}
        </p>
      </div>

      {/* Net Savings */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-bold">
          <span>{t.finances.netSavings}</span>
          <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <PiggyBank className="h-4 w-4" />
          </div>
        </div>
        <p
          className={`text-2xl font-extrabold ${
            totals.netSavings >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {totals.netSavings >= 0 ? "+" : ""}
          {totals.netSavings.toLocaleString()}{" "}
          <span className="text-xs font-semibold text-zinc-400">EGP</span>
        </p>
        <p className="text-[11px] text-zinc-400">
          {isRtl ? "الفائض الشهري الصافي للادخار" : "Net monthly cash buffer"}
        </p>
      </div>

      {/* Savings Rate */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-bold">
          <span>{t.finances.savingsRate}</span>
          <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          {totals.savingsRate}%
        </p>
        <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mt-1">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, totals.savingsRate)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
