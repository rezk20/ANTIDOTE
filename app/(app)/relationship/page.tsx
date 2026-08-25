import { getRelationshipDashboardData } from "@/lib/dal/relationship";
import { RelationshipView } from "@/components/relationship/relationship-view";

export const dynamic = "force-dynamic";

export default async function RelationshipPage() {
  const data = await getRelationshipDashboardData();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <RelationshipView data={data} />
    </div>
  );
}
