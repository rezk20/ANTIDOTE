import { getFinanceSummary } from "@/lib/dal/finance";
import { FinanceDashboard } from "@/components/finance/finance-dashboard";

export const dynamic = "force-dynamic";

export default async function FinancesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const data = await getFinanceSummary(month);

  return <FinanceDashboard data={data} />;
}
