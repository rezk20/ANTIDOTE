import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession, getProfile } from "./auth";
import { getProjects } from "./projects";
import { getLeads } from "./leads";
import {
  calculateMonthlyTotals,
  calculateBucketBalances,
  calculateMarriageGoalMetrics,
  calculateIncomeTargets,
  calculateMarriageExpensesSummary,
  type MonthlyTotals,
  type ComputedBucket,
  type MarriageGoalMetrics,
  type IncomeTargetProgress,
  type MarriageExpensesSummary,
} from "@/lib/logic/finance";
import type {
  TransactionRow,
  BucketRow,
  MarriageExpenseRow,
  ProjectRow,
  LeadRow,
  ProfileRow,
} from "@/lib/supabase/types";

export interface TransactionFilterOptions {
  month?: string; // YYYY-MM
  category?: string;
  kind?: "income" | "expense";
  bucketId?: string;
  projectId?: string;
  leadId?: string;
}

export const getTransactions = cache(
  async (options?: TransactionFilterOptions): Promise<TransactionRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.userId)
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false });

    if (options?.month) {
      // YYYY-MM
      const startOfMonth = `${options.month}-01`;
      // determine end of month
      const [yearStr, monthStr] = options.month.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const startOfNextMonth = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

      query = query.gte("occurred_on", startOfMonth).lt("occurred_on", startOfNextMonth);
    }

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.kind) {
      query = query.eq("kind", options.kind);
    }

    if (options?.bucketId) {
      query = query.eq("bucket_id", options.bucketId);
    }

    if (options?.projectId) {
      query = query.eq("project_id", options.projectId);
    }

    if (options?.leadId) {
      query = query.eq("lead_id", options.leadId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }

    return (data ?? []) as TransactionRow[];
  },
);

export const getAllTransactions = cache(
  async (): Promise<TransactionRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.userId)
      .order("occurred_on", { ascending: false });

    if (error) {
      console.error("Error fetching all transactions:", error);
      return [];
    }

    return (data ?? []) as TransactionRow[];
  },
);

export const getTransaction = cache(
  async (id: string): Promise<TransactionRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.userId)
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      return null;
    }

    return data as TransactionRow;
  },
);

export const getBuckets = cache(async (): Promise<BucketRow[]> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("buckets")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching buckets:", error);
    return [];
  }

  return (data ?? []) as BucketRow[];
});

export const getMarriageExpenses = cache(
  async (): Promise<MarriageExpenseRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("marriage_expenses")
      .select("*")
      .eq("user_id", session.userId)
      .order("deadline", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching marriage expenses:", error);
      return [];
    }

    return (data ?? []) as MarriageExpenseRow[];
  },
);

export interface FinanceSummaryData {
  profile: ProfileRow | null;
  buckets: ComputedBucket[];
  monthTransactions: TransactionRow[];
  allTransactions: TransactionRow[];
  monthlyTotals: MonthlyTotals;
  marriageGoal: MarriageGoalMetrics;
  incomeTargets: IncomeTargetProgress;
  marriageExpenses: MarriageExpenseRow[];
  marriageExpensesSummary: MarriageExpensesSummary;
  projects: ProjectRow[];
  leads: LeadRow[];
  selectedMonth: string;
}

export const getFinanceSummary = cache(
  async (selectedMonth?: string): Promise<FinanceSummaryData> => {
    const currentMonth =
      selectedMonth || new Date().toISOString().slice(0, 7); // YYYY-MM

    const [
      profile,
      rawBuckets,
      allTransactions,
      monthTransactions,
      marriageExpenses,
      projects,
      leads,
    ] = await Promise.all([
      getProfile(),
      getBuckets(),
      getAllTransactions(),
      getTransactions({ month: currentMonth }),
      getMarriageExpenses(),
      getProjects(),
      getLeads(),
    ]);

    // 1. Calculate computed wallet balances from all lifetime transactions
    const computedBuckets = calculateBucketBalances(rawBuckets, allTransactions);

    // 2. Calculate monthly income & expense totals
    const monthlyTotals = calculateMonthlyTotals(monthTransactions);

    // 3. Find marriage bucket and calculate marriage goal metrics
    const marriageBucket = computedBuckets.find((b) => b.kind === "marriage");
    const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
    const marriageSettings = (rawSettings.marriage ?? {}) as Record<
      string,
      unknown
    >;
    const workSettings = (rawSettings.work ?? {}) as Record<string, unknown>;

    const marriageTargetAmount = Number(
      marriageBucket?.target_amount ?? marriageSettings.target_amount ?? 250000,
    );
    const marriageTargetMonths = Number(
      marriageSettings.target_months ?? 12,
    );
    const marriageSavedAmount = marriageBucket
      ? marriageBucket.currentBalance
      : 0;

    const marriageGoal = calculateMarriageGoalMetrics({
      targetAmount: marriageTargetAmount,
      currentSaved: marriageSavedAmount,
      targetMonths: marriageTargetMonths,
    });

    // 4. Calculate income targets progress
    const incomeTargets = calculateIncomeTargets(monthlyTotals.totalIncome, {
      min: Number(workSettings.min_income ?? 15000),
      comfort: Number(workSettings.comfort_income ?? 30000),
      stretch: Number(workSettings.stretch_income ?? 50000),
    });

    // 5. Calculate marriage expenses summary
    const marriageExpensesSummary =
      calculateMarriageExpensesSummary(marriageExpenses);

    return {
      profile,
      buckets: computedBuckets,
      monthTransactions,
      allTransactions,
      monthlyTotals,
      marriageGoal,
      incomeTargets,
      marriageExpenses,
      marriageExpensesSummary,
      projects,
      leads,
      selectedMonth: currentMonth,
    };
  },
);
