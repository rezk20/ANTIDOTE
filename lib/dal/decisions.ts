import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import type { DecisionRow } from "@/lib/supabase/types";

export const getDecisions = cache(async (): Promise<DecisionRow[]> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getDecisions error:", error);
    return [];
  }

  return (data ?? []) as DecisionRow[];
});

export const getDecisionById = cache(
  async (id: string): Promise<DecisionRow | null> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("decisions")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.userId)
      .maybeSingle();

    if (error) {
      console.error("getDecisionById error:", error);
      return null;
    }

    return (data ?? null) as DecisionRow | null;
  },
);
