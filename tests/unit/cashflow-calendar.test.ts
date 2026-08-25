import { describe, it, expect } from "vitest";
import { calculateCashFlowProjection } from "@/lib/logic/cashflow-calendar";
import type {
  BucketRow,
  TransactionRow,
  ProjectRow,
  MarriageExpenseRow,
} from "@/lib/supabase/types";

describe("Cash Flow Calendar Projection Module", () => {
  it("calculates current cash, expected income, expenses, and projected end-of-month cash", () => {
    const currentMonth = "2026-08";

    const buckets: BucketRow[] = [
      {
        id: "b1",
        user_id: "u1",
        name: "Main Cash",
        kind: "personal",
        target_amount: 50000,
        starting_balance: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const transactions: TransactionRow[] = [
      {
        id: "tx1",
        user_id: "u1",
        amount: 20000,
        kind: "income",
        category: "salary",
        occurred_on: "2026-08-01",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: "b1",
        note: null,
        is_recurring: false,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "tx2",
        user_id: "u1",
        amount: 2000,
        kind: "expense",
        category: "subscriptions",
        occurred_on: "2026-08-05",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: "b1",
        note: null,
        is_recurring: true,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const projects: ProjectRow[] = [
      {
        id: "p1",
        user_id: "u1",
        client_id: null,
        name: "Freelance Project",
        kind: "client",
        brief: null,
        requirements: null,
        status: "active",
        budget: 10000,
        started_on: "2026-08-01",
        deadline: "2026-08-30",
        meta: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const marriageExpenses: MarriageExpenseRow[] = [
      {
        id: "m1",
        user_id: "u1",
        category: "hall",
        item: "قسط القاعة",
        estimated_cost: 8000,
        actual_cost: 8000,
        paid_amount: 3000, // remaining 5,000
        deadline: "2026-08-25",
        priority: "high",
        status: "in_progress",
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const projection = calculateCashFlowProjection({
      buckets,
      transactions,
      projects,
      marriageExpenses,
      currentMonth,
    });

    // Bucket balance = 20000 - 2000 = 18000
    expect(projection.currentCashBalance).toBe(18000);
    expect(projection.expectedIncome).toBe(10000);
    expect(projection.expectedExpenses).toBe(2000);
    expect(projection.upcomingMarriagePayments).toBe(5000);
    // 18000 + 10000 - 2000 - 5000 = 21000
    expect(projection.projectedEndMonthCash).toBe(21000);
    expect(projection.events.length).toBe(3);
  });
});
