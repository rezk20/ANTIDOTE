"use client";

import { useLocale } from "@/components/providers/locale-provider";
import type { BudgetAwareRecommendation } from "@/lib/logic/relationship";
import type { RelationshipIdeaRow } from "@/lib/supabase/types";
import {
  Sparkles,
  Heart,
} from "lucide-react";

interface BudgetSuggestionBannerProps {
  recommendation: BudgetAwareRecommendation;
  onSelectIdea?: (idea: RelationshipIdeaRow) => void;
}

export function BudgetSuggestionBanner({
  recommendation,
  onSelectIdea,
}: BudgetSuggestionBannerProps) {
  const { t, isRtl } = useLocale();

  const tierColors: Record<string, string> = {
    free: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    low: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    medium: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    high: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
  };

  const tierName = t.relationshipPage.budgetTiers[recommendation.recommendedTier as keyof typeof t.relationshipPage.budgetTiers] || recommendation.recommendedTier;

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${tierColors[recommendation.recommendedTier] || ""}`}>
              مستوى التكلفة المقترح: {tierName}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span>{t.relationshipPage.budgetBannerTitle}</span>
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isRtl ? recommendation.reasonAr : recommendation.reasonEn}
          </p>
        </div>
      </div>

      {/* Suggested Ideas Pills */}
      {recommendation.suggestedIdeas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {recommendation.suggestedIdeas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => onSelectIdea?.(idea)}
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-pink-300 dark:hover:border-pink-800 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {idea.title}
                </span>
                <Heart className="h-3.5 w-3.5 text-pink-500 shrink-0" />
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                {idea.notes || "نشاط ممتع لتجديد الطاقة وقضاء وقت لطيف معاً"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
