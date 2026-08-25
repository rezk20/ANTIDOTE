import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import type { ReviewRow, DayPlanRow, ReviewType } from "@/lib/supabase/types";
import type { WeeklyAggregatedMetrics } from "@/lib/logic/review-metrics";

export const getReviews = cache(
  async (type: ReviewType = "weekly"): Promise<ReviewRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", session.userId)
      .eq("review_type", type)
      .order("period_start", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return (data ?? []) as ReviewRow[];
  },
);

export const getReviewById = cache(
  async (id: string): Promise<ReviewRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching review by id:", error);
      return null;
    }

    return data as ReviewRow | null;
  },
);

export const getCurrentWeekReview = cache(
  async (weekStart: string): Promise<ReviewRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", session.userId)
      .eq("review_type", "weekly")
      .eq("period_start", weekStart)
      .maybeSingle();

    if (error) {
      console.error("Error checking current week review:", error);
      return null;
    }

    return data as ReviewRow | null;
  },
);

export const getWeeklyAggregatedMetrics = cache(
  async (startDate: string, endDate: string): Promise<WeeklyAggregatedMetrics> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    // 1. Fetch transactions for income & expenses
    const { data: txs } = await supabase
      .from("transactions")
      .select("amount, kind")
      .eq("user_id", session.userId)
      .gte("occurred_on", startDate)
      .lte("occurred_on", endDate);

    let incomeThisWeek = 0;
    let expensesThisWeek = 0;
    for (const tx of txs ?? []) {
      const amt = Number(tx.amount) || 0;
      if (tx.kind === "income") {
        incomeThisWeek += amt;
      } else if (tx.kind === "expense") {
        expensesThisWeek += amt;
      }
    }
    const netSavings = incomeThisWeek - expensesThisWeek;

    // 2. Fetch completed tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("priority, status, completed_at, scheduled_date")
      .eq("user_id", session.userId)
      .eq("status", "done");

    let tasksDone = 0;
    let highPriorityDone = 0;
    for (const t of tasks ?? []) {
      const dateToCheck = t.completed_at
        ? t.completed_at.slice(0, 10)
        : t.scheduled_date;

      if (dateToCheck && dateToCheck >= startDate && dateToCheck <= endDate) {
        tasksDone += 1;
        if (t.priority === "critical" || t.priority === "high") {
          highPriorityDone += 1;
        }
      }
    }

    // 3. Fetch proposals sent & deals won
    const { data: leads } = await supabase
      .from("leads")
      .select("stage, proposal_sent_at, updated_at")
      .eq("user_id", session.userId);

    let proposalsSent = 0;
    let dealsWon = 0;
    for (const lead of leads ?? []) {
      const proposalDate = lead.proposal_sent_at ? lead.proposal_sent_at.slice(0, 10) : null;
      if (proposalDate && proposalDate >= startDate && proposalDate <= endDate) {
        proposalsSent += 1;
      }
      if (lead.stage === "won") {
        const updateDate = lead.updated_at ? lead.updated_at.slice(0, 10) : null;
        if (updateDate && updateDate >= startDate && updateDate <= endDate) {
          dealsWon += 1;
        }
      }
    }

    // 4. Fetch day plans count
    const { data: dayPlans } = await supabase
      .from("day_plans")
      .select("id, status")
      .eq("user_id", session.userId)
      .gte("plan_date", startDate)
      .lte("plan_date", endDate);

    const daysPlanned = dayPlans?.length || 0;

    return {
      incomeThisWeek,
      expensesThisWeek,
      netSavings,
      tasksDone,
      highPriorityDone,
      proposalsSent,
      dealsWon,
      daysPlanned,
    };
  },
);

export const getDailyReviewsHistory = cache(
  async (): Promise<DayPlanRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("day_plans")
      .select("*")
      .eq("user_id", session.userId)
      .order("plan_date", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching daily reviews history:", error);
      return [];
    }

    return (data ?? []) as DayPlanRow[];
  },
);
