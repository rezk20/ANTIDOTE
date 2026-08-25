"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveRelationshipIdea } from "@/lib/actions/relationship";
import {
  RELATIONSHIP_IDEA_CATEGORIES,
  RELATIONSHIP_BUDGET_TIERS,
  type RelationshipIdeaCategory,
  type RelationshipBudgetTier,
} from "@/lib/schemas/relationship";
import type { RelationshipIdeaRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Heart } from "lucide-react";

interface RelationshipIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaToEdit?: RelationshipIdeaRow | null;
}

export function RelationshipIdeaModal({
  isOpen,
  onClose,
  ideaToEdit,
}: RelationshipIdeaModalProps) {
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
            <div className="p-1.5 rounded-xl bg-pink-500/10 text-pink-600">
              <Heart className="h-4 w-4 fill-pink-500" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {ideaToEdit ? t.relationshipPage.editIdea : t.relationshipPage.newIdea}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <RelationshipIdeaForm
          key={ideaToEdit?.id || "new"}
          ideaToEdit={ideaToEdit}
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

function RelationshipIdeaForm({
  ideaToEdit,
  onClose,
  isPending,
  startTransition,
  errorMsg,
  setErrorMsg,
}: {
  ideaToEdit?: RelationshipIdeaRow | null;
  onClose: () => void;
  isPending: boolean;
  startTransition: (cb: () => Promise<void>) => void;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
}) {
  const { t } = useLocale();

  const [title, setTitle] = useState(ideaToEdit?.title || "");
  const [category, setCategory] = useState<RelationshipIdeaCategory>(
    (ideaToEdit?.category as RelationshipIdeaCategory) || "date",
  );
  const [budgetTier, setBudgetTier] = useState<RelationshipBudgetTier>(
    (ideaToEdit?.budget_tier as RelationshipBudgetTier) || "low",
  );
  const [estimatedCost, setEstimatedCost] = useState(
    ideaToEdit?.estimated_cost ? String(ideaToEdit.estimated_cost) : "0",
  );
  const [notes, setNotes] = useState(ideaToEdit?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const res = await saveRelationshipIdea({
        id: ideaToEdit?.id,
        title,
        category,
        budget_tier: budgetTier,
        estimated_cost: Number(estimatedCost) || 0,
        notes: notes || null,
        is_completed: ideaToEdit?.is_completed || false,
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

      {/* Title */}
      <div className="space-y-1">
        <Label htmlFor="idea_title" className="text-xs font-bold">
          عنوان النشاط أو الفكرة *
        </Label>
        <Input
          id="idea_title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثال: عشاء على ضوء الشموع / حجز تجربة بولينج / تجربة طبخة جديدة..."
          className="text-xs rounded-xl"
          required
        />
      </div>

      {/* Category & Budget Tier */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-bold">النوع والتصنيف</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as RelationshipIdeaCategory)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            {RELATIONSHIP_IDEA_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.relationshipPage.categories[cat as keyof typeof t.relationshipPage.categories] || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold">مستوى الميزانية</Label>
          <select
            value={budgetTier}
            onChange={(e) => setBudgetTier(e.target.value as RelationshipBudgetTier)}
            className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          >
            {RELATIONSHIP_BUDGET_TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {t.relationshipPage.budgetTiers[tier as keyof typeof t.relationshipPage.budgetTiers] || tier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estimated Cost */}
      <div className="space-y-1">
        <Label htmlFor="est_cost" className="text-xs font-bold">
          التكلفة التقديرية (EGP)
        </Label>
        <Input
          id="est_cost"
          type="number"
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.value)}
          placeholder="0"
          className="text-xs rounded-xl"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <Label htmlFor="idea_notes" className="text-xs font-bold">
          ملاحظات أو تفاصيل إضافية
        </Label>
        <Textarea
          id="idea_notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: يفضل أن يكون يوم الجمعة قبل المغرب، أو في مكان هادئ..."
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
          className="text-xs font-bold rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-xs cursor-pointer"
        >
          {isPending ? t.common.saving : t.common.save}
        </Button>
      </div>
    </form>
  );
}
