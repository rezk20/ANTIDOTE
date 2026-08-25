"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { opportunitySchema, type OpportunityInput } from "@/lib/schemas/opportunities";
import type { OpportunityRow } from "@/lib/supabase/types";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveOpportunity(
  input: OpportunityInput,
): Promise<ActionResponse<OpportunityRow>> {
  try {
    const session = await verifySession();
    const parsed = opportunitySchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message || "بيانات الفرصة غير صالحة.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const data = parsed.data;

    if (data.id) {
      // Update
      const { data: updated, error } = await supabase
        .from("opportunities")
        .update({
          title: data.title,
          kind: data.kind,
          expected_value: data.expected_value,
          probability: data.probability,
          time_required_hours: data.time_required_hours,
          risk: data.risk,
          next_action: data.next_action || null,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("user_id", session.userId)
        .select()
        .single();

      if (error || !updated) {
        console.error("Error updating opportunity:", error);
        return { ok: false, error: "تعذر تحديث الفرصة." };
      }

      revalidatePath("/opportunities");
      revalidatePath("/analytics");
      return { ok: true, data: updated as OpportunityRow };
    } else {
      // Insert
      const { data: created, error } = await supabase
        .from("opportunities")
        .insert({
          user_id: session.userId,
          title: data.title,
          kind: data.kind,
          expected_value: data.expected_value,
          probability: data.probability,
          time_required_hours: data.time_required_hours,
          risk: data.risk,
          next_action: data.next_action || null,
          status: data.status,
        })
        .select()
        .single();

      if (error || !created) {
        console.error("Error creating opportunity:", error);
        return { ok: false, error: "تعذر تسجيل الفرصة." };
      }

      revalidatePath("/opportunities");
      revalidatePath("/analytics");
      return { ok: true, data: created as OpportunityRow };
    }
  } catch (error) {
    console.error("saveOpportunity error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ الفرصة." };
  }
}

export async function deleteOpportunity(
  id: string,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("deleteOpportunity error:", error);
      return { ok: false, error: "تعذر حذف الفرصة." };
    }

    revalidatePath("/opportunities");
    revalidatePath("/analytics");
    return { ok: true, data: { id } };
  } catch (error) {
    console.error("deleteOpportunity error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف الفرصة." };
  }
}
