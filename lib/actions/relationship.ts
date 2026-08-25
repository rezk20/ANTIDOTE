"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import {
  relationshipIdeaFormSchema,
  relationshipWishlistFormSchema,
  relationshipCheckinFormSchema,
  type RelationshipIdeaFormData,
  type RelationshipWishlistFormData,
  type RelationshipCheckinFormData,
} from "@/lib/schemas/relationship";

export type ActionResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// 1. Ideas Actions
export async function saveRelationshipIdea(
  input: RelationshipIdeaFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = relationshipIdeaFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "بيانات الفكرة غير صالحة." };
    }

    const { id, title, category, budget_tier, estimated_cost, notes, is_completed } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let ideaId = id;

    if (id) {
      const { data, error } = await supabase
        .from("relationship_ideas")
        .update({
          title,
          category,
          budget_tier,
          estimated_cost,
          notes: notes ?? null,
          is_completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating idea:", error);
        return { ok: false, error: "تعذر تحديث الفكرة." };
      }
      ideaId = data.id;
    } else {
      const { data, error } = await supabase
        .from("relationship_ideas")
        .insert({
          user_id: session.userId,
          title,
          category,
          budget_tier,
          estimated_cost,
          notes: notes ?? null,
          is_completed: false,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting idea:", error);
        return { ok: false, error: "تعذر إضافة الفكرة." };
      }
      ideaId = data.id;
    }

    revalidatePath("/relationship");
    revalidatePath("/dashboard");
    return { ok: true, data: { id: ideaId! } };
  } catch (error) {
    console.error("saveRelationshipIdea error:", error);
    return { ok: false, error: "حدث خطأ أثناء حفظ الفكرة." };
  }
}

export async function toggleIdeaCompleted(
  id: string,
  is_completed: boolean,
): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("relationship_ideas")
      .update({
        is_completed,
        last_done_at: is_completed ? new Date().toISOString().slice(0, 10) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error toggling idea:", error);
      return { ok: false, error: "تعذر تحديث حالة الفكرة." };
    }

    revalidatePath("/relationship");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("toggleIdeaCompleted error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function deleteRelationshipIdea(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("relationship_ideas")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error deleting idea:", error);
      return { ok: false, error: "تعذر حذف الفكرة." };
    }

    revalidatePath("/relationship");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("deleteRelationshipIdea error:", error);
    return { ok: false, error: "حدث خطأ أثناء حذف الفكرة." };
  }
}

// 2. Wishlist Actions
export async function saveWishlistItem(
  input: RelationshipWishlistFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = relationshipWishlistFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "بيانات الرغبة غير صالحة." };
    }

    const { id, title, category, estimated_price, url, priority, notes } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let itemId = id;

    if (id) {
      const { data, error } = await supabase
        .from("relationship_wishlist")
        .update({
          title,
          category,
          estimated_price: estimated_price ?? null,
          url: url || null,
          priority,
          notes: notes ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating wishlist item:", error);
        return { ok: false, error: "تعذر تحديث العنصر." };
      }
      itemId = data.id;
    } else {
      const { data, error } = await supabase
        .from("relationship_wishlist")
        .insert({
          user_id: session.userId,
          title,
          category,
          estimated_price: estimated_price ?? null,
          url: url || null,
          priority,
          is_bought: false,
          notes: notes ?? null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting wishlist item:", error);
        return { ok: false, error: "تعذر إضافة العنصر إلى القائمة." };
      }
      itemId = data.id;
    }

    revalidatePath("/relationship");
    return { ok: true, data: { id: itemId! } };
  } catch (error) {
    console.error("saveWishlistItem error:", error);
    return { ok: false, error: "حدث خطأ أثناء حفظ العنصر." };
  }
}

export async function toggleWishlistBought(
  id: string,
  is_bought: boolean,
): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("relationship_wishlist")
      .update({
        is_bought,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error toggling wishlist item:", error);
      return { ok: false, error: "تعذر تحديث حالة الشراء." };
    }

    revalidatePath("/relationship");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("toggleWishlistBought error:", error);
    return { ok: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function deleteWishlistItem(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("relationship_wishlist")
      .delete()
      .eq("id", id)
      .eq("user_id", session.userId);

    if (error) {
      console.error("Error deleting wishlist item:", error);
      return { ok: false, error: "تعذر حذف العنصر." };
    }

    revalidatePath("/relationship");
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("deleteWishlistItem error:", error);
    return { ok: false, error: "حدث خطأ أثناء حذف العنصر." };
  }
}

// 3. Weekly Check-In Action
export async function saveRelationshipCheckin(
  input: RelationshipCheckinFormData,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await verifySession();
    const parsed = relationshipCheckinFormSchema.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "بيانات التقييم غير صالحة." };
    }

    const { id, checkin_date, answers, notes } = parsed.data;
    const supabase = await createSupabaseServerClient();

    let checkinId = id;

    if (id) {
      const { data, error } = await supabase
        .from("relationship_checkins")
        .update({
          checkin_date,
          answers,
          notes: notes ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", session.userId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating checkin:", error);
        return { ok: false, error: "تعذر تحديث التقييم." };
      }
      checkinId = data.id;
    } else {
      const { data, error } = await supabase
        .from("relationship_checkins")
        .insert({
          user_id: session.userId,
          checkin_date,
          answers,
          notes: notes ?? null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error inserting checkin:", error);
        return { ok: false, error: "تعذر حفظ التقييم الأسبوعي." };
      }
      checkinId = data.id;
    }

    revalidatePath("/relationship");
    revalidatePath("/marriage");
    return { ok: true, data: { id: checkinId! } };
  } catch (error) {
    console.error("saveRelationshipCheckin error:", error);
    return { ok: false, error: "حدث خطأ أثناء حفظ التقييم." };
  }
}
