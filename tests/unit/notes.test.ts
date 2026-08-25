import { describe, it, expect } from "vitest";
import {
  noteSchema,
  noteFilterSchema,
  NOTE_FOLDERS,
} from "@/lib/schemas/notes";
import {
  calculateMarkdownStats,
  extractMarkdownSnippet,
  parseMarkdownToBlocks,
} from "@/lib/logic/markdown";

describe("Notes Engine & Markdown Logic", () => {
  describe("noteSchema Validation", () => {
    it("validates valid note inputs and sets default folder", () => {
      const validNote = {
        title: "Discord Bot Architecture",
        content: "# Overview\n\nThis bot handles server onboarding.",
        folder: "discord-bots",
        tags: ["discord", "saas", "architecture"],
        pinned: true,
        archived: false,
      };

      const parsed = noteSchema.safeParse(validNote);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.title).toBe("Discord Bot Architecture");
        expect(parsed.data.folder).toBe("discord-bots");
        expect(parsed.data.pinned).toBe(true);
        expect(parsed.data.tags).toEqual(["discord", "saas", "architecture"]);
      }
    });

    it("parses comma-separated tags string", () => {
      const noteWithTagString = {
        title: "Meeting Notes",
        content: "Discussed budget.",
        tags: "client, budget, urgent",
      };

      const parsed = noteSchema.safeParse(noteWithTagString);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.tags).toEqual(["client", "budget", "urgent"]);
      }
    });

    it("rejects empty title", () => {
      const invalid = {
        title: "   ",
        content: "Some content",
      };
      const parsed = noteSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it("contains exactly the 13 seeded folders", () => {
      expect(NOTE_FOLDERS.length).toBe(13);
      expect(NOTE_FOLDERS).toContain("inbox");
      expect(NOTE_FOLDERS).toContain("business-strategy");
      expect(NOTE_FOLDERS).toContain("freelance-clients");
      expect(NOTE_FOLDERS).toContain("discord-bots");
      expect(NOTE_FOLDERS).toContain("products-saas");
      expect(NOTE_FOLDERS).toContain("marriage-home");
      expect(NOTE_FOLDERS).toContain("finances-investments");
      expect(NOTE_FOLDERS).toContain("learning-growth");
      expect(NOTE_FOLDERS).toContain("habits-health");
      expect(NOTE_FOLDERS).toContain("systems-workflows");
      expect(NOTE_FOLDERS).toContain("decisions-log");
      expect(NOTE_FOLDERS).toContain("templates");
      expect(NOTE_FOLDERS).toContain("archive");
    });

    it("validates noteFilterSchema with defaults", () => {
      const filters = {
        folder: "discord-bots",
        search: "webhook",
      };
      const parsed = noteFilterSchema.safeParse(filters);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.folder).toBe("discord-bots");
        expect(parsed.data.search).toBe("webhook");
        expect(parsed.data.archived).toBe(false);
        expect(parsed.data.pinnedFirst).toBe(true);
      }
    });
  });

  describe("Markdown Parsing & Stats", () => {
    it("calculates word count and reading time correctly", () => {
      const sampleText = `
# Project Plan

Here is a paragraph with exactly **ten** words written for this unit test.

- List item one
- List item two
      `;

      const stats = calculateMarkdownStats(sampleText);
      expect(stats.wordCount).toBeGreaterThan(10);
      expect(stats.readingTimeMinutes).toBe(1);
    });

    it("extracts clean snippet without markdown markers", () => {
      const content = "### Hello World\n\nThis is a **bold** paragraph with [link](https://example.com) and `inline code`.";
      const snippet = extractMarkdownSnippet(content, 60);
      expect(snippet).not.toContain("###");
      expect(snippet).not.toContain("**");
      expect(snippet).not.toContain("https://");
      expect(snippet).toContain("Hello World");
      expect(snippet).toContain("bold paragraph");
    });

    it("tokenizes structured markdown blocks (headings, code, checklists, blockquotes)", () => {
      const md = `
# Title
> Important note

\`\`\`typescript
const x = 10;
\`\`\`

- [x] Task done
- [ ] Task pending

- Bullet A
- Bullet B
      `;

      const blocks = parseMarkdownToBlocks(md);
      expect(blocks.some((b) => b.type === "heading" && b.content === "Title")).toBe(true);
      expect(blocks.some((b) => b.type === "blockquote")).toBe(true);
      expect(blocks.some((b) => b.type === "code_block" && b.language === "typescript")).toBe(true);
      expect(blocks.some((b) => b.type === "checklist" && b.checked === true)).toBe(true);
      expect(blocks.some((b) => b.type === "checklist" && b.checked === false)).toBe(true);
      expect(blocks.some((b) => b.type === "list")).toBe(true);
    });

    it("handles edge cases without freezing or throwing (unclosed code blocks, lone dashes)", () => {
      const edgeCases = [
        "```typescript\nconst a = 1;\n// unclosed code",
        "- [ ]",
        "- [x]",
        "---",
        ">",
        "> line 1\n> line 2",
        "- item 1\n- [ ] checklist\n- item 2",
        "Plain text line with no markdown markers",
      ];

      for (const text of edgeCases) {
        const blocks = parseMarkdownToBlocks(text);
        expect(Array.isArray(blocks)).toBe(true);
      }
    });
  });
});
