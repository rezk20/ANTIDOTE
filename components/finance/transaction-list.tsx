"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TransactionItem } from "./transaction-item";
import { TransactionModal } from "./transaction-modal";
import { TransactionDetailModal } from "./transaction-detail-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import {
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
} from "lucide-react";
import type {
  TransactionRow,
  BucketRow,
  ProjectRow,
  LeadRow,
} from "@/lib/supabase/types";

export function TransactionList({
  transactions,
  buckets = [],
  projects = [],
  leads = [],
  selectedMonth,
}: {
  transactions: TransactionRow[];
  buckets?: BucketRow[];
  projects?: ProjectRow[];
  leads?: LeadRow[];
  selectedMonth: string; // YYYY-MM
}) {
  const { t, isRtl } = useLocale();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionRow | null>(null);
  const [defaultKind, setDefaultKind] = useState<"income" | "expense">("income");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionRow | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedKind, setSelectedKind] = useState("all");

  // Month navigation
  function navigateMonth(offset: number) {
    const [y, m] = selectedMonth.split("-").map((n) => parseInt(n, 10));
    const d = new Date(y, m - 1 + offset, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/finances?month=${newMonth}`);
  }

  function resetToCurrentMonth() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/finances?month=${currentMonth}`);
  }

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedKind !== "all" && tx.kind !== selectedKind) return false;
      if (selectedCategory !== "all" && tx.category !== selectedCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const catMatch = tx.category.toLowerCase().includes(q);
        const sourceMatch = tx.source?.toLowerCase().includes(q) ?? false;
        const noteMatch = tx.note?.toLowerCase().includes(q) ?? false;
        if (!catMatch && !sourceMatch && !noteMatch) return false;
      }
      return true;
    });
  }, [transactions, selectedKind, selectedCategory, searchQuery]);

  // Computed month totals
  const totalIncome = filteredTransactions
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const netSavings = totalIncome - totalExpenses;

  // Format month title
  const [yearNum, monthNum] = selectedMonth.split("-").map(Number);
  const monthDate = new Date(yearNum, monthNum - 1, 1);
  const monthFormatted = monthDate.toLocaleDateString(
    isRtl ? "ar-EG" : "en-US",
    { month: "long", year: "numeric" },
  );

  function handleCreate(kind: "income" | "expense" = "income") {
    setTransactionToEdit(null);
    setDefaultKind(kind);
    setIsModalOpen(true);
  }

  function handleEdit(tx: TransactionRow) {
    setTransactionToEdit(tx);
    setIsModalOpen(true);
  }

  function handleViewDetails(tx: TransactionRow) {
    setSelectedTx(tx);
    setIsDetailOpen(true);
  }

  // Distinct categories in current month
  const categoryOptions = [
    { value: "all", label: t.finances.allCategories },
    ...Array.from(new Set(transactions.map((t) => t.category))).map((cat) => ({
      value: cat,
      label: cat.replace(/_/g, " ").toUpperCase(),
    })),
  ];

  const kindOptions = [
    { value: "all", label: t.finances.allKinds },
    { value: "income", label: t.finances.income },
    { value: "expense", label: t.finances.expense },
  ];

  return (
    <div className="space-y-6">
      {/* Month Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs">
        {/* Month selector buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>

          <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 px-2 min-w-[160px] text-center">
            {monthFormatted}
          </h3>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetToCurrentMonth}
            className="text-xs font-bold rounded-xl ms-1 py-1"
          >
            {isRtl ? "الشهر الحالي" : "Current Month"}
          </Button>
        </div>

        {/* New Transaction Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleCreate("income")}
            size="sm"
            className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>{isRtl ? "+ دخل" : "+ Income"}</span>
          </Button>

          <Button
            onClick={() => handleCreate("expense")}
            size="sm"
            className="gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>{isRtl ? "- مصروف" : "- Expense"}</span>
          </Button>
        </div>
      </div>

      {/* Month Totals Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {t.finances.totalIncome}:
          </span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            +{totalIncome.toLocaleString()} EGP
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
            {t.finances.totalExpenses}:
          </span>
          <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
            -{totalExpenses.toLocaleString()} EGP
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <span className="text-xs font-bold text-purple-800 dark:text-purple-300">
            {t.finances.netSavings}:
          </span>
          <span
            className={`text-sm font-extrabold ${
              netSavings >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {netSavings >= 0 ? "+" : ""}
            {netSavings.toLocaleString()} EGP
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "بحث في المصدر أو الملاحظات..." : "Search source or notes..."}
            className="ps-9 text-xs rounded-xl"
          />
        </div>

        <div>
          <CustomSelect
            value={selectedKind}
            onChange={setSelectedKind}
            options={kindOptions}
            className="text-xs rounded-xl"
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
      </div>

      {/* Transaction Items */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
          title={t.finances.noTransactionsTitle}
          description={t.finances.noTransactionsDesc}
          action={
            <Button
              onClick={() => handleCreate("income")}
              size="sm"
              className="rounded-xl font-bold"
            >
              {t.finances.newTransaction}
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              buckets={buckets}
              projects={projects}
              leads={leads}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={transactionToEdit}
        buckets={buckets}
        projects={projects}
        leads={leads}
        defaultKind={defaultKind}
      />

      <TransactionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        transaction={selectedTx}
        buckets={buckets}
        projects={projects}
        leads={leads}
        onEdit={() => {
          if (selectedTx) handleEdit(selectedTx);
        }}
      />
    </div>
  );
}
