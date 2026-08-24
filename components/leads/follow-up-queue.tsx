"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import { Clock, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import type { LeadRow } from "@/lib/supabase/types";

export function FollowUpQueue({
  leads,
  onOpenLead,
}: {
  leads: LeadRow[];
  onOpenLead: (lead: LeadRow) => void;
}) {
  const { t, isRtl } = useLocale();

  if (leads.length === 0) {
    return (
      <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs flex items-center gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {t.leads.noFollowUps}
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
        <Clock className="h-4 w-4 shrink-0" />
        <span>{t.leads.followUpQueue} ({leads.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {leads.map((lead) => {
          const followUpDate = lead.next_follow_up_at
            ? parseISO(lead.next_follow_up_at)
            : null;
          const isOverdue = followUpDate ? isPast(followUpDate) : false;
          const timeText = followUpDate
            ? formatDistanceToNow(followUpDate, { addSuffix: true })
            : "";

          return (
            <div
              key={lead.id}
              onClick={() => onOpenLead(lead)}
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-100 dark:border-amber-900/50 shadow-2xs hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOverdue
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {isOverdue ? (isRtl ? "مستحق الآن" : "Overdue") : (isRtl ? "قريباً" : "Upcoming")}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {timeText}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {lead.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                  <Calendar className="h-3 w-3" />
                  <span>{lead.next_follow_up_at?.split("T")[0]}</span>
                </span>
                <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-bold">
                  <span>{isRtl ? "فتح" : "Review"}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
