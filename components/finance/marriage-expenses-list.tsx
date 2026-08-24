"use client";

import { useState, useMemo } from "react";
import { MarriageExpenseCard } from "./marriage-expense-card";
import { MarriageExpenseModal } from "./marriage-expense-modal";
import { MarriageExpenseDetailModal } from "./marriage-expense-detail-modal";
import { MarriagePaymentModal } from "./marriage-payment-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import { Heart, Plus, Search } from "lucide-react";
import type { MarriageExpenseRow, BucketRow } from "@/lib/supabase/types";
import type { MarriageExpensesSummary } from "@/lib/logic/finance";

export function MarriageExpensesList({
  expenses,
  summary,
  buckets = [],
}: {
  expenses: MarriageExpenseRow[];
  summary: MarriageExpensesSummary;
  buckets?: BucketRow[];
}) {
  const { t, isRtl } = useLocale();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<MarriageExpenseRow | null>(
    null,
  );

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<MarriageExpenseRow | null>(null);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentExpense, setPaymentExpense] =
    useState<MarriageExpenseRow | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedStatus !== "all" && e.status !== selectedStatus) return false;
      if (selectedCategory !== "all" && e.category !== selectedCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const itemMatch = e.item.toLowerCase().includes(q);
        const catMatch = e.category?.toLowerCase().includes(q) ?? false;
        const noteMatch = e.notes?.toLowerCase().includes(q) ?? false;
        if (!itemMatch && !catMatch && !noteMatch) return false;
      }
      return true;
    });
  }, [expenses, selectedStatus, selectedCategory, searchQuery]);

  function handleCreate() {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  }

  function handleEdit(expense: MarriageExpenseRow) {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  }

  function handleViewDetails(expense: MarriageExpenseRow) {
    setSelectedExpense(expense);
    setIsDetailOpen(true);
  }

  function handleRecordPayment(expense: MarriageExpenseRow) {
    setPaymentExpense(expense);
    setIsPaymentOpen(true);
  }

  const categoryOptions = [
    { value: "all", label: isRtl ? "كافة البنود والتصنيفات" : "All Categories" },
    { value: "furniture", label: "🛏️ أثاث ومفروشات (Furniture)" },
    { value: "finishing", label: "🎨 تشطيب وديكور (Finishing)" },
    { value: "appliances", label: "🔌 أجهزة كهربائية (Appliances)" },
    { value: "jewelry", label: "💍 شبكة ومجوهرات (Jewelry)" },
    { value: "rent_deposit", label: "🏠 إيجار وتأمين (Rent)" },
    { value: "hall", label: "🎉 قاعة وفرح (Hall)" },
    { value: "clothing", label: "👔 ملابس وبدلة (Clothing)" },
    { value: "photography", label: "📸 تصوير (Photo)" },
    { value: "transport", label: "🚗 سيارات ونقل (Transport)" },
    { value: "misc", label: "📦 متفرقات (Misc)" },
  ];

  const statusOptions = [
    { value: "all", label: isRtl ? "كافة الحالات" : "All Statuses" },
    { value: "planned", label: isRtl ? "مخطط لها (Planned)" : "Planned" },
    { value: "in_progress", label: isRtl ? "قيد الدفع (In Progress)" : "In Progress" },
    { value: "paid", label: isRtl ? "مدفوعة بالكامل (Paid)" : "Paid" },
    { value: "dropped", label: isRtl ? "ملغاة (Dropped)" : "Dropped" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 block">
            {t.marriageExpenses.totalBudget}
          </span>
          <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {summary.totalActual.toLocaleString()}{" "}
            <span className="text-xs font-semibold text-zinc-400">EGP</span>
          </div>
          <span className="text-[10px] text-zinc-400">
            {summary.itemsCount} {isRtl ? "بند زواج مسجل" : "items planned"}
          </span>
        </div>

        <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 block">
            {t.marriageExpenses.totalPaid}
          </span>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {summary.totalPaid.toLocaleString()}{" "}
            <span className="text-xs font-semibold text-zinc-400">EGP</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            {summary.paidCount} {isRtl ? "بنود مسددة بالكامل" : "items fully paid"}
          </span>
        </div>

        <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 block">
            {t.marriageExpenses.remaining}
          </span>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
            {summary.remainingToPay.toLocaleString()}{" "}
            <span className="text-xs font-semibold text-zinc-400">EGP</span>
          </div>
          <span className="text-[10px] text-zinc-400">
            {isRtl ? "متبقي للسداد والإنجاز" : "remaining cash needed"}
          </span>
        </div>

        <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 block">
            {isRtl ? "نسبة سداد التكاليف" : "Checklist Progress"}
          </span>
          <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
            {summary.progressPercent}%
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${summary.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.marriageExpenses.title} ({filteredExpenses.length})
          </h2>
        </div>

        <Button onClick={handleCreate} size="sm" className="gap-1.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white">
          <Plus className="h-4 w-4" />
          <span>{t.marriageExpenses.newExpense}</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "بحث في البنود..." : "Search items..."}
            className="ps-9 text-xs rounded-xl"
          />
        </div>

        <div>
          <CustomSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoryOptions}
            className="text-xs rounded-xl"
          />
        </div>

        <div>
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            className="text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Grid of Items */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-6 w-6 text-rose-500" />}
          title={t.marriageExpenses.noExpensesTitle}
          description={t.marriageExpenses.noExpensesDesc}
          action={
            <Button onClick={handleCreate} size="sm" className="rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white">
              {t.marriageExpenses.newExpense}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((expense) => (
            <MarriageExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
              onRecordPayment={handleRecordPayment}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <MarriageExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseToEdit={expenseToEdit}
      />

      {/* Detail View Modal */}
      <MarriageExpenseDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        expense={selectedExpense}
        onEdit={() => {
          if (selectedExpense) handleEdit(selectedExpense);
        }}
        onRecordPayment={() => {
          if (selectedExpense) handleRecordPayment(selectedExpense);
        }}
      />

      {/* Record Payment Modal */}
      <MarriagePaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        expense={paymentExpense}
        buckets={buckets}
      />
    </div>
  );
}
