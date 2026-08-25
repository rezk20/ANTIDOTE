import { getDecisions } from "@/lib/dal/decisions";
import { DecisionsView } from "@/components/decisions/decisions-view";

export const dynamic = "force-dynamic";

export default async function DecisionsPage() {
  const decisions = await getDecisions();

  return <DecisionsView decisions={decisions} />;
}
