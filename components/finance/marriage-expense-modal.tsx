"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createMarriageExpense,
  updateMarriageExpense,
} from "@/lib/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, Heart } from "lucide-react";
import type { MarriageExpenseRow } from "@/lib/supabase/types";
import type { MarriageExpenseState } from "@/lib/schemas/finance";

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

const MARRIAGE_CATEGORIES = [
  { value: "furniture", label: "🛏️ أثاث ومفروشات (Furniture)" },
  { value: "finishing", label: "🎨 تشطيب وديكور (Finishing)" },
  { value: "appliances", label: "🔌 أجهزة كهربائية (Appliances)" },
  { value: "jewelry", label: "💍 شبكة ومجوهرات (Jewelry)" },
  { value: "rent_deposit", label: "🏠 تأمين وإيجار الشقة (Rent/Deposit)" },
  { value: "hall", label: "🎉 حجز القاعة والفرح (Wedding Hall)" },
  { value: "clothing", label: "👔 ملابس وبدلة وفستان (Clothing)" },
  { value: "photography", label: "📸 تصوير وسيشن (Photography)" },
  { value: "transport", label: "🚗 سيارات ونقل (Transport)" },
  { value: "misc", label: "📦 متفرقات وطوارئ (Misc)" },
];

function MarriageExpenseModalInnerForm({
  expenseToEdit,
  onClose,
}: {
  expenseToEdit?: MarriageExpenseRow | null;
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(expenseToEdit);

  const actionWithId = isEditing
    ? updateMarriageExpense.bind(null, expenseToEdit!.id)
    : createMarriageExpense;

  const [state, formAction] = useActionState<MarriageExpenseState, FormData>(
    actionWithId,
    { ok: false },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const priorityOptions = [
    { value: "critical", label: isRtl ? "🔴 حرجة (Critical)" : "Critical" },
    { value: "high", label: isRtl ? "🟠 عالية (High)" : "High" },
    { value: "medium", label: isRtl ? "🟡 متوسطة (Medium)" : "Medium" },
    { value: "low", label: isRtl ? "⚪ منخفضة (Low)" : "Low" },
  ];

  const statusOptions = [
    { value: "planned", label: isRtl ? "مخطط لها (Planned)" : "Planned" },
    { value: "in_progress", label: isRtl ? "قيد الدفع / التنفيذ (In Progress)" : "In Progress" },
    { value: "paid", label: isRtl ? "مدفوعة بالكامل (Paid)" : "Paid" },
    { value: "dropped", label: isRtl ? "ملغاة (Dropped)" : "Dropped" },
  ];

  return (
    <form ref={formRef} action={formAction} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
      {state?.message && !state.ok && (
        <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {state.message}
        </div>
      )}

      {/* Item Name */}
      <div>
        <Label htmlFor="item" required>
          {t.marriageExpenses.item}
        </Label>
        <Input
          id="item"
          name="item"
          defaultValue={expenseToEdit?.item ?? ""}
          placeholder="e.g. Master Bedroom / Refrigerator & Washing Machine"
          error={state?.errors?.item?.[0]}
          autoFocus
          required
        />
      </div>

      {/* Category & Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" required>
            {t.marriageExpenses.category}
          </Label>
          <CustomSelect
            id="category"
            name="category"
            defaultValue={expenseToEdit?.category ?? "furniture"}
            options={MARRIAGE_CATEGORIES}
          />
        </div>

        <div>
          <Label htmlFor="deadline">
            {t.marriageExpenses.deadline}
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={expenseToEdit?.deadline ?? ""}
          />
        </div>
      </div>

      {/* Financials: Estimated, Actual, Paid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="estimated_cost" required>
            {t.marriageExpenses.estimatedCost} (EGP)
          </Label>
          <Input
            id="estimated_cost"
            name="estimated_cost"
            type="number"
            step="any"
            min="0"
            defaultValue={expenseToEdit?.estimated_cost ?? ""}
            placeholder="0"
            error={state?.errors?.estimated_cost?.[0]}
            required
          />
        </div>

        <div>
          <Label htmlFor="actual_cost">
            {t.marriageExpenses.actualCost} (EGP)
          </Label>
          <Input
            id="actual_cost"
            name="actual_cost"
            type="number"
            step="any"
            min="0"
            defaultValue={expenseToEdit?.actual_cost ?? ""}
            placeholder="Optional"
          />
        </div>

        <div>
          <Label htmlFor="paid_amount">
            {t.marriageExpenses.paidAmount} (EGP)
          </Label>
          <Input
            id="paid_amount"
            name="paid_amount"
            type="number"
            step="any"
            min="0"
            defaultValue={expenseToEdit?.paid_amount ?? 0}
            placeholder="0"
          />
        </div>
      </div>

      {/* Priority & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">
            {t.marriageExpenses.priority}
          </Label>
          <CustomSelect
            id="priority"
            name="priority"
            defaultValue={expenseToEdit?.priority ?? "medium"}
            options={priorityOptions}
          />
        </div>

        <div>
          <Label htmlFor="status">
            {t.marriageExpenses.status}
          </Label>
          <CustomSelect
            id="status"
            name="status"
            defaultValue={expenseToEdit?.status ?? "planned"}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">
          {t.marriageExpenses.notes}
        </Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={expenseToEdit?.notes ?? ""}
          placeholder="Model numbers, store location, vendor contact, dimensions..."
          rows={2}
        />
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

export function MarriageExpenseModal({
  isOpen,
  onClose,
  expenseToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: MarriageExpenseRow | null;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(expenseToEdit);

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
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing
                  ? t.marriageExpenses.editExpense
                  : t.marriageExpenses.newExpense}
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

        <MarriageExpenseModalInnerForm
          key={expenseToEdit?.id ?? "new"}
          expenseToEdit={expenseToEdit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
