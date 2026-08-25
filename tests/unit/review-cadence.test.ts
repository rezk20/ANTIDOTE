import { describe, it, expect } from "vitest";
import {
  calculateMonthlyReviewMetrics,
  calculateYearlyReviewMetrics,
} from "@/lib/logic/review-cadence";
import type {
  TransactionRow,
  LeadRow,
  ProjectRow,
  MarriageExpenseRow,
  TimeEntryRow,
  HabitRow,
} from "@/lib/supabase/types";

describe("Review Cadence Metrics Module (§19, §95)", () => {
  const periodStart = "2026-08-01";
  const periodEnd = "2026-08-31";

  it("aggregates monthly metrics accurately", () => {
    const transactions: TransactionRow[] = [
      {
        id: "t1",
        user_id: "u1",
        amount: 30000,
        kind: "income",
        category: "client",
        occurred_on: "2026-08-10",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: null,
        note: null,
        is_recurring: false,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t2",
        user_id: "u1",
        amount: 10000,
        kind: "expense",
        category: "living",
        occurred_on: "2026-08-15",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: null,
        note: null,
        is_recurring: false,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const leads: LeadRow[] = [
      {
        id: "l1",
        user_id: "u1",
        title: "Startup Client Web App",
        source: "linkedin",
        url: null,
        stage: "won",
        expected_value: 20000,
        probability: 1,
        client_id: null,
        proposal_amount: 20000,
        proposal_sent_at: "2026-08-07T10:00:00Z",
        proposal_notes: null,
        last_contact_at: "2026-08-06T10:00:00Z",
        next_follow_up_at: null,
        lost_reason: null,
        notes: null,
        created_at: "2026-08-05T10:00:00Z",
        updated_at: "2026-08-09T10:00:00Z",
      },
    ];

    const projects: ProjectRow[] = [
      {
        id: "p1",
        user_id: "u1",
        client_id: null,
        name: "MVP Project",
        kind: "client",
        brief: null,
        requirements: null,
        status: "done",
        budget: 20000,
        started_on: "2026-08-01",
        deadline: "2026-08-20",
        meta: {},
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-20T10:00:00Z",
      },
    ];

    const marriageExpenses: MarriageExpenseRow[] = [
      {
        id: "m1",
        user_id: "u1",
        category: "hall",
        item: "حجز القاعة",
        estimated_cost: 15000,
        actual_cost: 15000,
        paid_amount: 5000,
        deadline: "2026-08-25",
        priority: "high",
        status: "in_progress",
        notes: null,
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-15T10:00:00Z",
      },
    ];

    const timeEntries: TimeEntryRow[] = [
      {
        id: "te1",
        user_id: "u1",
        task_id: null,
        project_id: null,
        kind: "deep_work",
        duration_min: 120,
        started_at: "2026-08-10T09:00:00Z",
        ended_at: "2026-08-10T11:00:00Z",
        focus_rating: 5,
        note: null,
        created_at: "2026-08-10T09:00:00Z",
        updated_at: "2026-08-10T09:00:00Z",
      },
    ];

    const habits: HabitRow[] = [
      {
        id: "h1",
        user_id: "u1",
        name: "صلاة الفجر",
        description: null,
        category: "health_routine",
        target_per_week: 7,
        sort_order: 1,
        is_active: true,
        created_at: "2026-08-01T00:00:00Z",
        updated_at: "2026-08-01T00:00:00Z",
      },
    ];

    const metrics = calculateMonthlyReviewMetrics({
      transactions,
      leads,
      projects,
      marriageExpenses,
      timeEntries,
      habits,
      periodStart,
      periodEnd,
    });

    expect(metrics.totalRevenue).toBe(30000);
    expect(metrics.totalExpenses).toBe(10000);
    expect(metrics.netSavings).toBe(20000);
    expect(metrics.savingsRate).toBe(67);
    expect(metrics.leadsContacted).toBe(1);
    expect(metrics.proposalsSent).toBe(1);
    expect(metrics.wonClients).toBe(1);
    expect(metrics.avgProjectValue).toBe(20000);
    expect(metrics.completedProjectsCount).toBe(1);
    expect(metrics.marriagePaidAmount).toBe(5000);
    expect(metrics.totalDeepWorkHours).toBe(2);
  });

  it("calculates yearly retrospective metrics accurately", () => {
    const transactions: TransactionRow[] = [
      {
        id: "t1",
        user_id: "u1",
        amount: 250000,
        kind: "income",
        category: "client",
        occurred_on: "2026-05-10",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: null,
        note: null,
        is_recurring: false,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const projects: ProjectRow[] = [
      {
        id: "p1",
        user_id: "u1",
        client_id: "c1",
        name: "Enterprise Platform",
        kind: "client",
        brief: null,
        requirements: null,
        status: "done",
        budget: 120000,
        started_on: "2026-01-01",
        deadline: "2026-04-30",
        meta: {},
        created_at: "2026-01-01T10:00:00Z",
        updated_at: "2026-04-30T10:00:00Z",
      },
    ];

    const metrics = calculateYearlyReviewMetrics({
      transactions,
      projects,
      yearStr: "2026",
    });

    expect(metrics.totalRevenue).toBe(250000);
    expect(metrics.biggestClientRevenue).toBe(120000);
    expect(metrics.bestProjectName).toBe("Enterprise Platform");
    expect(metrics.totalClients).toBe(1);
  });
});
