"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Heart,
  TrendingUp,
  Bot,
  Sun,
} from "lucide-react";

export function LandingHero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { isRtl } = useLocale();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
        {/* Release Tag */}
        <div className="animate-in fade-in slide-in-from-top-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-1.5 shadow-xs backdrop-blur-md duration-500 dark:border-zinc-800 dark:bg-zinc-900/80">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-300">
            {isRtl
              ? "ANTIDOTE v2.0 • نظام التشغيل الشخصي لأصحاب الطموح العالي"
              : "ANTIDOTE v2.0 • Personal OS for High-Agency Humans"}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
            {isRtl ? "محمي بالكامل بـ RLS" : "100% RLS Protected"}
          </span>
        </div>

        {/* Main Headline */}
        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="text-4xl leading-[1.15] font-black tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-zinc-100">
            {isRtl ? (
              <>
                نظام القيادة الشخصي لمن{" "}
                <span className="bg-purple-600 bg-clip-text text-transparent dark:bg-purple-400 dark:from-indigo-400 dark:to-amber-400">
                  لا يرضون بالفوضى
                </span>
              </>
            ) : (
              <>
                The Executive Operating System for{" "}
                <span className="bg-purple-600 bg-clip-text text-transparent dark:bg-purple-400 dark:from-indigo-400 dark:to-amber-400">
                  Relentless Execution
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-zinc-600 sm:text-lg dark:text-zinc-400">
            {isRtl
              ? "ادمج خطة يومك، مسار الفريلانس والأرباح، خطة الزواج ، ميزان القرارات الاستراتيجية، ووكيل الذكاء الاصطناعي في عقل رقمي واحد متماسك وخالي من التشتت."
              : "Unify your daily rhythm, freelance revenue pipeline, marriage mission, decision desk, and autonomous AI agents in one cohesive, distraction-free command center."}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3.5 pt-2 sm:flex-row">
          <Link
            href={isAuthenticated ? "/home" : "/login"}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-zinc-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-indigo-500/10"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>
              {isAuthenticated
                ? isRtl
                  ? "فتح لوحة التحكم"
                  : "Open Dashboard"
                : isRtl
                  ? "ابدأ الآن مجاناً"
                  : "Get Started Free"}
            </span>
            <ArrowIcon className="h-4 w-4" />
          </Link>

          <a
            href="#features"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-zinc-800 shadow-xs transition-all hover:bg-zinc-100 sm:w-auto dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Zap className="h-4 w-4 text-indigo-500" />
            <span>
              {isRtl ? "استكشف محركات النظام الـ 6" : "Explore The 6 Engines"}
            </span>
          </a>
        </div>

        {/* Live Command Center Preview Board */}
        <div className="mx-auto max-w-5xl pt-10">
          <div className="relative rounded-3xl border border-zinc-200/80 bg-zinc-100/50 p-3 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl sm:p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            {/* Window Mockup Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-3 pb-3 text-[11px] font-bold text-zinc-400 dark:border-zinc-800/80">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
                <span>antidote.life/today</span>
                <span className="text-emerald-500">● LIVE</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>Encrypted</span>
              </div>
            </div>

            {/* Inner Dashboard Preview Grid */}
            <div className="grid grid-cols-1 gap-3 pt-3 text-left sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Today Plan */}
              <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">
                    {isRtl ? "خطة اليوم" : "Daily Rhythm"}
                  </span>
                  <Sun className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  4.5h{" "}
                  <span className="text-xs font-bold text-zinc-400">
                    Deep Work
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-3/4 rounded-full bg-amber-500" />
                </div>
                <p className="truncate text-[11px] font-medium text-zinc-500">
                  3 Focus Blocks • Shutdown 10:00 PM
                </p>
              </div>

              {/* Card 2: Marriage Fund */}
              <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">
                    {isRtl ? "مستهدف الزواج" : "Marriage 250K"}
                  </span>
                  <Heart className="h-4 w-4 text-rose-500" />
                </div>
                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  185,000{" "}
                  <span className="text-xs font-bold text-zinc-400">EGP</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-[74%] rounded-full bg-rose-500" />
                </div>
                <p className="truncate text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  74% Complete • Target on track
                </p>
              </div>

              {/* Card 3: Freelance Revenue */}
              <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">
                    {isRtl ? "خط الفريلانس" : "Pipeline Funnel"}
                  </span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                  48,000{" "}
                  <span className="text-xs font-bold text-zinc-400">EGP</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-[85%] rounded-full bg-emerald-500" />
                </div>
                <p className="truncate text-[11px] font-medium text-zinc-500">
                  5 Active Deals • 350 EGP/hr Realized
                </p>
              </div>

              {/* Card 4: Hermes AI Agent */}
              <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">
                    {isRtl ? "الوكيل الذكي" : "Hermes Bridge"}
                  </span>
                  <Bot className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex items-center gap-1.5 text-xl font-black text-indigo-600 dark:text-indigo-400">
                  <span>Connected</span>
                  <span className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full w-full rounded-full bg-indigo-500" />
                </div>
                <p className="truncate text-[11px] font-medium text-zinc-500">
                  Protected Bearer API • 8 Actions Ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
