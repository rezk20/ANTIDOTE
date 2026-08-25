"use client";

import type { GoalRow, ProjectRow, MarriageExpenseRow } from "@/lib/supabase/types";
import { Target, Trophy } from "lucide-react";

interface YearViewProps {
  selectedDate: string;
  onSelectMonth: (yearMonth: string) => void;
  goals: GoalRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
}

export function YearView({
  selectedDate,
  onSelectMonth,
  goals,
  projects,
  marriageExpenses,
}: YearViewProps) {
  const d = new Date(selectedDate);
  const currentYear = d.getFullYear();

  const monthNamesAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];

  const quarters = [
    { name: "الربع الأول (Q1)", months: [0, 1, 2] },
    { name: "الربع الثاني (Q2)", months: [3, 4, 5] },
    { name: "الربع الثالث (Q3)", months: [6, 7, 8] },
    { name: "الربع الرابع (Q4)", months: [9, 10, 11] },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
            خريطة المعالم والأهداف السنوية لعام {currentYear}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            نظرة استراتيجية شاملة على أهداف الأرباع السنوية وتسليمات المشاريع الكبرى.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300">
          <Target className="h-4 w-4 text-purple-500" />
          <span>{goals.length} أهداف استراتيجية</span>
        </div>
      </div>

      {/* 4 Quarters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quarters.map((q) => (
          <div
            key={q.name}
            className="p-4 rounded-2xl bg-zinc-50/60 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-3"
          >
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              <span>{q.name}</span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold">
                {currentYear}
              </span>
            </div>

            <div className="space-y-2">
              {q.months.map((mIdx) => {
                const monthNumStr = String(mIdx + 1).padStart(2, "0");
                const yearMonth = `${currentYear}-${monthNumStr}`;
                const mProjects = projects.filter((p) =>
                  p.deadline?.startsWith(yearMonth),
                );
                const mMarriage = marriageExpenses.filter((m) =>
                  m.deadline?.startsWith(yearMonth),
                );

                return (
                  <button
                    key={yearMonth}
                    onClick={() => onSelectMonth(yearMonth)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-400 text-start cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">
                        {monthNamesAr[mIdx]}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {mProjects.length} مشاريع • {mMarriage.length} أقساط
                      </div>
                    </div>

                    {(mProjects.length > 0 || mMarriage.length > 0) && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Goals List */}
      {goals.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            الأهداف الكبرى للعام
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1"
              >
                <div className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {g.title}
                </div>
                {g.period_end && (
                  <div className="text-[10px] text-zinc-500 font-mono">
                    المستهدف: {g.period_end}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
