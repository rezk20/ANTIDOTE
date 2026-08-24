"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Users2,
  Building2,
  Calendar,
  FolderKanban,
  FileText,
  Clock,
  MessageSquare,
} from "lucide-react";
import type { ClientRow, ProjectRow } from "@/lib/supabase/types";

export interface ContactChannel {
  channel: string;
  value: string;
}

export interface ScheduledAction {
  text: string;
  date?: string;
  done?: boolean;
}

export function parseContacts(contactStr: string | null | undefined): ContactChannel[] {
  if (!contactStr) return [];
  try {
    const parsed = JSON.parse(contactStr);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // If stored as comma or newline separated plain text
    return contactStr
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((val) => ({ channel: "contact", value: val }));
  }
  return [];
}

export function parseScheduledActions(nextActionStr: string | null | undefined): ScheduledAction[] {
  if (!nextActionStr) return [];
  try {
    const parsed = JSON.parse(nextActionStr);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return nextActionStr
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({ text }));
  }
  return [];
}

export function ClientDetailModal({
  isOpen,
  onClose,
  client,
  projects = [],
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  client: ClientRow | null;
  projects?: ProjectRow[];
  onEdit?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !client) return null;

  const linkedProjects = projects.filter((p) => p.client_id === client.id);
  const contacts = parseContacts(client.contact);
  const scheduledActions = parseScheduledActions(client.next_action);

  const chips: DetailChip[] = [
    {
      label: t.common.status,
      value: client.status.toUpperCase(),
      variant: client.status === "active" ? "emerald" : "default",
    },
    {
      label: t.clients.company,
      value: client.company || (isRtl ? "شخصي / فردي" : "Individual"),
      icon: <Building2 className="h-3 w-3" />,
    },
    {
      label: t.clients.paymentStatus,
      value: (client.payment_status || "none").toUpperCase(),
      variant: client.payment_status === "paid" ? "emerald" : client.payment_status === "pending" ? "amber" : "default",
    },
    {
      label: t.clients.source,
      value: client.source || (isRtl ? "غير محدد" : "Unset"),
      variant: "default",
    },
    {
      label: t.clients.followUpDate,
      value: client.follow_up_date || (isRtl ? "بدون موعد" : "None"),
      variant: client.follow_up_date ? "amber" : "default",
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      label: t.clients.linkedProjects,
      value: `${linkedProjects.length} ${isRtl ? "مشاريع" : "projects"}`,
      variant: "purple",
      icon: <FolderKanban className="h-3 w-3" />,
    },
  ];

  const sections: DetailSection[] = [];

  // Contact channels section
  if (contacts.length > 0) {
    sections.push({
      title: t.clients.contacts,
      icon: <MessageSquare className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 block">
                  {c.channel}
                </span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate block">
                  {c.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      ),
    });
  }

  // Scheduled actions section
  if (scheduledActions.length > 0) {
    sections.push({
      title: t.clients.scheduledActions,
      icon: <Clock className="h-3.5 w-3.5 text-amber-500" />,
      content: (
        <div className="space-y-2">
          {scheduledActions.map((act, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3"
            >
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                • {act.text}
              </span>
              {act.date && (
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg shrink-0">
                  {act.date}
                </span>
              )}
            </div>
          ))}
        </div>
      ),
    });
  }

  // Linked projects section
  sections.push({
    title: t.clients.linkedProjects,
    icon: <FolderKanban className="h-3.5 w-3.5 text-purple-500" />,
    content: (
      <div className="space-y-2">
        {linkedProjects.length === 0 ? (
          <p className="text-zinc-400 italic py-2">{t.clients.noProjectsLinked}</p>
        ) : (
          linkedProjects.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                  {p.name}
                </span>
                {p.budget != null && (
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                    {p.budget.toLocaleString()} EGP
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-[10px] font-bold uppercase shrink-0">
                {p.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    ),
  });

  // Relationship notes
  if (client.notes) {
    sections.push({
      title: t.clients.notes,
      icon: <FileText className="h-3.5 w-3.5 text-zinc-400" />,
      content: (
        <p className="whitespace-pre-wrap leading-relaxed">{client.notes}</p>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={client.name}
      subtitle={t.clients.clientDetails}
      icon={<Users2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      badge={
        <Badge variant={client.status === "active" ? "success" : "default"} className="text-xs font-bold uppercase">
          {client.status}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.clients.editClient}
    />
  );
}
