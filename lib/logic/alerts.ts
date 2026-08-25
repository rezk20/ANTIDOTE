import type {
  TransactionRow,
  MarriageExpenseRow,
  ProfileRow,
} from "@/lib/supabase/types";

export type FinanceAlertType = "behind_target" | "income_rise" | "unexpected_expense";

export interface FinanceAlert {
  id: string;
  type: FinanceAlertType;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  amountDiff?: number;
  severity: "info" | "warning" | "success";
  actionLabelAr?: string;
  actionLabelEn?: string;
  actionHref?: string;
}

export function evaluateFinanceAlerts(params: {
  transactions: TransactionRow[];
  marriageExpenses: MarriageExpenseRow[];
  profile: ProfileRow | null;
  currentMonth: string; // YYYY-MM
}): FinanceAlert[] {
  const { transactions, marriageExpenses, profile, currentMonth } = params;
  const alerts: FinanceAlert[] = [];

  // Filter transactions for current month
  const monthTxs = transactions.filter((t) => t.occurred_on.startsWith(currentMonth));
  const monthIncome = monthTxs
    .filter((t) => t.kind === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const monthExpenses = monthTxs
    .filter((t) => t.kind === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const monthSavings = Math.max(0, monthIncome - monthExpenses);

  // Settings targets
  const settings = (profile?.settings as Record<string, unknown>) || {};
  const comfortTarget = Number(settings.comfortIncomeTarget || settings.monthlyTargetAmount || 30000);
  const savingsTarget = Math.round(comfortTarget * 0.4); // Target 40% savings rate

  // 1. Behind Target Alert (§49)
  if (monthIncome > 0 && monthSavings < savingsTarget * 0.7) {
    const diff = Math.round(savingsTarget - monthSavings);
    alerts.push({
      id: `alert_behind_${currentMonth}`,
      type: "behind_target",
      titleAr: "تنبيه خطة الادخار لهذا الشهر",
      titleEn: "Savings Target Notice",
      messageAr: `أنت أقل من وتيرة الادخار المستهدفة بـ ${diff.toLocaleString()} ج.م. يمكنك تكثيف عروض الـ Proposals أو ضبط النفقات غير الأساسية بهدوء.`,
      messageEn: `You are ${diff.toLocaleString()} EGP behind the monthly savings pace. Consider increasing freelance proposals or adjusting discretionary costs.`,
      amountDiff: diff,
      severity: "warning",
      actionLabelAr: "فتح خطة المبيعات",
      actionLabelEn: "Open Sales Pipeline",
      actionHref: "/freelance",
    });
  }

  // 2. Income Rise Alert (§49)
  if (monthIncome >= comfortTarget * 1.25) {
    const surplus = Math.round(monthIncome - comfortTarget);
    alerts.push({
      id: `alert_rise_${currentMonth}`,
      type: "income_rise",
      titleAr: "قفزة إيجابية في الدخل (+25%) 🚀",
      titleEn: "Income Surge Detected (+25%)",
      messageAr: `حقق دخلك هذا الشهر زيادة بقيمة +${surplus.toLocaleString()} ج.م فوق المستهدف! هل تود توجيه الفائض لتسريع تجهيزات الزواج؟`,
      messageEn: `Your income this month exceeds the target by +${surplus.toLocaleString()} EGP! Would you like to allocate the surplus toward marriage goals?`,
      amountDiff: surplus,
      severity: "success",
      actionLabelAr: "تخصيص في الزواج",
      actionLabelEn: "Allocate to Marriage",
      actionHref: "/marriage",
    });
  }

  // 3. Unexpected Expense Alert (§49)
  const largeExpenses = monthTxs.filter(
    (t) => t.kind === "expense" && !t.is_recurring && Number(t.amount) >= 4000,
  );

  if (largeExpenses.length > 0) {
    const maxExp = largeExpenses.reduce((prev, curr) =>
      Number(curr.amount) > Number(prev.amount) ? curr : prev,
    );
    const amt = Number(maxExp.amount);

    alerts.push({
      id: `alert_unexp_${maxExp.id}`,
      type: "unexpected_expense",
      titleAr: "مصروف طارئ غير معتاد",
      titleEn: "Unbudgeted Expense Recorded",
      messageAr: `تم تسجيل مصروف استثنائي (${maxExp.category}: ${amt.toLocaleString()} ج.م). النظام يقترح تكييف وتوزيع خطة الشهور القادمة بدون أي ضغط.`,
      messageEn: `An unexpected expense of ${amt.toLocaleString()} EGP was logged. Consider adapting upcoming monthly targets smoothly.`,
      amountDiff: amt,
      severity: "info",
      actionLabelAr: "مراجعة المالية",
      actionLabelEn: "Review Finances",
      actionHref: "/finances",
    });
  }

  // 4. Marriage payment shortfall check
  const dueMarriage = marriageExpenses.filter(
    (m) =>
      m.deadline &&
      m.deadline.startsWith(currentMonth) &&
      m.status !== "paid" &&
      m.status !== "dropped",
  );

  if (dueMarriage.length > 0) {
    const totalDue = dueMarriage.reduce(
      (acc, m) =>
        acc + Math.max(0, (m.actual_cost || m.estimated_cost) - m.paid_amount),
      0,
    );
    if (totalDue > 0 && monthSavings < totalDue) {
      alerts.push({
        id: `alert_marr_due_${currentMonth}`,
        type: "behind_target",
        titleAr: "استحقاق قسط زواج هذا الشهر",
        titleEn: "Marriage Payment Due",
        messageAr: `لديك أقساط زواج مستحقة هذا الشهر بقيمة ${totalDue.toLocaleString()} ج.م تفوق الفائض الحالي. يمكنك جدولة السداد بهدوء.`,
        messageEn: `Upcoming marriage payments of ${totalDue.toLocaleString()} EGP exceed current surplus.`,
        amountDiff: totalDue - monthSavings,
        severity: "warning",
        actionLabelAr: "خطة الزواج",
        actionLabelEn: "Marriage Plan",
        actionHref: "/marriage",
      });
    }
  }

  return alerts;
}
