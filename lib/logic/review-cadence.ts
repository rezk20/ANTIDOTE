import type {
  TransactionRow,
  LeadRow,
  ProjectRow,
  MarriageExpenseRow,
  TimeEntryRow,
  HabitRow,
} from "@/lib/supabase/types";
import type { HabitWithStats } from "@/lib/logic/habits";

export interface MonthlyPrefillMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  leadsContacted: number;
  proposalsSent: number;
  wonClients: number;
  avgProjectValue: number;
  completedProjectsCount: number;
  marriagePaidAmount: number;
  totalDeepWorkHours: number;
  habitConsistencyScore: number;
}

export function calculateMonthlyReviewMetrics(params: {
  transactions: TransactionRow[];
  leads: LeadRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
  timeEntries: TimeEntryRow[];
  habits: (HabitRow | HabitWithStats)[];
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
}): MonthlyPrefillMetrics {
  const {
    transactions,
    leads,
    projects,
    marriageExpenses,
    timeEntries,
    habits,
    periodStart,
    periodEnd,
  } = params;

  // 1. Financials in range
  const periodTxs = transactions.filter(
    (t) => t.occurred_on >= periodStart && t.occurred_on <= periodEnd,
  );
  const totalRevenue = periodTxs
    .filter((t) => t.kind === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpenses = periodTxs
    .filter((t) => t.kind === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const netSavings = Math.max(0, totalRevenue - totalExpenses);
  const savingsRate = totalRevenue > 0 ? Math.round((netSavings / totalRevenue) * 100) : 0;

  // 2. Leads & Proposals in range
  const periodLeads = leads.filter(
    (l) => l.created_at >= periodStart && l.created_at <= `${periodEnd}T23:59:59Z`,
  );
  const leadsContacted = periodLeads.filter(
    (l) => l.stage !== "new" && l.stage !== "qualified",
  ).length;
  const proposalsSent = periodLeads.filter(
    (l) => l.proposal_sent_at && l.proposal_sent_at >= periodStart,
  ).length;
  const wonClients = periodLeads.filter(
    (l) => l.stage === "won" || l.stage === "in_progress" || l.stage === "delivered",
  ).length;

  // 3. Projects in range
  const completedProjects = projects.filter((p) => p.status === "done");
  const totalBudget = completedProjects.reduce((acc, p) => acc + Number(p.budget || 0), 0);
  const avgProjectValue =
    completedProjects.length > 0 ? Math.round(totalBudget / completedProjects.length) : 0;

  // 4. Marriage expenses paid
  const marriagePaidAmount = marriageExpenses
    .filter((m) => m.updated_at >= periodStart && m.updated_at <= `${periodEnd}T23:59:59Z`)
    .reduce((acc, m) => acc + Number(m.paid_amount || 0), 0);

  // 5. Deep work hours
  const periodTime = timeEntries.filter(
    (e) => e.started_at >= periodStart && e.started_at <= `${periodEnd}T23:59:59Z`,
  );
  const totalMinutes = periodTime
    .filter((e) => e.kind === "deep_work")
    .reduce((acc, e) => acc + Number(e.duration_min || 0), 0);
  const totalDeepWorkHours = Math.round((totalMinutes / 60) * 10) / 10;

  // 6. Habit consistency score
  let habitConsistencyScore = 0;
  if (habits.length > 0) {
    const sumProgress = habits.reduce((acc, h) => {
      const p = "weeklyProgressPercent" in h ? Number(h.weeklyProgressPercent || 0) : 75;
      return acc + p;
    }, 0);
    habitConsistencyScore = Math.min(100, Math.round(sumProgress / habits.length));
  }

  return {
    totalRevenue,
    totalExpenses,
    netSavings,
    savingsRate,
    leadsContacted,
    proposalsSent,
    wonClients,
    avgProjectValue,
    completedProjectsCount: completedProjects.length,
    marriagePaidAmount,
    totalDeepWorkHours,
    habitConsistencyScore,
  };
}

export interface YearlyPrefillMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netSavings: number;
  totalClients: number;
  biggestClientName: string;
  biggestClientRevenue: number;
  bestProjectName: string;
}

export function calculateYearlyReviewMetrics(params: {
  transactions: TransactionRow[];
  projects: ProjectRow[];
  yearStr: string; // e.g. "2026"
}): YearlyPrefillMetrics {
  const { transactions, projects, yearStr } = params;

  const yearTxs = transactions.filter((t) => t.occurred_on.startsWith(yearStr));
  const totalRevenue = yearTxs
    .filter((t) => t.kind === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpenses = yearTxs
    .filter((t) => t.kind === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const netSavings = Math.max(0, totalRevenue - totalExpenses);

  // Projects in year
  const yearProjects = projects.filter((p) => p.created_at.startsWith(yearStr));
  const totalClients = new Set(yearProjects.map((p) => p.client_id).filter(Boolean)).size || yearProjects.length;

  // Best project by budget
  let bestProjectName = "لا يوجد بعد";
  let maxBudget = 0;
  for (const p of yearProjects) {
    const b = Number(p.budget || 0);
    if (b > maxBudget) {
      maxBudget = b;
      bestProjectName = p.name;
    }
  }

  return {
    totalRevenue,
    totalExpenses,
    netSavings,
    totalClients,
    biggestClientName: bestProjectName,
    biggestClientRevenue: maxBudget,
    bestProjectName,
  };
}
