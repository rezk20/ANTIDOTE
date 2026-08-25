"use client";

import { useLocale } from "@/components/providers/locale-provider";
import type { ScheduleCollision } from "@/lib/logic/schedule";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, X, CheckCircle2 } from "lucide-react";

interface CollisionAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  collisions: ScheduleCollision[];
}

export function CollisionAlertModal({
  isOpen,
  onClose,
  collisions,
}: CollisionAlertModalProps) {
  const { t } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {t.calendarPage.collisionsTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {collisions.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.calendarPage.noCollisions}
              </h4>
            </div>
          ) : (
            collisions.map((col) => {
              const isCritical = col.severity === "critical";

              return (
                <div
                  key={col.id}
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    isCritical
                      ? "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60"
                      : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                      )}
                      <h4
                        className={`text-xs font-black ${
                          isCritical ? "text-rose-900 dark:text-rose-200" : "text-amber-900 dark:text-amber-200"
                        }`}
                      >
                        {col.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-700 shrink-0">
                      {col.date}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {col.descriptionAr}
                  </p>

                  {col.relatedItems.length > 0 && (
                    <div className="pt-2 border-t border-zinc-200/40 dark:border-zinc-700/40 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-500">
                        العناصر المرتبطة بالتعارض:
                      </div>
                      <ul className="text-[11px] space-y-0.5 list-disc list-inside text-zinc-700 dark:text-zinc-300 font-medium">
                        {col.relatedItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex justify-end">
          <Button
            onClick={onClose}
            className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl cursor-pointer"
          >
            {t.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
