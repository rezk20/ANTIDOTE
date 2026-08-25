import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession, getProfile } from "./auth";
import { getAllTransactions } from "./finance";
import { getProjects } from "./projects";
import { getLeads } from "./leads";
import { getHabitsWithLogs } from "./habits";
import { getOpportunities } from "./opportunities";
import { calculateFinancialForecast, type FinancialForecastResult } from "@/lib/logic/forecast";
import {
  calculateProjectsProfitability,
  calculateCareerFunnelMetrics,
  type ProjectProfitabilityItem,
  type CareerFunnelMetrics,
} from "@/lib/logic/profitability";
import {
  calculateAdaptiveWorkAllocation,
  type AdaptiveAllocationResult,
} from "@/lib/logic/allocation";
import {
  prioritizeOpportunities,
  type OpportunityPrioritizationResult,
} from "@/lib/logic/opportunity";
import type { TimeEntryRow, LeadEventRow, RelationshipCheckinRow } from "@/lib/supabase/types";

export interface AnalyticsSummaryData {
  forecast: FinancialForecastResult;
  profitability: ProjectProfitabilityItem[];
  careerFunnel: CareerFunnelMetrics;
  allocation: AdaptiveAllocationResult;
  opportunities: OpportunityPrioritizationResult;
  deepWorkHoursTotal: number;
  habitConsistencyScore: number;
  relationshipCheckinsCount: number;
}

export const getAnalyticsSummary = cache(async (): Promise<AnalyticsSummaryData> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const [
    profile,
    allTransactions,
    projects,
    leads,
    opportunitiesList,
    habits,
    timeEntriesData,
    leadEventsData,
    checkinsData,
  ] = await Promise.all([
    getProfile(),
    getAllTransactions(),
    getProjects(),
    getLeads(),
    getOpportunities(),
    getHabitsWithLogs(),
    supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", session.userId)
      .order("started_at", { ascending: false }),
    supabase
      .from("lead_events")
      .select("*")
      .eq("user_id", session.userId)
      .order("occurred_at", { ascending: false }),
    supabase
      .from("relationship_checkins")
      .select("*")
      .eq("user_id", session.userId)
      .order("week_start", { ascending: false }),
  ]);

  const timeEntries = (timeEntriesData.data ?? []) as TimeEntryRow[];
  const leadEvents = (leadEventsData.data ?? []) as LeadEventRow[];
  const checkins = (checkinsData.data ?? []) as RelationshipCheckinRow[];

  // 1. Compute current savings from transaction history
  const totalIncome = allTransactions
    .filter((t) => t.kind === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpense = allTransactions
    .filter((t) => t.kind === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const currentSavings = Math.max(18000, totalIncome - totalExpense);

  // 2. Financial 3-Scenario Forecast
  const forecast = calculateFinancialForecast({
    transactions: allTransactions,
    currentSavings,
    profile,
  });

  // 3. Project Profitability & Effective Hourly Rates
  const profitability = calculateProjectsProfitability({
    projects,
    timeEntries,
  });

  // 4. Career Funnel from lead_events
  const careerFunnel = calculateCareerFunnelMetrics({
    leads,
    leadEvents,
  });

  // 5. Adaptive Work Allocation
  const allocation = calculateAdaptiveWorkAllocation({
    projects,
    leads,
    timeEntries,
  });

  // 6. Opportunity Scoring & Recommendation
  const opportunities = prioritizeOpportunities(opportunitiesList);

  // 7. Productivity & Habits summary
  const deepWorkMinutes = timeEntries
    .filter((e) => e.kind === "deep_work")
    .reduce((acc, e) => acc + Number(e.duration_min || 0), 0);
  const deepWorkHoursTotal = Math.round((deepWorkMinutes / 60) * 10) / 10;

  let habitConsistencyScore = 0;
  if (habits.length > 0) {
    const sum = habits.reduce((acc, h) => acc + Number(h.weeklyProgressPercent || 0), 0);
    habitConsistencyScore = Math.round(sum / habits.length);
  }

  return {
    forecast,
    profitability,
    careerFunnel,
    allocation,
    opportunities,
    deepWorkHoursTotal,
    habitConsistencyScore,
    relationshipCheckinsCount: checkins.length,
  };
});
