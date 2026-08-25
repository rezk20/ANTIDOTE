"use client";

import { useLocale } from "@/components/providers/locale-provider";
import type { CalendarViewMode, ScheduleCollision } from "@/lib/logic/schedule";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface CalendarHeaderProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  selectedDate: string;
  onDateChange: (dateStr: string) => void;
  collisions: ScheduleCollision[];
  onOpenCollisionsModal: () => void;
}

export function CalendarHeader({
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
  collisions,
  onOpenCollisionsModal,
}: CalendarHeaderProps) {
  const { t, isRtl } = useLocale();

  const handlePrev = () => {
    const d = new Date(selectedDate);
    if (viewMode === "day") {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === "week") {
      d.setDate(d.getDate() - 7);
    } else if (viewMode === "month") {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === "year") {
      d.setFullYear(d.getFullYear() - 1);
    }
    onDateChange(d.toISOString().slice(0, 10));
  };

  const handleNext = () => {
    const d = new Date(selectedDate);
    if (viewMode === "day") {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === "week") {
      d.setDate(d.getDate() + 7);
    } else if (viewMode === "month") {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === "year") {
      d.setFullYear(d.getFullYear() + 1);
    }
    onDateChange(d.toISOString().slice(0, 10));
  };

  const handleToday = () => {
    onDateChange(new Date().toISOString().slice(0, 10));
  };

  const d = new Date(selectedDate);
  const monthNamesAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const formattedTitle =
    viewMode === "year"
      ? `${d.getFullYear()}`
      : `${monthNamesAr[d.getMonth()]} ${d.getFullYear()}${
          viewMode === "day" ? ` - ${d.getDate()}` : ""
        }`;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 md:p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
      {/* Title & Navigation */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <CalendarIcon className="h-5 w-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {formattedTitle}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="text-[11px] font-bold px-2 py-0.5 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 cursor-pointer"
            >
              {t.calendarPage.today}
            </Button>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {t.calendarPage.subtitle}
          </p>
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1 ms-2">
          <button
            onClick={isRtl ? handleNext : handlePrev}
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            title={t.calendarPage.prev}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={isRtl ? handlePrev : handleNext}
            className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            title={t.calendarPage.next}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right Controls: View Modes & Collision Badge */}
      <div className="flex items-center gap-2">
        {/* Collisions Warning Trigger */}
        {collisions.length > 0 && (
          <button
            onClick={onOpenCollisionsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 cursor-pointer transition-all animate-pulse"
          >
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>
              {collisions.length} {t.calendarPage.collisionsBadge}
            </span>
          </button>
        )}

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
          <button
            onClick={() => onViewModeChange("day")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "day"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.calendarPage.modes.day}
          </button>
          <button
            onClick={() => onViewModeChange("week")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "week"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.calendarPage.modes.week}
          </button>
          <button
            onClick={() => onViewModeChange("month")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "month"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.calendarPage.modes.month}
          </button>
          <button
            onClick={() => onViewModeChange("year")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === "year"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.calendarPage.modes.year}
          </button>
        </div>
      </div>
    </div>
  );
}
