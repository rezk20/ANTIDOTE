"use client";

import { useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { calculateOverallBalance, getScoreColor } from "@/lib/logic/review-metrics";
import { deleteReview } from "@/lib/actions/reviews";
import type { ReviewRow } from "@/lib/supabase/types";
import type { DimensionScores, WeeklyReviewAnswers } from "@/lib/schemas/reviews";
import {
  Calendar,
  Award,
  ChevronRight,
  Edit,
  Trash2,
  Trophy,
  Target,
} from "lucide-react";

interface ReviewHistoryCardProps {
  review: ReviewRow;
  onViewDetails: (review: ReviewRow) => void;
  onEdit: (review: ReviewRow) => void;
}

export function ReviewHistoryCard({
  review,
  onViewDetails,
  onEdit,
}: ReviewHistoryCardProps) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  const scores = (review.scores as unknown as DimensionScores) || {
    revenue: 3,
    career: 3,
    financial: 3,
    relationship: 3,
    execution: 3,
    routine: 3,
  };
  const answers = (review.answers as unknown as WeeklyReviewAnswers) || {};
  const overallBalance = calculateOverallBalance(scores);

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذه المراجعة؟")) {
      startTransition(async () => {
        await deleteReview(review.id);
      });
    }
  };

  return (
    <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Calendar className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.weekOf} {review.period_start} → {review.period_end || "نهاية الأسبوع"}
            </span>
            <p className="text-[11px] text-zinc-400">
              {new Date(review.created_at).toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-black">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span className={getScoreColor(overallBalance)}>
              {overallBalance} / 5.0
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(review)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={t.reviewsPage.editReview}
            >
              <Edit className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
              title="حذف"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Snippet Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
        {answers.q_wins && (
          <div className="p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
              <Trophy className="h-3.5 w-3.5" />
              <span>أكبر إنجازات الأسبوع</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed">
              {answers.q_wins}
            </p>
          </div>
        )}

        {answers.q_next_top_three && (
          <div className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold text-[11px]">
              <Target className="h-3.5 w-3.5" />
              <span>أولويات الأسبوع القادم</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed whitespace-pre-line">
              {answers.q_next_top_three}
            </p>
          </div>
        )}
      </div>

      {/* Footer / View Details */}
      <div className="flex items-center justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
        <button
          onClick={() => onViewDetails(review)}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors cursor-pointer"
        >
          <span>{t.reviewsPage.reviewDossier}</span>
          <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
