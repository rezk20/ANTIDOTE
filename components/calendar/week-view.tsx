"use client";

import type {
  TaskRow,
  ProjectRow,
  MarriageExpenseRow,
  DayPlanRow,
} from "@/lib/supabase/types";
import { Heart, Briefcase, CheckCircle2, Zap, Sun } from "lucide-react";

interface WeekViewProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  tasks: TaskRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
  dayPlans?: DayPlanRow[];
}

export function WeekView({
  selectedDate,
  onSelectDate,
  tasks,
  projects,
  marriageExpenses,
  dayPlans = [],
}: WeekViewProps) {
  // Compute 7 days of the week containing selectedDate
  const current = new Date(selectedDate);
  const dayOfWeek = current.getDay(); // 0 (Sun) to 6 (Sat)
  const sunday = new Date(current);
  sunday.setDate(current.getDate() - dayOfWeek);

  const weekDays: {
    dateStr: string;
    dayName: string;
    dayNumber: number;
    isFriday: boolean;
    isSelected: boolean;
    isToday: boolean;
  }[] = [];
  const dayNamesAr = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const todayStr = new Date().toISOString().slice(0, 10);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    weekDays.push({
      dateStr,
      dayName: dayNamesAr[i],
      dayNumber: d.getDate(),
      isFriday: i === 5,
      isSelected: dateStr === selectedDate,
      isToday: dateStr === todayStr,
    });
  }

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* 7-Column Week Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-7">
        {weekDays.map((day) => {
          const dayPlan = dayPlans.find((dp) => dp.plan_date === day.dateStr);
          const dayTasks = tasks.filter(
            (t) =>
              t.scheduled_date === day.dateStr || t.deadline === day.dateStr,
          );
          const dayProjects = projects.filter(
            (p) => p.deadline === day.dateStr,
          );
          const dayMarriage = marriageExpenses.filter(
            (m) => m.deadline === day.dateStr,
          );

          const totalItems =
            (dayPlan ? 1 : 0) +
            dayTasks.length +
            dayProjects.length +
            dayMarriage.length;

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={`flex min-h-[240px] cursor-pointer flex-col justify-between rounded-2xl border p-3.5 transition-all ${
                day.isSelected
                  ? "bg-zinc-50/80 ring-1 ring-zinc-900 dark:bg-zinc-800/80 dark:ring-violet-100"
                  : day.isFriday
                    ? "border-pink-200/60 bg-pink-50/30 dark:border-pink-800/40 dark:bg-pink-950/20"
                    : "border-zinc-200/60 bg-zinc-50/40 hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-zinc-800/30"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-zinc-200/40 pb-2 dark:border-zinc-700/40">
                <div>
                  <div className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">
                    {day.dayName}
                  </div>
                  <div className="font-mono text-xs font-bold text-zinc-500">
                    {day.dayNumber}
                  </div>
                </div>

                {day.isFriday ? (
                  <span className="flex items-center gap-0.5 rounded-md bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                    <Heart className="h-2.5 w-2.5 fill-pink-500" />
                    محمي
                  </span>
                ) : day.isToday ? (
                  <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                    اليوم
                  </span>
                ) : null}
              </div>

              {/* Items / Deadlines */}
              <div className="scrollbar-none my-2 max-h-[160px] flex-1 space-y-1.5 overflow-y-auto">
                {/* Day Plan Chip */}
                {dayPlan && (
                  <div
                    className="line-clamp-1 flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-100/80 p-1.5 text-[10px] font-black text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-300"
                    title={`خطة يوم جاهزة (${dayPlan.available_hours}h)`}
                  >
                    <Sun className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>خطة جاهزة ({dayPlan.available_hours}h)</span>
                  </div>
                )}

                {/* Projects */}
                {dayProjects.map((p) => (
                  <div
                    key={p.id}
                    className="line-clamp-1 flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-[10px] font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                    title={`تسليم مشروع: ${p.name}`}
                  >
                    <Briefcase className="h-3 w-3 shrink-0" />
                    <span>{p.name}</span>
                  </div>
                ))}

                {/* Marriage payments */}
                {dayMarriage.map((m) => (
                  <div
                    key={m.id}
                    className="line-clamp-1 flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 p-1.5 text-[10px] font-bold text-pink-700 dark:border-pink-800 dark:bg-pink-950/40 dark:text-pink-300"
                    title={`دفعة زواج: ${m.item}`}
                  >
                    <Heart className="h-3 w-3 shrink-0" />
                    <span>{m.item}</span>
                  </div>
                ))}

                {/* Tasks */}
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className={`line-clamp-1 flex items-center gap-1 rounded-lg border p-1.5 text-[10px] font-medium ${
                      t.status === "done"
                        ? "border-emerald-200 bg-emerald-50/50 text-zinc-400 line-through dark:bg-emerald-950/20"
                        : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    }`}
                    title={t.title}
                  >
                    {t.status === "done" ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                    ) : (
                      <Zap className="h-3 w-3 shrink-0 text-amber-500" />
                    )}
                    <span>{t.title}</span>
                  </div>
                ))}

                {totalItems === 0 && (
                  <div className="py-4 text-center text-[10px] text-zinc-400">
                    {day.isFriday ? "وقت هادئ وراحة ☕" : "لا توجد مواعيد"}
                  </div>
                )}
              </div>

              {/* Total items badge */}
              <div className="border-t border-zinc-200/40 pt-1 text-end text-[10px] font-bold text-zinc-400 dark:border-zinc-700/40">
                {totalItems} عناصر
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
