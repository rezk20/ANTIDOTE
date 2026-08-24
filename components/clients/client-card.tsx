"use client";

import { useTransition } from "react";
import { deleteClient } from "@/lib/actions/clients";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import {
  parseContacts,
  parseScheduledActions,
} from "./client-detail-modal";
import {
  Building2,
  Calendar,
  FolderKanban,
  Edit2,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";
import type { ClientRow, ProjectRow } from "@/lib/supabase/types";

export function ClientCard({
  client,
  projects = [],
  onEdit,
  onViewDetails,
}: {
  client: ClientRow;
  projects?: ProjectRow[];
  onEdit: (client: ClientRow) => void;
  onViewDetails: (client: ClientRow) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const linkedProjects = projects.filter((p) => p.client_id === client.id);
  const contacts = parseContacts(client.contact);
  const scheduledActions = parseScheduledActions(client.next_action);

  const statusVariant =
    client.status === "active"
      ? "success"
      : client.status === "past"
        ? "secondary"
        : "outline";

  return (
    <div className="group p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4">
      {/* Header: Name, Company, Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {client.name}
            </h3>
            <Badge variant={statusVariant} className="text-[10px] py-0 px-2 font-bold uppercase">
              {client.status}
            </Badge>
          </div>

          {client.company && (
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>{client.company}</span>
            </p>
          )}
        </div>

        {client.source && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
            {client.source}
          </span>
        )}
      </div>

      {/* Contact Channels Chips */}
      {contacts.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {contacts.map((c, i) => (
            <span
              key={i}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 flex items-center gap-1"
            >
              <span className="opacity-70 text-[10px] uppercase font-extrabold">{c.channel}:</span>
              <span className="truncate max-w-[140px]">{c.value}</span>
            </span>
          ))}
        </div>
      )}

      {/* Scheduled Actions List */}
      {scheduledActions.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs">
          <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{t.clients.scheduledActions} ({scheduledActions.length})</span>
          </span>
          <div className="space-y-1">
            {scheduledActions.slice(0, 2).map((act, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-zinc-700 dark:text-zinc-300">
                <span className="truncate font-medium">• {act.text}</span>
                {act.date && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 shrink-0">{act.date}</span>
                )}
              </div>
            ))}
            {scheduledActions.length > 2 && (
              <span className="text-[10px] text-zinc-400 font-bold block">
                +{scheduledActions.length - 2} {isRtl ? "مهمات أخرى..." : "more..."}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Linked Projects List */}
      <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
          <span className="flex items-center gap-1.5">
            <FolderKanban className="h-3.5 w-3.5" />
            <span>{t.clients.linkedProjects} ({linkedProjects.length})</span>
          </span>
        </div>

        {linkedProjects.length > 0 ? (
          <div className="space-y-1.5">
            {linkedProjects.slice(0, 2).map((p) => (
              <div
                key={p.id}
                className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs"
              >
                <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{p.name}</span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {p.budget != null ? `${p.budget.toLocaleString()} EGP` : p.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-zinc-400 italic">{t.clients.noProjectsLinked}</p>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
          {client.follow_up_date && (
            <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300">
              <Calendar className="h-3 w-3" />
              <span>{client.follow_up_date}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Eye Icon for Detail View */}
          <button
            onClick={() => onViewDetails(client)}
            className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
            title={t.common.viewDetails}
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => onEdit(client)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={t.common.edit}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            disabled={isPending}
            onClick={() => {
              if (confirm(`${t.common.confirmDelete} "${client.name}"? ${t.common.safeDeleteNotice}`)) {
                startTransition(async () => {
                  await deleteClient(client.id);
                });
              }
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title={t.common.delete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
