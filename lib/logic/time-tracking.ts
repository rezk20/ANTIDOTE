import type { TimeEntryRow, TimeEntryKind } from "@/lib/supabase/types";

export interface WeeklyTimeDistribution {
  totalMinutes: number;
  totalHours: number;
  byKind: Record<TimeEntryKind, { minutes: number; hours: number; percentage: number }>;
  deepWorkHours: number;
  revenueHours: number;
  learningHours: number;
  relationshipHours: number;
}

export function calculateDurationMin(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    return 0;
  }

  const diffMs = end - start;
  return Math.max(1, Math.round(diffMs / (1000 * 60)));
}

export function calculateWeeklyTimeDistribution(
  entries: TimeEntryRow[],
): WeeklyTimeDistribution {
  const byKind: Record<TimeEntryKind, { minutes: number; hours: number; percentage: number }> = {
    deep_work: { minutes: 0, hours: 0, percentage: 0 },
    delivery: { minutes: 0, hours: 0, percentage: 0 },
    sales: { minutes: 0, hours: 0, percentage: 0 },
    learning: { minutes: 0, hours: 0, percentage: 0 },
    product: { minutes: 0, hours: 0, percentage: 0 },
    admin: { minutes: 0, hours: 0, percentage: 0 },
    relationship: { minutes: 0, hours: 0, percentage: 0 },
    rest: { minutes: 0, hours: 0, percentage: 0 },
  };

  let totalMinutes = 0;

  for (const entry of entries) {
    const mins = Number(entry.duration_min) || 0;
    totalMinutes += mins;
    if (byKind[entry.kind]) {
      byKind[entry.kind].minutes += mins;
    }
  }

  for (const kind of Object.keys(byKind) as TimeEntryKind[]) {
    const mins = byKind[kind].minutes;
    byKind[kind].hours = Math.round((mins / 60) * 10) / 10;
    byKind[kind].percentage =
      totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0;
  }

  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  return {
    totalMinutes,
    totalHours,
    byKind,
    deepWorkHours: byKind.deep_work.hours,
    revenueHours: Math.round((byKind.sales.hours + byKind.delivery.hours) * 10) / 10,
    learningHours: byKind.learning.hours,
    relationshipHours: byKind.relationship.hours,
  };
}
