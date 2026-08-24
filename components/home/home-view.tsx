"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Target, CheckSquare, Wallet, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ProfileRow } from "@/lib/supabase/types";

export function HomeView({
  profile,
  summary,
}: {
  profile: ProfileRow | null;
  summary: {
    goalsCount: number;
    tasksCount: number;
    bucketsCount: number;
    projectsCount: number;
    marriageBucketStartingBalance: number;
  };
}) {
  const { t, isRtl } = useLocale();
  const ownerName = profile?.display_name ?? "Ahmed";

  return (
    <div className="space-y-8">
      {/* Hero Command Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.common.ready}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {isRtl ? `أهلاً بك يا ${ownerName} 👋` : `Welcome back, ${ownerName} 👋`}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {isRtl
                ? "غرفة القيادة المركزية: إدارة المهام ذات العائد المباشر (Revenue)، شجرة الأهداف، ومتابعة الاستعداد المالي للزواج."
                : "Central execution command: Manage high-ROI revenue tasks, transformation goals, and marriage readiness."}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-center p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80 min-w-[200px]">
            <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
              {isRtl ? "المستهدف الأساسي" : "Mission Focus"}
            </span>
            <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              250,000 {profile?.currency ?? "EGP"} / 12 mo
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              {isRtl ? "جاهزية الزواج والحرية المالية" : "Marriage Readiness"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals Card */}
        <Link
          href="/goals"
          className="group bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
              Vision → Week
            </span>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-4">
            {summary.goalsCount}
          </p>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
            {isRtl ? "أهداف نشطة في الشجرة" : "Active Goals"}
          </p>
        </Link>

        {/* Tasks Card */}
        <Link
          href="/tasks"
          className="group bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
              Top Priorities
            </span>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-4">
            {summary.tasksCount}
          </p>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
            {isRtl ? "مهام أسبوعية دورية" : "Action Items"}
          </p>
        </Link>

        {/* Buckets Card */}
        <Link
          href="/finances"
          className="group bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              Wallets
            </span>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-4">
            {summary.bucketsCount}
          </p>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
            {isRtl ? "محافظ ادخار وميزانية" : "Savings Buckets"}
          </p>
        </Link>

        {/* Projects Card */}
        <Link
          href="/projects"
          className="group bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
              Pipelines
            </span>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mt-4">
            {summary.projectsCount}
          </p>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
            {isRtl ? "مشاريع نشطة" : "Active Projects"}
          </p>
        </Link>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/tasks"
          className="flex items-center justify-between p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.tasks.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRtl ? "إدارة الأولويات وحساب الدرجات الآلي وتحديد الـ Top 3" : "Multi-factor priority ranking & Top 3 daily execution"}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 rtl:rotate-180 shrink-0" />
        </Link>

        <Link
          href="/goals"
          className="flex items-center justify-between p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.goals.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRtl ? "شجرة الأهداف من الرؤية إلى المهام الأسبوعية" : "Vision to quarterly milestones hierarchy tree"}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 rtl:rotate-180 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
