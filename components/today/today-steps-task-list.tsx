"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { completeTask } from "@/lib/actions/tasks";
import type { TaskRow, ProjectRow, GoalRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Plus,
  Flame,
  Check,
  ListOrdered,
  FolderKanban,
  Target,
  ChevronRight,
} from "lucide-react";

interface TodayStepsTaskListProps {
  tasks: TaskRow[];
  projects?: ProjectRow[];
  goals?: GoalRow[];
  onAddTask: () => void;
  onEditTask: (task: TaskRow) => void;
  onViewDetails: (task: TaskRow) => void;
}

export function TodayStepsTaskList({
  tasks,
  projects = [],
  goals = [],
  onAddTask,
  onEditTask,
  onViewDetails,
}: TodayStepsTaskListProps) {
  const { isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [filterMode, setFilterMode] = useState<"all" | "pending" | "done">("all");

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Categorize and sort tasks into logical sequential steps
  // 1. Top 3 Focus tasks first
  const topThree = tasks.filter((t) => t.is_top_three);
  // 2. Critical P1 tasks (not in top 3)
  const criticalTasks = tasks.filter((t) => !t.is_top_three && t.priority === "critical");
  // 3. High P2 tasks
  const highTasks = tasks.filter((t) => !t.is_top_three && t.priority === "high");
  // 4. Medium / Low P3/P4 tasks
  const normalTasks = tasks.filter(
    (t) => !t.is_top_three && t.priority !== "critical" && t.priority !== "high",
  );

  const orderedTasks = [...topThree, ...criticalTasks, ...highTasks, ...normalTasks];

  const visibleTasks = orderedTasks.filter((task) => {
    if (filterMode === "pending") return task.status !== "done";
    if (filterMode === "done") return task.status === "done";
    return true;
  });

  const handleToggle = (task: TaskRow, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      await completeTask(task.id, task.status !== "done");
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          label: "P1 حرج",
          className:
            "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        };
      case "high":
        return {
          label: "P2 مرتفع",
          className:
            "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        };
      case "medium":
        return {
          label: "P3 متوسط",
          className:
            "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
      default:
        return {
          label: "P4 منخفض",
          className:
            "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Progress Bar Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs">
              <ListOrdered className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  {isRtl ? "خارطة خطوات ومهام اليوم التنفيذية" : "Today's Step-by-Step Mission Roadmap"}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                  {completedCount}/{totalCount} {isRtl ? "منجز" : "done"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isRtl
                  ? "مرتبة مرحلياً حسب الأولوية وتأثير الدخل لإنجاز أهدافك خطوة بخطوة."
                  : "Sequenced by leverage and priority to execute your day with zero friction."}
              </p>
            </div>
          </div>

          {/* Action Buttons & Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === "all"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {isRtl ? "الكل" : "All"} ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("pending")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === "pending"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {isRtl ? "المتبقي" : "Pending"} ({totalCount - completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("done")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterMode === "done"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {isRtl ? "المنجز" : "Done"} ({completedCount})
              </button>
            </div>

            <Button
              onClick={onAddTask}
              className="rounded-xl text-xs font-black gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isRtl ? "إضافة مهمة" : "Add Task"}</span>
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-zinc-500">
              {isRtl ? "نسبة إنجاز خطوات اليوم:" : "Today's completion rate:"}
            </span>
            <span className="font-mono text-zinc-900 dark:text-zinc-100">
              {progressPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Steps Sequence Timeline */}
      {visibleTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 w-fit mx-auto">
            <Check className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {filterMode === "done"
              ? isRtl
                ? "لم تنجز أي مهام بعد اليوم، انطلق بالخطوة الأولى!"
                : "No completed tasks yet."
              : isRtl
              ? "لا توجد مهام مجدولة لهذا اليوم!"
              : "No tasks scheduled for today."}
          </h3>
          <Button
            onClick={onAddTask}
            variant="outline"
            className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isRtl ? "إضافة أول مهمة لليوم" : "Add First Task"}</span>
          </Button>
        </div>
      ) : (
        <div className="relative space-y-4">
          {/* Connecting Vertical Track Line */}
          <div className="absolute top-6 bottom-6 right-7.5 w-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0 hidden md:block" />

          {visibleTasks.map((task, index) => {
            const isDone = task.status === "done";
            const stepNum = String(index + 1).padStart(2, "0");
            const priorityBadge = getPriorityBadge(task.priority);
            const project = projects.find((p) => p.id === task.project_id);
            const goal = goals.find((g) => g.id === task.goal_id);

            const isTopThree = task.is_top_three;

            return (
              <div
                key={task.id}
                onClick={() => onViewDetails(task)}
                className={`group relative z-10 p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                  isDone
                    ? "bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60"
                    : isTopThree
                    ? "bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-transparent border-amber-300 dark:border-amber-900/60 hover:border-amber-400 dark:hover:border-amber-700 shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {/* Left / Start Info (Step Number + Checkbox + Title) */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Step Number Badge */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-xs transition-all ${
                      isDone
                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                        : isTopThree
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : stepNum}
                  </div>

                  {/* Checkbox Trigger */}
                  <button
                    type="button"
                    onClick={(e) => handleToggle(task, e)}
                    disabled={isPending}
                    className="mt-1 shrink-0 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    title={isDone ? "إلغاء الإنجاز" : "تعليم كمنجز"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isTopThree && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-2xs flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          <span>أولوية قصوى (Top 3)</span>
                        </span>
                      )}

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${priorityBadge.className}`}
                      >
                        {priorityBadge.label}
                      </span>

                      {task.revenue_impact && task.revenue_impact > 0 ? (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                          <DollarSign className="h-2.5 w-2.5" />
                          عائد مالي
                        </span>
                      ) : null}

                      {task.task_type && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          {task.task_type}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-xs font-bold leading-relaxed ${
                        isDone
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    {/* Project & Goal Badges */}
                    {(project || goal) && (
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-zinc-400 flex-wrap">
                        {project && (
                          <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                            <FolderKanban className="h-3 w-3" />
                            {project.name}
                          </span>
                        )}
                        {goal && (
                          <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                            <Target className="h-3 w-3" />
                            {goal.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right / End Info (Duration + Actions) */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800 shrink-0">
                  {task.duration_min && (
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-500">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{task.duration_min} دقيقة</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      {isRtl ? "تعديل" : "Edit"}
                    </button>

                    <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
