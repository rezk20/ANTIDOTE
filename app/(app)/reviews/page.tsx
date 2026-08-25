import {
  getReviews,
  getCurrentWeekReview,
  getCurrentReviewByType,
  getWeeklyAggregatedMetrics,
  getMonthlyReviewPrefillData,
  getYearlyReviewPrefillData,
  getDailyReviewsHistory,
} from "@/lib/dal/reviews";
import { ReviewsView } from "@/components/reviews/reviews-view";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const today = new Date();

  // Weekly range (last 7 days)
  const weekStartObj = new Date(today);
  weekStartObj.setDate(today.getDate() - 6);
  const weekStart = weekStartObj.toISOString().slice(0, 10);
  const weekEnd = today.toISOString().slice(0, 10);

  // Monthly range (first to last day of current month)
  const y = today.getFullYear();
  const m = today.getMonth();
  const monthStart = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10);
  const monthEnd = new Date(Date.UTC(y, m + 1, 0)).toISOString().slice(0, 10);

  // Quarter range
  const quarterIndex = Math.floor(m / 3);
  const quarterStart = new Date(Date.UTC(y, quarterIndex * 3, 1)).toISOString().slice(0, 10);
  const quarterEnd = new Date(Date.UTC(y, (quarterIndex + 1) * 3, 0)).toISOString().slice(0, 10);

  // Year range
  const yearStr = String(y);
  const yearStart = `${yearStr}-01-01`;
  const yearEnd = `${yearStr}-12-31`;

  const [
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
    dailyReflections,
  ] = await Promise.all([
    getReviews("weekly"),
    getReviews("monthly"),
    getReviews("quarterly"),
    getReviews("yearly"),
    getCurrentWeekReview(weekStart),
    getCurrentReviewByType("monthly", monthStart),
    getCurrentReviewByType("quarterly", quarterStart),
    getCurrentReviewByType("yearly", yearStart),
    getWeeklyAggregatedMetrics(weekStart, weekEnd),
    getMonthlyReviewPrefillData(monthStart, monthEnd),
    getYearlyReviewPrefillData(yearStr),
    getDailyReviewsHistory(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <ReviewsView
        weeklyReviews={weeklyReviews}
        monthlyReviews={monthlyReviews}
        quarterlyReviews={quarterlyReviews}
        yearlyReviews={yearlyReviews}
        currentWeekReview={currentWeekReview}
        currentMonthReview={currentMonthReview}
        currentQuarterReview={currentQuarterReview}
        currentYearReview={currentYearReview}
        weeklyMetrics={weeklyMetrics}
        monthlyMetrics={monthlyMetrics}
        yearlyMetrics={yearlyMetrics}
        weekStart={weekStart}
        weekEnd={weekEnd}
        monthStart={monthStart}
        monthEnd={monthEnd}
        quarterStart={quarterStart}
        quarterEnd={quarterEnd}
        yearStart={yearStart}
        yearEnd={yearEnd}
        dailyReflections={dailyReflections}
      />
    </div>
  );
}
