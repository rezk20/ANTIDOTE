"use client";

import { useState } from "react";
import type { CalendarPageData } from "@/lib/dal/calendar";
import type { CalendarViewMode } from "@/lib/logic/schedule";
import { CalendarHeader } from "./calendar-header";
import { CashFlowStrip } from "./cashflow-strip";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import { YearView } from "./year-view";
import { CollisionAlertModal } from "./collision-alert-modal";

interface CalendarViewProps {
  data: CalendarPageData;
}

export function CalendarView({ data }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<string>(data.selectedDate);
  const [collisionsModalOpen, setCollisionsModalOpen] = useState(false);

  const handleSelectDateAndGoDay = (dateStr: string) => {
    setSelectedDate(dateStr);
    setViewMode("day");
  };

  const handleSelectMonthAndGoMonth = (yearMonth: string) => {
    setSelectedDate(`${yearMonth}-01`);
    setViewMode("month");
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header & View Switcher */}
      <CalendarHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        collisions={data.collisions}
        onOpenCollisionsModal={() => setCollisionsModalOpen(true)}
      />

      {/* Cash Flow Projection Strip (§116) */}
      <CashFlowStrip projection={data.cashFlowProjection} />

      {/* Main View Render */}
      {viewMode === "day" && (
        <DayView
          selectedDate={selectedDate}
          routines={data.routines}
          tasks={data.tasks}
          projects={data.projects}
          marriageExpenses={data.marriageExpenses}
          timeEntries={data.timeEntries}
          dayPlans={data.dayPlans}
        />
      )}

      {viewMode === "week" && (
        <WeekView
          selectedDate={selectedDate}
          onSelectDate={handleSelectDateAndGoDay}
          tasks={data.tasks}
          projects={data.projects}
          marriageExpenses={data.marriageExpenses}
        />
      )}

      {viewMode === "month" && (
        <MonthView
          selectedDate={selectedDate}
          onSelectDate={handleSelectDateAndGoDay}
          tasks={data.tasks}
          projects={data.projects}
          marriageExpenses={data.marriageExpenses}
          dayPlans={data.dayPlans}
        />
      )}

      {viewMode === "year" && (
        <YearView
          selectedDate={selectedDate}
          onSelectMonth={handleSelectMonthAndGoMonth}
          goals={data.goals}
          projects={data.projects}
          marriageExpenses={data.marriageExpenses}
        />
      )}

      {/* Collisions Alert Modal */}
      <CollisionAlertModal
        isOpen={collisionsModalOpen}
        onClose={() => setCollisionsModalOpen(false)}
        collisions={data.collisions}
      />
    </div>
  );
}
