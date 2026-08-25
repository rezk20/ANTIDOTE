import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import { DEFAULT_HABITS_SEED, calculateHabitStats, type HabitWithStats } from "@/lib/logic/habits";
import type { HabitRow, HabitLogRow } from "@/lib/supabase/types";

export const getHabitsWithLogs = cache(
  async (params?: { weekDates?: string[]; todayDate?: string }): Promise<HabitWithStats[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const todayDate = params?.todayDate || new Date().toISOString().slice(0, 10);
    
    // Generate default 7-day window if not provided
    let weekDates = params?.weekDates;
    if (!weekDates || weekDates.length === 0) {
      weekDates = [];
      const base = new Date(todayDate);
      for (let i = 6; i >= 0; i--) {
        const d = new Date(base);
        d.setDate(d.getDate() - i);
        weekDates.push(d.toISOString().slice(0, 10));
      }
    }

    const { data: habitsData, error: habitsErr } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", session.userId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (habitsErr) {
      console.error("Error fetching habits:", habitsErr);
      return [];
    }

    let habits = (habitsData ?? []) as HabitRow[];

    // Auto-seed default habits if none exist
    if (habits.length === 0) {
      const toInsert = DEFAULT_HABITS_SEED.map((h) => ({
        user_id: session.userId,
        name: h.name,
        description: h.description,
        category: h.category,
        target_per_week: h.target_per_week,
        sort_order: h.sort_order,
        is_active: true,
      }));

      const { data: seeded } = await supabase
        .from("habits")
        .insert(toInsert)
        .select("*");

      habits = (seeded ?? []) as HabitRow[];
    }

    // Fetch logs for current window
    const minDate = weekDates[0];
    const maxDate = weekDates[weekDates.length - 1];

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", session.userId)
      .gte("log_date", minDate)
      .lte("log_date", maxDate);

    const logs = (logsData ?? []) as HabitLogRow[];

    return habits.map((habit) =>
      calculateHabitStats({
        habit,
        logs,
        weekDates: weekDates!,
        todayDate,
      })
    );
  },
);
