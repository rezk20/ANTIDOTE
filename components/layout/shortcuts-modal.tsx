"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { Keyboard, X, Sparkles } from "lucide-react";

export function ShortcutsModal() {
  const { t, isRtl } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    function handleOpen() {
      setIsOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-shortcuts-modal", handleOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-shortcuts-modal", handleOpen);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const globalShortcuts = [
    { key: t.shortcutsModal.cmdK, desc: t.shortcutsModal.cmdKDesc },
    { key: t.shortcutsModal.keyB, desc: t.shortcutsModal.keyBDesc },
    { key: t.shortcutsModal.keySlash, desc: t.shortcutsModal.keySlashDesc },
    { key: t.shortcutsModal.esc, desc: t.shortcutsModal.escDesc },
  ];

  const navShortcuts = [
    { key: t.shortcutsModal.keyT, desc: t.shortcutsModal.keyTDesc },
    { key: t.shortcutsModal.keyD, desc: t.shortcutsModal.keyDDesc },
    { key: t.shortcutsModal.keyO, desc: t.shortcutsModal.keyODesc },
    { key: t.shortcutsModal.keyG, desc: t.shortcutsModal.keyGDesc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.shortcutsModal.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.shortcutsModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Global Shortcuts */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.shortcutsModal.globalSection}
            </h3>
            <div className="space-y-2">
              {globalShortcuts.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80"
                >
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {sc.desc}
                  </span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-mono text-xs font-bold shadow-2xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.shortcutsModal.navigationSection}
            </h3>
            <div className="space-y-2">
              {navShortcuts.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80"
                >
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {sc.desc}
                  </span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-mono text-xs font-bold shadow-2xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{isRtl ? "اضغط على أي مفتاح للانتقال الفوري" : "Single keys work outside input fields"}</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold cursor-pointer"
          >
            {isRtl ? "فهمت ذلك" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
