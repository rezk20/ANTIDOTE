import { z } from "zod";

export const RELATIONSHIP_IDEA_CATEGORIES = [
  "date",
  "home_activity",
  "conversation",
  "trip",
  "surprise",
] as const;
export type RelationshipIdeaCategory = (typeof RELATIONSHIP_IDEA_CATEGORIES)[number];

export const RELATIONSHIP_BUDGET_TIERS = ["free", "low", "medium", "high"] as const;
export type RelationshipBudgetTier = (typeof RELATIONSHIP_BUDGET_TIERS)[number];

export const RELATIONSHIP_WISHLIST_CATEGORIES = [
  "gift",
  "home",
  "experience",
  "other",
] as const;
export type RelationshipWishlistCategory = (typeof RELATIONSHIP_WISHLIST_CATEGORIES)[number];

export const relationshipIdeaFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "عنوان الفكرة أو النشاط مطلوب"),
  category: z.enum(RELATIONSHIP_IDEA_CATEGORIES).default("date"),
  budget_tier: z.enum(RELATIONSHIP_BUDGET_TIERS).default("low"),
  estimated_cost: z.coerce.number().min(0).default(0),
  notes: z.string().nullable().optional(),
  is_completed: z.boolean().default(false),
});
export type RelationshipIdeaFormData = z.infer<typeof relationshipIdeaFormSchema>;

export const relationshipWishlistFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "اسم الهدية أو الرغبة مطلوب"),
  category: z.enum(RELATIONSHIP_WISHLIST_CATEGORIES).default("gift"),
  estimated_price: z.coerce.number().min(0).nullable().optional(),
  url: z.string().url("رابط غير صالح").nullable().optional().or(z.literal("")),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  notes: z.string().nullable().optional(),
});
export type RelationshipWishlistFormData = z.infer<typeof relationshipWishlistFormSchema>;

export const relationshipCheckinAnswersSchema = z.object({
  q_appreciation: z.string().default(""),
  q_connection: z.string().default(""),
  q_stressors: z.string().default(""),
  q_marriage_talk: z.string().default(""),
  q_next_shared_time: z.string().default(""),
});
export type RelationshipCheckinAnswers = z.infer<typeof relationshipCheckinAnswersSchema>;

export const relationshipCheckinFormSchema = z.object({
  id: z.string().uuid().optional(),
  checkin_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ التقييم غير صالح (YYYY-MM-DD)"),
  answers: relationshipCheckinAnswersSchema,
  notes: z.string().nullable().optional(),
});
export type RelationshipCheckinFormData = z.infer<typeof relationshipCheckinFormSchema>;
