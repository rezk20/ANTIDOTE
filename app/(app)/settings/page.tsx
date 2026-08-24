import { getProfile } from "@/lib/dal/auth";
import { PageHeader } from "@/components/ui/page-header";
import { SettingsForm } from "@/components/settings/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Settings & Mission Targets"
        description="Configure your working profile, financial targets, revenue pipelines, and system preferences."
      />

      <SettingsForm profile={profile} />
    </div>
  );
}
