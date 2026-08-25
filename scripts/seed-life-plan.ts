import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local natively
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  console.warn("Could not read .env.local:", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("🚀 Starting LIFE OS Plan Seeding from docs/LIFE_CAREER_AND_LIFE_PLAN_AR.md...");

  // 1. Fetch profiles
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("id, display_name, email, agent_api_key, settings");

  if (profileErr || !profiles || profiles.length === 0) {
    console.error("No profiles found to seed plan for:", profileErr);
    process.exit(1);
  }

  console.log(`Found ${profiles.length} user profile(s). Seeding for all users...`);

  for (const profile of profiles) {
    const userId = profile.id;
    console.log(`\n======================================================`);
    console.log(`👤 Seeding for User: ${profile.display_name || profile.email} (${userId})`);
    console.log(`🔑 Agent API Key: ${profile.agent_api_key || "None"}`);
    console.log(`======================================================`);

    // A. Update Marriage Profile Settings & Target
    const currentSettings = (profile.settings as Record<string, unknown>) || {};
    const updatedSettings = {
      ...currentSettings,
      comfortIncomeTarget: 30000,
      work_hours_per_day: 8,
      marriage: {
        targetBudget: 250000,
        targetDate: "2027-08-25",
        housing_strategy: "Rent initially, buy later",
      },
    };

    await supabase
      .from("profiles")
      .update({
        settings: updatedSettings,
      })
      .eq("id", userId);

    // Update Marriage bucket target
    await supabase
      .from("buckets")
      .update({
        target_amount: 250000,
      })
      .eq("user_id", userId)
      .eq("kind", "marriage");

    console.log("✅ Profile settings & Marriage bucket target updated.");

    // B. Strategic Goals Tree (§Goals)
    const goalsData = [
      {
        user_id: userId,
        title: "الرؤية الكبرى: الاستقلال المالي والزواج المبارك خلال سنة",
        level: "vision" as const,
        description: "تحويل سنة كاملة إلى دخل متصاعد، صندوق زواج مكتمل، Portfolio قوي، وحياة يومية مستقرة.",
        target_value: 250000,
        unit: "EGP",
        status: "active" as const,
        sort_order: 1,
      },
      {
        user_id: userId,
        title: "هدف صندوق الزواج (250,000 ج.م)",
        level: "year" as const,
        description: "سد فجوة الزواج (232,000 ج.م) بمعدل فائض شهري 19,333 ج.م من أرباح الفريلانس.",
        target_value: 250000,
        unit: "EGP",
        status: "active" as const,
        sort_order: 2,
      },
      {
        user_id: userId,
        title: "محرك الفريلانس الأساسي (MERN / Next.js Engine)",
        level: "quarter" as const,
        description: "الوصول لدخل شهري لا يقل عن 30,000 ج.م وبناء قاعدة عملاء متكررين (Retainers).",
        target_value: 30000,
        unit: "EGP/mo",
        status: "active" as const,
        sort_order: 3,
      },
      {
        user_id: userId,
        title: "محرك أتمتة وبوتات ديسكورد (Discord Automation Suite)",
        level: "quarter" as const,
        description: "تحويل خبرة البوتات إلى باقات قابلة للتكرار (Bot + Admin Dashboard) لمجتمعات الألعاب والشركات.",
        target_value: 15000,
        unit: "EGP/mo",
        status: "active" as const,
        sort_order: 4,
      },
      {
        user_id: userId,
        title: "مسار العقود والوظائف عن بعد (Remote Contracts & Jobs)",
        level: "year" as const,
        description: "إرسال 25-40 تقديم أسبوعياً على منصات Wellfound و Contra و Arc.",
        target_value: 40,
        unit: "Apps/mo",
        status: "active" as const,
        sort_order: 5,
      },
    ];

    // Delete existing goals for clean seeding
    await supabase.from("goals").delete().eq("user_id", userId);
    const { data: createdGoals, error: goalErr } = await supabase
      .from("goals")
      .insert(goalsData)
      .select("id, title");

    if (goalErr) console.error("Goals error:", goalErr.message);
    else console.log(`✅ ${createdGoals?.length || 0} Strategic Goals seeded.`);

    // C. Flagship Projects (§Projects)
    const projectsData = [
      {
        user_id: userId,
        name: "SaaS Business Operations Dashboard",
        kind: "client" as const,
        status: "active" as const,
        budget: 15000,
        deadline: "2026-09-15",
        brief: "لوحة تحكم عمليات SaaS متكاملة مبنية بـ Next.js 16 و TypeScript و Tailwind و Supabase لإثبات القدرة على بناء Enterprise Software.",
      },
      {
        user_id: userId,
        name: "Full-Stack Business Platform",
        kind: "internal" as const,
        status: "active" as const,
        budget: 20000,
        deadline: "2026-10-01",
        brief: "منصة إدارة أعمال وحجوزات/مخزون متكاملة للشركات الصغيرة والمتوسطة.",
      },
      {
        user_id: userId,
        name: "Discord Automation & Web Dashboard Suite",
        kind: "client" as const,
        status: "active" as const,
        budget: 12000,
        deadline: "2026-09-30",
        brief: "باقة ديسكورد بوت + لوحة تحكم ويب لإدارة الصلاحيات والتذاكر والاشتراكات للمجتمعات الكبرى.",
      },
    ];

    await supabase.from("projects").delete().eq("user_id", userId);
    const { data: createdProjects, error: projErr } = await supabase
      .from("projects")
      .insert(projectsData)
      .select("id, name");

    if (projErr) console.error("Projects error:", projErr.message);
    else console.log(`✅ ${createdProjects?.length || 0} Flagship Projects seeded.`);

    const saasProjId = createdProjects?.find((p) => p.name.includes("SaaS"))?.id;

    // D. 14-Day Sprint & Daily Action Tasks (§Tasks)
    const todayStr = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const tasksData = [
      {
        user_id: userId,
        title: "Day 1: إنهاء الـ Portfolio وتجهيز الـ Headline الاحترافي وحساب LinkedIn",
        priority: "critical" as const,
        task_type: "revenue" as const,
        duration_min: 120,
        scheduled_date: todayStr,
        deadline: todayStr,
        is_top_three: true,
        status: "planned" as const,
        project_id: saasProjId || null,
        description: "Full-Stack Developer | Next.js, React, TypeScript & Node.js | SaaS, Dashboards & Automation",
      },
      {
        user_id: userId,
        title: "Day 2: تجهيز Live Demo لمشروع الـ SaaS Dashboard ونشره على Vercel",
        priority: "critical" as const,
        task_type: "product" as const,
        duration_min: 90,
        scheduled_date: todayStr,
        deadline: todayStr,
        is_top_three: true,
        status: "planned" as const,
        project_id: saasProjId || null,
        description: "التأكد من عمل الـ Auth والـ Tables والـ Charts بسرعة واستجابة فائقة.",
      },
      {
        user_id: userId,
        title: "Day 3: كتابة Case Study مفصلة للمشروع الأول وربطها بالـ Portfolio",
        priority: "high" as const,
        task_type: "product" as const,
        duration_min: 60,
        scheduled_date: tomorrowStr,
        deadline: tomorrowStr,
        is_top_three: true,
        status: "planned" as const,
        project_id: saasProjId || null,
        description: "Problem, Solution, Architecture, Features, Tech Stack, Challenges & Live Link.",
      },
      {
        user_id: userId,
        title: "Day 4: تجهيز باقة Discord Automation & Dashboard Bot ونشر Demo",
        priority: "high" as const,
        task_type: "revenue" as const,
        duration_min: 90,
        scheduled_date: tomorrowStr,
        deadline: tomorrowStr,
        is_top_three: false,
        status: "planned" as const,
        description: "تجهيز السيرفر التجريبي وربط لوحة التحكم Web Admin.",
      },
      {
        user_id: userId,
        title: "Day 5: إكمال حساب Upwork بنسبة 100% وإضافة الخدمات على Contra",
        priority: "critical" as const,
        task_type: "revenue" as const,
        duration_min: 60,
        scheduled_date: tomorrowStr,
        deadline: tomorrowStr,
        is_top_three: false,
        status: "planned" as const,
        description: "ربط المشاريع الـ 3 وإضافة الشهادات والمهارات المحددة.",
      },
      {
        user_id: userId,
        title: "Day 6: حملة الـ Warm Network — مراسلة 10 جهات اتصال موثوقة برابط البورتفوليو",
        priority: "high" as const,
        task_type: "revenue" as const,
        duration_min: 45,
        scheduled_date: tomorrowStr,
        deadline: tomorrowStr,
        is_top_three: false,
        status: "planned" as const,
        description: "إعلام شبكة العلاقات بالتركيز على الـ Next.js Dashboards و Discord Bots.",
      },
      {
        user_id: userId,
        title: "Day 7: بدء الـ Problem-Led Outreach — إرسال 10 مقترحات مخصصة للعملاء",
        priority: "critical" as const,
        task_type: "revenue" as const,
        duration_min: 90,
        scheduled_date: tomorrowStr,
        deadline: tomorrowStr,
        is_top_three: false,
        status: "planned" as const,
        description: "استهداف شركات تحتاج تجديد Dashboards أو تحسين أداء Next.js.",
      },
      {
        user_id: userId,
        title: "Daily Focus: إرسال 5 مقترحات Upwork عالية الجودة + 5 Follow-ups يومياً",
        priority: "critical" as const,
        task_type: "revenue" as const,
        duration_min: 60,
        scheduled_date: todayStr,
        deadline: todayStr,
        is_top_three: true,
        status: "planned" as const,
        description: "تطبيق صيغة الـ Proposal المباشرة والتركيز على حل مشكلة العميل الحقيقية.",
      },
      {
        user_id: userId,
        title: "Daily Focus: كتلة عمل عميق (Deep Work) 4 ساعات متواصلة بدون مشتتات",
        priority: "critical" as const,
        task_type: "product" as const,
        duration_min: 240,
        scheduled_date: todayStr,
        deadline: todayStr,
        is_top_three: false,
        status: "planned" as const,
        description: "إغلاق الهاتف وتطبيقات السوشيال والتركيز في كتل بومودورو 90 دقيقة.",
      },
      {
        user_id: userId,
        title: "Daily Habit: طقس الإغلاق المسائي (Evening Shutdown) ومراجعة إنجاز اليوم",
        priority: "medium" as const,
        task_type: "personal" as const,
        duration_min: 15,
        scheduled_date: todayStr,
        deadline: todayStr,
        is_top_three: false,
        status: "planned" as const,
        description: "تصفير المهام، تقييم الطاقة، وتجهيز خطة الغد في /today لتستيقظ مستعداً.",
      },
    ];

    await supabase.from("tasks").delete().eq("user_id", userId);
    const { data: createdTasks, error: taskErr } = await supabase
      .from("tasks")
      .insert(tasksData)
      .select("id, title");

    if (taskErr) console.error("Tasks error:", taskErr.message);
    else console.log(`✅ ${createdTasks?.length || 0} Action Tasks seeded.`);

    // E. Freelance Pipeline & Opportunities (§Leads)
    const leadsData = [
      {
        user_id: userId,
        title: "SaaS Business Dashboard Client (Outbound Prospect)",
        source: "Upwork",
        expected_value: 950,
        stage: "proposal_sent" as const,
        notes: "عميل يبحث عن إعادة بناء لوحة تحكم داخلية بـ Next.js و Postgres. تم تقديم مقترح مخصص.",
      },
      {
        user_id: userId,
        title: "Discord Community Automation & Roles System",
        source: "Discord Community",
        expected_value: 450,
        stage: "qualified" as const,
        notes: "مجتمع ألعاب يبحث عن بوت إدارة صلاحيات وربط ويب هوكس.",
      },
      {
        user_id: userId,
        title: "Agency White-Label Next.js Dev Support Retainer",
        source: "LinkedIn",
        expected_value: 1200,
        stage: "contacted" as const,
        notes: "وكالة تسويق تبحث عن مطور خارجي لدعم مشاريع الويب لعملائها.",
      },
    ];

    await supabase.from("leads").delete().eq("user_id", userId);
    const { data: createdLeads, error: leadErr } = await supabase
      .from("leads")
      .insert(leadsData)
      .select("id, title");

    if (leadErr) console.error("Leads error:", leadErr.message);
    else console.log(`✅ ${createdLeads?.length || 0} Freelance Pipeline Leads seeded.`);

    // F. Knowledge Playbooks & Notes (§Notes)
    const notesData = [
      {
        user_id: userId,
        title: "صيغة الـ Proposal الفائزة على Upwork (The Winning Formula)",
        folder: "business",
        tags: ["freelance", "upwork", "proposals"],
        pinned: true,
        archived: false,
        content: `### صيغة الـ Proposal الذهبية

لا تبدأ بـ:
> Hello sir, I am interested in your project.

**الصيغة الفعالة:**
\`\`\`text
Hi,

I noticed that you're trying to [specific problem].
I would solve it by [specific approach].
I've built a similar system involving [relevant proof link].

For your project, I'd suggest:
1. X
2. Y
3. Z

I can start with [small first milestone].

One question before we start:
[smart question showing technical depth]?
\`\`\`

**القاعدة الذهبية:** أول 2-3 أسطر يجب أن تثبت للعميل أنك قرأت مشكلته وفهمت الحل بعمق.`,
      },
      {
        user_id: userId,
        title: "استراتيجية المحافظ المالية الأربعة وحماية مدخرات الزواج",
        folder: "finance",
        tags: ["marriage", "budget", "cashflow"],
        pinned: true,
        archived: false,
        content: `### استراتيجية المحافظ المالية المنفصلة

1. **صندوق الزواج (Marriage Fund):** الهدف 250,000 ج.م. يحول له الفائض الشهري فوراً ولا يسحب منه قرش.
2. **صندوق الطوارئ (Emergency Fund):** تغطية 3-6 أشهر من المصاريف الأساسية لتوفير الأمان النفسي.
3. **المصاريف الشخصية (Personal Living):** ميزانية مقيدة ومنضبطة شهرياً.
4. **العمل والبيزنس (Business Operations):** استثمار الأدوات والاشتراكات (Hosting, AI, Tools).

**معادلة التوفير:**
\`\`\`text
Net Income - Living Expenses - Business Expenses = Available Savings → Marriage Fund
\`\`\``,
      },
      {
        user_id: userId,
        title: "معادلة الـ 10×10×10 للحصول على أول عميل فريلانس (Problem-Led Outreach)",
        folder: "business",
        tags: ["sales", "outreach", "strategy"],
        pinned: false,
        archived: false,
        content: `### نموذج 10×10×10 اليومي

كل يوم في فترة الانطلاق:
- **10 Prospects:** تحديد 10 عملاء محتملين لديهم مشكلة واضحة في موقعهم أو لوحة تحكمهم.
- **10 Useful Messages:** إرسال 10 مقترحات مخصصة تشرح الحل بدون بيع عدواني.
- **10 Minutes Follow-up:** متابعة العملاء السابقين والرد على الاستفسارات.

**النتيجة:** بعد 14 يوماً = 140 محاولة تواصل نوعية تضمن إغلاق أول 1-3 عملاء بإذن الله.`,
      },
    ];

    await supabase.from("notes").delete().eq("user_id", userId);
    const { data: createdNotes, error: noteErr } = await supabase
      .from("notes")
      .insert(notesData)
      .select("id, title");

    if (noteErr) console.error("Notes error:", noteErr.message);
    else console.log(`✅ ${createdNotes?.length || 0} Knowledge Playbooks seeded.`);

    // G. Strategic Decisions Canvas (§Decisions)
    const decisionsData = [
      {
        user_id: userId,
        title: "التركيز التجاري الكامل على Next.js / Full-Stack وتأجيل السايبر سيكيورتي كخدمة تسويقية أساسية",
        risk: "low",
        reversible: false,
        status: "decided" as const,
        decision: "تم الاعتماد: Full-Stack MERN / Next.js هو محرك الدخل السريع للوصول لمستهدف الزواج.",
        options: [
          { id: "1", label: "التركيز الكامل على Next.js Dashboards" },
          { id: "2", label: "الجمع بين السايبر سيكيورتي والويب" },
        ],
        why_now: "سوق الـ Web Development والـ Dashboards أسرع في دورة المبيعات وتوليد السيولة الفورية.",
        upside: "تركيز طاقتي في مسار واحد واضح ينهي التشتت ويضاعف فرص الحصول على عملاء.",
        downside: "تأجيل جزء من الشغف الأمني مؤقتاً.",
        worst_case: "عدم إغلاق عملاء في أول شهر، ويتم معالجته برفع وتيرة الـ Outreach.",
      },
      {
        user_id: userId,
        title: "استراتيجية سكن الزواج: الإيجار أولاً وتأجيل شراء الشقة لحين استقرار الدخل",
        risk: "medium",
        reversible: true,
        status: "decided" as const,
        decision: "تم الاعتماد: الإيجار يخفض تكلفة الزواج من سنتين إلى سنة واحدة فقط.",
        options: [
          { id: "1", label: "شراء شقة تمليك قبل الزواج" },
          { id: "2", label: "الإيجار أولاً وتأجيل الشراء" },
        ],
        why_now: "تخفيف العبء المالي المباشر وضمان إتمام الزواج في الموعد المستهدف 2027.",
        upside: "توفير أكثر من 500,000 ج.م في المرحلة الأولى وتسريع موعد الزفاف سنة كاملة.",
        downside: "وجود التزام إيجار شهري، ويغطى من دخل الفريلانس الثابت.",
      },
    ];

    await supabase.from("decisions").delete().eq("user_id", userId);
    const { data: createdDecisions, error: decErr } = await supabase
      .from("decisions")
      .insert(decisionsData)
      .select("id, title");

    if (decErr) console.error("Decisions error:", decErr.message);
    else console.log(`✅ ${createdDecisions?.length || 0} Strategic Decisions seeded.`);

    // H. Marriage Itemized Ledger (§Marriage Expenses)
    const marriageExpensesData = [
      {
        user_id: userId,
        item: "مقدم إيجار وتأمين وتجهيز الشقة",
        category: "rent_deposit" as const,
        estimated_cost: 35000,
        paid_amount: 0,
        priority: "critical" as const,
        status: "planned" as const,
        deadline: "2027-04-01",
      },
      {
        user_id: userId,
        item: "الأجهزة الكهربائية الأساسية (ثلاجة، غسالة، بوتاجاز، شاشة)",
        category: "appliances" as const,
        estimated_cost: 85000,
        paid_amount: 0,
        priority: "critical" as const,
        status: "planned" as const,
        deadline: "2027-06-01",
      },
      {
        user_id: userId,
        item: "الأثاث والغرف الأساسية (غرفة نوم وصالون ومطبخ)",
        category: "furniture" as const,
        estimated_cost: 75000,
        paid_amount: 0,
        priority: "high" as const,
        status: "planned" as const,
        deadline: "2027-07-01",
      },
      {
        user_id: userId,
        item: "الشبكة والمهر",
        category: "jewelry" as const,
        estimated_cost: 35000,
        paid_amount: 18000,
        priority: "critical" as const,
        status: "in_progress" as const,
        deadline: "2026-12-31",
      },
      {
        user_id: userId,
        item: "حفل الزفاف والالتزامات الإضافية",
        category: "hall" as const,
        estimated_cost: 20000,
        paid_amount: 0,
        priority: "medium" as const,
        status: "planned" as const,
        deadline: "2027-08-15",
      },
    ];

    await supabase.from("marriage_expenses").delete().eq("user_id", userId);
    const { data: createdMarriageExp, error: marrErr } = await supabase
      .from("marriage_expenses")
      .insert(marriageExpensesData)
      .select("id, item");

    if (marrErr) console.error("Marriage expenses error:", marrErr.message);
    else console.log(`✅ ${createdMarriageExp?.length || 0} Marriage Budget Items seeded.`);

    // I. Identity Habits (§Habits)
    const habitsData = [
      {
        user_id: userId,
        name: "الصلاة في وقتها والورد القرآني اليومي",
        category: "health_routine" as const,
        target_per_week: 7,
        is_active: true,
        sort_order: 1,
      },
      {
        user_id: userId,
        name: "جلسة عمل عميق (Deep Work) 4 ساعات تركيز بدون هاتف",
        category: "deep_work" as const,
        target_per_week: 6,
        is_active: true,
        sort_order: 2,
      },
      {
        user_id: userId,
        name: "Outreach يومي (إرسال 5 مقترحات Upwork + 5 Follow-ups)",
        category: "revenue" as const,
        target_per_week: 6,
        is_active: true,
        sort_order: 3,
      },
      {
        user_id: userId,
        name: "طقس الإغلاق المسائي وكتابة خطة الغد في /today",
        category: "personal" as const,
        target_per_week: 7,
        is_active: true,
        sort_order: 4,
      },
    ];

    await supabase.from("habits").delete().eq("user_id", userId);
    const { data: createdHabits, error: habitErr } = await supabase
      .from("habits")
      .insert(habitsData)
      .select("id, name");

    if (habitErr) console.error("Habits error:", habitErr.message);
    else console.log(`✅ ${createdHabits?.length || 0} Identity Habits seeded.`);

    // J. Opportunity Pipeline (§Opportunities EV/Hours scoring)
    const oppsData = [
      {
        user_id: userId,
        title: "مشروع إعادة بناء Dashboard شركة ناشئة (Next.js 16)",
        kind: "freelance" as const,
        expected_value: 45000,
        probability: 0.7,
        time_required_hours: 40,
        risk: "low" as const,
        status: "pursuing" as const,
      },
      {
        user_id: userId,
        title: "باقة ديسكورد بوت + لوحة تحكم ويب لمجتمع ألعاب (15k أعضاء)",
        kind: "discord_client" as const,
        expected_value: 22000,
        probability: 0.8,
        time_required_hours: 20,
        risk: "low" as const,
        status: "open" as const,
      },
      {
        user_id: userId,
        title: "عقد Retainer شهري مع وكالة برمجية كـ Frontend Support",
        kind: "remote" as const,
        expected_value: 35000,
        probability: 0.5,
        time_required_hours: 30,
        risk: "medium" as const,
        status: "open" as const,
      },
    ];

    await supabase.from("opportunities").delete().eq("user_id", userId);
    const { data: createdOpps, error: oppErr } = await supabase
      .from("opportunities")
      .insert(oppsData)
      .select("id, title");

    if (oppErr) console.error("Opportunities error:", oppErr.message);
    else console.log(`✅ ${createdOpps?.length || 0} Ranked Opportunities seeded.`);

    // K. Initial Day Plan for Today & Tomorrow (§DayPlan)
    await supabase.from("day_plans").upsert([
      {
        user_id: userId,
        plan_date: todayStr,
        available_hours: 8,
        energy: 4,
        status: "active" as const,
        focus_question_answer: "إنهاء الـ Portfolio وتجهيز الـ Live Demo لمشروع الـ SaaS Dashboard.",
        notes: "بداية الخطة التشغيلية الجديدة — الخروج من الصفر والانطلاق بقوة.",
      },
      {
        user_id: userId,
        plan_date: tomorrowStr,
        available_hours: 8,
        energy: 4,
        status: "active" as const,
        focus_question_answer: "نشر الـ Case Study وإكمال حساب Upwork و Contra بنسبة 100%.",
        notes: "اليوم الثاني من سباق الـ 14 يوماً.",
      },
    ], { onConflict: "user_id,plan_date" });

    console.log("✅ Day Plans for Today and Tomorrow initialized.");
  }

  console.log("\n🎉 ALL LIFE PLAN ASSETS SUCCESSFULLY POPULATED INTO ANTIDOTE!");
}

main().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
