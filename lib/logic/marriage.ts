import type { MarriageExpenseRow, BucketRow } from "@/lib/supabase/types";

export interface ReadinessDimension {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  progressPercent: number;
  status: "ready" | "in_progress" | "pending";
  weight: number;
}

export interface MarriageReadinessAssessment {
  overallScore: number;
  dimensions: ReadinessDimension[];
  antiChaosTip: string;
}

export function evaluateMarriageReadiness(params: {
  targetAmount: number;
  savedAmount: number;
  expenses: MarriageExpenseRow[];
  emergencyBucket?: BucketRow | null;
  hasRecentCheckin?: boolean;
}): MarriageReadinessAssessment {
  const { targetAmount, savedAmount, expenses, emergencyBucket, hasRecentCheckin } = params;

  // 1. Financial Savings Dimension
  const financialPct = targetAmount > 0
    ? Math.min(100, Math.round((savedAmount / targetAmount) * 100))
    : 100;

  // 2. Housing & Rent Dimension
  const housingItems = expenses.filter(
    (e) => e.category === "rent_deposit" || e.category === "finishing"
  );
  const housingTotal = housingItems.reduce((acc, e) => acc + (Number(e.estimated_cost) || 0), 0);
  const housingPaid = housingItems.reduce((acc, e) => acc + (Number(e.paid_amount) || 0), 0);
  const housingPct = housingTotal > 0 ? Math.min(100, Math.round((housingPaid / housingTotal) * 100)) : 10;

  // 3. Furniture & Appliances Dimension
  const furnitureItems = expenses.filter(
    (e) => e.category === "furniture" || e.category === "appliances"
  );
  const furnitureTotal = furnitureItems.reduce((acc, e) => acc + (Number(e.estimated_cost) || 0), 0);
  const furniturePaid = furnitureItems.reduce((acc, e) => acc + (Number(e.paid_amount) || 0), 0);
  const furniturePct = furnitureTotal > 0 ? Math.min(100, Math.round((furniturePaid / furnitureTotal) * 100)) : 15;

  // 4. Wedding Event & Hall Dimension
  const weddingItems = expenses.filter(
    (e) => e.category === "hall" || e.category === "photography" || e.category === "clothing" || e.category === "jewelry"
  );
  const weddingTotal = weddingItems.reduce((acc, e) => acc + (Number(e.estimated_cost) || 0), 0);
  const weddingPaid = weddingItems.reduce((acc, e) => acc + (Number(e.paid_amount) || 0), 0);
  const weddingPct = weddingTotal > 0 ? Math.min(100, Math.round((weddingPaid / weddingTotal) * 100)) : 20;

  // 5. Income Stability
  const incomeStabilityPct = savedAmount >= 20000 ? 50 : 25;

  // 6. Emergency Reserve
  const emergencySaved = Number(emergencyBucket?.starting_balance) || 0;
  const emergencyPct = emergencySaved >= 15000 ? 100 : Math.min(100, Math.round((emergencySaved / 15000) * 100));

  // 7. Marital & Emotional Readiness (Anti-chaos & Checkins)
  const maritalPct = hasRecentCheckin ? 85 : 60;

  const dimensions: ReadinessDimension[] = [
    {
      id: "financial",
      name: "المالية والادخار للهدف",
      nameEn: "Financial Savings",
      description: "نسبة توفير مستهدف الزواج التراكمي في الصندوق المخصص",
      progressPercent: financialPct,
      status: financialPct >= 80 ? "ready" : financialPct >= 30 ? "in_progress" : "pending",
      weight: 25,
    },
    {
      id: "housing",
      name: "السكن ومقدم الإيجار والتشطيب",
      nameEn: "Housing & Finishing",
      description: "حجز الشقة السكنية وسداد التأمين ومستلزمات التشطيب",
      progressPercent: housingPct,
      status: housingPct >= 80 ? "ready" : housingPct >= 30 ? "in_progress" : "pending",
      weight: 20,
    },
    {
      id: "furniture",
      name: "الأجهزة الكهربائية والأثاث",
      nameEn: "Furniture & Appliances",
      description: "شراء وتجهيز الأجهزة الأساسية وقائمة العفش الأساسي",
      progressPercent: furniturePct,
      status: furniturePct >= 80 ? "ready" : furniturePct >= 30 ? "in_progress" : "pending",
      weight: 20,
    },
    {
      id: "wedding",
      name: "حفل الزفاف والشبكة والمستلزمات",
      nameEn: "Wedding Event & Jewelry",
      description: "حجز القاعة، الذهب، التصوير، والملابس",
      progressPercent: weddingPct,
      status: weddingPct >= 80 ? "ready" : weddingPct >= 30 ? "in_progress" : "pending",
      weight: 15,
    },
    {
      id: "income",
      name: "استقرار التدفق المالي الشهري",
      nameEn: "Income Stability",
      description: "انتظام إيرادات العمل الحر وبوتات ديسكورد لتغطية المعيشة بعد الزواج",
      progressPercent: incomeStabilityPct,
      status: incomeStabilityPct >= 70 ? "ready" : "in_progress",
      weight: 10,
    },
    {
      id: "emergency",
      name: "صندوق الطوارئ المستقل",
      nameEn: "Emergency Buffer",
      description: "وجود مدخرات طوارئ منفصلة تماماً عن مصاريف الفرح",
      progressPercent: emergencyPct,
      status: emergencyPct >= 70 ? "ready" : "in_progress",
      weight: 5,
    },
    {
      id: "marital",
      name: "الجاهزية النفسية والانسجام",
      nameEn: "Marital Readiness",
      description: "تطبيق قاعدة منع الفوضى والتواصل المنتظم وتحديد التوقعات المشتركة",
      progressPercent: maritalPct,
      status: maritalPct >= 70 ? "ready" : "in_progress",
      weight: 5,
    },
  ];

  const totalWeighted = dimensions.reduce((acc, d) => acc + (d.progressPercent * d.weight), 0);
  const overallScore = Math.round(totalWeighted / 100);

  const antiChaosTips = [
    "قاعدة منع الفوضى (§10): خصص وقتاً هادئاً أسبوعياً مع شريكة حياتك دون الحديث في أرقام أو ضغوطات التجهيز.",
    "الزواج شراكة عمر وليس مجرد قائمة مشتريات: حافظ على طاقتك الذهنية والنفسية بالتوازي مع الإنجاز المالي.",
    "قسّم المصروفات الكبيرة إلى دفعات مجدولة مع التجار وأصحاب القاعات لتفادي الضغط اللحظي.",
  ];
  const antiChaosTip = antiChaosTips[Math.floor(Math.random() * antiChaosTips.length)];

  return {
    overallScore,
    dimensions,
    antiChaosTip,
  };
}
