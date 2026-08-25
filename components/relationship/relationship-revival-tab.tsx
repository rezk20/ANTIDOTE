"use client";

import { useState } from "react";
import {
  Flame,
  MessageSquareHeart,
  ShieldCheck,
  Zap,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  HeartHandshake,
  Lightbulb,
  AlertCircle,
  Smile,
  RotateCcw,
} from "lucide-react";

interface RevivalGuideProps {
  initialCompletedDays?: number[];
}

export function RelationshipRevivalTab({ initialCompletedDays = [] }: RevivalGuideProps) {
  const [activeSection, setActiveSection] = useState<
    "all" | "boredom" | "communication" | "challenge" | "safety"
  >("all");

  const [completedDays, setCompletedDays] = useState<number[]>(initialCompletedDays);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Ready WhatsApp / SMS quick love & appreciation messages
  const instantLoveMessages = [
    "حبيبي، حبيت أفكرك في نص اليوم إن وجودك في حياتي نعمة كبيرة وفخور بيكي وبكل خطوة بتعمليها ❤️",
    "عارف إن الفترة دي فيها ضغط وزحمة، بس إنت دايماً في بالي ونفسي في أقرب وقت نقعد قعدة رايقة سوا نهدي فيها بالنا ☕",
    "شكراً على صبرك ووقفتك معايا دايماً.. تعبك مقدّر وعينيا مش شايفة غيرك دايماً يا ست البنات 🌸",
    "وحشني كلامنا الرايق وضحكتك اللي بتنسيني هم اليوم.. ربنا يباركلي فيكي ويجمعنا على خير يا رب ✨",
    "بحبك وبشتاق لك، وعاوزك تطمني دايماً إننا فريق واحد مهما كانت الظروف والضغوطات ❤️",
  ];

  const [generatedMessage, setGeneratedMessage] = useState(instantLoveMessages[0]);

  const handleRollMessage = () => {
    const nextMsg = instantLoveMessages[Math.floor(Math.random() * instantLoveMessages.length)];
    setGeneratedMessage(nextMsg);
    setCopiedMessage(false);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleCopyScript = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  const toggleDay = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const boredomKillers = [
    {
      title: "قاعدة الـ 6 ثواني (العناق والترحيب الدافئ)",
      tag: "طقس يومي",
      duration: "1 دقيقة",
      action:
        "عند اللقاء أو العودة من العمل، توقف عن أي انشغال واحتضن شريكك لمدة 6 ثوانٍ متواصلة مع ابتسامة حقيقية. علم النفس يثبت أن هذه الثواني تفرز هرمون الأوكسيتوسين (هرمون الترابط والأمان الفوري).",
    },
    {
      title: "بروتوكول تصفير الشاشات (Digital Detox Hour)",
      tag: "إزالة المشتتات",
      duration: "45 دقيقة",
      action:
        "وضع الهواتف في غرفة أخرى قبل النوم بـ 45 دقيقة، وإشعال إضاءة خافتة والتحدث في مواضيع يومية أو طريفة دون أي شاشات تسرق انتباه العيون والقلوب.",
    },
    {
      title: "كسر روتين الأماكن المعتادة (Novelty Trigger)",
      tag: "تجديد الخروج",
      duration: "ساعتان",
      action:
        "إذا كنتم معتادين على نفس الكافيه أو نفس الخروجة، اختارا مكاناً أو نشاطاً لم تجرباه من قبل (ورشة فخار بجاليري روح، ممشى النيل الجديد، فطور باكر يوم الجمعة). المخ يفرز الدوبامين مع كل تجربة غير معتادة.",
    },
    {
      title: "مفاجأة الرسالة الورقية العفوية في مكان غير متوقع",
      tag: "لفتة غير متوقعة",
      duration: "5 دقائق",
      action:
        "كتابة سطر واحد دافئ بخط اليد ('يومي بيبدأ بجد لما بسمع صوتك' أو 'فخور بيكي وبمجهودك') ووضعها في حقيبتها أو كتابها أو جيب ملابسها لتجدها فجأة.",
    },
    {
      title: "لعبة الأسئلة غير التقليدية (Unusual Q&A)",
      tag: "حوار ممتع",
      duration: "20 دقيقة",
      action:
        "الابتعاد عن أسئلة 'عملت إيه في الشغل؟' واستبدالها بأسئلة شيقة مثل: 'لو نقدر نسافر بكرة لأي مكان في العالم مجاناً هتختاري إيه؟' أو 'إيه أكتر موقف مضحك فاكراه من طفولتك؟'.",
    },
  ];

  const communicationScripts = [
    {
      scenario: "عندما تكون متوتراً أو مجهداً من ضغط العمل والمهام",
      wrongWay: "مش طايق أكلم حد وسيبيني في حالي دلوقتي!",
      rightWay:
        "حبيبي، أنا مجهد جداً من ضغط الشغل وراسي مشوش، محتاج نص ساعة بس أهدى وأفصل، وبعدها هكون معاكي بكامل تركيزي لأني بحب وقتنا ومش عاوز أطلع توتري عليكي.",
      insight:
        "إخبار الشريك بالسبب والمدة يمنحه الأمان ويمنعه من تفسير ابتعادك على أنه برود أو تجاهل تجاهه.",
    },
    {
      scenario: "عند الشعور بالتقصير أو قلة الاهتمام والمحادثات",
      wrongWay: "إنت علطول ناسي ومبقاش فارق معاك زي زمان ومهملني!",
      rightWay:
        "أنا بحس بوحشة كبيرة ليك الفترة دي وبشتاق لأوقاتنا الرايقة.. نفسي نخصص ربع ساعة كل يوم نتكلم فيها بهدوء ونقرب من بعض أكتر.",
      insight:
        "استبدال صيغة الهجوم واللوم (إنت مقصر) بصيغة التعبير عن الاحتياج الإنساني (أنا مشتاق لقربك) يزيل الدفاعية ويحفز العطاء.",
    },
    {
      scenario: "عند وقوع خلاف أو سوء تفاهم حاد",
      wrongWay: "إنتِ اللي فهمتي غلط وعاملة مشكلة من لا شيء!",
      rightWay:
        "أنا مش عاوز نزعل من بعض أبداً، إحنا فريق واحد مش خصمين.. احكيلي إنتِ حسيتي بإيه وفهمتي الموقف إزاي عشان أقدر أفهم وأصلح اللي ضايقك.",
      insight:
        "تذكير النفس والشريك بأنكم في نفس الفريق ضد المشكلة يذيب روح العناد والرغبة في كسب الجدال.",
    },
    {
      scenario: "عند الرغبة في الاعتذار وتصحيح موقف خاطئ",
      wrongWay: "خلاص أنا آسف، هنفضل نتكلم في الموضوع كتير؟",
      rightWay:
        "أنا بعتذر بصدق عن طريقتي وعن الكلمة اللي ضايقتك.. زعلِك غالي عليا وأنا بتعلم من الموقف ده ومش هكرر الطريقة دي تاني.",
      insight:
        "الاعتذار الحقيقي يتضمن الاعتراف بالخطأ، تقدير مشاعر الطرف الآخر، والوعد بعدم التكرار دون تقديم مبررات واهية.",
    },
    {
      scenario: "عبارات التقدير اليومي وبنك المشاعر الإيجابية",
      wrongWay: "الصمت وافتراض أن الشريك يعرف أنك تحبه بدون كلام صريح.",
      rightWay:
        "شكراً من قلبي على وقفتك معايا.. وجودك بيهوّن عليا كتير وبحس بالأمان والراحة معاك.",
      insight:
        "كل كلمة تقدير صريحة تضع رصيداً في بنك العاطفة يحمي العلاقة عند حدوث الأزمات والتوترات.",
    },
  ];

  const sevenDayChallenge = [
    {
      day: 1,
      title: "رسالة الامتنان المفاجئة",
      description:
        "أرسل في منتصف اليوم رسالة نصية قصيرة تعبر فيها عن شيء واحد محدد تقدره فيه وتشعر بالامتنان لوجوده في حياتك.",
    },
    {
      day: 2,
      title: "جلسة الاستماع النقي بدون نصائح",
      description:
        "استمع لشريكك لمدة 15 دقيقة كاملة وهو يحكي عن يومه أو مشاعره دون أن تقاطعه أو تقدم حلولاً برمجية، فقط تعاطف وكن حاضراً.",
    },
    {
      day: 3,
      title: "مفاجأة المشروب أو الحلوى المفضلة",
      description:
        "أحضر أو اطلب له المشروب الساخن أو الحلوى التي يحبها دون مناسبة خاصة مع ابتسامة وسؤال عن حاله.",
    },
    {
      day: 4,
      title: "استرجاع شرارة البدايات",
      description:
        "تذكرا معاً أول لقاء أو أول موقف مميز جمعكما، واحكيا كيف كانت مشاعر البدايات والضحكات الأولى.",
    },
    {
      day: 5,
      title: "عناق الـ 60 ثانية والأمان العاطفي",
      description:
        "عناق هادئ ومريح والتلفظ بعبارة تؤكد له الأمان والالتزام: 'أنا هنا جمبك ومش هسيبك مهما كانت الضغوط'.",
    },
    {
      day: 6,
      title: "خروجة تمشية هادئة بدون وجهة محددة",
      description:
        "تمشية على كورنيش النيل أو في حي هادئ بالمنصورة وتبادل الأحاديث الخفيفة وتناول ذرة مشوي أو آيس كريم.",
    },
    {
      day: 7,
      title: "جلسة الرؤية وتخطيط المستقبل بروقان",
      description:
        "الجلوس معاً والحديث عن أمنياتكم للأشهر القادمة (ألوان شقة الزوجية، رحلات ما بعد الزواج، وأهدافكم المشتركة).",
    },
  ];

  const safetyRules = [
    {
      rule: "التوقف التام عن النقد والتعميم (Stop Criticism)",
      detail:
        "تجنب كلمات 'إنت دايماً' أو 'إنتِ عمرك ما'، وبدلاً من نقد شخصية الشريك، عبر عن احتياجك في الموقف الحالي بلطف.",
    },
    {
      rule: "منع الصمت العقابي والانسحاب الجاف (No Stonewalling)",
      detail:
        "إذا كنت في قمة الغضب، لا تغلق الهاتف أو تتجاهل الشريك فجأة. قل بوضوح: 'محتاج 20 دقيقة أهدى وهنرجع نكمل كلامنا' والتزم بالعودة.",
    },
    {
      rule: "تحمل مسؤولية الـ 1% من الخطأ (Take Responsibility)",
      detail:
        "في كل خلاف، ابحث عن الجزء الذي قصرت فيه واعترف به أولاً، فهذا يكسر كبرياء الطرف الآخر ويشجعه على الاعتذار بالمثل.",
    },
    {
      rule: "حفظ كرامة الشريك في كل الأحوال (Respect & Dignity)",
      detail:
        "الاحترام هو الخط الأحمر الذي لا يجب تجاوزه أبداً؛ فلا سخرية، ولا شتائم، ولا مقارنة بأي شخص آخر حتى وقت الغضب.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/10 border border-rose-200 dark:border-rose-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
              <Flame className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              بوصلة تجديد الشغف وتطوير العلاقة وكسر الملل
            </h2>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            دليل عملي ونفسي مبني على قواعد علم نفس العلاقات (Gottman Method) لاستعادة الدفء، إتقان فن الكلام والاحتواء، وكسر الروتين فوراً.
          </p>
        </div>

        {/* Challenge Progress Badge */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-800 flex items-center gap-3 shrink-0 shadow-xs">
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-400 block">تحدي الـ 7 أيام</span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400">
              {completedDays.length} / 7 أيام منجزة
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center font-mono font-black text-xs text-rose-600">
            {Math.round((completedDays.length / 7) * 100)}%
          </div>
        </div>
      </div>

      {/* 2. Instant Love & Appreciation Message Generator */}
      <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              مولد رسائل التقدير والاحتواء السريع (جاهزة للإرسال على واتساب)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleRollMessage}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>رسالة أخرى</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed">
            &ldquo;{generatedMessage}&rdquo;
          </p>

          <button
            type="button"
            onClick={() => handleCopyMessage(generatedMessage)}
            className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copiedMessage ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedMessage ? "تم النسخ بنجاح!" : "نسخ الرسالة"}</span>
          </button>
        </div>
      </div>

      {/* 3. Section Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveSection("all")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeSection === "all"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
          }`}
        >
          كافة الأقسام
        </button>
        <button
          onClick={() => setActiveSection("boredom")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "boredom"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>بروتوكولات كسر الملل ({boredomKillers.length})</span>
        </button>
        <button
          onClick={() => setActiveSection("communication")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "communication"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
          }`}
        >
          <MessageSquareHeart className="h-3.5 w-3.5" />
          <span>قاموس فن الكلام والاحتواء ({communicationScripts.length})</span>
        </button>
        <button
          onClick={() => setActiveSection("challenge")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "challenge"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>تحدي الـ 7 أيام لتجديد الدفء</span>
        </button>
        <button
          onClick={() => setActiveSection("safety")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === "safety"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>قواعد الأمان النفسي ({safetyRules.length})</span>
        </button>
      </div>

      {/* 4. Section: Boredom Killers */}
      {(activeSection === "all" || activeSection === "boredom") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              بروتوكولات كسر الملل والروتين الفورية (Immediate Boredom Killers)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boredomKillers.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.duration}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Section: Communication Scripts (What to say / What not to say) */}
      {(activeSection === "all" || activeSection === "communication") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              قاموس فن الكلام وطريقة التعبير والاحتواء (Communication Scripts)
            </h3>
          </div>

          <div className="space-y-4">
            {communicationScripts.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                  <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-[10px] font-mono font-black">
                      {idx + 1}
                    </span>
                    <span>الموقف: {item.scenario}</span>
                  </h4>

                  <button
                    type="button"
                    onClick={() => handleCopyScript(item.rightWay, idx)}
                    className="text-[11px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedScriptIndex === idx ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedScriptIndex === idx ? "تم نسخ الجملة" : "نسخ البديل الصحيح"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Wrong Way */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-[10px]">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>❌ ما لا يجب قوله (الهجوم أو اللوم المباشر)</span>
                    </div>
                    <p className="text-xs text-rose-900 dark:text-rose-200 font-medium leading-relaxed">
                      &ldquo;{item.wrongWay}&rdquo;
                    </p>
                  </div>

                  {/* Right Way */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                      <Smile className="h-3.5 w-3.5 shrink-0" />
                      <span>✅ البديل الذكي الذي يحتوي الموقف ويزيل الدفاعية</span>
                    </div>
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 font-bold leading-relaxed">
                      &ldquo;{item.rightWay}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Insight */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-900 dark:text-zinc-200">السر النفسي: </strong>
                    {item.insight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Section: 7-Day Spark Challenge */}
      {(activeSection === "all" || activeSection === "challenge") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-purple-500" />
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                تحدي الـ 7 أيام لتجديد الدفء والشغف (7-Day Relationship Spark Challenge)
              </h3>
            </div>

            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              خطوة واحدة يومياً كافية لإحداث فارق هائل
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {sevenDayChallenge.map((task) => {
              const isDone = completedDays.includes(task.day);
              return (
                <div
                  key={task.day}
                  onClick={() => toggleDay(task.day)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2.5 flex flex-col justify-between shadow-xs ${
                    isDone
                      ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-purple-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                          isDone
                            ? "bg-purple-600 text-white"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        اليوم {task.day}
                      </span>

                      <button
                        type="button"
                        className="text-zinc-400 hover:text-purple-600 transition-colors"
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-purple-600 fill-purple-100 dark:fill-purple-950" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <h4
                      className={`text-xs font-bold leading-snug ${
                        isDone
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {task.title}
                    </h4>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 text-end">
                    {isDone ? "تم إنجاز المهمة بنجاح ✨" : "اضغط للتعليم كمنجز"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Section: Emotional Safety Golden Rules */}
      {(activeSection === "all" || activeSection === "safety") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              قواعد الأمان العاطفي وبناء الثقة الدائمة (Emotional Safety Rules)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyRules.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {item.rule}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed pr-7">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
