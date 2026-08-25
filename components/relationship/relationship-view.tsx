"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { BudgetSuggestionBanner } from "./budget-suggestion-banner";
import { RelationshipIdeasList } from "./relationship-ideas-list";
import { RelationshipIdeaModal } from "./relationship-idea-modal";
import { RelationshipWishlistView } from "./relationship-wishlist-view";
import { RelationshipCheckinForm } from "./relationship-checkin-form";
import type { RelationshipPageData } from "@/lib/dal/relationship";
import type { RelationshipIdeaRow } from "@/lib/supabase/types";
import {
  Sparkles,
  Gift,
  CalendarCheck,
} from "lucide-react";

interface RelationshipViewProps {
  data: RelationshipPageData;
}

type TabKey = "ideas" | "wishlist" | "checkin";

export function RelationshipView({ data }: RelationshipViewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<TabKey>("ideas");
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [ideaToEdit, setIdeaToEdit] = useState<RelationshipIdeaRow | null>(null);

  const handleAddIdea = () => {
    setIdeaToEdit(null);
    setIsIdeaModalOpen(true);
  };

  const handleEditIdea = (idea: RelationshipIdeaRow) => {
    setIdeaToEdit(idea);
    setIsIdeaModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {t.relationshipPage.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-black">
              Us
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t.relationshipPage.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab("ideas")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "ideas"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            <span>{t.relationshipPage.tabs.ideas}</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "wishlist"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Gift className="h-3.5 w-3.5 text-pink-500" />
            <span>{t.relationshipPage.tabs.wishlist}</span>
          </button>

          <button
            onClick={() => setActiveTab("checkin")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "checkin"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <CalendarCheck className="h-3.5 w-3.5 text-pink-500" />
            <span>{t.relationshipPage.tabs.checkin}</span>
          </button>
        </div>
      </div>

      {/* 1. Smart Budget-Aware Recommendation Banner */}
      <BudgetSuggestionBanner
        recommendation={data.recommendation}
        onSelectIdea={handleEditIdea}
      />

      {/* 2. Tab Contents */}
      {activeTab === "ideas" && (
        <RelationshipIdeasList
          ideas={data.ideas}
          onAddIdea={handleAddIdea}
          onEditIdea={handleEditIdea}
        />
      )}

      {activeTab === "wishlist" && (
        <RelationshipWishlistView wishlist={data.wishlist} />
      )}

      {activeTab === "checkin" && (
        <RelationshipCheckinForm checkins={data.checkins} />
      )}

      {/* Shared Idea Add/Edit Modal */}
      <RelationshipIdeaModal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        ideaToEdit={ideaToEdit}
      />
    </div>
  );
}
