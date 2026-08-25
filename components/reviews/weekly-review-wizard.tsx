"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveWeeklyReview } from "@/lib/actions/reviews";
import { ReviewDimensionsVisualizer } from "./review-dimensions-visualizer";
import type { ReviewRow } from "@/lib/supabase/types";
import type { DimensionScores, WeeklyReviewAnswers, ProgressDimension } from "@/lib/schemas/reviews";
import type { WeeklyAggregatedMetrics } from "@/lib/logic/review-metrics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  Trophy,
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
} from "lucide-react";

interface WeeklyReviewWizardProps {
  initialReview?: ReviewRow | null;
  metrics: WeeklyAggregatedMetrics;
  periodStart: string;
  periodEnd: string;
  onFinished?: () => void;
}

export function WeeklyReviewWizard({
  initialReview,
  metrics,
  periodStart,
  periodEnd,
  onFinished,
}: WeeklyReviewWizardProps) {
  const { t, isRtl } = useLocale();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form State
  const [scores, setScores] = useState<DimensionScores>(() => {
    if (initialReview?.scores) {
      return initialReview.scores as unknown as DimensionScores;
    }
    return {
      revenue: 3,
      career: 3,
      financial: 3,
      relationship: 3,
      execution: 3,
      routine: 3,
    };
  });

  const [answers, setAnswers] = useState<WeeklyReviewAnswers>(() => {
    if (initialReview?.answers) {
      return initialReview.answers as unknown as WeeklyReviewAnswers;
    }
    return {
      q_wins: "",
      q_misses: "",
      q_revenue_reflection: "",
      q_time_drain: "",
      q_client_health: "",
      q_learning_growth: "",
      q_relationship_check: "",
      q_habits_energy: "",
      q_start: "",
      q_stop: "",
      q_continue: "",
      q_next_top_three: "",
      q_system_tweak: "",
    };
  });

  const handleScoreChange = (dim: ProgressDimension, val: number) => {
    setScores((prev) => ({ ...prev, [dim]: val }));
  };

  const handleAnswerChange = (field: keyof WeeklyReviewAnswers, val: string) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (isFinalizing = false) => {
    startTransition(async () => {
      setStatusMessage(null);
      const res = await saveWeeklyReview({
        id: initialReview?.id,
        period_start: periodStart,
        period_end: periodEnd,
        scores,
        answers,
      });

      if (res.ok) {
        setStatusMessage(t.reviewsPage.reviewSavedSuccess);
        if (isFinalizing && onFinished) {
          onFinished();
        }
      } else {
        setStatusMessage(res.error || "حدث خطأ أثناء الحفظ");
      }
    });
  };

  const steps = [
    { num: 1, title: t.reviewsPage.step1Title, sub: t.reviewsPage.step1Subtitle },
    { num: 2, title: t.reviewsPage.step2Title, sub: t.reviewsPage.step2Subtitle },
    { num: 3, title: t.reviewsPage.step3Title, sub: t.reviewsPage.step3Subtitle },
    { num: 4, title: t.reviewsPage.step4Title, sub: t.reviewsPage.step4Subtitle },
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Header Strip */}
      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {t.reviewsPage.weeklyTab}
            </span>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <span>
                {t.reviewsPage.weekOf} {periodStart} → {periodEnd}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="text-xs font-bold gap-1.5 cursor-pointer rounded-xl"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{t.reviewsPage.saveDraft}</span>
            </Button>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num as 1 | 2 | 3 | 4)}
                className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-xs"
                    : isDone
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400"
                      : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {s.num === 1 ? "1. الواقع" : s.num === 2 ? "2. الأبعاد" : s.num === 3 ? "3. التحليل" : "4. الخطة"}
                  </span>
                  {isDone && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="text-xs font-bold truncate">{s.title.replace(/^\d+\.\s*/, "")}</div>
              </button>
            );
          })}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* STEP 1: Auto-Metrics & Reality */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Live Auto-Metrics Banner */}
          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                الأرقام المحققة هذا الأسبوع (Auto-Prefilled Metrics)
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {t.reviewsPage.autoMetrics.incomeThisWeek}
                </span>
                <p className="text-base font-black text-emerald-800 dark:text-emerald-300">
                  {metrics.incomeThisWeek.toLocaleString()} EGP
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-400">
                  {t.reviewsPage.autoMetrics.expensesThisWeek}
                </span>
                <p className="text-base font-black text-rose-800 dark:text-rose-300">
                  {metrics.expensesThisWeek.toLocaleString()} EGP
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-400">
                  {t.reviewsPage.autoMetrics.netSavings}
                </span>
                <p className="text-base font-black text-blue-800 dark:text-blue-300">
                  {metrics.netSavings.toLocaleString()} EGP
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400">
                  {t.reviewsPage.autoMetrics.tasksDone}
                </span>
                <p className="text-base font-black text-amber-800 dark:text-amber-300">
                  {metrics.tasksDone} مهمة ({metrics.highPriorityDone} حاسمة)
                </p>
              </div>
            </div>
          </div>

          {/* Questions 1 - 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <Trophy className="h-4 w-4 text-emerald-500" />
                <span>{t.reviewsPage.questions.q_wins}</span>
              </Label>
              <Textarea
                value={answers.q_wins}
                onChange={(e) => handleAnswerChange("q_wins", e.target.value)}
                placeholder={t.reviewsPage.questions.q_wins_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <AlertCircle className="h-4 w-4 text-rose-500" />
                <span>{t.reviewsPage.questions.q_misses}</span>
              </Label>
              <Textarea
                value={answers.q_misses}
                onChange={(e) => handleAnswerChange("q_misses", e.target.value)}
                placeholder={t.reviewsPage.questions.q_misses_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>{t.reviewsPage.questions.q_revenue_reflection}</span>
              </Label>
              <Textarea
                value={answers.q_revenue_reflection}
                onChange={(e) => handleAnswerChange("q_revenue_reflection", e.target.value)}
                placeholder={t.reviewsPage.questions.q_revenue_reflection_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>{t.reviewsPage.questions.q_time_drain}</span>
              </Label>
              <Textarea
                value={answers.q_time_drain}
                onChange={(e) => handleAnswerChange("q_time_drain", e.target.value)}
                placeholder={t.reviewsPage.questions.q_time_drain_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: 6 Dimension Scores */}
      {currentStep === 2 && (
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {t.reviewsPage.step2Title}
            </h3>
            <p className="text-xs text-zinc-500">
              {t.reviewsPage.step2Subtitle}
            </p>
          </div>

          <ReviewDimensionsVisualizer
            scores={scores}
            onChangeScore={handleScoreChange}
            interactive={true}
          />
        </div>
      )}

      {/* STEP 3: Strategy & Reflection */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Briefcase className="h-4 w-4 text-indigo-500" />
              <span>{t.reviewsPage.questions.q_client_health}</span>
            </Label>
            <Textarea
              value={answers.q_client_health}
              onChange={(e) => handleAnswerChange("q_client_health", e.target.value)}
              placeholder={t.reviewsPage.questions.q_client_health_ph}
              rows={3}
              className="text-xs rounded-2xl"
            />
          </div>

          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <GraduationCap className="h-4 w-4 text-teal-500" />
              <span>{t.reviewsPage.questions.q_learning_growth}</span>
            </Label>
            <Textarea
              value={answers.q_learning_growth}
              onChange={(e) => handleAnswerChange("q_learning_growth", e.target.value)}
              placeholder={t.reviewsPage.questions.q_learning_growth_ph}
              rows={3}
              className="text-xs rounded-2xl"
            />
          </div>

          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>{t.reviewsPage.questions.q_relationship_check}</span>
            </Label>
            <Textarea
              value={answers.q_relationship_check}
              onChange={(e) => handleAnswerChange("q_relationship_check", e.target.value)}
              placeholder={t.reviewsPage.questions.q_relationship_check_ph}
              rows={3}
              className="text-xs rounded-2xl"
            />
          </div>

          <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Activity className="h-4 w-4 text-orange-500" />
              <span>{t.reviewsPage.questions.q_habits_energy}</span>
            </Label>
            <Textarea
              value={answers.q_habits_energy}
              onChange={(e) => handleAnswerChange("q_habits_energy", e.target.value)}
              placeholder={t.reviewsPage.questions.q_habits_energy_ph}
              rows={3}
              className="text-xs rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Next Week Blueprint */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Play className="h-4 w-4 text-emerald-500" />
                <span>{t.reviewsPage.questions.q_start}</span>
              </Label>
              <Textarea
                value={answers.q_start}
                onChange={(e) => handleAnswerChange("q_start", e.target.value)}
                placeholder={t.reviewsPage.questions.q_start_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                <StopCircle className="h-4 w-4 text-rose-500" />
                <span>{t.reviewsPage.questions.q_stop}</span>
              </Label>
              <Textarea
                value={answers.q_stop}
                onChange={(e) => handleAnswerChange("q_stop", e.target.value)}
                placeholder={t.reviewsPage.questions.q_stop_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Repeat className="h-4 w-4 text-blue-500" />
                <span>{t.reviewsPage.questions.q_continue}</span>
              </Label>
              <Textarea
                value={answers.q_continue}
                onChange={(e) => handleAnswerChange("q_continue", e.target.value)}
                placeholder={t.reviewsPage.questions.q_continue_ph}
                rows={3}
                className="text-xs rounded-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                <Target className="h-4 w-4 text-indigo-500" />
                <span>{t.reviewsPage.questions.q_next_top_three}</span>
              </Label>
              <Textarea
                value={answers.q_next_top_three}
                onChange={(e) => handleAnswerChange("q_next_top_three", e.target.value)}
                placeholder={t.reviewsPage.questions.q_next_top_three_ph}
                rows={4}
                className="text-xs rounded-2xl font-mono"
              />
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <Sliders className="h-4 w-4 text-purple-500" />
                <span>{t.reviewsPage.questions.q_system_tweak}</span>
              </Label>
              <Textarea
                value={answers.q_system_tweak}
                onChange={(e) => handleAnswerChange("q_system_tweak", e.target.value)}
                placeholder={t.reviewsPage.questions.q_system_tweak_ph}
                rows={4}
                className="text-xs rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div>
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              className="text-xs font-bold gap-1.5 cursor-pointer rounded-xl"
            >
              {isRtl ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
              <span>{t.reviewsPage.prevStep}</span>
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentStep < 4 ? (
            <Button
              size="sm"
              onClick={() => setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
              className="text-xs font-bold gap-1.5 cursor-pointer rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              <span>{t.reviewsPage.nextStep}</span>
              {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="text-xs font-bold gap-1.5 cursor-pointer rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.reviewsPage.completeReview}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
