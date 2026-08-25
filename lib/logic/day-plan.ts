import type { TaskRow } from "@/lib/supabase/types";

export interface DayPlanCapacityResult {
  totalPlannedMinutes: number;
  totalPlannedHours: number;
  availableHours: number;
  effectiveCapacityHours: number;
  isOverloaded: boolean;
  capacityPercentage: number;
  tasksCount: number;
}

export function calculateDayPlanCapacity(
  tasks: TaskRow[],
  availableHours: number = 6.0,
  energy: number = 3,
): DayPlanCapacityResult {
  const activeTasks = tasks.filter(
    (t) => t.status !== "done" && t.status !== "dropped",
  );

  const totalPlannedMinutes = activeTasks.reduce((sum, task) => {
    // Default duration to 45 min if not explicitly set
    const duration = task.duration_min && task.duration_min > 0 ? task.duration_min : 45;
    return sum + duration;
  }, 0);

  const totalPlannedHours = Math.round((totalPlannedMinutes / 60) * 10) / 10;

  // Energy adjustment: low energy (1-2) reduces practical capacity by 25%, energy 5 gives 10% boost
  let energyMultiplier = 1.0;
  if (energy <= 2) {
    energyMultiplier = 0.75;
  } else if (energy === 5) {
    energyMultiplier = 1.1;
  }
  const effectiveCapacityHours = Math.round(availableHours * energyMultiplier * 10) / 10;

  const isOverloaded = totalPlannedHours > availableHours;
  const capacityPercentage =
    availableHours > 0
      ? Math.min(200, Math.round((totalPlannedHours / availableHours) * 100))
      : 100;

  return {
    totalPlannedMinutes,
    totalPlannedHours,
    availableHours,
    effectiveCapacityHours,
    isOverloaded,
    capacityPercentage,
    tasksCount: activeTasks.length,
  };
}

export function isFridayRuleActive(dateInput: Date | string): boolean {
  let date: Date;
  if (typeof dateInput === "string") {
    // parse YYYY-MM-DD
    const [y, m, d] = dateInput.split("-").map(Number);
    date = new Date(Date.UTC(y, m - 1, d));
  } else {
    date = dateInput;
  }

  // 5 represents Friday in getUTCDay() (0 is Sunday, 6 is Saturday)
  return date.getUTCDay() === 5;
}

export interface CandidateRecurringTask {
  title: string;
  description: string | null;
  area: TaskRow["area"];
  task_type: TaskRow["task_type"];
  priority: TaskRow["priority"];
  effort: number | null;
  duration_min: number | null;
  scheduled_date: string;
  status: TaskRow["status"];
  is_top_three: boolean;
  recurring_rule: string | null;
  recurring_source_id: string;
  energy_level: number | null;
  revenue_impact: number | null;
  strategic_impact: number | null;
  relationship_impact: number | null;
  urgency: number | null;
  goal_id: string | null;
  project_id: string | null;
  lead_id: string | null;
}

export function materializeRecurringTaskCandidates(
  sourceRecurringTasks: TaskRow[],
  targetDateStr: string,
  existingTasks: TaskRow[],
): CandidateRecurringTask[] {
  const [y, m, d] = targetDateStr.split("-").map(Number);
  const targetDate = new Date(Date.UTC(y, m - 1, d));
  const dayOfWeek = targetDate.getUTCDay(); // 0: Sun, 1: Mon ... 5: Fri, 6: Sat
  const isWeekday = dayOfWeek >= 0 && dayOfWeek <= 4; // Sun-Thu or Mon-Fri depending on config

  const candidates: CandidateRecurringTask[] = [];

  for (const source of sourceRecurringTasks) {
    if (!source.recurring_rule) continue;

    const rule = source.recurring_rule.toLowerCase().trim();

    let matches = false;
    if (rule === "daily") {
      matches = true;
    } else if (rule === "weekdays" && isWeekday) {
      matches = true;
    } else if (rule === "weekly:friday" && dayOfWeek === 5) {
      matches = true;
    } else if (rule === "weekly:saturday" && dayOfWeek === 6) {
      matches = true;
    } else if (rule === "weekly:sunday" && dayOfWeek === 0) {
      matches = true;
    } else if (rule === "weekly:monday" && dayOfWeek === 1) {
      matches = true;
    } else if (rule.startsWith("weekly:")) {
      const targetDay = rule.split(":")[1];
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      if (dayNames[dayOfWeek] === targetDay) {
        matches = true;
      }
    }

    if (!matches) continue;

    // Check if an instance with (recurring_source_id === source.id AND scheduled_date === targetDateStr) already exists
    const alreadyMaterialized = existingTasks.some(
      (t) =>
        (t.recurring_source_id === source.id || t.id === source.id) &&
        t.scheduled_date === targetDateStr,
    );

    if (!alreadyMaterialized) {
      candidates.push({
        title: source.title,
        description: source.description,
        area: source.area,
        task_type: source.task_type,
        priority: source.priority,
        effort: source.effort,
        duration_min: source.duration_min,
        scheduled_date: targetDateStr,
        status: "planned",
        is_top_three: false,
        recurring_rule: source.recurring_rule,
        recurring_source_id: source.id,
        energy_level: source.energy_level,
        revenue_impact: source.revenue_impact,
        strategic_impact: source.strategic_impact,
        relationship_impact: source.relationship_impact,
        urgency: source.urgency,
        goal_id: source.goal_id,
        project_id: source.project_id,
        lead_id: source.lead_id,
      });
    }
  }

  return candidates;
}

export interface ShutdownSummaryResult {
  totalTasks: number;
  completedCount: number;
  completionRate: number;
  topThreeCount: number;
  topThreeCompleted: number;
  rolloverTasks: TaskRow[];
}

export function calculateShutdownSummary(
  todayTasks: TaskRow[],
): ShutdownSummaryResult {
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter((t) => t.status === "done");
  const completedCount = completedTasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 100;

  const topThreeTasks = todayTasks.filter((t) => t.is_top_three);
  const topThreeCount = topThreeTasks.length;
  const topThreeCompleted = topThreeTasks.filter((t) => t.status === "done").length;

  const rolloverTasks = todayTasks.filter(
    (t) => t.status !== "done" && t.status !== "dropped",
  );

  return {
    totalTasks,
    completedCount,
    completionRate,
    topThreeCount,
    topThreeCompleted,
    rolloverTasks,
  };
}
