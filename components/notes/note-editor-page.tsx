"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
  toggleArchiveNote,
} from "@/lib/actions/notes";
import { MarkdownEditor } from "./markdown-editor";
import { NOTE_FOLDERS } from "@/lib/schemas/notes";
import { getFolderLabel } from "./folder-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/locale-provider";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Pin,
  Archive,
  Trash2,
  Tag,
  Folder,
  X,
  Check,
} from "lucide-react";
import type { NoteRow } from "@/lib/supabase/types";

export function NoteEditorPage({
  initialNote,
  isNew = false,
}: {
  initialNote?: NoteRow | null;
  isNew?: boolean;
}) {
  const { t, isRtl } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialNote?.title || "");
  const [folder, setFolder] = useState(initialNote?.folder || "inbox");
  const [content, setContent] = useState(initialNote?.content || "");
  const [tags, setTags] = useState<string[]>(
    (initialNote?.tags as string[]) || [],
  );
  const [tagInput, setTagInput] = useState("");
  const [pinned, setPinned] = useState(initialNote?.pinned || false);
  const [archived, setArchived] = useState(initialNote?.archived || false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  function handleSave() {
    if (!title.trim()) {
      setErrorMsg(t.notesPage.noteTitlePlaceholder);
      return;
    }

    setErrorMsg(null);
    setSaveStatus("saving");

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("folder", folder);
    formData.set("content", content);
    formData.set("tags", JSON.stringify(tags));
    formData.set("pinned", String(pinned));
    formData.set("archived", String(archived));

    startTransition(async () => {
      const res = isNew
        ? await createNote({ ok: false }, formData)
        : await updateNote(initialNote!.id, { ok: false }, formData);

      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);

        if (isNew && res.noteId) {
          router.push(`/notes/${res.noteId}`);
        }
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save note.");
      }
    });
  }

  function handleDelete() {
    if (!initialNote) return;
    if (window.confirm(t.common.confirmDelete)) {
      startTransition(async () => {
        await deleteNote(initialNote.id);
        router.push("/notes");
      });
    }
  }

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-6 duration-150">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Back Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <BackIcon className="h-4 w-4" />
            <span>{t.nav.notes}</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />

          <span className="max-w-50 truncate text-xs font-bold text-zinc-400 sm:max-w-xs">
            {isNew ? t.notesPage.newNote : title || t.notesPage.noteDetails}
          </span>
        </div>

        {/* Action Controls: Pin, Archive, Delete, Save */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {!isNew && (
            <>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const nextPinned = !pinned;
                  setPinned(nextPinned);
                  startTransition(async () => {
                    await togglePinNote(initialNote!.id, nextPinned);
                  });
                }}
                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition-all ${
                  pinned
                    ? "border-amber-500 bg-amber-500 text-white shadow-xs"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
                title={pinned ? t.notesPage.unpinNote : t.notesPage.pinNote}
              >
                <Pin
                  className={`h-4 w-4 ${pinned ? "rotate-45 fill-white" : ""}`}
                />
                <span className="hidden sm:inline">
                  {pinned ? "Pinned" : "Pin"}
                </span>
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const nextArchived = !archived;
                  setArchived(nextArchived);
                  startTransition(async () => {
                    await toggleArchiveNote(initialNote!.id, nextArchived);
                  });
                }}
                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition-all ${
                  archived
                    ? "border-zinc-800 bg-zinc-800 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
                title={
                  archived ? t.notesPage.unarchiveNote : t.notesPage.archiveNote
                }
              >
                <Archive className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {archived ? "Archived" : "Archive"}
                </span>
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="cursor-pointer rounded-xl p-2 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                title={t.notesPage.deleteNote}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isPending || saveStatus === "saving"}
            className="gap-1.5 rounded-xl bg-amber-600 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
          >
            {saveStatus === "saved" ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{t.common.save}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Main Note Canvas */}
      <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Title Input */}
        <div className="space-y-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.notesPage.noteTitlePlaceholder}
            className="rounded-2xl border-zinc-200 py-3 text-xl font-black sm:text-2xl dark:border-zinc-800"
            autoFocus={isNew}
          />
        </div>

        {/* Metadata Controls: Folder Select & Tag Input */}
        <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Folder className="h-3.5 w-3.5 text-indigo-500" />
              <span>{t.notesPage.folder}</span>
            </Label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-zinc-800 focus:ring-2 focus:ring-amber-500/40 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {NOTE_FOLDERS.filter((f) => f !== "archive").map((fKey) => (
                <option key={fKey} value={fKey}>
                  {getFolderLabel(fKey, t)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Tag className="h-3.5 w-3.5 text-amber-500" />
              <span>{t.notesPage.tags}</span>
            </Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={t.notesPage.tagsPlaceholder}
              className="rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Tags list */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="cursor-pointer transition-colors hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Markdown Content Editor */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {t.notesPage.content}
          </Label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            minHeight="420px"
            defaultTab={isNew ? "edit" : "preview"}
          />
        </div>
      </div>
    </div>
  );
}
