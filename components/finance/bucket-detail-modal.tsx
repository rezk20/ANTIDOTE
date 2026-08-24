"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Target,
  ListOrdered,
} from "lucide-react";
import type { ComputedBucket } from "@/lib/logic/finance";
import type { TransactionRow } from "@/lib/supabase/types";

export function BucketDetailModal({
  isOpen,
  onClose,
  bucket,
  transactions = [],
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  bucket: ComputedBucket | null;
  transactions?: TransactionRow[];
  onEdit?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !bucket) return null;

  const bucketTransactions = transactions
    .filter((tx) => tx.bucket_id === bucket.id)
    .slice(0, 8);

  const chips: DetailChip[] = [
    {
      label: t.common.status,
      value: bucket.is_active
        ? isRtl
          ? "نشطة (Active)"
          : "Active"
        : isRtl
          ? "مؤرشفة (Archived)"
          : "Archived",
      variant: bucket.is_active ? "emerald" : "default",
    },
    {
      label: t.finances.currentBalance,
      value: `${bucket.currentBalance.toLocaleString()} EGP`,
      variant: bucket.currentBalance >= 0 ? "emerald" : "rose",
      icon: <DollarSign className="h-3 w-3" />,
    },
    {
      label: t.finances.startingBalance,
      value: `${Number(bucket.starting_balance).toLocaleString()} EGP`,
      variant: "default",
    },
    {
      label: t.finances.netChange,
      value: `${bucket.netChange >= 0 ? "+" : ""}${bucket.netChange.toLocaleString()} EGP`,
      variant: bucket.netChange >= 0 ? "emerald" : "rose",
    },
    {
      label: t.finances.targetAmount,
      value:
        bucket.target_amount != null
          ? `${bucket.target_amount.toLocaleString()} EGP`
          : isRtl
            ? "غير محدد"
            : "None",
      variant: "purple",
      icon: <Target className="h-3 w-3" />,
    },
    {
      label: isRtl ? "نسبة الإنجاز" : "Progress",
      value:
        bucket.progressPercent != null
          ? `${bucket.progressPercent}%`
          : isRtl
            ? "غير مقيد بمستهدف"
            : "No target",
      variant: bucket.progressPercent != null ? "emerald" : "default",
      icon: <TrendingUp className="h-3 w-3" />,
    },
  ];

  const sections: DetailSection[] = [
    {
      title: isRtl ? "التدفق المالي للمحفظة" : "Wallet Cashflow Breakdown",
      icon: <DollarSign className="h-3.5 w-3.5 text-emerald-500" />,
      content: (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block flex items-center gap-1">
              <ArrowDownLeft className="h-3 w-3" />
              <span>{t.finances.totalIncome}</span>
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              +{bucket.totalIncome.toLocaleString()} EGP
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1">
            <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold block flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>{t.finances.totalExpenses}</span>
            </span>
            <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
              -{bucket.totalExpenses.toLocaleString()} EGP
            </span>
          </div>
        </div>
      ),
    },
  ];

  if (bucketTransactions.length > 0) {
    sections.push({
      title: isRtl ? "آخر المعاملات المرتبطة" : "Recent Associated Transactions",
      icon: <ListOrdered className="h-3.5 w-3.5 text-purple-500" />,
      content: (
        <div className="space-y-2">
          {bucketTransactions.map((tx) => {
            const isInc = tx.kind === "income";
            return (
              <div
                key={tx.id}
                className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block truncate capitalize">
                    {tx.category.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {tx.occurred_on} {tx.source ? `• ${tx.source}` : ""}
                  </span>
                </div>
                <span
                  className={`font-extrabold shrink-0 ${
                    isInc
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isInc ? "+" : "-"}
                  {Number(tx.amount).toLocaleString()} EGP
                </span>
              </div>
            );
          })}
        </div>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={bucket.name}
      subtitle={t.finances.walletDetails}
      icon={<Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      badge={
        <Badge variant="default" className="text-xs font-bold uppercase">
          {bucket.kind}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.finances.editWallet}
    />
  );
}
