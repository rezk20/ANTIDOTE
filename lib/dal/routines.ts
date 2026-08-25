import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import { DEFAULT_ROUTINES_SEED } from "@/lib/logic/routines";
import type { RoutineRow, Json } from "@/lib/supabase/types";

export const getRoutines = cache(async (): Promise<RoutineRow[]> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("routines")
    .select("*")
    .eq("user_id", session.userId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching routines:", error);
    return [];
  }

  if (!data || data.length === 0) {
    // Auto-seed 4 routine templates
    const toInsert = DEFAULT_ROUTINES_SEED.map((r) => ({
      user_id: session.userId,
      name: r.name,
      time_of_day: r.time_of_day,
      items: r.items as unknown as Json,
      sort_order: r.sort_order,
      is_active: true,
    }));

    const { data: seeded } = await supabase
      .from("routines")
      .insert(toInsert)
      .select("*");

    return (seeded ?? []) as RoutineRow[];
  }

  return data as RoutineRow[];
});
