"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { createDump } from "@/lib/actions/brain-dump";
import { useLocale } from "@/components/providers/locale-provider";
import { Sparkles, Send, ArrowRight, Check } from "lucide-react";

export function QuickDumpCard({ inboxCount = 0 }: { inboxCount?: number }) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const formData = new FormData();
    formData.set("content", content.trim());

    startTransition(async () => {
      const res = await createDump({ ok: false }, formData);
      if (res?.ok) {
        setContent("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      }
    });
  }

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {t.dashboard.quickDumpCardTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.dashboard.quickDumpCardSubtitle}
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-black text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            {inboxCount} {isRtl ? "في الصندوق" : "inbox"}
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.dashboard.quickDumpPlaceholder}
              disabled={isPending}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/40 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-xl bg-purple-600 p-2 text-white transition-all hover:bg-purple-700 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </div>

          {showSuccess && (
            <p className="animate-in fade-in flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>{t.dashboard.quickDumpSuccess}</span>
            </p>
          )}
        </form>
      </div>

      {/* Footer Link */}
      <div className="border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
        <Link
          href="/brain-dump"
          className="flex items-center justify-between text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
        >
          <span>{t.nav.brainDump}</span>
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
