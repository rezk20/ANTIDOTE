"use client";

import { generateDayTimeBlocks } from "@/lib/logic/schedule";
import type { RoutineRow, TaskRow, TimeEntryRow, ProjectRow, MarriageExpenseRow } from "@/lib/supabase/types";
import {
  CheckCircle2,
  Sun,
  Briefcase,
  Flame,
  Heart,
  Sparkles,
  Coffee,
} from "lucide-react";

interface DayViewProps {
  selectedDate: string;
  routines: RoutineRow[];
  tasks: TaskRow[];
  projects?: ProjectRow[];
  marriageExpenses?: MarriageExpenseRow[];
  timeEntries: TimeEntryRow[];
}

export function DayView({
  selectedDate,
  routines,
  tasks,
  projects = [],
  marriageExpenses = [],
  timeEntries,
}: DayViewProps) {
  const dayTasks = tasks.filter(
    (t) => t.scheduled_date === selectedDate || t.deadline === selectedDate,
  );
  const dayProjects = projects.filter((p) => p.deadline === selectedDate);
  const dayMarriage = marriageExpenses.filter((m) => m.deadline === selectedDate);

  const timeBlocks = generateDayTimeBlocks({
    routines,
    tasks: dayTasks,
    projects: dayProjects,
    marriageExpenses: dayMarriage,
    dateStr: selectedDate,
  });

  const dayTimeEntries = timeEntries.filter((e) =>
    e.started_at.startsWith(selectedDate),
  );

  const d = new Date(selectedDate);
  const isFriday = d.getDay() === 5;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              الجدول الزمني والكتل اليومية لـ {selectedDate}
            </h3>
            {isFriday ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center gap-1">
                <Heart className="h-3 w-3 fill-pink-500" />
                يوم الجمعة المحمي (راحة وعلاقة)
              </span>
            ) : dayTasks.length > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {dayTasks.length} مهام مجدولة
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                فترة عمل حرة
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {isFriday
              ? "يوم مخصص للراحة الأسبوعية والأسرة وشحن الطاقة بدون التزامات عمل مضغوطة."
              : "توزيع متسلسل للروتين الصباحي، ساعات العمل المركز، والروتين المسائي."}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-zinc-500 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            روتين
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            مهام عمل
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            زواج والتزامات
          </span>
        </div>
      </div>

      {/* Time Blocks Timeline */}
      <div className="space-y-3">
        {timeBlocks.map((block) => {
          const isRoutine = block.kind === "routine";
          const isTask = block.kind === "task";
          const isProject = block.kind === "project_deadline";
          const isMarriage = block.kind === "marriage_payment";
          const isProtectedRest = block.kind === "protected_rest";
          const isOpenSlot = block.kind === "open_slot";

          return (
            <div
              key={block.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isProtectedRest
                  ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-300 dark:border-pink-800/60 shadow-xs"
                  : isOpenSlot
                  ? "bg-zinc-50/50 dark:bg-zinc-800/30 border-dashed border-zinc-300 dark:border-zinc-700"
                  : isProject
                  ? "bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60"
                  : isMarriage
                  ? "bg-pink-50/60 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/60"
                  : isRoutine
                  ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-800/40"
                  : "bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isProtectedRest
                      ? "bg-pink-500 text-white"
                      : isOpenSlot
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      : isProject
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : isMarriage
                      ? "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                      : isRoutine
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {isProtectedRest ? (
                    <Coffee className="h-4 w-4" />
                  ) : isOpenSlot ? (
                    <Sparkles className="h-4 w-4" />
                  ) : isProject ? (
                    <Briefcase className="h-4 w-4" />
                  ) : isMarriage ? (
                    <Heart className="h-4 w-4" />
                  ) : isRoutine ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Briefcase className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                      {block.timeSlot}
                    </span>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {block.title}
                    </h4>
                  </div>
                  {block.subtitle && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {block.durationMin} دقيقة
                </span>
                {isTask && block.isCompleted && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    منجزة
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Logged Focus Sessions on this Day */}
      {dayTimeEntries.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-zinc-800 dark:text-zinc-200">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>جلسات العمل المسجلة لهذا اليوم ({dayTimeEntries.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {dayTimeEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-2xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/40 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    {entry.kind === "deep_work" ? "عمل عميق" : entry.kind}
                  </div>
                  {entry.note && (
                    <div className="text-[10px] text-zinc-500 line-clamp-1">
                      {entry.note}
                    </div>
                  )}
                </div>
                <div className="text-end">
                  <div className="font-black font-mono text-orange-600">
                    {entry.duration_min} د
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    تركيز: {entry.focus_rating || 4}/5 ⭐
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
