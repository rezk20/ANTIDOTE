"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FolderSidebar } from "./folder-sidebar";
import { NoteCard } from "./note-card";
import { NoteDetailModal } from "./note-detail-modal";
import { useLocale } from "@/components/providers/locale-provider";
import {
  FileText,
  Plus,
  Search,
  Pin,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { NoteRow } from "@/lib/supabase/types";
import type { FolderCount, TagCount } from "@/lib/dal/notes";

const NOTES_PER_PAGE = 8;

export function NotesView({
  notes = [],
  folderCounts = [],
  tags = [],
}: {
  notes: NoteRow[];
  folderCounts: FolderCount[];
  tags: TagCount[];
}) {
  const { t, isRtl } = useLocale();

  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteRow | null>(null);

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  // Client-side filtering for fast responsive typing
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Folder filter
      if (selectedFolder === "archive") {
        if (!n.archived) return false;
      } else if (selectedFolder !== "all") {
        if (n.archived) return false;
        if (n.folder !== selectedFolder) return false;
      } else {
        if (n.archived) return false;
      }

      // Tag filter
      if (selectedTag) {
        const noteTags = (n.tags as string[]) || [];
        if (!noteTags.includes(selectedTag)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesTags = (n.tags as string[]).some((tag) =>
          tag.toLowerCase().includes(q),
        );
        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }

      return true;
    });
  }, [notes, selectedFolder, selectedTag, searchQuery]);

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);
  const totalActiveCount = notes.filter((n) => !n.archived).length;

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(unpinnedNotes.length / NOTES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * NOTES_PER_PAGE;
  const endIndex = Math.min(startIndex + NOTES_PER_PAGE, unpinnedNotes.length);
  const paginatedUnpinnedNotes = unpinnedNotes.slice(startIndex, endIndex);

  function handleViewDetails(note: NoteRow) {
    setSelectedNote(note);
    setIsDetailOpen(true);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {t.notesPage.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t.notesPage.subtitle}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/notes/new"
          className="flex items-center justify-center rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white gap-2 px-4 py-2.5 text-xs shrink-0 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.notesPage.newNote}</span>
        </Link>
      </div>

      {/* Main Grid: Left Folders Sidebar (1 col) + Right Notes Area (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar: 13 Folders */}
        <div className="lg:col-span-1 space-y-4">
          <FolderSidebar
            folderCounts={folderCounts}
            selectedFolder={selectedFolder}
            onSelectFolder={(folder) => {
              setSelectedFolder(folder);
              setSelectedTag(null);
              setCurrentPage(1);
            }}
            totalActiveCount={totalActiveCount}
          />

          {/* Tag Cloud Filter */}
          {tags.length > 0 && (
            <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{t.notesPage.tags}</span>
                </span>
                {selectedTag && (
                  <button
                    onClick={() => {
                      setSelectedTag(null);
                      setCurrentPage(1);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline capitalize font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {tags.slice(0, 15).map(({ tag, count }) => {
                  const isTagSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(isTagSelected ? null : tag);
                        setCurrentPage(1);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isTagSelected
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <span>#{tag}</span>
                      <span className="text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Search & Notes Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`${t.common.search} ${t.nav.notes.toLowerCase()}...`}
              className="w-full ps-11 pe-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 shadow-xs"
            />
          </div>

          {/* 1. Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Pin className="h-3.5 w-3.5 fill-amber-500 rotate-45" />
                <span>{t.notesPage.pinnedNotes} ({pinnedNotes.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 2. All Filtered Notes Section */}
          <div className="space-y-3">
            {pinnedNotes.length > 0 && (
              <div className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                {selectedFolder === "archive" ? t.notesPage.archivedNotes : t.notesPage.allNotes} ({unpinnedNotes.length})
              </div>
            )}

            {filteredNotes.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
                <p className="text-sm font-bold text-zinc-500">
                  {t.notesPage.noNotesTitle}
                </p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {t.notesPage.noNotesDesc}
                </p>
                <Link
                  href="/notes/new"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  {t.notesPage.newNote}
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedUnpinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-500">
                    <div>
                      <span>
                        {t.notesPage.showingNotes} {startIndex + 1}–{endIndex} / {unpinnedNotes.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={safeCurrentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title={t.notesPage.previousPage}
                      >
                        <PrevIcon className="h-4 w-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isCurrent = pageNum === safeCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        disabled={safeCurrentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title={t.notesPage.nextPage}
                      >
                        <NextIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Note Detail Reader Modal ("Eye" Action) */}
      <NoteDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}
