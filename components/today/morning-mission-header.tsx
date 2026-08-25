"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDayPlan } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Sun,
  BatteryCharging,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Target,
} from "lucide-react";
import type { DayPlanRow } from "@/lib/supabase/types";
import type { DayPlanCapacityResult } from "@/lib/logic/day-plan";

export function MorningMissionHeader({
  dayPlan,
  capacity,
  isFriday,
  selectedDate,
  onSaveSuccess,
}: {
  dayPlan: DayPlanRow | null;
  capacity: DayPlanCapacityResult;
  isFriday: boolean;
  selectedDate: string;
  onSaveSuccess?: () => void;
}) {
  const router = useRouter();
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const [availableHours, setAvailableHours] = useState<number>(() =>
    dayPlan ? Number(dayPlan.available_hours) : capacity.availableHours || 6.0,
  );
  const [energy, setEnergy] = useState<number>(() =>
    dayPlan ? dayPlan.energy : 3,
  );

  // Date calculations
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().slice(0, 10);

  const [y, m, d] = selectedDate.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d, 12, 0, 0);

  const formattedDate = dateObj.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isToday = selectedDate === todayStr;
  const isFuture = selectedDate > todayStr;

  // Helpers to navigate relative dates
  const changeDateByOffset = (offsetDays: number) => {
    const next = new Date(dateObj);
    next.setDate(next.getDate() + offsetDays);
    const nextStr = next.toISOString().slice(0, 10);
    router.push(`/today?date=${nextStr}`);
  };

  const getTomorrowStr = () => {
    const tom = new Date(todayObj);
    tom.setDate(tom.getDate() + 1);
    return tom.toISOString().slice(0, 10);
  };

  const getDayAfterStr = () => {
    const da = new Date(todayObj);
    da.setDate(da.getDate() + 2);
    return da.toISOString().slice(0, 10);
  };

  const tomorrowStr = getTomorrowStr();
  const dayAfterStr = getDayAfterStr();

  function handleSaveSettings(newHours?: number, newEnergy?: number) {
    const hoursToSave = newHours ?? availableHours;
    const energyToSave = newEnergy ?? energy;

    const formData = new FormData();
    formData.set("plan_date", selectedDate);
    formData.set("available_hours", String(hoursToSave));
    formData.set("energy", String(energyToSave));
    if (dayPlan?.focus_question_answer) {
      formData.set("focus_question_answer", dayPlan.focus_question_answer);
    }
    if (dayPlan?.money_action_task_id) {
      formData.set("money_action_task_id", dayPlan.money_action_task_id);
    }
    if (dayPlan?.personal_action_task_id) {
      formData.set("personal_action_task_id", dayPlan.personal_action_task_id);
    }
    if (dayPlan?.relationship_action_task_id) {
      formData.set(
        "relationship_action_task_id",
        dayPlan.relationship_action_task_id,
      );
    }
    formData.set("status", dayPlan?.status || "active");

    startTransition(async () => {
      await saveDayPlan({ ok: false }, formData);
      onSaveSuccess?.();
    });
  }

  const isOverloaded = capacity.isOverloaded;

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      {/* Top Banner: Date, Quick Day Switcher, and Future Planning State */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-100 pb-4 sm:flex-row sm:items-center dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Sun className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
              {isToday
                ? t.todayPlan.title
                : isFuture
                  ? isRtl
                    ? "خطة اليوم المستقبلي"
                    : "Future Day Planning"
                  : isRtl
                    ? "أرشيف خطة اليوم"
                    : "Day Plan Archive"}
            </h1>

            {isFuture && (
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-black text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {isRtl ? "تخطيط مسبق" : "Advance Plan"}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 sm:text-sm dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{formattedDate}</span>
          </p>
        </div>

        {/* Quick Date Switcher Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-1.5 dark:border-zinc-700/60 dark:bg-zinc-800/60">
          <button
            type="button"
            onClick={() => changeDateByOffset(isRtl ? 1 : -1)}
            title={isRtl ? "اليوم السابق" : "Previous Day"}
            className="cursor-pointer rounded-xl p-1.5 text-zinc-500 transition-all hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => router.push(`/today?date=${todayStr}`)}
            className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              isToday
                ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {isRtl ? "اليوم" : "Today"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/today?date=${tomorrowStr}`)}
            className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedDate === tomorrowStr
                ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {isRtl ? "غداً" : "Tomorrow"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/today?date=${dayAfterStr}`)}
            className={`hidden cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all sm:inline-flex ${
              selectedDate === dayAfterStr
                ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {isRtl ? "بعد غد" : "+2 Days"}
          </button>

          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`/today?date=${e.target.value}`);
                }
              }}
              className="absolute inset-0 z-10 h-8 w-8 cursor-pointer opacity-0"
              title={isRtl ? "اختيار تاريخ مخصص" : "Pick custom date"}
            />
            <div className="cursor-pointer rounded-xl p-1.5 text-zinc-500 transition-all hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => changeDateByOffset(isRtl ? -1 : 1)}
            title={isRtl ? "اليوم التالي" : "Next Day"}
            className="cursor-pointer rounded-xl p-1.5 text-zinc-500 transition-all hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Future Planning Motivational Banner */}
      {isFuture && (
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-200/80 bg-indigo-50/80 p-3.5 text-xs text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200">
          <Target className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div className="leading-relaxed">
            <span className="font-extrabold">
              {isRtl ? "🎯 وضع التخطيط المسبق: " : "🎯 Advance Planning Mode: "}
            </span>
            <span className="font-medium">
              {isRtl
                ? "أنت الآن ترتب ساعاتك ومهامك ليوم قادم، لتستيقظ وخطة يومك جاهزة للتنفيذ فوراً بدون إضاعة دقيقة في التردد."
                : "Calibrate available hours and priority tasks ahead of time so you wake up ready for instant execution."}
            </span>
          </div>
        </div>
      )}

      {/* Friday Protected Rule Banner */}
      {isFriday && (
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-800 dark:border-purple-900/50 dark:bg-purple-950/50 dark:text-purple-300">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <div>
            <span className="block font-extrabold">
              {t.todayPlan.fridayRule}
            </span>
            <span className="text-[10px] font-normal text-purple-600 dark:text-purple-300">
              {t.todayPlan.fridayRuleDesc}
            </span>
          </div>
        </div>
      )}

      {/* Control Strip: Energy & Available Hours & Capacity Bar */}
      <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-3">
        {/* 1. Energy Level */}
        <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <BatteryCharging className="h-4 w-4 text-amber-500" />
              {t.todayPlan.energyLevel}
            </span>
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-black text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100">
              {energy} / 5
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setEnergy(lvl);
                  handleSaveSettings(undefined, lvl);
                }}
                disabled={isPending}
                className={`h-7 flex-1 cursor-pointer rounded-lg text-xs font-black transition-all ${
                  energy === lvl
                    ? "bg-amber-500 text-white shadow-xs"
                    : lvl < energy
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-zinc-200/70 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Available Work Hours */}
        <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Clock className="h-4 w-4 text-indigo-500" />
              {t.todayPlan.availableHours}
            </span>
            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-black text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100">
              {availableHours} {t.todayPlan.hoursUnit}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min="1"
              max="14"
              step="0.5"
              value={availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
              onMouseUp={() => handleSaveSettings()}
              onTouchEnd={() => handleSaveSettings()}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-indigo-600 dark:bg-zinc-700"
            />
          </div>
        </div>

        {/* 3. Real-time Capacity Status Indicator */}
        <div
          className={`space-y-2 rounded-2xl border p-4 transition-all ${
            isOverloaded
              ? "border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/40"
              : "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {isOverloaded ? (
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              {isOverloaded
                ? t.todayPlan.capacityOverload
                : t.todayPlan.capacityOptimal}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-black ${
                isOverloaded
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
              }`}
            >
              {capacity.totalPlannedHours} / {capacity.availableHours}h
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverloaded ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(100, capacity.capacityPercentage)}%`,
              }}
            />
          </div>

          <p className="truncate text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {capacity.tasksCount} {isRtl ? "مهام مجدولة" : "tasks planned"} •{" "}
            {capacity.effectiveCapacityHours}h{" "}
            {isRtl ? "سعة فعالة" : "effective capacity"}
          </p>
        </div>
      </div>
    </div>
  );
}
