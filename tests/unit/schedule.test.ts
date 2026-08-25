import { describe, it, expect } from "vitest";
import {
  detectScheduleCollisions,
  generateDayTimeBlocks,
} from "@/lib/logic/schedule";
import type { TaskRow, ProjectRow, RoutineRow } from "@/lib/supabase/types";

function createMockTask(overrides: Partial<TaskRow>): TaskRow {
  return {
    id: "t1",
    user_id: "u1",
    title: "مهمة تجريبية",
    description: null,
    area: null,
    status: "planned",
    priority: "high",
    task_type: "client",
    deadline: null,
    scheduled_date: null,
    effort: 1,
    duration_min: 60,
    is_top_three: false,
    recurring_rule: null,
    recurring_source_id: null,
    energy_level: null,
    revenue_impact: null,
    strategic_impact: null,
    relationship_impact: null,
    urgency: null,
    goal_id: null,
    project_id: null,
    lead_id: null,
    completed_at: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("Schedule & Collision Detection Module", () => {
  describe("detectScheduleCollisions", () => {
    it("flags collision when work or project is scheduled on protected Friday", () => {
      const sampleFriday = "2026-08-28"; // Friday

      const tasks: TaskRow[] = [
        createMockTask({
          id: "t1",
          title: "تسليم مهمة للعميل",
          deadline: sampleFriday,
          scheduled_date: sampleFriday,
        }),
      ];

      const collisions = detectScheduleCollisions({
        tasks,
        projects: [],
        marriageExpenses: [],
        protectedOffDay: "friday",
      });

      expect(collisions.length).toBe(1);
      expect(collisions[0].type).toBe("friday_protection");
      expect(collisions[0].severity).toBe("critical");
    });

    it("flags multi-deadline clash when 3+ deliverables fall on the same day", () => {
      const targetDate = "2026-08-26"; // Wednesday

      const tasks: TaskRow[] = [
        createMockTask({
          id: "t1",
          title: "مهمة 1",
          priority: "critical",
          deadline: targetDate,
        }),
        createMockTask({
          id: "t2",
          title: "مهمة 2",
          priority: "high",
          deadline: targetDate,
        }),
      ];

      const projects: ProjectRow[] = [
        {
          id: "p1",
          user_id: "u1",
          client_id: null,
          name: "مشروع متجر الكتروني",
          kind: "client",
          brief: null,
          requirements: null,
          status: "active",
          budget: 15000,
          started_on: "2026-08-01",
          deadline: targetDate,
          meta: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const collisions = detectScheduleCollisions({
        tasks,
        projects,
        marriageExpenses: [],
        protectedOffDay: "friday",
      });

      const clash = collisions.find((c) => c.type === "deadline_clash");
      expect(clash).toBeDefined();
      expect(clash?.severity).toBe("warning");
    });
  });

  describe("generateDayTimeBlocks", () => {
    it("generates structured timeline with routines and tasks", () => {
      const routines: RoutineRow[] = [
        {
          id: "r1",
          user_id: "u1",
          name: "روتين الصباح",
          time_of_day: "morning",
          items: [{ id: "1", title: "استيقاظ", duration_min: 15, is_active: true }],
          is_active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const tasks: TaskRow[] = [
        createMockTask({
          id: "t1",
          title: "بناء واجهة التقويم",
          deadline: "2026-08-25",
          duration_min: 120,
          is_top_three: true,
        }),
      ];

      const blocks = generateDayTimeBlocks({
        routines,
        tasks,
        dateStr: "2026-08-25",
      });

      expect(blocks.length).toBeGreaterThanOrEqual(2);
      expect(blocks[0].kind).toBe("routine");
      expect(blocks[1].kind).toBe("task");
    });
  });
});
