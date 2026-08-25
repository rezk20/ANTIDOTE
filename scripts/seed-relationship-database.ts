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
  console.log("🌸 Seeding Rich Relationship Ideas (Mansoura + Modern 2026) & Wishlist items...");

  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("id, display_name, email");

  if (profileErr || !profiles || profiles.length === 0) {
    console.error("No profiles found:", profileErr);
    process.exit(1);
  }

  for (const profile of profiles) {
    const userId = profile.id;
    console.log(`👤 Seeding for ${profile.display_name || profile.email} (${userId})...`);

    // 1. Massive Curated List of Relationship Ideas (30+ authentic ideas)
    const ideasData = [
      // --- المنصورة والمشاية والكورنيش (Mansoura Gems) ---
      {
        user_id: userId,
        title: "تمشية الغروب في الممشى السياحي الجديد بالمنصورة (خلف مكتبة مصر)",
        category: "date" as const,
        budget_tier: "free" as const,
        estimated_cost: 0,
        notes: "تمشية هادئة على النيل وقت الغروب مع تناول آيس كريم أو مشروب دافئ والحديث عن خطط المستقبل.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "جولة بالأتوبيس النهري في النيل من محطة مكتبة مصر العامة للجامعة",
        category: "trip" as const,
        budget_tier: "low" as const,
        estimated_cost: 30,
        notes: "رحلة نيلية منعشة وهادئة بعيداً عن زحمة الشارع والاستمتاع بنسيم النيل.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "عشاء رومانسي بفيو نيل مباشر في مطاعم المشاية السفلية (Stereo أو La Dolce Vita)",
        category: "date" as const,
        budget_tier: "medium" as const,
        estimated_cost: 450,
        notes: "حجز ترابيزة بإطلالة مباشرة على النيل في أجواء رايقة وهادئة للاحتفال بإنجازات الشهر.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "ورشة تشكيل وتلوين الفخار المشتركة في جاليري روح بالمنصورة",
        category: "home_activity" as const,
        budget_tier: "medium" as const,
        estimated_cost: 350,
        notes: "تجربة فنية ممتعة بصنع مج أو فازة تذكارية للبيت الجديد بأيديكم.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "فطور صباحي مبكر يوم الجمعة على كورنيش المشاية بهدوء تام",
        category: "date" as const,
        budget_tier: "low" as const,
        estimated_cost: 150,
        notes: "بدء يوم الجمعة مبكراً مع قهوة وفطور خفيف في الهواء الطلق قبل زحام المدينة.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "قعدة رايقة بإطلالة نيلية في نادي جزيرة الورد أو نادي الحوار",
        category: "date" as const,
        budget_tier: "low" as const,
        estimated_cost: 120,
        notes: "جلسة مريحة في المساحات الخضراء المطلة على النهر وتناول العصير المفضل.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "سهرة نيلية رايقة وتناول حلبسة وذرة مشوي على كورنيش المشاية",
        category: "date" as const,
        budget_tier: "free" as const,
        estimated_cost: 40,
        notes: "خروجة شعبية بسيطة وممتعة على الكورنيش والضحك ومشاركة القصص القديمة.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "ورشة رسم وتلوين على الكانفاس في Art Area أو Canvas Art بالمنصورة",
        category: "home_activity" as const,
        budget_tier: "medium" as const,
        estimated_cost: 300,
        notes: "رسم لوحة تعبيرية مشتركة لتعليقها لاحقاً في غرفة المعيشة.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "داي يوز سريع لدمياط الجديدة / رأس البر (تمشية بحر وغداء سيفود)",
        category: "trip" as const,
        budget_tier: "high" as const,
        estimated_cost: 850,
        notes: "الهروب لمدة نصف يوم للبحر، التمشية على الشاطئ وتناول وجبة سمك طازجة عند اللسان.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "ليلة بولينج وسينما وألعاب في حي الجامعة / مولات المنصورة",
        category: "date" as const,
        budget_tier: "medium" as const,
        estimated_cost: 350,
        notes: "مباراة بولينج تنافسية حماسية مع مشاهدة فيلم جديد في السينما وتناول الفشار.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "نزهة خلوية (Outdoor Picnic) في حديقة شجرة الدر بالمنصورة",
        category: "trip" as const,
        budget_tier: "low" as const,
        estimated_cost: 90,
        notes: "إحضار مفرش ووجبات خفيفة ومشروبات والجلوس تحت الأشجار أمام النيل.",
        is_completed: false,
      },

      // --- تجارب حديثة ومنزلية 2026 (Modern 2026 & Home Dates) ---
      {
        user_id: userId,
        title: "ليلة سينما منزلية ببروجكتور وإضاءة خافتة مع فشار وناتشوز",
        category: "home_activity" as const,
        budget_tier: "low" as const,
        estimated_cost: 70,
        notes: "تجهيز ركن مريح بالمخدات، إطفاء الأنوار وعرض فيلم كلاسيكي أو وثائقي ملهم.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "ورشة طبخ إيطالي مشتركة في المنزل (Fresh Pasta & Homemade Sauce)",
        category: "home_activity" as const,
        budget_tier: "low" as const,
        estimated_cost: 150,
        notes: "عجن الباستا وتجهيز الصوص وتنسيق السفرة على ضوء الشموع كأنكما في مطعم إيطالي.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "جلسة الأسئلة الـ 36 لتعميق المشاعر والتواصل الإنساني (The 36 Questions)",
        category: "conversation" as const,
        budget_tier: "free" as const,
        estimated_cost: 0,
        notes: "سلسلة أسئلة نفسية وعاطفية عميقة تكسر الروتين وتزيد القرب والألفة بدون هواتف.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "بناء لوحة الأحلام والرؤية المشتركة (Couples Vision Board 2027)",
        category: "conversation" as const,
        budget_tier: "free" as const,
        estimated_cost: 50,
        notes: "جمع صور لديكور البيت المستقبلي، وجهات السفر، والأهداف المالية المشتركة على لوحة واحدة.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "ليلة ألعاب بورد جيمز وبطاقات (Board Games Night) بدون شاشات",
        category: "home_activity" as const,
        budget_tier: "free" as const,
        estimated_cost: 0,
        notes: "لعب مونوبولي أو أونو أو ألعاب أسئلة الذكاء والتحديات الممتعة.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "كتابة رسالة حب ورقية متبادلة وتخزينها في صندوق لفتحها بعد عام",
        category: "surprise" as const,
        budget_tier: "free" as const,
        estimated_cost: 0,
        notes: "تدوين المشاعر الحالية، الامتنان للطرف الآخر، والتطلعات للعام القادم في ظرف مغلق.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "جولة تسوق مرحة لاختيار هدية رمزية لبعض بميزانية محددة (تحدي الـ 100 جنيه)",
        category: "date" as const,
        budget_tier: "low" as const,
        estimated_cost: 200,
        notes: "كل طرف يبحث عن ألطف هدية أو شيء ذو معنى رمزي بميزانية لا تتجاوز 100 جنيه.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "مفاجأة عفوية بطلب وجبتها أو حلوها المفضل دليفري مع كارت ورقي لطيف",
        category: "surprise" as const,
        budget_tier: "medium" as const,
        estimated_cost: 220,
        notes: "إرسال طلب مفاجئ في يوم عمل مزدحم لتخفيف الضغط وإدخال السرور على قلبها.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "جلسة تخطيط أماكن السفر وشهر العسل واستكشاف الفنادق والأنشطة",
        category: "conversation" as const,
        budget_tier: "free" as const,
        estimated_cost: 0,
        notes: "استعراض صور المدن، الفنادق، وترتيب قائمة الأماكن التي تحلمان بزيارتها معاً.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "مسابقة تذوق الأكلات وتخمين النكهات بالعين المغمضة (Blind Taste Test)",
        category: "home_activity" as const,
        budget_tier: "low" as const,
        estimated_cost: 80,
        notes: "تجهيز 6 أطعمة ونكهات مختلفة وتغميض العينين لتخمين المكونات في أجواء مليئة بالضحك.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "ليلة شاي أعشاب وتهدئة مع استماع لتلاوة قرآنية هادئة قبل النوم",
        category: "home_activity" as const,
        budget_tier: "free" as const,
        estimated_cost: 0,
        notes: "طقس هادئ ومريح للأعصاب يختم اليوم بسلام وسكينة بعيداً عن السوشيال ميديا.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "إهداء باقة ورد صغيرة عفوية بدون مناسبة خاصة أثناء اللقاء",
        category: "surprise" as const,
        budget_tier: "low" as const,
        estimated_cost: 90,
        notes: "الزهور العفوية غير المرتبطة بمناسبة تترك أثراً عاطفياً مضاعفاً وجميلاً.",
        is_completed: false,
      },
      {
        user_id: userId,
        title: "جلسة قهوة صباحية وسماع حلقة بودكاست علاقات ومناقشة دروسها",
        category: "conversation" as const,
        budget_tier: "low" as const,
        estimated_cost: 60,
        notes: "الاستماع لحلقة ملهمة عن التفاهم والذكاء العاطفي ومناقشة كيف يمكن تطبيقها في حياتنا.",
        is_completed: false,
      },
    ];

    await supabase.from("relationship_ideas").delete().eq("user_id", userId);
    const { data: createdIdeas, error: ideasErr } = await supabase
      .from("relationship_ideas")
      .insert(ideasData)
      .select("id, title");

    if (ideasErr) console.error("Error seeding ideas:", ideasErr.message);
    else console.log(`✅ ${createdIdeas?.length || 0} Relationship Ideas seeded.`);

    // 2. Curated Wishlist & Gifts Registry (10+ high-quality items)
    const wishlistData = [
      {
        user_id: userId,
        title: "ساعة يد كلاسيكية أنيقة (جلد / ستانلس ستيل)",
        category: "gift" as const,
        estimated_price: 2400,
        url: "https://amazon.eg",
        priority: "high" as const,
        notes: "هدية تذكارية راقية للمناسبات الخاصة أو الخطوبة.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "ماكينة قهوة إسبريسو منزلية للمطبخ الجديد",
        category: "home" as const,
        estimated_price: 3800,
        url: "https://amazon.eg",
        priority: "high" as const,
        notes: "لتحضير القهوة واللاتيه الصباحي المشترك في شقة الزوجية.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "باقة عطرية فرنسية فاخرة (العطر المفضل)",
        category: "gift" as const,
        estimated_price: 1850,
        url: "https://amazon.eg",
        priority: "medium" as const,
        notes: "عطر مميز يدوم طويلاً لإهدائه في ذكرى مميزة.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "بروجكتور سينمائي محمول ذكي لغرفة المعيشة",
        category: "home" as const,
        estimated_price: 4200,
        url: "https://amazon.eg",
        priority: "medium" as const,
        notes: "لليالي السينما المنزلية والأفلام الوثائقية بدقة عالية.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "طقم مجات فخارية مصنوعة يدوياً باسمينا (Handmade Pottery)",
        category: "home" as const,
        estimated_price: 450,
        url: null,
        priority: "medium" as const,
        notes: "من جاليري روح بالمنصورة لتناول الشاي والقهوة اليومية.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "ألبوم صور جلدي مخصص لطباعة ذكريات الخطوبة وتجهيزات الزواج",
        category: "gift" as const,
        estimated_price: 550,
        url: null,
        priority: "high" as const,
        notes: "حفظ الصور المطبوعة والتواريخ المميزة في ألبوم عائلي فاخر.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "باقة ورد طبيعي وشوكولاتة بلجيكية فاخرة",
        category: "gift" as const,
        estimated_price: 700,
        url: null,
        priority: "medium" as const,
        notes: "مفاجأة رومانسية كلاسيكية مع كارت إهداء خاص.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "جلسة تصوير فوتوسيشن تذكارية خارجية على النيل",
        category: "experience" as const,
        estimated_price: 1200,
        url: null,
        priority: "medium" as const,
        notes: "توثيق لحظات الخطوبة والذكريات الجميلة بكاميرا احترافية في المنصورة.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "طقم شعلات شموع معطرة للمنزل بروائح اللافندر والفانيليا",
        category: "home" as const,
        estimated_price: 320,
        url: null,
        priority: "low" as const,
        notes: "لإضفاء جو من الاسترخاء والهدوء في الأمسيات المنزلية.",
        is_bought: false,
      },
      {
        user_id: userId,
        title: "كتاب / مفكرة يوميات الامتنان المشتركة للزوجين",
        category: "gift" as const,
        estimated_price: 250,
        url: null,
        priority: "low" as const,
        notes: "تدوين لحظات السعادة الأسبوعية والأشياء الممتنين لها معاً.",
        is_bought: false,
      },
    ];

    await supabase.from("relationship_wishlist").delete().eq("user_id", userId);
    const { data: createdWishlist, error: wishErr } = await supabase
      .from("relationship_wishlist")
      .insert(wishlistData)
      .select("id, title");

    if (wishErr) console.error("Error seeding wishlist:", wishErr.message);
    else console.log(`✅ ${createdWishlist?.length || 0} Wishlist Items seeded.`);
  }

  console.log("\n🎉 RELATIONSHIP ENGINE SEEDING COMPLETED SUCCESSFULLY!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
