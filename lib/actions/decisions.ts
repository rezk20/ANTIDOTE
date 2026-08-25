"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { decisionSchema, type DecisionInput } from "@/lib/schemas/decisions";
import type { DecisionRow } from "@/lib/supabase/types";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveDecision(
  input: DecisionInput,
): Promise<ActionResponse<DecisionRow>> {
  try {
    const session = await verifySession();
    const parsed = decisionSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message || "بيانات القرار غير صالحة.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const data = parsed.data;

    if (data.id) {
      // Update existing decision
      const { data: updated, error } = await supabase
        .from("decisions")
        .update({
          title: data.title,
          why_now: data.why_now || null,
          options: data.options,
          upside: data.upside || null,
          downside: data.downside || null,
          cost: data.cost || null,
          time_required: data.time_required || null,
          risk: data.risk || null,
          worst_case: data.worst_case || null,
          best_case: data.best_case || null,
          reversible: data.reversible,
          decision: data.decision || null,
          review_date: data.review_date || null,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("user_id", session.userId)
        .select()
        .single();

      if (error || !updated) {
        console.error("Error updating decision:", error);
        return { ok: false, error: "تعذر تحديث القرار." };
      }

      revalidatePath("/decisions");
      revalidatePath("/analytics");
      return { ok: true, data: updated as DecisionRow };
    } else {
      // Insert new decision
      const { data: created, error } = await supabase
        .from("decisions")
        .insert({
          user_id: session.userId,
          title: data.title,
          why_now: data.why_now || null,
          options: data.options,
          upside: data.upside || null,
          downside: data.downside || null,
          cost: data.cost || null,
          time_required: data.time_required || null,
          risk: data.risk || null,
          worst_case: data.worst_case || null,
          best_case: data.best_case || null,
          reversible: data.reversible,
          decision: data.decision || null,
          review_date: data.review_date || null,
          status: data.status,
        })
        .select()
        .single();

      if (error || !created) {
        console.error("Error creating decision:", error);
        return { ok: false, error: "تعذر تسجيل القرار." };
      }

      revalidatePath("/decisions");
      revalidatePath("/analytics");
      return { ok: true, data: created as DecisionRow };
    }
  } catch (error) {
    console.error("saveDecision error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ القرار." };
  }
}

export async function deleteDecision(id: string): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("decisions")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("deleteDecision error:", error);
      return { ok: false, error: "تعذر حذف القرار." };
    }

    revalidatePath("/decisions");
    revalidatePath("/analytics");
    return { ok: true, data: { id } };
  } catch (error) {
    console.error("deleteDecision unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف القرار." };
  }
}
