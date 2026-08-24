import { describe, it, expect } from "vitest";
import { loginSchema } from "@/lib/schemas/auth";

describe("Auth Schema Validation", () => {
  it("should accept valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "owner@example.com",
      password: "strong-secret-password",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("owner@example.com");
      expect(result.data.password).toBe("strong-secret-password");
    }
  });

  it("should trim email address whitespace", () => {
    const result = loginSchema.safeParse({
      email: "   owner@example.com   ",
      password: "password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("owner@example.com");
    }
  });

  it("should reject invalid email formats", () => {
    const invalidEmails = [
      "notanemail",
      "missing-at.com",
      "@missing-local.com",
      "spaces in@email.com",
      "",
    ];

    for (const email of invalidEmails) {
      const result = loginSchema.safeParse({
        email,
        password: "password123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    }
  });

  it("should reject empty or missing password", () => {
    const result = loginSchema.safeParse({
      email: "owner@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });
});
