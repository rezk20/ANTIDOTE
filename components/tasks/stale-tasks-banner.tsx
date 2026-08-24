"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { moveTaskDate, deleteTask } from "@/lib/actions/tasks";
import { useLocale } from "@/components/providers/locale-provider";
import { AlertCircle, Calendar, Trash2, ArrowRight } from "lucide-react";
import type { TaskRow } from "@/lib/supabase/types";

export function StaleTasksBanner({ staleTasks }: { staleTasks: TaskRow[] }) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  if (staleTasks.length === 0) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3 shadow-xs">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{t.tasks.staleTitle} ({staleTasks.length})</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        {t.tasks.staleDesc}
      </p>

      <div className="space-y-2 pt-1">
        {staleTasks.map((task) => {
          const timeAgo = formatDistanceToNow(new Date(task.updated_at), {
            addSuffix: true,
          });

          return (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-100 dark:border-amber-950/80 shadow-2xs"
            >
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {task.title}
                </span>
                <p className="text-[11px] text-zinc-400">
                  {isRtl ? `غير نشطة منذ ${timeAgo}` : `Inactive ${timeAgo}`}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await moveTaskDate(task.id, todayStr);
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  <span>{t.common.doToday}</span>
                </button>

                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await moveTaskDate(task.id, tomorrowStr);
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <Calendar className="h-3 w-3" />
                  <span>{t.common.tomorrow}</span>
                </button>

                <button
                  disabled={isPending}
                  onClick={() => {
                    if (confirm(`${t.common.confirmDelete} "${task.title}"?`)) {
                      startTransition(async () => {
                        await deleteTask(task.id);
                      });
                    }
                  }}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title={t.common.delete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
