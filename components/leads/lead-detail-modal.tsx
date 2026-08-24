"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Briefcase,
  DollarSign,
  Calendar,
  History,
  FileText,
  Building2,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { LeadRow, ClientRow } from "@/lib/supabase/types";

export function LeadDetailModal({
  isOpen,
  onClose,
  lead,
  clients = [],
  onEdit,
  onOpenTimeline,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadRow | null;
  clients?: ClientRow[];
  onEdit?: () => void;
  onOpenTimeline?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !lead) return null;

  const linkedClient = clients.find((c) => c.id === lead.client_id);
  const prob = Number(lead.probability ?? 0.5);
  const val = Number(lead.proposal_amount ?? lead.expected_value ?? 0);
  const weighted = val * prob;

  const chips: DetailChip[] = [
    {
      label: t.leads.stage,
      value: lead.stage.toUpperCase(),
      variant: lead.stage === "won" ? "emerald" : lead.stage === "lost" ? "rose" : "purple",
    },
    {
      label: t.leads.expectedValue,
      value: val > 0 ? `${val.toLocaleString()} EGP` : (isRtl ? "غير محدد" : "Unset"),
      variant: "emerald",
      icon: <DollarSign className="h-3 w-3" />,
    },
    {
      label: t.leads.probability,
      value: `${Math.round(prob * 100)}% (Weighted: ${Math.round(weighted).toLocaleString()} EGP)`,
      variant: "blue",
      icon: <TrendingUp className="h-3 w-3" />,
    },
    {
      label: t.leads.source,
      value: lead.source || (isRtl ? "غير محدد" : "Unset"),
      variant: "default",
    },
    {
      label: t.leads.followUpDate,
      value: lead.next_follow_up_at?.split("T")[0] || (isRtl ? "لا توجد متابعة" : "None"),
      variant: lead.next_follow_up_at ? "amber" : "default",
      icon: <Calendar className="h-3 w-3" />,
    },
  ];

  const sections: DetailSection[] = [
    {
      title: t.leads.notes,
      icon: <FileText className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <div className="space-y-3">
          {lead.notes ? (
            <p className="whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
          ) : (
            <p className="text-zinc-400 italic">{t.common.noNotes}</p>
          )}

          {lead.proposal_notes && (
            <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-1">
              <span className="font-bold text-purple-900 dark:text-purple-300 block">
                {t.leads.proposalNotes}:
              </span>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {lead.proposal_notes}
              </p>
            </div>
          )}

          {lead.lost_reason && (
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-1 text-rose-800 dark:text-rose-300">
              <span className="font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{t.leads.lostReason}:</span>
              </span>
              <p>{lead.lost_reason}</p>
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60 text-xs">
            {linkedClient && (
              <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                <Building2 className="h-3.5 w-3.5" />
                <span>{t.clients.title}: {linkedClient.name}</span>
              </span>
            )}
            {lead.url && (
              <a
                href={lead.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>{t.leads.url}</span>
              </a>
            )}
          </div>
        </div>
      ),
    },
  ];

  if (onOpenTimeline) {
    sections.push({
      title: t.leads.timeline,
      icon: <History className="h-3.5 w-3.5 text-purple-500" />,
      content: (
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 dark:text-zinc-400">
            {isRtl ? "سجل كافة التفاعلات والمكالمات والدفعات المسجلة للفرصة." : "Full log of touches, calls, proposals, and payments."}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              onClose();
              onOpenTimeline();
            }}
            className="gap-1.5 rounded-xl font-bold"
          >
            <History className="h-3.5 w-3.5" />
            <span>{t.leads.timeline}</span>
          </Button>
        </div>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={lead.title}
      subtitle={t.leads.leadDetails}
      icon={<Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
      badge={
        <Badge variant={lead.stage === "won" ? "success" : lead.stage === "lost" ? "danger" : "default"} className="text-xs font-bold uppercase">
          {lead.stage}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.leads.editLead}
    />
  );
}
