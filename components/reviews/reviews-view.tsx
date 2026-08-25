"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { WeeklyReviewWizard } from "./weekly-review-wizard";
import { ReviewHistoryCard } from "./review-history-card";
import { ReviewDetailModal } from "./review-detail-modal";
import type { ReviewRow, DayPlanRow } from "@/lib/supabase/types";
import type { WeeklyAggregatedMetrics } from "@/lib/logic/review-metrics";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Sparkles,
  Moon,
  Flame,
  Award,
  History,
} from "lucide-react";

interface ReviewsViewProps {
  reviews: ReviewRow[];
  currentWeekReview: ReviewRow | null;
  metrics: WeeklyAggregatedMetrics;
  periodStart: string;
  periodEnd: string;
  dailyReflections: DayPlanRow[];
}

export function ReviewsView({
  reviews,
  currentWeekReview,
  metrics,
  periodStart,
  periodEnd,
  dailyReflections,
}: ReviewsViewProps) {
  const { t, isRtl } = useLocale();
  const [activeTab, setActiveTab] = useState<"weekly" | "daily">("weekly");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewRow | null>(null);

  const handleStartReview = () => {
    setEditingReview(currentWeekReview);
    setIsWizardOpen(true);
  };

  const handleEditReview = (review: ReviewRow) => {
    setEditingReview(review);
    setIsWizardOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.reviewsPage.title}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t.reviewsPage.subtitle}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab("weekly");
              setIsWizardOpen(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "weekly"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-black"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.weeklyTab}
          </button>

          <button
            onClick={() => {
              setActiveTab("daily");
              setIsWizardOpen(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "daily"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-black"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.dailyTab}
          </button>
        </div>
      </div>

      {/* TAB 1: Weekly Reviews */}
      {activeTab === "weekly" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Wizard or Hub View */}
          {isWizardOpen ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWizardOpen(false)}
                  className="text-xs font-bold rounded-xl cursor-pointer"
                >
                  {isRtl ? "← العودة إلى سجل المراجعات" : "← Back to Reviews Timeline"}
                </Button>
              </div>

              <WeeklyReviewWizard
                initialReview={editingReview}
                metrics={metrics}
                periodStart={periodStart}
                periodEnd={periodEnd}
                onFinished={() => setIsWizardOpen(false)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Friday Review Callout Hero Banner */}
              <div className="relative overflow-hidden p-6 rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                        {currentWeekReview ? "مراجعة الأسبوع مكتملة" : "جاهز للمراجعة الأسبوعية"}
                      </span>
                      <span className="text-xs text-zinc-400 font-bold">
                        {periodStart} → {periodEnd}
                      </span>
                    </div>

                    <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {currentWeekReview
                        ? "أحسنت! قمت بإتمام مراجعة هذا الأسبوع بنجاح"
                        : "حان وقت مراجعة الأسبوع والتحضير للانطلاقة القادمة"}
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {currentWeekReview
                        ? "تم تسجيل جميع الأرقام والأبعاد وتقييم التوازن. يمكنك تعديل المراجعة أو مراجعة التفاصيل في أي وقت."
                        : "استعرض أرقام إيراداتك ومصروفاتك، قيم أبعادك الستة، وحدد أهم ٣ أولويات للأسبوع الجديد."}
                    </p>
                  </div>

                  <Button
                    onClick={handleStartReview}
                    className="rounded-2xl text-xs font-black gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {currentWeekReview
                        ? t.reviewsPage.editReview
                        : t.reviewsPage.startWeeklyReview}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Past Reviews Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <History className="h-4 w-4 text-zinc-400" />
                    <span>{t.reviewsPage.reviewHistory} ({reviews.length})</span>
                  </h3>
                </div>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                    <Award className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
                    <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {t.reviewsPage.noReviewsTitle}
                    </h4>
                    <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                      {t.reviewsPage.noReviewsDesc}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <ReviewHistoryCard
                        key={rev.id}
                        review={rev}
                        onViewDetails={(r) => setSelectedReview(r)}
                        onEdit={handleEditReview}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Daily Reflections */}
      {activeTab === "daily" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              <span>{t.reviewsPage.dailyReflectionsTitle} ({dailyReflections.length})</span>
            </h3>
          </div>

          {dailyReflections.length === 0 ? (
            <div className="p-8 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
              <Moon className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.reviewsPage.noDailyReflections}
              </h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dailyReflections.map((dp) => (
                <div
                  key={dp.id}
                  className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                        {dp.plan_date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Flame className="h-3 w-3" />
                        <span>طاقة {dp.energy}/5</span>
                      </span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">
                        {dp.available_hours} ساعات
                      </span>
                    </div>
                  </div>

                  {dp.focus_question_answer && (
                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400">
                        إجابة سؤال التركيز اليومي:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
                        {dp.focus_question_answer}
                      </p>
                    </div>
                  )}

                  {dp.notes && (
                    <div className="p-3 rounded-2xl bg-amber-50/30 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        تأملات الإغلاق والملاحظات:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
                        {dp.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Detail Modal */}
      <ReviewDetailModal
        isOpen={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        review={selectedReview}
      />
    </div>
  );
}
