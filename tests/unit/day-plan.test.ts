import { describe, it, expect } from "vitest";
import {
  calculateDayPlanCapacity,
  isFridayRuleActive,
  materializeRecurringTaskCandidates,
  calculateShutdownSummary,
} from "@/lib/logic/day-plan";
import {
  getLocalDateString,
  getTomorrowDateString,
  parseDateSafeNoon,
} from "@/lib/logic/timezone";
import {
  dayPlanSchema,
  shutdownSchema,
} from "@/lib/schemas/day-plan";
import type { TaskRow } from "@/lib/supabase/types";

describe("Day Plan Pure Logic & Calculations", () => {
  describe("Timezone & Date Utilities", () => {
    it("formats local date correctly for Cairo timezone even across midnight UTC", () => {
      // 2026-08-24T23:50:00Z is 2026-08-25 02:50:00 AM in Africa/Cairo (UTC+3)
      const lateNightUtc = new Date("2026-08-24T23:50:00Z");
      const cairoDate = getLocalDateString("Africa/Cairo", lateNightUtc);
      expect(cairoDate).toBe("2026-08-25");
    });

    it("computes tomorrow date correctly from base date string", () => {
      const tomorrow = getTomorrowDateString("2026-08-25");
      expect(tomorrow).toBe("2026-08-26");
    });

    it("parses date safe noon avoiding DST / timezone rollover", () => {
      const dateObj = parseDateSafeNoon("2026-08-25");
      expect(dateObj.getFullYear()).toBe(2026);
      expect(dateObj.getMonth()).toBe(7); // 0-indexed August
      expect(dateObj.getDate()).toBe(25);
      expect(dateObj.getHours()).toBe(12);
    });
  });
  describe("calculateDayPlanCapacity", () => {
    it("calculates planned hours correctly with default and custom durations", () => {
      const tasks = [
        { status: "planned", duration_min: 60 },
        { status: "planned", duration_min: 90 },
        { status: "in_progress", duration_min: null }, // defaults to 45 min
        { status: "done", duration_min: 60 }, // done tasks excluded from active load
      ] as TaskRow[];

      const result = calculateDayPlanCapacity(tasks, 6.0, 3);
      // 60 + 90 + 45 = 195 min = 3.25h -> 3.3h
      expect(result.totalPlannedMinutes).toBe(195);
      expect(result.totalPlannedHours).toBe(3.3);
      expect(result.availableHours).toBe(6.0);
      expect(result.effectiveCapacityHours).toBe(6.0);
      expect(result.isOverloaded).toBe(false);
      expect(result.capacityPercentage).toBe(55); // (3.3 / 6.0) * 100
      expect(result.tasksCount).toBe(3);
    });

    it("flags overload when planned hours exceed available capacity", () => {
      const tasks = [
        { status: "planned", duration_min: 120 },
        { status: "planned", duration_min: 180 },
        { status: "planned", duration_min: 120 },
      ] as TaskRow[]; // 420 min = 7.0h

      const result = calculateDayPlanCapacity(tasks, 5.0, 3);
      expect(result.totalPlannedHours).toBe(7.0);
      expect(result.isOverloaded).toBe(true);
      expect(result.capacityPercentage).toBe(140);
    });

    it("adjusts effective capacity down for low energy levels (energy 1-2)", () => {
      const tasks = [{ status: "planned", duration_min: 180 }] as TaskRow[];

      const lowEnergy = calculateDayPlanCapacity(tasks, 6.0, 2);
      expect(lowEnergy.effectiveCapacityHours).toBe(4.5); // 6.0 * 0.75

      const highEnergy = calculateDayPlanCapacity(tasks, 6.0, 5);
      expect(highEnergy.effectiveCapacityHours).toBe(6.6); // 6.0 * 1.1
    });
  });

  describe("isFridayRuleActive", () => {
    it("returns true on Fridays and false on other days", () => {
      // 2026-08-28 is a Friday
      expect(isFridayRuleActive("2026-08-28")).toBe(true);
      // 2026-08-25 is a Tuesday
      expect(isFridayRuleActive("2026-08-25")).toBe(false);
      // 2026-08-29 is a Saturday
      expect(isFridayRuleActive("2026-08-29")).toBe(false);
    });
  });

  describe("materializeRecurringTaskCandidates", () => {
    it("idempotently generates candidate daily and weekly tasks without duplicates", () => {
      const sourceTasks = [
        {
          id: "task-rec-1",
          title: "Daily Upwork Outreach",
          recurring_rule: "daily",
          status: "backlog",
          area: "work",
          task_type: "revenue",
          priority: "high",
          duration_min: 30,
        },
        {
          id: "task-rec-2",
          title: "Weekly Friday Financial Review",
          recurring_rule: "weekly:friday",
          status: "backlog",
          area: "money",
          task_type: "finance",
          priority: "medium",
          duration_min: 45,
        },
      ] as TaskRow[];

      // Target Friday 2026-08-28
      const existingTasks = [
        {
          id: "task-existing-1",
          recurring_source_id: "task-rec-1",
          scheduled_date: "2026-08-28",
        },
      ] as TaskRow[];

      const candidates = materializeRecurringTaskCandidates(
        sourceTasks,
        "2026-08-28",
        existingTasks,
      );

      // task-rec-1 is already materialized, so only task-rec-2 should be returned
      expect(candidates.length).toBe(1);
      expect(candidates[0].recurring_source_id).toBe("task-rec-2");
      expect(candidates[0].scheduled_date).toBe("2026-08-28");
      expect(candidates[0].title).toBe("Weekly Friday Financial Review");
    });
  });

  describe("calculateShutdownSummary", () => {
    it("computes completion rate, top-3 achievements, and rollover tasks", () => {
      const todayTasks = [
        { id: "t1", title: "Task 1", is_top_three: true, status: "done" },
        { id: "t2", title: "Task 2", is_top_three: true, status: "done" },
        { id: "t3", title: "Task 3", is_top_three: true, status: "planned" },
        { id: "t4", title: "Task 4", is_top_three: false, status: "in_progress" },
        { id: "t5", title: "Task 5", is_top_three: false, status: "dropped" },
      ] as TaskRow[];

      const summary = calculateShutdownSummary(todayTasks);
      expect(summary.totalTasks).toBe(5);
      expect(summary.completedCount).toBe(2);
      expect(summary.completionRate).toBe(40); // 2 / 5
      expect(summary.topThreeCount).toBe(3);
      expect(summary.topThreeCompleted).toBe(2);
      expect(summary.rolloverTasks.map((t) => t.id)).toEqual(["t3", "t4"]);
    });
  });

  describe("dayPlanSchema validation", () => {
    it("validates day plan inputs with optional slots and empty strings", () => {
      const valid = {
        plan_date: "2026-08-25",
        available_hours: "5.5",
        energy: "4",
        focus_question_answer: "Ship Discord Bot proposal",
        money_action_task_id: "",
        personal_action_task_id: "",
        relationship_action_task_id: "",
        shutdown_time: "18:00",
        status: "active",
      };

      const parsed = dayPlanSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.available_hours).toBe(5.5);
        expect(parsed.data.energy).toBe(4);
        expect(parsed.data.money_action_task_id).toBeNull();
      }
    });

    it("validates shutdown payload", () => {
      const validShutdown = {
        plan_date: "2026-08-25",
        tomorrow_focus: "Deliver project client sprint",
        shutdown_notes: "Solid deep work session",
        rollover_task_ids: ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"],
      };

      const parsed = shutdownSchema.safeParse(validShutdown);
      expect(parsed.success).toBe(true);
    });
  });
});
