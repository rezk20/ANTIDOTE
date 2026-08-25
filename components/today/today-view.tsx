"use client";

import { useState, useTransition } from "react";
import { reopenDayPlan } from "@/lib/actions/day-plan";
import { MorningMissionHeader } from "./morning-mission-header";
import { FocusQuestionCard } from "./focus-question-card";
import { TopThreeSlots } from "./top-three-slots";
import { ActionTriadSlots } from "./action-triad-slots";
import { TodayTaskList } from "./today-task-list";
import { ShutdownModal } from "./shutdown-modal";
import { DailyLogWidget } from "./daily-log-widget";
import { DeepWorkTimer } from "./deep-work-timer";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { TaskModal } from "@/components/tasks/task-modal";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import { Moon, CheckCircle2, RotateCcw } from "lucide-react";
import type { TodayMissionData } from "@/lib/dal/day-plan";
import type { TaskRow, GoalRow, ProjectRow, DailyLogRow } from "@/lib/supabase/types";
import type { CapacityAdvice } from "@/lib/logic/daily-log";
import { calculateWeeklyTimeDistribution, type WeeklyTimeDistribution } from "@/lib/logic/time-tracking";

const DEFAULT_WEEKLY_DISTRIBUTION = calculateWeeklyTimeDistribution([]);

export function TodayView({
  data,
  goals = [],
  projects = [],
  dailyLog = null,
  capacityAdvice = {
    capacity: "normal",
    maxCoreTasks: 2,
    messageAr: "طاقة متوازنة",
    messageEn: "Balanced energy",
  },
  weeklyTimeDistribution = DEFAULT_WEEKLY_DISTRIBUTION,
}: {
  data: TodayMissionData;
  goals?: GoalRow[];
  projects?: ProjectRow[];
  dailyLog?: DailyLogRow | null;
  capacityAdvice?: CapacityAdvice;
  weeklyTimeDistribution?: WeeklyTimeDistribution;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskRow | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);

  const isDayClosed = data.dayPlan?.status === "closed";

  function handleViewDetails(task: TaskRow) {
    setSelectedTask(task);
    setIsDetailOpen(true);
  }

  function handleAddTask() {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  }

  function handleEditTask(task: TaskRow) {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  }

  function handleReopenDay() {
    startTransition(async () => {
      await reopenDayPlan(data.selectedDate);
    });
  }

  return (
    <div className="space-y-6">
      {/* Closed Day Notice Banner */}
      {isDayClosed && (
        <div className="animate-in fade-in flex flex-col justify-between gap-3 rounded-3xl border border-purple-200 bg-purple-50 p-4 sm:flex-row sm:items-center dark:border-purple-800 dark:bg-purple-950/60">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/60 dark:text-purple-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-purple-900 dark:text-purple-100">
                {t.todayPlan.dayClosed}
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                {t.todayPlan.dayClosedDesc}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={handleReopenDay}
            className="shrink-0 gap-1.5 rounded-xl text-xs font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>
              {isPending ? t.todayPlan.reopeningDay : t.todayPlan.reopenDay}
            </span>
          </Button>
        </div>
      )}

      {/* Morning Mission Header */}
      <MorningMissionHeader
        dayPlan={data.dayPlan}
        capacity={data.capacity}
        isFriday={data.isFriday}
        selectedDate={data.selectedDate}
      />

      {/* Daily Sleep & Energy Log Widget */}
      <DailyLogWidget
        initialLog={dailyLog}
        advice={capacityAdvice}
        todayDate={data.selectedDate}
      />

      {/* "The One Thing" Focus Question Card */}
      <FocusQuestionCard
        dayPlan={data.dayPlan}
        selectedDate={data.selectedDate}
      />

      {/* Top 3 Priorities Board */}
      <TopThreeSlots
        topThreeTasks={data.topThreeTasks}
        onViewDetails={handleViewDetails}
        onOpenTaskPicker={handleAddTask}
      />

      {/* Deep Work Timer Session */}
      <DeepWorkTimer
        plannedTasks={data.todayTasks}
        weeklyDistribution={weeklyTimeDistribution}
      />

      {/* Action Triad Slots */}
      <ActionTriadSlots
        dayPlan={data.dayPlan}
        todayTasks={data.todayTasks}
        moneyActionTask={data.moneyActionTask}
        personalActionTask={data.personalActionTask}
        relationshipActionTask={data.relationshipActionTask}
        selectedDate={data.selectedDate}
        onViewDetails={handleViewDetails}
      />

      {/* Today's Tasks Execution List */}
      <TodayTaskList
        tasks={data.todayTasks}
        selectedDate={data.selectedDate}
        onViewDetails={handleViewDetails}
        onAddTask={handleAddTask}
      />

      {/* Evening Shutdown Action Footer */}
      {!isDayClosed && (
        <div className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-md dark:bg-zinc-900 dark:text-white">
          <div className="space-y-0.5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold">
              <Moon className="h-4 w-4 text-purple-400" />
              <span>{t.todayPlan.shutdownDay}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              {isRtl
                ? "حسم مهام اليوم، ترحيل المتبقي للغد، والمراجعة اليومية."
                : "Wrap up today, review wins, and set tomorrow's starting focus."}
            </p>
          </div>

          <Button
            size="md"
            onClick={() => setIsShutdownOpen(true)}
            className="shrink-0 gap-1.5 rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700"
          >
            <Moon className="h-4 w-4" />
            <span>{t.todayPlan.shutdownDay}</span>
          </Button>
        </div>
      )}

      {/* Shutdown Modal */}
      <ShutdownModal
        isOpen={isShutdownOpen}
        onClose={() => setIsShutdownOpen(false)}
        selectedDate={data.selectedDate}
        summary={data.shutdownSummary}
      />

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        goals={goals}
        projects={projects}
        defaultDate={data.selectedDate}
      />

      {/* Task Detail Peek Modal ("Eye" Icon) */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        goals={goals}
        projects={projects}
        onEdit={() => {
          if (selectedTask) handleEditTask(selectedTask);
        }}
      />
    </div>
  );
}
