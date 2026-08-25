import { describe, it, expect } from "vitest";
import {
  agentActionSchema,
  HERMES_MASTER_SYSTEM_PROMPT,
  HERMES_TOOL_DEFINITIONS,
} from "@/lib/schemas/agent";

describe("Hermes AI Agent Bridge & Actions Validation", () => {
  it("validates capture_thought payload correctly", () => {
    const valid = {
      action: "capture_thought",
      text: "Explore new freelance leads on Twitter",
      source: "hermes_chat",
    };

    const res = agentActionSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("validates create_task payload and applies defaults", () => {
    const valid = {
      action: "create_task",
      title: "Refactor database migrations",
      priority: "P1",
      scheduled_date: "2026-08-25",
    };

    const res = agentActionSchema.safeParse(valid);
    expect(res.success).toBe(true);
    if (res.success && res.data.action === "create_task") {
      expect(res.data.action).toBe("create_task");
      expect(res.data.task_type).toBe("personal");
    }
  });

  it("validates log_time_entry with focus rating constraints", () => {
    const valid = {
      action: "log_time_entry",
      duration_min: 90,
      kind: "deep_work",
      focus_rating: 5,
      note: "Built AI agent integration endpoint",
    };

    const res = agentActionSchema.safeParse(valid);
    expect(res.success).toBe(true);

    const invalidRating = {
      action: "log_time_entry",
      duration_min: 90,
      focus_rating: 10, // Max 5
    };
    expect(agentActionSchema.safeParse(invalidRating).success).toBe(false);
  });

  it("validates log_lead payload with stage enum", () => {
    const valid = {
      action: "log_lead",
      title: "Enterprise Client A",
      expected_value: 35000,
      stage: "proposal_sent",
    };

    const res = agentActionSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("validates create_decision with reversibility switch", () => {
    const valid = {
      action: "create_decision",
      title: "Migrate database to distributed cluster",
      why_now: "Traffic scaling 5x",
      risk: "high",
      reversible: false,
    };

    const res = agentActionSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("validates save_debrief payload", () => {
    const valid = {
      action: "save_debrief",
      date: "2026-08-25",
      energy_rating: 4,
      accomplishments: "Completed Phase 14 successfully.",
      tomorrow_focus: "Phase 15 polish",
    };

    const res = agentActionSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects unknown actions", () => {
    const invalid = {
      action: "delete_entire_database",
    };

    const res = agentActionSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("ensures Master System Prompt contains essential rules and instructions", () => {
    expect(HERMES_MASTER_SYSTEM_PROMPT).toContain("Hermes");
    expect(HERMES_MASTER_SYSTEM_PROMPT).toContain("LIFE OS (ANTIDOTE)");
    expect(HERMES_MASTER_SYSTEM_PROMPT).toContain("/api/agent/hermes");
    expect(HERMES_MASTER_SYSTEM_PROMPT).toContain("Authorization: Bearer");
    expect(HERMES_MASTER_SYSTEM_PROMPT).toContain("capture_thought");
    expect(HERMES_MASTER_SYSTEM_PROMPT).toContain("create_task");
  });

  it("verifies all tool calling definitions conform to OpenAI function spec", () => {
    expect(HERMES_TOOL_DEFINITIONS.length).toBeGreaterThanOrEqual(7);
    for (const tool of HERMES_TOOL_DEFINITIONS) {
      expect(tool.type).toBe("function");
      expect(tool.function.name).toBeDefined();
      expect(tool.function.description).toBeDefined();
      expect(tool.function.parameters.type).toBe("object");
    }
  });
});
