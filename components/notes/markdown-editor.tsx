"use client";

import { useState, useRef } from "react";
import { MarkdownRenderer } from "./markdown-renderer";
import { calculateMarkdownStats } from "@/lib/logic/markdown";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
  Quote,
  Eye,
  Edit3,
  Clock,
} from "lucide-react";

export function MarkdownEditor({
  value = "",
  onChange,
  placeholder,
  minHeight = "280px",
  defaultTab = "edit",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  defaultTab?: "edit" | "preview";
}) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">(defaultTab);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = calculateMarkdownStats(value);

  function insertFormatting(
    prefix: string,
    suffix: string = "",
    defaultText: string = "",
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end) || defaultText;

    const before = value.slice(0, start);
    const after = value.slice(end);

    const newContent = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newContent);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      );
    }, 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      insertFormatting("**", "**", "bold text");
    } else if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      insertFormatting("*", "*", "italic text");
    }
  }

  return (
    <div className="space-y-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/60">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting("# ", "", "Heading 1")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting("## ", "", "Heading 2")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700" />

          <button
            type="button"
            onClick={() => insertFormatting("**", "**", "bold text")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting("*", "*", "italic text")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700" />

          <button
            type="button"
            onClick={() => insertFormatting("- ", "", "List item")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting("- [ ] ", "", "Checklist task")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Checklist"
          >
            <CheckSquare className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              insertFormatting("```\n", "\n```", "const code = true;")
            }
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting("> ", "", "Important takeaway")}
            className="cursor-pointer rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-200 p-0.5 text-xs font-bold dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              activeTab === "edit"
                ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{t.notesPage.editTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              activeTab === "preview"
                ? "bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t.notesPage.previewTab}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t.notesPage.contentPlaceholder}
          style={{ minHeight }}
          className="w-full resize-y bg-white p-4 font-mono text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden dark:bg-zinc-900 dark:text-zinc-100"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="overflow-y-auto bg-zinc-50/50 p-4 dark:bg-zinc-950/40"
        >
          <MarkdownRenderer content={value} />
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/40">
        <div className="flex items-center gap-3">
          <span>
            {stats.wordCount} {t.notesPage.wordCount}
          </span>
          <span>•</span>
          <span>{stats.charCount} chars</span>
        </div>

        <div className="flex items-center gap-1 font-medium">
          <Clock className="h-3 w-3" />
          <span>
            {stats.readingTimeMinutes} {t.notesPage.readingTime}
          </span>
        </div>
      </div>
    </div>
  );
}
