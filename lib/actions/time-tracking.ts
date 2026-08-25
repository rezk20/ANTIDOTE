"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  timeEntryFormSchema,
  timerSessionSchema,
  type TimeEntryFormData,
  type TimerSessionData,
} from "@/lib/schemas/time-entry";
import { calculateDurationMin } from "@/lib/logic/time-tracking";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function createTimeEntry(
  input: TimeEntryFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = timeEntryFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "بيانات جلسة الوقت غير صالحة." };
    }

    const { task_id, project_id, kind, started_at, ended_at, duration_min, focus_rating, note } = parsed.data;
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        user_id: session.userId,
        task_id: task_id || null,
        project_id: project_id || null,
        kind,
        started_at,
        ended_at: ended_at || null,
        duration_min,
        focus_rating: focus_rating ?? null,
        note: note || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating time entry:", error);
      return { ok: false, error: "تعذر حفظ جلسة العمل." };
    }

    revalidatePath("/today");
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    return { ok: true, data: { id: data.id } };
  } catch (error) {
    console.error("createTimeEntry error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function logTimerSession(
  input: TimerSessionData,
): Promise<ActionResponse<{ id: string; duration_min: number }>> {
  try {
    const session = await verifySession();
    const parsed = timerSessionSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "بيانات جلسة المؤقت غير صالحة." };
    }

    const { task_id, project_id, kind, started_at, ended_at, focus_rating, note } = parsed.data;
    const duration_min = calculateDurationMin(started_at, ended_at);

    if (duration_min <= 0) {
      return { ok: false, error: "مدة الجلسة قصيرة جداً (أقل من دقيقة)." };
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        user_id: session.userId,
        task_id: task_id || null,
        project_id: project_id || null,
        kind,
        started_at,
        ended_at,
        duration_min,
        focus_rating: focus_rating ?? 4,
        note: note || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error logging timer session:", error);
      return { ok: false, error: "تعذر حفظ جلسة المؤقت." };
    }

    revalidatePath("/today");
    revalidatePath("/tasks");
    return { ok: true, data: { id: data.id, duration_min } };
  } catch (error) {
    console.error("logTimerSession error:", error);
    return { ok: false, error: "حدث خطأ أثناء حفظ الجلسة." };
  }
}

export async function deleteTimeEntry(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("time_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error deleting time entry:", error);
      return { ok: false, error: "تعذر حذف الجلسة." };
    }

    revalidatePath("/today");
    revalidatePath("/calendar");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("deleteTimeEntry error:", error);
    return { ok: false, error: "حدث خطأ أثناء حذف الجلسة." };
  }
}
