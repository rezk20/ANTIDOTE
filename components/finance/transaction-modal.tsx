"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, DollarSign } from "lucide-react";
import type {
  TransactionRow,
  BucketRow,
  ProjectRow,
  LeadRow,
} from "@/lib/supabase/types";
import type { TransactionState } from "@/lib/schemas/finance";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      isLoading={pending}
      className="min-w-[130px] rounded-xl"
    >
      {text}
    </Button>
  );
}

const DEFAULT_CATEGORIES = [
  { value: "freelance", label: "Freelance / Projects" },
  { value: "discord_bots", label: "Discord Bot Services" },
  { value: "upwork", label: "Upwork Earnings" },
  { value: "consulting", label: "Consulting / Mentorship" },
  { value: "salary", label: "Salary / Full-Time" },
  { value: "marriage", label: "💍 Marriage & Wedding" },
  { value: "housing", label: "🏠 Rent & Housing" },
  { value: "food", label: "🍔 Food & Groceries" },
  { value: "transport", label: "🚗 Transportation" },
  { value: "utilities", label: "💡 Bills & Utilities" },
  { value: "hardware", label: "💻 Tech & Hardware" },
  { value: "learning", label: "📚 Education & Courses" },
  { value: "health", label: "🩺 Health & Fitness" },
  { value: "personal", label: "👤 Personal & Outings" },
  { value: "business", label: "💼 Business Operations" },
  { value: "other", label: "⚙️ Other" },
];

function TransactionModalInnerForm({
  transactionToEdit,
  buckets = [],
  projects = [],
  leads = [],
  defaultKind = "income",
  defaultBucketId,
  onClose,
}: {
  transactionToEdit?: TransactionRow | null;
  buckets?: BucketRow[];
  projects?: ProjectRow[];
  leads?: LeadRow[];
  defaultKind?: "income" | "expense";
  defaultBucketId?: string;
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(transactionToEdit);

  const actionWithId = isEditing
    ? updateTransaction.bind(null, transactionToEdit!.id)
    : createTransaction;

  const [state, formAction] = useActionState<TransactionState, FormData>(
    actionWithId,
    { ok: false },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const kindOptions = [
    { value: "income", label: isRtl ? "دخل وارد (+)" : "Income (+)" },
    { value: "expense", label: isRtl ? "مصروف خارج (-)" : "Expense (-)" },
  ];

  const bucketOptions = [
    { value: "", label: isRtl ? "سيولة عامة (بدون محفظة)" : "General Cash (No Bucket)" },
    ...buckets.map((b) => ({
      value: b.id,
      label: `${b.name} (${b.kind})`,
    })),
  ];

  const projectOptions = [
    { value: "", label: isRtl ? "بدون مشروع مرتبط" : "None" },
    ...projects.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ];

  const leadOptions = [
    { value: "", label: isRtl ? "بدون صفقة مرتبطة" : "None" },
    ...leads.map((l) => ({
      value: l.id,
      label: l.title,
    })),
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={formAction} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
      {state?.message && !state.ok && (
        <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {state.message}
        </div>
      )}

      {/* Kind & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kind" required>
            {t.finances.transactionKind}
          </Label>
          <CustomSelect
            id="kind"
            name="kind"
            defaultValue={transactionToEdit?.kind ?? defaultKind}
            options={kindOptions}
          />
        </div>

        <div>
          <Label htmlFor="amount" required>
            {t.finances.amount} (EGP)
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="any"
            min="0.01"
            defaultValue={transactionToEdit?.amount ?? ""}
            placeholder="e.g. 5000"
            error={state?.errors?.amount?.[0]}
            autoFocus
            required
          />
        </div>
      </div>

      {/* Category & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" required>
            {t.finances.category}
          </Label>
          <CustomSelect
            id="category"
            name="category"
            defaultValue={transactionToEdit?.category ?? "freelance"}
            options={DEFAULT_CATEGORIES}
            error={state?.errors?.category?.[0]}
          />
        </div>

        <div>
          <Label htmlFor="occurred_on" required>
            {t.finances.date}
          </Label>
          <Input
            id="occurred_on"
            name="occurred_on"
            type="date"
            defaultValue={transactionToEdit?.occurred_on ?? todayStr}
            error={state?.errors?.occurred_on?.[0]}
            required
          />
        </div>
      </div>

      {/* Bucket (Wallet) */}
      <div>
        <Label htmlFor="bucket_id">
          {t.finances.wallet}
        </Label>
        <CustomSelect
          id="bucket_id"
          name="bucket_id"
          defaultValue={transactionToEdit?.bucket_id ?? defaultBucketId ?? ""}
          options={bucketOptions}
          error={state?.errors?.bucket_id?.[0]}
        />
      </div>

      {/* Source (Payer/Method) */}
      <div>
        <Label htmlFor="source">
          {t.finances.source}
        </Label>
        <Input
          id="source"
          name="source"
          defaultValue={transactionToEdit?.source ?? ""}
          placeholder="e.g. Upwork Escrow / Vodafone Cash / Bank Transfer"
          error={state?.errors?.source?.[0]}
        />
      </div>

      {/* Operational Links (Project & Lead) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="project_id">
            {t.finances.linkedProject}
          </Label>
          <CustomSelect
            id="project_id"
            name="project_id"
            defaultValue={transactionToEdit?.project_id ?? ""}
            options={projectOptions}
            error={state?.errors?.project_id?.[0]}
          />
        </div>

        <div>
          <Label htmlFor="lead_id">
            {t.finances.linkedLead}
          </Label>
          <CustomSelect
            id="lead_id"
            name="lead_id"
            defaultValue={transactionToEdit?.lead_id ?? ""}
            options={leadOptions}
            error={state?.errors?.lead_id?.[0]}
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <Label htmlFor="note">
          {t.finances.note}
        </Label>
        <Textarea
          id="note"
          name="note"
          defaultValue={transactionToEdit?.note ?? ""}
          placeholder="Milestone release details, invoice number, items purchased..."
          rows={2}
          error={state?.errors?.note?.[0]}
        />
      </div>

      {/* Recurring Checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="is_recurring"
          name="is_recurring"
          defaultChecked={transactionToEdit?.is_recurring ?? false}
          className="h-4 w-4 rounded-sm border-zinc-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
        />
        <label
          htmlFor="is_recurring"
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
        >
          {t.finances.isRecurring}
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="outline" size="md" onClick={onClose} className="rounded-xl">
          {t.common.cancel}
        </Button>
        <SubmitButton text={isEditing ? t.common.save : t.common.create} />
      </div>
    </form>
  );
}

export function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
  buckets = [],
  projects = [],
  leads = [],
  defaultKind = "income",
  defaultBucketId,
}: {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: TransactionRow | null;
  buckets?: BucketRow[];
  projects?: ProjectRow[];
  leads?: LeadRow[];
  defaultKind?: "income" | "expense";
  defaultBucketId?: string;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(transactionToEdit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing
                  ? t.finances.editTransaction
                  : t.finances.newTransaction}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <TransactionModalInnerForm
          key={transactionToEdit?.id ?? "new"}
          transactionToEdit={transactionToEdit}
          buckets={buckets}
          projects={projects}
          leads={leads}
          defaultKind={defaultKind}
          defaultBucketId={defaultBucketId}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
