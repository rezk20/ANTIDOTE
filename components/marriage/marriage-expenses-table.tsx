"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { deleteMarriageExpense } from "@/lib/actions/marriage";
import { MARRIAGE_EXPENSE_CATEGORIES } from "@/lib/schemas/marriage";
import type { MarriageExpenseRow } from "@/lib/supabase/types";
import type { MarriageExpensesSummary } from "@/lib/logic/finance";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface MarriageExpensesTableProps {
  expenses: MarriageExpenseRow[];
  summary: MarriageExpensesSummary;
  onAddExpense: () => void;
  onEditExpense: (expense: MarriageExpenseRow) => void;
  onRecordPayment: (expense: MarriageExpenseRow) => void;
}

export function MarriageExpensesTable({
  expenses,
  summary,
  onAddExpense,
  onEditExpense,
  onRecordPayment,
}: MarriageExpensesTableProps) {
  const { t } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory === "all") return true;
    return e.category === selectedCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm(t.marriagePage.deleteConfirm)) {
      startTransition(async () => {
        await deleteMarriageExpense(id);
      });
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-6">
      {/* Table Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {t.marriagePage.expensesTitle}
          </h3>
          <p className="text-xs text-zinc-500">
            {t.marriagePage.expensesSubtitle}
          </p>
        </div>

        <Button
          onClick={onAddExpense}
          className="rounded-2xl text-xs font-black gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.marriagePage.newExpense}</span>
        </Button>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <span className="text-[10px] font-bold text-zinc-400">إجمالي التقديري</span>
          <p className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {summary.totalEstimated.toLocaleString()} ج.م
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">المسدد فعلياً</span>
          <p className="text-base font-black text-emerald-800 dark:text-emerald-300">
            {summary.totalPaid.toLocaleString()} ج.م
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400">المتبقي للسداد</span>
          <p className="text-base font-black text-rose-800 dark:text-rose-300">
            {summary.remainingToPay.toLocaleString()} ج.م
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">البنود المكتملة</span>
          <p className="text-base font-black text-blue-800 dark:text-blue-300">
            {summary.paidCount} / {summary.itemsCount} بند ({summary.progressPercent}%)
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          كافة البنود ({expenses.length})
        </button>

        {MARRIAGE_EXPENSE_CATEGORIES.map((cat) => {
          const count = expenses.filter((e) => e.category === cat).length;
          if (count === 0) return null;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span>{t.marriagePage.categories[cat as keyof typeof t.marriagePage.categories] || cat}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Expenses Table / Cards */}
      {filteredExpenses.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 space-y-2">
          <Clock className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            لا توجد مصروفات في هذا التصنيف
          </h4>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 overflow-hidden">
          {filteredExpenses.map((exp) => {
            const cost = Number(exp.actual_cost || exp.estimated_cost || 0);
            const paid = Number(exp.paid_amount || 0);
            const remaining = Math.max(0, cost - paid);
            const isPaid = exp.status === "paid" || remaining === 0;

            return (
              <div
                key={exp.id}
                className="py-3.5 flex flex-wrap items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {exp.item}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold">
                      {t.marriagePage.categories[exp.category as keyof typeof t.marriagePage.categories] || exp.category}
                    </span>
                    {exp.priority === "critical" && (
                      <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-extrabold">
                        حرج
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                    {exp.deadline && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Calendar className="h-3 w-3" />
                        <span>استحقاق: {exp.deadline}</span>
                      </span>
                    )}
                    {exp.notes && <span className="line-clamp-1">{exp.notes}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {cost.toLocaleString()} ج.م
                    </div>
                    <div className="text-[11px] font-bold text-zinc-500">
                      {isPaid ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>مسدد بالكامل</span>
                        </span>
                      ) : (
                        <span>
                          مسدد: {paid.toLocaleString()} | <strong className="text-rose-600 dark:text-rose-400">المتبقي: {remaining.toLocaleString()}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isPaid && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRecordPayment(exp)}
                        className="text-[11px] font-bold gap-1 rounded-xl h-8 px-2.5 cursor-pointer text-emerald-600 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        <CreditCard className="h-3 w-3" />
                        <span>سداد</span>
                      </Button>
                    )}

                    <button
                      onClick={() => onEditExpense(exp)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(exp.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
