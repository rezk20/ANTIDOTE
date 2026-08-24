"use client";

import { useTransition } from "react";
import { deleteMarriageExpense } from "@/lib/actions/finance";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import type { MarriageExpenseRow } from "@/lib/supabase/types";

export function MarriageExpenseCard({
  expense,
  onEdit,
  onViewDetails,
  onRecordPayment,
}: {
  expense: MarriageExpenseRow;
  onEdit: (expense: MarriageExpenseRow) => void;
  onViewDetails: (expense: MarriageExpenseRow) => void;
  onRecordPayment: (expense: MarriageExpenseRow) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const est = Number(expense.estimated_cost) || 0;
  const act = expense.actual_cost != null ? Number(expense.actual_cost) : est;
  const paid = Number(expense.paid_amount) || 0;
  const remaining = Math.max(0, act - paid);
  const progress = act > 0 ? Math.min(100, Math.round((paid / act) * 100)) : 0;

  const priorityVariant: Record<string, "danger" | "warning" | "accent" | "secondary"> = {
    critical: "danger",
    high: "warning",
    medium: "accent",
    low: "secondary",
  };

  const statusVariant =
    expense.status === "paid"
      ? "success"
      : expense.status === "in_progress"
        ? "accent"
        : expense.status === "dropped"
          ? "danger"
          : "outline";

  return (
    <div className="group p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-3.5">
      {/* Header: Item, Category, Priority, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {expense.item}
            </h3>
            <Badge
              variant={priorityVariant[expense.priority] || "outline"}
              className="text-[10px] py-0 px-1.5 font-bold uppercase"
            >
              {expense.priority}
            </Badge>
          </div>

          <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 capitalize">
            {expense.category?.replace(/_/g, " ") || "misc"}
          </p>
        </div>

        <Badge
          variant={statusVariant}
          className="text-[10px] py-0 px-2 font-bold uppercase shrink-0"
        >
          {expense.status}
        </Badge>
      </div>

      {/* Financials & Progress */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span>
            {isRtl ? "المدفوع:" : "Paid:"}{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {paid.toLocaleString()} EGP
            </span>
          </span>
          <span className="text-zinc-500">
            {isRtl ? "من إجمالي:" : "of"}{" "}
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
              {act.toLocaleString()} EGP
            </span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              expense.status === "paid" ? "bg-emerald-500" : "bg-rose-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Remaining & Deadline */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
          <span>
            {remaining > 0 ? (
              <span>
                {isRtl ? "المتبقي:" : "Left:"}{" "}
                <strong className="text-rose-600 dark:text-rose-400">
                  {remaining.toLocaleString()} EGP
                </strong>
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {isRtl ? "✓ مسدد بالكامل" : "✓ Fully Paid"}
              </span>
            )}
          </span>

          {expense.deadline && (
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-medium">
              <Calendar className="h-3 w-3" />
              <span>{expense.deadline}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        {remaining > 0 && expense.status !== "dropped" ? (
          <button
            onClick={() => onRecordPayment(expense)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <CreditCard className="h-3 w-3" />
            <span>{t.marriageExpenses.recordPayment}</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(expense)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            title={t.common.viewDetails}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={t.common.edit}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            disabled={isPending}
            onClick={() => {
              if (confirm(`${t.common.confirmDelete} "${expense.item}"?`)) {
                startTransition(async () => {
                  await deleteMarriageExpense(expense.id);
                });
              }
            }}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title={t.common.delete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
