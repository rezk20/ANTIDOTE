import { describe, it, expect } from "vitest";
import { goalSchema } from "@/lib/schemas/goals";

describe("Goal Schema Validation", () => {
  it("should validate a valid goal input", () => {
    const result = goalSchema.safeParse({
      title: "Marriage Financial Readiness",
      level: "year",
      target_value: 250000,
      unit: "EGP",
      status: "active",
    });

    expect(result.success).toBe(true);
  });

  it("should reject an empty goal title", () => {
    const result = goalSchema.safeParse({
      title: "   ",
      level: "quarter",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it("should reject invalid hierarchy level", () => {
    const result = goalSchema.safeParse({
      title: "Some Goal",
      level: "decade" as never,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.level).toBeDefined();
    }
  });
});
