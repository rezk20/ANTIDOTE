"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toggleTaskComplete } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";
import type { TaskRow } from "@/lib/supabase/types";

export function RevenueActionCard({ task }: { task: TaskRow | null }) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const isDone = task?.status === "done";

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 p-6 shadow-xs dark:border-emerald-950/60 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/20">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t.dashboard.revenueCardTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.dashboard.revenueCardSubtitle}
              </p>
            </div>
          </div>

          <Badge
            variant="success"
            className="py-0.5 text-[10px] font-bold uppercase"
          >
            ROI Focus
          </Badge>
        </div>

        {/* Task Content */}
        {!task ? (
          <p className="py-4 text-center text-xs text-zinc-400 italic">
            {t.dashboard.noRevenueTask}
          </p>
        ) : (
          <div
            className={`space-y-2.5 rounded-2xl border p-4 transition-all ${
              isDone
                ? "border-emerald-300 bg-emerald-100/40 dark:border-emerald-800 dark:bg-emerald-950/40"
                : "border-emerald-200/70 bg-white shadow-xs dark:border-emerald-900/50 dark:bg-zinc-800"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await toggleTaskComplete(task.id, !isDone);
                  });
                }}
                className="mt-0.5 shrink-0 cursor-pointer text-zinc-400 transition-colors hover:text-emerald-600"
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-300 hover:text-emerald-500" />
                )}
              </button>

              <div className="min-w-0 flex-1 space-y-1">
                <p
                  className={`line-clamp-2 text-sm leading-snug font-extrabold ${
                    isDone
                      ? "text-zinc-400 line-through"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {task.title}
                </p>

                {task.description && (
                  <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-1.5 text-[11px] text-zinc-400 dark:border-zinc-800">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3" />
                <span>{task.duration_min || 45}m</span>
              </span>

              <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
                <Zap className="h-3 w-3" />
                <span>Impact: {task.revenue_impact || 5}/5</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
        <Link
          href="/tasks"
          className="flex items-center justify-between text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>{t.dashboard.viewTasks}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
