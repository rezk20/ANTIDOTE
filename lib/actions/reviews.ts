"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  weeklyReviewFormSchema,
  monthlyReviewFormSchema,
  quarterlyReviewFormSchema,
  yearlyReviewFormSchema,
  type WeeklyReviewFormData,
  type MonthlyReviewFormData,
  type QuarterlyReviewFormData,
  type YearlyReviewFormData,
} from "@/lib/schemas/reviews";
import type { Json } from "@/lib/supabase/types";

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
      const { data, error } = await supabase
        .from("reviews")
        .update({
          period_start,
          period_end,
          scores: scores as unknown as Json,
          answers: answers as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating weekly review:", error);
        return { ok: false, error: "تعذر تحديث المراجعة الأسبوعية." };
      }
      reviewId = data.id;
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: session.userId,
            review_type: "weekly",
            period_start,
            period_end,
            scores: scores as unknown as Json,
            answers: answers as unknown as Json,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,review_type,period_start" },
        )
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting weekly review:", error);
        return { ok: false, error: "تعذر حفظ المراجعة الأسبوعية." };
      }
      reviewId = data.id;
    }

    revalidatePath("/reviews");
    revalidatePath("/home");
    return { ok: true, data: { id: reviewId! } };
  } catch (error) {
    console.error("saveWeeklyReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ المراجعة." };
  }
}

export async function saveMonthlyReview(
  input: MonthlyReviewFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = monthlyReviewFormSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "بيانات المراجعة الشهرية غير صالحة. يرجى مراجعة الحقول.",
      };
    }

    const { id, period_start, period_end, scores, answers } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let reviewId = id;

    if (id) {
      const { data, error } = await supabase
        .from("reviews")
        .update({
          period_start,
          period_end,
          scores: scores as unknown as Json,
          answers: answers as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating monthly review:", error);
        return { ok: false, error: "تعذر تحديث المراجعة الشهرية." };
      }
      reviewId = data.id;
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: session.userId,
            review_type: "monthly",
            period_start,
            period_end,
            scores: scores as unknown as Json,
            answers: answers as unknown as Json,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,review_type,period_start" },
        )
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting monthly review:", error);
        return { ok: false, error: "تعذر حفظ المراجعة الشهرية." };
      }
      reviewId = data.id;
    }

    revalidatePath("/reviews");
    revalidatePath("/home");
    return { ok: true, data: { id: reviewId! } };
  } catch (error) {
    console.error("saveMonthlyReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ المراجعة الشهرية." };
  }
}

export async function saveQuarterlyReview(
  input: QuarterlyReviewFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = quarterlyReviewFormSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "بيانات المراجعة الربع سنوية غير صالحة.",
      };
    }

    const { id, period_start, period_end, scores, answers } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let reviewId = id;

    if (id) {
      const { data, error } = await supabase
        .from("reviews")
        .update({
          period_start,
          period_end,
          scores: scores as unknown as Json,
          answers: answers as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating quarterly review:", error);
        return { ok: false, error: "تعذر تحديث المراجعة الربع سنوية." };
      }
      reviewId = data.id;
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: session.userId,
            review_type: "quarterly",
            period_start,
            period_end,
            scores: scores as unknown as Json,
            answers: answers as unknown as Json,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,review_type,period_start" },
        )
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting quarterly review:", error);
        return { ok: false, error: "تعذر حفظ المراجعة الربع سنوية." };
      }
      reviewId = data.id;
    }

    revalidatePath("/reviews");
    revalidatePath("/home");
    return { ok: true, data: { id: reviewId! } };
  } catch (error) {
    console.error("saveQuarterlyReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ المراجعة الربع سنوية." };
  }
}

export async function saveYearlyReview(
  input: YearlyReviewFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = yearlyReviewFormSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "بيانات مراجعة العام غير صالحة.",
      };
    }

    const { id, period_start, period_end, scores, answers } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let reviewId = id;

    if (id) {
      const { data, error } = await supabase
        .from("reviews")
        .update({
          period_start,
          period_end,
          scores: scores as unknown as Json,
          answers: answers as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating yearly review:", error);
        return { ok: false, error: "تعذر تحديث مراجعة العام." };
      }
      reviewId = data.id;
    } else {
      const { data, error } = await supabase
        .from("reviews")
        .upsert(
          {
            user_id: session.userId,
            review_type: "yearly",
            period_start,
            period_end,
            scores: scores as unknown as Json,
            answers: answers as unknown as Json,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,review_type,period_start" },
        )
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting yearly review:", error);
        return { ok: false, error: "تعذر حفظ مراجعة العام." };
      }
      reviewId = data.id;
    }

    revalidatePath("/reviews");
    revalidatePath("/home");
    return { ok: true, data: { id: reviewId! } };
  } catch (error) {
    console.error("saveYearlyReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حفظ مراجعة العام." };
  }
}

export async function deleteReview(
  id: string,
): Promise<ActionResponse<{ success: boolean }>> {
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
    revalidatePath("/home");
    return { ok: true, data: { success: true } };
  } catch (error) {
    console.error("deleteReview unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء حذف المراجعة." };
  }
}

export async function convertTopThreeToTasks(
  topThreeText: string,
  targetWeekStart?: string,
): Promise<ActionResponse<{ count: number }>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const lines = topThreeText
      .split("\n")
      .map((l) => l.trim().replace(/^[\d\-*.•]+\s*/, ""))
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      return { ok: false, error: "لا توجد أولويات مكتوبة لتحويلها." };
    }

    const defaultDate = targetWeekStart || new Date().toISOString().slice(0, 10);

    const tasksToInsert = lines.slice(0, 3).map((title, idx) => ({
      user_id: session.userId,
      title,
      priority: "critical" as const,
      task_type: "career" as const,
      is_top_three: true,
      status: "planned" as const,
      scheduled_date: defaultDate,
      sort_order: idx + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("tasks").insert(tasksToInsert);

    if (error) {
      console.error("Error creating top 3 tasks:", error);
      return { ok: false, error: "تعذر إنشاء المهام للأسبوع القادم." };
    }

    revalidatePath("/tasks");
    revalidatePath("/today");
    revalidatePath("/reviews");
    return { ok: true, data: { count: tasksToInsert.length } };
  } catch (error) {
    console.error("convertTopThreeToTasks unexpected error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع أثناء تحويل الأولويات." };
  }
}

export { convertTopThreeToTasks as createTasksFromReviewTopThree };

