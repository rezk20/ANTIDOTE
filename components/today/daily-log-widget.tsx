"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveDailyLog } from "@/lib/actions/daily-log";
import type { DailyLogRow } from "@/lib/supabase/types";
import type { CapacityAdvice } from "@/lib/logic/daily-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Moon,
  Sun,
  Zap,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  CheckCircle2,
} from "lucide-react";

interface DailyLogWidgetProps {
  initialLog: DailyLogRow | null;
  advice: CapacityAdvice;
  todayDate: string;
}

export function DailyLogWidget({
  initialLog,
  advice,
  todayDate,
}: DailyLogWidgetProps) {
  const { t, locale } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [sleepAt, setSleepAt] = useState(initialLog?.sleep_at || "");
  const [wokeAt, setWokeAt] = useState(initialLog?.woke_at || "");
  const [hoursSlept, setHoursSlept] = useState(
    initialLog?.hours_slept ? String(initialLog.hours_slept) : "",
  );
  const [energy, setEnergy] = useState<number>(initialLog?.energy || 4);
  const [focus, setFocus] = useState<number>(initialLog?.focus || 4);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await saveDailyLog({
        id: initialLog?.id,
        log_date: todayDate,
        sleep_at: sleepAt || null,
        woke_at: wokeAt || null,
        hours_slept: hoursSlept ? Number(hoursSlept) : null,
        energy,
        focus,
      });

      if (res.ok) {
        setSuccessMsg(t.dailyLog.savedSuccess);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء حفظ السجل.");
      }
    });
  };

  const adviceMessage = locale === "ar" ? advice.messageAr : advice.messageEn;

  const capacityBadge = {
    light: {
      label: "الوضع الخفيف (حماية الطاقة)",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: BatteryLow,
    },
    normal: {
      label: "وضع متوازن ومستقر",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: BatteryMedium,
    },
    high: {
      label: "جاهزية قصوى للعمل العميق",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: BatteryCharging,
    },
  }[advice.capacity];

  const CapacityIcon = capacityBadge.icon;

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
      {/* Header & Capacity advice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              {t.dailyLog.title}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {adviceMessage}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 ${capacityBadge.color}`}>
          <CapacityIcon className="h-3.5 w-3.5" />
          <span>{capacityBadge.label}</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
        {/* Sleep time */}
        <div className="space-y-1">
          <Label className="text-[11px] font-bold flex items-center gap-1">
            <Moon className="h-3 w-3 text-indigo-500" />
            {t.dailyLog.sleepAt}
          </Label>
          <Input
            type="time"
            value={sleepAt}
            onChange={(e) => setSleepAt(e.target.value)}
            className="text-xs rounded-xl"
          />
        </div>

        {/* Wake time */}
        <div className="space-y-1">
          <Label className="text-[11px] font-bold flex items-center gap-1">
            <Sun className="h-3 w-3 text-amber-500" />
            {t.dailyLog.wokeAt}
          </Label>
          <Input
            type="time"
            value={wokeAt}
            onChange={(e) => setWokeAt(e.target.value)}
            className="text-xs rounded-xl"
          />
        </div>

        {/* Hours Slept */}
        <div className="space-y-1">
          <Label className="text-[11px] font-bold">
            {t.dailyLog.hoursSlept}
          </Label>
          <Input
            type="number"
            step="0.5"
            min="0"
            max="24"
            placeholder="مثال: 7.5"
            value={hoursSlept}
            onChange={(e) => setHoursSlept(e.target.value)}
            className="text-xs rounded-xl"
          />
        </div>

        {/* Energy Level (1-5) */}
        <div className="space-y-1">
          <Label className="text-[11px] font-bold">
            {t.dailyLog.energy}
          </Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEnergy(lvl)}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  energy === lvl
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                }`}
                title={t.dailyLog.energyRatings[lvl as keyof typeof t.dailyLog.energyRatings]}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Level (1-5) */}
        <div className="space-y-1">
          <Label className="text-[11px] font-bold">
            {t.dailyLog.focus}
          </Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFocus(lvl)}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  focus === lvl
                    ? "bg-blue-500 text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <Button
          type="submit"
          disabled={isPending}
          className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl cursor-pointer h-9 sm:col-span-2 md:col-span-1"
        >
          {isPending ? t.common.saving : t.dailyLog.saveLog}
        </Button>
      </form>
    </div>
  );
}
