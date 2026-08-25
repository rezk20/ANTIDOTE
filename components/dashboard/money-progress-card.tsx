"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { Heart, ArrowRight } from "lucide-react";
import type { FinanceSummaryData } from "@/lib/dal/finance";

export function MoneyProgressCard({
  financeSummary,
}: {
  financeSummary: FinanceSummaryData;
}) {
  const { t, isRtl } = useLocale();
  const marriage = financeSummary.marriageGoal;
  const totals = financeSummary.monthlyTotals;

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t.dashboard.moneyCardTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.dashboard.moneyCardSubtitle}
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            {marriage.progressPercent}%
          </span>
        </div>

        {/* Marriage Goal Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>
              {isRtl ? "المحقق في محفظة الزواج:" : "Saved in Marriage Fund:"}{" "}
              <strong className="font-extrabold text-rose-600 dark:text-rose-400">
                {marriage.currentSaved.toLocaleString()} EGP
              </strong>
            </span>
            <span className="text-zinc-400">
              {marriage.targetAmount.toLocaleString()} EGP
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-rose-500 transition-all duration-500"
              style={{ width: `${marriage.progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-zinc-400">
            {t.finances.targetGap}:{" "}
            <span className="font-bold text-zinc-700 dark:text-zinc-300">
              {marriage.targetGap.toLocaleString()} EGP
            </span>
          </p>
        </div>

        {/* 2 Mini Stats: Required This Month & Total Month Income */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-0.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800">
            <span className="block truncate text-[10px] font-bold text-zinc-400">
              {t.finances.requiredMonthly}
            </span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400">
              {marriage.requiredMonthlySavings.toLocaleString()} EGP
            </span>
          </div>

          <div className="space-y-0.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800">
            <span className="block truncate text-[10px] font-bold text-zinc-400">
              {isRtl ? "دخل هذا الشهر" : "Month Revenue"}
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              +{totals.totalIncome.toLocaleString()} EGP
            </span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
        <Link
          href="/finances"
          className="flex items-center justify-between text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>{t.dashboard.viewFinances}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
