"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { QuickCaptureBox } from "./quick-capture-box";
import { useLocale } from "@/components/providers/locale-provider";

export function QuickCaptureModal() {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key.toLowerCase() === "b" && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    function handleCustomOpen() {
      setIsOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-quick-capture", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-quick-capture", handleCustomOpen);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {t.capture.title}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <QuickCaptureBox
            autoFocus
            onSuccess={() => {
              setTimeout(() => setIsOpen(false), 300);
            }}
          />
        </div>
      </div>
    </div>
  );
}
