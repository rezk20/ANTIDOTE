"use client";

import { useState } from "react";
import { GoalCard } from "./goal-card";
import { GoalModal } from "./goal-modal";
import { GoalDetailModal } from "./goal-detail-modal";
import { Plus, ChevronDown, ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import type { GoalTreeNode } from "@/lib/dal/goals";
import type { GoalRow } from "@/lib/supabase/types";

function GoalTreeNodeItem({
  node,
  allGoals,
  onEdit,
  onAddChild,
  onViewDetails,
}: {
  node: GoalTreeNode;
  allGoals: GoalRow[];
  onEdit: (goal: GoalRow) => void;
  onAddChild: (parent: GoalRow) => void;
  onViewDetails: (goal: GoalRow) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 mt-4 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            )}
          </button>
        ) : (
          <div className="w-7 shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <GoalCard
            goal={node}
            onEdit={onEdit}
            onAddChild={onAddChild}
            onViewDetails={onViewDetails}
          />
        </div>
      </div>

      {/* Child Nodes */}
      {hasChildren && isExpanded && (
        <div className="ps-6 sm:ps-9 border-s-2 border-zinc-200 dark:border-zinc-800 space-y-3 ms-3 sm:ms-4">
          {node.children.map((child) => (
            <GoalTreeNodeItem
              key={child.id}
              node={child}
              allGoals={allGoals}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GoalTree({
  goalTree,
  allGoals,
}: {
  goalTree: GoalTreeNode[];
  allGoals: GoalRow[];
}) {
  const { t, isRtl } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<GoalRow | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | undefined>();
  const [defaultLevel, setDefaultLevel] = useState<string>("year");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalRow | null>(null);

  function handleCreateTopLevel() {
    setGoalToEdit(null);
    setDefaultParentId(undefined);
    setDefaultLevel("year");
    setIsModalOpen(true);
  }

  function handleEdit(goal: GoalRow) {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  }

  function handleViewDetails(goal: GoalRow) {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  }

  function handleAddChild(parent: GoalRow) {
    setGoalToEdit(null);
    setDefaultParentId(parent.id);

    const nextLevelMap: Record<string, string> = {
      vision: "year",
      year: "quarter",
      quarter: "month",
      month: "week",
      week: "week",
    };
    setDefaultLevel(nextLevelMap[parent.level] || "quarter");
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {isRtl ? "الهيكل الهرمي للتحول (Vision → Year → Q → M → W)" : "Transformation Hierarchy (Vision → Week)"}
          </h2>
        </div>
        <Button
          onClick={handleCreateTopLevel}
          variant="primary"
          size="sm"
          className="gap-1.5 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span>{t.goals.newGoal}</span>
        </Button>
      </div>

      {/* Goal Tree List */}
      {goalTree.length === 0 ? (
        <EmptyState
          icon={<Target className="h-6 w-6 text-emerald-500" />}
          title={t.goals.noGoalsTitle}
          description={t.goals.noGoalsDesc}
          action={
            <Button onClick={handleCreateTopLevel} size="sm" className="rounded-xl">
              {t.goals.newGoal}
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {goalTree.map((rootNode) => (
            <GoalTreeNodeItem
              key={rootNode.id}
              node={rootNode}
              allGoals={allGoals}
              onEdit={handleEdit}
              onAddChild={handleAddChild}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
        availableParents={allGoals}
        defaultParentId={defaultParentId}
        defaultLevel={defaultLevel}
      />

      {/* Detail Peek Modal */}
      <GoalDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        goal={selectedGoal}
        allGoals={allGoals}
        onEdit={() => {
          if (selectedGoal) handleEdit(selectedGoal);
        }}
      />
    </div>
  );
}
