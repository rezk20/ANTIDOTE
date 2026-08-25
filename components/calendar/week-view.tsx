"use client";

import type { TaskRow, ProjectRow, MarriageExpenseRow } from "@/lib/supabase/types";
import { Heart, Briefcase, CheckCircle2, Zap } from "lucide-react";

interface WeekViewProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  tasks: TaskRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
}

export function WeekView({
  selectedDate,
  onSelectDate,
  tasks,
  projects,
  marriageExpenses,
}: WeekViewProps) {
  // Compute 7 days of the week containing selectedDate
  const current = new Date(selectedDate);
  const dayOfWeek = current.getDay(); // 0 (Sun) to 6 (Sat)
  const sunday = new Date(current);
  sunday.setDate(current.getDate() - dayOfWeek);

  const weekDays: { dateStr: string; dayName: string; dayNumber: number; isFriday: boolean; isSelected: boolean; isToday: boolean }[] = [];
  const dayNamesAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
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
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
      {/* 7-Column Week Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayTasks = tasks.filter((t) => t.deadline === day.dateStr);
          const dayProjects = projects.filter((p) => p.deadline === day.dateStr);
          const dayMarriage = marriageExpenses.filter((m) => m.deadline === day.dateStr);

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                day.isSelected
                  ? "ring-2 ring-zinc-900 dark:ring-zinc-100 bg-zinc-50/80 dark:bg-zinc-800/80"
                  : day.isFriday
                  ? "bg-pink-50/30 dark:bg-pink-950/20 border-pink-200/60 dark:border-pink-800/40"
                  : "bg-zinc-50/40 dark:bg-zinc-800/30 border-zinc-200/60 dark:border-zinc-700/50 hover:border-zinc-300"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/40 dark:border-zinc-700/40">
                <div>
                  <div className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">
                    {day.dayName}
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-500">
                    {day.dayNumber}
                  </div>
                </div>

                {day.isFriday ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center gap-0.5">
                    <Heart className="h-2.5 w-2.5 fill-pink-500" />
                    محمي
                  </span>
                ) : day.isToday ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                    اليوم
                  </span>
                ) : null}
              </div>

              {/* Items / Deadlines */}
              <div className="space-y-1.5 my-2 flex-1 overflow-y-auto max-h-[140px] scrollbar-none">
                {/* Projects */}
                {dayProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-700 dark:text-blue-300 line-clamp-1 flex items-center gap-1"
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
                    className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-[10px] font-bold text-pink-700 dark:text-pink-300 line-clamp-1 flex items-center gap-1"
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
                    className={`p-1.5 rounded-lg border text-[10px] font-medium line-clamp-1 flex items-center gap-1 ${
                      t.status === "done"
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 text-zinc-400 line-through"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                    }`}
                    title={t.title}
                  >
                    {t.status === "done" ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    ) : (
                      <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                    )}
                    <span>{t.title}</span>
                  </div>
                ))}

                {dayTasks.length === 0 && dayProjects.length === 0 && dayMarriage.length === 0 && (
                  <div className="text-[10px] text-zinc-400 text-center py-4">
                    {day.isFriday ? "وقت هادئ وراحة ☕" : "لا توجد مواعيد"}
                  </div>
                )}
              </div>

              {/* Total items badge */}
              <div className="text-[10px] font-bold text-zinc-400 text-end pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                {dayTasks.length + dayProjects.length + dayMarriage.length} عناصر
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
