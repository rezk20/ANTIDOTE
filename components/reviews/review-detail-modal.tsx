"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { ReviewDimensionsVisualizer } from "./review-dimensions-visualizer";
import { createTasksFromReviewTopThree } from "@/lib/actions/reviews";
import type { ReviewRow } from "@/lib/supabase/types";
import type { DimensionScores, WeeklyReviewAnswers } from "@/lib/schemas/reviews";
import { Button } from "@/components/ui/button";
import {
  X,
  Calendar,
  CheckCircle2,
  Trophy,
  AlertCircle,
  TrendingUp,
  Clock,
  Briefcase,
  GraduationCap,
  Heart,
  Activity,
  Play,
  StopCircle,
  Repeat,
  Target,
  Sliders,
  PlusCircle,
} from "lucide-react";

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewRow | null;
}

export function ReviewDetailModal({
  isOpen,
  onClose,
  review,
}: ReviewDetailModalProps) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [convertedSuccess, setConvertedSuccess] = useState(false);

  if (!isOpen || !review) return null;

  const scores = (review.scores as unknown as DimensionScores) || {
    revenue: 3,
    career: 3,
    financial: 3,
    relationship: 3,
    execution: 3,
    routine: 3,
  };
  const answers = (review.answers as unknown as WeeklyReviewAnswers) || {};

  const handleConvertTopThree = () => {
    if (!answers.q_next_top_three) return;
    startTransition(async () => {
      const res = await createTasksFromReviewTopThree(answers.q_next_top_three);
      if (res.ok) {
        setConvertedSuccess(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.reviewsPage.reviewDossier} — {review.period_start} → {review.period_end || "نهاية الأسبوع"}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {new Date(review.created_at).toLocaleString("ar-EG")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Dimension Scores */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              {t.reviewsPage.step2Title}
            </h4>
            <ReviewDimensionsVisualizer scores={scores} interactive={false} />
          </div>

          {/* 2. Questions Group 1: Reality & Metrics */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              {t.reviewsPage.step1Title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <QuestionCard
                icon={<Trophy className="h-4 w-4 text-emerald-500" />}
                title={t.reviewsPage.questions.q_wins}
                answer={answers.q_wins}
              />
              <QuestionCard
                icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
                title={t.reviewsPage.questions.q_misses}
                answer={answers.q_misses}
              />
              <QuestionCard
                icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                title={t.reviewsPage.questions.q_revenue_reflection}
                answer={answers.q_revenue_reflection}
              />
              <QuestionCard
                icon={<Clock className="h-4 w-4 text-amber-500" />}
                title={t.reviewsPage.questions.q_time_drain}
                answer={answers.q_time_drain}
              />
            </div>
          </div>

          {/* 3. Questions Group 2: Strategy & Reflection */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              {t.reviewsPage.step3Title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <QuestionCard
                icon={<Briefcase className="h-4 w-4 text-indigo-500" />}
                title={t.reviewsPage.questions.q_client_health}
                answer={answers.q_client_health}
              />
              <QuestionCard
                icon={<GraduationCap className="h-4 w-4 text-teal-500" />}
                title={t.reviewsPage.questions.q_learning_growth}
                answer={answers.q_learning_growth}
              />
              <QuestionCard
                icon={<Heart className="h-4 w-4 text-rose-500" />}
                title={t.reviewsPage.questions.q_relationship_check}
                answer={answers.q_relationship_check}
              />
              <QuestionCard
                icon={<Activity className="h-4 w-4 text-orange-500" />}
                title={t.reviewsPage.questions.q_habits_energy}
                answer={answers.q_habits_energy}
              />
            </div>
          </div>

          {/* 4. Questions Group 3: Next Week Blueprint */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              {t.reviewsPage.step4Title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <QuestionCard
                icon={<Play className="h-4 w-4 text-emerald-500" />}
                title={t.reviewsPage.questions.q_start}
                answer={answers.q_start}
              />
              <QuestionCard
                icon={<StopCircle className="h-4 w-4 text-rose-500" />}
                title={t.reviewsPage.questions.q_stop}
                answer={answers.q_stop}
              />
              <QuestionCard
                icon={<Repeat className="h-4 w-4 text-blue-500" />}
                title={t.reviewsPage.questions.q_continue}
                answer={answers.q_continue}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                  <Target className="h-4 w-4" />
                  <span>{t.reviewsPage.questions.q_next_top_three}</span>
                </div>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                  {answers.q_next_top_three || "—"}
                </p>

                {answers.q_next_top_three && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleConvertTopThree}
                    disabled={isPending || convertedSuccess}
                    className="w-full text-xs font-bold gap-1.5 cursor-pointer mt-2"
                  >
                    {convertedSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{t.reviewsPage.topThreeConvertedSuccess}</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>{t.reviewsPage.convertTopThree}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              <QuestionCard
                icon={<Sliders className="h-4 w-4 text-purple-500" />}
                title={t.reviewsPage.questions.q_system_tweak}
                answer={answers.q_system_tweak}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex justify-end shrink-0">
          <Button onClick={onClose} variant="secondary" className="rounded-xl text-xs font-bold">
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  icon,
  title,
  answer,
}: {
  icon: React.ReactNode;
  title: string;
  answer?: string;
}) {
  return (
    <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5 shadow-xs">
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-xs">
        {icon}
        <span className="line-clamp-1">{title}</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line min-h-[36px]">
        {answer || "—"}
      </p>
    </div>
  );
}
