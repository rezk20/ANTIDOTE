import type { LeadRow, LeadEventRow } from "@/lib/supabase/types";

export type PipelineStageKey =
  | "discovery"
  | "outreach"
  | "proposal"
  | "won"
  | "completed"
  | "lost";

export const PIPELINE_COLUMNS: {
  key: PipelineStageKey;
  labelEn: string;
  labelAr: string;
  stages: string[];
  color: string;
}[] = [
  {
    key: "discovery",
    labelEn: "Discovery & Qualification",
    labelAr: "الاستكشاف والتأهيل",
    stages: ["new", "qualified"],
    color: "blue",
  },
  {
    key: "outreach",
    labelEn: "Outreach & In-Touch",
    labelAr: "التواصل والمتابعة",
    stages: ["contacted", "follow_up", "call"],
    color: "amber",
  },
  {
    key: "proposal",
    labelEn: "Proposals & Pitching",
    labelAr: "العروض والمفاوضات",
    stages: ["proposal_sent", "negotiation"],
    color: "purple",
  },
  {
    key: "won",
    labelEn: "Won & Active Delivery",
    labelAr: "صفقات رابحة وقيد التسليم",
    stages: ["won", "in_progress", "delivered"],
    color: "emerald",
  },
  {
    key: "completed",
    labelEn: "Paid & Retention",
    labelAr: "مدفوعة ومكتملة",
    stages: ["paid", "review_requested", "referral_requested"],
    color: "teal",
  },
  {
    key: "lost",
    labelEn: "Closed Lost",
    labelAr: "صفقات ملغاة",
    stages: ["lost"],
    color: "rose",
  },
];

export interface PipelineSummary {
  totalLeads: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  columns: Record<
    PipelineStageKey,
    {
      leads: LeadRow[];
      totalValue: number;
      weightedValue: number;
    }
  >;
}

export function groupLeadsByPipeline(leads: LeadRow[]): PipelineSummary {
  const columns: PipelineSummary["columns"] = {
    discovery: { leads: [], totalValue: 0, weightedValue: 0 },
    outreach: { leads: [], totalValue: 0, weightedValue: 0 },
    proposal: { leads: [], totalValue: 0, weightedValue: 0 },
    won: { leads: [], totalValue: 0, weightedValue: 0 },
    completed: { leads: [], totalValue: 0, weightedValue: 0 },
    lost: { leads: [], totalValue: 0, weightedValue: 0 },
  };

  let totalPipelineValue = 0;
  let weightedPipelineValue = 0;

  for (const lead of leads) {
    const val = Number(lead.proposal_amount ?? lead.expected_value ?? 0);
    const prob = Number(lead.probability ?? (lead.stage === "won" ? 1 : 0.5));
    const weighted = val * prob;

    let targetCol: PipelineStageKey = "discovery";
    for (const col of PIPELINE_COLUMNS) {
      if (col.stages.includes(lead.stage)) {
        targetCol = col.key;
        break;
      }
    }

    columns[targetCol].leads.push(lead);
    columns[targetCol].totalValue += val;
    columns[targetCol].weightedValue += weighted;

    if (lead.stage !== "lost" && lead.stage !== "paid") {
      totalPipelineValue += val;
      weightedPipelineValue += weighted;
    }
  }

  return {
    totalLeads: leads.length,
    totalPipelineValue,
    weightedPipelineValue,
    columns,
  };
}

export interface SalesActivityMetrics {
  proposalsThisWeek: number;
  proposalsTarget: number;
  proposalsPercent: number;
  outreachToday: number;
  outreachTarget: number;
  outreachPercent: number;
  totalTouchesThisWeek: number;
}

export function calculateSalesMetrics({
  events,
  proposalsTarget = 5,
  outreachTarget = 3,
  referenceDate = new Date(),
}: {
  events: LeadEventRow[];
  proposalsTarget?: number;
  outreachTarget?: number;
  referenceDate?: Date;
}): SalesActivityMetrics {
  const ref = new Date(referenceDate);
  const dayOfWeek = ref.getDay();
  const startOfWeek = new Date(ref);
  startOfWeek.setDate(ref.getDate() - ((dayOfWeek + 1) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfToday = new Date(ref);
  startOfToday.setHours(0, 0, 0, 0);

  let proposalsThisWeek = 0;
  let outreachToday = 0;
  let totalTouchesThisWeek = 0;

  for (const ev of events) {
    const evDate = new Date(ev.occurred_at);

    if (evDate >= startOfWeek) {
      totalTouchesThisWeek += 1;
      if (ev.event_type === "proposal_sent") {
        proposalsThisWeek += 1;
      }
    }

    if (
      evDate >= startOfToday &&
      (ev.event_type === "outreach" ||
        ev.event_type === "call" ||
        ev.event_type === "follow_up")
    ) {
      outreachToday += 1;
    }
  }

  const safeProposalsTarget = proposalsTarget > 0 ? proposalsTarget : 1;
  const safeOutreachTarget = outreachTarget > 0 ? outreachTarget : 1;

  return {
    proposalsThisWeek,
    proposalsTarget,
    proposalsPercent: Math.min(Math.round((proposalsThisWeek / safeProposalsTarget) * 100), 100),
    outreachToday,
    outreachTarget,
    outreachPercent: Math.min(Math.round((outreachToday / safeOutreachTarget) * 100), 100),
    totalTouchesThisWeek,
  };
}
