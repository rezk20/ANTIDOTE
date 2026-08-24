"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createGoal, updateGoal } from "@/lib/actions/goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, Target } from "lucide-react";
import type { GoalRow } from "@/lib/supabase/types";
import type { GoalState } from "@/lib/schemas/goals";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      isLoading={pending}
      className="min-w-[130px]"
    >
      {text}
    </Button>
  );
}

export function GoalModal({
  isOpen,
  onClose,
  goalToEdit,
  availableParents = [],
  defaultParentId,
  defaultLevel = "year",
}: {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: GoalRow | null;
  availableParents?: GoalRow[];
  defaultParentId?: string;
  defaultLevel?: string;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(goalToEdit);

  const actionWithId = isEditing
    ? updateGoal.bind(null, goalToEdit!.id)
    : createGoal;

  const [state, formAction] = useActionState<GoalState, FormData>(
    actionWithId,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  if (!isOpen) return null;

  const levelOptions = [
    { value: "vision", label: isRtl ? "رؤية كبرى (Vision - 10Y)" : "Vision (10-Year Target)", badge: "10-Year" },
    { value: "year", label: isRtl ? "هدف سنوي (Yearly - 1Y)" : "Annual Goal (1-Year)", badge: "Annual" },
    { value: "quarter", label: isRtl ? "هدف ربع سنوي (Quarterly - 90D)" : "Quarterly Milestone (90-Day)", badge: "Q1-Q4" },
    { value: "month", label: isRtl ? "هدف شهري (Monthly)" : "Monthly Focus", badge: "30-Day" },
    { value: "week", label: isRtl ? "هدف أسبوعي (Weekly)" : "Weekly Sprint", badge: "Sprint" },
  ];

  const statusOptions = [
    { value: "active", label: isRtl ? "نشط (Active)" : "Active" },
    { value: "achieved", label: isRtl ? "تم تحقيقه (Achieved)" : "Achieved" },
    { value: "paused", label: isRtl ? "مؤقت (Paused)" : "Paused" },
    { value: "dropped", label: isRtl ? "ملغي (Dropped)" : "Dropped" },
  ];

  const parentOptions = [
    { value: "", label: isRtl ? "بدون هدف أب (هدف رئيسي مستقل)" : "None (Top-level goal)" },
    ...availableParents
      .filter((p) => !goalToEdit || p.id !== goalToEdit.id)
      .map((p) => ({
        value: p.id,
        label: `[${p.level.toUpperCase()}] ${p.title}`,
      })),
  ];

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
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? t.goals.editGoal : t.goals.newGoal}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {isRtl ? "حدد موقع الهدف في الشجرة الهرمية" : "Position goal in the transformation hierarchy"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form ref={formRef} action={formAction} className="p-6 space-y-4">
          {state?.message && !state.ok && (
            <div className="p-3.5 rounded-xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {state.message}
            </div>
          )}

          <div>
            <Label htmlFor="title" required>
              {t.goals.goalTitle}
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={goalToEdit?.title ?? ""}
              placeholder={t.goals.goalTitlePlaceholder}
              error={state?.errors?.title?.[0]}
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level" required>
                {t.goals.level}
              </Label>
              <CustomSelect
                id="level"
                name="level"
                defaultValue={goalToEdit?.level ?? defaultLevel}
                options={levelOptions}
              />
            </div>

            <div>
              <Label htmlFor="status">
                {t.common.status}
              </Label>
              <CustomSelect
                id="status"
                name="status"
                defaultValue={goalToEdit?.status ?? "active"}
                options={statusOptions}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="parent_id">
              {t.goals.parentGoal}
            </Label>
            <CustomSelect
              id="parent_id"
              name="parent_id"
              defaultValue={goalToEdit?.parent_id ?? defaultParentId ?? ""}
              options={parentOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_value">
                {t.goals.targetValue}
              </Label>
              <Input
                id="target_value"
                name="target_value"
                type="number"
                defaultValue={goalToEdit?.target_value ?? ""}
                placeholder="e.g. 250000"
              />
            </div>

            <div>
              <Label htmlFor="unit">
                {t.goals.unit}
              </Label>
              <Input
                id="unit"
                name="unit"
                defaultValue={goalToEdit?.unit ?? ""}
                placeholder="e.g. EGP / Clients"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">
              {t.goals.description}
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={goalToEdit?.description ?? ""}
              placeholder="Why this milestone matters..."
              rows={3}
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <SubmitButton text={isEditing ? t.common.save : t.common.create} />
          </div>
        </form>
      </div>
    </div>
  );
}
