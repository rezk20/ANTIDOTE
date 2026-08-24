"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Target, Send, PhoneCall, TrendingUp } from "lucide-react";
import type { SalesActivityMetrics } from "@/lib/logic/sales-metrics";

export function SalesTargetsWidget({
  metrics,
}: {
  metrics: SalesActivityMetrics;
}) {
  const { t, isRtl } = useLocale();

  return (
    <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              {t.leads.salesTargets}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {isRtl ? "متابعة وتيرة التواصل الأسبوعية واليومية" : "Track daily touchpoints & weekly proposals"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span>{metrics.totalTouchesThisWeek} {isRtl ? "تفاعل هذا الأسبوع" : "Touches"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Weekly Proposals Progress */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Send className="h-3.5 w-3.5 text-blue-500" />
              <span>{t.leads.weeklyProposals}</span>
            </span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">
              {metrics.proposalsThisWeek} / {metrics.proposalsTarget}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.proposalsPercent}%` }}
            />
          </div>
        </div>

        {/* Daily Outreach Touches */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-emerald-500" />
              <span>{t.leads.dailyOutreach}</span>
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {metrics.outreachToday} / {metrics.outreachTarget}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${metrics.outreachPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
