import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import type { BrainDumpRow } from "@/lib/supabase/types";

/**
 * Fetch all inbox brain dumps for the authenticated owner.
 * Memoized per render pass with cache().
 */
export const getBrainDumps = cache(
  async (
    status?: "inbox" | "converted" | "archived" | "all",
  ): Promise<BrainDumpRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("brain_dumps")
      .select("*")
      .eq("user_id", session.userId);

    if (status && status !== "all") {
      query = query.eq("status", status);
    } else if (!status) {
      query = query.eq("status", "inbox");
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Failed to fetch brain dumps in DAL:", error.message);
      return [];
    }

    return (data ?? []) as BrainDumpRow[];
  },
);

/**
 * Get count of active inbox dumps.
 */
export const getInboxDumpsCount = cache(async (): Promise<number> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("brain_dumps")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.userId)
    .eq("status", "inbox");

  if (error) {
    console.error("Failed to fetch inbox dumps count in DAL:", error.message);
    return 0;
  }

  return count ?? 0;
});
