"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveMonthlyReview } from "@/lib/actions/reviews";
import type { ReviewRow } from "@/lib/supabase/types";
import type { MonthlyPrefillMetrics } from "@/lib/logic/review-cadence";
import type {
  DimensionScores,
  MonthlyReviewAnswers,
} from "@/lib/schemas/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Briefcase,
  Heart,
  Flame,
  Zap,
  Target,
  ShieldAlert,
  Loader2,
} from "lucide-react";

interface MonthlyReviewWizardProps {
  initialReview: ReviewRow | null;
  metrics: MonthlyPrefillMetrics;
  periodStart: string;
  periodEnd: string;
  onClose: () => void;
}

const DEFAULT_SCORES: DimensionScores = {
  revenue: 3,
  career: 3,
  financial: 3,
  relationship: 3,
  execution: 3,
  routine: 3,
};

const DEFAULT_ANSWERS: MonthlyReviewAnswers = {
  keep: "",
  start: "",
  stop: "",
  double_down: "",
  reflection: "",
  q_wins: "",
  q_challenges: "",
  q_relationship: "",
  q_next_month_focus: "",
};

export function MonthlyReviewWizard({
  initialReview,
  metrics,
  periodStart,
  periodEnd,
  onClose,
}: MonthlyReviewWizardProps) {
  const { t, isRtl } = useLocale();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialScores =
    (initialReview?.scores as unknown as DimensionScores) || DEFAULT_SCORES;
  const initialAns =
    (initialReview?.answers as unknown as MonthlyReviewAnswers) ||
    DEFAULT_ANSWERS;

  const [scores, setScores] = useState<DimensionScores>(initialScores);
  const [answers, setAnswers] = useState<MonthlyReviewAnswers>(initialAns);

  const handleScoreChange = (dim: keyof DimensionScores, val: number) => {
    setScores((prev) => ({ ...prev, [dim]: val }));
  };

  const handleAnswerChange = (
    field: keyof MonthlyReviewAnswers,
    val: string,
  ) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveMonthlyReview({
      id: initialReview?.id,
      period_start: periodStart,
      period_end: periodEnd,
      scores,
      answers,
    });

    setIsSubmitting(false);
    if (res.ok) {
      onClose();
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-purple-500/10 p-1.5 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.monthlyReview.title}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t.reviewsPage.monthlyReview.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-all ${
                currentStep === step
                  ? "bg-purple-600 text-white shadow-xs"
                  : step < currentStep
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-600 dark:border-rose-800 dark:bg-rose-950/30">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Prefilled Real System Metrics  */}
      {currentStep === 1 && (
        <div className="animate-in fade-in space-y-6 duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.monthlyReview.prefilledTitle}
            </h3>
            <p className="text-[11px] text-zinc-500">
              تجميع فوري ومباشر لبيانات وإيرادات وعادات شهر{" "}
              {periodStart.slice(0, 7)}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                إجمالي الإيرادات
              </div>
              <div className="mt-1 font-mono text-base font-black text-zinc-900 dark:text-zinc-100">
                {metrics.totalRevenue.toLocaleString()} ج.م
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                صافي الادخار
              </div>
              <div className="mt-1 font-mono text-base font-black text-purple-600 dark:text-purple-400">
                {metrics.netSavings.toLocaleString()} ج.م ({metrics.savingsRate}
                %)
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <Briefcase className="h-3 w-3 text-blue-500" />
                العملاء والصفقات
              </div>
              <div className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-100">
                {metrics.wonClients} عملاء ({metrics.proposalsSent} عروض)
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <Heart className="h-3 w-3 text-pink-500" />
                مدفوعات الزواج
              </div>
              <div className="mt-1 font-mono text-base font-black text-pink-600 dark:text-pink-400">
                {metrics.marriagePaidAmount.toLocaleString()} ج.م
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <Flame className="h-3 w-3 text-orange-500" />
                ساعات العمل العميق
              </div>
              <div className="mt-1 font-mono text-base font-black text-orange-600">
                {metrics.totalDeepWorkHours} ساعة
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <Target className="h-3 w-3 text-indigo-500" />
                متوسط قيمة المشروع
              </div>
              <div className="mt-1 font-mono text-base font-black text-zinc-900 dark:text-zinc-100">
                {metrics.avgProjectValue.toLocaleString()} ج.م
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <Zap className="h-3 w-3 text-amber-500" />
                ثبات العادات
              </div>
              <div className="mt-1 font-mono text-base font-black text-amber-600">
                {metrics.habitConsistencyScore}%
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                مشاريع منجزة
              </div>
              <div className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-100">
                {metrics.completedProjectsCount} مشاريع
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t.reviewsPage.monthlyReview.reflection}
            </Label>
            <Textarea
              value={answers.reflection}
              onChange={(e) => handleAnswerChange("reflection", e.target.value)}
              placeholder={t.reviewsPage.monthlyReview.reflectionPh}
              rows={3}
              className="rounded-2xl text-xs"
            />
          </div>
        </div>
      )}

      {/* STEP 2: 6 Dimensions Scoring */}
      {currentStep === 2 && (
        <div className="animate-in fade-in space-y-5 duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.step2Title}
            </h3>
            <p className="text-[11px] text-zinc-500">
              {t.reviewsPage.step2Subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {(
              [
                "revenue",
                "career",
                "financial",
                "relationship",
                "execution",
                "routine",
              ] as (keyof DimensionScores)[]
            ).map((dim) => (
              <div
                key={dim}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200/60 bg-zinc-50 p-4 sm:flex-row sm:items-center dark:border-zinc-700/40 dark:bg-zinc-800/40"
              >
                <div>
                  <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {t.reviewsPage.dimensions[dim]}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    {
                      t.reviewsPage.dimensions[
                        `${dim}Desc` as keyof typeof t.reviewsPage.dimensions
                      ]
                    }
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScoreChange(dim, star)}
                      className={`h-8 w-8 cursor-pointer rounded-xl text-xs font-bold transition-all ${
                        scores[dim] >= star
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: 4-Quadrant Strategic Direction (§19 KEEP / START / STOP / DOUBLE DOWN) */}
      {currentStep === 3 && (
        <div className="animate-in fade-in space-y-5 duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              إطار التوجيه الاستراتيجي الرباعي
            </h3>
            <p className="text-[11px] text-zinc-500">
              حدد بدقة القرارات الحاسمة التي ستشكل مسار عملك في الشهر الجديد.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* KEEP */}
            <div className="space-y-2 rounded-2xl border border-emerald-200/50 bg-emerald-50/40 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/20">
              <Label className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {t.reviewsPage.monthlyReview.keep}
              </Label>
              <Textarea
                value={answers.keep}
                onChange={(e) => handleAnswerChange("keep", e.target.value)}
                placeholder={t.reviewsPage.monthlyReview.keepPh}
                rows={3}
                className="rounded-2xl border-emerald-200 bg-white text-xs dark:border-emerald-800/40 dark:bg-zinc-900"
              />
            </div>

            {/* START */}
            <div className="space-y-2 rounded-2xl border border-blue-200/50 bg-blue-50/40 p-4 dark:border-blue-800/40 dark:bg-blue-950/20">
              <Label className="flex items-center gap-1.5 text-xs font-black text-blue-800 dark:text-blue-300">
                <Sparkles className="h-4 w-4 text-blue-600" />
                {t.reviewsPage.monthlyReview.start}
              </Label>
              <Textarea
                value={answers.start}
                onChange={(e) => handleAnswerChange("start", e.target.value)}
                placeholder={t.reviewsPage.monthlyReview.startPh}
                rows={3}
                className="rounded-2xl border-blue-200 bg-white text-xs dark:border-blue-800/40 dark:bg-zinc-900"
              />
            </div>

            {/* STOP */}
            <div className="space-y-2 rounded-2xl border border-rose-200/50 bg-rose-50/40 p-4 dark:border-rose-800/40 dark:bg-rose-950/20">
              <Label className="flex items-center gap-1.5 text-xs font-black text-rose-800 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                {t.reviewsPage.monthlyReview.stop}
              </Label>
              <Textarea
                value={answers.stop}
                onChange={(e) => handleAnswerChange("stop", e.target.value)}
                placeholder={t.reviewsPage.monthlyReview.stopPh}
                rows={3}
                className="rounded-2xl border-rose-200 bg-white text-xs dark:border-rose-800/40 dark:bg-zinc-900"
              />
            </div>

            {/* DOUBLE DOWN */}
            <div className="space-y-2 rounded-2xl border border-purple-200/50 bg-purple-50/40 p-4 dark:border-purple-800/40 dark:bg-purple-950/20">
              <Label className="flex items-center gap-1.5 text-xs font-black text-purple-800 dark:text-purple-300">
                <Flame className="h-4 w-4 text-purple-600" />
                {t.reviewsPage.monthlyReview.doubleDown}
              </Label>
              <Textarea
                value={answers.double_down}
                onChange={(e) =>
                  handleAnswerChange("double_down", e.target.value)
                }
                placeholder={t.reviewsPage.monthlyReview.doubleDownPh}
                rows={3}
                className="rounded-2xl border-purple-200 bg-white text-xs dark:border-purple-800/40 dark:bg-zinc-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Next Month Primary Outcome & Wrap Up */}
      {currentStep === 4 && (
        <div className="animate-in fade-in space-y-5 duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              خارطة الهدف الأكبر للشهر القادم
            </h3>
            <p className="text-[11px] text-zinc-500">
              تثبيت النتيجة المحورية والتركيز المطلق.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.reviewsPage.monthlyReview.nextFocus}
              </Label>
              <Textarea
                value={answers.q_next_month_focus}
                onChange={(e) =>
                  handleAnswerChange("q_next_month_focus", e.target.value)
                }
                placeholder={t.reviewsPage.monthlyReview.nextFocusPh}
                rows={3}
                className="rounded-2xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {t.reviewsPage.monthlyReview.wins}
                </Label>
                <Textarea
                  value={answers.q_wins}
                  onChange={(e) => handleAnswerChange("q_wins", e.target.value)}
                  placeholder={t.reviewsPage.monthlyReview.winsPh}
                  rows={2}
                  className="rounded-2xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {t.reviewsPage.monthlyReview.relationship}
                </Label>
                <Textarea
                  value={answers.q_relationship}
                  onChange={(e) =>
                    handleAnswerChange("q_relationship", e.target.value)
                  }
                  placeholder={t.reviewsPage.monthlyReview.relationshipPh}
                  rows={2}
                  className="rounded-2xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button
          variant="outline"
          size="sm"
          onClick={
            currentStep === 1 ? onClose : () => setCurrentStep((s) => s - 1)
          }
          className="rounded-2xl text-xs"
        >
          {currentStep === 1 ? (
            "إلغاء"
          ) : (
            <>
              {isRtl ? (
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              )}
              {t.reviewsPage.prevStep}
            </>
          )}
        </Button>

        {currentStep < 4 ? (
          <Button
            size="sm"
            onClick={() => setCurrentStep((s) => s + 1)}
            className="rounded-2xl bg-purple-600 text-xs text-white hover:bg-purple-700"
          >
            {t.reviewsPage.nextStep}
            {isRtl ? (
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            ) : (
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                {t.reviewsPage.savingReview}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                {t.reviewsPage.completeReview}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
