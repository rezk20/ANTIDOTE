import { describe, it, expect } from "vitest";
import { settingsSchema } from "@/lib/schemas/settings";

describe("Settings Schema Validation", () => {
  it("should parse valid settings data with defaults", () => {
    const result = settingsSchema.safeParse({
      display_name: "Ahmed",
      timezone: "Africa/Cairo",
      currency: "EGP",
      weekly_off_day: "friday",
      work_hours_per_day: "8",
      marriage_target_amount: "250000",
      proposals_per_week: "5",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.display_name).toBe("Ahmed");
      expect(result.data.work_hours_per_day).toBe(8);
      expect(result.data.marriage_target_amount).toBe(250000);
      expect(result.data.proposals_per_week).toBe(5);
    }
  });

  it("should reject empty display name", () => {
    const result = settingsSchema.safeParse({
      display_name: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.display_name).toBeDefined();
    }
  });

  it("should reject invalid weekly off day", () => {
    const result = settingsSchema.safeParse({
      display_name: "Ahmed",
      weekly_off_day: "funday",
    });

    expect(result.success).toBe(false);
  });

  it("should enforce work hours bounds (1 to 24)", () => {
    const tooLow = settingsSchema.safeParse({
      display_name: "Ahmed",
      work_hours_per_day: 0,
    });
    expect(tooLow.success).toBe(false);

    const tooHigh = settingsSchema.safeParse({
      display_name: "Ahmed",
      work_hours_per_day: 25,
    });
    expect(tooHigh.success).toBe(false);
  });
});
