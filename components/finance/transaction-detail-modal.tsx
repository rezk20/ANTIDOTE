"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Wallet,
  FolderKanban,
  Briefcase,
  Repeat,
  FileText,
} from "lucide-react";
import type {
  TransactionRow,
  BucketRow,
  ProjectRow,
  LeadRow,
} from "@/lib/supabase/types";

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  buckets = [],
  projects = [],
  leads = [],
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRow | null;
  buckets?: BucketRow[];
  projects?: ProjectRow[];
  leads?: LeadRow[];
  onEdit?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.kind === "income";
  const linkedBucket = buckets.find((b) => b.id === transaction.bucket_id);
  const linkedProject = projects.find((p) => p.id === transaction.project_id);
  const linkedLead = leads.find((l) => l.id === transaction.lead_id);
  const amt = Number(transaction.amount) || 0;

  const chips: DetailChip[] = [
    {
      label: t.finances.transactionKind,
      value: isIncome ? t.finances.income : t.finances.expense,
      variant: isIncome ? "emerald" : "rose",
      icon: isIncome ? (
        <ArrowDownLeft className="h-3 w-3" />
      ) : (
        <ArrowUpRight className="h-3 w-3" />
      ),
    },
    {
      label: t.finances.amount,
      value: `${amt.toLocaleString()} ${transaction.currency || "EGP"}`,
      variant: isIncome ? "emerald" : "rose",
      icon: <DollarSign className="h-3 w-3" />,
    },
    {
      label: t.finances.category,
      value: transaction.category.toUpperCase(),
      variant: "purple",
    },
    {
      label: t.finances.date,
      value: transaction.occurred_on,
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      label: t.finances.wallet,
      value: linkedBucket?.name || (isRtl ? "سيولة عامة" : "General Cash"),
      variant: linkedBucket ? "blue" : "default",
      icon: <Wallet className="h-3 w-3" />,
    },
    {
      label: t.finances.isRecurring,
      value: transaction.is_recurring
        ? isRtl
          ? "نعم (شهري)"
          : "Yes (Monthly)"
        : isRtl
          ? "لا"
          : "No",
      variant: transaction.is_recurring ? "amber" : "default",
      icon: transaction.is_recurring ? (
        <Repeat className="h-3 w-3" />
      ) : undefined,
    },
  ];

  const sections: DetailSection[] = [];

  if (transaction.source) {
    sections.push({
      title: t.finances.source,
      icon: <DollarSign className="h-3.5 w-3.5 text-emerald-500" />,
      content: (
        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
          {transaction.source}
        </p>
      ),
    });
  }

  if (transaction.note) {
    sections.push({
      title: t.finances.note,
      icon: <FileText className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <p className="whitespace-pre-wrap leading-relaxed">
          {transaction.note}
        </p>
      ),
    });
  }

  if (linkedProject || linkedLead) {
    sections.push({
      title: isRtl ? "الارتباطات التشغيلية" : "Linked Engagements",
      icon: <FolderKanban className="h-3.5 w-3.5 text-purple-500" />,
      content: (
        <div className="space-y-2 text-xs">
          {linkedProject && (
            <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
              <FolderKanban className="h-3.5 w-3.5" />
              <span>
                {t.finances.linkedProject}: {linkedProject.name}
              </span>
            </div>
          )}
          {linkedLead && (
            <div className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400">
              <Briefcase className="h-3.5 w-3.5" />
              <span>
                {t.finances.linkedLead}: {linkedLead.title}
              </span>
            </div>
          )}
        </div>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isIncome ? "+" : "-"}${amt.toLocaleString()} ${transaction.currency || "EGP"} (${transaction.category})`}
      subtitle={t.finances.transactionDetails}
      icon={
        isIncome ? (
          <ArrowDownLeft className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        )
      }
      badge={
        <Badge
          variant={isIncome ? "success" : "danger"}
          className="text-xs font-bold uppercase"
        >
          {transaction.kind}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.finances.editTransaction}
    />
  );
}
