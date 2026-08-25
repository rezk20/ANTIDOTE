"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { MarriageHeroProgress } from "./marriage-hero-progress";
import { MarriageReadinessChecklist } from "./marriage-readiness-checklist";
import { MarriageExpensesTable } from "./marriage-expenses-table";
import { MarriageExpenseModal } from "./marriage-expense-modal";
import { MarriagePaymentModal } from "./marriage-payment-modal";
import { MarriageTargetModal } from "./marriage-target-modal";
import type { MarriagePageData } from "@/lib/dal/marriage";
import type { MarriageExpenseRow } from "@/lib/supabase/types";

interface MarriageViewProps {
  data: MarriagePageData;
}

export function MarriageView({ data }: MarriageViewProps) {
  const { t } = useLocale();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<MarriageExpenseRow | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentExpense, setPaymentExpense] = useState<MarriageExpenseRow | null>(null);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  const handleAddExpense = () => {
    setExpenseToEdit(null);
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: MarriageExpenseRow) => {
    setExpenseToEdit(expense);
    setIsExpenseModalOpen(true);
  };

  const handleRecordPayment = (expense: MarriageExpenseRow) => {
    setPaymentExpense(expense);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
          {t.marriagePage.title}
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          {t.marriagePage.subtitle}
        </p>
      </div>

      {/* 1. Hero Progress */}
      <MarriageHeroProgress
        metrics={data.goalMetrics}
        onEditTarget={() => setIsTargetModalOpen(true)}
      />

      {/* 2. Readiness Dimensions Checklist */}
      <MarriageReadinessChecklist readiness={data.readiness} />

      {/* 3. Itemized Expenses Table */}
      <MarriageExpensesTable
        expenses={data.expenses}
        summary={data.expensesSummary}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        onRecordPayment={handleRecordPayment}
      />

      {/* Modals */}
      <MarriageTargetModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTargetBudget={data.targetBudget}
        currentTargetDate={data.targetDate}
      />

      <MarriageExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        expenseToEdit={expenseToEdit}
      />

      <MarriagePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        expense={paymentExpense}
      />
    </div>
  );
}
