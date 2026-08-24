"use client";

import { useTransition } from "react";
import { moveLeadStage, deleteLead, convertToClient } from "@/lib/actions/leads";
import { useLocale } from "@/components/providers/locale-provider";
import { CustomSelect } from "@/components/ui/select";
import {
  Calendar,
  History,
  UserCheck,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import type { LeadRow, ClientRow } from "@/lib/supabase/types";

export function LeadCard({
  lead,
  clients = [],
  onEdit,
  onOpenTimeline,
  onViewDetails,
}: {
  lead: LeadRow;
  clients?: ClientRow[];
  onEdit: (lead: LeadRow) => void;
  onOpenTimeline: (lead: LeadRow) => void;
  onViewDetails: (lead: LeadRow) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const stageOptions = [
    { value: "new", label: isRtl ? "استكشاف (New)" : "New" },
    { value: "qualified", label: isRtl ? "مؤهل (Qualified)" : "Qualified" },
    { value: "contacted", label: isRtl ? "تواصل أول (Contacted)" : "Contacted" },
    { value: "proposal_sent", label: isRtl ? "عرض مرسل (Proposal)" : "Proposal Sent" },
    { value: "follow_up", label: isRtl ? "متابعة (Follow-Up)" : "Follow-Up" },
    { value: "call", label: isRtl ? "مكالمة (Call)" : "Call" },
    { value: "negotiation", label: isRtl ? "تفاوض (Negotiation)" : "Negotiation" },
    { value: "won", label: isRtl ? "صفقة رابحة (Won!)" : "Won!" },
    { value: "in_progress", label: isRtl ? "قيد التنفيذ" : "In Progress" },
    { value: "delivered", label: isRtl ? "تم التسليم" : "Delivered" },
    { value: "paid", label: isRtl ? "مدفوعة (Paid)" : "Paid" },
    { value: "review_requested", label: isRtl ? "طلب تقييم" : "Review" },
    { value: "referral_requested", label: isRtl ? "طلب ترشيح" : "Referral" },
    { value: "lost", label: isRtl ? "ملغاة (Lost)" : "Lost" },
  ];

  const val = lead.proposal_amount ?? lead.expected_value;
  const linkedClient = clients.find((c) => c.id === lead.client_id);

  function handleStageChange(newStage: string) {
    startTransition(async () => {
      await moveLeadStage(lead.id, newStage);
    });
  }

  function handleQuickConvert() {
    if (confirm(`Convert lead "${lead.title}" to an active Client record?`)) {
      startTransition(async () => {
        await convertToClient(lead.id, {
          client_name: lead.title,
          create_project: true,
          project_name: lead.title,
          project_budget: lead.proposal_amount ?? lead.expected_value ?? undefined,
        });
      });
    }
  }

  return (
    <div className="group p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-3">
      {/* Top row: Title and external link */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
            {lead.title}
          </h4>
          {linkedClient && (
            <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 truncate">
              👤 {linkedClient.name}
            </p>
          )}
        </div>

        {lead.url && (
          <a
            href={lead.url}
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
            title="Open listing URL"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Financial info & Source */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        {val != null ? (
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <span>{val.toLocaleString()}</span>
            <span className="text-[10px] font-medium text-zinc-400">EGP</span>
          </span>
        ) : (
          <span className="text-zinc-400 text-[11px]">No estimate</span>
        )}

        {lead.source && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {lead.source}
          </span>
        )}
      </div>

      {/* Next Follow Up tag (if set) */}
      {lead.next_follow_up_at && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
          <Calendar className="h-3 w-3" />
          <span>Follow-up: {lead.next_follow_up_at.split("T")[0]}</span>
        </div>
      )}

      {/* Stage Dropdown (instant update) */}
      <div className="pt-1">
        <CustomSelect
          value={lead.stage}
          onChange={handleStageChange}
          options={stageOptions}
          className="text-xs"
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          onClick={() => onOpenTimeline(lead)}
          className="flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
          title={t.leads.timeline}
        >
          <History className="h-3.5 w-3.5" />
          <span>{t.leads.timeline}</span>
        </button>

        <div className="flex items-center gap-1">
          {/* Eye Icon for full Lead Dossier */}
          <button
            onClick={() => onViewDetails(lead)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            title={t.common.viewDetails}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          {/* Convert to Client button for won/active leads */}
          {!linkedClient && (lead.stage === "won" || lead.stage === "in_progress" || lead.stage === "delivered" || lead.stage === "paid") && (
            <button
              disabled={isPending}
              onClick={handleQuickConvert}
              className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              title={t.leads.convertToClient}
            >
              <UserCheck className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={t.common.edit}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            disabled={isPending}
            onClick={() => {
              if (confirm(`${t.common.confirmDelete} "${lead.title}"?`)) {
                startTransition(async () => {
                  await deleteLead(lead.id);
                });
              }
            }}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title={t.common.delete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
