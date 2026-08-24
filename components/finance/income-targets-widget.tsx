"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Target, CheckCircle2 } from "lucide-react";
import type { IncomeTargetProgress } from "@/lib/logic/finance";

export function IncomeTargetsWidget({
  targets,
}: {
  targets: IncomeTargetProgress;
}) {
  const { t, isRtl } = useLocale();

  return (
    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
              {t.finances.incomeTargets}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {isRtl ? "مستويات الدخل الشهري المستهدفة" : "Monthly revenue progression thresholds"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            {targets.income.toLocaleString()} EGP
          </span>
          <span className="text-[10px] text-zinc-400 block font-medium">
            {isRtl ? "المحقق هذا الشهر" : "Actual Month"}
          </span>
        </div>
      </div>

      {/* Target Progress Bars */}
      <div className="space-y-3.5 pt-1">
        {/* Min Tier (15k) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <span>{t.finances.minIncome}</span>
              {targets.minProgress >= 100 && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </span>
            <span className="font-bold">
              {targets.min.toLocaleString()} EGP ({targets.minProgress}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${targets.minProgress}%` }}
            />
          </div>
        </div>

        {/* Comfort Tier (30k) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <span>{t.finances.comfortIncome}</span>
              {targets.comfortProgress >= 100 && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </span>
            <span className="font-bold">
              {targets.comfort.toLocaleString()} EGP ({targets.comfortProgress}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${targets.comfortProgress}%` }}
            />
          </div>
        </div>

        {/* Stretch Tier (50k) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <span>{t.finances.stretchIncome}</span>
              {targets.stretchProgress >= 100 && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </span>
            <span className="font-bold">
              {targets.stretch.toLocaleString()} EGP ({targets.stretchProgress}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${targets.stretchProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
