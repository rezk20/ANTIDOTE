import { getOpportunities } from "@/lib/dal/opportunities";
import { OpportunitiesView } from "@/components/opportunities/opportunities-view";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return <OpportunitiesView opportunities={opportunities} />;
}
