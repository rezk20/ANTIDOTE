"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toggleTaskComplete } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import type { TaskRow } from "@/lib/supabase/types";

export function TopThreeCard({ topThreeTasks }: { topThreeTasks: TaskRow[] }) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const completedCount = topThreeTasks.filter(
    (t) => t.status === "done",
  ).length;
  const isAllDone =
    topThreeTasks.length > 0 && completedCount === topThreeTasks.length;

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t.dashboard.topThreeCardTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.dashboard.topThreeCardSubtitle}
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            {completedCount} / {topThreeTasks.length}
          </span>
        </div>

        {/* All Done Celebration */}
        {isAllDone && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{t.dashboard.allDoneCelebration}</span>
          </div>
        )}

        {/* Task Items List */}
        {topThreeTasks.length === 0 ? (
          <p className="py-4 text-center text-xs text-zinc-400 italic">
            {t.dashboard.noTopThree}
          </p>
        ) : (
          <div className="space-y-2">
            {topThreeTasks.map((task) => {
              const isDone = task.status === "done";
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between gap-2.5 rounded-2xl border p-3 transition-all ${
                    isDone
                      ? "border-emerald-100 bg-emerald-50/30 opacity-75 dark:border-emerald-900/30 dark:bg-emerald-950/10"
                      : "border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <button
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await toggleTaskComplete(task.id, !isDone);
                        });
                      }}
                      className="shrink-0 cursor-pointer text-zinc-400 transition-colors hover:text-emerald-600"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-zinc-300 hover:text-emerald-500" />
                      )}
                    </button>

                    <span
                      className={`truncate text-xs font-bold ${
                        isDone
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-zinc-400">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{task.duration_min || 45}m</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
        <Link
          href="/today"
          className="flex items-center justify-between text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>{t.dashboard.viewTodayPlan}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
