"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { deleteGoal } from "@/lib/actions/goals";
import { useLocale } from "@/components/providers/locale-provider";
import { Target, Plus, Edit2, Trash2, Eye } from "lucide-react";
import type { GoalRow } from "@/lib/supabase/types";

const LEVEL_COLORS: Record<
  string,
  "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "accent"
> = {
  vision: "default",
  year: "accent",
  quarter: "success",
  month: "warning",
  week: "secondary",
};

export function GoalCard({
  goal,
  onEdit,
  onAddChild,
  onViewDetails,
}: {
  goal: GoalRow;
  onEdit: (goal: GoalRow) => void;
  onAddChild?: (parentGoal: GoalRow) => void;
  onViewDetails?: (goal: GoalRow) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isDeleting, startDelete] = useTransition();

  const badgeVariant = LEVEL_COLORS[goal.level] || "outline";

  const levelLabels: Record<string, string> = {
    vision: isRtl ? "رؤية (10Y)" : "VISION (10Y)",
    year: isRtl ? "سنوي (1Y)" : "YEAR (1Y)",
    quarter: isRtl ? "ربع سنوي (90D)" : "QUARTER (90D)",
    month: isRtl ? "شهري" : "MONTH",
    week: isRtl ? "أسبوعي" : "WEEK",
  };

  return (
    <div className="group rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={badgeVariant} className="font-bold text-[10px]">
            {levelLabels[goal.level] || goal.level.toUpperCase()}
          </Badge>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {goal.title}
          </h3>
        </div>

        {goal.target_value != null && (
          <div className="text-xs font-bold px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 self-start sm:self-auto border border-zinc-200/60 dark:border-zinc-700/60">
            {isRtl ? "المستهدف:" : "Target:"} {goal.target_value.toLocaleString()} {goal.unit ?? ""}
          </div>
        )}
      </div>

      {goal.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
          <Target className="h-3.5 w-3.5 text-zinc-400" />
          <span className="capitalize">{goal.status}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Eye Icon for Detail View */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(goal)}
              className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
              title={t.common.viewDetails}
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          {onAddChild && goal.level !== "week" && (
            <button
              onClick={() => onAddChild(goal)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              title={t.goals.addChild}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.goals.addChild}</span>
            </button>
          )}

          <button
            onClick={() => onEdit(goal)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={t.common.edit}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            disabled={isDeleting}
            onClick={() => {
              if (confirm(`${t.common.confirmDelete} "${goal.title}"? ${t.common.safeDeleteNotice}`)) {
                startDelete(async () => {
                  await deleteGoal(goal.id);
                });
              }
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title={t.common.delete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
