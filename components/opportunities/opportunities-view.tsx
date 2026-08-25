"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { OpportunityModal } from "./opportunity-modal";
import {
  prioritizeOpportunities,
  type OpportunityPrioritizationResult,
} from "@/lib/logic/opportunity";
import type { OpportunityRow, OpportunityStatus } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
  Briefcase,
  Bot,
  Zap,
} from "lucide-react";

interface OpportunitiesViewProps {
  opportunities: OpportunityRow[];
}

export function OpportunitiesView({ opportunities }: OpportunitiesViewProps) {
  const { t } = useLocale();
  const [filter, setFilter] = useState<"all" | OpportunityStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityRow | null>(null);

  const prioritization: OpportunityPrioritizationResult =
    prioritizeOpportunities(opportunities);

  const filteredOpps = prioritization.scoredOpportunities.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  const openNew = () => {
    setEditingOpp(null);
    setIsModalOpen(true);
  };

  const openEdit = (opp: OpportunityRow) => {
    setEditingOpp(opp);
    setIsModalOpen(true);
  };

  const getKindBadge = (kind: string) => {
    switch (kind) {
      case "discord_client":
        return { label: "بوت ديسكورد", icon: Bot, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" };
      case "freelance":
        return { label: "فريلانس", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" };
      case "remote":
        return { label: "ريموت", icon: Zap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" };
      default:
        return { label: kind, icon: TrendingUp, color: "text-zinc-600 bg-zinc-50 dark:bg-zinc-800" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {t.opportunitiesPage.title}
              </h1>
              <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                {t.opportunitiesPage.subtitle}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={openNew}
          className="gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.opportunitiesPage.newOpportunity}</span>
        </Button>
      </div>

      {/* Recommended Next Opportunity Spotlight Card (§50) */}
      {prioritization.recommendedOpportunity && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/70 via-emerald-500/5 to-white dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-zinc-900 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t.opportunitiesPage.recommendationBadge}</span>
                </span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {t.opportunitiesPage.recommendedTitle}
                </span>
              </div>

              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                {prioritization.recommendedOpportunity.title}
              </h2>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                {prioritization.recommendationReasonAr}
              </p>

              {prioritization.recommendedOpportunity.next_action && (
                <div className="pt-1 flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    الخطوة القادمة:
                  </span>
                  <span>{prioritization.recommendedOpportunity.next_action}</span>
                </div>
              )}
            </div>

            {/* Score & Action */}
            <div className="flex sm:flex-col items-end justify-between w-full md:w-auto shrink-0 gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-emerald-100 dark:border-emerald-900/40">
              <div className="text-end">
                <div className="text-[10px] font-bold text-zinc-400">
                  معامل الجدوى
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {prioritization.recommendedOpportunity.score.toLocaleString()}{" "}
                  <span className="text-xs font-bold text-zinc-500">ج.م/س</span>
                </div>
              </div>

              <Button
                onClick={() => openEdit(prioritization.recommendedOpportunity!)}
                size="sm"
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer shadow-xs gap-1.5"
              >
                <span>متابعة وتحديث</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          الكل ({opportunities.length})
        </button>
        <button
          onClick={() => setFilter("open")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "open"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          مفتوحة للدراسة ({opportunities.filter((o) => o.status === "open").length})
        </button>
        <button
          onClick={() => setFilter("pursuing")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "pursuing"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          قيد المتابعة والتفاوض (
          {opportunities.filter((o) => o.status === "pursuing").length})
        </button>
        <button
          onClick={() => setFilter("won")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "won"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          تم الفوز بها ({opportunities.filter((o) => o.status === "won").length})
        </button>
      </div>

      {/* Opportunities Grid / Matrix */}
      {filteredOpps.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-3">
            <TrendingUp className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {t.opportunitiesPage.noOpportunitiesTitle}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
            {t.opportunitiesPage.noOpportunitiesDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpps.map((opp, idx) => {
            const kindBadge = getKindBadge(opp.kind);
            const KindIcon = kindBadge.icon;
            return (
              <div
                key={opp.id}
                onClick={() => openEdit(opp)}
                className="group p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Rank & Kind */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-black text-zinc-700 dark:text-zinc-300">
                      #{idx + 1}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${kindBadge.color}`}
                    >
                      <KindIcon className="h-3 w-3" />
                      <span>{kindBadge.label}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {opp.title}
                  </h3>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 text-center">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400">
                        القيمة
                      </div>
                      <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                        {Number(opp.expected_value).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400">
                        الاحتمالية
                      </div>
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {Math.round(opp.probability * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400">
                        الوقت
                      </div>
                      <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                        {opp.time_required_hours} س
                      </div>
                    </div>
                  </div>

                  {/* Next Action */}
                  {opp.next_action && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">
                        التالي:{" "}
                      </span>
                      {opp.next_action}
                    </p>
                  )}
                </div>

                {/* Footer Score Badge */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="text-base">{opp.score.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-zinc-400">ج.م/س</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      opp.risk === "low"
                        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                        : opp.risk === "medium"
                          ? "text-amber-600 bg-amber-50 dark:bg-amber-950/30"
                          : "text-rose-600 bg-rose-50 dark:bg-rose-950/30"
                    }`}
                  >
                    {opp.risk === "low"
                      ? "مخاطرة قليلة"
                      : opp.risk === "medium"
                        ? "مخاطرة معتدلة"
                        : "مخاطرة عالية"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Opportunity Modal */}
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpp(null);
        }}
        opportunity={editingOpp}
      />
    </div>
  );
}
