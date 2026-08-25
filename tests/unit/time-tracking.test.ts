import { describe, it, expect } from "vitest";
import { timeEntryFormSchema, timerSessionSchema } from "@/lib/schemas/time-entry";
import {
  calculateDurationMin,
  calculateWeeklyTimeDistribution,
} from "@/lib/logic/time-tracking";
import type { TimeEntryRow } from "@/lib/supabase/types";

describe("Time Tracking Module", () => {
  describe("Schemas", () => {
    it("validates time entry form schema", () => {
      const valid = {
        kind: "deep_work",
        started_at: "2026-08-25T09:00:00Z",
        ended_at: "2026-08-25T10:30:00Z",
        duration_min: 90,
        focus_rating: 5,
        note: "Built habits view",
      };
      expect(timeEntryFormSchema.safeParse(valid).success).toBe(true);
    });

    it("validates timer session schema", () => {
      const valid = {
        kind: "sales",
        started_at: "2026-08-25T14:00:00Z",
        ended_at: "2026-08-25T14:45:00Z",
        focus_rating: 4,
      };
      expect(timerSessionSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe("Duration Calculation Across Midnight", () => {
    it("calculates normal duration correctly", () => {
      const start = "2026-08-25T09:00:00Z";
      const end = "2026-08-25T10:30:00Z";
      expect(calculateDurationMin(start, end)).toBe(90);
    });

    it("calculates session across midnight correctly", () => {
      const start = "2026-08-24T23:30:00Z";
      const end = "2026-08-25T01:00:00Z";
      expect(calculateDurationMin(start, end)).toBe(90);
    });

    it("returns 0 for invalid or reverse dates", () => {
      const start = "2026-08-25T10:00:00Z";
      const end = "2026-08-25T09:00:00Z";
      expect(calculateDurationMin(start, end)).toBe(0);
    });
  });

  describe("Weekly Time Distribution", () => {
    it("aggregates minutes and hours by category correctly", () => {
      const sampleEntries: TimeEntryRow[] = [
        {
          id: "1",
          user_id: "u1",
          task_id: null,
          project_id: null,
          kind: "deep_work",
          started_at: "2026-08-25T09:00:00Z",
          ended_at: "2026-08-25T10:30:00Z",
          duration_min: 90,
          focus_rating: 5,
          note: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          user_id: "u1",
          task_id: null,
          project_id: null,
          kind: "sales",
          started_at: "2026-08-25T11:00:00Z",
          ended_at: "2026-08-25T11:30:00Z",
          duration_min: 30,
          focus_rating: 4,
          note: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          user_id: "u1",
          task_id: null,
          project_id: null,
          kind: "delivery",
          started_at: "2026-08-25T12:00:00Z",
          ended_at: "2026-08-25T13:00:00Z",
          duration_min: 60,
          focus_rating: 4,
          note: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const result = calculateWeeklyTimeDistribution(sampleEntries);
      expect(result.totalMinutes).toBe(180);
      expect(result.totalHours).toBe(3);
      expect(result.deepWorkHours).toBe(1.5);
      expect(result.revenueHours).toBe(1.5); // sales (0.5) + delivery (1.0)
    });
  });
});
