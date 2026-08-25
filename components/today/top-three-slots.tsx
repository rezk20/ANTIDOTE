"use client";

import { useTransition } from "react";
import { toggleTaskComplete, toggleTaskTopThree } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Star,
  Eye,
  Clock,
  DollarSign,
} from "lucide-react";
import type { TaskRow } from "@/lib/supabase/types";

export function TopThreeSlots({
  topThreeTasks,
  onViewDetails,
  onOpenTaskPicker,
}: {
  topThreeTasks: TaskRow[];
  onViewDetails: (task: TaskRow) => void;
  onOpenTaskPicker?: () => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  // Ensure array of 3 slots
  const slots: (TaskRow | null)[] = [
    topThreeTasks[0] || null,
    topThreeTasks[1] || null,
    topThreeTasks[2] || null,
  ];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.todayPlan.topThreeTitle}
        </h2>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          {t.todayPlan.topThreeSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((task, idx) => {
          const slotNumber = idx + 1;
          const isDone = task?.status === "done";

          if (!task) {
            return (
              <div
                key={`empty-slot-${slotNumber}`}
                onClick={onOpenTaskPicker}
                className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-center min-h-[140px] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-extrabold text-zinc-600 dark:text-zinc-400 mb-2 group-hover:scale-110 transition-transform">
                  {slotNumber}
                </div>
                <p className="text-xs font-bold text-zinc-400">
                  {isRtl ? `+ تعيين الأولوية ${slotNumber}` : `+ Assign Priority ${slotNumber}`}
                </p>
              </div>
            );
          }

          return (
            <div
              key={task.id}
              className={`relative p-5 rounded-3xl border transition-all space-y-3.5 shadow-xs ${
                isDone
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {/* Slot Number Badge & Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black shrink-0 ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {slotNumber}
                  </div>
                  <Badge
                    variant={task.priority === "critical" ? "danger" : "default"}
                    className="text-[10px] uppercase font-bold py-0"
                  >
                    {task.task_type}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewDetails(task)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    title={t.common.viewDetails}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        await toggleTaskTopThree(task.id, false);
                      });
                    }}
                    className="p-1 rounded-lg text-amber-500 hover:text-zinc-400 transition-colors cursor-pointer"
                    title="Remove from Top 3"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                  </button>
                </div>
              </div>

              {/* Title & Checkbox */}
              <div className="flex items-start gap-2.5">
                <button
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await toggleTaskComplete(task.id, !isDone);
                    });
                  }}
                  className="mt-0.5 text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="h-5 w-5 text-zinc-300 hover:text-emerald-500" />
                  )}
                </button>

                <p
                  className={`text-sm font-bold leading-snug line-clamp-2 ${
                    isDone
                      ? "line-through text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {task.title}
                </p>
              </div>

              {/* Footer Chips */}
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  <span>{task.duration_min || 45}m</span>
                </span>

                {(task.revenue_impact ?? 0) >= 3 && (
                  <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <DollarSign className="h-3 w-3" />
                    <span>Revenue</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
