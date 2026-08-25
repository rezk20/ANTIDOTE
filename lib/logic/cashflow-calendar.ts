import type {
  ProjectRow,
  MarriageExpenseRow,
  TransactionRow,
  BucketRow,
} from "@/lib/supabase/types";
import { calculateBucketBalances } from "@/lib/logic/finance";

export interface CashEvent {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "income" | "expense" | "marriage";
}

export interface CashFlowProjection {
  currentCashBalance: number;
  expectedIncome: number;
  expectedExpenses: number;
  upcomingMarriagePayments: number;
  projectedEndMonthCash: number;
  events: CashEvent[];
}

export function calculateCashFlowProjection(params: {
  buckets: BucketRow[];
  transactions: TransactionRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
  currentMonth: string; // YYYY-MM
}): CashFlowProjection {
  const { buckets, transactions, projects, marriageExpenses, currentMonth } = params;

  // 1. Current Cash Balance (Sum of computed bucket balances)
  const computedBuckets = calculateBucketBalances(buckets, transactions);
  const currentCashBalance = computedBuckets.reduce(
    (acc, b) => acc + (b.currentBalance || 0),
    0,
  );

  const events: CashEvent[] = [];

  // 2. Expected Income (Active client projects with budget)
  let expectedIncome = 0;
  for (const p of projects) {
    if (p.status === "active" && p.budget && p.budget > 0) {
      const amt = Number(p.budget);
      expectedIncome += amt;
      events.push({
        id: `inc_proj_${p.id}`,
        title: `مستحقات مشروع: ${p.name}`,
        date: p.deadline || `${currentMonth}-28`,
        amount: amt,
        type: "income",
      });
    }
  }

  // 3. Expected Recurring Expenses (Recurring monthly expenses from transactions history or average)
  const recurringTransactions = transactions.filter((t) => t.is_recurring && t.kind === "expense");
  let expectedExpenses = 0;
  for (const r of recurringTransactions) {
    const amt = Number(r.amount || 0);
    expectedExpenses += amt;
    events.push({
      id: `exp_rec_${r.id}`,
      title: `مصروف دوري: ${r.category}`,
      date: `${currentMonth}-05`,
      amount: amt,
      type: "expense",
    });
  }

  // 4. Upcoming Marriage Payments in Current Month
  let upcomingMarriagePayments = 0;
  for (const m of marriageExpenses) {
    if (m.status !== "paid" && m.status !== "dropped") {
      const est = Number(m.actual_cost || m.estimated_cost || 0);
      const paid = Number(m.paid_amount || 0);
      const remaining = Math.max(0, est - paid);
      if (remaining > 0) {
        const isThisMonth = m.deadline && m.deadline.startsWith(currentMonth);
        if (isThisMonth) {
          upcomingMarriagePayments += remaining;
          events.push({
            id: `marr_exp_${m.id}`,
            title: `دفعة زواج: ${m.item}`,
            date: m.deadline!,
            amount: remaining,
            type: "marriage",
          });
        }
      }
    }
  }

  const projectedEndMonthCash =
    currentCashBalance + expectedIncome - expectedExpenses - upcomingMarriagePayments;

  // Sort events chronologically
  events.sort((a, b) => a.date.localeCompare(b.date));

  return {
    currentCashBalance,
    expectedIncome,
    expectedExpenses,
    upcomingMarriagePayments,
    projectedEndMonthCash,
    events,
  };
}
