"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { LeadRow } from "@/lib/supabase/types";

export function ClientFollowupCard({ lead }: { lead: LeadRow | null }) {
  const { t, isRtl } = useLocale();

  const value = lead?.expected_value ?? lead?.proposal_amount;

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t.dashboard.followupCardTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.dashboard.followupCardSubtitle}
              </p>
            </div>
          </div>

          {lead && (
            <Badge
              variant="outline"
              className="py-0.5 text-[10px] font-bold uppercase"
            >
              {lead.stage}
            </Badge>
          )}
        </div>

        {/* Lead Details */}
        {!lead ? (
          <div className="space-y-1 p-4 text-center">
            <Sparkles className="mx-auto h-5 w-5 text-emerald-500" />
            <p className="text-xs text-zinc-400 italic">
              {t.dashboard.noFollowups}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800">
            <div className="space-y-1">
              <h4 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {lead.title}
              </h4>
              <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                {lead.notes ||
                  (isRtl ? "تواصل ومتابعة العرض" : "Follow-up touchpoint")}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200/50 pt-1.5 text-[11px] text-zinc-400 dark:border-zinc-800">
              {value != null && (
                <span className="flex items-center gap-0.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-3 w-3" />
                  <span>{Number(value).toLocaleString()} EGP</span>
                </span>
              )}

              {lead.next_follow_up_at && (
                <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                  <Calendar className="h-3 w-3" />
                  <span>{lead.next_follow_up_at.slice(0, 10)}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
        <Link
          href="/freelance"
          className="flex items-center justify-between text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>{t.dashboard.viewPipeline}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
