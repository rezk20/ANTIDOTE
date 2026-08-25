"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Compass } from "lucide-react";

export function LandingManifesto() {
  const { isRtl } = useLocale();

  const rules = [
    {
      number: "01",
      title: isRtl ? "قاعدة حماية التركيز (1-3 Daily Focus)" : "Rule of 1-3 Focus",
      desc: isRtl
        ? "لا قوائم مهام لا نهائية تُشعرك بالعجز. ركز يومياً على 1 إلى 3 مهام حرجة تصنع 80% من النتيجة."
        : "No endless to-do lists that cause paralysis. Win every day by finishing 1 to 3 non-negotiable critical priorities.",
    },
    {
      number: "02",
      title: isRtl ? "التنفيذ غير العقابي (§41 Non-Punitive Execution)" : "Non-Punitive Coaching",
      desc: isRtl
        ? "تأجيل مهمة أو تعثر يوم لا يعني الفشل. النظام يعيد التوزيع بمرونة وذكاء بدون لوم أو جلد للذات."
        : "Missed a task or had low energy? The system re-allocates workload objectively without toxic guilt or pressure.",
    },
    {
      number: "03",
      title: isRtl ? "ميزان القرارات القابلة للتراجع (§34 Reversibility)" : "Reversible Speed",
      desc: isRtl
        ? "قرارات Type 2 سريعة وتتخذ في دقائق. القرارات المصيرية Type 1 فقط هي ما يستحق الدراسة والتحليل."
        : "Make Type 2 decisions in minutes. Save deep analytical energy exclusively for irreversible Type 1 crossroads.",
    },
    {
      number: "04",
      title: isRtl ? "الرياضيات تحكم الفرص (§50 Mathematical EV)" : "Mathematical ROI",
      desc: isRtl
        ? "لا تقبل مشاريع بالحدس أو العاطفة. احسب القيمة المتوقعة لكل ساعة عمل قبل أن تمنح وقتك لأي عميل."
        : "Never take on gigs based on gut feelings. Calculate expected return per hour before committing precious focus.",
    },
    {
      number: "05",
      title: isRtl ? "الالتقاط الفوري بدون تشويش (§Zero Friction)" : "Zero Cognitive Leakage",
      desc: isRtl
        ? "مفتاح واحد (B) لتفريغ أي فكرة طارئة في ثانية والعودة لتركيزك الحالي بدون تشتيت."
        : "Single hotkey (B) captures fleeting ideas instantly into inbox triage without breaking deep flow.",
    },
    {
      number: "06",
      title: isRtl ? "وضوح الأهداف المالية الكبرى (250K Target)" : "Milestone Certainty",
      desc: isRtl
        ? "هدف الزواج والحرية المالية ليس أمنية مبهمة، بل خطة مقسمة بالأرقام والتواريخ والفائض الشهري."
        : "The 250k marriage fund isn't vague hope. It is a mathematical timeline with exact monthly surplus targets.",
    },
  ];

  return (
    <section id="manifesto" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black">
            <Compass className="h-3.5 w-3.5" />
            <span>{isRtl ? "فلسفة النظام والقواعد الست" : "The Operating Manifesto"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {isRtl ? "مبني على مبادئ واقعية لا مجرد نصائح تحفيزية" : "Engineered on Reality, Not Toxic Motivation"}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
            {isRtl
              ? "كل شاشة وزر في ANTIDOTE مصممة وفق 6 قواعد استراتيجية لتحقيق أعلى عائد على طاقتك ووقتك."
              : "Every screen and action in ANTIDOTE is aligned with 6 core operational principles for high agency."}
          </p>
        </div>

        {/* 6 Rules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-xs"
            >
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {rule.number}
              </div>
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                {rule.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
