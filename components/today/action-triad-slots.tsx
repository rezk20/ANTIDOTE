"use client";

import { useTransition } from "react";
import { saveDayPlan, toggleTaskComplete } from "@/lib/actions/day-plan";
import { useLocale } from "@/components/providers/locale-provider";
import {
  DollarSign,
  User,
  Heart,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
} from "lucide-react";
import type { TaskRow, DayPlanRow } from "@/lib/supabase/types";

export function ActionTriadSlots({
  dayPlan,
  todayTasks,
  moneyActionTask,
  personalActionTask,
  relationshipActionTask,
  selectedDate,
  onViewDetails,
}: {
  dayPlan: DayPlanRow | null;
  todayTasks: TaskRow[];
  moneyActionTask: TaskRow | null;
  personalActionTask: TaskRow | null;
  relationshipActionTask: TaskRow | null;
  selectedDate: string;
  onViewDetails: (task: TaskRow) => void;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  function handleAssignSlot(
    slotName:
      | "money_action_task_id"
      | "personal_action_task_id"
      | "relationship_action_task_id",
    taskId: string,
  ) {
    const formData = new FormData();
    formData.set("plan_date", selectedDate);
    formData.set("available_hours", String(dayPlan?.available_hours || 6.0));
    formData.set("energy", String(dayPlan?.energy || 3));
    if (dayPlan?.focus_question_answer) {
      formData.set("focus_question_answer", dayPlan.focus_question_answer);
    }

    formData.set(
      "money_action_task_id",
      slotName === "money_action_task_id"
        ? taskId
        : dayPlan?.money_action_task_id || "",
    );
    formData.set(
      "personal_action_task_id",
      slotName === "personal_action_task_id"
        ? taskId
        : dayPlan?.personal_action_task_id || "",
    );
    formData.set(
      "relationship_action_task_id",
      slotName === "relationship_action_task_id"
        ? taskId
        : dayPlan?.relationship_action_task_id || "",
    );
    formData.set("status", dayPlan?.status || "active");

    startTransition(async () => {
      await saveDayPlan({ ok: false }, formData);
    });
  }

  const triadSlots = [
    {
      id: "money_action_task_id" as const,
      title: t.todayPlan.moneyAction,
      desc: t.todayPlan.moneyActionDesc,
      icon: (
        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ),
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
      borderColor: "border-emerald-200/70 dark:border-emerald-900/40",
      assignedTask: moneyActionTask,
      taskFilter: (t: TaskRow) =>
        t.task_type === "revenue" || (t.revenue_impact ?? 0) >= 3,
    },
    {
      id: "personal_action_task_id" as const,
      title: t.todayPlan.personalAction,
      desc: t.todayPlan.personalActionDesc,
      icon: <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      badgeBg: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200/70 dark:border-blue-900/40",
      assignedTask: personalActionTask,
      taskFilter: (t: TaskRow) =>
        t.task_type === "personal" ||
        t.task_type === "health_routine" ||
        t.task_type === "learning",
    },
    {
      id: "relationship_action_task_id" as const,
      title: t.todayPlan.relationshipAction,
      desc: t.todayPlan.relationshipActionDesc,
      icon: <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
      badgeBg: "bg-rose-50 dark:bg-rose-950/50",
      borderColor: "border-rose-200/70 dark:border-rose-900/40",
      assignedTask: relationshipActionTask,
      taskFilter: (t: TaskRow) =>
        t.task_type === "marriage" || t.task_type === "relationship",
    },
  ];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xs font-extrabold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
          {t.todayPlan.actionTriad}
        </h2>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          {t.todayPlan.actionTriadSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {triadSlots.map((slot) => {
          const task = slot.assignedTask;
          const isDone = task?.status === "done";

          return (
            <div
              key={slot.id}
              className={`rounded-3xl border p-5 ${slot.borderColor} flex flex-col justify-between space-y-3 bg-white shadow-xs dark:bg-zinc-900`}
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <div className={`rounded-xl p-2 ${slot.badgeBg}`}>
                    {slot.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {slot.title}
                    </h3>
                  </div>
                </div>

                {/* Assigned Task Card or Picker */}
                {task ? (
                  <div
                    className={`space-y-2 rounded-2xl border p-3 transition-all ${
                      isDone
                        ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                        : "border-zinc-200/70 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
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
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-zinc-300 hover:text-emerald-500" />
                        )}
                      </button>

                      <p
                        className={`line-clamp-2 text-xs leading-snug font-bold ${
                          isDone
                            ? "text-zinc-400 line-through"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-200/50 pt-1 text-[10px] text-zinc-400 dark:border-zinc-800/80">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{task.duration_min || 45}m</span>
                      </span>

                      <button
                        onClick={() => onViewDetails(task)}
                        className="flex cursor-pointer items-center gap-0.5 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <Eye className="h-3 w-3" />
                        <span>{t.common.details}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    {slot.desc}
                  </p>
                )}
              </div>

              {/* Selector dropdown to change or assign */}
              <div className="pt-2">
                <select
                  value={task?.id || ""}
                  onChange={(e) => handleAssignSlot(slot.id, e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 focus:ring-1 focus:ring-zinc-400 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <option value="">{t.todayPlan.selectTask}</option>
                  {todayTasks.map((tItem) => (
                    <option key={tItem.id} value={tItem.id}>
                      {tItem.title} ({tItem.task_type})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
