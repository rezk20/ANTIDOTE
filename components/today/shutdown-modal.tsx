"use client";

import { useState, useTransition } from "react";
import { closeDayPlan } from "@/lib/actions/day-plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/locale-provider";
import { Moon, X, Sparkles, ListTodo } from "lucide-react";
import type { ShutdownSummaryResult } from "@/lib/logic/day-plan";

export function ShutdownModal({
  isOpen,
  onClose,
  selectedDate,
  summary,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  summary: ShutdownSummaryResult;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const [tomorrowFocus, setTomorrowFocus] = useState("");
  const [shutdownNotes, setShutdownNotes] = useState("");
  const [selectedRolloverIds, setSelectedRolloverIds] = useState<string[]>(() =>
    summary.rolloverTasks.map((t) => t.id),
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  function toggleRolloverTask(taskId: string) {
    setSelectedRolloverIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  }

  function handleShutdownSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("plan_date", selectedDate);
    formData.set("tomorrow_focus", tomorrowFocus.trim());
    formData.set("shutdown_notes", shutdownNotes.trim());
    formData.set("rollover_task_ids", JSON.stringify(selectedRolloverIds));

    startTransition(async () => {
      const res = await closeDayPlan({ ok: false }, formData);
      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.message || "Failed to complete shutdown.");
      }
    });
  }

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/70 p-4 backdrop-blur-xs duration-150">
      <div
        className="my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.todayPlan.shutdownTitle}
              </h2>
              <p className="text-xs text-zinc-400">
                {t.todayPlan.shutdownSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleShutdownSubmit}
          className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
        >
          {errorMsg && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Today Execution Score Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-center dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <span className="block text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                {isRtl ? "نسبة إنجاز اليوم" : "Completion Rate"}
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {summary.completionRate}%
              </span>
              <span className="block text-[10px] text-zinc-400">
                {summary.completedCount} / {summary.totalTasks}{" "}
                {isRtl ? "مهمة" : "tasks"}
              </span>
            </div>

            <div className="space-y-0.5 rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-center dark:border-amber-900/40 dark:bg-amber-950/30">
              <span className="block text-[10px] font-bold text-amber-800 dark:text-amber-300">
                {isRtl ? "إنجاز الـ Top 3" : "Top 3 Achieved"}
              </span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                {summary.topThreeCompleted} / {summary.topThreeCount}
              </span>
              <span className="block text-[10px] text-zinc-400">
                {summary.topThreeCompleted === summary.topThreeCount &&
                summary.topThreeCount > 0
                  ? "🎉 Completed!"
                  : "In progress"}
              </span>
            </div>
          </div>

          {/* Rollover Tasks Checklist */}
          {summary.rolloverTasks.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <ListTodo className="h-3.5 w-3.5 text-blue-500" />
                  <span>
                    {t.todayPlan.rolloverTasks} ({summary.rolloverTasks.length})
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400">
                  {isRtl ? "نقل تلقائي للغد" : "Auto-schedule for tomorrow"}
                </span>
              </Label>

              <div className="max-h-[140px] space-y-1.5 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800">
                {summary.rolloverTasks.map((tItem) => {
                  const isChecked = selectedRolloverIds.includes(tItem.id);
                  return (
                    <div
                      key={tItem.id}
                      onClick={() => toggleRolloverTask(tItem.id)}
                      className="flex cursor-pointer items-center gap-2 rounded-xl p-1.5 text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-3.5 w-3.5 rounded-sm border-zinc-300 text-blue-600"
                      />
                      <span
                        className={`truncate font-medium ${isChecked ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-400"}`}
                      >
                        {tItem.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tomorrow's Focus / Starting Point */}
          <div>
            <Label
              htmlFor="tomorrow_focus"
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{t.todayPlan.tomorrowFocus}</span>
            </Label>
            <Input
              id="tomorrow_focus"
              value={tomorrowFocus}
              onChange={(e) => setTomorrowFocus(e.target.value)}
              placeholder={t.todayPlan.tomorrowFocusPlaceholder}
              className="mt-1 rounded-xl text-xs"
              autoFocus
            />
          </div>

          {/* Shutdown Notes */}
          <div>
            <Label htmlFor="shutdown_notes" className="text-xs font-bold">
              {t.todayPlan.shutdownNotes}
            </Label>
            <Textarea
              id="shutdown_notes"
              value={shutdownNotes}
              onChange={(e) => setShutdownNotes(e.target.value)}
              placeholder={t.todayPlan.shutdownNotesPlaceholder}
              rows={2}
              className="mt-1 rounded-xl text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              className="gap-1.5 rounded-xl bg-purple-600 text-xs font-bold hover:bg-purple-700"
            >
              <Moon className="h-3.5 w-3.5" />
              <span>{t.todayPlan.shutdownConfirm}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
