import { describe, it, expect } from "vitest";
import { taskSchema } from "@/lib/schemas/tasks";

describe("Task Schema Validation", () => {
  it("should validate a complete valid task", () => {
    const result = taskSchema.safeParse({
      title: "Deliver Next.js milestone to client",
      task_type: "revenue",
      priority: "high",
      effort: 2,
      revenue_impact: 4,
      strategic_impact: 3,
      urgency: 3,
      is_top_three: true,
      status: "in_progress",
    });

    expect(result.success).toBe(true);
  });

  it("should reject empty task title", () => {
    const result = taskSchema.safeParse({
      title: "",
      task_type: "revenue",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it("should reject invalid effort out of 1..5 range", () => {
    const result = taskSchema.safeParse({
      title: "Some task",
      task_type: "career",
      effort: 10,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.effort).toBeDefined();
    }
  });
});
