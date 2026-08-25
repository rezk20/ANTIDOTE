"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { BudgetSuggestionBanner } from "./budget-suggestion-banner";
import { RelationshipIdeasList } from "./relationship-ideas-list";
import { RelationshipIdeaModal } from "./relationship-idea-modal";
import { RelationshipWishlistView } from "./relationship-wishlist-view";
import { RelationshipCheckinForm } from "./relationship-checkin-form";
import { RelationshipRevivalTab } from "./relationship-revival-tab";
import { syncRelationshipDataFromJson } from "@/lib/actions/relationship-json";
import type { RelationshipPageData } from "@/lib/dal/relationship";
import type { RelationshipIdeaRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Gift,
  CalendarCheck,
  Flame,
  Download,
  CheckCircle2,
} from "lucide-react";

interface RelationshipViewProps {
  data: RelationshipPageData;
}

type TabKey = "ideas" | "revival" | "wishlist" | "checkin";

export function RelationshipView({ data }: RelationshipViewProps) {
  const { t, isRtl } = useLocale();
  const [activeTab, setActiveTab] = useState<TabKey>("ideas");
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [ideaToEdit, setIdeaToEdit] = useState<RelationshipIdeaRow | null>(
    null,
  );
  const [isSyncing, startSyncTransition] = useTransition();
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const handleAddIdea = () => {
    setIdeaToEdit(null);
    setIsIdeaModalOpen(true);
  };

  const handleEditIdea = (idea: RelationshipIdeaRow) => {
    setIdeaToEdit(idea);
    setIsIdeaModalOpen(true);
  };

  const handleSyncJson = () => {
    startSyncTransition(async () => {
      setSyncSuccessMsg(null);
      const res = await syncRelationshipDataFromJson();
      if (res.ok) {
        setSyncSuccessMsg(
          "تم تحديث ومزامنة الأفكار والهدايا من ملفات JSON بنجاح! ✨",
        );
        setTimeout(() => setSyncSuccessMsg(null), 4000);
      }
    });
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-150">
      {/* Header */}
      <div className="justify-between gap-4 md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {t.relationshipPage.title}
            </h1>
            <span className="rounded-full bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-black text-pink-600 dark:text-pink-400">
              Us
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t.relationshipPage.subtitle}
          </p>
        </div>

        {/* Action & Tab Navigation */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* JSON Sync Button */}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleSyncJson}
            disabled={isSyncing}
            className="cursor-pointer gap-1.5 rounded-2xl border-zinc-200 text-xs font-bold text-zinc-600 shadow-2xs hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400"
            title="إعادة قراءة واستيراد الأفكار والهدايا من ملفات data/*.json"
          >
            <Download
              className={`h-3.5 w-3.5 ${isSyncing ? "animate-bounce text-pink-500" : ""}`}
            />
            <span>
              {isSyncing
                ? isRtl
                  ? "جارِ المزامنة..."
                  : "Syncing..."
                : isRtl
                  ? "مزامنة ملفات JSON"
                  : "Sync from JSON"}
            </span>
          </Button> */}

          <div className="scrollbar-none flex items-center gap-1 overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-100 p-1 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("ideas")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                activeTab === "ideas"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              <span>{t.relationshipPage.tabs.ideas}</span>
            </button>

            <button
              onClick={() => setActiveTab("revival")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                activeTab === "revival"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              <span>{t.relationshipPage.tabs.revival}</span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                activeTab === "wishlist"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Gift className="h-3.5 w-3.5 text-pink-500" />
              <span>{t.relationshipPage.tabs.wishlist}</span>
            </button>

            <button
              onClick={() => setActiveTab("checkin")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                activeTab === "checkin"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5 text-pink-500" />
              <span>{t.relationshipPage.tabs.checkin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync Success Feedback Banner */}
      {syncSuccessMsg && (
        <div className="animate-in fade-in flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* 1. Smart Budget-Aware Recommendation Banner (shown on ideas tab) */}
      {activeTab === "ideas" && (
        <BudgetSuggestionBanner
          recommendation={data.recommendation}
          onSelectIdea={handleEditIdea}
        />
      )}

      {/* 2. Tab Contents */}
      {activeTab === "ideas" && (
        <RelationshipIdeasList
          ideas={data.ideas}
          onAddIdea={handleAddIdea}
          onEditIdea={handleEditIdea}
        />
      )}

      {activeTab === "revival" && <RelationshipRevivalTab />}

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
