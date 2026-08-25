import { cache } from "react";
import { verifySession } from "./auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTasks } from "./tasks";
import { getProjects } from "./projects";
import { getMarriageExpenses, getBuckets, getAllTransactions } from "./finance";
import { getRoutines } from "./routines";
import { getGoals } from "./goals";
import { getTimeEntriesForRange } from "./time-tracking";
import { detectScheduleCollisions, type ScheduleCollision } from "@/lib/logic/schedule";
import { calculateCashFlowProjection, type CashFlowProjection } from "@/lib/logic/cashflow-calendar";
import type {
  TaskRow,
  ProjectRow,
  MarriageExpenseRow,
  RoutineRow,
  GoalRow,
  TimeEntryRow,
  DayPlanRow,
} from "@/lib/supabase/types";

export interface CalendarPageData {
  selectedDate: string; // YYYY-MM-DD
  currentMonth: string; // YYYY-MM
  tasks: TaskRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
  routines: RoutineRow[];
  goals: GoalRow[];
  timeEntries: TimeEntryRow[];
  dayPlans: DayPlanRow[];
  collisions: ScheduleCollision[];
  cashFlowProjection: CashFlowProjection;
}

export const getCalendarData = cache(
  async (dateStr?: string): Promise<CalendarPageData> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();
    const today = new Date().toISOString().slice(0, 10);
    const selectedDate = dateStr || today;
    const currentMonth = selectedDate.slice(0, 7);

    // Fetch month range for time entries
    const startOfMonth = `${currentMonth}-01`;
    const endOfMonth = `${currentMonth}-31`;

    const [
      tasks,
      projects,
      marriageExpenses,
      routines,
      goals,
      timeEntries,
      buckets,
      transactions,
      dayPlansResult,
    ] = await Promise.all([
      getTasks(),
      getProjects(),
      getMarriageExpenses(),
      getRoutines(),
      getGoals(),
      getTimeEntriesForRange(startOfMonth, endOfMonth),
      getBuckets(),
      getAllTransactions(),
      supabase
        .from("day_plans")
        .select("*")
        .eq("user_id", session.userId),
    ]);

    const dayPlans = (dayPlansResult.data as DayPlanRow[]) || [];

    // Detect Collisions
    const collisions = detectScheduleCollisions({
      tasks,
      projects,
      marriageExpenses,
      protectedOffDay: "friday",
    });

    // Calculate Cash Flow Projection
    const cashFlowProjection = calculateCashFlowProjection({
      buckets,
      transactions,
      projects,
      marriageExpenses,
      currentMonth,
    });

    return {
      selectedDate,
      currentMonth,
      tasks,
      projects,
      marriageExpenses,
      routines,
      goals,
      timeEntries,
      dayPlans,
      collisions,
      cashFlowProjection,
    };
  },
);
