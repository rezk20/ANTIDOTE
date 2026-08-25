import { describe, it, expect } from "vitest";
import {
  relationshipIdeaFormSchema,
  relationshipWishlistFormSchema,
  relationshipCheckinFormSchema,
} from "@/lib/schemas/relationship";
import { getBudgetAwareSuggestion, pickRandomIdea } from "@/lib/logic/relationship";
import type { RelationshipIdeaRow } from "@/lib/supabase/types";

describe("Relationship Schemas & Logic", () => {
  describe("Zod Validation", () => {
    it("validates relationshipIdeaFormSchema", () => {
      const valid = {
        title: "عشاء هادئ ومحادثة ممتعة",
        category: "date",
        budget_tier: "medium",
        estimated_cost: 400,
        notes: "يوم الجمعة",
        is_completed: false,
      };
      expect(relationshipIdeaFormSchema.safeParse(valid).success).toBe(true);

      const invalid = {
        title: "",
        category: "date",
      };
      expect(relationshipIdeaFormSchema.safeParse(invalid).success).toBe(false);
    });

    it("validates relationshipWishlistFormSchema", () => {
      const valid = {
        title: "طقم كاسات عصير كريستال",
        category: "home",
        estimated_price: 650,
        url: "https://example.com/item",
        priority: "medium",
      };
      expect(relationshipWishlistFormSchema.safeParse(valid).success).toBe(true);
    });

    it("validates relationshipCheckinFormSchema", () => {
      const valid = {
        checkin_date: "2026-08-25",
        answers: {
          q_appreciation: "دعمها الدائم وتشجيعها",
          q_connection: "وقت هادئ ومميز",
          q_stressors: "ضغط مواعيد التسليم",
          q_marriage_talk: "جلسة هادئة الجمعة القادمة",
          q_next_shared_time: "تمشية بعد الغروب",
        },
      };
      expect(relationshipCheckinFormSchema.safeParse(valid).success).toBe(true);

      const invalid = {
        checkin_date: "invalid-date",
        answers: {},
      };
      expect(relationshipCheckinFormSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe("getBudgetAwareSuggestion", () => {
    const sampleIdeas: RelationshipIdeaRow[] = [
      {
        id: "1",
        user_id: "u1",
        title: "تمشية في الحديقة",
        category: "date",
        budget_tier: "free",
        estimated_cost: 0,
        notes: null,
        is_completed: false,
        last_done_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        user_id: "u1",
        title: "سهرة سينما ومطعم",
        category: "date",
        budget_tier: "medium",
        estimated_cost: 500,
        notes: null,
        is_completed: false,
        last_done_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        user_id: "u1",
        title: "سفر يوم كامل للشاطئ",
        category: "trip",
        budget_tier: "high",
        estimated_cost: 1500,
        notes: null,
        is_completed: false,
        last_done_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    it("suggests 'free' tier when net savings is negative", () => {
      const rec = getBudgetAwareSuggestion({
        netSavingsThisMonth: -2000,
        ideas: sampleIdeas,
      });

      expect(rec.recommendedTier).toBe("free");
      expect(rec.suggestedIdeas[0]?.budget_tier).toBe("free");
    });

    it("suggests 'medium' or 'high' tier when net savings is very healthy", () => {
      const rec = getBudgetAwareSuggestion({
        netSavingsThisMonth: 15000,
        ideas: sampleIdeas,
      });

      expect(rec.recommendedTier).toBe("high");
    });

    it("picks a random idea from active ideas", () => {
      const picked = pickRandomIdea(sampleIdeas);
      expect(picked).not.toBeNull();
      expect(sampleIdeas.some((i) => i.id === picked?.id)).toBe(true);
    });
  });
});
