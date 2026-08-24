"use client";

import { useLocale } from "@/components/providers/locale-provider";
import {
  Target,
  CheckSquare,
  Wallet,
  FolderKanban,
  ArrowRight,
} from "lucide-react";
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
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {t.common.ready}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {isRtl
                ? `أهلاً بك يا ${ownerName} 👋`
                : `Welcome back, ${ownerName} 👋`}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {isRtl
                ? "غرفة القيادة المركزية: إدارة المهام ذات العائد المباشر (Revenue)، شجرة الأهداف، ومتابعة الاستعداد المالي للزواج."
                : "Central execution command: Manage high-ROI revenue tasks, transformation goals, and marriage readiness."}
            </p>
          </div>

          <div className="flex min-w-[200px] flex-col items-start justify-center rounded-2xl border border-zinc-100 bg-zinc-50 p-4 sm:items-end sm:p-5 dark:border-zinc-800/80 dark:bg-zinc-800/50">
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {isRtl ? "المستهدف الأساسي" : "Mission Focus"}
            </span>
            <span
              className="mt-1 text-base font-extrabold text-zinc-900 dark:text-zinc-100"
              dir="ltr"
            >
              250,000 {profile?.currency ?? "EGP"} / 12 mo
            </span>
            <span className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {isRtl ? "جاهزية الزواج والحرية المالية" : "Marriage Readiness"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Goals Card */}
        <Link
          href="/goals"
          className="group cursor-pointer rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Target className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              Vision → Week
            </span>
          </div>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {summary.goalsCount}
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {isRtl ? "أهداف نشطة في الشجرة" : "Active Goals"}
          </p>
        </Link>

        {/* Tasks Card */}
        <Link
          href="/tasks"
          className="group cursor-pointer rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Top Priorities
            </span>
          </div>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {summary.tasksCount}
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {isRtl ? "مهام أسبوعية دورية" : "Action Items"}
          </p>
        </Link>

        {/* Buckets Card */}
        <Link
          href="/finances"
          className="group cursor-pointer rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Wallets
            </span>
          </div>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {summary.bucketsCount}
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {isRtl ? "محافظ ادخار وميزانية" : "Savings Buckets"}
          </p>
        </Link>

        {/* Projects Card */}
        <Link
          href="/projects"
          className="group cursor-pointer rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <FolderKanban className="h-5 w-5" />
            </div>
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              Pipelines
            </span>
          </div>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {summary.projectsCount}
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {isRtl ? "مشاريع نشطة" : "Active Projects"}
          </p>
        </Link>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/tasks"
          className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.tasks.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRtl
                ? "إدارة الأولويات وحساب الدرجات الآلي وتحديد الـ Top 3"
                : "Multi-factor priority ranking & Top 3 daily execution"}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 rtl:rotate-180" />
        </Link>

        <Link
          href="/goals"
          className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {t.goals.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRtl
                ? "شجرة الأهداف من الرؤية إلى المهام الأسبوعية"
                : "Vision to quarterly milestones hierarchy tree"}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-zinc-400 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
