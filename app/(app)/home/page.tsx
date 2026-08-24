import { verifySession, getProfile, getHomeSummary } from "@/lib/dal/auth";
import { HomeView } from "@/components/home/home-view";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await verifySession();
  const profile = await getProfile();
  const summary = await getHomeSummary();

  return <HomeView profile={profile} summary={summary} />;
}
