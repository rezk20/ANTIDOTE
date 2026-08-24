"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { settingsSchema, type SettingsState } from "@/lib/schemas/settings";

export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await verifySession();

  const validated = settingsSchema.safeParse({
    display_name: formData.get("display_name") || "Ahmed",
    timezone: formData.get("timezone") || "Africa/Cairo",
    currency: formData.get("currency") || "EGP",
    weekly_off_day: formData.get("weekly_off_day") || "friday",
    work_hours_per_day: formData.get("work_hours_per_day") || 8,
    preferred_start_time: formData.get("preferred_start_time") || "09:00",
    primary_stream: formData.get("primary_stream") || "MERN / Next.js Freelance",
    secondary_stream: formData.get("secondary_stream") || "Discord Bots",
    marriage_target_amount: formData.get("marriage_target_amount") || 250000,
    marriage_target_months: formData.get("marriage_target_months") || 12,
    marriage_fallback_months: formData.get("marriage_fallback_months") || 24,
    marriage_housing_strategy:
      formData.get("marriage_housing_strategy") || "Rent initially, buy later",
    proposals_per_week: formData.get("proposals_per_week") || 5,
    outreach_per_day: formData.get("outreach_per_day") || 3,
    relationship_shared_day:
      formData.get("relationship_shared_day") || "friday",
    relationship_budget_preference:
      formData.get("relationship_budget_preference") || "low",
    ai_enabled: formData.get("ai_enabled") === "on",
    ai_relationship_access: formData.get("ai_relationship_access") === "on",
  });

  if (!validated.success) {
    return {
      ok: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
    };
  }

  const d = validated.data;
  const structuredSettings = {
    work_hours_per_day: d.work_hours_per_day,
    preferred_start_time: d.preferred_start_time,
    primary_stream: d.primary_stream,
    secondary_stream: d.secondary_stream,
    marriage: {
      target_amount: d.marriage_target_amount,
      target_months: d.marriage_target_months,
      fallback_months: d.marriage_fallback_months,
      housing_strategy: d.marriage_housing_strategy,
    },
    sales_targets: {
      proposals_per_week: d.proposals_per_week,
      outreach_per_day: d.outreach_per_day,
    },
    relationship: {
      shared_day: d.relationship_shared_day,
      budget_preference: d.relationship_budget_preference,
    },
    ai_enabled: d.ai_enabled,
    ai_relationship_access: d.ai_relationship_access,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: d.display_name,
      timezone: d.timezone,
      currency: d.currency,
      weekly_off_day: d.weekly_off_day,
      settings: structuredSettings as unknown as import("@/lib/supabase/types").Json,
    })
    .eq("id", session.userId);

  if (error) {
    console.error("Failed to update settings in action:", error.message);
    return {
      ok: false,
      message: "Database update failed. Please try again.",
    };
  }

  revalidatePath("/settings");
  revalidatePath("/home");
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Settings saved successfully.",
  };
}
