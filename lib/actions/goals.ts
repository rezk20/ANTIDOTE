"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { goalSchema, type GoalState } from "@/lib/schemas/goals";

export async function createGoal(
  _prevState: GoalState,
  formData: FormData,
): Promise<GoalState> {
  const session = await verifySession();

  const rawParentId = formData.get("parent_id");
  const parentId = rawParentId && String(rawParentId).trim() !== "" ? String(rawParentId) : null;

  const rawTargetValue = formData.get("target_value");
  const targetValue = rawTargetValue && String(rawTargetValue).trim() !== "" ? Number(rawTargetValue) : null;

  const validated = goalSchema.safeParse({
    title: formData.get("title"),
    level: formData.get("level"),
    description: formData.get("description") || null,
    parent_id: parentId,
    target_value: targetValue,
    unit: formData.get("unit") || null,
    status: formData.get("status") || "active",
    period_start: formData.get("period_start") || null,
    period_end: formData.get("period_end") || null,
    sort_order: formData.get("sort_order") || 0,
  });

  if (!validated.success) {
    return {
      ok: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please check the goal fields.",
    };
  }

  const d = validated.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("goals").insert({
    user_id: session.userId,
    title: d.title,
    level: d.level,
    description: d.description,
    parent_id: d.parent_id || null,
    target_value: d.target_value,
    unit: d.unit,
    status: d.status,
    period_start: d.period_start || null,
    period_end: d.period_end || null,
    sort_order: d.sort_order,
  });

  if (error) {
    console.error("Failed to create goal in action:", error.message);
    return {
      ok: false,
      message: "Failed to create goal in database.",
    };
  }

  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/home");

  return {
    ok: true,
    message: "Goal created successfully.",
  };
}

export async function updateGoal(
  id: string,
  _prevState: GoalState,
  formData: FormData,
): Promise<GoalState> {
  const session = await verifySession();

  const rawParentId = formData.get("parent_id");
  const parentId = rawParentId && String(rawParentId).trim() !== "" ? String(rawParentId) : null;

  const rawTargetValue = formData.get("target_value");
  const targetValue = rawTargetValue && String(rawTargetValue).trim() !== "" ? Number(rawTargetValue) : null;

  const validated = goalSchema.safeParse({
    title: formData.get("title"),
    level: formData.get("level"),
    description: formData.get("description") || null,
    parent_id: parentId,
    target_value: targetValue,
    unit: formData.get("unit") || null,
    status: formData.get("status") || "active",
    period_start: formData.get("period_start") || null,
    period_end: formData.get("period_end") || null,
    sort_order: formData.get("sort_order") || 0,
  });

  if (!validated.success) {
    return {
      ok: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please check the goal fields.",
    };
  }

  const d = validated.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("goals")
    .update({
      title: d.title,
      level: d.level,
      description: d.description,
      parent_id: d.parent_id || null,
      target_value: d.target_value,
      unit: d.unit,
      status: d.status,
      period_start: d.period_start || null,
      period_end: d.period_end || null,
      sort_order: d.sort_order,
    })
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to update goal in action:", error.message);
    return {
      ok: false,
      message: "Failed to update goal in database.",
    };
  }

  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/home");

  return {
    ok: true,
    message: "Goal updated successfully.",
  };
}

export async function deleteGoal(id: string): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Failed to delete goal:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/home");

  return { ok: true };
}
