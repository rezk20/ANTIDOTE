"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { recordExpensePayment } from "@/lib/actions/marriage";
import type { MarriageExpenseRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, DollarSign, CheckCircle2 } from "lucide-react";

interface MarriagePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: MarriageExpenseRow | null;
}

export function MarriagePaymentModal({
  isOpen,
  onClose,
  expense,
}: MarriagePaymentModalProps) {
  const { t } = useLocale();
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !expense) return null;

  const targetCost = Number(expense.actual_cost || expense.estimated_cost || 0);
  const paid = Number(expense.paid_amount || 0);
  const remaining = Math.max(0, targetCost - paid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payAmt = Number(amount);
    if (!payAmt || payAmt <= 0) {
      setErrorMsg("يرجى إدخال مبلغ سداد صحيح أكبر من 0.");
      return;
    }

    startTransition(async () => {
      const res = await recordExpensePayment(expense.id, payAmt);
      if (res.ok) {
        setAmount("");
        onClose();
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء تسجيل الدفعة.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {t.marriagePage.recordPayment}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1">
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 truncate">
              {expense.item}
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>المسدد: {paid.toLocaleString()} ج.م</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                المتبقي: {remaining.toLocaleString()} ج.م
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pay_amount" className="text-xs font-bold">
              {t.marriagePage.paymentAmount} *
            </Label>
            <Input
              id="pay_amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`مثال: ${remaining > 0 ? remaining : 5000}`}
              className="text-xs rounded-xl"
              required
              autoFocus
            />

            {remaining > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(remaining))}
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                سداد كامل المتبقي ({remaining.toLocaleString()} ج.م)
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="text-xs font-bold rounded-xl cursor-pointer"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isPending ? t.common.saving : "تسجيل الدفعة"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
