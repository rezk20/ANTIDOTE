import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import { calculateWeeklyTimeDistribution, type WeeklyTimeDistribution } from "@/lib/logic/time-tracking";
import type { TimeEntryRow } from "@/lib/supabase/types";

export const getTimeEntriesForRange = cache(
  async (startDate: string, endDate: string): Promise<TimeEntryRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", session.userId)
      .gte("started_at", `${startDate}T00:00:00Z`)
      .lte("started_at", `${endDate}T23:59:59Z`)
      .order("started_at", { ascending: false });

    if (error) {
      console.error("Error fetching time entries:", error);
      return [];
    }

    return (data ?? []) as TimeEntryRow[];
  },
);

export const getWeeklyTimeAnalytics = cache(
  async (startDate?: string, endDate?: string): Promise<{ entries: TimeEntryRow[]; distribution: WeeklyTimeDistribution }> => {
    const now = new Date();
    const end = endDate || now.toISOString().slice(0, 10);
    const startObj = new Date(end);
    startObj.setDate(startObj.getDate() - 6);
    const start = startDate || startObj.toISOString().slice(0, 10);

    const entries = await getTimeEntriesForRange(start, end);
    const distribution = calculateWeeklyTimeDistribution(entries);

    return { entries, distribution };
  },
);
