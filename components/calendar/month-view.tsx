"use client";

import type { TaskRow, ProjectRow, MarriageExpenseRow, DayPlanRow } from "@/lib/supabase/types";
import { Briefcase, Heart, Sun } from "lucide-react";

interface MonthViewProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  tasks: TaskRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
  dayPlans?: DayPlanRow[];
}

export function MonthView({
  selectedDate,
  onSelectDate,
  tasks,
  projects,
  marriageExpenses,
  dayPlans = [],
}: MonthViewProps) {
  const d = new Date(selectedDate);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0 to 11

  // First day of month (0 to 6)
  const firstDay = new Date(year, month, 1).getDay();
  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNamesAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells = [];
  // Empty padding cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    cells.push(`${year}-${monthStr}-${dayStr}`);
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        {dayNamesAr.map((name, i) => (
          <div
            key={name}
            className={`text-center text-xs font-black py-1 ${
              i === 5 ? "text-pink-600 dark:text-pink-400" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((dateStr, idx) => {
          if (!dateStr) {
            return (
              <div
                key={`empty_${idx}`}
                className="p-2 rounded-2xl bg-zinc-50/20 dark:bg-zinc-800/10 min-h-[95px] border border-transparent"
              />
            );
          }

          const dayNum = parseInt(dateStr.slice(8, 10), 10);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const cellDate = new Date(dateStr);
          const isFriday = cellDate.getDay() === 5;

          const dayPlan = dayPlans.find((dp) => dp.plan_date === dateStr);
          const dayTasks = tasks.filter((t) => t.deadline === dateStr);
          const dayProjects = projects.filter((p) => p.deadline === dateStr);
          const dayMarriage = marriageExpenses.filter((m) => m.deadline === dateStr);

          const totalItems =
            (dayPlan ? 1 : 0) + dayTasks.length + dayProjects.length + dayMarriage.length;

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`p-2 rounded-2xl border transition-all cursor-pointer min-h-[105px] flex flex-col justify-between ${
                isSelected
                  ? "ring-2 ring-zinc-900 dark:ring-zinc-100 bg-zinc-50 dark:bg-zinc-800"
                  : isFriday
                  ? "bg-pink-50/20 dark:bg-pink-950/10 border-pink-100 dark:border-pink-900/30"
                  : "bg-zinc-50/40 dark:bg-zinc-800/20 border-zinc-200/50 dark:border-zinc-800 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isToday
                      ? "px-1.5 py-0.5 rounded-md bg-orange-500 text-white font-black"
                      : isFriday
                      ? "text-pink-600 dark:text-pink-400 font-black"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {dayNum}
                </span>

                {totalItems > 0 && (
                  <span className="text-[9px] font-mono font-bold text-zinc-400">
                    {totalItems}
                  </span>
                )}
              </div>

              {/* Event Mini Chips */}
              <div className="space-y-1 my-1 overflow-hidden">
                {/* Day Plan Chip */}
                {dayPlan && (
                  <div
                    className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[9px] font-black truncate flex items-center gap-0.5"
                    title={`خطة يوم جاهزة (${dayPlan.available_hours}h)`}
                  >
                    <Sun className="h-2.5 w-2.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>خطة جاهزة ({dayPlan.available_hours}h)</span>
                  </div>
                )}

                {dayProjects.map((p) => (
                  <div
                    key={p.id}
                    className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[9px] font-bold truncate flex items-center gap-0.5"
                    title={`مشروع: ${p.name}`}
                  >
                    <Briefcase className="h-2.5 w-2.5 shrink-0" />
                    <span>{p.name}</span>
                  </div>
                ))}

                {dayMarriage.map((m) => (
                  <div
                    key={m.id}
                    className="px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 text-[9px] font-bold truncate flex items-center gap-0.5"
                    title={`زواج: ${m.item}`}
                  >
                    <Heart className="h-2.5 w-2.5 shrink-0" />
                    <span>{m.item}</span>
                  </div>
                ))}

                {dayTasks.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200 text-[9px] font-medium truncate"
                    title={t.title}
                  >
                    {t.title}
                  </div>
                ))}

                {dayTasks.length > 2 && (
                  <div className="text-[9px] font-bold text-zinc-400 text-end">
                    +{dayTasks.length - 2} المزيد
                  </div>
                )}
              </div>

              <div />
            </div>
          );
        })}
      </div>
    </div>
  );
}
