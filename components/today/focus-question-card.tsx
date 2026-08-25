"use client";

import { useState, useTransition } from "react";
import { saveDayPlan } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import { Sparkles, Check } from "lucide-react";
import type { DayPlanRow } from "@/lib/supabase/types";

export function FocusQuestionCard({
  dayPlan,
  selectedDate,
}: {
  dayPlan: DayPlanRow | null;
  selectedDate: string;
}) {
  const { t } = useLocale();
  const [, startTransition] = useTransition();

  const [focusAnswer, setFocusAnswer] = useState<string>(
    dayPlan?.focus_question_answer || "",
  );
  const [isSaved, setIsSaved] = useState(false);

  function handleSave(value: string) {
    const formData = new FormData();
    formData.set("plan_date", selectedDate);
    formData.set("available_hours", String(dayPlan?.available_hours || 6.0));
    formData.set("energy", String(dayPlan?.energy || 3));
    formData.set("focus_question_answer", value.trim());
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
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-3 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 shadow-xs dark:border-amber-950/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-amber-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-100 p-1.5 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-extrabold text-zinc-900 sm:text-sm dark:text-zinc-100">
            {t.todayPlan.focusQuestion}
          </h3>
        </div>

        {isSaved && (
          <span className="animate-in fade-in flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      <div>
        <input
          type="text"
          value={focusAnswer}
          onChange={(e) => setFocusAnswer(e.target.value)}
          onBlur={() => handleSave(focusAnswer)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave(focusAnswer);
            }
          }}
          placeholder={t.todayPlan.focusQuestionPlaceholder}
          className="w-full rounded-2xl border border-amber-200/70 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-2xs placeholder:text-zinc-400 focus:ring-2 focus:ring-amber-500/40 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100"
        />
      </div>
    </div>
  );
}
