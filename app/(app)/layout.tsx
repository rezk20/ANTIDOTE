import { verifySession, getProfile } from "@/lib/dal/auth";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();
  const profile = await getProfile();

  return <AppShell profile={profile}>{children}</AppShell>;
}
