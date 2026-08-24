import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import type { GoalRow, TaskRow } from "@/lib/supabase/types";

export interface GoalTreeNode extends GoalRow {
  children: GoalTreeNode[];
  tasksCount?: number;
}

/**
 * Fetch all goals for the authenticated owner.
 */
export const getGoals = cache(async (): Promise<GoalRow[]> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", session.userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch goals in DAL:", error.message);
    return [];
  }

  return (data ?? []) as GoalRow[];
});

/**
 * Fetch goals organized into a nested hierarchy tree.
 */
export const getGoalTree = cache(async (): Promise<GoalTreeNode[]> => {
  const goals = await getGoals();

  const map = new Map<string, GoalTreeNode>();
  goals.forEach((g) => {
    map.set(g.id, { ...g, children: [] });
  });

  const rootNodes: GoalTreeNode[] = [];

  goals.forEach((g) => {
    const node = map.get(g.id)!;
    if (g.parent_id && map.has(g.parent_id)) {
      map.get(g.parent_id)!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
});

/**
 * Fetch single goal by ID with its linked tasks.
 */
export const getGoal = cache(
  async (
    id: string,
  ): Promise<{ goal: GoalRow | null; linkedTasks: TaskRow[] }> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const [goalRes, tasksRes] = await Promise.all([
      supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.userId)
        .maybeSingle(),
      supabase
        .from("tasks")
        .select("*")
        .eq("goal_id", id)
        .eq("user_id", session.userId)
        .order("created_at", { ascending: false }),
    ]);

    return {
      goal: (goalRes.data ?? null) as GoalRow | null,
      linkedTasks: (tasksRes.data ?? []) as TaskRow[],
    };
  },
);
