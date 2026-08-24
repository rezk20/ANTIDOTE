import { describe, it, expect } from "vitest";
import { brainDumpSchema } from "@/lib/schemas/brain-dump";

describe("Brain Dump Schema Validation", () => {
  it("should accept valid capture text", () => {
    const result = brainDumpSchema.safeParse({
      content: "Send proposal to client Ahmed for Discord bot integration",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe(
        "Send proposal to client Ahmed for Discord bot integration",
      );
    }
  });

  it("should reject empty content or whitespace only", () => {
    const resultEmpty = brainDumpSchema.safeParse({ content: "" });
    expect(resultEmpty.success).toBe(false);

    const resultWhitespace = brainDumpSchema.safeParse({ content: "    " });
    expect(resultWhitespace.success).toBe(false);
  });

  it("should reject content exceeding max length limit", () => {
    const hugeContent = "a".repeat(5001);
    const result = brainDumpSchema.safeParse({ content: hugeContent });
    expect(result.success).toBe(false);
  });
});
