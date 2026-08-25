import { describe, it, expect } from "vitest";
import { convertDumpSchema } from "@/lib/schemas/conversions";

describe("Brain Dump Conversion Schema Validation", () => {
  const dummyDumpId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  it("validates conversion to Task", () => {
    const payload = {
      dump_id: dummyDumpId,
      target_type: "task",
      task_title: "Build client landing page",
      task_area: "work",
      task_priority: "high",
      task_scheduled_date: "2026-08-25",
      task_is_top_three: "true",
    };

    const parsed = convertDumpSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.target_type).toBe("task");
      expect(parsed.data.task_title).toBe("Build client landing page");
      expect(parsed.data.task_is_top_three).toBe(true);
    }
  });

  it("validates conversion to Note", () => {
    const payload = {
      dump_id: dummyDumpId,
      target_type: "note",
      note_title: "SaaS Idea Brainstorm",
      note_folder: "products-saas",
      note_content: "Raw idea notes from capture.",
      note_tags: ["saas", "mvp"],
    };

    const parsed = convertDumpSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.target_type).toBe("note");
      expect(parsed.data.note_folder).toBe("products-saas");
      expect(parsed.data.note_tags).toEqual(["saas", "mvp"]);
    }
  });

  it("validates conversion to Goal", () => {
    const payload = {
      dump_id: dummyDumpId,
      target_type: "goal",
      goal_title: "Reach 50k MRR",
      goal_level: "quarter",
      goal_target_value: "50000",
      goal_unit: "EGP",
    };

    const parsed = convertDumpSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.target_type).toBe("goal");
      expect(parsed.data.goal_level).toBe("quarter");
    }
  });

  it("validates conversion to Lead", () => {
    const payload = {
      dump_id: dummyDumpId,
      target_type: "lead",
      lead_title: "Dr. Khaled Healthcare Bot",
      lead_stage: "proposal_sent",
      lead_expected_value: "15000",
    };

    const parsed = convertDumpSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.target_type).toBe("lead");
      expect(parsed.data.lead_expected_value).toBe(15000);
    }
  });
});
