"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { X, Edit2, Copy, Check } from "lucide-react";

export interface DetailChip {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "emerald" | "purple" | "blue" | "amber" | "rose";
}

export interface DetailSection {
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export function EntityDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  badge,
  chips = [],
  sections = [],
  onEdit,
  editLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  chips?: DetailChip[];
  sections?: DetailSection[];
  onEdit?: () => void;
  editLabel?: string;
}) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  function handleCopy() {
    navigator.clipboard.writeText(title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const chipVariantStyles = {
    default: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60",
    emerald: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    purple: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    blue: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    amber: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    rose: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {icon && (
              <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0 mt-0.5">
                {icon}
              </div>
            )}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug break-words">
                  {title}
                </h2>
                {badge}
              </div>
              {subtitle && (
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={copied ? t.common.copied : t.common.copy}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Chips Grid */}
          {chips.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {chips.map((chip, idx) => {
                const variantClass = chipVariantStyles[chip.variant || "default"];
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border ${variantClass} flex flex-col gap-0.5`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70 flex items-center gap-1">
                      {chip.icon}
                      <span>{chip.label}</span>
                    </span>
                    <span className="text-xs font-bold truncate">
                      {chip.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detailed Sections */}
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {sec.icon}
                <span>{sec.title}</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            {t.common.close}
          </Button>

          {onEdit && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="gap-1.5 rounded-xl"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{editLabel ?? t.common.edit}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
