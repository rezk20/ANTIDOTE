"use client";

import { useTransition } from "react";
import { completeTask, toggleTopThree, deleteTask } from "@/lib/actions/tasks";
import { calculatePriorityScore } from "@/lib/logic/priority";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import { Star, Check, Trash2, Edit2, Repeat, Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TaskRow, GoalRow, ProjectRow } from "@/lib/supabase/types";

const PRIORITY_COLORS: Record<
  string,
  "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "accent"
> = {
  critical: "danger",
  high: "warning",
  medium: "accent",
  low: "outline",
};

export function TaskItem({
  task,
  goals = [],
  projects = [],
  onEdit,
  onViewDetails,
}: {
  task: TaskRow;
  goals?: GoalRow[];
  projects?: ProjectRow[];
  onEdit: (task: TaskRow) => void;
  onViewDetails?: (task: TaskRow) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const isDone = task.status === "done";
  const priorityScore = calculatePriorityScore(task);
  const badgeVariant = PRIORITY_COLORS[task.priority] || "outline";

  const linkedGoal = goals.find((g) => g.id === task.goal_id);
  const linkedProject = projects.find((p) => p.id === task.project_id);

  const priorityLabels: Record<string, string> = {
    critical: isRtl ? "حرجة" : "CRITICAL",
    high: isRtl ? "عالية" : "HIGH",
    medium: isRtl ? "متوسطة" : "MEDIUM",
    low: isRtl ? "منخفضة" : "LOW",
  };

  const typeLabels: Record<string, string> = {
    revenue: "💰 Revenue",
    product: "🔨 Product",
    client: "👥 Client",
    career: "🚀 Career",
    finance: "💳 Finance",
    marriage: "💍 Marriage",
    learning: "📚 Learning",
    relationship: "❤️ Relationship",
    personal: "👤 Personal",
    admin: "⚙️ Admin",
    health_routine: "🏃 Health",
  };

  return (
    <div
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-2xl border transition-all",
        isDone
          ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 opacity-70"
          : task.is_top_three
            ? "border-amber-300 dark:border-amber-900/80 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700",
      )}
    >
      {/* Left items: Checkbox, Top3 Star, Title, Badges */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        {/* Quick Checkbox */}
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await completeTask(task.id, !isDone);
            });
          }}
          className={cn(
            "h-5 w-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer mt-0.5 sm:mt-0 shrink-0",
            isDone
              ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
              : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-800",
          )}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
        >
          {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        {/* Top 3 Star Toggle */}
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await toggleTopThree(task.id, task.is_top_three);
            });
          }}
          className={cn(
            "p-1 rounded-md transition-colors cursor-pointer shrink-0",
            task.is_top_three
              ? "text-amber-500 hover:text-amber-600"
              : "text-zinc-300 dark:text-zinc-700 hover:text-zinc-400 opacity-60 group-hover:opacity-100",
          )}
          title={task.is_top_three ? t.tasks.topThree : t.tasks.markTopThree}
        >
          <Star
            className={cn(
              "h-4 w-4",
              task.is_top_three && "fill-amber-500",
            )}
          />
        </button>

        {/* Title and metadata */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
                isDone && "line-through text-zinc-400 dark:text-zinc-500 font-normal",
              )}
            >
              {task.title}
            </span>

            {/* Priority Badge */}
            <Badge variant={badgeVariant} className="text-[10px] py-0 px-1.5 font-bold">
              {priorityLabels[task.priority] || task.priority} ({priorityScore})
            </Badge>

            {/* Task Type Tag */}
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                task.task_type === "revenue"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : task.task_type === "product"
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent",
              )}
            >
              {typeLabels[task.task_type] || task.task_type}
            </span>
          </div>

          {/* Links and schedule line */}
          <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 flex-wrap">
            {task.scheduled_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{task.scheduled_date}</span>
              </span>
            )}

            {task.recurring_rule && (
              <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                <Repeat className="h-3 w-3" />
                <span>{task.recurring_rule}</span>
              </span>
            )}

            {linkedGoal && (
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                🎯 {linkedGoal.title}
              </span>
            )}

            {linkedProject && (
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                📁 {linkedProject.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right actions: Eye (Details), Edit & Delete */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(task)}
            className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            title={t.common.viewDetails}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={t.common.edit}
        >
          <Edit2 className="h-3.5 w-3.5" />
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
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title={t.common.delete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
