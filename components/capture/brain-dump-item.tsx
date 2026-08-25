"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Archive, Wand2, CheckCircle2 } from "lucide-react";
import { deleteDump, archiveDump } from "@/lib/actions/brain-dump";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import type { BrainDumpRow } from "@/lib/supabase/types";

export function BrainDumpItem({
  dump,
  onConvert,
}: {
  dump: BrainDumpRow;
  onConvert?: (dump: BrainDumpRow) => void;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const timeAgo = formatDistanceToNow(new Date(dump.created_at), {
    addSuffix: true,
  });

  const isConverted = dump.status === "converted";

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
        isConverted
          ? "bg-purple-50/20 dark:bg-purple-950/10 border-purple-200/60 dark:border-purple-900/40"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs"
      }`}
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isConverted && (
            <Badge variant="accent" className="text-[10px] uppercase font-bold py-0 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{t.conversions.convertedBadge} → {dump.converted_type}</span>
            </Badge>
          )}

          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap leading-relaxed">
            {dump.content}
          </p>
        </div>

        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
          Captured {timeAgo}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center shrink-0">
        {/* Convert Action Button */}
        {onConvert && !isConverted && (
          <button
            onClick={() => onConvert(dump)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title={t.conversions.convertTitle}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>{t.conversions.convertTitle}</span>
          </button>
        )}

        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await archiveDump(dump.id);
            });
          }}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Archive dump"
        >
          <Archive className="h-4 w-4" />
        </button>

        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await deleteDump(dump.id);
            });
          }}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          title="Delete dump"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
