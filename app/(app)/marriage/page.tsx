import { getMarriageDashboardData } from "@/lib/dal/marriage";
import { MarriageView } from "@/components/marriage/marriage-view";

export const dynamic = "force-dynamic";

export default async function MarriagePage() {
  const data = await getMarriageDashboardData();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <MarriageView data={data} />
    </div>
  );
}
