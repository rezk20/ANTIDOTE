import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import type { OpportunityRow } from "@/lib/supabase/types";

export const getOpportunities = cache(async (): Promise<OpportunityRow[]> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOpportunities error:", error);
    return [];
  }

  return (data ?? []) as OpportunityRow[];
});

export const getOpportunityById = cache(
  async (id: string): Promise<OpportunityRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.userId)
      .maybeSingle();

    if (error) {
      console.error("getOpportunityById error:", error);
      return null;
    }

    return (data ?? null) as OpportunityRow | null;
  },
);
