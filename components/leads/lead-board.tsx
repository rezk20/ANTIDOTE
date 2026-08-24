"use client";

import { useState } from "react";
import { LeadCard } from "./lead-card";
import { LeadModal } from "./lead-modal";
import { LeadEventsTimeline } from "./lead-events-timeline";
import { LeadDetailModal } from "./lead-detail-modal";
import { SalesTargetsWidget } from "./sales-targets-widget";
import { FollowUpQueue } from "./follow-up-queue";
import {
  groupLeadsByPipeline,
  PIPELINE_COLUMNS,
  calculateSalesMetrics,
} from "@/lib/logic/sales-metrics";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Briefcase,
  Plus,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type {
  LeadRow,
  LeadEventRow,
  ClientRow,
  ProfileRow,
} from "@/lib/supabase/types";

export function LeadBoard({
  leads,
  events = [],
  clients = [],
  profile,
}: {
  leads: LeadRow[];
  events?: LeadEventRow[];
  clients?: ClientRow[];
  profile: ProfileRow | null;
}) {
  const { t, isRtl } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<LeadRow | null>(null);
  const [defaultStage, setDefaultStage] = useState<string>("new");

  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedTimelineLead, setSelectedTimelineLead] =
    useState<LeadRow | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailLead, setSelectedDetailLead] = useState<LeadRow | null>(
    null,
  );

  const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
  const salesSettings = (rawSettings.sales_targets ?? {}) as Record<
    string,
    unknown
  >;

  const salesMetrics = calculateSalesMetrics({
    events,
    proposalsTarget: Number(salesSettings.proposals_per_week ?? 5),
    outreachTarget: Number(salesSettings.outreach_per_day ?? 3),
  });

  const pipeline = groupLeadsByPipeline(leads);
  const followUpLeads = leads
    .filter(
      (l) =>
        l.next_follow_up_at &&
        l.stage !== "won" &&
        l.stage !== "lost" &&
        l.stage !== "paid",
    )
    .sort((a, b) => (a.next_follow_up_at! > b.next_follow_up_at! ? 1 : -1));

  function handleCreate(stage: string = "new") {
    setLeadToEdit(null);
    setDefaultStage(stage);
    setIsModalOpen(true);
  }

  function handleEdit(lead: LeadRow) {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  }

  function handleOpenTimeline(lead: LeadRow) {
    setSelectedTimelineLead(lead);
    setIsTimelineOpen(true);
  }

  function handleViewDetails(lead: LeadRow) {
    setSelectedDetailLead(lead);
    setIsDetailOpen(true);
  }

  const stageBadgeStyles: Record<string, string> = {
    discovery: "bg-blue-600 text-white shadow-blue-500/20",
    outreach: "bg-amber-600 text-white shadow-amber-500/20",
    proposal: "bg-purple-600 text-white shadow-purple-500/20",
    won: "bg-emerald-600 text-white shadow-emerald-500/20",
    completed: "bg-teal-600 text-white shadow-teal-500/20",
    lost: "bg-rose-600 text-white shadow-rose-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Top Value Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Pipeline Card */}
        <div className="space-y-1 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>{t.leads.pipelineValue}</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {pipeline.totalPipelineValue.toLocaleString()}{" "}
            <span className="text-xs font-semibold text-zinc-400">EGP</span>
          </p>
          <p className="text-[11px] text-zinc-400">
            {isRtl ? "مجموع الصفقات المفتوحة" : "Active open deal value"}
          </p>
        </div>

        {/* Weighted Pipeline Card */}
        <div className="space-y-1 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>{t.leads.weightedValue}</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {Math.round(pipeline.weightedPipelineValue).toLocaleString()}{" "}
            <span className="text-xs font-semibold text-zinc-400">EGP</span>
          </p>
          <p className="text-[11px] text-zinc-400">
            {isRtl
              ? "محسوبة بنسب الاحتمالية (Probability)"
              : "Expected cash based on close probability"}
          </p>
        </div>

        {/* Active Deals Card */}
        <div className="space-y-1 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>
              {isRtl ? "إجمالي الفرص في المسار" : "Total Opportunities"}
            </span>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {leads.length}{" "}
            <span className="text-xs font-semibold text-zinc-400">
              {isRtl ? "فرصة" : "Deals"}
            </span>
          </p>
          <p className="text-[11px] text-zinc-400">
            {isRtl
              ? "عبر كافة مراحل التنفيذ والإغلاق"
              : "Across all pipeline stages"}
          </p>
        </div>
      </div>

      {/* Sales Targets Widget & Follow-Up Queue */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalesTargetsWidget metrics={salesMetrics} />
        <FollowUpQueue leads={followUpLeads} onOpenLead={handleOpenTimeline} />
      </div>

      {/* Main Header & New Lead Button */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-xs font-extrabold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            {isRtl
              ? "مسار ومراحل الصفقات (Discovery → Pitch → Delivery → Cash)"
              : "Pipeline Stages (Discovery → Pitch → Delivery → Cash)"}
          </h2>
        </div>

        <Button
          onClick={() => handleCreate("new")}
          size="sm"
          className="gap-1.5 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>{t.leads.newLead}</span>
        </Button>
      </div>

      {/* Smooth Horizontal Kanban Columns with Stage Numbers & Flow Arrows */}
      <div className="no-scrollbar flex snap-x items-start gap-4 overflow-x-auto pt-1 pb-6">
        {PIPELINE_COLUMNS.map((col, index) => {
          const colData = pipeline.columns[col.key];
          const leadList = colData.leads;
          const stageNumber = index + 1;
          const isLastColumn = index === PIPELINE_COLUMNS.length - 1;

          return (
            <div
              key={col.key}
              className="flex shrink-0 snap-start items-center gap-4"
            >
              {/* Column Box */}
              <div className="flex w-80 max-w-[340px] min-w-[320px] shrink-0 flex-col space-y-3.5 rounded-3xl border border-zinc-200 bg-zinc-50/70 p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900/60">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
                  <div className="flex min-w-0 items-center gap-2.5">
                    {/* Stage Number Badge */}
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-xs ${
                        stageBadgeStyles[col.key] || "bg-zinc-700 text-white"
                      }`}
                    >
                      {stageNumber}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <h3 className="truncate text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                        {isRtl ? col.labelAr : col.labelEn}
                      </h3>
                      <span className="block text-[10px] font-bold text-zinc-400">
                        {leadList.length} {isRtl ? "صفقات" : "deals"} •{" "}
                        {colData.totalValue.toLocaleString()} EGP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreate(col.stages[0])}
                    className="shrink-0 cursor-pointer rounded-xl p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    title="Add lead in this stage"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Lead Cards List */}
                <div className="flex-1 space-y-3">
                  {leadList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-xs font-medium text-zinc-400 dark:border-zinc-800">
                      {isRtl ? "لا توجد صفقات" : "No deals in stage"}
                    </div>
                  ) : (
                    leadList.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        clients={clients}
                        onEdit={handleEdit}
                        onOpenTimeline={handleOpenTimeline}
                        onViewDetails={handleViewDetails}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Connecting Flow Arrow between columns */}
              {!isLastColumn && (
                <div className="hidden shrink-0 items-center justify-center text-zinc-300 sm:flex dark:text-zinc-700">
                  <div className="rounded-full border border-zinc-200 bg-zinc-100 p-1.5 dark:border-zinc-800 dark:bg-zinc-800">
                    <ArrowRight className="h-4 w-4 text-zinc-400 rtl:rotate-180 dark:text-zinc-500" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
        clients={clients}
        defaultStage={defaultStage}
      />

      <LeadEventsTimeline
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        lead={selectedTimelineLead}
        events={events}
      />

      <LeadDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        lead={selectedDetailLead}
        clients={clients}
        onEdit={() => {
          if (selectedDetailLead) handleEdit(selectedDetailLead);
        }}
        onOpenTimeline={() => {
          if (selectedDetailLead) handleOpenTimeline(selectedDetailLead);
        }}
      />
    </div>
  );
}
