"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { toggleHabitLog, deleteHabit } from "@/lib/actions/habits";
import { HABIT_CATEGORIES, type HabitCategory } from "@/lib/schemas/habits";
import type { HabitWithStats } from "@/lib/logic/habits";
import type { HabitRow } from "@/lib/supabase/types";
import { HabitModal } from "./habit-modal";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  RotateCcw,
  Edit,
  Trash2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface HabitsViewProps {
  habits: HabitWithStats[];
  weekDates: string[];
  todayDate: string;
}

export function HabitsView({ habits, weekDates, todayDate }: HabitsViewProps) {
  const { t } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<HabitRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredHabits = habits.filter((h) => {
    if (selectedCategory !== "all" && h.category !== selectedCategory) return false;
    return true;
  });

  const handleToggle = (habitId: string, dateStr: string, currentCompleted: boolean) => {
    startTransition(async () => {
      await toggleHabitLog({
        habit_id: habitId,
        log_date: dateStr,
        completed: !currentCompleted,
      });
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm(t.habitsPage.deleteConfirm)) return;
    startTransition(async () => {
      await deleteHabit(id);
    });
  };

  const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay();
    const dayName = dayNames[dayOfWeek];
    const isToday = dateStr === todayDate;
    const formatted = `${d.getDate()}/${d.getMonth() + 1}`;
    return { dayName, formatted, isToday };
  };

  const categoryMap: Record<HabitCategory, string> = {
    health_routine: t.habitsPage.categories.healthRoutine,
    deep_work: t.habitsPage.categories.deepWork,
    revenue: t.habitsPage.categories.revenue,
    learning: t.habitsPage.categories.learning,
    relationship: t.habitsPage.categories.relationship,
    finance: t.habitsPage.categories.finance,
    personal: t.habitsPage.categories.personal,
  };

  // Overall Weekly Completion
  const totalTargetSlots = habits.reduce((acc, h) => acc + (h.target_per_week || 7), 0);
  const totalCompletedSlots = habits.reduce((acc, h) => acc + h.completedDaysThisWeek, 0);
  const overallPercent = totalTargetSlots > 0 ? Math.round((totalCompletedSlots / totalTargetSlots) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Flame className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {t.habitsPage.title}
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t.habitsPage.subtitle}
          </p>
        </div>

        <Button
          onClick={() => {
            setHabitToEdit(null);
            setModalOpen(true);
          }}
          className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 me-1.5" />
          {t.habitsPage.newHabit}
        </Button>
      </div>

      {/* Restart Today Banner (§30 Anti-Streak Obsession) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20 shrink-0">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.habitsPage.restartTodayTitle}
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                Anti-Guilt
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
              {t.habitsPage.restartTodayDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/80 dark:bg-zinc-900/80 px-4 py-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 shrink-0">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              إنجاز الأسبوع
            </div>
            <div className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {totalCompletedSlots} / {totalTargetSlots} يوم
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 flex items-center justify-center font-black text-xs text-orange-600 dark:text-orange-400">
            {overallPercent}%
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {t.common.all} ({habits.length})
        </button>

        {HABIT_CATEGORIES.map((cat) => {
          const count = habits.filter((h) => h.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {categoryMap[cat] || cat} ({count})
            </button>
          );
        })}
      </div>

      {/* 7-Day Habit Matrix */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40">
                <th className="p-4 text-xs font-black text-zinc-700 dark:text-zinc-300 min-w-[220px]">
                  العادة والمستهدف
                </th>
                {weekDates.map((dateStr) => {
                  const { dayName, formatted, isToday } = getDayLabel(dateStr);
                  return (
                    <th
                      key={dateStr}
                      className={`p-3 text-center min-w-[70px] ${
                        isToday ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 font-black" : "text-zinc-600 dark:text-zinc-400 font-bold"
                      }`}
                    >
                      <div className="text-[11px]">{dayName}</div>
                      <div className="text-[10px] font-mono opacity-80">{formatted}</div>
                      {isToday && (
                        <div className="text-[9px] font-black text-orange-600 dark:text-orange-400">
                          (اليوم)
                        </div>
                      )}
                    </th>
                  );
                })}
                <th className="p-4 text-center text-xs font-black text-zinc-700 dark:text-zinc-300 min-w-[120px]">
                  الالتزام الأسبوعي
                </th>
                <th className="p-4 text-center text-xs font-black text-zinc-700 dark:text-zinc-300 w-16">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredHabits.length === 0 ? (
                <tr>
                  <td colSpan={weekDates.length + 3} className="p-8 text-center text-zinc-400">
                    لا توجد عادات مسجلة في هذا التصنيف.
                  </td>
                </tr>
              ) : (
                filteredHabits.map((h) => {
                  const target = h.target_per_week || 7;
                  const isGoalMet = h.completedDaysThisWeek >= target;

                  return (
                    <tr
                      key={h.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Habit Name & Category */}
                      <td className="p-4">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                            <Zap className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                              {h.name}
                              {h.currentStreak > 1 && (
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-0.5">
                                  🔥 {h.currentStreak}d
                                </span>
                              )}
                              {h.needsRestartToday && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                  ابدأ اليوم 🌱
                                </span>
                              )}
                            </div>
                            {h.description && (
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                {h.description}
                              </p>
                            )}
                            <span className="inline-block text-[10px] font-bold text-orange-600 dark:text-orange-400 mt-1">
                              {categoryMap[h.category] || h.category} • المستهدف: {target} أيام
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 7 Days Checkboxes */}
                      {weekDates.map((dateStr) => {
                        const isDone = !!h.recentLogs[dateStr];
                        const isToday = dateStr === todayDate;

                        return (
                          <td
                            key={dateStr}
                            className={`p-3 text-center ${isToday ? "bg-orange-500/5" : ""}`}
                          >
                            <button
                              onClick={() => handleToggle(h.id, dateStr, isDone)}
                              disabled={isPending}
                              className={`p-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center ${
                                isDone
                                  ? "bg-emerald-500 text-white shadow-xs scale-105"
                                  : "text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              }`}
                              title={isDone ? "تم الإنجاز (اضغط للإلغاء)" : "اضغط للتعليم كمنجز"}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-5 w-5 fill-emerald-500 text-white" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Weekly Target Progress */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-[11px] font-black text-zinc-800 dark:text-zinc-200">
                            <span>{h.completedDaysThisWeek} / {target}</span>
                            {isGoalMet && (
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </div>
                          <div className="w-20 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isGoalMet ? "bg-emerald-500" : "bg-orange-500"
                              }`}
                              style={{ width: `${Math.min(100, (h.completedDaysThisWeek / target) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setHabitToEdit(h);
                              setModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            title={t.common.edit}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(h.id)}
                            className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title={t.common.delete}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <HabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        habitToEdit={habitToEdit}
      />
    </div>
  );
}
