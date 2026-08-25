import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifySession } from "./auth";
import { getTransactions } from "./finance";
import { calculateMonthlyTotals } from "@/lib/logic/finance";
import { getBudgetAwareSuggestion, SEEDED_IDEAS_TEMPLATE, type BudgetAwareRecommendation } from "@/lib/logic/relationship";
import type {
  RelationshipIdeaRow,
  RelationshipWishlistRow,
  RelationshipCheckinRow,
} from "@/lib/supabase/types";

export const getRelationshipIdeas = cache(
  async (): Promise<RelationshipIdeaRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("relationship_ideas")
      .select("*")
      .eq("user_id", session.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching relationship ideas:", error);
      return [];
    }

    if (!data || data.length === 0) {
      // Auto-seed template ideas for new users
      const toInsert = SEEDED_IDEAS_TEMPLATE.map((item) => ({
        user_id: session.userId,
        title: item.title,
        category: item.category,
        budget_tier: item.budget_tier,
        estimated_cost: item.estimated_cost,
        notes: item.notes,
        is_completed: false,
      }));

      const { data: seeded } = await supabase
        .from("relationship_ideas")
        .insert(toInsert)
        .select("*");

      return (seeded ?? []) as RelationshipIdeaRow[];
    }

    return data as RelationshipIdeaRow[];
  },
);

export const getRelationshipWishlist = cache(
  async (): Promise<RelationshipWishlistRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("relationship_wishlist")
      .select("*")
      .eq("user_id", session.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching relationship wishlist:", error);
      return [];
    }

    return (data ?? []) as RelationshipWishlistRow[];
  },
);

export const getRelationshipCheckins = cache(
  async (): Promise<RelationshipCheckinRow[]> => {
    const session = await verifySession();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("relationship_checkins")
      .select("*")
      .eq("user_id", session.userId)
      .order("checkin_date", { ascending: false });

    if (error) {
      console.error("Error fetching relationship checkins:", error);
      return [];
    }

    return (data ?? []) as RelationshipCheckinRow[];
  },
);

export interface RelationshipPageData {
  ideas: RelationshipIdeaRow[];
  wishlist: RelationshipWishlistRow[];
  checkins: RelationshipCheckinRow[];
  recommendation: BudgetAwareRecommendation;
}

export const getRelationshipDashboardData = cache(
  async (): Promise<RelationshipPageData> => {
    const [ideas, wishlist, checkins, txs] = await Promise.all([
      getRelationshipIdeas(),
      getRelationshipWishlist(),
      getRelationshipCheckins(),
      getTransactions(),
    ]);

    const monthlyTotals = calculateMonthlyTotals(txs);
    const recommendation = getBudgetAwareSuggestion({
      netSavingsThisMonth: monthlyTotals.netSavings,
      ideas,
    });

    return {
      ideas,
      wishlist,
      checkins,
      recommendation,
    };
  },
);
