import type { RelationshipIdeaRow, RelationshipBudgetTier } from "@/lib/supabase/types";

export interface BudgetAwareRecommendation {
  recommendedTier: RelationshipBudgetTier;
  reasonAr: string;
  reasonEn: string;
  suggestedIdeas: RelationshipIdeaRow[];
}

export const SEEDED_IDEAS_TEMPLATE = [
  {
    title: "سهرة منزلية لمشاهدة فيلم وصنع الفشار معاً",
    category: "home_activity" as const,
    budget_tier: "free" as const,
    estimated_cost: 0,
    notes: "تحضير مشروب دافئ وإغلاق هواتف العمل",
  },
  {
    title: "تمشية هادئة في حديقة عامة أو على الكورنيش والحديث",
    category: "date" as const,
    budget_tier: "free" as const,
    estimated_cost: 0,
    notes: "وقت نقي للنقاش بعيداً عن الشاشات",
  },
  {
    title: "عشاء هادئ في مطعم جديد وتجربة أطباق مميزة",
    category: "date" as const,
    budget_tier: "medium" as const,
    estimated_cost: 450,
    notes: "احتفال بإنجازات الشهر",
  },
  {
    title: "جلسة قهوة صباحية في مكان مفتوح والتخطيط للأسبوع",
    category: "conversation" as const,
    budget_tier: "low" as const,
    estimated_cost: 150,
    notes: "بداية أسبوع إيجابية ومريحة",
  },
  {
    title: "رحلة يوم واحد (Day-use) خارج المدينة للتجديد والاسترخاء",
    category: "trip" as const,
    budget_tier: "high" as const,
    estimated_cost: 1200,
    notes: "كسر الروتين واستعادة النشاط الكامل",
  },
  {
    title: "مفاجأة باقة ورد أو شوكولاتة مفضلة بدون مناسبة",
    category: "surprise" as const,
    budget_tier: "low" as const,
    estimated_cost: 200,
    notes: "لمسة تقدير معنوية لطيفة",
  },
];

export function getBudgetAwareSuggestion(params: {
  netSavingsThisMonth: number;
  ideas: RelationshipIdeaRow[];
}): BudgetAwareRecommendation {
  const { netSavingsThisMonth, ideas } = params;

  let recommendedTier: RelationshipBudgetTier = "free";
  let reasonAr = "";
  let reasonEn = "";

  if (netSavingsThisMonth < 0) {
    recommendedTier = "free";
    reasonAr = "الصافي المالي للشهر الحالي تحت الضغط — نقترح أنشطة مجانية وممتعة بدون أي تكلفة مالية.";
    reasonEn = "Current month savings under pressure — suggesting zero-cost, high-connection ideas.";
  } else if (netSavingsThisMonth < 3000) {
    recommendedTier = "low";
    reasonAr = "ميزانية الشهر معتدلة — نقترح أنشطة بسيطة ومبهجة بتكلفة منخفضة جداً.";
    reasonEn = "Moderate budget cushion — suggesting low-cost, refreshing activities.";
  } else if (netSavingsThisMonth < 10000) {
    recommendedTier = "medium";
    reasonAr = "الادخار الشهري يسير بشكل ممتاز — مناسب جداً لموعد عشاء خاص أو خروجة ممتعة.";
    reasonEn = "Healthy monthly savings — great time for a pleasant dinner date or activity.";
  } else {
    recommendedTier = "high";
    reasonAr = "فائض مالي قوي — يمكنك الاستمتاع بتجربة سفر يوم كامل أو تجربة مميزة معاً.";
    reasonEn = "Strong financial surplus — comfortable for a special day-trip or luxury date.";
  }

  const activeIdeas = ideas.filter((i) => !i.is_completed);
  const matchingTierIdeas = activeIdeas.filter((i) => i.budget_tier === recommendedTier);

  const suggestedIdeas = matchingTierIdeas.length > 0
    ? matchingTierIdeas.slice(0, 3)
    : activeIdeas.slice(0, 3);

  return {
    recommendedTier,
    reasonAr,
    reasonEn,
    suggestedIdeas,
  };
}

export function pickRandomIdea(ideas: RelationshipIdeaRow[]): RelationshipIdeaRow | null {
  const active = ideas.filter((i) => !i.is_completed);
  if (active.length === 0) return ideas[0] || null;
  const idx = Math.floor(Math.random() * active.length);
  return active[idx];
}
