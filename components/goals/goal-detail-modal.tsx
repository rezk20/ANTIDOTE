"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import { Target, Layers, FileText } from "lucide-react";
import type { GoalRow } from "@/lib/supabase/types";

export function GoalDetailModal({
  isOpen,
  onClose,
  goal,
  allGoals = [],
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalRow | null;
  allGoals?: GoalRow[];
  onEdit?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !goal) return null;

  const parentGoal = allGoals.find((g) => g.id === goal.parent_id);
  const childGoals = allGoals.filter((g) => g.parent_id === goal.id);

  const chips: DetailChip[] = [
    {
      label: t.common.status,
      value: goal.status.toUpperCase(),
      variant: goal.status === "achieved" ? "emerald" : "blue",
    },
    {
      label: t.goals.level,
      value: goal.level.toUpperCase(),
      variant: "purple",
    },
    {
      label: t.goals.targetValue,
      value: goal.target_value != null ? `${goal.target_value} ${goal.unit ?? ""}` : (isRtl ? "غير محدد" : "None"),
      variant: "emerald",
    },
    {
      label: isRtl ? "الأهداف الفرعية" : "Sub-Goals",
      value: `${childGoals.length} ${isRtl ? "أهداف" : "milestones"}`,
      variant: "default",
    },
  ];

  const sections: DetailSection[] = [
    {
      title: t.goals.description,
      icon: <FileText className="h-3.5 w-3.5 text-purple-500" />,
      content: (
        <div className="space-y-3">
          {goal.description ? (
            <p className="whitespace-pre-wrap leading-relaxed">{goal.description}</p>
          ) : (
            <p className="text-zinc-400 italic">{t.common.noNotes}</p>
          )}

          {parentGoal && (
            <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60 flex items-center gap-1.5 font-bold text-zinc-600 dark:text-zinc-400">
              <Layers className="h-3.5 w-3.5" />
              <span>{t.goals.parentGoal}: {parentGoal.title}</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (childGoals.length > 0) {
    sections.push({
      title: isRtl ? "الأهداف والمراحل الفرعية التابعة" : "Child Milestones & Breakdown",
      icon: <Layers className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <div className="space-y-2">
          {childGoals.map((child) => (
            <div
              key={child.id}
              className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Target className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {child.title}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">
                {child.level}
              </Badge>
            </div>
          ))}
        </div>
      ),
    });
  }

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.title}
      subtitle={t.goals.goalDetails}
      icon={<Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
      badge={
        <Badge variant={goal.status === "achieved" ? "success" : "default"} className="text-xs font-bold uppercase">
          {goal.level}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.goals.editGoal}
    />
  );
}
