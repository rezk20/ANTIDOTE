"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { WeeklyReviewWizard } from "./weekly-review-wizard";
import { MonthlyReviewWizard } from "./monthly-review-wizard";
import { QuarterlyReviewWizard } from "./quarterly-review-wizard";
import { YearlyReviewWizard } from "./yearly-review-wizard";
import { ReviewHistoryCard } from "./review-history-card";
import { ReviewDetailModal } from "./review-detail-modal";
import type { ReviewRow, DayPlanRow } from "@/lib/supabase/types";
import type { WeeklyAggregatedMetrics } from "@/lib/logic/review-metrics";
import type {
  MonthlyPrefillMetrics,
  YearlyPrefillMetrics,
} from "@/lib/logic/review-cadence";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Sparkles,
  Compass,
  Trophy,
  Moon,
  History,
} from "lucide-react";

export type ActiveReviewTab =
  "weekly" | "monthly" | "quarterly" | "yearly" | "daily";

interface ReviewsViewProps {
  weeklyReviews: ReviewRow[];
  monthlyReviews: ReviewRow[];
  quarterlyReviews: ReviewRow[];
  yearlyReviews: ReviewRow[];
  currentWeekReview: ReviewRow | null;
  currentMonthReview: ReviewRow | null;
  currentQuarterReview: ReviewRow | null;
  currentYearReview: ReviewRow | null;
  weeklyMetrics: WeeklyAggregatedMetrics;
  monthlyMetrics: MonthlyPrefillMetrics;
  yearlyMetrics: YearlyPrefillMetrics;
  weekStart: string;
  weekEnd: string;
  monthStart: string;
  monthEnd: string;
  quarterStart: string;
  quarterEnd: string;
  yearStart: string;
  yearEnd: string;
  dailyReflections: DayPlanRow[];
}

export function ReviewsView({
  weeklyReviews,
  monthlyReviews,
  quarterlyReviews,
  yearlyReviews,
  currentWeekReview,
  currentMonthReview,
  currentQuarterReview,
  currentYearReview,
  weeklyMetrics,
  monthlyMetrics,
  yearlyMetrics,
  weekStart,
  weekEnd,
  monthStart,
  monthEnd,
  quarterStart,
  quarterEnd,
  yearStart,
  yearEnd,
  dailyReflections,
}: ReviewsViewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<ActiveReviewTab>("weekly");
  const [isWeeklyWizardOpen, setIsWeeklyWizardOpen] = useState(false);
  const [isMonthlyWizardOpen, setIsMonthlyWizardOpen] = useState(false);
  const [isQuarterlyWizardOpen, setIsQuarterlyWizardOpen] = useState(false);
  const [isYearlyWizardOpen, setIsYearlyWizardOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewRow | null>(null);

  const closeAllWizards = () => {
    setIsWeeklyWizardOpen(false);
    setIsMonthlyWizardOpen(false);
    setIsQuarterlyWizardOpen(false);
    setIsYearlyWizardOpen(false);
    setEditingReview(null);
  };

  const handleEdit = (review: ReviewRow) => {
    setEditingReview(review);
    if (review.review_type === "weekly") setIsWeeklyWizardOpen(true);
    else if (review.review_type === "monthly") setIsMonthlyWizardOpen(true);
    else if (review.review_type === "quarterly") setIsQuarterlyWizardOpen(true);
    else if (review.review_type === "yearly") setIsYearlyWizardOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.reviewsPage.title}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t.reviewsPage.subtitle}
          </p>
        </div>

        {/* Cadence Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-zinc-200 bg-zinc-100 p-1 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800">
          <button
            onClick={() => {
              setActiveTab("weekly");
              closeAllWizards();
            }}
            className={`cursor-pointer rounded-xl px-3 py-1.5 transition-all ${
              activeTab === "weekly"
                ? "bg-white font-black text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.weeklyTab}
          </button>

          <button
            onClick={() => {
              setActiveTab("monthly");
              closeAllWizards();
            }}
            className={`cursor-pointer rounded-xl px-3 py-1.5 transition-all ${
              activeTab === "monthly"
                ? "bg-white font-black text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.monthlyTab}
          </button>

          <button
            onClick={() => {
              setActiveTab("quarterly");
              closeAllWizards();
            }}
            className={`cursor-pointer rounded-xl px-3 py-1.5 transition-all ${
              activeTab === "quarterly"
                ? "bg-white font-black text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.quarterlyTab}
          </button>

          <button
            onClick={() => {
              setActiveTab("yearly");
              closeAllWizards();
            }}
            className={`cursor-pointer rounded-xl px-3 py-1.5 transition-all ${
              activeTab === "yearly"
                ? "bg-white font-black text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.yearlyTab}
          </button>

          <button
            onClick={() => {
              setActiveTab("daily");
              closeAllWizards();
            }}
            className={`cursor-pointer rounded-xl px-3 py-1.5 transition-all ${
              activeTab === "daily"
                ? "bg-white font-black text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.reviewsPage.dailyTab}
          </button>
        </div>
      </div>

      {/* TAB 1: Weekly Reviews */}
      {activeTab === "weekly" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          {!isWeeklyWizardOpen && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-6 shadow-xs sm:flex-row sm:items-center dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {currentWeekReview
                        ? t.reviewsPage.editReview
                        : t.reviewsPage.startWeeklyReview}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {t.reviewsPage.weekOf} ({weekStart} → {weekEnd})
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setEditingReview(currentWeekReview);
                  setIsWeeklyWizardOpen(true);
                }}
                className="cursor-pointer rounded-2xl bg-indigo-600 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                {currentWeekReview
                  ? t.reviewsPage.editReview
                  : t.reviewsPage.startWeeklyReview}
              </Button>
            </div>
          )}

          {isWeeklyWizardOpen && (
            <WeeklyReviewWizard
              initialReview={editingReview}
              metrics={weeklyMetrics}
              periodStart={weekStart}
              periodEnd={weekEnd}
              onClose={() => {
                setIsWeeklyWizardOpen(false);
                setEditingReview(null);
              }}
            />
          )}

          {/* History */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
              <History className="h-4 w-4 text-zinc-500" />
              {t.reviewsPage.reviewHistory} ({weeklyReviews.length})
            </h3>

            {weeklyReviews.length === 0 ? (
              <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-bold text-zinc-500">
                  {t.reviewsPage.noReviewsTitle}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {weeklyReviews.map((rev) => (
                  <ReviewHistoryCard
                    key={rev.id}
                    review={rev}
                    onViewDetails={setSelectedReview}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Monthly Reviews  */}
      {activeTab === "monthly" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          {!isMonthlyWizardOpen && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 p-6 shadow-xs sm:flex-row sm:items-center dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {currentMonthReview
                        ? "تعديل المراجعة الشهرية "
                        : "بدء المراجعة الشهرية الشاملة "}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      شهر {monthStart.slice(0, 7)} ({monthStart} → {monthEnd})
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setEditingReview(currentMonthReview);
                  setIsMonthlyWizardOpen(true);
                }}
                className="cursor-pointer rounded-2xl bg-purple-600 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                {currentMonthReview ? "تعديل المراجعة" : "بدء مراجعة الشهر"}
              </Button>
            </div>
          )}

          {isMonthlyWizardOpen && (
            <MonthlyReviewWizard
              initialReview={editingReview}
              metrics={monthlyMetrics}
              periodStart={monthStart}
              periodEnd={monthEnd}
              onClose={() => {
                setIsMonthlyWizardOpen(false);
                setEditingReview(null);
              }}
            />
          )}

          {/* History */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
              <History className="h-4 w-4 text-purple-500" />
              سجل المراجعات الشهرية ({monthlyReviews.length})
            </h3>

            {monthlyReviews.length === 0 ? (
              <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-bold text-zinc-500">
                  لا توجد مراجعات شهرية مسجلة بعد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {monthlyReviews.map((rev) => (
                  <ReviewHistoryCard
                    key={rev.id}
                    review={rev}
                    onViewDetails={setSelectedReview}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Quarterly Reviews  */}
      {activeTab === "quarterly" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          {!isQuarterlyWizardOpen && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 shadow-xs sm:flex-row sm:items-center dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                    <Compass className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {currentQuarterReview
                        ? "تعديل المراجعة الربع سنوية "
                        : "بدء المراجعة الاستراتيجية للربع السنوي "}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      الفترة: ({quarterStart} → {quarterEnd})
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setEditingReview(currentQuarterReview);
                  setIsQuarterlyWizardOpen(true);
                }}
                className="cursor-pointer rounded-2xl bg-blue-600 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                <Compass className="mr-1.5 h-4 w-4" />
                {currentQuarterReview ? "تعديل المراجعة" : "بدء مراجعة الربع"}
              </Button>
            </div>
          )}

          {isQuarterlyWizardOpen && (
            <QuarterlyReviewWizard
              initialReview={editingReview}
              periodStart={quarterStart}
              periodEnd={quarterEnd}
              onClose={() => {
                setIsQuarterlyWizardOpen(false);
                setEditingReview(null);
              }}
            />
          )}

          {/* History */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
              <History className="h-4 w-4 text-blue-500" />
              سجل المراجعات الربع سنوية ({quarterlyReviews.length})
            </h3>

            {quarterlyReviews.length === 0 ? (
              <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-bold text-zinc-500">
                  لا توجد مراجعات ربع سنوية مسجلة بعد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {quarterlyReviews.map((rev) => (
                  <ReviewHistoryCard
                    key={rev.id}
                    review={rev}
                    onViewDetails={setSelectedReview}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Year in Review  */}
      {activeTab === "yearly" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          {!isYearlyWizardOpen && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 p-6 shadow-xs sm:flex-row sm:items-center dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                      {currentYearReview
                        ? "تعديل حصاد ومراجعة العام (Year in Review )"
                        : `بدء حصاد ومراجعة عام ${yearStart.slice(0, 4)} (Year in Review )`}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      استرجاع شامل لمسار العام كاملاً: الأرقام، الدروس، والتحول
                      الشخصي.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setEditingReview(currentYearReview);
                  setIsYearlyWizardOpen(true);
                }}
                className="cursor-pointer rounded-2xl bg-amber-600 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
              >
                <Trophy className="mr-1.5 h-4 w-4" />
                {currentYearReview ? "تعديل المراجعة" : "فتح حصاد العام"}
              </Button>
            </div>
          )}

          {isYearlyWizardOpen && (
            <YearlyReviewWizard
              initialReview={editingReview}
              metrics={yearlyMetrics}
              periodStart={yearStart}
              periodEnd={yearEnd}
              onClose={() => {
                setIsYearlyWizardOpen(false);
                setEditingReview(null);
              }}
            />
          )}

          {/* History */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
              <History className="h-4 w-4 text-amber-500" />
              سجل مراجعات نهاية العام ({yearlyReviews.length})
            </h3>

            {yearlyReviews.length === 0 ? (
              <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-bold text-zinc-500">
                  لا توجد مراجعات سنوية مسجلة بعد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {yearlyReviews.map((rev) => (
                  <ReviewHistoryCard
                    key={rev.id}
                    review={rev}
                    onViewDetails={setSelectedReview}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Daily Reflections */}
      {activeTab === "daily" && (
        <div className="animate-in fade-in space-y-4 duration-150">
          <div className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
            <Moon className="h-4 w-4 text-purple-500" />
            <h3>{t.reviewsPage.dailyReflectionsTitle}</h3>
          </div>

          {dailyReflections.length === 0 ? (
            <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-bold text-zinc-500">
                {t.reviewsPage.noDailyReflections}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {dailyReflections.map((plan) => (
                <div
                  key={plan.id}
                  className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-500">
                      {plan.plan_date}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        plan.status === "closed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {plan.status === "closed" ? "مكتمل ومغلق" : "مفتوح"}
                    </span>
                  </div>

                  {plan.notes && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-400">
                        ملاحظات الإغلاق والتأمل:
                      </div>
                      <p className="text-xs whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                        {plan.notes}
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
      {selectedReview && (
        <ReviewDetailModal
          isOpen={!!selectedReview}
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}
