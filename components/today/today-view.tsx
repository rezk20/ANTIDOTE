"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { reopenDayPlan } from "@/lib/actions/day-plan";
import { MorningMissionHeader } from "./morning-mission-header";
import { FocusQuestionCard } from "./focus-question-card";
import { TodayStepsTaskList } from "./today-steps-task-list";
import { ActionTriadSlots } from "./action-triad-slots";
import { ShutdownModal } from "./shutdown-modal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { TaskModal } from "@/components/tasks/task-modal";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Zap,
  Moon,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { TodayMissionData } from "@/lib/dal/day-plan";
import type { TaskRow, GoalRow, ProjectRow } from "@/lib/supabase/types";

export function TodayView({
  data,
  goals = [],
  projects = [],
}: {
  data: TodayMissionData;
  goals?: GoalRow[];
  projects?: ProjectRow[];
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
    <div className="space-y-8 animate-in fade-in duration-150">
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

      {/* 1. Morning Mission Header & Available Capacity */}
      <MorningMissionHeader
        dayPlan={data.dayPlan}
        capacity={data.capacity}
        isFriday={data.isFriday}
        selectedDate={data.selectedDate}
      />

      {/* 2. "The One Thing" Focus Question Card */}
      <FocusQuestionCard
        dayPlan={data.dayPlan}
        selectedDate={data.selectedDate}
      />

      {/* 3. Steps Sequential Priority Tasks Roadmap */}
      <TodayStepsTaskList
        tasks={data.todayTasks}
        projects={projects}
        goals={goals}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onViewDetails={handleViewDetails}
      />

      {/* 4. Action Triad Slots Summary */}
      <ActionTriadSlots
        dayPlan={data.dayPlan}
        todayTasks={data.todayTasks}
        moneyActionTask={data.moneyActionTask}
        personalActionTask={data.personalActionTask}
        relationshipActionTask={data.relationshipActionTask}
        selectedDate={data.selectedDate}
        onViewDetails={handleViewDetails}
      />

      {/* 5. Quick Transition Card to /energy */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-emerald-500/10 border border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-xs">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {isRtl ? "مؤشرات الطاقة ومؤقت العمل العميق" : "Energy & Deep Work Timer"}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRtl
                ? "تتبع ساعات النوم، تقييم الطاقة، وجلسات مؤقت التركيز (بومودورو) في صفحة مخصصة."
                : "Sleep logs, bio-rhythms, and Pomodoro deep work timers in their dedicated space."}
            </p>
          </div>
        </div>

        <Link
          href={`/energy?date=${data.selectedDate}`}
          className="px-4 py-2 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-white transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
        >
          <span>{isRtl ? "فتح صفحة الطاقة والبيوريثم" : "Open Energy Dashboard"}</span>
          {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Link>
      </div>

      {/* Evening Shutdown Trigger Button */}
      {!isDayClosed && (
        <div className="flex justify-center pt-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsShutdownOpen(true)}
            className="gap-2.5 rounded-2xl border-purple-200 px-6 text-xs font-black text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/40 cursor-pointer shadow-xs"
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
        summary={data.shutdownSummary}
        selectedDate={data.selectedDate}
      />

      {/* Task Add / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        goals={goals}
        projects={projects}
        defaultDate={data.selectedDate}
      />

      {/* Task Details Modal */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        goals={goals}
        projects={projects}
        onEdit={() => {
          if (selectedTask) {
            setIsDetailOpen(false);
            handleEditTask(selectedTask);
          }
        }}
      />
    </div>
  );
}
