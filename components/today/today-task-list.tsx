"use client";

import { useTransition } from "react";
import { toggleTaskComplete, toggleTaskTopThree } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Star,
  Eye,
  Clock,
  DollarSign,
  Plus,
  AlertCircle,
} from "lucide-react";
import type { TaskRow } from "@/lib/supabase/types";

export function TodayTaskList({
  tasks,
  selectedDate,
  onViewDetails,
  onAddTask,
}: {
  tasks: TaskRow[];
  selectedDate: string;
  onViewDetails: (task: TaskRow) => void;
  onAddTask: () => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  // Partition tasks into active vs done
  const activeTasks = tasks.filter((t) => t.status !== "done" && t.status !== "dropped");
  const completedTasks = tasks.filter((t) => t.status === "done");

  const overdueTasks = activeTasks.filter(
    (t) => t.scheduled_date && t.scheduled_date < selectedDate,
  );
  const todayActiveTasks = activeTasks.filter(
    (t) => !t.scheduled_date || t.scheduled_date >= selectedDate,
  );

  return (
    <div className="space-y-6">
      {/* Header with New Task Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.todayPlan.todayTasks} ({tasks.length})
          </h2>
        </div>

        <Button onClick={onAddTask} size="sm" className="gap-1.5 rounded-xl font-bold">
          <Plus className="h-4 w-4" />
          <span>{t.tasks.newTask}</span>
        </Button>
      </div>

      {/* 1. Overdue / Carryover Tasks Section (if any) */}
      {overdueTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{t.todayPlan.overdueTasks} ({overdueTasks.length})</span>
          </div>

          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <TaskRowItem
                key={task.id}
                task={task}
                isPending={isPending}
                onViewDetails={onViewDetails}
                onToggleComplete={() => {
                  startTransition(async () => {
                    await toggleTaskComplete(task.id, true);
                  });
                }}
                onToggleTopThree={() => {
                  startTransition(async () => {
                    await toggleTaskTopThree(task.id, !task.is_top_three);
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Today's Active Tasks Section */}
      <div className="space-y-2">
        {todayActiveTasks.length === 0 && overdueTasks.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
            <p className="text-sm font-bold text-zinc-500">
              {isRtl ? "لا توجد مهام نشطة مجدولة لليوم." : "No active tasks scheduled for today."}
            </p>
            <Button onClick={onAddTask} size="sm" variant="outline" className="rounded-xl">
              {t.tasks.newTask}
            </Button>
          </div>
        ) : (
          todayActiveTasks.map((task) => (
            <TaskRowItem
              key={task.id}
              task={task}
              isPending={isPending}
              onViewDetails={onViewDetails}
              onToggleComplete={() => {
                startTransition(async () => {
                  await toggleTaskComplete(task.id, true);
                });
              }}
              onToggleTopThree={() => {
                startTransition(async () => {
                  await toggleTaskTopThree(task.id, !task.is_top_three);
                });
              }}
            />
          ))
        )}
      </div>

      {/* 3. Completed Today Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{t.todayPlan.tasksCompletedToday} ({completedTasks.length})</span>
          </div>

          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskRowItem
                key={task.id}
                task={task}
                isPending={isPending}
                onViewDetails={onViewDetails}
                onToggleComplete={() => {
                  startTransition(async () => {
                    await toggleTaskComplete(task.id, false);
                  });
                }}
                onToggleTopThree={() => {
                  startTransition(async () => {
                    await toggleTaskTopThree(task.id, !task.is_top_three);
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRowItem({
  task,
  isPending,
  onViewDetails,
  onToggleComplete,
  onToggleTopThree,
}: {
  task: TaskRow;
  isPending: boolean;
  onViewDetails: (task: TaskRow) => void;
  onToggleComplete: () => void;
  onToggleTopThree: () => void;
}) {
  const { t } = useLocale();
  const isDone = task.status === "done";

  const priorityVariant: Record<string, "danger" | "warning" | "accent" | "secondary"> = {
    critical: "danger",
    high: "warning",
    medium: "accent",
    low: "secondary",
  };

  return (
    <div
      className={`group flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        isDone
          ? "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-75"
          : task.is_top_three
            ? "bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/40"
            : "bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {/* Left items: Checkbox, Title, Badges */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          disabled={isPending}
          onClick={onToggleComplete}
          className="text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 text-zinc-300 hover:text-emerald-500" />
          )}
        </button>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-bold truncate ${
                isDone
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {task.title}
            </span>

            <Badge
              variant={priorityVariant[task.priority] || "outline"}
              className="text-[10px] py-0 font-bold uppercase"
            >
              {task.priority}
            </Badge>

            {task.area && (
              <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
                • {task.area}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3" />
              <span>{task.duration_min || 45}m</span>
            </span>

            {(task.revenue_impact ?? 0) >= 3 && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <DollarSign className="h-3 w-3" />
                <span>Revenue ({task.revenue_impact}/5)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right actions: Star Top 3, Eye Detail */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          disabled={isPending}
          onClick={onToggleTopThree}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            task.is_top_three
              ? "text-amber-500 hover:text-amber-600"
              : "text-zinc-300 hover:text-amber-400 opacity-60 group-hover:opacity-100"
          }`}
          title={task.is_top_three ? "Remove from Top 3" : "Add to Top 3"}
        >
          <Star className={`h-4 w-4 ${task.is_top_three ? "fill-amber-500" : ""}`} />
        </button>

        <button
          onClick={() => onViewDetails(task)}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
          title={t.common.viewDetails}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
