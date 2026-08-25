"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { toggleIdeaCompleted, deleteRelationshipIdea } from "@/lib/actions/relationship";
import { pickRandomIdea } from "@/lib/logic/relationship";
import { RELATIONSHIP_BUDGET_TIERS, RELATIONSHIP_IDEA_CATEGORIES } from "@/lib/schemas/relationship";
import type { RelationshipIdeaRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  Plus,
  Dices,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
} from "lucide-react";

interface RelationshipIdeasListProps {
  ideas: RelationshipIdeaRow[];
  onAddIdea: () => void;
  onEditIdea: (idea: RelationshipIdeaRow) => void;
}

export function RelationshipIdeasList({
  ideas,
  onAddIdea,
  onEditIdea,
}: RelationshipIdeasListProps) {
  const { t } = useLocale();
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [randomPickedIdea, setRandomPickedIdea] = useState<RelationshipIdeaRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredIdeas = ideas.filter((item) => {
    if (selectedBudget !== "all" && item.budget_tier !== selectedBudget) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    return true;
  });

  const handleToggle = (idea: RelationshipIdeaRow) => {
    startTransition(async () => {
      await toggleIdeaCompleted(idea.id, !idea.is_completed);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفكرة؟")) {
      startTransition(async () => {
        await deleteRelationshipIdea(id);
      });
    }
  };

  const handleSurpriseMe = () => {
    const picked = pickRandomIdea(ideas);
    setRandomPickedIdea(picked);
  };

  const budgetTierBadges: Record<string, string> = {
    free: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    low: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    high: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {t.relationshipPage.ideasTitle}
          </h3>
          <p className="text-xs text-zinc-500">
            {t.relationshipPage.ideasSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSurpriseMe}
            className="rounded-2xl text-xs font-bold gap-2 cursor-pointer text-pink-600 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30"
          >
            <Dices className="h-4 w-4 text-pink-500" />
            <span>{t.relationshipPage.randomIdea}</span>
          </Button>

          <Button
            onClick={onAddIdea}
            className="rounded-2xl text-xs font-black gap-2 bg-pink-600 hover:bg-pink-700 text-white shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t.relationshipPage.newIdea}</span>
          </Button>
        </div>
      </div>

      {/* Random Picked Notification Banner */}
      {randomPickedIdea && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 border border-pink-200 dark:border-pink-800 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase">
                {t.relationshipPage.randomIdeaPicked}
              </span>
              <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                {randomPickedIdea.title} ({randomPickedIdea.estimated_cost} ج.م)
              </p>
            </div>
          </div>

          <button
            onClick={() => setRandomPickedIdea(null)}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-700 cursor-pointer px-2 py-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Filters (Budget & Category) */}
      <div className="space-y-2 text-xs font-bold">
        {/* Budget Tiers */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedBudget("all")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedBudget === "all"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            كافة الميزانيات ({ideas.length})
          </button>

          {RELATIONSHIP_BUDGET_TIERS.map((tier) => {
            const count = ideas.filter((i) => i.budget_tier === tier).length;
            if (count === 0) return null;
            return (
              <button
                key={tier}
                onClick={() => setSelectedBudget(tier)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedBudget === tier
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {t.relationshipPage.budgetTiers[tier as keyof typeof t.relationshipPage.budgetTiers] || tier} ({count})
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-pink-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            كافة الأنشطة
          </button>

          {RELATIONSHIP_IDEA_CATEGORIES.map((cat) => {
            const count = ideas.filter((i) => i.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-pink-600 text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {t.relationshipPage.categories[cat as keyof typeof t.relationshipPage.categories] || cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="p-8 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
          <Heart className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            لا توجد أفكار مسجلة في هذا التصنيف
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredIdeas.map((idea) => {
            const isCompleted = idea.is_completed;
            const categoryName = t.relationshipPage.categories[idea.category as keyof typeof t.relationshipPage.categories] || idea.category;
            const tierBadge = budgetTierBadges[idea.budget_tier] || "";

            return (
              <div
                key={idea.id}
                className={`p-4 rounded-3xl border transition-all space-y-3 flex flex-col justify-between shadow-xs ${
                  isCompleted
                    ? "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-70"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-pink-300 dark:hover:border-pink-800"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${tierBadge}`}>
                        {t.relationshipPage.budgetTiers[idea.budget_tier as keyof typeof t.relationshipPage.budgetTiers] || idea.budget_tier}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {categoryName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggle(idea)}
                      disabled={isPending}
                      className="p-1 rounded-full text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      title={isCompleted ? "إلغاء الإتمام" : "تعليم كمنجز"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <h4 className={`text-xs font-bold leading-relaxed ${isCompleted ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {idea.title}
                  </h4>

                  {idea.notes && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {idea.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-300">
                    {Number(idea.estimated_cost) > 0 ? `${Number(idea.estimated_cost).toLocaleString()} ج.م` : "مجاني"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditIdea(idea)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(idea.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
