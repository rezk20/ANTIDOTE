"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import type { CashFlowProjection } from "@/lib/logic/cashflow-calendar";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Coins,
} from "lucide-react";

interface CashFlowStripProps {
  projection: CashFlowProjection;
}

export function CashFlowStrip({ projection }: CashFlowStripProps) {
  const { t } = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);

  const isHealthy = projection.projectedEndMonthCash >= 0;

  return (
    <div className="space-y-3 rounded-3xl border border-zinc-200 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 p-4 text-white shadow-md dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-2 text-emerald-400">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-tight text-zinc-100">
              {t.calendarPage.cashflowTitle}
            </h3>
            <div className="text-[10px] text-zinc-400">
              توقعات السيولة والأقساط المستحقة خلال الشهر الجاري
            </div>
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid max-w-3xl flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          {/* 1. Current Cash */}
          <div className="rounded-2xl border border-zinc-700/50 p-2.5 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100">
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
              <Wallet className="h-3 w-3 text-blue-400" />
              {t.calendarPage.currentCash}
            </div>
            <div className="mt-0.5 font-mono text-xs font-black dark:text-white">
              {projection.currentCashBalance.toLocaleString()} ج.م
            </div>
          </div>

          {/* 2. Expected Income */}
          <div className="rounded-2xl border border-emerald-500/30 p-2.5 dark:border-zinc-700/50 dark:bg-zinc-800/80">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              {t.calendarPage.expectedIncome}
            </div>
            <div className="mt-0.5 font-mono text-xs font-black text-emerald-400">
              +{projection.expectedIncome.toLocaleString()} ج.م
            </div>
          </div>

          {/* 3. Recurring & Marriage Expenses */}
          <div className="rounded-2xl border border-rose-500/30 p-2.5 dark:border-zinc-700/50 dark:bg-zinc-800/80">
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
              <ArrowDownRight className="h-3 w-3" />
              مصروفات وأقساط
            </div>
            <div className="mt-0.5 font-mono text-xs font-black text-rose-400">
              -
              {(
                projection.expectedExpenses +
                projection.upcomingMarriagePayments
              ).toLocaleString()}{" "}
              ج.م
            </div>
          </div>

          {/* 4. Projected End Month Cash */}
          <div
            className={`rounded-2xl border p-2.5 ${
              isHealthy
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <TrendingUp className="h-3 w-3" />
              السيولة المتوقعة
            </div>
            <div className="mt-0.5 font-mono text-xs font-black">
              {projection.projectedEndMonthCash.toLocaleString()} ج.م
            </div>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        {projection.events.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex cursor-pointer items-center gap-1 self-end rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white lg:self-center"
          >
            <span>{projection.events.length} حركات مالية</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Events Timeline */}
      {isExpanded && projection.events.length > 0 && (
        <div className="grid grid-cols-1 gap-2 border-t border-zinc-800 pt-3 sm:grid-cols-2 md:grid-cols-3">
          {projection.events.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between rounded-xl border border-zinc-700/40 bg-zinc-800/60 p-2.5 text-xs"
            >
              <div>
                <div className="line-clamp-1 font-bold text-zinc-200">
                  {evt.title}
                </div>
                <div className="font-mono text-[10px] text-zinc-400">
                  {evt.date}
                </div>
              </div>
              <div
                className={`font-mono font-black ${
                  evt.type === "income"
                    ? "text-emerald-400"
                    : evt.type === "marriage"
                      ? "text-pink-400"
                      : "text-rose-400"
                }`}
              >
                {evt.type === "income" ? "+" : "-"}
                {evt.amount.toLocaleString()} ج.م
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
