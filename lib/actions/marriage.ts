"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { marriageExpenseFormSchema, type MarriageExpenseFormData } from "@/lib/schemas/marriage";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveMarriageExpense(
  input: MarriageExpenseFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = marriageExpenseFormSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message || "بيانات المصروف غير صالحة.",
      };
    }

    const { id, item, category, estimated_cost, actual_cost, paid_amount, deadline, priority, status, notes } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let expenseId = id;

    if (id) {
      const { data, error } = await supabase
        .from("marriage_expenses")
        .update({
          item,
          category,
          estimated_cost,
          actual_cost: actual_cost ?? null,
          paid_amount,
          deadline: deadline || null,
          priority,
          status,
          notes: notes ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating marriage expense:", error);
        return { ok: false, error: "تعذر تحديث بند المصروف." };
      }
      expenseId = data.id;
    } else {
      const { data, error } = await supabase
        .from("marriage_expenses")
        .insert({
          user_id: session.userId,
          item,
          category,
          estimated_cost,
          actual_cost: actual_cost ?? null,
          paid_amount,
          deadline: deadline || null,
          priority,
          status,
          notes: notes ?? null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting marriage expense:", error);
        return { ok: false, error: "تعذر إضافة بند المصروف." };
      }
      expenseId = data.id;
    }

    revalidatePath("/marriage");
    revalidatePath("/finances");
    revalidatePath("/dashboard");

    return { ok: true, data: { id: expenseId! } };
  } catch (error) {
    console.error("saveMarriageExpense unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function deleteMarriageExpense(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("marriage_expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error deleting marriage expense:", error);
      return { ok: false, error: "تعذر حذف المصروف." };
    }

    revalidatePath("/marriage");
    revalidatePath("/finances");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("deleteMarriageExpense error:", error);
    return { ok: false, error: "حدث خطأ أثناء حذف المصروف." };
  }
}

export async function recordExpensePayment(
  expenseId: string,
  amount: number,
): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    if (amount <= 0) {
      return { ok: false, error: "مبلغ السداد يجب أن يكون أكبر من 0." };
    }

    const supabase = await createSupabaseServerClient();

    const { data: existing, error: fetchErr } = await supabase
      .from("marriage_expenses")
      .select("paid_amount, estimated_cost, actual_cost")
      .eq("id", expenseId)
      .eq("user_id", session.userId)
      .single();

    if (fetchErr || !existing) {
      return { ok: false, error: "بند المصروف غير موجود." };
    }

    const newPaid = Number(existing.paid_amount || 0) + amount;
    const targetCost = Number(existing.actual_cost || existing.estimated_cost || 0);
    const newStatus = newPaid >= targetCost ? "paid" : "in_progress";

    const { error: updateErr } = await supabase
      .from("marriage_expenses")
      .update({
        paid_amount: newPaid,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", expenseId)
      .eq("user_id", session.userId);

    if (updateErr) {
      console.error("Error recording expense payment:", updateErr);
      return { ok: false, error: "تعذر تسجيل الدفعة المسددة." };
    }

    revalidatePath("/marriage");
    revalidatePath("/finances");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("recordExpensePayment error:", error);
    return { ok: false, error: "حدث خطأ أثناء تسجيل السداد." };
  }
}
