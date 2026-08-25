import type {
  ProjectRow,
  TimeEntryRow,
  LeadRow,
  LeadEventRow,
} from "@/lib/supabase/types";

export interface ProjectProfitabilityItem {
  projectId: string;
  projectName: string;
  kind: string;
  status: string;
  budget: number;
  totalLoggedHours: number;
  effectiveHourlyRate: number; // budget / hours
  isProfitable: boolean; // >= benchmark e.g. 250 EGP/hr
}

export interface CareerFunnelMetrics {
  totalLeadsDiscovered: number;
  proposalsSent: number;
  callsConducted: number;
  dealsWon: number;
  totalPipelineRevenue: number;
  replyRatePercent: number;
  callToWonRatePercent: number;
  overallCloseRatePercent: number;
  averageDaysToClose: number;
}

export function calculateProjectsProfitability(params: {
  projects: ProjectRow[];
  timeEntries: TimeEntryRow[];
  benchmarkHourlyRate?: number;
}): ProjectProfitabilityItem[] {
  const { projects, timeEntries, benchmarkHourlyRate = 250 } = params;

  // Aggregate hours by project_id
  const hoursMap: Record<string, number> = {};
  for (const entry of timeEntries) {
    if (entry.project_id) {
      hoursMap[entry.project_id] =
        (hoursMap[entry.project_id] || 0) + Number(entry.duration_min || 0) / 60;
    }
  }

  return projects.map((p) => {
    const budget = Number(p.budget || 0);
    const totalLoggedHours = Math.round((hoursMap[p.id] || 0) * 10) / 10;
    const effectiveHourlyRate =
      totalLoggedHours > 0
        ? Math.round(budget / totalLoggedHours)
        : budget > 0
          ? budget
          : 0;

    return {
      projectId: p.id,
      projectName: p.name,
      kind: p.kind,
      status: p.status,
      budget,
      totalLoggedHours,
      effectiveHourlyRate,
      isProfitable: effectiveHourlyRate >= benchmarkHourlyRate,
    };
  });
}

export function calculateCareerFunnelMetrics(params: {
  leads: LeadRow[];
  leadEvents: LeadEventRow[];
}): CareerFunnelMetrics {
  const { leads, leadEvents } = params;

  const totalLeadsDiscovered = Math.max(
    leads.length,
    leadEvents.filter((e) => e.event_type === "outreach" || e.event_type === "note").length,
  );

  const proposalsSent = Math.max(
    leads.filter((l) => l.proposal_sent_at !== null).length,
    leadEvents.filter((e) => e.event_type === "proposal_sent").length,
  );

  const callsConducted = leadEvents.filter(
    (e) => e.event_type === "call",
  ).length;

  const wonLeads = leads.filter(
    (l) => l.stage === "won" || l.stage === "in_progress" || l.stage === "delivered",
  );
  const dealsWon = wonLeads.length;

  const totalPipelineRevenue = wonLeads.reduce(
    (acc, l) => acc + Number(l.proposal_amount || l.expected_value || 0),
    0,
  );

  const repliedLeadIds = new Set(
    leadEvents
      .filter(
        (e) =>
          e.event_type === "follow_up" ||
          e.event_type === "call" ||
          e.event_type === "negotiation",
      )
      .map((e) => e.lead_id),
  );
  const replyRatePercent =
    totalLeadsDiscovered > 0
      ? Math.min(100, Math.round((repliedLeadIds.size / totalLeadsDiscovered) * 100))
      : 0;

  const callToWonRatePercent =
    callsConducted > 0
      ? Math.min(100, Math.round((dealsWon / callsConducted) * 100))
      : proposalsSent > 0
        ? Math.min(100, Math.round((dealsWon / proposalsSent) * 100))
        : 0;

  const overallCloseRatePercent =
    totalLeadsDiscovered > 0
      ? Math.min(100, Math.round((dealsWon / totalLeadsDiscovered) * 100))
      : 0;

  // Calculate avg days to close for won leads
  let totalDays = 0;
  let closedCount = 0;
  for (const l of wonLeads) {
    if (l.created_at && l.updated_at) {
      const created = new Date(l.created_at).getTime();
      const closed = new Date(l.updated_at).getTime();
      const days = Math.max(1, Math.round((closed - created) / (1000 * 60 * 60 * 24)));
      totalDays += days;
      closedCount++;
    }
  }

  const averageDaysToClose =
    closedCount > 0 ? Math.round((totalDays / closedCount) * 10) / 10 : 7;

  return {
    totalLeadsDiscovered,
    proposalsSent,
    callsConducted,
    dealsWon,
    totalPipelineRevenue,
    replyRatePercent,
    callToWonRatePercent,
    overallCloseRatePercent,
    averageDaysToClose,
  };
}
