import { describe, it, expect } from "vitest";
import { groupLeadsByPipeline, calculateSalesMetrics } from "@/lib/logic/sales-metrics";
import type { LeadRow, LeadEventRow } from "@/lib/supabase/types";

describe("Sales Metrics & Pipeline Logic", () => {
  it("groups leads into appropriate pipeline columns and computes total/weighted value", () => {
    const leads: LeadRow[] = [
      {
        id: "l1",
        user_id: "u1",
        title: "Lead 1",
        source: "upwork",
        url: null,
        stage: "new",
        expected_value: 10000,
        probability: 0.2,
        client_id: null,
        proposal_amount: null,
        proposal_sent_at: null,
        proposal_notes: null,
        last_contact_at: null,
        next_follow_up_at: null,
        lost_reason: null,
        notes: null,
        created_at: "2026-08-24T00:00:00Z",
        updated_at: "2026-08-24T00:00:00Z",
      },
      {
        id: "l2",
        user_id: "u1",
        title: "Lead 2",
        source: "linkedin",
        url: null,
        stage: "proposal_sent",
        expected_value: 20000,
        probability: 0.6,
        client_id: null,
        proposal_amount: 25000,
        proposal_sent_at: null,
        proposal_notes: null,
        last_contact_at: null,
        next_follow_up_at: null,
        lost_reason: null,
        notes: null,
        created_at: "2026-08-24T00:00:00Z",
        updated_at: "2026-08-24T00:00:00Z",
      },
      {
        id: "l3",
        user_id: "u1",
        title: "Lead 3",
        source: "referral",
        url: null,
        stage: "won",
        expected_value: 30000,
        probability: 1,
        client_id: null,
        proposal_amount: 30000,
        proposal_sent_at: null,
        proposal_notes: null,
        last_contact_at: null,
        next_follow_up_at: null,
        lost_reason: null,
        notes: null,
        created_at: "2026-08-24T00:00:00Z",
        updated_at: "2026-08-24T00:00:00Z",
      },
    ];

    const result = groupLeadsByPipeline(leads);
    expect(result.totalLeads).toBe(3);
    expect(result.columns.discovery.leads.length).toBe(1);
    expect(result.columns.proposal.leads.length).toBe(1);
    expect(result.columns.won.leads.length).toBe(1);

    expect(result.totalPipelineValue).toBe(65000); // 10k + 25k (proposal) + 30k (proposal)
    expect(result.weightedPipelineValue).toBe(10000 * 0.2 + 25000 * 0.6 + 30000 * 1);
  });

  it("calculates sales activity target progress accurately", () => {
    const today = new Date();
    const events: LeadEventRow[] = [
      {
        id: "e1",
        user_id: "u1",
        lead_id: "l1",
        event_type: "proposal_sent",
        occurred_at: today.toISOString(),
        amount: 20000,
        transaction_id: null,
        note: null,
        created_at: today.toISOString(),
      },
      {
        id: "e2",
        user_id: "u1",
        lead_id: "l2",
        event_type: "outreach",
        occurred_at: today.toISOString(),
        amount: null,
        transaction_id: null,
        note: null,
        created_at: today.toISOString(),
      },
      {
        id: "e3",
        user_id: "u1",
        lead_id: "l3",
        event_type: "call",
        occurred_at: today.toISOString(),
        amount: null,
        transaction_id: null,
        note: null,
        created_at: today.toISOString(),
      },
    ];

    const metrics = calculateSalesMetrics({
      events,
      proposalsTarget: 5,
      outreachTarget: 3,
      referenceDate: today,
    });

    expect(metrics.proposalsThisWeek).toBe(1);
    expect(metrics.proposalsPercent).toBe(20); // 1/5 = 20%
    expect(metrics.outreachToday).toBe(2); // outreach + call
    expect(metrics.outreachPercent).toBe(67); // 2/3 = 67%
    expect(metrics.totalTouchesThisWeek).toBe(3);
  });
});
