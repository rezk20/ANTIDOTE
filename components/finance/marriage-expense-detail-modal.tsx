"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Heart,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import type { MarriageExpenseRow } from "@/lib/supabase/types";

export function MarriageExpenseDetailModal({
  isOpen,
  onClose,
  expense,
  onEdit,
  onRecordPayment,
}: {
  isOpen: boolean;
  onClose: () => void;
  expense: MarriageExpenseRow | null;
  onEdit?: () => void;
  onRecordPayment?: (expense: MarriageExpenseRow) => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !expense) return null;

  const est = Number(expense.estimated_cost) || 0;
  const act = expense.actual_cost != null ? Number(expense.actual_cost) : est;
  const paid = Number(expense.paid_amount) || 0;
  const remaining = Math.max(0, act - paid);

  const chips: DetailChip[] = [
    {
      label: t.common.status,
      value: expense.status.toUpperCase(),
      variant:
        expense.status === "paid"
          ? "emerald"
          : expense.status === "in_progress"
            ? "amber"
            : "default",
    },
    {
      label: t.marriageExpenses.category,
      value: (expense.category || "misc").toUpperCase(),
      variant: "purple",
    },
    {
      label: t.marriageExpenses.priority,
      value: expense.priority.toUpperCase(),
      variant:
        expense.priority === "critical"
          ? "rose"
          : expense.priority === "high"
            ? "amber"
            : "default",
    },
    {
      label: t.marriageExpenses.estimatedCost,
      value: `${est.toLocaleString()} EGP`,
      icon: <DollarSign className="h-3 w-3" />,
    },
    {
      label: t.marriageExpenses.actualCost,
      value:
        expense.actual_cost != null
          ? `${act.toLocaleString()} EGP`
          : isRtl
            ? "نفس التقديري"
            : "Same as Est.",
      variant: "purple",
    },
    {
      label: t.marriageExpenses.paidAmount,
      value: `${paid.toLocaleString()} EGP`,
      variant: "emerald",
      icon: <CreditCard className="h-3 w-3" />,
    },
    {
      label: t.marriageExpenses.remaining,
      value: `${remaining.toLocaleString()} EGP`,
      variant: remaining === 0 ? "emerald" : "rose",
    },
    {
      label: t.marriageExpenses.deadline,
      value: expense.deadline || (isRtl ? "غير محدد" : "None"),
      variant: expense.deadline ? "amber" : "default",
      icon: <Calendar className="h-3 w-3" />,
    },
  ];

  const sections: DetailSection[] = [];

  if (expense.notes) {
    sections.push({
      title: t.marriageExpenses.notes,
      icon: <FileText className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <p className="whitespace-pre-wrap leading-relaxed">
          {expense.notes}
        </p>
      ),
    });
  }

  if (onRecordPayment && remaining > 0 && expense.status !== "dropped") {
    sections.push({
      title: t.marriageExpenses.recordPayment,
      icon: <CreditCard className="h-3.5 w-3.5 text-emerald-500" />,
      content: (
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-xs">
            {isRtl
              ? `المتبقي للسداد: ${remaining.toLocaleString()} EGP`
              : `Remaining balance: ${remaining.toLocaleString()} EGP`}
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onClose();
              onRecordPayment(expense);
            }}
            className="gap-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>{t.marriageExpenses.recordPayment}</span>
          </Button>
        </div>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={expense.item}
      subtitle={t.marriageExpenses.expenseDetails}
      icon={<Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
      badge={
        <Badge
          variant={expense.status === "paid" ? "success" : "default"}
          className="text-xs font-bold uppercase"
        >
          {expense.status}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.marriageExpenses.editExpense}
    />
  );
}
