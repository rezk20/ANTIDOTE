import { describe, it, expect } from "vitest";
import {
  createLeadSchema,
  moveLeadStageSchema,
  convertToClientSchema,
  recordLeadPaymentSchema,
} from "@/lib/schemas/leads";

describe("Leads Schema Validation", () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  it("validates a valid lead creation payload", () => {
    const payload = {
      title: "MERN Stack Web App for Client X",
      source: "upwork",
      stage: "new" as const,
      expected_value: 20000,
      probability: 0.5,
      notes: "Discovery call scheduled",
    };

    const parsed = createLeadSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.title).toBe("MERN Stack Web App for Client X");
      expect(parsed.data.expected_value).toBe(20000);
    }
  });

  it("fails if lead title is empty", () => {
    const payload = {
      title: "   ",
      stage: "new" as const,
    };

    const parsed = createLeadSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });

  it("validates stage move and lost reason schema", () => {
    const validMove = {
      lead_id: validUUID,
      stage: "lost" as const,
      lost_reason: "Client budget was below minimum threshold",
    };

    const parsed = moveLeadStageSchema.safeParse(validMove);
    expect(parsed.success).toBe(true);
  });

  it("validates convert to client schema", () => {
    const convertPayload = {
      lead_id: validUUID,
      client_name: "Acme Corp",
      company: "Acme LLC",
      create_project: true,
      project_name: "Acme Next.js Portal",
      project_budget: 35000,
    };

    const parsed = convertToClientSchema.safeParse(convertPayload);
    expect(parsed.success).toBe(true);
  });

  it("validates payment recording schema", () => {
    const paymentPayload = {
      lead_id: validUUID,
      amount: 15000,
      occurred_on: "2026-08-24",
      note: "Initial milestone payment received",
    };

    const parsed = recordLeadPaymentSchema.safeParse(paymentPayload);
    expect(parsed.success).toBe(true);
  });
});
