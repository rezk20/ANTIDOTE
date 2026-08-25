"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  habitFormSchema,
  toggleHabitLogSchema,
  type HabitFormData,
  type ToggleHabitLogData,
} from "@/lib/schemas/habits";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveHabit(
  input: HabitFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = habitFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "بيانات العادة غير صالحة." };
    }

    const { id, name, description, category, target_per_week, is_active, sort_order } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let habitId = id;

    if (id) {
      const { data, error } = await supabase
        .from("habits")
        .update({
          name,
          description: description ?? null,
          category,
          target_per_week,
          is_active,
          sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating habit:", error);
        return { ok: false, error: "تعذر تحديث العادة." };
      }
      habitId = data.id;
    } else {
      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: session.userId,
          name,
          description: description ?? null,
          category,
          target_per_week,
          is_active,
          sort_order,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting habit:", error);
        return { ok: false, error: "تعذر إضافة العادة." };
      }
      habitId = data.id;
    }

    revalidatePath("/habits");
    revalidatePath("/today");
    return { ok: true, data: { id: habitId! } };
  } catch (error) {
    console.error("saveHabit error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function toggleHabitLog(
  input: ToggleHabitLogData,
): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const parsed = toggleHabitLogSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "بيانات التسجيل غير صالحة." };
    }

    const { habit_id, log_date, completed, note } = parsed.data;
    const supabase = await createSupabaseServerClient();

    if (completed) {
      // Insert log
      const { error } = await supabase.from("habit_logs").upsert(
        {
          user_id: session.userId,
          habit_id,
          log_date,
          note: note ?? null,
        },
        { onConflict: "user_id,habit_id,log_date" },
      );

      if (error) {
        console.error("Error logging habit:", error);
        return { ok: false, error: "تعذر تسجيل العادة." };
      }
    } else {
      // Delete log
      const { error } = await supabase
        .from("habit_logs")
        .delete()
        .eq("user_id", session.userId)
        .eq("habit_id", habit_id)
        .eq("log_date", log_date);

      if (error) {
        console.error("Error unlogging habit:", error);
        return { ok: false, error: "تعذر إلغاء تسجيل العادة." };
      }
    }

    revalidatePath("/habits");
    revalidatePath("/today");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("toggleHabitLog error:", error);
    return { ok: false, error: "حدث خطأ أثناء تحديث العادة." };
  }
}

export async function deleteHabit(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error deleting habit:", error);
      return { ok: false, error: "تعذر حذف العادة." };
    }

    revalidatePath("/habits");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("deleteHabit error:", error);
    return { ok: false, error: "حدث خطأ أثناء حذف العادة." };
  }
}
