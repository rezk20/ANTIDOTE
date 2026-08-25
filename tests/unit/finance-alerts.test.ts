import { describe, it, expect } from "vitest";
import { evaluateFinanceAlerts } from "@/lib/logic/alerts";
import type { TransactionRow, MarriageExpenseRow, ProfileRow } from "@/lib/supabase/types";

describe("Finance Alert Logic Module (§49)", () => {
  const currentMonth = "2026-08";

  const mockProfile: ProfileRow = {
    id: "u1",
    display_name: "Test User",
    email: "user@antidote.life",
    timezone: "Africa/Cairo",
    currency: "EGP",
    weekly_off_day: "friday",
    agent_api_key: null,
    settings: {
      comfortIncomeTarget: 30000,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it("triggers behind_target alert when savings rate is lower than 70% of target pace", () => {
    const transactions: TransactionRow[] = [
      {
        id: "tx1",
        user_id: "u1",
        amount: 10000,
        kind: "income",
        category: "salary",
        occurred_on: "2026-08-01",
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
        id: "tx2",
        user_id: "u1",
        amount: 8000, // leaving only 2000 savings (vs 12000 target savings)
        kind: "expense",
        category: "rent",
        occurred_on: "2026-08-05",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: null,
        note: null,
        is_recurring: true,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const alerts = evaluateFinanceAlerts({
      transactions,
      marriageExpenses: [],
      profile: mockProfile,
      currentMonth,
    });

    const behindAlert = alerts.find((a) => a.type === "behind_target");
    expect(behindAlert).toBeDefined();
    expect(behindAlert?.severity).toBe("warning");
    expect(behindAlert?.amountDiff).toBeGreaterThan(0);
  });

  it("triggers income_rise alert when income exceeds target by 25%+", () => {
    const transactions: TransactionRow[] = [
      {
        id: "tx1",
        user_id: "u1",
        amount: 45000, // comfort target is 30,000 (+50% surge)
        kind: "income",
        category: "freelance",
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
    ];

    const alerts = evaluateFinanceAlerts({
      transactions,
      marriageExpenses: [],
      profile: mockProfile,
      currentMonth,
    });

    const riseAlert = alerts.find((a) => a.type === "income_rise");
    expect(riseAlert).toBeDefined();
    expect(riseAlert?.severity).toBe("success");
    expect(riseAlert?.amountDiff).toBe(15000);
  });

  it("triggers unexpected_expense alert for large non-recurring expenses", () => {
    const transactions: TransactionRow[] = [
      {
        id: "tx_large",
        user_id: "u1",
        amount: 6000,
        kind: "expense",
        category: "electronics",
        occurred_on: "2026-08-15",
        source: null,
        project_id: null,
        lead_id: null,
        bucket_id: null,
        note: "صيانة طارئة للجهاز",
        is_recurring: false,
        currency: "EGP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const alerts = evaluateFinanceAlerts({
      transactions,
      marriageExpenses: [],
      profile: mockProfile,
      currentMonth,
    });

    const unexpAlert = alerts.find((a) => a.type === "unexpected_expense");
    expect(unexpAlert).toBeDefined();
    expect(unexpAlert?.severity).toBe("info");
    expect(unexpAlert?.amountDiff).toBe(6000);
  });

  it("triggers alert when marriage payment due this month exceeds current savings", () => {
    const marriageExpenses: MarriageExpenseRow[] = [
      {
        id: "m1",
        user_id: "u1",
        category: "hall",
        item: "قسط القاعة",
        estimated_cost: 20000,
        actual_cost: 20000,
        paid_amount: 5000, // 15000 due
        deadline: "2026-08-25",
        priority: "high",
        status: "in_progress",
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const alerts = evaluateFinanceAlerts({
      transactions: [],
      marriageExpenses,
      profile: mockProfile,
      currentMonth,
    });

    const marrAlert = alerts.find((a) => a.id === `alert_marr_due_${currentMonth}`);
    expect(marrAlert).toBeDefined();
    expect(marrAlert?.severity).toBe("warning");
    expect(marrAlert?.amountDiff).toBe(15000);
  });
});
