import type { OpportunityRow } from "@/lib/supabase/types";

export interface ScoredOpportunity extends OpportunityRow {
  score: number; // EV * Probability / Hours
  expectedNetGain: number; // EV * Probability
}

export interface OpportunityPrioritizationResult {
  scoredOpportunities: ScoredOpportunity[];
  recommendedOpportunity: ScoredOpportunity | null;
  recommendationReasonAr: string | null;
  recommendationReasonEn: string | null;
}

export function calculateOpportunityScore(opp: OpportunityRow): number {
  const ev = Number(opp.expected_value || 0);
  const prob = Math.min(1, Math.max(0.01, Number(opp.probability || 0.5)));
  const hrs = Math.max(1, Number(opp.time_required_hours || 10));

  const score = (ev * prob) / hrs;
  return Math.round(score * 10) / 10;
}

export function prioritizeOpportunities(
  opportunities: OpportunityRow[],
): OpportunityPrioritizationResult {
  if (opportunities.length === 0) {
    return {
      scoredOpportunities: [],
      recommendedOpportunity: null,
      recommendationReasonAr: null,
      recommendationReasonEn: null,
    };
  }

  const scored: ScoredOpportunity[] = opportunities.map((opp) => {
    const score = calculateOpportunityScore(opp);
    const expectedNetGain = Math.round(
      Number(opp.expected_value || 0) * Number(opp.probability || 0.5),
    );
    return {
      ...opp,
      score,
      expectedNetGain,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Pick top open or pursuing opportunity
  const openOpportunities = scored.filter(
    (o) => o.status === "open" || o.status === "pursuing",
  );
  const recommended = openOpportunities[0] || scored[0] || null;

  let recommendationReasonAr: string | null = null;
  let recommendationReasonEn: string | null = null;

  if (recommended) {
    const riskTextAr =
      recommended.risk === "low"
        ? "مخاطرة منخفضة"
        : recommended.risk === "medium"
          ? "مخاطرة متوازنة"
          : "مخاطرة عالية";
    const riskTextEn = `${recommended.risk} risk`;

    recommendationReasonAr = `تم ترشيح "${recommended.title}" لأنها تحقق أعلى عائد مقابل الجهد والوقت (${recommended.score.toLocaleString()} ج.م/ساعة متوقعة) مع ${riskTextAr} واحتمالية إغلاق ${Math.round(recommended.probability * 100)}%.`;
    recommendationReasonEn = `"${recommended.title}" is recommended for offering the highest expected value per hour (${recommended.score.toLocaleString()} EGP/hr) with ${riskTextEn} and ${Math.round(recommended.probability * 100)}% probability.`;
  }

  return {
    scoredOpportunities: scored,
    recommendedOpportunity: recommended,
    recommendationReasonAr,
    recommendationReasonEn,
  };
}
