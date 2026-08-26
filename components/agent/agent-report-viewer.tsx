"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Search,
  Tag,
  Copy,
  Check,
  FileText,
  Sparkles,
} from "lucide-react";

export interface AgentReportItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
}

export interface AgentReportViewerProps {
  reports: AgentReportItem[];
}

/**
 * Custom High-Grade Markdown Renderer for AI Reports & Executive Briefings
 */
function FormattedReportContent({ content }: { content: string }) {
  // Parse lines into structured blocks
  const blocks = useMemo(() => {
    const lines = content.split("\n");
    const result: Array<{
      type: "h1" | "h2" | "h3" | "h4" | "bullet" | "numbered" | "quote" | "hr" | "p" | "code";
      text: string;
      raw: string;
    }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) continue;

      if (trimmed.startsWith("# ")) {
        result.push({ type: "h1", text: trimmed.replace(/^#\s+/, ""), raw: line });
      } else if (trimmed.startsWith("## ")) {
        result.push({ type: "h2", text: trimmed.replace(/^##\s+/, ""), raw: line });
      } else if (trimmed.startsWith("### ")) {
        result.push({ type: "h3", text: trimmed.replace(/^###\s+/, ""), raw: line });
      } else if (trimmed.startsWith("#### ")) {
        result.push({ type: "h4", text: trimmed.replace(/^####\s+/, ""), raw: line });
      } else if (trimmed.startsWith("---") || trimmed.startsWith("***")) {
        result.push({ type: "hr", text: "", raw: line });
      } else if (trimmed.startsWith("> ")) {
        result.push({ type: "quote", text: trimmed.replace(/^>\s+/, ""), raw: line });
      } else if (/^[-*•]\s+/.test(trimmed)) {
        result.push({ type: "bullet", text: trimmed.replace(/^[-*•]\s+/, ""), raw: line });
      } else if (/^\d+\.\s+/.test(trimmed)) {
        result.push({ type: "numbered", text: trimmed.replace(/^\d+\.\s+/, ""), raw: line });
      } else {
        result.push({ type: "p", text: trimmed, raw: line });
      }
    }

    return result;
  }, [content]);

  // Helper to format inline markdown (bold, code, tags)
  const renderInline = (text: string) => {
    // Regex replace **bold** or `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={idx}
            className="font-black text-zinc-900 dark:text-zinc-50"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 font-mono text-[11px] font-bold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3.5 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans select-text">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <div
                key={idx}
                className="pb-2 pt-3 border-b border-purple-200 dark:border-purple-900/50 flex items-center gap-2"
              >
                <div className="p-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h1 className="text-base font-black text-zinc-900 dark:text-zinc-50">
                  {renderInline(block.text)}
                </h1>
              </div>
            );

          case "h2":
            return (
              <div
                key={idx}
                className="pb-1.5 pt-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {renderInline(block.text)}
                </h2>
              </div>
            );

          case "h3":
            return (
              <div
                key={idx}
                className="pt-2 flex items-center gap-2"
              >
                <h3 className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-xl w-fit">
                  {renderInline(block.text)}
                </h3>
              </div>
            );

          case "h4":
            return (
              <h4
                key={idx}
                className="text-xs font-bold text-zinc-800 dark:text-zinc-200 pt-1"
              >
                {renderInline(block.text)}
              </h4>
            );

          case "bullet":
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 ps-1 py-0.5 group"
              >
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400 shrink-0 group-hover:scale-125 transition-transform" />
                <div className="text-zinc-700 dark:text-zinc-300 text-xs">
                  {renderInline(block.text)}
                </div>
              </div>
            );

          case "numbered":
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 ps-1 py-0.5"
              >
                <div className="mt-0.5 px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 shrink-0">
                  #
                </div>
                <div className="text-zinc-700 dark:text-zinc-300 text-xs">
                  {renderInline(block.text)}
                </div>
              </div>
            );

          case "quote":
            return (
              <div
                key={idx}
                className="my-2 p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border-s-4 border-purple-500 text-zinc-800 dark:text-zinc-200 text-xs italic"
              >
                {renderInline(block.text)}
              </div>
            );

          case "hr":
            return (
              <div
                key={idx}
                className="my-3 border-t border-zinc-200 dark:border-zinc-800"
              />
            );

          case "p":
          default:
            return (
              <p
                key={idx}
                className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed"
              >
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}

export function AgentReportViewer({ reports }: AgentReportViewerProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique dates from reports
  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    for (const r of reports) {
      const d = r.created_at.split("T")[0];
      dates.add(d);
    }
    return Array.from(dates).sort().reverse();
  }, [reports]);

  // Extract all unique tags
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    for (const r of reports) {
      if (Array.isArray(r.tags)) {
        for (const t of r.tags) tags.add(t);
      }
    }
    return Array.from(tags);
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Date filter
      if (selectedDateFilter !== "all") {
        const d = r.created_at.split("T")[0];
        if (d !== selectedDateFilter) return false;
      }

      // Tag filter
      if (selectedTagFilter !== "all") {
        if (!r.tags?.includes(selectedTagFilter)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = r.title.toLowerCase().includes(q);
        const inContent = r.content.toLowerCase().includes(q);
        if (!inTitle && !inContent) return false;
      }

      return true;
    });
  }, [reports, selectedDateFilter, selectedTagFilter, searchQuery]);

  const activeReport = useMemo(() => {
    if (!selectedReportId) return filteredReports[0] || null;
    return reports.find((r) => r.id === selectedReportId) || filteredReports[0] || null;
  }, [reports, filteredReports, selectedReportId]);

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (reports.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 mx-auto w-fit">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          لا توجد تقارير مسجلة من الـ AI حتى الآن
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          عندما يقوم Hermes أو سكريبت الـ Cron اليومي بتخطيط اليوم أو تنفيذ عمليات، سيتم تسجيل التقارير التنفيذية وتنسيقها هنا تلقائياً.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                سجل عمليات وتقارير الـ AI ({filteredReports.length} من {reports.length})
              </h2>
              <p className="text-[11px] text-zinc-500">
                تصفح الملخصات التنفيذية والتوصيات الاستراتيجية المجدولة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Date Filter Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-transparent font-bold text-zinc-700 dark:text-zinc-300 outline-hidden cursor-pointer text-xs"
              >
                <option value="all">كل الأيام</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            {uniqueTags.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1 text-xs">
                <Tag className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={selectedTagFilter}
                  onChange={(e) => setSelectedTagFilter(e.target.value)}
                  className="bg-transparent font-bold text-zinc-700 dark:text-zinc-300 outline-hidden cursor-pointer text-xs"
                >
                  <option value="all">كل التصنيفات</option>
                  {uniqueTags.map((t) => (
                    <option key={t} value={t}>
                      #{t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute start-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في محتوى وعناوين التقارير..."
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 py-2 ps-9 pe-4 text-xs font-medium placeholder-zinc-400 outline-hidden focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* 2. Main Reports Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reports Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[750px] overflow-y-auto pe-1 scrollbar-thin">
          {filteredReports.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400">
              لا توجد تقارير مطابقة لخيارات الفلترة.
            </div>
          ) : (
            filteredReports.map((report) => {
              const isSelected = activeReport?.id === report.id;
              const dateStr = new Date(report.created_at).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const timeStr = new Date(report.created_at).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                    isSelected
                      ? "bg-purple-50/90 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-2xs"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute start-0 top-0 bottom-0 w-1 bg-purple-600 rounded-s-full" />
                  )}

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 font-bold text-zinc-600 dark:text-zinc-300">
                      <Calendar className="h-3 w-3 text-purple-500" />
                      {dateStr}
                    </span>
                    <span className="font-mono text-[10px]">{timeStr}</span>
                  </div>

                  <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                    {report.title}
                  </h3>

                  {report.tags && report.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {report.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Active Report Reader Panel (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          {activeReport ? (
            <>
              {/* Report Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-black">
                      تقرير تنفيذي مصدق ✨
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {new Date(activeReport.created_at).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <h1 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {activeReport.title}
                  </h1>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyContent(activeReport.content, activeReport.id)}
                  className="shrink-0 gap-1.5 rounded-2xl border-zinc-200 dark:border-zinc-700 text-xs font-bold cursor-pointer"
                >
                  {copiedId === activeReport.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  )}
                  <span>
                    {copiedId === activeReport.id ? "تم النسخ!" : "نسخ التقرير"}
                  </span>
                </Button>
              </div>

              {/* Formatted Markdown Body */}
              <div className="pt-2">
                <FormattedReportContent content={activeReport.content} />
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-zinc-400">
              اختر تقريراً من القائمة لعرض تفاصيله
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
