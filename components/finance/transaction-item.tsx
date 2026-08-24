"use client";

import { useTransition } from "react";
import { deleteTransaction } from "@/lib/actions/finance";
import { useLocale } from "@/components/providers/locale-provider";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Wallet,
  Edit2,
  Trash2,
  Eye,
  Repeat,
} from "lucide-react";
import type {
  TransactionRow,
  BucketRow,
  ProjectRow,
  LeadRow,
} from "@/lib/supabase/types";

export function TransactionItem({
  transaction,
  buckets = [],
  onEdit,
  onViewDetails,
}: {
  transaction: TransactionRow;
  buckets?: BucketRow[];
  projects?: ProjectRow[];
  leads?: LeadRow[];
  onEdit: (tx: TransactionRow) => void;
  onViewDetails: (tx: TransactionRow) => void;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const isIncome = transaction.kind === "income";
  const linkedBucket = buckets.find((b) => b.id === transaction.bucket_id);
  const amt = Number(transaction.amount) || 0;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      {/* Left items: Icon, Category, Source, Date, Bucket */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            isIncome
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft className="h-4 w-4 stroke-[2.5]" />
          ) : (
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
          )}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">
              {transaction.category.replace(/_/g, " ")}
            </span>

            {linkedBucket && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                <Wallet className="h-2.5 w-2.5" />
                <span>{linkedBucket.name}</span>
              </span>
            )}

            {transaction.is_recurring && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
                <Repeat className="h-2.5 w-2.5" />
                <span>Monthly</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{transaction.occurred_on}</span>
            </span>

            {transaction.source && (
              <span className="font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[180px]">
                • {transaction.source}
              </span>
            )}

            {transaction.note && (
              <span className="text-zinc-400 italic truncate max-w-[200px]">
                ({transaction.note})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right items: Amount and action buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800/80">
        <div
          className={`text-base font-extrabold tracking-tight ${
            isIncome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {amt.toLocaleString()}{" "}
          <span className="text-xs font-semibold text-zinc-400">
            {transaction.currency || "EGP"}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onViewDetails(transaction)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            title={t.common.viewDetails}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={t.common.edit}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            disabled={isPending}
            onClick={() => {
              if (
                confirm(
                  `${t.common.confirmDelete} transaction of ${amt.toLocaleString()} EGP?`,
                )
              ) {
                startTransition(async () => {
                  await deleteTransaction(transaction.id);
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
