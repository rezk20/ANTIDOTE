import { describe, it, expect } from "vitest";
import { calculateFinancialForecast } from "@/lib/logic/forecast";
import type { TransactionRow } from "@/lib/supabase/types";

describe("Financial 3-Scenario Forecast (§7, D-10)", () => {
  const mockTransactions: TransactionRow[] = [
    {
      id: "tx-1",
      user_id: "user-1",
      bucket_id: null,
      project_id: null,
      lead_id: null,
      kind: "income",
      amount: 30000,
      currency: "EGP",
      category: "Freelance",
      source: "Upwork",
      note: "Project A",
      occurred_on: "2026-06-15",
      is_recurring: false,
      created_at: "2026-06-15T10:00:00Z",
      updated_at: "2026-06-15T10:00:00Z",
    },
    {
      id: "tx-2",
      user_id: "user-1",
      bucket_id: null,
      project_id: null,
      lead_id: null,
      kind: "expense",
      amount: 10000,
      currency: "EGP",
      category: "Living",
      source: "Cash",
      note: "Rent & Food",
      occurred_on: "2026-06-20",
      is_recurring: false,
      created_at: "2026-06-20T10:00:00Z",
      updated_at: "2026-06-20T10:00:00Z",
    },
    {
      id: "tx-3",
      user_id: "user-1",
      bucket_id: null,
      project_id: null,
      lead_id: null,
      kind: "income",
      amount: 40000,
      currency: "EGP",
      category: "Freelance",
      source: "Direct",
      note: "Project B",
      occurred_on: "2026-07-15",
      is_recurring: false,
      created_at: "2026-07-15T10:00:00Z",
      updated_at: "2026-07-15T10:00:00Z",
    },
    {
      id: "tx-4",
      user_id: "user-1",
      bucket_id: null,
      project_id: null,
      lead_id: null,
      kind: "expense",
      amount: 15000,
      currency: "EGP",
      category: "Living",
      source: "Bank",
      note: "Expenses",
      occurred_on: "2026-07-20",
      is_recurring: false,
      created_at: "2026-07-20T10:00:00Z",
      updated_at: "2026-07-20T10:00:00Z",
    },
  ];

  it("calculates 3 scenarios (conservative, base, aggressive) accurately", () => {
    const result = calculateFinancialForecast({
      transactions: mockTransactions,
      currentSavings: 50000,
      targetGoal: 250000,
    });

    expect(result.currentSavings).toBe(50000);
    expect(result.targetGoal).toBe(250000);
    expect(result.gap).toBe(200000);

    // June net = 20,000, July net = 25,000 -> Avg = 22,500
    expect(result.historicalAvgMonthlySavings).toBe(22500);

    expect(result.base.monthlySavingsPace).toBe(22500);
    expect(result.conservative.monthlySavingsPace).toBe(Math.round(22500 * 0.7)); // 15750
    expect(result.aggressive.monthlySavingsPace).toBe(Math.round(22500 * 1.35)); // 30375

    expect(result.base.monthsToGoal).toBe(Math.ceil(200000 / 22500)); // 9 months
    expect(result.realityCheckWarning).toBeNull(); // Less than 12 months, no warning
  });

  it("triggers reality check warning when base timeline exceeds 12 months (§Rule 6)", () => {
    const lowSavingsTx: TransactionRow[] = [
      {
        id: "tx-low-1",
        user_id: "user-1",
        bucket_id: null,
        project_id: null,
        lead_id: null,
        kind: "income",
        amount: 15000,
        currency: "EGP",
        category: "Freelance",
        source: null,
        note: "Small gig",
        occurred_on: "2026-06-15",
        is_recurring: false,
        created_at: "2026-06-15T10:00:00Z",
        updated_at: "2026-06-15T10:00:00Z",
      },
      {
        id: "tx-low-2",
        user_id: "user-1",
        bucket_id: null,
        project_id: null,
        lead_id: null,
        kind: "expense",
        amount: 10000,
        currency: "EGP",
        category: "Living",
        source: null,
        note: "Rent",
        occurred_on: "2026-06-20",
        is_recurring: false,
        created_at: "2026-06-20T10:00:00Z",
        updated_at: "2026-06-20T10:00:00Z",
      },
    ];

    const result = calculateFinancialForecast({
      transactions: lowSavingsTx,
      currentSavings: 10000,
      targetGoal: 250000,
    });

    // Net = 5,000 / month, Gap = 240,000 -> 48 months
    expect(result.base.monthsToGoal).toBeGreaterThan(12);
    expect(result.realityCheckWarning).not.toBeNull();
    expect(result.realityCheckWarning).toContain("ستحتاج إلى 48 شهراً");
  });
});
