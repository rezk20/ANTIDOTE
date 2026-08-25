"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  dayPlanSchema,
  shutdownSchema,
  type DayPlanState,
  type ShutdownState,
} from "@/lib/schemas/day-plan";

export async function saveDayPlan(
  prevState: DayPlanState,
  formData: FormData,
): Promise<DayPlanState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    plan_date: formData.get("plan_date"),
    available_hours: formData.get("available_hours") || 6.0,
    energy: formData.get("energy") || 3,
    focus_question_answer: formData.get("focus_question_answer"),
    money_action_task_id: formData.get("money_action_task_id"),
    personal_action_task_id: formData.get("personal_action_task_id"),
    relationship_action_task_id: formData.get("relationship_action_task_id"),
    shutdown_time: formData.get("shutdown_time"),
    status: formData.get("status") || "active",
    notes: formData.get("notes"),
  };

  const parsed = dayPlanSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the validation errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("day_plans").upsert(
    {
      user_id: session.userId,
      ...parsed.data,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,plan_date",
    },
  );

  if (error) {
    console.error("Error saving day plan:", error);
    return {
      ok: false,
      message: error.message || "Failed to save day plan.",
    };
  }

  revalidatePath("/today");
  revalidatePath("/home");
  revalidatePath("/dashboard");
  return { ok: true, message: "Day plan saved successfully." };
}

export async function toggleTaskTopThree(
  taskId: string,
  isTopThree: boolean,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("tasks")
    .update({
      is_top_three: isTopThree,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Error toggling top three task:", error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/today");
  revalidatePath("/home");
  revalidatePath("/tasks");
  return { ok: true };
}

export async function toggleTaskComplete(
  taskId: string,
  completed: boolean,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const newStatus = completed ? "done" : "planned";
  const completedAt = completed ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("tasks")
    .update({
      status: newStatus,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("user_id", session.userId);

  if (error) {
    console.error("Error updating task completion:", error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/today");
  revalidatePath("/home");
  revalidatePath("/tasks");
  return { ok: true };
}

export async function closeDayPlan(
  prevState: ShutdownState,
  formData: FormData,
): Promise<ShutdownState> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const rawData = {
    plan_date: formData.get("plan_date"),
    tomorrow_focus: formData.get("tomorrow_focus"),
    shutdown_notes: formData.get("shutdown_notes"),
    rollover_task_ids: formData.get("rollover_task_ids") || "[]",
  };

  const parsed = shutdownSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the shutdown details.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const planDate = parsed.data.plan_date;

  // 1. Update day plan status to closed
  const { error: planError } = await supabase
    .from("day_plans")
    .update({
      status: "closed",
      notes: parsed.data.shutdown_notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", session.userId)
    .eq("plan_date", planDate);

  if (planError) {
    console.error("Error closing day plan:", planError);
    return { ok: false, message: "Failed to close day plan." };
  }

  // 2. Rollover tasks to tomorrow
  if (parsed.data.rollover_task_ids.length > 0) {
    const [y, m, d] = planDate.split("-").map(Number);
    const tomorrow = new Date(Date.UTC(y, m - 1, d + 1));
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { error: rollError } = await supabase
      .from("tasks")
      .update({
        scheduled_date: tomorrowStr,
        updated_at: new Date().toISOString(),
      })
      .in("id", parsed.data.rollover_task_ids)
      .eq("user_id", session.userId);

    if (rollError) {
      console.warn("Warning: Could not rollover tasks:", rollError);
    }
  }

  // 3. Record daily review entry in reviews table
  const { error: revError } = await supabase.from("reviews").insert({
    user_id: session.userId,
    review_type: "daily",
    period_start: planDate,
    period_end: planDate,
    answers: {
      tomorrow_focus: parsed.data.tomorrow_focus || null,
      shutdown_notes: parsed.data.shutdown_notes || null,
      rollover_count: parsed.data.rollover_task_ids.length,
    },
    scores: {},
  });

  if (revError) {
    console.warn("Warning: Could not save daily review log:", revError);
  }

  revalidatePath("/today");
  revalidatePath("/home");
  revalidatePath("/reviews");
  return { ok: true, message: "Day successfully closed." };
}

export async function reopenDayPlan(
  planDate: string,
): Promise<{ ok: boolean; message?: string }> {
  const session = await verifySession();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("day_plans")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", session.userId)
    .eq("plan_date", planDate);

  if (error) {
    console.error("Error reopening day plan:", error);
    return { ok: false, message: error.message };
  }

  revalidatePath("/today");
  revalidatePath("/home");
  return { ok: true };
}
