"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { DailyLogWidget } from "@/components/today/daily-log-widget";
import { DeepWorkTimer } from "@/components/today/deep-work-timer";
import type { DailyLogRow, RoutineRow, TaskRow } from "@/lib/supabase/types";
import type { CapacityAdvice } from "@/lib/logic/daily-log";
import type { WeeklyTimeDistribution } from "@/lib/logic/time-tracking";
import {
  Zap,
  Moon,
  Clock,
  BatteryCharging,
  RotateCcw,
} from "lucide-react";

interface EnergyViewProps {
  dailyLog: DailyLogRow | null;
  recentLogs: DailyLogRow[];
  capacityAdvice: CapacityAdvice;
  weeklyTimeDistribution: WeeklyTimeDistribution;
  routines: RoutineRow[];
  todayTasks: TaskRow[];
  selectedDate: string;
}

export function EnergyView({
  dailyLog,
  recentLogs,
  capacityAdvice,
  weeklyTimeDistribution,
  routines,
  todayTasks,
  selectedDate,
}: EnergyViewProps) {
  const { isRtl } = useLocale();

  // Compute average sleep and energy from recent 7 logs
  const validRecentLogs = recentLogs.slice(0, 7);
  const avgSleep =
    validRecentLogs.length > 0
      ? (
          validRecentLogs.reduce(
            (sum, l) => sum + (l.hours_slept ? Number(l.hours_slept) : 7),
            0,
          ) / validRecentLogs.length
        ).toFixed(1)
      : "7.0";

  const avgEnergy =
    validRecentLogs.length > 0
      ? (
          validRecentLogs.reduce((sum, l) => sum + (l.energy || 4), 0) /
          validRecentLogs.length
        ).toFixed(1)
      : "4.0";

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {isRtl ? "مؤشرات الطاقة والبيوريثم" : "Energy & Bio-Rhythms"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                Wellness & Focus
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isRtl
                ? "تتبع جودة النوم، تقييم الطاقة اليومية، مؤقت جلسات العمل العميق، وتحليل توزيع الوقت الأسبوعي."
                : "Sleep tracking, daily energy calibrations, deep work timer sessions, and weekly time distributions."}
            </p>
          </div>
        </div>

        {/* Quick 7-Day Stats Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-2.5">
            <Moon className="h-4 w-4 text-purple-500" />
            <div>
              <span className="text-[10px] font-bold text-zinc-400 block">
                {isRtl ? "متوسط النوم (7 أيام)" : "Avg Sleep (7d)"}
              </span>
              <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                {avgSleep} {isRtl ? "ساعات" : "hrs"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-2.5">
            <BatteryCharging className="h-4 w-4 text-emerald-500" />
            <div>
              <span className="text-[10px] font-bold text-zinc-400 block">
                {isRtl ? "متوسط الطاقة" : "Avg Energy"}
              </span>
              <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                {avgEnergy} / 5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sleep & Energy Check-in Widget */}
      <DailyLogWidget
        initialLog={dailyLog}
        advice={capacityAdvice}
        todayDate={selectedDate}
      />

      {/* 3. Deep Work Timer & Time Tracking Session */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {isRtl ? "مؤقت العمل العميق والتركيز (Deep Work Focus Session)" : "Deep Work Focus Session"}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-zinc-400">
            {isRtl ? "جلسات بومودورو وساعة إيقاف مع تسجيل فوري" : "Pomodoro & Stopwatch tracking"}
          </span>
        </div>

        <DeepWorkTimer
          plannedTasks={todayTasks}
          weeklyDistribution={weeklyTimeDistribution}
        />
      </div>

      {/* 4. Active Routines Quick Flow */}
      {routines && routines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-purple-500" />
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {isRtl ? "الروتينات اليومية النشطة" : "Active Daily Routines"}
              </h2>
            </div>
            <a
              href="/routines"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              {isRtl ? "إدارة وتعديل الروتينات ←" : "Manage Routines →"}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {routines.map((routine) => {
              const items = Array.isArray(routine.items) ? routine.items : [];
              return (
                <div
                  key={routine.id}
                  className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                      {routine.time_of_day}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {items.length} {isRtl ? "بنود" : "items"}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {routine.name}
                  </h3>

                  <div className="space-y-1.5 pt-1">
                    {items.slice(0, 3).map((it: unknown, idx: number) => {
                      const itemObj = it as { title?: string; duration_min?: number };
                      return (
                        <div
                          key={idx}
                          className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 flex items-center justify-between"
                        >
                          <span className="truncate">• {itemObj.title || "بند"}</span>
                          {itemObj.duration_min && (
                            <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                              {itemObj.duration_min}m
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
