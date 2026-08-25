"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  routineFormSchema,
  type RoutineFormData,
  type RoutineItem,
} from "@/lib/schemas/routines";
import { DEFAULT_ROUTINES_SEED } from "@/lib/logic/routines";
import type { Json } from "@/lib/supabase/types";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveRoutine(
  input: RoutineFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = routineFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "بيانات الروتين غير صالحة." };
    }

    const { id, name, time_of_day, items, is_active, sort_order } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let routineId = id;

    if (id) {
      const { data, error } = await supabase
        .from("routines")
        .update({
          name,
          time_of_day,
          items: items as unknown as Json,
          is_active,
          sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating routine:", error);
        return { ok: false, error: "تعذر تحديث الروتين." };
      }
      routineId = data.id;
    } else {
      const { data, error } = await supabase
        .from("routines")
        .insert({
          user_id: session.userId,
          name,
          time_of_day,
          items: items as unknown as Json,
          is_active,
          sort_order,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting routine:", error);
        return { ok: false, error: "تعذر إضافة الروتين." };
      }
      routineId = data.id;
    }

    revalidatePath("/routines");
    revalidatePath("/today");
    return { ok: true, data: { id: routineId! } };
  } catch (error) {
    console.error("saveRoutine error:", error);
    return { ok: false, error: "حدث خطأ أثناء حفظ الروتين." };
  }
}

export async function updateRoutineItems(
  routineId: string,
  items: RoutineItem[],
): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("routines")
      .update({
        items: items as unknown as Json,
        updated_at: new Date().toISOString(),
      })
      .eq("id", routineId)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error updating routine items:", error);
      return { ok: false, error: "تعذر تحديث بنود الروتين." };
    }

    revalidatePath("/routines");
    revalidatePath("/today");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("updateRoutineItems error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function resetRoutinesToDefaults(): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    // Delete existing
    await supabase.from("routines").delete().eq("user_id", session.userId);

    // Insert seeds
    const toInsert = DEFAULT_ROUTINES_SEED.map((r) => ({
      user_id: session.userId,
      name: r.name,
      time_of_day: r.time_of_day,
      items: r.items as unknown as Json,
      sort_order: r.sort_order,
      is_active: true,
    }));

    const { error } = await supabase.from("routines").insert(toInsert);

    if (error) {
      console.error("Error resetting routines:", error);
      return { ok: false, error: "تعذر استعادة القوالب الافتراضية." };
    }

    revalidatePath("/routines");
    revalidatePath("/today");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("resetRoutinesToDefaults error:", error);
    return { ok: false, error: "حدث خطأ أثناء استعادة القوالب." };
  }
}
