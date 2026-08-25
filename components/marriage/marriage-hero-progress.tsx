"use client";

import { useLocale } from "@/components/providers/locale-provider";
import type { MarriageGoalMetrics } from "@/lib/logic/finance";
import {
  Heart,
  PiggyBank,
  Calendar,
  TrendingUp,
  Sparkles,
  Edit3,
} from "lucide-react";

interface MarriageHeroProgressProps {
  metrics: MarriageGoalMetrics;
  onEditTarget?: () => void;
}

export function MarriageHeroProgress({ metrics, onEditTarget }: MarriageHeroProgressProps) {
  const { t, isRtl } = useLocale();

  return (
    <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-rose-200 dark:border-rose-900/40 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>مهمة الزواج — مستهدف {metrics.targetAmount.toLocaleString()} ج.م</span>
            </span>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              ({metrics.monthsRemaining} {t.marriagePage.monthsRemaining})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {metrics.isCompleted
              ? "🎉 مبارك! تم استكمال مستهدف صندوق الزواج بالكامل!"
              : `المدخر الحالي: ${metrics.currentSaved.toLocaleString()} ج.م من أصل ${metrics.targetAmount.toLocaleString()} ج.م`}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {onEditTarget && (
            <button
              onClick={onEditTarget}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-white/80 dark:bg-zinc-900/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold text-rose-700 dark:text-rose-300 transition-all cursor-pointer shadow-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isRtl ? "تعديل المستهدف والتاريخ" : "Edit Target & Date"}</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-xs">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <div>
              <div className="text-[10px] font-bold text-zinc-400">نسبة الإنجاز</div>
              <div className="text-base font-black text-rose-600 dark:text-rose-400">
                {metrics.progressPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-rose-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-rose-200 dark:border-rose-900/30">
          <div
            className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${metrics.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
          <span>0 ج.م</span>
          <span className="text-rose-600 dark:text-rose-400">
            المتبقي: {metrics.targetGap.toLocaleString()} ج.م
          </span>
          <span>{metrics.targetAmount.toLocaleString()} ج.م</span>
        </div>
      </div>

      {/* 3 Metric Cards: Required Monthly / Weekly / Daily */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>{t.marriagePage.monthlyNeeded}</span>
          </div>
          <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            {metrics.requiredMonthlySavings.toLocaleString()} ج.م / شهر
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>{t.marriagePage.weeklyNeeded}</span>
          </div>
          <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            {metrics.requiredWeeklySavings.toLocaleString()} ج.م / أسبوع
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
            <PiggyBank className="h-4 w-4 text-amber-500" />
            <span>{t.marriagePage.dailyNeeded}</span>
          </div>
          <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            {metrics.requiredDailySavings.toLocaleString()} ج.م / يوم
          </p>
        </div>
      </div>
    </div>
  );
}
