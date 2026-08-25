import { getSession } from "@/lib/dal/auth";
import { LandingView } from "@/components/landing/landing-view";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const session = await getSession();
  const isAuthenticated = Boolean(session?.isAuth);

  return <LandingView isAuthenticated={isAuthenticated} />;
}
