"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sun,
  Heart,
  Briefcase,
  Scale,
  TrendingUp,
  Bot,
  Keyboard,
  ShieldCheck,
  Zap,
  Layers,
  Settings,
  ExternalLink,
  Search,
  LayoutDashboard,
  CheckSquare,
  Target,
  Calendar,
  Users,
  FolderKanban,
  Wallet,
  Inbox,
  FileText,
  Clock,
  Users2,
  Flame,
  RotateCcw,
  BarChart3,
  GitFork,
} from "lucide-react";

interface GuidePageItem {
  id: string;
  href: string;
  icon: typeof LayoutDashboard;
  titleAr: string;
  titleEn: string;
  pillar: "command" | "revenue" | "knowledge" | "mission" | "system";
  purposeAr: string;
  purposeEn: string;
  stepsAr: string[];
  stepsEn: string[];
  goldenRuleAr: string;
  goldenRuleEn: string;
  shortcut?: string;
}

export function GuideView() {
  const { t, isRtl } = useLocale();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [expandedPageId, setExpandedPageId] = useState<string | null>("today");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  // 1. Checklist
  const onboardingSteps = [
    {
      id: "ob_step1",
      title: isRtl ? "1. ضبط البروفايل ومستهدف الدخل" : "1. Calibrate Profile & Income Target",
      desc: isRtl
        ? "ادخل على الإعدادات (/settings) وحدد مستهدف دخلك الشهري ومنطقتك الزمنية ويوم إجازتك الأسبوعي."
        : "Go to Settings (/settings) to define your monthly comfort income target, timezone, and off-day.",
      href: "/settings",
      actionText: isRtl ? "فتح الإعدادات" : "Open Settings",
      icon: Settings,
    },
    {
      id: "ob_step2",
      title: isRtl ? "2. تخطيط خطة اليوم والعمل العميق" : "2. Calibrate Today's Rhythm & Deep Work",
      desc: isRtl
        ? "افتح خطة اليوم (/today)، وحدد طاقتك وساعاتك المتاحة، ثم اختر من 1 إلى 3 مهام P1 للتركيز عليها."
        : "Open Today's Plan (/today), set energy and available hours, and pick 1-3 core P1 focus tasks.",
      href: "/today",
      actionText: isRtl ? "فتح خطة اليوم" : "Open Today Plan",
      icon: Sun,
    },
    {
      id: "ob_step3",
      title: isRtl ? "3. تخصيص ميزانية ومستهدف الزواج" : "3. Customize Marriage Budget & Date",
      desc: isRtl
        ? "ادخل على خطة الزواج (/marriage) واضغط 'تعديل المستهدف والتاريخ' لتحديد ميزانيتك وتاريخ موعد الزفاف."
        : "Open Marriage Mission (/marriage) and click 'Edit Target & Date' to set your target amount & wedding date.",
      href: "/marriage",
      actionText: isRtl ? "تخصيص ميزانية الزواج" : "Customize Marriage Target",
      icon: Heart,
    },
    {
      id: "ob_step4",
      title: isRtl ? "4. ملء مسار صفقات الفريلانس" : "4. Populate Freelance CRM Deals",
      desc: isRtl
        ? "سجل عملاءك المحتملين في مسار الفريلانس (/freelance) وتتبع معدل العائد الحقيقي لكل ساعة عمل."
        : "Add active leads to your Freelance Pipeline (/freelance) and track your realized hourly rates.",
      href: "/freelance",
      actionText: isRtl ? "فتح مسار الفريلانس" : "Open Freelance CRM",
      icon: Briefcase,
    },
    {
      id: "ob_step5",
      title: isRtl ? "5. احتراف التفريغ السريع بمفتاح (B)" : "5. Master Single-Key Quick Capture (B)",
      desc: isRtl
        ? "اضغط حرف (B) في أي وقت لتفريغ أي فكرة طارئة في صندوق الأفكار فوراً والعودة لتركيزك بدون تشتيت."
        : "Press 'B' anytime outside input fields to capture sudden thoughts into Brain Dump Inbox in 2 seconds.",
      href: "/brain-dump",
      actionText: isRtl ? "تجربة التفريغ السريع" : "Try Brain Dump (B)",
      icon: Sparkles,
    },
    {
      id: "ob_step6",
      title: isRtl ? "6. ربط وكيل الذكاء الاصطناعي (Hermes)" : "6. Connect Autonomous AI Copilot",
      desc: isRtl
        ? "افتح صفحة الوكيل الذكي (/agent)، انسخ مفتاح الـ API والبرومبت لتمكين Hermes من تسجيل ومتابعة أعمالك تلقائياً."
        : "Visit AI Agent (/agent), copy your Bearer API key and system prompt to let Hermes automate daily operations.",
      href: "/agent",
      actionText: isRtl ? "ربط وكيل Hermes" : "Connect Hermes AI",
      icon: Bot,
    },
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / onboardingSteps.length) * 100);

  // 2. All System Pages Catalog
  const allPages = useMemo<GuidePageItem[]>(() => [
    {
      id: "home",
      href: "/home",
      icon: LayoutDashboard,
      titleAr: "غرفة القيادة والتحكم (Dashboard)",
      titleEn: "Executive Command Center",
      pillar: "command",
      purposeAr: "اللوحة الرئيسية الشاملة التي تجمع ملخص النبض الحي للنظام: خطة اليوم، الفريلانس، وصندوق الزواج.",
      purposeEn: "The unified high-level cockpit summarizing daily focus, freelance cashflow, and marriage progress.",
      stepsAr: [
        "افتحها أول شيء في الصباح لرؤية ملخص اليوم وحالة المهام الحرجة.",
        "تابع إجمالي ساعات التركيز ومؤشر التقدم نحو مستهدف الدخل الشهري.",
        "استخدم البطاقات السريعة للانتقال المباشر لأي قسم يحتاج تدخلك.",
      ],
      stepsEn: [
        "Open first in the morning to review today's pulse and critical priorities.",
        "Track total deep work hours and progress towards monthly income target.",
        "Use quick stat cards to jump directly to any module requiring attention.",
      ],
      goldenRuleAr: "لوحة التحكم ليست للعمل التفصيلي، بل للرؤية البانورامية واتخاذ القرار السريع.",
      goldenRuleEn: "The Dashboard is for panoramic clarity and quick decision making, not granular tinkering.",
    },
    {
      id: "today",
      href: "/today",
      icon: Sun,
      titleAr: "خطة اليوم والعمل العميق (Today)",
      titleEn: "Today's Rhythm & Deep Work",
      pillar: "command",
      shortcut: "T",
      purposeAr: "المحرك اليومي القائم على مطابقة مستوى طاقتك بساعات العمل المتاحة، وحماية كتل التركيز، والتخطيط المسبق للغد.",
      purposeEn: "The daily execution driver matching energy to available hours, guarding deep work blocks, and future day planning.",
      stepsAr: [
        "تخطيط الصباح: حدد مستوى طاقتك (1-5) وساعاتك المتاحة لليوم.",
        "اختيار مهام الـ P1: اختر من مهمة إلى 3 مهام كحد أقصى تضمن إنجازها اليوم.",
        "التخطيط المسبق للغد: اضغط زر 'غداً' أو اختر تاريخاً مسبقاً لتستيقظ وخطة يومك جاهزة تماماً.",
        "طقس الإغلاق المسائي (Shutdown): اضغط 'إغلاق اليوم' في نهاية اليوم لتقييم إنجازك وإيقاف العمل بسلام.",
      ],
      stepsEn: [
        "Morning Setup: Set energy rating (1-5) and available hours.",
        "Select P1 Focus: Pick 1 to 3 non-negotiable critical tasks.",
        "Future Day Planning: Click 'Tomorrow' or pick a date to plan ahead so you wake up ready.",
        "Evening Shutdown: Run the shutdown ritual to review output and log off guilt-free.",
      ],
      goldenRuleAr: "§Rule 1: لا تبدأ يومك أبداً بدون تحديد أهم 1-3 مهام، وأغلق عملك دائماً بطقس الإغلاق المسائي لمنع الاحتراق.",
      goldenRuleEn: "§Rule 1: Never start your day without top 1-3 priorities, and always execute the evening shutdown ritual.",
    },
    {
      id: "tasks",
      href: "/tasks",
      icon: CheckSquare,
      titleAr: "المهام ومصفوفة الأولويات (Tasks)",
      titleEn: "Tasks & Priorities Matrix",
      pillar: "command",
      purposeAr: "إدارة الباكلوج الكامل وتصنيف المهام حسب مصفوفة الأولويات P1 (حرج) إلى P4 (هامشي) وربطها بالمشاريع والأهداف.",
      purposeEn: "Complete backlog triage and priority ranking (P1 Critical to P4 Low), linked to projects & goals.",
      stepsAr: [
        "أضف المهام وحدد لها درجة الأولوية (P1، P2، P3، P4) والوقت المقدر بالساعات.",
        "اسحب المهام المهمة إلى قائمة 'اليوم' عند التخطيط الصباحي.",
        "استخدم الفلاتر حسب المشروع أو الهدف الاستراتيجي لتنظيف الباكلوج دورياً.",
      ],
      stepsEn: [
        "Create tasks with explicit priority tier (P1-P4) and estimated hours.",
        "Drag high-priority tasks into 'Today's Plan' during morning calibration.",
        "Filter by project or goal hierarchy to groom your backlog periodically.",
      ],
      goldenRuleAr: "أي مهمة بدون تقدير وقت وبدون أولوية واضحة هي مجرد أمنية ستسبب التشتت.",
      goldenRuleEn: "Any task without an estimated duration and priority is merely a wish that causes friction.",
    },
    {
      id: "goals",
      href: "/goals",
      icon: Target,
      titleAr: "شجرة الأهداف الاستراتيجية (Goals)",
      titleEn: "Goals Hierarchy Tree",
      pillar: "command",
      shortcut: "G",
      purposeAr: "الربط الهرمي المحكم بين الرؤية الكبرى (Vision) $\\rightarrow$ أهداف السنة $\\rightarrow$ الربع $\\rightarrow$ الشهر $\\rightarrow$ الأسبوع.",
      purposeEn: "Strict hierarchical alignment connecting long-term Vision $\\rightarrow$ Year $\\rightarrow$ Quarter $\\rightarrow$ Month $\\rightarrow$ Week.",
      stepsAr: [
        "سجل رؤيتك الكبرى (Vision) أولاً (مثل: الوصول للاستقلال المالي والزواج المبارك).",
        "فرع منها أهداف السنة، ثم أهداف الربع الحالي (Q1/Q2/Q3/Q4).",
        "اربط كل مهمة يومية بهدف ربع سنوي أو شهري لضمان أن كل ساعة عمل تصب في هدفك الكبير.",
      ],
      stepsEn: [
        "Define your overarching Vision first.",
        "Cascade it into Annual milestones and Quarterly OKRs.",
        "Link daily tasks to specific goals to ensure daily effort compounds toward life outcomes.",
      ],
      goldenRuleAr: "إذا كانت هناك مهمة لا تخدم أي هدف في شجرتك الاستراتيجية، فاحذفها أو فوضها فوراً.",
      goldenRuleEn: "If a task doesn't serve any branch in your goal tree, eliminate or delegate it immediately.",
    },
    {
      id: "calendar",
      href: "/calendar",
      icon: Calendar,
      titleAr: "التقويم وإسقاط التدفقات (Calendar)",
      titleEn: "Rhythm & Cashflow Calendar",
      pillar: "command",
      purposeAr: "عرض موحد للمواعيد النهائية، والكتل اليومية، وخطط الأيام المسبقة، وإسقاط السيولة النقدية المتوقعة.",
      purposeEn: "Unified timeline displaying deadlines, time blocks, advance day plans, and projected cashflow.",
      stepsAr: [
        "استعرض التقويم بالوضع الشهري لرؤية الأيام التي تم تخطيطها مسبقاً (علامة 🎯).",
        "اضغط على أي يوم لفتح تفاصيل جدوله الزمني أو الانتقال المباشر لتخطيطه في `/today`.",
        "تابع شريط التدفق النقدي بالأعلى (Cash Flow Strip) لمعرفة السيولة المتوقعة نهاية الشهر.",
      ],
      stepsEn: [
        "Inspect the Month view to see all planned future days (marked with 🎯).",
        "Click on any day cell to view its schedule blocks or jump directly to plan it in `/today`.",
        "Monitor the top Cash Flow projection strip to forecast month-end net liquidity.",
      ],
      goldenRuleAr: "كشف التعارضات التلقائي ينبهك فوراً إذا كان لديك موعد تسليم يوم الجمعة المحمي.",
      goldenRuleEn: "Automatic collision engine alerts you if a project deadline lands on your protected off-day.",
    },
    {
      id: "decisions",
      href: "/decisions",
      icon: Scale,
      titleAr: "غرفة ميزان القرارات (Decision Desk)",
      titleEn: "Decision Desk (§34)",
      pillar: "command",
      shortcut: "D",
      purposeAr: "إلغاء التردد العقلي عبر التمييز بين قرارات Type 1 (غير قابلة للتراجع) و Type 2 (سريعة وقابلة للتراجع).",
      purposeEn: "Eliminates cognitive fatigue by distinguishing Type 1 (irreversible) vs Type 2 (reversible 2-way door) choices.",
      stepsAr: [
        "عندما تواجه قراراً محيراً، افتح غرفة القرارات وسجل نص القرار.",
        "حدد هل هو Type 1 أم Type 2: إذا كان Type 2 فاتخذه فوراً في دقائق.",
        "إذا كان Type 1: سجل أسوأ سيناريو محتمل، وحدد خطة التراجع وتاريخ المراجعة الإجباري.",
      ],
      stepsEn: [
        "When facing a critical fork in the road, open Decision Desk and log the decision.",
        "Identify Type 1 vs Type 2: if it's a 2-way door (Type 2), decide rapidly.",
        "If Type 1: Document the worst-case scenario, downside cap, and mandatory review date.",
      ],
      goldenRuleAr: "§34 Reversibility: 90% من القرارات قابلة للتراجع، فلا تهدر عليها طاقتك التحليلية الثمينة.",
      goldenRuleEn: "§34 Reversibility: 90% of choices are 2-way doors. Save deep analysis exclusively for 1-way doors.",
    },
    {
      id: "opportunities",
      href: "/opportunities",
      icon: TrendingUp,
      titleAr: "محرك ترتيب الفرص (Opportunities)",
      titleEn: "Opportunity Prioritization (§50)",
      pillar: "revenue",
      shortcut: "O",
      purposeAr: "تقييم العروض والفرص بالمعادلة الرياضية: (القيمة المتوقعة × الاحتمالية) ÷ الساعات.",
      purposeEn: "Ranks prospective deals using the mathematical formula: (Expected Value × Probability) / Effort Hours.",
      stepsAr: [
        "عندما يأتيك عرض عمل جديد، أدخل العائد المالي المتوقع، ونسبة احتمالية نجاحه، وتقدير الساعات.",
        "يقوم النظام بحساب نقطة الجدوى (Score) وترتيب الفرص تلقائياً من الأعلى عائداً للأقل.",
        "ركز جهدك فقط على الفرص المصنفة باللون الأخضر (High Yield).",
      ],
      stepsEn: [
        "When a new project or gig arrives, input expected revenue, win probability, and estimated hours.",
        "The system auto-calculates the EV/Hour score and ranks opportunities objectively.",
        "Direct your precious focus exclusively to Top-tier green opportunities.",
      ],
      goldenRuleAr: "§50: الرياضيات تقود الاختيار، لا تقبل عملاً أبداً بالحدس أو الإحراج الاجتماعي.",
      goldenRuleEn: "§50: Math drives selection. Never accept projects based on intuition or social obligation.",
    },
    {
      id: "freelance",
      href: "/freelance",
      icon: Briefcase,
      titleAr: "مسار الفريلانس والمبيعات (Freelance)",
      titleEn: "Freelance CRM & Pipeline",
      pillar: "revenue",
      purposeAr: "إدارة الصفقات والعملاء المحتملين عبر قمع المبيعات ومتابعة معدلات التحويل.",
      purposeEn: "Complete deal pipeline managing prospective leads through Discovery $\\rightarrow$ Won stages.",
      stepsAr: [
        "أضف أي ليد جديد وحدد قيمة الصفقة والمصدر وتاريخ المتابعة القادم.",
        "انقل العميل بين المراحل (Lead $\\rightarrow$ Qualified $\\rightarrow$ Proposal $\\rightarrow$ Won).",
        "تابع مقاييس التحويل في الأعلى (معدل الرد، ومعدل حجز المكالمات، ومعدل الفوز).",
      ],
      stepsEn: [
        "Add new leads with estimated deal value, source channel, and next follow-up date.",
        "Move deals across pipeline stages (Lead $\\rightarrow$ Qualified $\\rightarrow$ Proposal $\\rightarrow$ Won).",
        "Track conversion metrics (reply rate, discovery call rate, win rate).",
      ],
      goldenRuleAr: "المتابعة المستمرة هي التي تغلق 80% من الصفقات، حدد دائماً تاريخ المتابعة القادم.",
      goldenRuleEn: "Follow-up closes 80% of deals. Always keep an active next follow-up date on open leads.",
    },
    {
      id: "clients",
      href: "/clients",
      icon: Users,
      titleAr: "سجل العملاء (Clients)",
      titleEn: "Clients Directory",
      pillar: "revenue",
      purposeAr: "قاعدة بيانات العملاء، بيانات الاتصال، وسعر الساعة المتفق عليه وتاريخ التعاملات.",
      purposeEn: "Central directory for client relationships, contact info, agreed rates, and history.",
      stepsAr: [
        "سجل بيانات العميل، البريد الإلكتروني، والشركة وسعر الساعة المتفق عليه.",
        "اربط المشاريع الجديدة بالعميل تلقائياً لحساب ربحية كل عميل.",
      ],
      stepsEn: [
        "Store client contact details, company name, and base agreed billing rate.",
        "Link active projects to clients to track client-level lifetime profitability.",
      ],
      goldenRuleAr: "حافظ على سجل نظيف لعملائك الدائمين لتوليد فرص عمل متكررة (Retainers).",
      goldenRuleEn: "Maintain accurate records for key clients to nurture recurring retainer revenue.",
    },
    {
      id: "projects",
      href: "/projects",
      icon: FolderKanban,
      titleAr: "مركز المشاريع والربحية (Projects)",
      titleEn: "Projects Hub & Realized Rates",
      pillar: "revenue",
      purposeAr: "متابعة المشاريع النشطة، وسعر الساعة الفعلي المحقق (Realized Hourly Rate).",
      purposeEn: "Track active client deliverables and evaluate true realized hourly earnings.",
      stepsAr: [
        "أنشئ المشروع وحدد ميزانيته الإجمالية والموعد النهائي للتسليم.",
        "سجل ساعات العمل الفعلية في مؤقت التركيز أو Time Tracking.",
        "تابع مؤشر Realized Rate للتأكد أن المشروع لم يتجاوز الساعات المقدرة.",
      ],
      stepsEn: [
        "Create project with fixed fee budget and delivery deadline.",
        "Log deep work hours via timer or time entries.",
        "Check your Realized Hourly Rate to ensure scope creep doesn't dilute your earnings.",
      ],
      goldenRuleAr: "إذا انخفض سعر ساعتك الفعلي في مشروع معين عن الحد الأدنى، أعد التفاوض على نطاق العمل فوراً.",
      goldenRuleEn: "If your realized hourly rate drops below your comfort threshold, renegotiate scope immediately.",
    },
    {
      id: "finances",
      href: "/finances",
      icon: Wallet,
      titleAr: "المالية والمحافظ المنفصلة (Finances)",
      titleEn: "Finances & Isolated Wallets",
      pillar: "revenue",
      purposeAr: "عزل التدفقات النقدية إلى 4 محافظ مستقلة: الزواج، الطوارئ، الشخصية، والبيزنس.",
      purposeEn: "Strict multi-bucket cashflow isolation: Marriage, Emergency, Personal, and Business.",
      stepsAr: [
        "سجل كل إيراد أو مصروف وحدد المحفظة المناسبة له.",
        "راقب رصيد صندوق الطوارئ للتأكد من تغطية مصاريف 3 إلى 6 أشهر.",
        "حول الفائض الشهري مباشرة إلى صندوق الزواج بدون تركه في المصاريف الشخصية.",
      ],
      stepsEn: [
        "Log every transaction and allocate it to its corresponding bucket.",
        "Ensure the emergency bucket maintains 3-6 months of baseline living expenses.",
        "Transfer monthly surplus directly into the marriage bucket.",
      ],
      goldenRuleAr: "لا تخلط أبداً بين أموال البيزنس ومصاريفك الشخصية أو مدخرات الزواج.",
      goldenRuleEn: "Never mix business operating capital with personal living expenses or marriage savings.",
    },
    {
      id: "marriage",
      href: "/marriage",
      icon: Heart,
      titleAr: "مهمة الزواج (Marriage Mission)",
      titleEn: "Marriage Mission Ledger",
      pillar: "mission",
      purposeAr: "تخصيص الميزانية الديناميكية وتاريخ الزواج، وتتبع المدفوعات وتوقعات الفائض المطلوب شهرياً.",
      purposeEn: "Dynamic budget customization & wedding date ledger with Reality Check surplus pacing.",
      stepsAr: [
        "اضغط زر 'تعديل المستهدف والتاريخ' في الأعلى لتحديد ميزانيتك وتاريخ موعد الزفاف.",
        "أضف بنود المصاريف (شقة، أثاث، شبكة، صالة) وسجل المدفوعات أولاً بأول.",
        "راجع مؤشر Reality Check Advisor لمعرفة الفائض المطلوب شهرياً من الفريلانس لتغطية الهدف.",
      ],
      stepsEn: [
        "Click 'Edit Target & Date' to customize your total budget and target wedding date.",
        "Add itemized expenses (housing, furniture, jewelry, wedding hall) and log payments.",
        "Consult the Reality Check Advisor to know exact monthly freelance surplus required.",
      ],
      goldenRuleAr: "§Rule 6: هدف الزواج ليس أمنية، بل مسار مالي محسوب بالأيام والجنيهات.",
      goldenRuleEn: "§Rule 6: The marriage milestone is not a vague wish, but a mathematical timeline.",
    },
    {
      id: "relationship",
      href: "/relationship",
      icon: Users2,
      titleAr: "ركن العلاقة والجمعة المحمية (Relationship)",
      titleEn: "Relationship & Shared Rhythm",
      pillar: "mission",
      purposeAr: "حماية التوازن الإنساني والطقوس الأسبوعية المشتركة بعيداً عن ضغط العمل الفني.",
      purposeEn: "Guards human balance, shared rituals, and protected off-day connection time.",
      stepsAr: [
        "حدد تفضيلات الميزانية والمواعيد المشتركة (Shared Rituals).",
        "احرص على خلو يوم الجمعة من أي مواعيد تسليم أو اتصالات عمل.",
        "سجل الملاحظات والأفكار اللطيفة لتعزيز العلاقة بانتظام.",
      ],
      stepsEn: [
        "Define shared rituals and weekly check-in cadence.",
        "Keep Friday completely free from project deliverables and work stress.",
        "Log relationship notes and thoughtful ideas regularly.",
      ],
      goldenRuleAr: "النجاح المهني بدون استقرار إنساني وعاطفي هو نجاح منقوص وهش.",
      goldenRuleEn: "Professional success without emotional stability and human warmth is incomplete and fragile.",
    },
    {
      id: "brain-dump",
      href: "/brain-dump",
      icon: Inbox,
      titleAr: "صندوق الأفكار والتفريغ الفوري (Brain Dump)",
      titleEn: "Brain Dump Inbox (Zero Leakage)",
      pillar: "knowledge",
      shortcut: "B",
      purposeAr: "التقاط الأفكار العشوائية في ثانية واحدة لمنع تشتيت جلسات التركيز الحالية.",
      purposeEn: "Instant thought capture engine to prevent cognitive leaks and protect deep flow.",
      stepsAr: [
        "أثناء عملك على مهمة، إذا خطرت لك فكرة فجأة اضغط حرف (B).",
        "اكتب الفكرة واضغط Enter لتعود فوراً إلى تركيزك.",
        "في نهاية اليوم أو المراجعة الأسبوعية، افرز الأفكار (حولها لمهمة، أو ملاحظة، أو احذفها).",
      ],
      stepsEn: [
        "While in deep flow, if a random idea arrives, press (B).",
        "Type the thought and press Enter to return immediately to your task.",
        "Triage your inbox during evening shutdown or weekly review (convert to task, note, or drop).",
      ],
      goldenRuleAr: "§Zero Leakage: عقلك للتفكير وإنتاج الحلول، وليس لتخزين الأفكار العابرة.",
      goldenRuleEn: "§Zero Leakage: Your brain is for generating ideas, not holding onto unwritten clutter.",
    },
    {
      id: "notes",
      href: "/notes",
      icon: FileText,
      titleAr: "شجرة المعرفة والملاحظات (Notes)",
      titleEn: "Knowledge Graph & Notes",
      pillar: "knowledge",
      purposeAr: "توثيق الخبرات التقنية، والمجلدات، وملخصات الكتب والمشاريع.",
      purposeEn: "Organized second brain for technical playbooks, folder hierarchies, and notes.",
      stepsAr: [
        "أنشئ مجلدات حسب مجالات اهتمامك (Tech, Business, Personal, Marriage).",
        "دون ملاحظاتك واستخدم الـ Markdown والوسوم (Tags) لسهولة البحث.",
      ],
      stepsEn: [
        "Create folder hierarchies by domain (Tech, Business, Personal, Marriage).",
        "Write notes using Markdown and tags for rapid semantic retrieval.",
      ],
      goldenRuleAr: "المعرفة الموثقة تختصر عليك مئات الساعات عند تكرار نفس الحلول التقنية.",
      goldenRuleEn: "Documented knowledge saves hundreds of hours when solving recurring technical challenges.",
    },
    {
      id: "habits",
      href: "/habits",
      icon: Flame,
      titleAr: "العادات واستمرارية الإنجاز (Habits)",
      titleEn: "Habits & Streaks",
      pillar: "mission",
      purposeAr: "بناء العادات الأساسية (الصلاة، القراءة، الرياضة) وتتبع سلاسل الالتزام (Streaks).",
      purposeEn: "Build core identity habits (prayer, fitness, reading) and maintain unbroken streaks.",
      stepsAr: [
        "أضف عاداتك اليومية أو الأسبوعية مع تحديد التكرار المطلوب.",
        "علم على العادة المكتملة يومياً للحفاظ على سلسلة الإنجاز (Streak).",
      ],
      stepsEn: [
        "Add daily or weekly habits with target frequencies.",
        "Check off habits daily to build momentum and maintain streaks.",
      ],
      goldenRuleAr: "الهوية تبنى بتكرار الأفعال الصغيرة اليومية، وليس بالقرارات الحماسية المفاجئة.",
      goldenRuleEn: "Identity is forged through consistent daily micro-actions, not sporadic bursts.",
    },
    {
      id: "routines",
      href: "/routines",
      icon: RotateCcw,
      titleAr: "الروتين اليومي المكدس (Routines)",
      titleEn: "Daily Routines Stack",
      pillar: "mission",
      purposeAr: "تنظيم الروتين الصباحي، وفترات الراحة، والروتين المسائي التلقائي.",
      purposeEn: "Structured morning stack, recharge intervals, and evening cooldown routines.",
      stepsAr: [
        "رتب خطوات روتينك الصباحي (الاستيقاظ، الوضوء، الرياضة، التخطيط).",
        "رتب خطوات روتينك المسائي للاستعداد للنوم العميق.",
      ],
      stepsEn: [
        "Configure morning routine stack (wake up, prayer, movement, daily planning).",
        "Set evening cooldown routine for restorative sleep.",
      ],
      goldenRuleAr: "الروتين الصباحي الثابت يمنحك بداية هادئة ومتحكمة في يومك.",
      goldenRuleEn: "A stable morning routine ensures you start every day proactively rather than reactively.",
    },
    {
      id: "reviews",
      href: "/reviews",
      icon: Clock,
      titleAr: "المراجعات الدورية (Reviews)",
      titleEn: "Strategic Reviews Cadence",
      pillar: "knowledge",
      purposeAr: "المراجعة الأسبوعية والشهرية لتقييم الإنجاز واستخلاص الدروس وتحديث الأهداف.",
      purposeEn: "Weekly, monthly, and quarterly reflection loops to calibrate strategy.",
      stepsAr: [
        "افتح المراجعة الأسبوعية كل أسبوع لمراجعة ساعات العمل العميق والمهام المنجزة.",
        "اكتب 3 نقاط نجاح، ونقطة واحدة للتحسين في الأسبوع القادم.",
      ],
      stepsEn: [
        "Conduct weekly review every weekend to evaluate output and completed projects.",
        "Document 3 wins and 1 core adjustment for next week.",
      ],
      goldenRuleAr: "الأسبوع الذي لا تتم مراجعته يتكرر بأخطائه في الأسبوع التالي.",
      goldenRuleEn: "An unreviewed week will inevitably repeat its blind spots and bottlenecks.",
    },
    {
      id: "analytics",
      href: "/analytics",
      icon: BarChart3,
      titleAr: "التحليلات والرؤى (Analytics)",
      titleEn: "System Analytics & Insights",
      pillar: "mission",
      purposeAr: "رسوم بيانية شاملة لمعدل الالتزام اليومي، وساعات التركيز، ومصادر الدخل.",
      purposeEn: "Deep analytics on completion rates, deep work hours, and revenue distribution.",
      stepsAr: [
        "حلل توزيع وقتك بين كتل التركيز والمشاريع المختلفة.",
        "اكتشف الأيام الأكثر إنتاجية في أسبوعك لمضاعفة طاقتك فيها.",
      ],
      stepsEn: [
        "Analyze time distribution between client work, deep focus, and admin tasks.",
        "Identify high-energy peak days to schedule demanding technical deep work.",
      ],
      goldenRuleAr: "ما لا يمكن قياسه لا يمكن تحسينه.",
      goldenRuleEn: "What gets measured gets optimized.",
    },
    {
      id: "energy",
      href: "/energy",
      icon: Zap,
      titleAr: "الطاقة ومؤقت العمل العميق (Energy & Rhythm)",
      titleEn: "Energy, Sleep & Deep Work Timer",
      pillar: "mission",
      purposeAr: "متابعة ساعات النوم، مستوى الطاقة، كتل جلسات البومودورو، وتوزيع الوقت الأسبوعي.",
      purposeEn: "Track sleep metrics, bio-rhythm energy ratings, Pomodoro deep work timers, and weekly focus analytics.",
      stepsAr: [
        "سجل موعد نومك واستيقاظك ومستوى طاقتك الصباحي لتحصل على نصيحة السعة الإنتاجية.",
        "شغل مؤقت العمل العميق (بومودورو أو ساعة إيقاف) واربطه بالمهمة التي تنفذها.",
        "راجع توزيع ساعاتك الأسبوعية للتأكد من توجيه الوقت للـ Deep Work والمبيعات.",
      ],
      stepsEn: [
        "Log sleep and waking times to receive immediate bio-rhythm capacity advice.",
        "Launch the Deep Work Timer (Pomodoro / Stopwatch) and link it directly to your active task.",
        "Inspect weekly time distributions to safeguard high-leverage focus.",
      ],
      goldenRuleAr: "طاقتك ونومك هما المحرك الأساسي؛ لا تضغط على نفسك في يوم منخفض الطاقة بل خطط للمهام الإدارية.",
      goldenRuleEn: "Energy precedes execution; align high-cognitive tasks with peak energy days.",
    },
    {
      id: "agent",
      href: "/agent",
      icon: Bot,
      titleAr: "الوكيل الذكي والجدولة اليومية (Hermes AI)",
      titleEn: "Autonomous AI Copilot & Midnight Cron",
      pillar: "command",
      purposeAr: "إدارة الـ API Keys، البرومبت الشامل، جدولة التخطيط اليومي لمنتصف الليل (12:00 AM)، وسجل تقارير الـ AI.",
      purposeEn: "Manage API credentials, Master System Prompt, Midnight (12:00 AM) cron planning, and activity audit logs.",
      stepsAr: [
        "انسخ مفتاح الـ API الخاص بك والبرومبت الشامل (Master Prompt).",
        "شغل سكريبت الـ Cron يومياً الساعة 12 بليل ليقوم الـ AI بفحص أهدافك وضبط خطة الصباح في `/today`.",
        "تابع تبويب تقارير وعمليات الـ AI في `/agent` لمعرفة التعديلات والمهام التي رتبها واقتراحاته.",
      ],
      stepsEn: [
        "Copy your personal private API key and Master System Prompt.",
        "Configure the 12:00 AM Midnight cron script to autonomously orchestrate tomorrow's morning mission in `/today`.",
        "Review the AI Activity & Reports tab in `/agent` to track all autonomous updates and strategic suggestions.",
      ],
      goldenRuleAr: "وكيلك الذكي يجهز لك خطة اليوم وأنت نائم لتستيقظ وتبدأ التنفيذ الفوري بدون تردد.",
      goldenRuleEn: "Your AI agent orchestrates tomorrow while you sleep so you wake up ready for immediate execution.",
    },
  ], []);

  // Filtered pages
  const filteredPages = useMemo(() => {
    return allPages.filter((page) => {
      const matchesPillar = selectedPillar === "all" || page.pillar === selectedPillar;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        page.titleAr.toLowerCase().includes(query) ||
        page.titleEn.toLowerCase().includes(query) ||
        page.purposeAr.toLowerCase().includes(query) ||
        page.purposeEn.toLowerCase().includes(query) ||
        page.href.toLowerCase().includes(query);

      return matchesPillar && matchesSearch;
    });
  }, [allPages, selectedPillar, searchQuery]);

  const pillars = [
    { id: "all", name: isRtl ? "كل الصفحات (الـ 20)" : "All Pages (20)" },
    { id: "command", name: isRtl ? "غرفة القيادة والتنفيذ" : "Command & Execution" },
    { id: "revenue", name: isRtl ? "الإيرادات والبيزنس" : "Revenue & Deals" },
    { id: "knowledge", name: isRtl ? "المعرفة والذاكرة" : "Knowledge & Memory" },
    { id: "mission", name: isRtl ? "الرسالة الحياتية والمالية" : "Life & Rhythm" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-150 max-w-6xl mx-auto pb-16">
      {/* Page Title & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{isRtl ? "دليل التشغيل والاستخدام الموسوعي" : "Master Operating Handbook"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            {isRtl ? "دليل تشغيل وإتقان نظام ANTIDOTE" : "Mastering ANTIDOTE (LIFE OS)"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            {isRtl
              ? "الدليل العملي الشامل لكل صفحة ومحرك في النظام مع شجرة خريطة الربط الهيكلي وقواعد التشغيل."
              : "Comprehensive step-by-step operational blueprint for all 20 pages with system graph & best practices."}
          </p>
        </div>

        {/* Shortcuts Quick Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-shortcuts-modal"));
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all shadow-xs cursor-pointer"
          >
            <Keyboard className="h-4 w-4 text-indigo-500" />
            <span>{isRtl ? "دليل الاختصارات (?)" : "Keyboard Shortcuts (?)"}</span>
          </button>
        </div>
      </div>

      {/* 1. Interactive Visual System Architecture Graph */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white relative overflow-hidden shadow-xl space-y-6">
        {/* Glow */}
        <div className="absolute top-0 right-1/3 w-[300px] h-[150px] bg-indigo-600/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 relative z-10">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black border border-indigo-500/30">
              <GitFork className="h-3.5 w-3.5" />
              <span>{isRtl ? "شجرة خريطة النظام الموحدة" : "Interactive System Graph Map"}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-100">
              {isRtl ? "الهيكل المترابط لمحركات ANTIDOTE الـ 20" : "The Unified Architecture of 20 Engines"}
            </h2>
          </div>

          <span className="text-[11px] font-mono text-zinc-400">
            Click any node to navigate
          </span>
        </div>

        {/* Visual Graph Architecture Tree */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 text-left">
          {/* Pillar 1: Command */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black pb-2 border-b border-zinc-800">
              <Sun className="h-4 w-4" />
              <span>1. القيادة والتنفيذ (Command)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <Link href="/home" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/home — لوحة القيادة</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/today" className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors font-bold">
                <span>/today — خطة اليوم (P1)</span>
                <span className="text-[10px] font-mono bg-amber-500/30 px-1.5 py-0.2 rounded">T</span>
              </Link>
              <Link href="/tasks" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/tasks — المهام والأولويات</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/goals" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/goals — شجرة الأهداف</span>
                <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded">G</span>
              </Link>
              <Link href="/calendar" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/calendar — التقويم الموحد</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/decisions" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/decisions — غرفة القرارات</span>
                <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded">D</span>
              </Link>
            </div>
          </div>

          {/* Pillar 2: Revenue */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black pb-2 border-b border-zinc-800">
              <Briefcase className="h-4 w-4" />
              <span>2. الإيرادات والبيزنس (Revenue)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <Link href="/freelance" className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors font-bold">
                <span>/freelance — مسار الصفقات</span>
                <ExternalLink className="h-3 w-3 text-emerald-400" />
              </Link>
              <Link href="/opportunities" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/opportunities — ترتيب الفرص</span>
                <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded">O</span>
              </Link>
              <Link href="/projects" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/projects — مركز المشاريع</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/clients" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/clients — سجل العملاء</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/finances" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/finances — المالية والمحافظ</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Life & Mission */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-black pb-2 border-b border-zinc-800">
              <Heart className="h-4 w-4" />
              <span>3. الحياة والرسالة (Life Mission)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <Link href="/marriage" className="flex items-center justify-between p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-colors font-bold">
                <span>/marriage — مهمة الزواج</span>
                <ExternalLink className="h-3 w-3 text-rose-400" />
              </Link>
              <Link href="/relationship" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/relationship — العلاقة المشتركة</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/habits" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/habits — العادات والسلاسل</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/routines" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/routines — الروتين اليومي</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/analytics" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/analytics — التحليلات والرؤى</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
            </div>
          </div>

          {/* Pillar 4: Knowledge & AI */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black pb-2 border-b border-zinc-800">
              <Bot className="h-4 w-4" />
              <span>4. المعرفة والذكاء (AI & Brain)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <Link href="/agent" className="flex items-center justify-between p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors font-bold">
                <span>/agent — الوكيل الذكي Hermes</span>
                <ExternalLink className="h-3 w-3 text-cyan-400" />
              </Link>
              <Link href="/brain-dump" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/brain-dump — صندوق الأفكار</span>
                <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded">B</span>
              </Link>
              <Link href="/notes" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/notes — الملاحظات والمعرفة</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/reviews" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/reviews — المراجعة الأسبوعية</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
              <Link href="/settings" className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <span>/settings — إعدادات النظام</span>
                <ExternalLink className="h-3 w-3 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Onboarding Quick Checklist (5-Minute Setup) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white via-zinc-50/50 to-indigo-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/20 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>{t.guidePage.checklistTitle}</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {t.guidePage.checklistSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-500">
              {completedCount} / {onboardingSteps.length} {isRtl ? "مكتمل" : "done"}
            </span>
            <div className="w-24 bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {onboardingSteps.map((step) => {
            const isDone = Boolean(completedSteps[step.id]);
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  isDone
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                    : "bg-white dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isDone
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <span className={`text-xs font-black ${isDone ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {step.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="text-zinc-400 hover:text-emerald-500 transition-colors cursor-pointer shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>{step.actionText}</span>
                    <ArrowIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep-Dive Page-by-Page Practical Operations Manual */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-black">
              <Layers className="h-3.5 w-3.5" />
              <span>{isRtl ? "دليل الاستخدام العملي لكل صفحة" : "Page-by-Page Practical Manual"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {isRtl ? "كيف تستخدم كل شاشة في مشروعنا خطوة بخطوة" : "How to Operate Every Screen Step-by-Step"}
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 start-3 text-zinc-400" />
            <input
              type="text"
              placeholder={isRtl ? "ابحث في صفحات ودليل النظام..." : "Search pages & guides..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 ps-9 pe-4 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Pillar Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {pillars.map((p) => {
            const isSelected = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Pages Accordion Cards List */}
        <div className="space-y-3.5">
          {filteredPages.map((page) => {
            const Icon = page.icon;
            const isExpanded = expandedPageId === page.id;

            return (
              <div
                key={page.id}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedPageId(isExpanded ? null : page.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                          {isRtl ? page.titleAr : page.titleEn}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                          {page.href}
                        </span>
                        {page.shortcut && (
                          <span className="text-[10px] font-mono font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                            {page.shortcut}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {isRtl ? page.purposeAr : page.purposeEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={page.href}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                    >
                      <span>{isRtl ? "فتح الصفحة" : "Open"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Practical Steps */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                          {isRtl ? "خطوات الاستخدام العملية:" : "Practical Step-by-Step Guide:"}
                        </div>
                        <ul className="space-y-2">
                          {(isRtl ? page.stepsAr : page.stepsEn).map((stepText, idx) => (
                            <li
                              key={idx}
                              className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60"
                            >
                              <span className="h-4 w-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{stepText}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Golden Rule / Pro Tip */}
                      <div className="space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                            {isRtl ? "القاعدة الذهبية الذكية (Golden Rule):" : "Golden Operating Rule:"}
                          </div>
                          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs font-medium text-amber-950 dark:text-amber-200 leading-relaxed">
                            {isRtl ? page.goldenRuleAr : page.goldenRuleEn}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={page.href}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold hover:scale-102 transition-all shadow-xs cursor-pointer"
                          >
                            <span>{isRtl ? `الانتقال إلى ${page.titleAr}` : `Launch ${page.titleEn}`}</span>
                            <ArrowIcon className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Strategic Operating Manifesto */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isRtl ? "مبادئ العمل الاستراتيجي عالي الكفاءة" : "High-Agency Operating Principles"}</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {isRtl ? "قواعد نفسية وتنفيذية لحمايتك من التشتت والاحتراق" : "Psychological & Strategic Guardrails"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              §41 Non-Punitive Execution
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {isRtl
                ? "تأجيل مهمة ليس فشلاً. أعد جدولتها بهدوء. النظام لا يلومك أبداً ولا يصنع شعوراً بالذنب."
                : "Missed a task? Re-plan calmly. The OS never induces toxic guilt or punitive friction."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
              §Zero Cognitive Leakage
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {isRtl
                ? "أي فكرة مفاجئة لا تنفذها فوراً أثناء التركيز. اضغط (B) واكتبها لتعود لمهمتك في ثانية."
                : "Never interrupt deep flow for sudden ideas. Press (B), capture in 2 seconds, and resume."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-black text-rose-600 dark:text-rose-400">
              §Strict Cashflow Separation
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {isRtl
                ? "محفظة الزواج وصندوق الطوارئ معزولان تماماً عن المصاريف اليومية لضمان عدم استنزاف المدخرات."
                : "Marriage and emergency buckets are strictly isolated from daily operational cashflow."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
