"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/dal/auth";
import type { RelationshipIdeaCategory, RelationshipBudgetTier, RelationshipWishlistCategory } from "@/lib/schemas/relationship";

interface IdeaJsonItem {
  title: string;
  category: RelationshipIdeaCategory;
  budget_tier: RelationshipBudgetTier;
  estimated_cost: number;
  notes?: string;
}

interface GiftJsonItem {
  title: string;
  category: RelationshipWishlistCategory;
  estimated_price?: number;
  url?: string | null;
  priority: "low" | "medium" | "high" | "critical";
  notes?: string;
}

export async function syncRelationshipDataFromJson() {
  try {
    const session = await verifySession();
    const userId = session.userId;
    const supabase = await createSupabaseServerClient();

    // 1. Read ideas JSON
    const ideasPath = path.resolve(process.cwd(), "data/relationship-ideas.json");
    if (fs.existsSync(ideasPath)) {
      const raw = fs.readFileSync(ideasPath, "utf-8");
      const ideasList: IdeaJsonItem[] = JSON.parse(raw);

      if (Array.isArray(ideasList) && ideasList.length > 0) {
        // Delete and repopulate cleanly
        await supabase.from("relationship_ideas").delete().eq("user_id", userId);

        const rows = ideasList.map((item) => ({
          user_id: userId,
          title: item.title,
          category: item.category,
          budget_tier: item.budget_tier,
          estimated_cost: item.estimated_cost || 0,
          notes: item.notes || null,
          is_completed: false,
        }));

        await supabase.from("relationship_ideas").insert(rows);
      }
    }

    // 2. Read gifts JSON
    const giftsPath = path.resolve(process.cwd(), "data/relationship-gifts.json");
    if (fs.existsSync(giftsPath)) {
      const rawGifts = fs.readFileSync(giftsPath, "utf-8");
      const giftsList: GiftJsonItem[] = JSON.parse(rawGifts);

      if (Array.isArray(giftsList) && giftsList.length > 0) {
        await supabase.from("relationship_wishlist").delete().eq("user_id", userId);

        const giftRows = giftsList.map((item) => ({
          user_id: userId,
          title: item.title,
          category: item.category,
          estimated_price: item.estimated_price || null,
          url: item.url || null,
          priority: item.priority || "medium",
          notes: item.notes || null,
          is_bought: false,
        }));

        await supabase.from("relationship_wishlist").insert(giftRows);
      }
    }

    revalidatePath("/relationship");
    return { ok: true };
  } catch (error) {
    console.error("Error syncing relationship data from JSON:", error);
    return { ok: false, error: (error as Error).message };
  }
}
