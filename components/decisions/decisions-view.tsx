"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { DecisionModal } from "./decision-modal";
import type { DecisionRow, DecisionStatus } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Scale,
  Plus,
  Calendar,
  Repeat,
  ShieldAlert,
} from "lucide-react";

interface DecisionsViewProps {
  decisions: DecisionRow[];
}

export function DecisionsView({ decisions }: DecisionsViewProps) {
  const { t } = useLocale();
  const [filter, setFilter] = useState<"all" | DecisionStatus>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<DecisionRow | null>(null);

  const filteredDecisions = decisions.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const openNew = () => {
    setEditingDecision(null);
    setIsModalOpen(true);
  };

  const openEdit = (decision: DecisionRow) => {
    setEditingDecision(decision);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {t.decisionsPage.title}
              </h1>
              <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                {t.decisionsPage.subtitle}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={openNew}
          className="gap-2 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.decisionsPage.newDecision}</span>
        </Button>
      </div>

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
          {t.decisionsPage.filterAll} ({decisions.length})
        </button>
        <button
          onClick={() => setFilter("open")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "open"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          {t.decisionsPage.filterOpen} (
          {decisions.filter((d) => d.status === "open").length})
        </button>
        <button
          onClick={() => setFilter("decided")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "decided"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          {t.decisionsPage.filterDecided} (
          {decisions.filter((d) => d.status === "decided").length})
        </button>
        <button
          onClick={() => setFilter("reviewed")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filter === "reviewed"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          {t.decisionsPage.filterReviewed} (
          {decisions.filter((d) => d.status === "reviewed").length})
        </button>
      </div>

      {/* Decisions Grid */}
      {filteredDecisions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-3">
            <Scale className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {t.decisionsPage.noDecisionsTitle}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
            {t.decisionsPage.noDecisionsDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDecisions.map((decision) => {
            const rawOptions = (decision.options as unknown as Array<{ label: string }>) || [];
            return (
              <div
                key={decision.id}
                onClick={() => openEdit(decision)}
                className="group p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                        decision.status === "decided"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : decision.status === "reviewed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {decision.status === "decided"
                        ? "تم اتخاذ القرار"
                        : decision.status === "reviewed"
                          ? "تمت المراجعة"
                          : "قيد التقييم"}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        decision.reversible
                          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                          : "text-rose-600 bg-rose-50 dark:bg-rose-950/30"
                      }`}
                    >
                      {decision.reversible ? (
                        <Repeat className="h-3 w-3" />
                      ) : (
                        <ShieldAlert className="h-3 w-3" />
                      )}
                      <span>
                        {decision.reversible ? "Reversible" : "Irreversible"}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {decision.title}
                  </h3>

                  {/* Decision Text / Why Now snippet */}
                  {decision.decision ? (
                    <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                        القرار المعتمد:
                      </div>
                      <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 line-clamp-2">
                        {decision.decision}
                      </p>
                    </div>
                  ) : decision.why_now ? (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {decision.why_now}
                    </p>
                  ) : null}

                  {/* Options snippet */}
                  {rawOptions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {rawOptions.map((opt, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {String.fromCharCode(65 + i)}: {opt.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Review Date */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {decision.review_date
                        ? `مراجعة: ${decision.review_date}`
                        : "بدون تاريخ مراجعة"}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                    عرض وتعديل ←
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Modal */}
      <DecisionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDecision(null);
        }}
        decision={editingDecision}
      />
    </div>
  );
}
