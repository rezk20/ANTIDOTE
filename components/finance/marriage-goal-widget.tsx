"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Heart, Sparkles } from "lucide-react";
import type { MarriageGoalMetrics } from "@/lib/logic/finance";

export function MarriageGoalWidget({
  metrics,
}: {
  metrics: MarriageGoalMetrics;
}) {
  const { t, isRtl } = useLocale();

  return (
    <div className="space-y-5 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 p-6 shadow-xs dark:border-rose-950/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-rose-950/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-2xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
              {t.finances.marriageGoal}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {metrics.monthsRemaining}{" "}
              {isRtl
                ? "شهراً متبقياً للموعد المستهدف"
                : "months remaining target"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="rounded-xl bg-rose-100/70 px-3 py-1 text-xs font-black text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            {metrics.progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span>
            {isRtl ? "المحقق في محفظة الزواج:" : "Saved in Marriage Fund:"}{" "}
            <strong className="font-extrabold text-rose-600 dark:text-rose-400">
              {metrics.currentSaved.toLocaleString()} EGP
            </strong>
          </span>
          <span className="text-zinc-400">
            {metrics.targetAmount.toLocaleString()} EGP
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 p-0.5 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-xs transition-all duration-500"
            style={{ width: `${metrics.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-0.5 text-[11px] text-zinc-400">
          <span>
            {t.finances.targetGap}:{" "}
            <strong className="font-bold text-zinc-700 dark:text-zinc-200">
              {metrics.targetGap.toLocaleString()} EGP
            </strong>
          </span>
          {metrics.isCompleted && (
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.finances.goalCompleted}</span>
            </span>
          )}
        </div>
      </div>

      {/* Run-Rates Grid */}
      <div className="grid grid-cols-3 gap-2.5 border-t border-rose-100/70 pt-2 dark:border-zinc-800/80">
        <div className="space-y-0.5 rounded-2xl border border-zinc-100 bg-white/80 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="block truncate text-[10px] font-bold text-zinc-400">
            {t.finances.requiredMonthly}
          </span>
          <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
            {metrics.requiredMonthlySavings.toLocaleString()}
          </span>
          <span className="block text-[9px] text-zinc-400">EGP / month</span>
        </div>

        <div className="space-y-0.5 rounded-2xl border border-zinc-100 bg-white/80 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="block truncate text-[10px] font-bold text-zinc-400">
            {t.finances.requiredWeekly}
          </span>
          <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
            {metrics.requiredWeeklySavings.toLocaleString()}
          </span>
          <span className="block text-[9px] text-zinc-400">EGP / week</span>
        </div>

        <div className="space-y-0.5 rounded-2xl border border-zinc-100 bg-white/80 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="block truncate text-[10px] font-bold text-zinc-400">
            {t.finances.requiredDaily}
          </span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            {metrics.requiredDailySavings.toLocaleString()}
          </span>
          <span className="block text-[9px] text-zinc-400">EGP / day</span>
        </div>
      </div>
    </div>
  );
}
