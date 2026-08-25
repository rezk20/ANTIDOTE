"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import type { FinanceAlert } from "@/lib/logic/alerts";
import {
  AlertTriangle,
  Sparkles,
  TrendingUp,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface FinanceAlertsBannerProps {
  alerts: FinanceAlert[];
}

export function FinanceAlertsBanner({ alerts }: FinanceAlertsBannerProps) {
  const { isRtl } = useLocale();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  if (activeAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => {
        const isWarning = alert.severity === "warning";
        const isSuccess = alert.severity === "success";

        return (
          <div
            key={alert.id}
            className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
              isWarning
                ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200"
                : isSuccess
                ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200"
                : "bg-blue-50/70 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-800/50 text-blue-900 dark:text-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                  isWarning
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : isSuccess
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                }`}
              >
                {isWarning ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : isSuccess ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black">
                    {isRtl ? alert.titleAr : alert.titleEn}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/70 dark:bg-zinc-900/60 border border-current/20">
                    {isRtl ? "اقتراح ذكي (§49)" : "Smart Guidance (§49)"}
                  </span>
                </div>
                <p className="text-xs opacity-90 mt-1 leading-relaxed">
                  {isRtl ? alert.messageAr : alert.messageEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {alert.actionHref && (
                <Link
                  href={alert.actionHref}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs ${
                    isWarning
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : isSuccess
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <span>
                    {isRtl ? alert.actionLabelAr : alert.actionLabelEn}
                  </span>
                  {isRtl ? (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </Link>
              )}

              <button
                type="button"
                onClick={() => handleDismiss(alert.id)}
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                title={isRtl ? "إخفاء" : "Dismiss"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
