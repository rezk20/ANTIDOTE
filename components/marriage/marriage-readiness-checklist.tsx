"use client";

import { useLocale } from "@/components/providers/locale-provider";
import type { MarriageReadinessAssessment } from "@/lib/logic/marriage";
import {
  ShieldCheck,
  Home,
  Tv,
  PartyPopper,
  DollarSign,
  HeartHandshake,
  Sparkles,
  Info,
} from "lucide-react";

interface MarriageReadinessChecklistProps {
  readiness: MarriageReadinessAssessment;
}

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  financial: <DollarSign className="h-4 w-4 text-emerald-500" />,
  housing: <Home className="h-4 w-4 text-indigo-500" />,
  furniture: <Tv className="h-4 w-4 text-amber-500" />,
  wedding: <PartyPopper className="h-4 w-4 text-rose-500" />,
  income: <Sparkles className="h-4 w-4 text-blue-500" />,
  emergency: <ShieldCheck className="h-4 w-4 text-teal-500" />,
  marital: <HeartHandshake className="h-4 w-4 text-pink-500" />,
};

export function MarriageReadinessChecklist({ readiness }: MarriageReadinessChecklistProps) {
  const { t, isRtl } = useLocale();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {t.marriagePage.readinessTitle}
            </span>
          </div>
          <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {t.marriagePage.readinessSubtitle}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <span className="text-xs font-bold text-zinc-500">الجاهزية الكلية:</span>
          <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {readiness.overallScore}%
          </span>
        </div>
      </div>

      {/* Anti-Chaos Principle Callout */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 flex items-start gap-3 text-xs">
        <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-black text-indigo-900 dark:text-indigo-200">
            {t.marriagePage.antiChaosTitle}
          </span>
          <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
            {readiness.antiChaosTip}
          </p>
        </div>
      </div>

      {/* 7 Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {readiness.dimensions.map((dim) => {
          const icon = DIMENSION_ICONS[dim.id] || <Sparkles className="h-4 w-4" />;
          const isReady = dim.status === "ready";

          return (
            <div
              key={dim.id}
              className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {isRtl ? dim.name : dim.nameEn}
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-400">
                      وزن البعد: {dim.weight}%
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isReady
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {isReady ? "جاهز ومكتمل" : `${dim.progressPercent}%`}
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {dim.description}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isReady ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${dim.progressPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
