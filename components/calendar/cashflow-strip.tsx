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
    <div className="p-4 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-white border border-zinc-800 shadow-md space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-3xl">
          {/* 1. Current Cash */}
          <div className="p-2.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/50">
            <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Wallet className="h-3 w-3 text-blue-400" />
              {t.calendarPage.currentCash}
            </div>
            <div className="text-xs font-black text-white mt-0.5 font-mono">
              {projection.currentCashBalance.toLocaleString()} ج.م
            </div>
          </div>

          {/* 2. Expected Income */}
          <div className="p-2.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/50">
            <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {t.calendarPage.expectedIncome}
            </div>
            <div className="text-xs font-black text-emerald-400 mt-0.5 font-mono">
              +{projection.expectedIncome.toLocaleString()} ج.م
            </div>
          </div>

          {/* 3. Recurring & Marriage Expenses */}
          <div className="p-2.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/50">
            <div className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3" />
              مصروفات وأقساط
            </div>
            <div className="text-xs font-black text-rose-400 mt-0.5 font-mono">
              -{(projection.expectedExpenses + projection.upcomingMarriagePayments).toLocaleString()} ج.م
            </div>
          </div>

          {/* 4. Projected End Month Cash */}
          <div
            className={`p-2.5 rounded-2xl border ${
              isHealthy
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            <div className="text-[10px] font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              السيولة المتوقعة
            </div>
            <div className="text-xs font-black mt-0.5 font-mono">
              {projection.projectedEndMonthCash.toLocaleString()} ج.م
            </div>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        {projection.events.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white cursor-pointer px-2 py-1 rounded-lg hover:bg-zinc-800 self-end lg:self-center"
          >
            <span>{projection.events.length} حركات مالية</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Expanded Events Timeline */}
      {isExpanded && projection.events.length > 0 && (
        <div className="pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {projection.events.map((evt) => (
            <div
              key={evt.id}
              className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-zinc-200 line-clamp-1">{evt.title}</div>
                <div className="text-[10px] text-zinc-400 font-mono">{evt.date}</div>
              </div>
              <div
                className={`font-black font-mono ${
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
