"use client";

import { useState, useTransition } from "react";
import { updateMarriageTarget } from "@/lib/actions/marriage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/locale-provider";
import { Heart, X, Sparkles, Calendar, DollarSign } from "lucide-react";

interface MarriageTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTargetBudget: number;
  currentTargetDate: string;
}

export function MarriageTargetModal({
  isOpen,
  onClose,
  currentTargetBudget,
  currentTargetDate,
}: MarriageTargetModalProps) {
  const { isRtl } = useLocale();
  const [targetBudget, setTargetBudget] = useState<number>(currentTargetBudget);
  const [targetDate, setTargetDate] = useState<string>(currentTargetDate);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (targetBudget <= 0) {
      setError(isRtl ? "يرجى إدخال مبلغ مستهدف أكبر من 0." : "Target budget must be greater than 0.");
      return;
    }

    startTransition(async () => {
      const res = await updateMarriageTarget(targetBudget, targetDate);
      if (res.ok) {
        onClose();
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {isRtl ? "تعديل مستهدف وتاريخ الزواج" : "Edit Marriage Target & Timeline"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isRtl ? "تخصيص الميزانية الإجمالية وتاريخ الإنجاز" : "Customize target budget & completion date"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold">
              {error}
            </div>
          )}

          {/* Budget Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isRtl ? "المستهدف المالي الإجمالي (ج.م)" : "Target Budget Amount (EGP)"}</span>
            </Label>
            <Input
              type="number"
              min="1000"
              step="1000"
              value={targetBudget}
              onChange={(e) => setTargetBudget(Number(e.target.value))}
              required
              className="h-11 rounded-xl text-sm font-bold bg-zinc-50 dark:bg-zinc-800"
            />
            <p className="text-[11px] text-zinc-400">
              {isRtl ? "مثال: 250000 أو 300000 ج.م" : "e.g., 250,000 or 300,000 EGP"}
            </p>
          </div>

          {/* Target Date Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>{isRtl ? "تاريخ الإنجاز المستهدف" : "Target Completion Date"}</span>
            </Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              className="h-11 rounded-xl text-sm font-bold bg-zinc-50 dark:bg-zinc-800"
            />
            <p className="text-[11px] text-zinc-400">
              {isRtl ? "يحسب النظام تلقائياً الفائض المطلوب شهرياً وأسبوعياً" : "Auto-calculates monthly & weekly required pace"}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-700 cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isPending ? (isRtl ? "جاري الحفظ..." : "Saving...") : (isRtl ? "حفظ التعديلات" : "Save Target")}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
