import { describe, it, expect } from "vitest";
import { isRecurringDueOnDate, formatRecurringRule } from "@/lib/logic/recurring";

describe("Recurring Rule Parser & Matcher", () => {
  it("should match daily recurring rules on any date", () => {
    expect(isRecurringDueOnDate("daily", new Date("2026-08-24"))).toBe(true);
    expect(isRecurringDueOnDate("daily", new Date("2026-08-28"))).toBe(true);
  });

  it("should match weekdays rules only on Monday through Friday", () => {
    // 2026-08-24 is Monday (day 1)
    expect(isRecurringDueOnDate("weekdays", new Date("2026-08-24"))).toBe(true);
    // 2026-08-28 is Friday (day 5)
    expect(isRecurringDueOnDate("weekdays", new Date("2026-08-28"))).toBe(true);
    // 2026-08-30 is Sunday (day 0)
    expect(isRecurringDueOnDate("weekdays", new Date("2026-08-30"))).toBe(false);
  });

  it("should match specific weekly days", () => {
    // Monday (1) and Thursday (4)
    const rule = "weekly:mon,thu";
    expect(isRecurringDueOnDate(rule, new Date("2026-08-24"))).toBe(true); // Monday
    expect(isRecurringDueOnDate(rule, new Date("2026-08-27"))).toBe(true); // Thursday
    expect(isRecurringDueOnDate(rule, new Date("2026-08-25"))).toBe(false); // Tuesday
  });

  it("should match monthly day of month", () => {
    const rule = "monthly:15";
    expect(isRecurringDueOnDate(rule, new Date("2026-08-15"))).toBe(true);
    expect(isRecurringDueOnDate(rule, new Date("2026-08-16"))).toBe(false);
  });

  it("should format recurring rules human-readably", () => {
    expect(formatRecurringRule("daily")).toBe("Repeats Daily");
    expect(formatRecurringRule("weekdays")).toBe("Repeats on Weekdays");
    expect(formatRecurringRule("weekly:mon,thu")).toBe("Repeats Weekly (MON,THU)");
  });
});
