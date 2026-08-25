/**
 * Pure Markdown logic utilities: Word count, Reading time, and Tokenizer for Life OS.
 */

export interface MarkdownStats {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
}

export function calculateMarkdownStats(content: string = ""): MarkdownStats {
  const trimmed = content.trim();
  if (!trimmed) {
    return { wordCount: 0, charCount: 0, readingTimeMinutes: 0 };
  }

  // Remove markdown symbols for word counting
  const cleanText = trimmed
    .replace(/[#*`_~>[\]()\-+!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = trimmed.length;

  // Average reading speed: 200 words per minute (minimum 1 minute if words exist)
  const readingTimeMinutes = wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  return {
    wordCount,
    charCount,
    readingTimeMinutes,
  };
}

export function extractMarkdownSnippet(content: string = "", maxLength: number = 140): string {
  const clean = content
    .replace(/^#+\s+/gm, "") // remove heading markers
    .replace(/```[\s\S]*?```/g, "[Code Block]") // replace code blocks
    .replace(/`([^`]+)`/g, "$1") // strip inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip links but keep text
    .replace(/[*_~>-]/g, "") // strip bold, italics, quotes, bullets
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + "…";
}

export type MarkdownBlockType =
  | "heading"
  | "paragraph"
  | "code_block"
  | "blockquote"
  | "checklist"
  | "list"
  | "thematic_break";

export interface MarkdownBlock {
  type: MarkdownBlockType;
  level?: number; // for headings 1-6
  language?: string; // for code blocks
  content: string;
  checked?: boolean; // for checklists
  items?: { text: string; checked?: boolean }[];
}

/**
 * Tokenizes markdown into structured semantic blocks for safe, clean React rendering.
 * Bulletproof infinite-loop protection: guarantees progression on every iteration.
 */
export function parseMarkdownToBlocks(content: string = ""): MarkdownBlock[] {
  if (!content) return [];
  const lines = content.split("\n");
  const blocks: MarkdownBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 0. Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Code Block ```
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) {
        i++; // skip closing ```
      }
      blocks.push({
        type: "code_block",
        language: language || "plaintext",
        content: codeLines.join("\n"),
      });
      continue;
    }

    // 2. Headings #, ##, ###, ####, #####, ######
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        content: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 3. Blockquote >
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        content: quoteLines.join("\n"),
      });
      continue;
    }

    // 4. Checklist Item - [ ] or - [x]
    const checklistMatch = line.match(/^[-*]\s+\[([ xX])\]\s*(.*)$/);
    if (checklistMatch) {
      const isChecked = checklistMatch[1].toLowerCase() === "x";
      blocks.push({
        type: "checklist",
        checked: isChecked,
        content: checklistMatch[2].trim(),
      });
      i++;
      continue;
    }

    // 5. Unordered list - or *
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      const items: { text: string }[] = [];
      while (i < lines.length) {
        const curLine = lines[i];
        const curTrimmed = curLine.trim();
        if (!curTrimmed) break;
        if (curLine.match(/^[-*]\s+\[([ xX])\]/)) break;

        const curItemMatch = curLine.match(/^[-*]\s+(.*)$/);
        if (curItemMatch) {
          items.push({ text: curItemMatch[1].trim() });
          i++;
        } else {
          break;
        }
      }

      if (items.length > 0) {
        blocks.push({
          type: "list",
          content: "",
          items,
        });
      } else {
        blocks.push({
          type: "paragraph",
          content: line,
        });
        i++;
      }
      continue;
    }

    // 6. Horizontal Rule / Divider ---
    if (/^(\*\*\*|---|___)$/.test(trimmed)) {
      blocks.push({
        type: "thematic_break",
        content: "",
      });
      i++;
      continue;
    }

    // 7. Regular paragraph
    const pLines: string[] = [];
    const startIndex = i;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].match(/^[-*]\s+/) &&
      !/^(\*\*\*|---|___)$/.test(lines[i].trim())
    ) {
      pLines.push(lines[i]);
      i++;
    }

    if (pLines.length > 0) {
      blocks.push({
        type: "paragraph",
        content: pLines.join("\n"),
      });
    } else {
      // Guaranteed advancement fallback
      if (i === startIndex) {
        blocks.push({
          type: "paragraph",
          content: lines[i],
        });
        i++;
      }
    }
  }

  return blocks;
}
