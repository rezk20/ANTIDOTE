"use client";

import { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { togglePinNote, toggleArchiveNote, deleteNote } from "@/lib/actions/notes";
import { extractMarkdownSnippet, calculateMarkdownStats } from "@/lib/logic/markdown";
import { useLocale } from "@/components/providers/locale-provider";
import { FOLDER_ICONS, getFolderLabel } from "./folder-sidebar";
import {
  Pin,
  Archive,
  Trash2,
  Eye,
  Edit,
  Clock,
  Tag,
  FileText,
} from "lucide-react";
import type { NoteRow } from "@/lib/supabase/types";

export function NoteCard({
  note,
  onViewDetails,
}: {
  note: NoteRow;
  onViewDetails: (note: NoteRow) => void;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const snippet = extractMarkdownSnippet(note.content, 120);
  const stats = calculateMarkdownStats(note.content);
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });
  const folderIcon = FOLDER_ICONS[note.folder] || <FileText className="h-3.5 w-3.5" />;

  return (
    <div
      className={`group relative p-5 rounded-3xl border transition-all space-y-3.5 flex flex-col justify-between shadow-xs ${
        note.pinned
          ? "bg-amber-50/20 dark:bg-amber-950/10 border-amber-200/80 dark:border-amber-900/40 hover:border-amber-300"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      <div className="space-y-2.5">
        {/* Header: Folder Badge & Pin / Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold">
            {folderIcon}
            <span>{getFolderLabel(note.folder, t)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await togglePinNote(note.id, !note.pinned);
                });
              }}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                note.pinned
                  ? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/50"
                  : "text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-400 opacity-60 group-hover:opacity-100"
              }`}
              title={note.pinned ? t.notesPage.unpinNote : t.notesPage.pinNote}
            >
              <Pin className={`h-3.5 w-3.5 ${note.pinned ? "fill-amber-500 rotate-45" : ""}`} />
            </button>

            <button
              onClick={() => onViewDetails(note)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              title={t.common.viewDetails}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/notes/${note.id}`}
          className="block space-y-1 cursor-pointer"
        >
          <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {note.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
            {snippet || <span className="italic text-zinc-400">Empty note</span>}
          </p>
        </Link>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400"
              >
                <Tag className="h-2.5 w-2.5 text-zinc-400" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Stats, Time ago, Archive/Delete */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{stats.readingTimeMinutes}m</span>
          </span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>

        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/notes/${note.id}`}
            className="p-1 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors cursor-pointer"
            title={t.notesPage.editNote}
          >
            <Edit className="h-3.5 w-3.5" />
          </Link>

          <button
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await toggleArchiveNote(note.id, !note.archived);
              });
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title={note.archived ? t.notesPage.unarchiveNote : t.notesPage.archiveNote}
          >
            <Archive className="h-3.5 w-3.5" />
          </button>

          <button
            disabled={isPending}
            onClick={() => {
              if (window.confirm(t.common.confirmDelete)) {
                startTransition(async () => {
                  await deleteNote(note.id);
                });
              }
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
            title={t.notesPage.deleteNote}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
