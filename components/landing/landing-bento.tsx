"use client";

import { useLocale } from "@/components/providers/locale-provider";
import {
  Sun,
  Heart,
  Scale,
  TrendingUp,
  Layers,
} from "lucide-react";

export function LandingBento() {
  const { isRtl } = useLocale();

  return (
    <section id="features" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
            <Layers className="h-3.5 w-3.5" />
            <span>{isRtl ? "الهندسة الاستراتيجية للنظام" : "The Core Architecture"}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {isRtl ? "6 محركات صُممت لتلغي التردد وتصنع نتائج ملموسة" : "6 Strategic Engines Built for High-Output Humans"}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
            {isRtl
              ? "ليس مجرد تطبيق مهام عادي، بل نظام تشغيل متكامل يربط وقتك بأهدافك الكبرى وحساباتك المالية مباشرة."
              : "Not just another to-do list. A unified execution engine connecting time, cashflow, deals, and life milestones."}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Day Plan (Col-span 2) */}
          <div className="md:col-span-2 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs">
            <div className="flex flex-col h-full justify-between space-y-6 relative z-10">
              <div className="space-y-3">
                <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Sun className="h-6 w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {isRtl ? "غرفة القيادة اليومية وحماية العمل العميق (§Rule 1)" : "Daily Rhythm & Focus Guard (§Rule 1)"}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
                  {isRtl
                    ? "تخطيط يومي مبني على كتل التركيز ومستويات الطاقة (Energy Curve) مع طقس إغلاق اليوم (Shutdown Ritual) لتفادي الاحتراق النفسي وضمان إنجاز المهام الـ 3 الأهم كل يوم."
                    : "Calibrated daily execution matching energy levels with protected deep work blocks. Features an evening shutdown ritual to prevent burnout and guarantee execution on top-3 priorities."}
                </p>
              </div>

              {/* Visual Micro Widget */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-3 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400">Deep Work</span>
                  <div className="text-base font-black text-amber-600 dark:text-amber-400">4.5h Target</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400">Shutdown Time</span>
                  <div className="text-base font-black text-zinc-900 dark:text-zinc-100">10:00 PM</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400">Daily Focus</span>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">P1 Secured</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Marriage Mission (Col-span 1) */}
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs">
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="space-y-3">
                <div className="p-3 w-fit rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {isRtl ? "مهمة الزواج والـ 250 ألف (§Rule 6)" : "Marriage 250K Target (§Rule 6)"}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {isRtl
                    ? "تتبع مباشر لكل بنود الزواج، مع محاكي التوقعات بـ 3 سيناريوهات ونظام Reality Check Advisor لتحديد الفائض المطلوب شهرياً من الفريلانس."
                    : "Granular expense ledger paired with a 3-scenario Monte Carlo forecast curve and Reality Check advisor to calculate exact required freelance surplus."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <div className="flex justify-between items-center text-xs font-black text-rose-900 dark:text-rose-300">
                  <span>Progress Target</span>
                  <span>185K / 250K</span>
                </div>
                <div className="w-full bg-rose-200 dark:bg-rose-900/50 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-500 h-full w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Decision Desk (Col-span 1) */}
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs">
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="space-y-3">
                <div className="p-3 w-fit rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {isRtl ? "غرفة ميزان القرارات (§34)" : "Decision Desk & Reversibility (§34)"}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  {isRtl
                    ? "إلغاء التردد من خلال التمييز بين قرارات Type 1 (غير قابلة للتراجع) و Type 2 (قابلة للتراجع)، مع توثيق أسوأ سيناريو ومراجعة مسبقة."
                    : "Eliminate second-guessing. Distinguishes between Type 1 (irreversible) and Type 2 (reversible) decisions with explicit downside caps and review dates."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-[11px] font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
                <span>Decision Reversibility</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Type 2 • 2-Way Door
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Opportunity Prioritization (Col-span 2) */}
          <div className="md:col-span-2 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 backdrop-blur-sm relative overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs">
            <div className="flex flex-col h-full justify-between space-y-6">
              <div className="space-y-3">
                <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {isRtl ? "محرك ترتيب الفرص الرياضي (§50 Opportunity Engine)" : "Mathematical Opportunity Prioritization Engine (§50)"}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
                  {isRtl
                    ? "تقييم موضوعي لكافة العروض والمشاريع بالمعادلة الرياضية: (القيمة المتوقعة × الاحتمالية) ÷ الجهد بالساعات. استثمر طاقتك في أعلى عائد حقيقي لكل ساعة عمل."
                    : "Objective mathematical ranking: (Expected Value × Probability) / Effort Hours. Automatically identifies your highest return-on-time opportunities and prevents low-yield traps."}
                </p>
              </div>

              {/* Mathematical Formula Banner */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-700 dark:text-zinc-300">
                <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  Score = (EV × Prob) / Hours
                </div>
                <div className="text-[11px] text-zinc-500 font-sans">
                  Automated Top Opportunity Recommendation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
