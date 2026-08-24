import { describe, it, expect } from "vitest";
import { createClientSchema } from "@/lib/schemas/clients";
import { createProjectSchema } from "@/lib/schemas/projects";

describe("Clients & Projects Schema Validation", () => {
  it("validates client creation schema", () => {
    const validClient = {
      name: "Ahmed Dev Client",
      company: "Startup Co",
      contact: "ahmed@example.com",
      status: "active" as const,
      payment_status: "pending" as const,
    };

    const parsed = createClientSchema.safeParse(validClient);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("Ahmed Dev Client");
    }
  });

  it("fails if client name is missing", () => {
    const invalidClient = {
      name: "",
      status: "active" as const,
    };

    const parsed = createClientSchema.safeParse(invalidClient);
    expect(parsed.success).toBe(false);
  });

  it("validates project creation schema", () => {
    const validProject = {
      name: "Discord Moderation Bot Platform",
      kind: "client" as const,
      status: "active" as const,
      budget: 18000,
      started_on: "2026-08-24",
      deadline: "2026-09-30",
    };

    const parsed = createProjectSchema.safeParse(validProject);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("Discord Moderation Bot Platform");
      expect(parsed.data.budget).toBe(18000);
    }
  });
});
