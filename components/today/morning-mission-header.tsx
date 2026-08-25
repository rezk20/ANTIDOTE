"use client";

import { useState, useTransition } from "react";
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
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const [availableHours, setAvailableHours] = useState<number>(() =>
    dayPlan ? Number(dayPlan.available_hours) : capacity.availableHours || 6.0,
  );
  const [energy, setEnergy] = useState<number>(() =>
    dayPlan ? dayPlan.energy : 3,
  );

  // Date formatting
  const [y, m, d] = selectedDate.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d, 12, 0, 0);
  const formattedDate = dateObj.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      {/* Top Banner: Date, Friday Rule Banner, Status */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Sun className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
              {t.todayPlan.title}
            </h1>
          </div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 sm:text-sm dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{formattedDate}</span>
          </p>
        </div>

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
      </div>

      {/* Control Strip: Energy & Available Hours & Capacity Bar */}
      <div className="grid grid-cols-1 gap-4 border-t border-zinc-100 pt-2 md:grid-cols-3 dark:border-zinc-800/80">
        {/* 1. Energy Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="h-4 w-4 text-emerald-500" />
              <span>{t.todayPlan.energyLevel}</span>
            </span>
            <span className="text-[11px] font-extrabold text-zinc-400">
              {energy} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isSelected = energy === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setEnergy(lvl);
                    handleSaveSettings(undefined, lvl);
                  }}
                  disabled={isPending}
                  className={`cursor-pointer rounded-xl py-2 text-xs font-black transition-all ${
                    isSelected
                      ? lvl <= 2
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-emerald-600 text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] font-medium text-zinc-400">
            {energy <= 2 ? t.todayPlan.energyLow : t.todayPlan.energyHigh}
          </p>
        </div>

        {/* 2. Available Work Hours */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{t.todayPlan.availableHours}</span>
            </span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">
              {availableHours} {t.todayPlan.hoursUnit}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={availableHours}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setAvailableHours(val);
              }}
              onMouseUp={() => handleSaveSettings(availableHours)}
              onTouchEnd={() => handleSaveSettings(availableHours)}
              className="h-2 w-full cursor-pointer rounded-lg bg-zinc-100 accent-blue-600 dark:bg-zinc-800"
            />
          </div>

          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>2h</span>
            <span>6h (Normal)</span>
            <span>10h (Sprint)</span>
          </div>
        </div>

        {/* 3. Capacity Guard Meter */}
        <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/60">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1">
              {isOverloaded ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              )}
              <span
                className={
                  isOverloaded
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-zinc-700 dark:text-zinc-300"
                }
              >
                {t.todayPlan.capacityGuard}
              </span>
            </span>
            <span className="text-xs font-extrabold">
              {capacity.totalPlannedHours}h / {availableHours}h
            </span>
          </div>

          {/* Meter bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverloaded
                  ? "bg-rose-500"
                  : capacity.capacityPercentage > 85
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(100, capacity.capacityPercentage)}%`,
              }}
            />
          </div>

          <p className="text-[10px] text-zinc-400">
            {isOverloaded
              ? t.todayPlan.capacityOverload
              : t.todayPlan.capacityOptimal}
          </p>
        </div>
      </div>
    </div>
  );
}
