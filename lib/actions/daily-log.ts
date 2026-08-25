"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { dailyLogFormSchema, type DailyLogFormData } from "@/lib/schemas/daily-log";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveDailyLog(
  input: DailyLogFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = dailyLogFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "بيانات السجل اليومي غير صالحة." };
    }

    const { log_date, sleep_at, woke_at, hours_slept, energy, focus, note } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let computedHours = hours_slept;
    if (computedHours == null && sleep_at && woke_at) {
      const [sh, sm] = sleep_at.split(":").map(Number);
      const [wh, wm] = woke_at.split(":").map(Number);
      const sMin = sh * 60 + sm;
      let wMin = wh * 60 + wm;
      if (wMin < sMin) {
        wMin += 24 * 60; // Slept past midnight
      }
      computedHours = Math.round(((wMin - sMin) / 60) * 10) / 10;
    }

    const payload = {
      user_id: session.userId,
      log_date,
      sleep_at: sleep_at || null,
      woke_at: woke_at || null,
      hours_slept: computedHours ?? null,
      energy: energy ?? null,
      focus: focus ?? null,
      note: note || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("daily_logs")
      .upsert(payload, { onConflict: "user_id,log_date" })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving daily log:", error);
      return { ok: false, error: "تعذر حفظ السجل اليومي." };
    }

    revalidatePath("/today");
    revalidatePath("/home");
    revalidatePath("/dashboard");
    return { ok: true, data: { id: data.id } };
  } catch (error) {
    console.error("saveDailyLog error:", error);
    return { ok: false, error: "حدث خطأ أثناء حفظ السجل." };
  }
}
