import { describe, it, expect } from "vitest";
import { dailyLogFormSchema } from "@/lib/schemas/daily-log";
import { evaluateCapacityAdvice } from "@/lib/logic/daily-log";

describe("Daily Log & Sleep/Energy Module", () => {
  describe("Zod Schema", () => {
    it("validates valid daily log form", () => {
      const valid = {
        log_date: "2026-08-25",
        sleep_at: "23:30",
        woke_at: "07:00",
        hours_slept: 7.5,
        energy: 4,
        focus: 4,
      };
      expect(dailyLogFormSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects invalid time formats or out-of-range energy", () => {
      const invalid = {
        log_date: "2026-08-25",
        sleep_at: "25:70",
        energy: 8,
      };
      expect(dailyLogFormSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("evaluateCapacityAdvice", () => {
    it("advises light mode when energy is low or sleep is insufficient", () => {
      const advice = evaluateCapacityAdvice({ energy: 2, sleepHours: 7 });
      expect(advice.capacity).toBe("light");
      expect(advice.maxCoreTasks).toBe(1);

      const adviceLowSleep = evaluateCapacityAdvice({ energy: 3, sleepHours: 4.5 });
      expect(adviceLowSleep.capacity).toBe("light");
    });

    it("advises high capacity when energy and sleep are abundant", () => {
      const advice = evaluateCapacityAdvice({ energy: 5, sleepHours: 8 });
      expect(advice.capacity).toBe("high");
      expect(advice.maxCoreTasks).toBe(3);
    });

    it("advises normal balanced capacity for moderate metrics", () => {
      const advice = evaluateCapacityAdvice({ energy: 3, sleepHours: 6.5 });
      expect(advice.capacity).toBe("normal");
      expect(advice.maxCoreTasks).toBe(2);
    });
  });
});
