import { getAnalyticsSummary } from "@/lib/dal/analytics";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getAnalyticsSummary();

  return <AnalyticsView data={data} />;
}
