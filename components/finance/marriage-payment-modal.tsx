"use client";

import { useState, useTransition } from "react";
import { recordMarriageExpensePayment } from "@/lib/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, CreditCard } from "lucide-react";
import type { MarriageExpenseRow, BucketRow } from "@/lib/supabase/types";

export function MarriagePaymentModal({
  isOpen,
  onClose,
  expense,
  buckets = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  expense: MarriageExpenseRow | null;
  buckets?: BucketRow[];
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const est = Number(expense?.estimated_cost) || 0;
  const act = expense?.actual_cost != null ? Number(expense.actual_cost) : est;
  const paid = Number(expense?.paid_amount) || 0;
  const remaining = Math.max(0, act - paid);

  const [paymentAmount, setPaymentAmount] = useState<string>(() =>
    remaining > 0 ? String(remaining) : "",
  );
  const [selectedBucketId, setSelectedBucketId] = useState<string>(() => {
    const marriageB = buckets.find((b) => b.kind === "marriage");
    return marriageB?.id ?? "";
  });
  const [occurredOn, setOccurredOn] = useState<string>(() =>
    new Date().toISOString().split("T")[0],
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !expense) return null;

  const bucketOptions = [
    { value: "", label: isRtl ? "بدون محفظة (سيولة عامة)" : "General Cash" },
    ...buckets.map((b) => ({
      value: b.id,
      label: `${b.name} (${b.kind})`,
    })),
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg(isRtl ? "يرجى إدخال مبلغ صحيح أكبر من صفر." : "Please enter a valid positive amount.");
      return;
    }

    startTransition(async () => {
      const res = await recordMarriageExpensePayment(
        expense!.id,
        amt,
        selectedBucketId || null,
        occurredOn,
      );

      if (!res.ok) {
        setErrorMsg(res.message || "Failed to record payment.");
      } else {
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.marriageExpenses.recordPayment}
              </h2>
              <p className="text-xs text-zinc-500 truncate max-w-[240px]">
                {expense.item}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Payment amount */}
          <div>
            <Label htmlFor="payment_amount" required>
              {t.marriageExpenses.paymentAmount}
            </Label>
            <Input
              id="payment_amount"
              type="number"
              step="any"
              min="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g. 5000"
              autoFocus
              required
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              {isRtl ? "المتبقي لإكمال البند:" : "Remaining balance on item:"}{" "}
              <strong className="text-rose-600 dark:text-rose-400">
                {remaining.toLocaleString()} EGP
              </strong>
            </p>
          </div>

          {/* Deduct from bucket */}
          <div>
            <Label htmlFor="bucket_id">
              {isRtl ? "خصم من محفظة (Bucket)" : "Deduct from Savings Bucket"}
            </Label>
            <CustomSelect
              id="bucket_id"
              value={selectedBucketId}
              onChange={setSelectedBucketId}
              options={bucketOptions}
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="occurred_on" required>
              {t.finances.date}
            </Label>
            <Input
              id="occurred_on"
              type="date"
              value={occurredOn}
              onChange={(e) => setOccurredOn(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="rounded-xl"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              {t.marriageExpenses.recordPayment}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
