import { describe, it, expect } from "vitest";
import { habitFormSchema, toggleHabitLogSchema } from "@/lib/schemas/habits";
import { calculateHabitStats } from "@/lib/logic/habits";
import type { HabitRow, HabitLogRow } from "@/lib/supabase/types";

describe("Habits Module", () => {
  describe("Habits Zod Schemas", () => {
    it("validates valid habit form data", () => {
      const valid = {
        name: "جلسة عمل عميق 90 دقيقة",
        description: "تركيز تام بدون مشتتات",
        category: "deep_work",
        target_per_week: 6,
        is_active: true,
        sort_order: 1,
      };
      const result = habitFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects empty habit name and invalid targets", () => {
      const invalid = {
        name: "",
        category: "deep_work",
        target_per_week: 10, // Max 7
      };
      const result = habitFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("validates toggle habit log schema", () => {
      const valid = {
        habit_id: "123e4567-e89b-12d3-a456-426614174000",
        log_date: "2026-08-25",
        completed: true,
      };
      expect(toggleHabitLogSchema.safeParse(valid).success).toBe(true);

      const invalid = {
        habit_id: "invalid-uuid",
        log_date: "25-08-2026",
        completed: true,
      };
      expect(toggleHabitLogSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("calculateHabitStats & Restart Today", () => {
    const sampleHabit: HabitRow = {
      id: "h1",
      user_id: "u1",
      name: "قراءة 30 دقيقة",
      description: null,
      category: "learning",
      target_per_week: 5,
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const weekDates = [
      "2026-08-19",
      "2026-08-20",
      "2026-08-21",
      "2026-08-22",
      "2026-08-23",
      "2026-08-24",
      "2026-08-25",
    ];

    it("computes completed days, weekly progress, and streaks accurately", () => {
      const logs: HabitLogRow[] = [
        {
          id: "l1",
          user_id: "u1",
          habit_id: "h1",
          log_date: "2026-08-23",
          note: null,
          created_at: new Date().toISOString(),
        },
        {
          id: "l2",
          user_id: "u1",
          habit_id: "h1",
          log_date: "2026-08-24",
          note: null,
          created_at: new Date().toISOString(),
        },
        {
          id: "l3",
          user_id: "u1",
          habit_id: "h1",
          log_date: "2026-08-25",
          note: null,
          created_at: new Date().toISOString(),
        },
      ];

      const stats = calculateHabitStats({
        habit: sampleHabit,
        logs,
        weekDates,
        todayDate: "2026-08-25",
      });

      expect(stats.completedToday).toBe(true);
      expect(stats.completedDaysThisWeek).toBe(3);
      expect(stats.weeklyProgressPercent).toBe(60); // 3 / 5 * 100
      expect(stats.currentStreak).toBe(3);
      expect(stats.needsRestartToday).toBe(false);
    });

    it("triggers needsRestartToday without guilt when streak is broken", () => {
      const logs: HabitLogRow[] = [];

      const stats = calculateHabitStats({
        habit: sampleHabit,
        logs,
        weekDates,
        todayDate: "2026-08-25",
      });

      expect(stats.completedToday).toBe(false);
      expect(stats.completedDaysThisWeek).toBe(0);
      expect(stats.currentStreak).toBe(0);
      expect(stats.needsRestartToday).toBe(true);
    });
  });
});
