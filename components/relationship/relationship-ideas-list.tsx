"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { toggleIdeaCompleted, deleteRelationshipIdea } from "@/lib/actions/relationship";
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
  RotateCcw,
  X,
  MapPin,
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
  const { t, isRtl } = useLocale();
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [suggestedDeckIds, setSuggestedDeckIds] = useState<string[]>([]);
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

  // Helper: Get random items from uncompleted pool without repetition
  const pickFreshIdeas = (count: number, excludeIds: string[] = []): string[] => {
    const uncompleted = ideas.filter(
      (i) => !i.is_completed && !excludeIds.includes(i.id),
    );
    // Shuffle
    const shuffled = [...uncompleted].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((i) => i.id);
  };

  // 1. Suggest 6 Random Activities
  const handleRollAllSix = () => {
    const picked = pickFreshIdeas(6);
    setSuggestedDeckIds(picked);
  };

  // 2. Replace only completed items in the 6-tray
  const handleReplaceCompletedOnly = () => {
    const activeKeptIds = suggestedDeckIds.filter((id) => {
      const found = ideas.find((i) => i.id === id);
      return found && !found.is_completed;
    });

    const neededCount = 6 - activeKeptIds.length;
    const freshIds = pickFreshIdeas(neededCount, activeKeptIds);
    setSuggestedDeckIds([...activeKeptIds, ...freshIds]);
  };

  const budgetTierBadges: Record<string, string> = {
    free: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    low: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    high: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  };

  // Items currently inside the 6-suggestion tray
  const suggestedIdeasInDeck = suggestedDeckIds
    .map((id) => ideas.find((i) => i.id === id))
    .filter(Boolean) as RelationshipIdeaRow[];

  const completedInDeckCount = suggestedIdeasInDeck.filter((i) => i.is_completed).length;

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
            onClick={handleRollAllSix}
            className="rounded-2xl text-xs font-bold gap-2 cursor-pointer text-pink-600 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30"
          >
            <Dices className="h-4 w-4 text-pink-500" />
            <span>{isRtl ? "اقتراح 6 أنشطة مميزة 🎲" : "Suggest 6 Random Activities"}</span>
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

      {/* 6-Random Suggestion Elevated Tray Deck */}
      {suggestedIdeasInDeck.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-amber-500/10 border-2 border-pink-300 dark:border-pink-800/80 shadow-lg space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-200/60 dark:border-pink-800/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>{isRtl ? "صينية الاقتراحات المختارة (6 أنشطة مقترحة لكما)" : "Curated 6-Activity Suggestion Deck"}</span>
                  <span className="text-[10px] font-mono font-bold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full">
                    {completedInDeckCount} / 6 {isRtl ? "منجز" : "done"}
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {isRtl
                    ? "أنشطة منتقاة عشوائياً بدون تكرار لتجديد الطاقة وقضاء وقت ممتع معاً."
                    : "Fresh hand-picked experiences generated without repetition."}
                </p>
              </div>
            </div>

            {/* Smart Refresh Modes */}
            <div className="flex items-center gap-2 flex-wrap">
              {completedInDeckCount > 0 && (
                <button
                  type="button"
                  onClick={handleReplaceCompletedOnly}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isRtl ? "استبدال الأنشطة المنجزة فقط" : "Replace Completed Only"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRollAllSix}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Dices className="h-3.5 w-3.5" />
                <span>{isRtl ? "تجديد كافة الـ 6 أفكار" : "Roll 6 New Ideas"}</span>
              </button>

              <button
                type="button"
                onClick={() => setSuggestedDeckIds([])}
                className="p-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title={isRtl ? "إغلاق الصينية" : "Dismiss"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 6 Deck Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {suggestedIdeasInDeck.map((idea) => {
              const isCompleted = idea.is_completed;
              const categoryName =
                t.relationshipPage.categories[
                  idea.category as keyof typeof t.relationshipPage.categories
                ] || idea.category;
              const tierBadge = budgetTierBadges[idea.budget_tier] || "";
              const isMansouraSpot =
                idea.title.includes("المنصورة") ||
                idea.title.includes("المشاية") ||
                idea.title.includes("النيل") ||
                idea.notes?.includes("المنصورة");

              return (
                <div
                  key={`deck_${idea.id}`}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 flex flex-col justify-between shadow-xs ${
                    isCompleted
                      ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                      : "bg-white/95 dark:bg-zinc-900/95 border-pink-200 dark:border-pink-900/60 hover:border-pink-400"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${tierBadge}`}
                        >
                          {t.relationshipPage.budgetTiers[
                            idea.budget_tier as keyof typeof t.relationshipPage.budgetTiers
                          ] || idea.budget_tier}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {categoryName}
                        </span>
                        {isMansouraSpot && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5 text-amber-600" />
                            المنصورة
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggle(idea)}
                        disabled={isPending}
                        className="p-1 rounded-full text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                        title={isCompleted ? "إلغاء الإتمام" : "تعليم كمنجز"}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <h4
                      className={`text-xs font-bold leading-relaxed ${
                        isCompleted
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {idea.title}
                    </h4>

                    {idea.notes && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {idea.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                    <span className="font-mono font-bold text-zinc-600 dark:text-zinc-300">
                      {idea.estimated_cost > 0
                        ? `${idea.estimated_cost} ج.م`
                        : isRtl
                        ? "مجاني (Free)"
                        : "Free"}
                    </span>

                    <button
                      type="button"
                      onClick={() => onEditIdea(idea)}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-[10px] font-bold cursor-pointer"
                    >
                      {isRtl ? "تعديل" : "Edit"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
            const categoryName =
              t.relationshipPage.categories[
                idea.category as keyof typeof t.relationshipPage.categories
              ] || idea.category;
            const tierBadge = budgetTierBadges[idea.budget_tier] || "";
            const isMansouraSpot =
              idea.title.includes("المنصورة") ||
              idea.title.includes("المشاية") ||
              idea.title.includes("النيل") ||
              idea.notes?.includes("المنصورة");

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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${tierBadge}`}>
                        {t.relationshipPage.budgetTiers[idea.budget_tier as keyof typeof t.relationshipPage.budgetTiers] || idea.budget_tier}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {categoryName}
                      </span>
                      {isMansouraSpot && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-amber-600" />
                          المنصورة
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggle(idea)}
                      disabled={isPending}
                      className="p-1 rounded-full text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
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

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                  <span className="font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    {idea.estimated_cost > 0 ? `${idea.estimated_cost} ج.م` : isRtl ? "مجاني (Free)" : "Free"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditIdea(idea)}
                      className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
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
