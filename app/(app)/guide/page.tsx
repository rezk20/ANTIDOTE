import { verifySession } from "@/lib/dal/auth";
import { GuideView } from "@/components/guide/guide-view";

export const dynamic = "force-dynamic";

export default async function GuidePage() {
  await verifySession();
  return <GuideView />;
}
