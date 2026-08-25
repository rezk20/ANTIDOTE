import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession, getProfile } from "./auth";
import { getLeads } from "./leads";
import { getBrainDumps } from "./brain-dump";
import { getFinanceSummary, type FinanceSummaryData } from "./finance";
import {
  calculateDayPlanCapacity,
  isFridayRuleActive,
  materializeRecurringTaskCandidates,
  calculateShutdownSummary,
  type DayPlanCapacityResult,
  type ShutdownSummaryResult,
} from "@/lib/logic/day-plan";
import {
  getLocalDateString,
  DEFAULT_TIMEZONE,
} from "@/lib/logic/timezone";
import type {
  DayPlanRow,
  TaskRow,
  LeadRow,
  BrainDumpRow,
  ProfileRow,
} from "@/lib/supabase/types";

export const getDayPlan = cache(
  async (dateStr?: string, timeZone?: string): Promise<DayPlanRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const planDate = dateStr || getLocalDateString(timeZone || DEFAULT_TIMEZONE);

    const { data, error } = await supabase
      .from("day_plans")
      .select("*")
      .eq("user_id", session.userId)
      .eq("plan_date", planDate)
      .maybeSingle();

    if (error) {
      console.error("Error fetching day plan:", error);
      return null;
    }

    return data as DayPlanRow | null;
  },
);

export const getTodayTasks = cache(
  async (dateStr?: string, timeZone?: string): Promise<TaskRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const todayDate = dateStr || getLocalDateString(timeZone || DEFAULT_TIMEZONE);

    // 1. Fetch recurring source tasks to check if materialization is needed
    const { data: recurringSources } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.userId)
      .not("recurring_rule", "is", null);

    // 2. Fetch existing tasks scheduled for today or overdue
    const { data: rawTasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.userId)
      .or(
        `scheduled_date.eq.${todayDate},is_top_three.eq.true,and(status.in.(backlog,planned,in_progress),scheduled_date.lte.${todayDate})`,
      )
      .order("is_top_three", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching today tasks:", error);
      return [];
    }

    const tasks = (rawTasks ?? []) as TaskRow[];

    // 3. Idempotently materialize any missing recurring tasks for today
    if (recurringSources && recurringSources.length > 0) {
      const missingCandidates = materializeRecurringTaskCandidates(
        recurringSources as TaskRow[],
        todayDate,
        tasks,
      );

      if (missingCandidates.length > 0) {
        const toInsert = missingCandidates.map((c) => ({
          user_id: session.userId,
          ...c,
        }));

        const { data: inserted, error: insertErr } = await supabase
          .from("tasks")
          .insert(toInsert)
          .select("*");

        if (!insertErr && inserted) {
          tasks.push(...(inserted as TaskRow[]));
        }
      }
    }

    // Sort: Top 3 first, then priority critical -> high -> medium -> low, then revenue impact desc
    const priorityWeight: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return tasks.sort((a, b) => {
      if (a.is_top_three !== b.is_top_three) {
        return a.is_top_three ? -1 : 1;
      }
      const weightDiff =
        (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (weightDiff !== 0) return weightDiff;
      return (b.revenue_impact || 0) - (a.revenue_impact || 0);
    });
  },
);

export interface TodayMissionData {
  profile: ProfileRow | null;
  dayPlan: DayPlanRow | null;
  todayTasks: TaskRow[];
  topThreeTasks: TaskRow[];
  moneyActionTask: TaskRow | null;
  personalActionTask: TaskRow | null;
  relationshipActionTask: TaskRow | null;
  capacity: DayPlanCapacityResult;
  isFriday: boolean;
  shutdownSummary: ShutdownSummaryResult;
  selectedDate: string;
}

export const getTodayMissionData = cache(
  async (dateStr?: string): Promise<TodayMissionData> => {
    const profile = await getProfile();
    const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
    const personalSettings = (rawSettings.personal ?? {}) as Record<
      string,
      unknown
    >;

    const userTimeZone =
      (personalSettings.timezone as string) || DEFAULT_TIMEZONE;
    const todayDate = dateStr || getLocalDateString(userTimeZone);

    const [rawDayPlan, todayTasks] = await Promise.all([
      getDayPlan(todayDate, userTimeZone),
      getTodayTasks(todayDate, userTimeZone),
    ]);

    const defaultHours = Number(personalSettings.work_hours_per_day ?? 6.0);
    const availableHours = rawDayPlan ? Number(rawDayPlan.available_hours) : defaultHours;
    const energy = rawDayPlan ? rawDayPlan.energy : 3;

    const capacity = calculateDayPlanCapacity(todayTasks, availableHours, energy);
    const isFriday = isFridayRuleActive(todayDate);
    const shutdownSummary = calculateShutdownSummary(todayTasks);

    const topThreeTasks = todayTasks.filter((t) => t.is_top_three);

    const moneyActionTask =
      todayTasks.find((t) => t.id === rawDayPlan?.money_action_task_id) ||
      todayTasks.find(
        (t) =>
          (t.task_type === "revenue" || (t.revenue_impact ?? 0) >= 4) &&
          t.status !== "done",
      ) ||
      null;

    const personalActionTask =
      todayTasks.find((t) => t.id === rawDayPlan?.personal_action_task_id) ||
      todayTasks.find(
        (t) =>
          (t.task_type === "personal" || t.task_type === "health_routine") &&
          t.status !== "done",
      ) ||
      null;

    const relationshipActionTask =
      todayTasks.find((t) => t.id === rawDayPlan?.relationship_action_task_id) ||
      todayTasks.find(
        (t) =>
          (t.task_type === "marriage" || t.task_type === "relationship") &&
          t.status !== "done",
      ) ||
      null;

    return {
      profile,
      dayPlan: rawDayPlan,
      todayTasks,
      topThreeTasks,
      moneyActionTask,
      personalActionTask,
      relationshipActionTask,
      capacity,
      isFriday,
      shutdownSummary,
      selectedDate: todayDate,
    };
  },
);

export interface DashboardSummaryData {
  profile: ProfileRow | null;
  dayPlan: DayPlanRow | null;
  topThreeTasks: TaskRow[];
  todayTasks: TaskRow[];
  revenueActionTask: TaskRow | null;
  nextFollowupLead: LeadRow | null;
  brainDumpsCount: number;
  recentBrainDumps: BrainDumpRow[];
  financeSummary: FinanceSummaryData;
  capacity: DayPlanCapacityResult;
  isFriday: boolean;
  todayDate: string;
}

export const getDashboardSummary = cache(
  async (): Promise<DashboardSummaryData> => {
    const profile = await getProfile();
    const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
    const personalSettings = (rawSettings.personal ?? {}) as Record<
      string,
      unknown
    >;

    const userTimeZone =
      (personalSettings.timezone as string) || DEFAULT_TIMEZONE;
    const todayDate = getLocalDateString(userTimeZone);

    const [
      dayPlan,
      todayTasks,
      financeSummary,
      leads,
      brainDumps,
    ] = await Promise.all([
      getDayPlan(todayDate, userTimeZone),
      getTodayTasks(todayDate, userTimeZone),
      getFinanceSummary(),
      getLeads(),
      getBrainDumps(),
    ]);

    const defaultHours = Number(personalSettings.work_hours_per_day ?? 6.0);
    const availableHours = dayPlan ? Number(dayPlan.available_hours) : defaultHours;
    const energy = dayPlan ? dayPlan.energy : 3;

    const capacity = calculateDayPlanCapacity(todayTasks, availableHours, energy);
    const isFriday = isFridayRuleActive(todayDate);

    // Top 3 tasks: from flagged tasks or fallback to highest priority
    let topThreeTasks = todayTasks.filter((t) => t.is_top_three);
    if (topThreeTasks.length === 0) {
      topThreeTasks = todayTasks.slice(0, 3);
    }

    // Revenue Action Card task
    const revenueActionTask =
      todayTasks.find((t) => t.id === dayPlan?.money_action_task_id) ||
      todayTasks.find(
        (t) =>
          (t.task_type === "revenue" || (t.revenue_impact ?? 0) >= 4) &&
          t.status !== "done",
      ) ||
      todayTasks.find((t) => t.task_type === "revenue") ||
      null;

    // Next Client Follow-Up Lead
    const activeLeads = leads.filter(
      (l) => l.stage !== "lost" && l.stage !== "paid",
    );
    const nextFollowupLead =
      activeLeads.find((l) => l.next_follow_up_at != null) ||
      activeLeads[0] ||
      null;

    const inboxDumps = brainDumps.filter((b) => b.status === "inbox");

    return {
      profile,
      dayPlan,
      topThreeTasks,
      todayTasks,
      revenueActionTask,
      nextFollowupLead,
      brainDumpsCount: inboxDumps.length,
      recentBrainDumps: inboxDumps.slice(0, 3),
      financeSummary,
      capacity,
      isFriday,
      todayDate,
    };
  },
);
