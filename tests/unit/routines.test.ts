import { describe, it, expect } from "vitest";
import { routineFormSchema, routineItemSchema } from "@/lib/schemas/routines";
import { DEFAULT_ROUTINES_SEED } from "@/lib/logic/routines";

describe("Routines Module", () => {
  it("validates routine item schema", () => {
    const validItem = {
      id: "i1",
      title: "شرب كوب ماء كبير",
      duration_min: 5,
      is_active: true,
    };
    expect(routineItemSchema.safeParse(validItem).success).toBe(true);

    const invalidItem = {
      id: "i1",
      title: "",
      duration_min: 0,
    };
    expect(routineItemSchema.safeParse(invalidItem).success).toBe(false);
  });

  it("validates routine form schema", () => {
    const valid = {
      name: "روتين الصباح",
      time_of_day: "morning",
      items: [
        { id: "1", title: "استيقاظ", duration_min: 5, is_active: true },
      ],
      is_active: true,
      sort_order: 1,
    };
    expect(routineFormSchema.safeParse(valid).success).toBe(true);
  });

  it("contains all 4 seeded routine templates according to spec (§28)", () => {
    expect(DEFAULT_ROUTINES_SEED.length).toBe(4);
    const times = DEFAULT_ROUTINES_SEED.map((r) => r.time_of_day);
    expect(times).toContain("morning");
    expect(times).toContain("workday");
    expect(times).toContain("evening");
    expect(times).toContain("night");
  });
});
