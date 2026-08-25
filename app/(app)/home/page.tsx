import { getDashboardSummary } from "@/lib/dal/day-plan";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardSummary();

  return <DashboardView data={data} />;
}
