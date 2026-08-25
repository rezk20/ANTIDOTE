"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveHabit } from "@/lib/actions/habits";
import { HABIT_CATEGORIES, type HabitCategory } from "@/lib/schemas/habits";
import type { HabitRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Flame } from "lucide-react";

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: HabitRow | null;
}

export function HabitModal({ isOpen, onClose, habitToEdit }: HabitModalProps) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600">
              <Flame className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {habitToEdit ? t.habitsPage.editHabit : t.habitsPage.newHabit}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <HabitForm
          habitToEdit={habitToEdit}
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

function HabitForm({
  habitToEdit,
  onClose,
  isPending,
  startTransition,
  errorMsg,
  setErrorMsg,
}: {
  habitToEdit?: HabitRow | null;
  onClose: () => void;
  isPending: boolean;
  startTransition: (cb: () => Promise<void>) => void;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
}) {
  const { t } = useLocale();

  const [name, setName] = useState(habitToEdit?.name || "");
  const [description, setDescription] = useState(habitToEdit?.description || "");
  const [category, setCategory] = useState<HabitCategory>(
    (habitToEdit?.category as HabitCategory) || "health_routine",
  );
  const [targetPerWeek, setTargetPerWeek] = useState(
    habitToEdit?.target_per_week ? String(habitToEdit.target_per_week) : "7",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const res = await saveHabit({
        id: habitToEdit?.id,
        name,
        description: description || null,
        category,
        target_per_week: Number(targetPerWeek) || 7,
        is_active: habitToEdit?.is_active ?? true,
        sort_order: habitToEdit?.sort_order ?? 0,
      });

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء حفظ العادة.");
      }
    });
  };

  const categoryMap: Record<HabitCategory, string> = {
    health_routine: t.habitsPage.categories.healthRoutine,
    deep_work: t.habitsPage.categories.deepWork,
    revenue: t.habitsPage.categories.revenue,
    learning: t.habitsPage.categories.learning,
    relationship: t.habitsPage.categories.relationship,
    finance: t.habitsPage.categories.finance,
    personal: t.habitsPage.categories.personal,
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Habit Name */}
      <div className="space-y-1">
        <Label htmlFor="habit_name" className="text-xs font-bold">
          {t.habitsPage.habitName} *
        </Label>
        <Input
          id="habit_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: جلسة عمل عميق 90 دقيقة / قراءة 30 دقيقة / نوم منضبط..."
          className="text-xs rounded-xl"
          required
        />
      </div>

      {/* Category & Target */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.habitsPage.category}</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HabitCategory)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            {HABIT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {categoryMap[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold">{t.habitsPage.targetPerWeek}</Label>
          <select
            value={targetPerWeek}
            onChange={(e) => setTargetPerWeek(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num}>
                {num} {num === 7 ? "أيام (يومي)" : "أيام / أسبوع"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="habit_desc" className="text-xs font-bold">
          {t.habitsPage.description}
        </Label>
        <Textarea
          id="habit_desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="ما هو الهدف والدافع من هذه العادة؟"
          rows={2}
          className="text-xs rounded-xl resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
          className="text-xs rounded-xl cursor-pointer"
        >
          {t.common.cancel}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl cursor-pointer"
        >
          {isPending ? t.common.saving : t.common.save}
        </Button>
      </div>
    </form>
  );
}
