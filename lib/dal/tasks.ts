import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import type { TaskRow, TaskStatus, TaskType } from "@/lib/supabase/types";

export interface TaskFilterOptions {
  status?: TaskStatus | "all" | "active";
  task_type?: TaskType | "all";
  goal_id?: string;
  project_id?: string;
  scheduled_date?: string;
  is_top_three?: boolean;
}

/**
 * Fetch filtered tasks for the authenticated owner.
 */
export const getTasks = cache(
  async (filters: TaskFilterOptions = {}): Promise<TaskRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.userId);

    if (filters.status && filters.status !== "all") {
      if (filters.status === "active") {
        query = query.in("status", ["backlog", "planned", "in_progress"]);
      } else {
        query = query.eq("status", filters.status);
      }
    }

    if (filters.task_type && filters.task_type !== "all") {
      query = query.eq("task_type", filters.task_type);
    }

    if (filters.goal_id) {
      query = query.eq("goal_id", filters.goal_id);
    }

    if (filters.project_id) {
      query = query.eq("project_id", filters.project_id);
    }

    if (filters.scheduled_date) {
      query = query.eq("scheduled_date", filters.scheduled_date);
    }

    if (typeof filters.is_top_three === "boolean") {
      query = query.eq("is_top_three", filters.is_top_three);
    }

    query = query
      .order("is_top_three", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch tasks in DAL:", error.message);
      return [];
    }

    return (data ?? []) as TaskRow[];
  },
);

/**
 * Fetch stale tasks (active tasks not updated for 3+ days).
 */
export const getStaleTasks = cache(async (): Promise<TaskRow[]> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", session.userId)
    .in("status", ["backlog", "planned", "in_progress"])
    .lte("updated_at", threeDaysAgo.toISOString())
    .order("updated_at", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Failed to fetch stale tasks in DAL:", error.message);
    return [];
  }

  return (data ?? []) as TaskRow[];
});

/**
 * Fetch a single task by ID.
 */
export const getTask = cache(async (id: string): Promise<TaskRow | null> => {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch task by ID in DAL:", error.message);
    return null;
  }

  return (data ?? null) as TaskRow | null;
});
