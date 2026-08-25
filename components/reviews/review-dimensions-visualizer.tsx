"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { DIMENSIONS, type DimensionScores, type ProgressDimension } from "@/lib/schemas/reviews";
import { calculateOverallBalance, getScoreColor } from "@/lib/logic/review-metrics";
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Heart,
  Zap,
  Activity,
  Award,
} from "lucide-react";

interface ReviewDimensionsVisualizerProps {
  scores: DimensionScores;
  onChangeScore?: (dimension: ProgressDimension, value: number) => void;
  interactive?: boolean;
}

const DIMENSION_ICONS: Record<ProgressDimension, React.ReactNode> = {
  revenue: <TrendingUp className="h-4 w-4 text-emerald-500" />,
  career: <Briefcase className="h-4 w-4 text-indigo-500" />,
  financial: <DollarSign className="h-4 w-4 text-blue-500" />,
  relationship: <Heart className="h-4 w-4 text-rose-500" />,
  execution: <Zap className="h-4 w-4 text-amber-500" />,
  routine: <Activity className="h-4 w-4 text-teal-500" />,
};

export function ReviewDimensionsVisualizer({
  scores,
  onChangeScore,
  interactive = false,
}: ReviewDimensionsVisualizerProps) {
  const { t } = useLocale();
  const overallBalance = calculateOverallBalance(scores);

  return (
    <div className="space-y-4">
      {/* Header with Overall Balance */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.overallBalance}
            </h4>
            <p className="text-[11px] text-zinc-500">
              {overallBalance >= 4.0
                ? "توازن استثنائي وأداء عالي ومستدام"
                : overallBalance >= 3.0
                  ? "أداء متزن ومستقر مع فرص تحسين"
                  : "يحتاج إلى إعادة موازنة وتركيز"}
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black px-3 py-1 rounded-xl border ${getScoreColor(overallBalance)}`}>
            {overallBalance}
          </span>
          <span className="text-xs font-bold text-zinc-400">/ 5.0</span>
        </div>
      </div>

      {/* 6 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DIMENSIONS.map((dim) => {
          const score = scores[dim] || 3;
          const icon = DIMENSION_ICONS[dim];
          const name = t.reviewsPage.dimensions[dim];
          const desc = t.reviewsPage.dimensions[`${dim}Desc` as keyof typeof t.reviewsPage.dimensions];

          return (
            <div
              key={dim}
              className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {name}
                    </span>
                    <p className="text-[10px] text-zinc-400 line-clamp-1">
                      {desc}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                  {score} / 5
                </span>
              </div>

              {/* Progress / Interactive Buttons */}
              {interactive ? (
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isSelected = score === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onChangeScore?.(dim, val)}
                        className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs ring-2 ring-amber-500/40"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(score / 5) * 100}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
