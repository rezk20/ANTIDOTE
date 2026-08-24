import { getGoalTree, getGoals } from "@/lib/dal/goals";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { GoalTree } from "@/components/goals/goal-tree";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const [goalTree, allGoals] = await Promise.all([
    getGoalTree(),
    getGoals(),
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Goals & Transformation Hierarchy"
        description="Connect long-term vision to 10-year targets, annual objectives, quarterly milestones, and weekly action items."
        badge={<Badge variant="accent">{allGoals.length} Goals</Badge>}
      />

      <GoalTree goalTree={goalTree} allGoals={allGoals} />
    </div>
  );
}
