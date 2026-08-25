import { describe, it, expect } from "vitest";
import {
  calculateProjectsProfitability,
  calculateCareerFunnelMetrics,
} from "@/lib/logic/profitability";
import type {
  ProjectRow,
  TimeEntryRow,
  LeadRow,
  LeadEventRow,
} from "@/lib/supabase/types";

describe("Profitability & Career Funnel Logic (§47, §4)", () => {
  it("calculates project effective hourly rates accurately based on logged time", () => {
    const mockProjects: ProjectRow[] = [
      {
        id: "p-1",
        user_id: "user-1",
        name: "E-Commerce App",
        client_id: "c-1",
        kind: "client",
        status: "active",
        brief: null,
        requirements: null,
        started_on: "2026-08-01",
        budget: 20000,
        deadline: "2026-09-01",
        meta: {},
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-01T10:00:00Z",
      },
      {
        id: "p-2",
        user_id: "user-1",
        name: "Discord Bot Suite",
        client_id: "c-2",
        kind: "client",
        status: "active",
        brief: null,
        requirements: null,
        started_on: "2026-08-01",
        budget: 4000,
        deadline: "2026-08-20",
        meta: {},
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-01T10:00:00Z",
      },
    ];

    const mockTimeEntries: TimeEntryRow[] = [
      {
        id: "t-1",
        user_id: "user-1",
        task_id: null,
        project_id: "p-1",
        kind: "deep_work",
        started_at: "2026-08-02T10:00:00Z",
        ended_at: "2026-08-02T15:00:00Z",
        duration_min: 300, // 5 hrs
        focus_rating: 5,
        note: null,
        created_at: "2026-08-02T10:00:00Z",
        updated_at: "2026-08-02T10:00:00Z",
      },
      {
        id: "t-2",
        user_id: "user-1",
        task_id: null,
        project_id: "p-1",
        kind: "delivery",
        started_at: "2026-08-03T10:00:00Z",
        ended_at: "2026-08-03T15:00:00Z",
        duration_min: 300, // 5 hrs -> total 10 hrs for p-1
        focus_rating: 4,
        note: null,
        created_at: "2026-08-03T10:00:00Z",
        updated_at: "2026-08-03T10:00:00Z",
      },
      {
        id: "t-3",
        user_id: "user-1",
        task_id: null,
        project_id: "p-2",
        kind: "delivery",
        started_at: "2026-08-04T10:00:00Z",
        ended_at: "2026-08-04T12:00:00Z",
        duration_min: 120, // 2 hrs for p-2
        focus_rating: 4,
        note: null,
        created_at: "2026-08-04T10:00:00Z",
        updated_at: "2026-08-04T10:00:00Z",
      },
    ];

    const result = calculateProjectsProfitability({
      projects: mockProjects,
      timeEntries: mockTimeEntries,
      benchmarkHourlyRate: 300,
    });

    expect(result[0].projectId).toBe("p-1");
    expect(result[0].totalLoggedHours).toBe(10);
    expect(result[0].effectiveHourlyRate).toBe(2000); // 20000 / 10
    expect(result[0].isProfitable).toBe(true);

    expect(result[1].projectId).toBe("p-2");
    expect(result[1].totalLoggedHours).toBe(2);
    expect(result[1].effectiveHourlyRate).toBe(2000); // 4000 / 2
    expect(result[1].isProfitable).toBe(true);
  });

  it("calculates freelance conversion funnel metrics from events accurately", () => {
    const mockLeads: LeadRow[] = [
      {
        id: "l-1",
        user_id: "user-1",
        title: "Web App",
        client_id: null,
        stage: "won",
        proposal_amount: 15000,
        expected_value: 15000,
        probability: 1,
        proposal_sent_at: "2026-08-01T10:00:00Z",
        proposal_notes: null,
        last_contact_at: null,
        next_follow_up_at: null,
        lost_reason: null,
        source: "upwork",
        url: null,
        notes: null,
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-06T10:00:00Z", // 5 days to close
      },
      {
        id: "l-2",
        user_id: "user-1",
        title: "Bot",
        client_id: null,
        stage: "lost",
        proposal_amount: 8000,
        expected_value: 8000,
        probability: 0,
        proposal_sent_at: "2026-08-02T10:00:00Z",
        proposal_notes: null,
        last_contact_at: null,
        next_follow_up_at: null,
        lost_reason: "budget",
        source: "twitter",
        url: null,
        notes: null,
        created_at: "2026-08-02T10:00:00Z",
        updated_at: "2026-08-05T10:00:00Z",
      },
    ];

    const mockLeadEvents: LeadEventRow[] = [
      {
        id: "e-1",
        user_id: "user-1",
        lead_id: "l-1",
        event_type: "outreach",
        amount: null,
        transaction_id: null,
        note: null,
        occurred_at: "2026-08-01T10:00:00Z",
        created_at: "2026-08-01T10:00:00Z",
      },
      {
        id: "e-2",
        user_id: "user-1",
        lead_id: "l-1",
        event_type: "follow_up",
        amount: null,
        transaction_id: null,
        note: null,
        occurred_at: "2026-08-02T10:00:00Z",
        created_at: "2026-08-02T10:00:00Z",
      },
      {
        id: "e-3",
        user_id: "user-1",
        lead_id: "l-1",
        event_type: "call",
        amount: null,
        transaction_id: null,
        note: null,
        occurred_at: "2026-08-03T10:00:00Z",
        created_at: "2026-08-03T10:00:00Z",
      },
      {
        id: "e-4",
        user_id: "user-1",
        lead_id: "l-1",
        event_type: "proposal_sent",
        amount: null,
        transaction_id: null,
        note: null,
        occurred_at: "2026-08-04T10:00:00Z",
        created_at: "2026-08-04T10:00:00Z",
      },
    ];

    const metrics = calculateCareerFunnelMetrics({
      leads: mockLeads,
      leadEvents: mockLeadEvents,
    });

    expect(metrics.totalLeadsDiscovered).toBe(2);
    expect(metrics.dealsWon).toBe(1);
    expect(metrics.totalPipelineRevenue).toBe(15000);
    expect(metrics.replyRatePercent).toBe(50); // 1 reply out of 2 leads
    expect(metrics.callToWonRatePercent).toBe(100); // 1 call -> 1 won
    expect(metrics.overallCloseRatePercent).toBe(50); // 1 won out of 2
    expect(metrics.averageDaysToClose).toBe(5);
  });
});
