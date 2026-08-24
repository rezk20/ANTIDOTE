"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TASK_TYPES } from "@/lib/constants/enums";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { Star } from "lucide-react";

export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isRtl } = useLocale();

  const currentStatus = searchParams.get("status") || "active";
  const currentType = searchParams.get("task_type") || "all";
  const currentTopThree = searchParams.get("top_three") === "true";

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value == null || value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/tasks?${params.toString()}`);
  }

  const typeOptions = [
    { value: "all", label: isRtl ? "جميع التصنيفات (All Types)" : "All Task Types" },
    ...TASK_TYPES.map((type) => {
      const arTypeLabels: Record<string, string> = {
        revenue: "💰 عائد مباشر (Revenue)",
        product: "🔨 بناء وتطوير (Product)",
        client: "👥 تسليم عميل (Client)",
        career: "🚀 مسار مهني (Career)",
        finance: "💳 مالية (Finance)",
        marriage: "💍 زواج (Marriage)",
        learning: "📚 تعلم (Learning)",
        relationship: "❤️ علاقة وأسرة (Relationship)",
        personal: "👤 شخصي (Personal)",
        admin: "⚙️ إداري (Admin)",
        health_routine: "🏃 روتين صحي (Health)",
      };
      return {
        value: type,
        label: isRtl ? arTypeLabels[type] || type : type.charAt(0).toUpperCase() + type.slice(1),
      };
    }),
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-xs">
      {/* Status Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {[
          { label: t.common.active, value: "active" },
          { label: t.common.backlog, value: "backlog" },
          { label: t.common.planned, value: "planned" },
          { label: t.common.inProgress, value: "in_progress" },
          { label: t.common.completed, value: "done" },
          { label: t.common.all, value: "all" },
        ].map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter("status", tab.value === "active" ? null : tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Type Selector & Top 3 Toggle */}
      <div className="flex items-center gap-3 self-end sm:self-auto min-w-[200px]">
        {/* Top 3 Focus Filter */}
        <button
          onClick={() => setFilter("top_three", currentTopThree ? null : "true")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
            currentTopThree
              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
              : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${currentTopThree ? "fill-amber-500 text-amber-500" : ""}`} />
          <span>{t.tasks.topThree}</span>
        </button>

        {/* CustomSelect for Type */}
        <div className="w-48 shrink-0">
          <CustomSelect
            value={currentType}
            onChange={(val) => setFilter("task_type", val)}
            options={typeOptions}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
