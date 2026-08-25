"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveYearlyReview } from "@/lib/actions/reviews";
import type { ReviewRow } from "@/lib/supabase/types";
import type { YearlyPrefillMetrics } from "@/lib/logic/review-cadence";
import type { DimensionScores, YearlyReviewAnswers } from "@/lib/schemas/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Briefcase,
  Heart,
  Award,
  AlertOctagon,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";

interface YearlyReviewWizardProps {
  initialReview: ReviewRow | null;
  metrics: YearlyPrefillMetrics;
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

const DEFAULT_ANSWERS: YearlyReviewAnswers = {
  biggest_client: "",
  best_project: "",
  biggest_mistake: "",
  biggest_lesson: "",
  relationship_highlights: "",
  career_growth: "",
  what_changed: "",
  next_year_plan: "",
};

export function YearlyReviewWizard({
  initialReview,
  metrics,
  periodStart,
  periodEnd,
  onClose,
}: YearlyReviewWizardProps) {
  const { t, isRtl } = useLocale();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialScores = (initialReview?.scores as unknown as DimensionScores) || DEFAULT_SCORES;
  const initialAns = (initialReview?.answers as unknown as YearlyReviewAnswers) || DEFAULT_ANSWERS;

  const [scores, setScores] = useState<DimensionScores>(initialScores);
  const [answers, setAnswers] = useState<YearlyReviewAnswers>(initialAns);

  const handleScoreChange = (dim: keyof DimensionScores, val: number) => {
    setScores((prev) => ({ ...prev, [dim]: val }));
  };

  const handleAnswerChange = (field: keyof YearlyReviewAnswers, val: string) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveYearlyReview({
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
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Trophy className="h-4 w-4" />
            </span>
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.yearlyReview.title} ({periodStart.slice(0, 4)})
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t.reviewsPage.yearlyReview.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                currentStep === step
                  ? "bg-amber-600 text-white shadow-xs"
                  : step < currentStep
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
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

      {/* STEP 1: Numbers & 6 Dimensions */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              أرقام ومحصلة العام الإجمالية
            </h3>
            <p className="text-[11px] text-zinc-500">
              حصيلة العام المسجلة في قواعد بياناتك.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
              <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                إجمالي إيرادات العام
              </div>
              <div className="text-base font-black font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                {metrics.totalRevenue.toLocaleString()} ج.م
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
              <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                صافي الادخار السنوي
              </div>
              <div className="text-base font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
                {metrics.netSavings.toLocaleString()} ج.م
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
              <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                <Briefcase className="h-3 w-3 text-blue-500" />
                إجمالي العملاء
              </div>
              <div className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-1">
                {metrics.totalClients} عملاء
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50">
              <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                <Award className="h-3 w-3 text-amber-500" />
                أكبر مشروع
              </div>
              <div className="text-xs font-black text-amber-600 truncate mt-1">
                {metrics.bestProjectName} ({metrics.biggestClientRevenue.toLocaleString()} ج.م)
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              تقييم الأبعاد الستة للعام كاملاً
            </h4>
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
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {t.reviewsPage.dimensions[dim]}
                </span>
                <div className="flex items-center gap-1 self-end sm:self-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScoreChange(dim, star)}
                      className={`w-7 h-7 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        scores[dim] >= star
                          ? "bg-amber-600 text-white shadow-xs"
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

      {/* STEP 2: Highlights, Mistakes & Lessons */}
      {currentStep === 2 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              أكبر الإنجازات وأعظم الدروس المستفادة
            </h3>
            <p className="text-[11px] text-zinc-500">
              توثيق التجارب الحاسمة التي صنعت الفارق.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-600" />
                {t.reviewsPage.yearlyReview.bestProject}
              </Label>
              <Textarea
                value={answers.best_project}
                onChange={(e) => handleAnswerChange("best_project", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.bestProjectPh}
                rows={2}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-blue-600" />
                {t.reviewsPage.yearlyReview.biggestClient}
              </Label>
              <Textarea
                value={answers.biggest_client}
                onChange={(e) => handleAnswerChange("biggest_client", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.biggestClientPh}
                rows={2}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/40 space-y-2">
              <Label className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <AlertOctagon className="h-4 w-4 text-rose-600" />
                {t.reviewsPage.yearlyReview.biggestMistake}
              </Label>
              <Textarea
                value={answers.biggest_mistake}
                onChange={(e) => handleAnswerChange("biggest_mistake", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.biggestMistakePh}
                rows={2}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-rose-200 dark:border-rose-800/40"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 space-y-2">
              <Label className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                {t.reviewsPage.yearlyReview.biggestLesson}
              </Label>
              <Textarea
                value={answers.biggest_lesson}
                onChange={(e) => handleAnswerChange("biggest_lesson", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.biggestLessonPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-800/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Life, Career & What Changed */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              النمو الشخصي والمهني والعلاقات
            </h3>
            <p className="text-[11px] text-zinc-500">
              تأمل في التغير الجذري الذي طرأ على حياتك خلال العام.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-pink-50/40 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-800/40 space-y-2">
              <Label className="text-xs font-black text-pink-800 dark:text-pink-300 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-600" />
                {t.reviewsPage.yearlyReview.relationshipHighlights}
              </Label>
              <Textarea
                value={answers.relationship_highlights}
                onChange={(e) => handleAnswerChange("relationship_highlights", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.relationshipHighlightsPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-pink-200 dark:border-pink-800/40"
              />
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 space-y-2">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                {t.reviewsPage.yearlyReview.careerGrowth}
              </Label>
              <Textarea
                value={answers.career_growth}
                onChange={(e) => handleAnswerChange("career_growth", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.careerGrowthPh}
                rows={2}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40 space-y-2">
              <Label className="text-xs font-black text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-600" />
                {t.reviewsPage.yearlyReview.whatChanged}
              </Label>
              <Textarea
                value={answers.what_changed}
                onChange={(e) => handleAnswerChange("what_changed", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.whatChangedPh}
                rows={3}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-purple-200 dark:border-purple-800/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Next Year Plan & Vision */}
      {currentStep === 4 && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              رؤية وخطة العام القادم
            </h3>
            <p className="text-[11px] text-zinc-500">
              رسم الخطوط العريضة والمستهدفات غير القابلة للتفاوض للعام الجديد.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40 space-y-2">
              <Label className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-600" />
                {t.reviewsPage.yearlyReview.nextYearPlan}
              </Label>
              <Textarea
                value={answers.next_year_plan}
                onChange={(e) => handleAnswerChange("next_year_plan", e.target.value)}
                placeholder={t.reviewsPage.yearlyReview.nextYearPlanPh}
                rows={5}
                className="rounded-2xl text-xs bg-white dark:bg-zinc-900 border-amber-200 dark:border-amber-800/40"
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

        {currentStep < 4 ? (
          <Button
            size="sm"
            onClick={() => setCurrentStep((s) => s + 1)}
            className="rounded-2xl text-xs bg-amber-600 hover:bg-amber-700 text-white"
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
