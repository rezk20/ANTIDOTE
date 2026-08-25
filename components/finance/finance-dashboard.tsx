"use client";

import { useState } from "react";
import { MonthlySummaryCards } from "./monthly-summary-cards";
import { MarriageGoalWidget } from "./marriage-goal-widget";
import { IncomeTargetsWidget } from "./income-targets-widget";
import { BucketList } from "./bucket-list";
import { TransactionList } from "./transaction-list";
import { MarriageExpensesList } from "./marriage-expenses-list";
import { BucketCard } from "./bucket-card";
import { BucketModal } from "./bucket-modal";
import { BucketDetailModal } from "./bucket-detail-modal";
import { FinanceAlertsBanner } from "./finance-alerts-banner";
import { evaluateFinanceAlerts } from "@/lib/logic/alerts";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Wallet,
  Receipt,
  Heart,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import type { FinanceSummaryData } from "@/lib/dal/finance";
import type { ComputedBucket } from "@/lib/logic/finance";

export function FinanceDashboard({ data }: { data: FinanceSummaryData }) {
  const { t, isRtl } = useLocale();
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "wallets" | "marriage"
  >("overview");

  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);
  const [bucketToEdit, setBucketToEdit] = useState<ComputedBucket | null>(null);
  const [isBucketDetailOpen, setIsBucketDetailOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<ComputedBucket | null>(
    null,
  );

  const tabs = [
    {
      id: "overview" as const,
      label: t.finances.overviewTab,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "transactions" as const,
      label: t.finances.transactionsTab,
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      id: "wallets" as const,
      label: t.finances.walletsTab,
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      id: "marriage" as const,
      label: t.finances.marriageTab,
      icon: <Heart className="h-4 w-4" />,
    },
  ];

  const alerts = evaluateFinanceAlerts({
    transactions: data.allTransactions,
    marriageExpenses: data.marriageExpenses,
    profile: data.profile,
    currentMonth: data.selectedMonth,
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            {t.finances.title}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            {t.finances.subtitle}
          </p>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-zinc-100 p-1.5 dark:bg-zinc-900">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          {/* Proactive Finance Suggestion Alerts (§49) */}
          <FinanceAlertsBanner alerts={alerts} />

          {/* Monthly KPI Summary Cards */}
          <MonthlySummaryCards
            totals={data.monthlyTotals}
            incomeCount={
              data.monthTransactions.filter((t) => t.kind === "income").length
            }
            expenseCount={
              data.monthTransactions.filter((t) => t.kind === "expense").length
            }
          />

          {/* Goal & Milestone Widgets */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <MarriageGoalWidget metrics={data.marriageGoal} />
            <IncomeTargetsWidget targets={data.incomeTargets} />
          </div>

          {/* Wallets Quick Strip */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                {t.finances.wallets} ({data.buckets.length})
              </h2>
              <button
                onClick={() => setActiveTab("wallets")}
                className="flex cursor-pointer items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>{isRtl ? "عرض كافة المحافظ" : "View All Buckets"}</span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.buckets.slice(0, 4).map((bucket) => (
                <BucketCard
                  key={bucket.id}
                  bucket={bucket}
                  onEdit={(b) => {
                    setBucketToEdit(b);
                    setIsBucketModalOpen(true);
                  }}
                  onViewDetails={(b) => {
                    setSelectedBucket(b);
                    setIsBucketDetailOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Transactions Ledger */}
      {activeTab === "transactions" && (
        <div className="animate-in fade-in duration-150">
          <TransactionList
            transactions={data.monthTransactions}
            buckets={data.buckets}
            projects={data.projects}
            leads={data.leads}
            selectedMonth={data.selectedMonth}
          />
        </div>
      )}

      {/* Tab 3: Wallets & Savings Buckets */}
      {activeTab === "wallets" && (
        <div className="animate-in fade-in duration-150">
          <BucketList
            buckets={data.buckets}
            transactions={data.allTransactions}
          />
        </div>
      )}

      {/* Tab 4: Marriage Mission Fund & Planner */}
      {activeTab === "marriage" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          <MarriageGoalWidget metrics={data.marriageGoal} />

          <MarriageExpensesList
            expenses={data.marriageExpenses}
            summary={data.marriageExpensesSummary}
            buckets={data.buckets}
          />
        </div>
      )}

      {/* Overview Bucket Modals */}
      <BucketModal
        isOpen={isBucketModalOpen}
        onClose={() => setIsBucketModalOpen(false)}
        bucketToEdit={bucketToEdit}
      />

      <BucketDetailModal
        isOpen={isBucketDetailOpen}
        onClose={() => setIsBucketDetailOpen(false)}
        bucket={selectedBucket}
        transactions={data.allTransactions}
        onEdit={() => {
          if (selectedBucket) {
            setBucketToEdit(selectedBucket);
            setIsBucketModalOpen(true);
          }
        }}
      />
    </div>
  );
}
