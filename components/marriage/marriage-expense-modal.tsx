"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveMarriageExpense } from "@/lib/actions/marriage";
import {
  MARRIAGE_EXPENSE_CATEGORIES,
  type MarriageExpenseCategory,
  type MarriageExpenseStatus,
} from "@/lib/schemas/marriage";
import type { MarriageExpenseRow, TaskPriority } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Heart } from "lucide-react";

interface MarriageExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: MarriageExpenseRow | null;
}

export function MarriageExpenseModal({
  isOpen,
  onClose,
  expenseToEdit,
}: MarriageExpenseModalProps) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600">
              <Heart className="h-4 w-4 fill-rose-500" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {expenseToEdit ? t.marriagePage.editExpense : t.marriagePage.newExpense}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <MarriageExpenseForm
          expenseToEdit={expenseToEdit}
          onClose={onClose}
          isPending={isPending}
          startTransition={startTransition}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      </div>
    </div>
  );
}

function MarriageExpenseForm({
  expenseToEdit,
  onClose,
  isPending,
  startTransition,
  errorMsg,
  setErrorMsg,
}: {
  expenseToEdit?: MarriageExpenseRow | null;
  onClose: () => void;
  isPending: boolean;
  startTransition: (cb: () => Promise<void>) => void;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
}) {
  const { t } = useLocale();

  const [item, setItem] = useState(expenseToEdit?.item || "");
  const [category, setCategory] = useState<MarriageExpenseCategory>(
    (expenseToEdit?.category as MarriageExpenseCategory) || "furniture",
  );
  const [estimatedCost, setEstimatedCost] = useState(
    expenseToEdit?.estimated_cost ? String(expenseToEdit.estimated_cost) : "",
  );
  const [actualCost, setActualCost] = useState(
    expenseToEdit?.actual_cost ? String(expenseToEdit.actual_cost) : "",
  );
  const [paidAmount, setPaidAmount] = useState(
    expenseToEdit?.paid_amount ? String(expenseToEdit.paid_amount) : "0",
  );
  const [deadline, setDeadline] = useState(expenseToEdit?.deadline || "");
  const [priority, setPriority] = useState<TaskPriority>(
    expenseToEdit?.priority || "medium",
  );
  const [status, setStatus] = useState<MarriageExpenseStatus>(
    (expenseToEdit?.status as MarriageExpenseStatus) || "planned",
  );
  const [notes, setNotes] = useState(expenseToEdit?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const res = await saveMarriageExpense({
        id: expenseToEdit?.id,
        item,
        category,
        estimated_cost: Number(estimatedCost) || 0,
        actual_cost: actualCost ? Number(actualCost) : null,
        paid_amount: Number(paidAmount) || 0,
        deadline: deadline || null,
        priority,
        status,
        notes: notes || null,
      });

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء الحفظ");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Item Name */}
      <div className="space-y-1">
        <Label htmlFor="item_name" className="text-xs font-bold">
          {t.marriagePage.expenseItem} *
        </Label>
        <Input
          id="item_name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="مثال: غرفة النوم الرئيسية / الثلاجة 18 قدم / حجز القاعة..."
          className="text-xs rounded-xl"
          required
        />
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.category}</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MarriageExpenseCategory)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            {MARRIAGE_EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.marriagePage.categories[cat as keyof typeof t.marriagePage.categories] || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.priority}</Label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            <option value="critical">{t.tasks.critical}</option>
            <option value="high">{t.tasks.high}</option>
            <option value="medium">{t.tasks.medium}</option>
            <option value="low">{t.tasks.low}</option>
          </select>
        </div>
      </div>

      {/* Estimated, Actual, Paid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.estimated} *</Label>
          <Input
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="35000"
            className="text-xs rounded-xl"
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.actual}</Label>
          <Input
            type="number"
            value={actualCost}
            onChange={(e) => setActualCost(e.target.value)}
            placeholder="32000"
            className="text-xs rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.paid}</Label>
          <Input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder="10000"
            className="text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Deadline & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.deadline}</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="text-xs rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.marriagePage.status}</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MarriageExpenseStatus)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            <option value="planned">{t.marriagePage.statuses.planned}</option>
            <option value="in_progress">{t.marriagePage.statuses.inProgress}</option>
            <option value="paid">{t.marriagePage.statuses.paid}</option>
            <option value="dropped">{t.marriagePage.statuses.dropped}</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <Label className="text-xs font-bold">{t.tasks.notes}</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ملاحظات حول المعرض، الموديل، أو تفاصيل الاتفاق مع التاجر..."
          rows={2}
          className="text-xs rounded-xl"
        />
      </div>

      {/* Buttons */}
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
          className="text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
        >
          {isPending ? t.common.saving : t.common.save}
        </Button>
      </div>
    </form>
  );
}
