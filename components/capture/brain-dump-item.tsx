"use client";

import { useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Archive } from "lucide-react";
import { deleteDump, archiveDump } from "@/lib/actions/brain-dump";
import type { BrainDumpRow } from "@/lib/supabase/types";

export function BrainDumpItem({ dump }: { dump: BrainDumpRow }) {
  const [isPending, startTransition] = useTransition();

  const timeAgo = formatDistanceToNow(new Date(dump.created_at), {
    addSuffix: true,
  });

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      <div className="space-y-1 flex-1">
        <p className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap leading-relaxed">
          {dump.content}
        </p>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
          Captured {timeAgo}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await archiveDump(dump.id);
            });
          }}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
          className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          title="Delete dump"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
