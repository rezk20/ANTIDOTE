import { describe, it, expect } from "vitest";
import { calculateAdaptiveWorkAllocation } from "@/lib/logic/allocation";
import type { ProjectRow } from "@/lib/supabase/types";

describe("Adaptive Work Allocation Logic (§51, §52)", () => {
  it("switches to 'hunting' state when there are 0 active client projects", () => {
    const result = calculateAdaptiveWorkAllocation({
      projects: [],
      leads: [],
      timeEntries: [],
    });

    expect(result.state).toBe("hunting");
    expect(result.stateLabelAr).toContain("مرحلة البحث عن عملاء");

    const salesSplit = result.splits.find((s) => s.streamKey === "sales");
    expect(salesSplit?.targetPercentage).toBe(45);
  });

  it("switches to 'delivering' state when there is 1 active client project", () => {
    const mockProjects: ProjectRow[] = [
      {
        id: "p-1",
        user_id: "user-1",
        name: "Client Project",
        client_id: "c-1",
        kind: "client",
        status: "active",
        brief: null,
        requirements: null,
        started_on: "2026-08-01",
        budget: 10000,
        deadline: "2026-09-01",
        meta: {},
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-01T10:00:00Z",
      },
    ];

    const result = calculateAdaptiveWorkAllocation({
      projects: mockProjects,
      leads: [],
      timeEntries: [],
    });

    expect(result.state).toBe("delivering");
    expect(result.stateLabelAr).toContain("مرحلة تسليم العميل");

    const deliverySplit = result.splits.find((s) => s.streamKey === "delivery");
    expect(deliverySplit?.targetPercentage).toBe(55);
  });

  it("switches to 'scaling' state when there are 2 or more active client projects", () => {
    const mockProjects: ProjectRow[] = [
      {
        id: "p-1",
        user_id: "user-1",
        name: "Client A",
        client_id: "c-1",
        kind: "client",
        status: "active",
        brief: null,
        requirements: null,
        started_on: "2026-08-01",
        budget: 10000,
        deadline: "2026-09-01",
        meta: {},
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-01T10:00:00Z",
      },
      {
        id: "p-2",
        user_id: "user-1",
        name: "Client B",
        client_id: "c-2",
        kind: "client",
        status: "active",
        brief: null,
        requirements: null,
        started_on: "2026-08-01",
        budget: 15000,
        deadline: "2026-09-01",
        meta: {},
        created_at: "2026-08-01T10:00:00Z",
        updated_at: "2026-08-01T10:00:00Z",
      },
    ];

    const result = calculateAdaptiveWorkAllocation({
      projects: mockProjects,
      leads: [],
      timeEntries: [],
    });

    expect(result.state).toBe("scaling");
    expect(result.stateLabelAr).toContain("مرحلة الاستقرار والتوسع");

    const productSplit = result.splits.find((s) => s.streamKey === "product");
    expect(productSplit?.targetPercentage).toBe(20);
  });
});
