"use client";

import { useState } from "react";
import { parseMarkdownToBlocks, type MarkdownBlock } from "@/lib/logic/markdown";
import { Check, Copy, CheckSquare, Square } from "lucide-react";

export function MarkdownRenderer({
  content = "",
  className = "",
}: {
  content?: string;
  className?: string;
}) {
  const blocks = parseMarkdownToBlocks(content);

  if (!content.trim()) {
    return (
      <p className="text-xs text-zinc-400 italic">No content to preview.</p>
    );
  }

  return (
    <div className={`space-y-4 text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed ${className}`}>
      {blocks.map((block, idx) => (
        <MarkdownBlockRenderer key={`block-${idx}`} block={block} />
      ))}
    </div>
  );
}

function MarkdownBlockRenderer({ block }: { block: MarkdownBlock }) {
  // 1. Headings
  if (block.type === "heading") {
    const level = block.level || 1;
    if (level === 1) {
      return (
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight pt-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          {renderInlineFormatting(block.content)}
        </h1>
      );
    }
    if (level === 2) {
      return (
        <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight pt-1">
          {renderInlineFormatting(block.content)}
        </h2>
      );
    }
    if (level === 3) {
      return (
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {renderInlineFormatting(block.content)}
        </h3>
      );
    }
    return (
      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
        {renderInlineFormatting(block.content)}
      </h4>
    );
  }

  // 2. Code Block
  if (block.type === "code_block") {
    return <CodeBlock language={block.language} code={block.content} />;
  }

  // 3. Blockquote
  if (block.type === "blockquote") {
    return (
      <blockquote className="border-s-4 border-amber-500/80 ps-4 py-1.5 my-2 bg-amber-50/40 dark:bg-amber-950/20 rounded-e-xl text-zinc-700 dark:text-zinc-300 italic text-sm">
        {renderInlineFormatting(block.content)}
      </blockquote>
    );
  }

  // 4. Checklist Item
  if (block.type === "checklist") {
    return (
      <div className="flex items-start gap-2.5 my-1">
        {block.checked ? (
          <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <Square className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
        )}
        <span className={block.checked ? "line-through text-zinc-400 dark:text-zinc-500" : ""}>
          {renderInlineFormatting(block.content)}
        </span>
      </div>
    );
  }

  // 5. Unordered List
  if (block.type === "list" && block.items) {
    return (
      <ul className="space-y-1.5 list-disc ps-5 marker:text-zinc-400">
        {block.items.map((item, i) => (
          <li key={i}>{renderInlineFormatting(item.text)}</li>
        ))}
      </ul>
    );
  }

  // 6. Thematic Break
  if (block.type === "thematic_break") {
    return <hr className="my-4 border-zinc-200 dark:border-zinc-800" />;
  }

  // 7. Regular Paragraph
  return (
    <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
      {renderInlineFormatting(block.content)}
    </p>
  );
}

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 font-mono text-xs my-3 shadow-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400">
        <span className="uppercase font-bold tracking-wider">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInlineFormatting(text: string) {
  // Bold **text**
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-zinc-900 dark:text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[12px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}
