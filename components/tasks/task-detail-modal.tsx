"use client";

import { EntityDetailModal, type DetailChip, type DetailSection } from "@/components/ui/entity-detail-modal";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import { calculatePriorityScore } from "@/lib/logic/priority";
import {
  CheckSquare,
  Calendar,
  Zap,
  Target,
  FolderKanban,
  Repeat,
  FileText,
} from "lucide-react";
import type { TaskRow, GoalRow, ProjectRow } from "@/lib/supabase/types";

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  goals = [],
  projects = [],
  onEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  task: TaskRow | null;
  goals?: GoalRow[];
  projects?: ProjectRow[];
  onEdit?: () => void;
}) {
  const { t, isRtl } = useLocale();

  if (!isOpen || !task) return null;

  const linkedGoal = goals.find((g) => g.id === task.goal_id);
  const linkedProject = projects.find((p) => p.id === task.project_id);

  const priorityScore = calculatePriorityScore({
    revenue_impact: task.revenue_impact,
    strategic_impact: task.strategic_impact,
    urgency: task.urgency,
    effort: task.effort,
    is_top_three: task.is_top_three,
  });

  const priorityVariant: Record<string, "danger" | "warning" | "accent" | "secondary"> = {
    critical: "danger",
    high: "warning",
    medium: "accent",
    low: "secondary",
  };

  const classificationLabels: Record<string, string> = {
    revenue: t.tasks.revenueType,
    product: t.tasks.productType,
    client: t.tasks.clientType,
  };

  const chips: DetailChip[] = [
    {
      label: t.common.status,
      value: task.status.toUpperCase(),
      variant: task.status === "done" ? "emerald" : "blue",
    },
    {
      label: t.tasks.priorityTier,
      value: `${task.priority.toUpperCase()} (${priorityScore} pts)`,
      variant: task.priority === "critical" ? "rose" : task.priority === "high" ? "amber" : "purple",
    },
    {
      label: t.tasks.classification,
      value: classificationLabels[task.task_type] || task.task_type,
      variant: task.task_type === "revenue" ? "emerald" : "default",
    },
    {
      label: t.tasks.scheduledDate,
      value: task.scheduled_date || (isRtl ? "غير محدد" : "Not set"),
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      label: t.tasks.deadline,
      value: task.deadline || (isRtl ? "بدون deadline" : "No deadline"),
      icon: <Calendar className="h-3 w-3" />,
    },
    {
      label: t.tasks.topThree,
      value: task.is_top_three ? (isRtl ? "★ نعم (Top 3)" : "★ Yes (Top 3)") : (isRtl ? "لا" : "No"),
      variant: task.is_top_three ? "amber" : "default",
    },
  ];

  const sections: DetailSection[] = [
    {
      title: t.tasks.scoreBreakdown,
      icon: <Zap className="h-3.5 w-3.5 text-amber-500" />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-bold block">{t.tasks.revenueImpact}</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{task.revenue_impact ?? 0} / 5 (3x)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-bold block">{t.tasks.strategicImpact}</span>
            <span className="font-extrabold text-purple-600 dark:text-purple-400">{task.strategic_impact ?? 0} / 5 (2x)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-bold block">{t.tasks.urgency}</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">{task.urgency ?? 0} / 5 (2x)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
            <span className="text-[10px] text-zinc-400 font-bold block">{t.tasks.effort}</span>
            <span className="font-extrabold text-zinc-600 dark:text-zinc-400">{task.effort ?? 1} / 5 (-1x)</span>
          </div>
        </div>
      ),
    },
    {
      title: t.common.details,
      icon: <FileText className="h-3.5 w-3.5 text-blue-500" />,
      content: (
        <div className="space-y-3">
          {task.description ? (
            <p className="whitespace-pre-wrap leading-relaxed">{task.description}</p>
          ) : (
            <p className="text-zinc-400 italic">{t.common.noNotes}</p>
          )}

          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-zinc-200/50 dark:border-zinc-800/60 text-xs">
            {linkedGoal && (
              <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                <Target className="h-3.5 w-3.5" />
                <span>{t.tasks.linkedGoal}: {linkedGoal.title}</span>
              </span>
            )}
            {linkedProject && (
              <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>{t.tasks.linkedProject}: {linkedProject.name}</span>
              </span>
            )}
            {task.recurring_rule && (
              <span className="flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400">
                <Repeat className="h-3.5 w-3.5" />
                <span>{task.recurring_rule}</span>
              </span>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <EntityDetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      subtitle={t.tasks.taskDetails}
      icon={<CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      badge={
        <Badge variant={priorityVariant[task.priority] || "default"} className="text-xs font-bold uppercase">
          {task.priority}
        </Badge>
      }
      chips={chips}
      sections={sections}
      onEdit={onEdit}
      editLabel={t.tasks.editTask}
    />
  );
}
