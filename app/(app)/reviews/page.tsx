import { getReviews, getCurrentWeekReview, getWeeklyAggregatedMetrics, getDailyReviewsHistory } from "@/lib/dal/reviews";
import { ReviewsView } from "@/components/reviews/reviews-view";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 6);

  const periodStart = start.toISOString().slice(0, 10);
  const periodEnd = today.toISOString().slice(0, 10);

  const [reviews, currentWeekReview, metrics, dailyReflections] = await Promise.all([
    getReviews("weekly"),
    getCurrentWeekReview(periodStart),
    getWeeklyAggregatedMetrics(periodStart, periodEnd),
    getDailyReviewsHistory(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <ReviewsView
        reviews={reviews}
        currentWeekReview={currentWeekReview}
        metrics={metrics}
        periodStart={periodStart}
        periodEnd={periodEnd}
        dailyReflections={dailyReflections}
      />
    </div>
  );
}
