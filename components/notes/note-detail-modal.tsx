"use client";

import { useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MarkdownRenderer } from "./markdown-renderer";
import { calculateMarkdownStats } from "@/lib/logic/markdown";
import { togglePinNote, toggleArchiveNote, deleteNote } from "@/lib/actions/notes";
import { useLocale } from "@/components/providers/locale-provider";
import { FOLDER_ICONS, getFolderLabel } from "./folder-sidebar";
import {
  X,
  Edit,
  Pin,
  Archive,
  Trash2,
  Clock,
  Tag,
  Calendar,
} from "lucide-react";
import type { NoteRow } from "@/lib/supabase/types";

export function NoteDetailModal({
  isOpen,
  onClose,
  note,
}: {
  isOpen: boolean;
  onClose: () => void;
  note: NoteRow | null;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  if (!isOpen || !note) return null;

  const stats = calculateMarkdownStats(note.content);
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });
  const folderIcon = FOLDER_ICONS[note.folder] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold">
              {folderIcon}
              <span>{getFolderLabel(note.folder, t)}</span>
            </div>

            {note.pinned && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Pin className="h-3 w-3 fill-amber-500 rotate-45" />
                <span>Pinned</span>
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1">
            <button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await togglePinNote(note.id, !note.pinned);
                });
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={note.pinned ? t.notesPage.unpinNote : t.notesPage.pinNote}
            >
              <Pin className={`h-4 w-4 ${note.pinned ? "fill-amber-500 rotate-45" : ""}`} />
            </button>

            <button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await toggleArchiveNote(note.id, !note.archived);
                });
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={note.archived ? t.notesPage.unarchiveNote : t.notesPage.archiveNote}
            >
              <Archive className="h-4 w-4" />
            </button>

            <Link
              href={`/notes/${note.id}`}
              className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={t.notesPage.editNote}
            >
              <Edit className="h-4 w-4" />
            </Link>

            <button
              disabled={isPending}
              onClick={() => {
                if (window.confirm(t.common.confirmDelete)) {
                  startTransition(async () => {
                    await deleteNote(note.id);
                    onClose();
                  });
                }
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title={t.notesPage.deleteNote}
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700 mx-1" />

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Note Title & Meta */}
          <div className="space-y-3 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {note.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{stats.readingTimeMinutes} {t.notesPage.readingTime} ({stats.wordCount} {t.notesPage.wordCount})</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated {timeAgo}</span>
              </span>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold"
                  >
                    <Tag className="h-3 w-3 text-zinc-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rendered Markdown Body */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <MarkdownRenderer content={note.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
