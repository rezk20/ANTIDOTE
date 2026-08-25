import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const adminClient = createSupabaseAdminClient();
      const userId = data.user.id;

      // 1. Ensure profile row exists for new OAuth / SaaS users
      const { data: existingProfile } = await adminClient
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (!existingProfile) {
        const apiKey = `lsk_${crypto.randomBytes(24).toString("hex")}`;
        const displayName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "User";

        await adminClient.from("profiles").insert({
          id: userId,
          email: data.user.email ?? null,
          display_name: displayName,
          timezone: "Africa/Cairo",
          currency: "EGP",
          weekly_off_day: "friday",
          agent_api_key: apiKey,
          settings: {
            comfortIncomeTarget: 30000,
            agent_api_key: apiKey,
            marriage: {
              targetBudget: 250000,
              targetDate: "2027-12-31",
            },
          },
        });

        // 2. Initialize default standard financial buckets for the new tenant
        await adminClient.from("buckets").insert([
          {
            user_id: userId,
            name: "صندوق الزواج (Marriage Fund)",
            kind: "marriage",
            target_amount: 250000,
            starting_balance: 0,
            is_active: true,
          },
          {
            user_id: userId,
            name: "صندوق الطوارئ (Emergency Fund)",
            kind: "emergency",
            target_amount: 50000,
            starting_balance: 0,
            is_active: true,
          },
          {
            user_id: userId,
            name: "المصاريف الشخصية (Personal Expenses)",
            kind: "personal",
            target_amount: 15000,
            starting_balance: 0,
            is_active: true,
          },
          {
            user_id: userId,
            name: "العمل والبيزنس (Business Operations)",
            kind: "business",
            target_amount: 30000,
            starting_balance: 0,
            is_active: true,
          },
        ]);
      }

      return NextResponse.redirect(`${origin}/home`);
    }
  }

  // URL to redirect to after sign in process completes with error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
