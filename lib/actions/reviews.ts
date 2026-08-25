"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import { weeklyReviewFormSchema, type WeeklyReviewFormData } from "@/lib/schemas/reviews";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function saveWeeklyReview(
  input: WeeklyReviewFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = weeklyReviewFormSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "بيانات المراجعة غير صالحة. يرجى التأكد من ملء جميع الحقول المطلوبة.",
      };
    }

    const { id, period_start, period_end, scores, answers } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let reviewId = id;

    if (id) {
      // Update existing review
      const { data, error } = await supabase
        .from("reviews")
        .update({
          period_start,
          period_end,
          scores,
          answers,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating review:", error);
        return { ok: false, error: "تعذر تحديث المراجعة الأسبوعية. يرجى المحاولة مرة أخرى." };
      }
      reviewId = data.id;
    } else {
      // Upsert by period_start to prevent duplicates
      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: session.userId,
            review_type: "weekly",
            period_start,
            period_end,
            scores,
            answers,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,review_type,period_start" },
        )
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting review:", error);
        return { ok: false, error: "تعذر حفظ المراجعة الأسبوعية. يرجى المحاولة مرة أخرى." };
      }
      reviewId = data.id;
    }

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    revalidatePath("/home");

    return { ok: true, data: { id: reviewId! } };
  } catch (error) {
    console.error("saveWeeklyReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ المراجعة." };
  }
}

export async function deleteReview(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error deleting review:", error);
      return { ok: false, error: "تعذر حذف المراجعة." };
    }

    revalidatePath("/reviews");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("deleteReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ أثناء حذف المراجعة." };
  }
}

export async function createTasksFromReviewTopThree(
  topThreeText: string,
  targetDate?: string,
): Promise<ActionResponse<{ count: number }>> {
  try {
    const session = await verifySession();
    if (!topThreeText || !topThreeText.trim()) {
      return { ok: false, error: "لا توجد أولويات محددة للتحويل." };
    }

    const lines = topThreeText
      .split("\n")
      .map((l) => l.replace(/^(\d+[\.\-\)]|\-|\*)\s*/, "").trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      return { ok: false, error: "لم يتم العثور على أهداف صالحة في النص." };
    }

    const supabase = await createSupabaseServerClient();

    const defaultScheduledDate = targetDate || new Date().toISOString().slice(0, 10);

    const tasksToInsert = lines.map((title, idx) => ({
      user_id: session.userId,
      title,
      task_type: "revenue" as const,
      priority: "high" as const,
      status: "planned" as const,
      scheduled_date: defaultScheduledDate,
      revenue_impact: 4,
      strategic_impact: 4,
      urgency: 3,
      sort_order: idx,
    }));

    const { error } = await supabase.from("tasks").insert(tasksToInsert);

    if (error) {
      console.error("Error creating tasks from top three:", error);
      return { ok: false, error: "تعذر إنشاء المهام للأسبوع القادم." };
    }

    revalidatePath("/tasks");
    revalidatePath("/today");
    revalidatePath("/dashboard");
    revalidatePath("/reviews");

    return { ok: true, data: { count: tasksToInsert.length } };
  } catch (error) {
    console.error("createTasksFromReviewTopThree unexpected error:", error);
    return { ok: false, error: "حدث خطأ أثناء إنشاء المهام." };
  }
}
