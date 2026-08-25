"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveQuarterlyReview } from "@/lib/actions/reviews";
import type { ReviewRow } from "@/lib/supabase/types";
import type { DimensionScores, QuarterlyReviewAnswers } from "@/lib/schemas/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Target,
  Shuffle,
  Clock,
  Heart,
  Loader2,
} from "lucide-react";

interface QuarterlyReviewWizardProps {
  initialReview: ReviewRow | null;
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

const DEFAULT_ANSWERS: QuarterlyReviewAnswers = {
  q_revenue_evaluation: "",
  q_pipeline_health: "",
  q_marriage_readiness: "",
  q_strategy_pivot: "",
  q_time_reallocation: "",
  q_next_quarter_goals: "",
};

export function QuarterlyReviewWizard({
  initialReview,
  periodStart,
  periodEnd,
  onClose,
}: QuarterlyReviewWizardProps) {
  const { t, isRtl } = useLocale();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialScores = (initialReview?.scores as unknown as DimensionScores) || DEFAULT_SCORES;
  const initialAns = (initialReview?.answers as unknown as QuarterlyReviewAnswers) || DEFAULT_ANSWERS;

  const [scores, setScores] = useState<DimensionScores>(initialScores);
  const [answers, setAnswers] = useState<QuarterlyReviewAnswers>(initialAns);

  const handleScoreChange = (dim: keyof DimensionScores, val: number) => {
    setScores((prev) => ({ ...prev, [dim]: val }));
  };

  const handleAnswerChange = (field: keyof QuarterlyReviewAnswers, val: string) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveQuarterlyReview({
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
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Compass className="h-4 w-4" />
            </span>
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.quarterlyReview.title}
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t.reviewsPage.quarterlyReview.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                currentStep === step
                  ? "bg-blue-600 text-white shadow-xs"
                  : step < currentStep
                  ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-600">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Dimensions Scoring */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              تقييم الأبعاد الستة على مدار الربع السنوي
            </h3>
            <p className="text-[11px] text-zinc-500">
              قياس التوازن العام ومؤشرات القوة والضعف.
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
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {t.reviewsPage.dimensions[dim]}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {t.reviewsPage.dimensions[`${dim}Desc` as keyof typeof t.reviewsPage.dimensions]}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScoreChange(dim, star)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        scores[dim] >= star
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
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

      {/* STEP 2: Revenue, Pipeline & Marriage Readiness Evaluation */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              تقييم مسارات الدخل والـ Pipeline وجاهزية الزواج
            </h3>
            <p className="text-[11px] text-zinc-500">
              تحليل دقيق لأداء الركائز الكبرى في الربع السنوي.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                {t.reviewsPage.quarterlyReview.revenueEvaluation}
              </Label>
              <Textarea
                value={answers.q_revenue_evaluation}
                onChange={(e) => handleAnswerChange("q_revenue_evaluation", e.target.value)}
                placeholder={t.reviewsPage.quarterlyReview.revenueEvaluationPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-blue-600" />
                {t.reviewsPage.quarterlyReview.pipelineHealth}
              </Label>
              <Textarea
                value={answers.q_pipeline_health}
                onChange={(e) => handleAnswerChange("q_pipeline_health", e.target.value)}
                placeholder={t.reviewsPage.quarterlyReview.pipelineHealthPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-600" />
                {t.reviewsPage.quarterlyReview.marriageReadiness}
              </Label>
              <Textarea
                value={answers.q_marriage_readiness}
                onChange={(e) => handleAnswerChange("q_marriage_readiness", e.target.value)}
                placeholder={t.reviewsPage.quarterlyReview.marriageReadinessPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Pivots & Next Quarter Strategic Goals */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              إعادة توزيع الموارد وتحديد الأهداف للربع الجديد
            </h3>
            <p className="text-[11px] text-zinc-500">
              إذا تعثر مسار معين، لا ننتظر نهاية العام، بل نعيد توزيع الجهد الآن.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
              <Label className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Shuffle className="h-4 w-4 text-amber-600" />
                {t.reviewsPage.quarterlyReview.strategyPivot}
              </Label>
              <Textarea
                value={answers.q_strategy_pivot}
                onChange={(e) => handleAnswerChange("q_strategy_pivot", e.target.value)}
                placeholder={t.reviewsPage.quarterlyReview.strategyPivotPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-amber-200 dark:border-amber-800/40"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-600" />
                {t.reviewsPage.quarterlyReview.timeReallocation}
              </Label>
              <Textarea
                value={answers.q_time_reallocation}
                onChange={(e) => handleAnswerChange("q_time_reallocation", e.target.value)}
                placeholder={t.reviewsPage.quarterlyReview.timeReallocationPh}
                rows={2}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 space-y-2">
              <Label className="text-xs font-black text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-blue-600" />
                {t.reviewsPage.quarterlyReview.nextGoals}
              </Label>
              <Textarea
                value={answers.q_next_quarter_goals}
                onChange={(e) => handleAnswerChange("q_next_quarter_goals", e.target.value)}
                placeholder={t.reviewsPage.quarterlyReview.nextGoalsPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button
          variant="outline"
          size="sm"
          onClick={currentStep === 1 ? onClose : () => setCurrentStep((s) => s - 1)}
          className="rounded-2xl text-xs"
        >
          {currentStep === 1 ? (
            "إلغاء"
          ) : (
            <>
              {isRtl ? <ArrowRight className="h-3.5 w-3.5 ml-1" /> : <ArrowLeft className="h-3.5 w-3.5 mr-1" />}
              {t.reviewsPage.prevStep}
            </>
          )}
        </Button>

        {currentStep < 3 ? (
          <Button
            size="sm"
            onClick={() => setCurrentStep((s) => s + 1)}
            className="rounded-2xl text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t.reviewsPage.nextStep}
            {isRtl ? <ArrowLeft className="h-3.5 w-3.5 mr-1" /> : <ArrowRight className="h-3.5 w-3.5 ml-1" />}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                {t.reviewsPage.savingReview}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                {t.reviewsPage.completeReview}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
