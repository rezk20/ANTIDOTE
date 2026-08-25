import type { ProjectRow, LeadRow, TimeEntryRow } from "@/lib/supabase/types";

export type PipelineStageState = "hunting" | "delivering" | "scaling";

export interface WorkStreamSplit {
  streamKey: string;
  nameAr: string;
  nameEn: string;
  targetPercentage: number;
  actualLoggedHours: number;
  actualPercentage: number;
  color: string;
}

export interface AdaptiveAllocationResult {
  state: PipelineStageState;
  stateLabelAr: string;
  stateLabelEn: string;
  recommendationAr: string;
  recommendationEn: string;
  splits: WorkStreamSplit[];
  totalActualHours: number;
}

export function calculateAdaptiveWorkAllocation(params: {
  projects: ProjectRow[];
  leads: LeadRow[];
  timeEntries: TimeEntryRow[];
}): AdaptiveAllocationResult {
  const { projects, leads, timeEntries } = params;

  const activeClientProjects = projects.filter(
    (p) => p.kind === "client" && p.status === "active",
  );
  const activePipelineLeads = leads.filter(
    (l) => l.stage !== "won" && l.stage !== "lost" && l.stage !== "delivered",
  );

  // 1. Determine current pipeline state (§52)
  let state: PipelineStageState = "hunting";
  let stateLabelAr = "مرحلة البحث عن عملاء (Outreach Mode)";
  let stateLabelEn = "Client Acquisition Mode";
  let recommendationAr =
    activePipelineLeads.length > 0
      ? `لديك ${activePipelineLeads.length} عميل محتمل في المسار. التركيز الأكبر هذا الأسبوع موجه لمتابعة الفرص وإرسال المقترحات لسد فجوة الإيرادات.`
      : "التركيز الأكبر هذا الأسبوع موجه للبحث عن فرص جديدة، التواصل مع عملاء محتملين، وإرسال المقترحات لسد فجوة الإيرادات.";
  let recommendationEn =
    "Primary focus this week is on outreach, proposals, and pipeline building to establish cashflow.";

  if (activeClientProjects.length >= 2) {
    state = "scaling";
    stateLabelAr = "مرحلة الاستقرار والتوسع (Scaling & Productization)";
    stateLabelEn = "Scaling & Retainers Mode";
    recommendationAr =
      "لديك مشاريع نشطة متعددة. وزع وقتك بين التسليم المتقن، أتمتة الأنظمة، وتطوير المنتجات الجانبية.";
    recommendationEn =
      "Multiple active projects. Balance flawless delivery with systemization and product development.";
  } else if (activeClientProjects.length === 1) {
    state = "delivering";
    stateLabelAr = "مرحلة تسليم العميل ومتابعة الـ Pipeline";
    stateLabelEn = "Active Delivery & Sales Mode";
    recommendationAr =
      "تسليم مشروع العميل هو الأولوية القصوى مع تخصيص 20% من الوقت يومياً لمتابعة وتغذية الـ Pipeline.";
    recommendationEn =
      "Client delivery is top priority while maintaining a continuous 20% time allocation for sales outreach.";
  }

  // 2. Determine target percentages based on state
  const targetMap: Record<PipelineStageState, Record<string, number>> = {
    hunting: {
      sales: 45,
      delivery: 20,
      learning: 15,
      product: 10,
      admin: 10,
    },
    delivering: {
      delivery: 55,
      sales: 20,
      learning: 10,
      admin: 10,
      product: 5,
    },
    scaling: {
      delivery: 45,
      product: 20,
      sales: 15,
      learning: 10,
      admin: 10,
    },
  };

  const targets = targetMap[state];

  // 3. Compute actual logged hours from time entries
  const actualMap: Record<string, number> = {
    delivery: 0,
    sales: 0,
    learning: 0,
    product: 0,
    admin: 0,
  };

  let totalActualMinutes = 0;
  for (const entry of timeEntries) {
    const mins = Number(entry.duration_min || 0);
    totalActualMinutes += mins;
    if (entry.kind === "delivery" || entry.kind === "deep_work") {
      actualMap.delivery += mins;
    } else if (entry.kind === "sales") {
      actualMap.sales += mins;
    } else if (entry.kind === "learning") {
      actualMap.learning += mins;
    } else if (entry.kind === "product") {
      actualMap.product += mins;
    } else {
      actualMap.admin += mins;
    }
  }

  const totalActualHours = Math.round((totalActualMinutes / 60) * 10) / 10;

  const splits: WorkStreamSplit[] = [
    {
      streamKey: "delivery",
      nameAr: "تسليم العملاء والعمل العميق",
      nameEn: "Client Delivery & Deep Work",
      targetPercentage: targets.delivery,
      actualLoggedHours: Math.round((actualMap.delivery / 60) * 10) / 10,
      actualPercentage:
        totalActualMinutes > 0
          ? Math.round((actualMap.delivery / totalActualMinutes) * 100)
          : targets.delivery,
      color: "bg-emerald-500",
    },
    {
      streamKey: "sales",
      nameAr: "المبيعات والتواصل (Sales Outreach)",
      nameEn: "Sales & Outreach",
      targetPercentage: targets.sales,
      actualLoggedHours: Math.round((actualMap.sales / 60) * 10) / 10,
      actualPercentage:
        totalActualMinutes > 0
          ? Math.round((actualMap.sales / totalActualMinutes) * 100)
          : targets.sales,
      color: "bg-blue-500",
    },
    {
      streamKey: "product",
      nameAr: "المنتجات التجريبية والمشاريع",
      nameEn: "Experimental Products",
      targetPercentage: targets.product,
      actualLoggedHours: Math.round((actualMap.product / 60) * 10) / 10,
      actualPercentage:
        totalActualMinutes > 0
          ? Math.round((actualMap.product / totalActualMinutes) * 100)
          : targets.product,
      color: "bg-purple-500",
    },
    {
      streamKey: "learning",
      nameAr: "التعلم والتطوير المهني",
      nameEn: "Learning & Growth",
      targetPercentage: targets.learning,
      actualLoggedHours: Math.round((actualMap.learning / 60) * 10) / 10,
      actualPercentage:
        totalActualMinutes > 0
          ? Math.round((actualMap.learning / totalActualMinutes) * 100)
          : targets.learning,
      color: "bg-amber-500",
    },
    {
      streamKey: "admin",
      nameAr: "الإدارة والأنظمة",
      nameEn: "Admin & Operations",
      targetPercentage: targets.admin,
      actualLoggedHours: Math.round((actualMap.admin / 60) * 10) / 10,
      actualPercentage:
        totalActualMinutes > 0
          ? Math.round((actualMap.admin / totalActualMinutes) * 100)
          : targets.admin,
      color: "bg-zinc-500",
    },
  ];

  return {
    state,
    stateLabelAr,
    stateLabelEn,
    recommendationAr,
    recommendationEn,
    splits,
    totalActualHours,
  };
}
