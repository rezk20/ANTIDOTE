"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { taskSchema, type TaskState } from "@/lib/schemas/tasks";
import { inferPriorityTier, calculatePriorityScore } from "@/lib/logic/priority";
import type { TaskStatus, TaskPriority, TaskType } from "@/lib/supabase/types";

export async function createTask(
  _prevState: TaskState,
  formData: FormData,
): Promise<TaskState> {
  const session = await verifySession();

  const rawGoalId = formData.get("goal_id");
  const goalId = rawGoalId && String(rawGoalId).trim() !== "" ? String(rawGoalId) : null;

  const rawProjectId = formData.get("project_id");
  const projectId = rawProjectId && String(rawProjectId).trim() !== "" ? String(rawProjectId) : null;

  const revenueImpact = Number(formData.get("revenue_impact") ?? 0);
  const strategicImpact = Number(formData.get("strategic_impact") ?? 0);
  const urgency = Number(formData.get("urgency") ?? 0);
  const relationshipImpact = Number(formData.get("relationship_impact") ?? 0);
  const effort = Number(formData.get("effort") ?? 3);
  const isTopThree = formData.get("is_top_three") === "on" || formData.get("is_top_three") === "true";

  // If priority is not explicitly given, compute it from impacts
  let priority = (formData.get("priority") as TaskPriority) || "medium";
  if (!formData.get("priority")) {
    const score = calculatePriorityScore({
      revenue_impact: revenueImpact,
      strategic_impact: strategicImpact,
      urgency,
      relationship_impact: relationshipImpact,
      effort,
      is_top_three: isTopThree,
    });
    priority = inferPriorityTier(score);
  }

  const validated = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    area: formData.get("area") || null,
    task_type: (formData.get("task_type") as TaskType) || "revenue",
    priority,
    effort,
    duration_min: formData.get("duration_min") ? Number(formData.get("duration_min")) : null,
    scheduled_date: formData.get("scheduled_date") || null,
    deadline: formData.get("deadline") || null,
    status: (formData.get("status") as TaskStatus) || "backlog",
    is_top_three: isTopThree,
    recurring_rule: formData.get("recurring_rule") || null,
    energy_level: Number(formData.get("energy_level") ?? 3),
    revenue_impact: revenueImpact,
    strategic_impact: strategicImpact,
    relationship_impact: relationshipImpact,
    urgency,
    goal_id: goalId,
    project_id: projectId,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });

  if (!validated.success) {
    return {
      ok: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please check the task fields.",
    };
  }

  const d = validated.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("tasks").insert({
    user_id: session.userId,
    title: d.title,
    description: d.description,
    area: d.area,
    task_type: d.task_type,
    priority: d.priority,
    effort: d.effort,
    duration_min: d.duration_min,
    scheduled_date: d.scheduled_date || null,
    deadline: d.deadline || null,
    status: d.status,
    is_top_three: d.is_top_three,
    recurring_rule: d.recurring_rule || null,
    energy_level: d.energy_level,
    revenue_impact: d.revenue_impact,
    strategic_impact: d.strategic_impact,
    relationship_impact: d.relationship_impact,
    urgency: d.urgency,
    goal_id: d.goal_id || null,
    project_id: d.project_id || null,
    sort_order: d.sort_order,
  });

  if (error) {
    console.error("Failed to create task in action:", error.message);
    return {
      ok: false,
      message: "Failed to create task in database.",
    };
  }

  revalidatePath("/tasks");
  revalidatePath("/goals");
  revalidatePath("/today");
  revalidatePath("/home");

  return {
    ok: true,
    message: "Task created successfully.",
  };
}

export async function updateTask(
  id: string,
  _prevState: TaskState,
  formData: FormData,
): Promise<TaskState> {
  const session = await verifySession();

  const rawGoalId = formData.get("goal_id");
  const goalId = rawGoalId && String(rawGoalId).trim() !== "" ? String(rawGoalId) : null;

  const rawProjectId = formData.get("project_id");
  const projectId = rawProjectId && String(rawProjectId).trim() !== "" ? String(rawProjectId) : null;

  const isTopThree = formData.get("is_top_three") === "on" || formData.get("is_top_three") === "true";

  const validated = taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    area: formData.get("area") || null,
    task_type: formData.get("task_type"),
    priority: formData.get("priority") || "medium",
    effort: formData.get("effort") || 3,
    duration_min: formData.get("duration_min") ? Number(formData.get("duration_min")) : null,
    scheduled_date: formData.get("scheduled_date") || null,
    deadline: formData.get("deadline") || null,
    status: formData.get("status") || "backlog",
    is_top_three: isTopThree,
    recurring_rule: formData.get("recurring_rule") || null,
    energy_level: formData.get("energy_level") || 3,
    revenue_impact: formData.get("revenue_impact") || 0,
    strategic_impact: formData.get("strategic_impact") || 0,
    relationship_impact: formData.get("relationship_impact") || 0,
    urgency: formData.get("urgency") || 0,
    goal_id: goalId,
    project_id: projectId,
    sort_order: formData.get("sort_order") || 0,
  });

  if (!validated.success) {
    return {
      ok: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please check the task fields.",
    };
  }

  const d = validated.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      title: d.title,
      description: d.description,
      area: d.area,
      task_type: d.task_type,
      priority: d.priority,
      effort: d.effort,
      duration_min: d.duration_min,
      scheduled_date: d.scheduled_date || null,
      deadline: d.deadline || null,
      status: d.status,
      is_top_three: d.is_top_three,
      recurring_rule: d.recurring_rule || null,
      energy_level: d.energy_level,
      revenue_impact: d.revenue_impact,
      strategic_impact: d.strategic_impact,
      relationship_impact: d.relationship_impact,
      urgency: d.urgency,
      goal_id: d.goal_id || null,
      project_id: d.project_id || null,
      sort_order: d.sort_order,
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to update task in action:", error.message);
    return {
      ok: false,
      message: "Failed to update task in database.",
    };
  }

  revalidatePath("/tasks");
  revalidatePath("/goals");
  revalidatePath("/today");
  revalidatePath("/home");

  return {
    ok: true,
    message: "Task updated successfully.",
  };
}

export async function setTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const completedAt = status === "done" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: completedAt,
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to update task status:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/tasks");
  revalidatePath("/today");
  revalidatePath("/goals");
  revalidatePath("/home");

  return { ok: true };
}

export async function completeTask(
  id: string,
  done: boolean,
): Promise<{ ok: boolean; message?: string }> {
  return setTaskStatus(id, done ? "done" : "in_progress");
}

export async function moveTaskDate(
  id: string,
  scheduledDate: string | null,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("tasks")
    .update({
      scheduled_date: scheduledDate,
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to move task date:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/tasks");
  revalidatePath("/today");

  return { ok: true };
}

export async function toggleTopThree(
  id: string,
  currentVal: boolean,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("tasks")
    .update({
      is_top_three: !currentVal,
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to toggle top three:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/tasks");
  revalidatePath("/today");

  return { ok: true };
}

export async function deleteTask(id: string): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to delete task:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/tasks");
  revalidatePath("/goals");
  revalidatePath("/today");
  revalidatePath("/home");

  return { ok: true };
}
