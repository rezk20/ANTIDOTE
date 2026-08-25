"use client";

import { useState, useTransition } from "react";
import { createNote, updateNote } from "@/lib/actions/notes";
import { MarkdownEditor } from "./markdown-editor";
import { NOTE_FOLDERS } from "@/lib/schemas/notes";
import { getFolderLabel } from "./folder-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/locale-provider";
import {
  X,
  FileText,
  Pin,
  Tag,
  Folder,
} from "lucide-react";
import type { NoteRow } from "@/lib/supabase/types";

export function NoteModal({
  isOpen,
  onClose,
  noteToEdit,
  defaultFolder = "inbox",
}: {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: NoteRow | null;
  defaultFolder?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <NoteModalInnerForm
          key={noteToEdit?.id ?? "new"}
          onClose={onClose}
          noteToEdit={noteToEdit}
          defaultFolder={defaultFolder}
        />
      </div>
    </div>
  );
}

function NoteModalInnerForm({
  onClose,
  noteToEdit,
  defaultFolder = "inbox",
}: {
  onClose: () => void;
  noteToEdit?: NoteRow | null;
  defaultFolder?: string;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!noteToEdit;

  const [title, setTitle] = useState(noteToEdit?.title || "");
  const [folder, setFolder] = useState(() => {
    if (noteToEdit?.folder) return noteToEdit.folder;
    return defaultFolder === "all" || defaultFolder === "archive" ? "inbox" : defaultFolder;
  });
  const [content, setContent] = useState(noteToEdit?.content || "");
  const [tags, setTags] = useState<string[]>((noteToEdit?.tags as string[]) || []);
  const [tagInput, setTagInput] = useState("");
  const [pinned, setPinned] = useState(noteToEdit?.pinned || false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    setTags(tags.filter((tItem) => tItem !== tagToRemove));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg(t.notesPage.noteTitlePlaceholder);
      return;
    }

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("folder", folder);
    formData.set("content", content);
    formData.set("tags", JSON.stringify(tags));
    formData.set("pinned", String(pinned));
    formData.set("archived", String(noteToEdit?.archived || false));

    startTransition(async () => {
      const res = isEdit
        ? await updateNote(noteToEdit.id, { ok: false }, formData)
        : await createNote({ ok: false }, formData);

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.message || "Failed to save note.");
      }
    });
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isEdit ? t.notesPage.editNote : t.notesPage.newNote}
            </h2>
            <p className="text-xs text-zinc-400">
              {isEdit ? noteToEdit.title : t.notesPage.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {errorMsg}
          </div>
        )}

        {/* Title & Pinned */}
        <div className="space-y-1">
          <Label htmlFor="note_title" className="text-xs font-bold">
            {t.notesPage.noteTitle} *
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="note_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.notesPage.noteTitlePlaceholder}
              className="text-sm font-bold rounded-xl"
              autoFocus
            />

            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold ${
                pinned
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                  : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
              }`}
              title={pinned ? t.notesPage.unpinNote : t.notesPage.pinNote}
            >
              <Pin className={`h-4 w-4 ${pinned ? "fill-white rotate-45" : ""}`} />
              <span>{pinned ? "Pinned" : "Pin"}</span>
            </button>
          </div>
        </div>

        {/* Folder Selector & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Folder className="h-3.5 w-3.5 text-indigo-500" />
              <span>{t.notesPage.folder}</span>
            </Label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 cursor-pointer"
            >
              {NOTE_FOLDERS.filter((f) => f !== "archive").map((fKey) => (
                <option key={fKey} value={fKey}>
                  {getFolderLabel(fKey, t)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Tag className="h-3.5 w-3.5 text-amber-500" />
              <span>{t.notesPage.tags}</span>
            </Label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={t.notesPage.tagsPlaceholder}
              className="text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Tag Chips */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Markdown Content Editor */}
        <div className="space-y-1">
          <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {t.notesPage.content}
          </Label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            minHeight="240px"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="rounded-xl text-xs font-bold"
          >
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isEdit ? t.common.save : t.notesPage.newNote}
          </Button>
        </div>
      </form>
    </>
  );
}
