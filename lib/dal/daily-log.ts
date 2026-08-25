import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import { evaluateCapacityAdvice, type CapacityAdvice } from "@/lib/logic/daily-log";
import type { DailyLogRow } from "@/lib/supabase/types";

export const getDailyLogForDate = cache(
  async (dateStr?: string): Promise<{ log: DailyLogRow | null; advice: CapacityAdvice }> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const targetDate = dateStr || new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", session.userId)
      .eq("log_date", targetDate)
      .maybeSingle();

    if (error) {
      console.error("Error fetching daily log:", error);
    }

    const log = data ? (data as DailyLogRow) : null;
    const advice = evaluateCapacityAdvice({
      energy: log?.energy ?? null,
      sleepHours: log?.hours_slept ? Number(log.hours_slept) : null,
    });

    return { log, advice };
  },
);

export const getRecentDailyLogs = cache(
  async (limit: number = 14): Promise<DailyLogRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", session.userId)
      .order("log_date", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent daily logs:", error);
      return [];
    }

    return (data ?? []) as DailyLogRow[];
  },
);
