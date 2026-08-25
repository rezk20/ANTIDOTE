"use client";

import Link from "next/link";
import { TopThreeCard } from "./top-three-card";
import { MoneyProgressCard } from "./money-progress-card";
import { RevenueActionCard } from "./revenue-action-card";
import { ClientFollowupCard } from "./client-followup-card";
import { QuickDumpCard } from "./quick-dump-card";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Sun,
  Clock,
  BatteryCharging,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { DashboardSummaryData } from "@/lib/dal/day-plan";

export function DashboardView({
  data,
}: {
  data: DashboardSummaryData;
}) {
  const { t, isRtl } = useLocale();

  const ownerName = data.profile?.display_name || "Ahmed";

  // Time-of-day greeting
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? t.dashboard.greetingMorning
      : currentHour < 17
        ? t.dashboard.greetingAfternoon
        : t.dashboard.greetingEvening;

  // Formatted date
  const [y, m, d] = data.todayDate.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d, 12, 0, 0);
  const formattedDate = dateObj.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shutdownTimeStr = data.dayPlan?.shutdown_time || "18:00";

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Good Morning Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Sun className="h-5 w-5" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {t.dashboard.vitalFocus}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {greeting}, {ownerName} 👋
            </h1>

            <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {t.dashboard.commandSubtitle}
            </p>
          </div>

          {/* Quick Vital Status Chips */}
          <div className="flex items-center gap-2 flex-wrap sm:justify-end">
            {data.isFriday && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.todayPlan.fridayRule}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs font-bold">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span>
                {t.dashboard.shutdownCountdown}: {shutdownTimeStr.slice(0, 5)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs font-bold">
              <BatteryCharging className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                {data.capacity.totalPlannedHours}h / {data.capacity.availableHours}h
              </span>
            </div>
          </div>
        </div>

        {/* Date line */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold">{formattedDate}</span>
          <Link
            href="/today"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{t.dashboard.viewTodayPlan}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* The 5 Focused Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Top 3 Execution Priorities */}
        <TopThreeCard topThreeTasks={data.topThreeTasks} />

        {/* Card 2: Marriage Fund & Money */}
        <MoneyProgressCard financeSummary={data.financeSummary} />

        {/* Card 3: Today's Revenue Action */}
        <RevenueActionCard task={data.revenueActionTask} />

        {/* Card 4: Next Client Follow-Up */}
        <ClientFollowupCard lead={data.nextFollowupLead} />

        {/* Card 5: Quick Brain Dump */}
        <QuickDumpCard inboxCount={data.brainDumpsCount} />
      </div>
    </div>
  );
}
