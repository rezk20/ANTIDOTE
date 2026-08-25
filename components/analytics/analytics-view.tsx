"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import type { AnalyticsSummaryData } from "@/lib/dal/analytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle2,
  Percent,
  Layers,
  Flame,
  AlertCircle,
} from "lucide-react";

interface AnalyticsViewProps {
  data: AnalyticsSummaryData;
}

export function AnalyticsView({ data }: AnalyticsViewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<
    "forecast" | "funnel" | "profitability" | "allocation" | "productivity"
  >("forecast");

  const {
    forecast,
    profitability,
    careerFunnel,
    allocation,
    deepWorkHoursTotal,
    habitConsistencyScore,
    relationshipCheckinsCount,
  } = data;

  // Forecast chart data: 12 months projection
  const forecastChartData = Array.from({ length: 13 }).map((_, i) => {
    const monthLabel = `M+${i}`;
    return {
      month: monthLabel,
      conservative: Math.round(
        forecast.currentSavings + forecast.conservative.monthlySavingsPace * i,
      ),
      base: Math.round(
        forecast.currentSavings + forecast.base.monthlySavingsPace * i,
      ),
      aggressive: Math.round(
        forecast.currentSavings + forecast.aggressive.monthlySavingsPace * i,
      ),
      target: forecast.targetGoal,
    };
  });

  // Funnel chart data
  const funnelStepsData = [
    {
      name: "فرص مكتشفة",
      count: careerFunnel.totalLeadsDiscovered,
      fill: "#6366f1",
    },
    { name: "عروض مرسلة", count: careerFunnel.proposalsSent, fill: "#3b82f6" },
    { name: "مكالمات", count: careerFunnel.callsConducted, fill: "#06b6d4" },
    { name: "صفقات مكسوبة", count: careerFunnel.dealsWon, fill: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                {t.analyticsPage.title}
              </h1>
              <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                {t.analyticsPage.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Current Savings towards Target */}
        <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>المدخرات الحالية</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
            {forecast.currentSavings.toLocaleString()}{" "}
            <span className="text-xs font-bold text-zinc-400">ج.م</span>
          </div>
          <div className="text-[11px] font-semibold text-zinc-500">
            الهدف: {forecast.targetGoal.toLocaleString()} ج.م (
            {Math.round((forecast.currentSavings / forecast.targetGoal) * 100)}
            %)
          </div>
        </div>

        {/* Deep Work Hours */}
        <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>{t.analyticsPage.kpi.deepWorkHours}</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
            {deepWorkHoursTotal}{" "}
            <span className="text-xs font-bold text-zinc-400">ساعة</span>
          </div>
          <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            تركيز وإنتاجية مسجلة
          </div>
        </div>

        {/* Won Pipeline Revenue */}
        <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>{t.analyticsPage.kpi.pipelineRevenue}</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
            {careerFunnel.totalPipelineRevenue.toLocaleString()}{" "}
            <span className="text-xs font-bold text-zinc-400">ج.م</span>
          </div>
          <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            {careerFunnel.dealsWon} صفقات مكسوبة
          </div>
        </div>

        {/* Overall Win Rate */}
        <div className="space-y-2 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>{t.analyticsPage.kpi.winRate}</span>
            <Percent className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-zinc-900 sm:text-2xl dark:text-zinc-100">
            {careerFunnel.overallCloseRatePercent}%
          </div>
          <div className="text-[11px] font-semibold text-zinc-500">
            متوسط الإغلاق: {careerFunnel.averageDaysToClose} أيام
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-zinc-100 p-1.5 dark:bg-zinc-900">
        <button
          onClick={() => setActiveTab("forecast")}
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "forecast"
              ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{t.analyticsPage.tabs.forecast}</span>
        </button>

        <button
          onClick={() => setActiveTab("funnel")}
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "funnel"
              ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{t.analyticsPage.tabs.funnel}</span>
        </button>

        <button
          onClick={() => setActiveTab("profitability")}
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "profitability"
              ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>{t.analyticsPage.tabs.profitability}</span>
        </button>

        <button
          onClick={() => setActiveTab("allocation")}
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "allocation"
              ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{t.analyticsPage.tabs.allocation}</span>
        </button>

        <button
          onClick={() => setActiveTab("productivity")}
          className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "productivity"
              ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>{t.analyticsPage.tabs.productivity}</span>
        </button>
      </div>

      {/* Tab 1: 3-Scenario Forecast (§7, D-10) */}
      {activeTab === "forecast" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          {/* Reality Check Warning Banner (§Rule 6) */}
          {forecast.realityCheckWarning && (
            <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
                  {t.analyticsPage.forecast.realityCheckTitle}
                </h4>
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  {forecast.realityCheckWarning}
                </p>
              </div>
            </div>
          )}

          {/* 3 Scenario Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Conservative */}
            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-black text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {t.analyticsPage.forecast.conservative}
              </span>
              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-zinc-500">
                  وتيرة الادخار الشهرية
                </div>
                <div className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {forecast.conservative.monthlySavingsPace.toLocaleString()}{" "}
                  ج.م
                </div>
              </div>
              <div className="space-y-1 border-t border-zinc-100 pt-2 text-xs dark:border-zinc-800/80">
                <div className="flex justify-between text-zinc-500">
                  <span>المدة للوصول:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {forecast.conservative.monthsToGoal} شهراً
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>الشهر المتوقع:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {forecast.conservative.projectedReachDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Base Case */}
            <div className="space-y-3 rounded-3xl border border-blue-200 bg-blue-50/40 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
              <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-black text-white">
                {t.analyticsPage.forecast.base}
              </span>
              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  وتيرة الادخار الشهرية
                </div>
                <div className="text-lg font-black text-blue-950 dark:text-blue-100">
                  {forecast.base.monthlySavingsPace.toLocaleString()} ج.م
                </div>
              </div>
              <div className="space-y-1 border-t border-blue-100 pt-2 text-xs dark:border-blue-900/40">
                <div className="flex justify-between text-blue-700 dark:text-blue-300">
                  <span>المدة للوصول:</span>
                  <span className="font-bold">
                    {forecast.base.monthsToGoal} شهراً
                  </span>
                </div>
                <div className="flex justify-between text-blue-700 dark:text-blue-300">
                  <span>الشهر المتوقع:</span>
                  <span className="font-bold">
                    {forecast.base.projectedReachDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Aggressive */}
            <div className="space-y-3 rounded-3xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-white">
                {t.analyticsPage.forecast.aggressive}
              </span>
              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  وتيرة الادخار الشهرية
                </div>
                <div className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                  {forecast.aggressive.monthlySavingsPace.toLocaleString()} ج.م
                </div>
              </div>
              <div className="space-y-1 border-t border-emerald-100 pt-2 text-xs dark:border-emerald-900/40">
                <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
                  <span>المدة للوصول:</span>
                  <span className="font-bold">
                    {forecast.aggressive.monthsToGoal} شهراً
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
                  <span>الشهر المتوقع:</span>
                  <span className="font-bold">
                    {forecast.aggressive.projectedReachDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Area Chart */}
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                منحنى تراكم المدخرات على مدار 12 شهراً
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                مقارنة السيناريوهات الثلاثة صعوداً نحو هدف الـ 250,000 ج.م
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartData}>
                  <defs>
                    <linearGradient
                      id="colorAggressive"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorConservative"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    opacity={0.5}
                  />
                  <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} />
                  <YAxis stroke="#a1a1aa" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#27272a",
                      borderRadius: "1rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aggressive"
                    name="المتفائل"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAggressive)"
                  />
                  <Area
                    type="monotone"
                    dataKey="base"
                    name="الأساسي"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBase)"
                  />
                  <Area
                    type="monotone"
                    dataKey="conservative"
                    name="المتحفظ"
                    stroke="#71717a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConservative)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Freelance Activity Funnel (§4) */}
      {activeTab === "funnel" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.analyticsPage.funnel.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.analyticsPage.funnel.subtitle}
              </p>
            </div>

            {/* Funnel Conversion Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800/60 dark:bg-zinc-800/40">
                <div className="text-[11px] font-bold text-zinc-400">
                  {t.analyticsPage.funnel.replyRate}
                </div>
                <div className="mt-1 text-xl font-black text-blue-600 dark:text-blue-400">
                  {careerFunnel.replyRatePercent}%
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800/60 dark:bg-zinc-800/40">
                <div className="text-[11px] font-bold text-zinc-400">
                  {t.analyticsPage.funnel.callRate}
                </div>
                <div className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {careerFunnel.callToWonRatePercent}%
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800/60 dark:bg-zinc-800/40">
                <div className="text-[11px] font-bold text-zinc-400">
                  {t.analyticsPage.funnel.closeRate}
                </div>
                <div className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {careerFunnel.overallCloseRatePercent}%
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-zinc-800/60 dark:bg-zinc-800/40">
                <div className="text-[11px] font-bold text-zinc-400">
                  {t.analyticsPage.funnel.avgDays}
                </div>
                <div className="mt-1 text-xl font-black text-zinc-900 dark:text-zinc-100">
                  {careerFunnel.averageDaysToClose} يوم
                </div>
              </div>
            </div>

            {/* Funnel Bar Chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelStepsData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    opacity={0.5}
                  />
                  <XAxis type="number" stroke="#a1a1aa" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#a1a1aa"
                    fontSize={11}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#27272a",
                      borderRadius: "1rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="العدد" radius={[0, 8, 8, 0]}>
                    {funnelStepsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Project Profitability (§47) */}
      {activeTab === "profitability" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.analyticsPage.profitability.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.analyticsPage.profitability.subtitle}
              </p>
            </div>

            {profitability.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-400">
                لا توجد مشاريع مسجلة لحساب العائد بالساعة.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 dark:border-zinc-800">
                      <th className="pb-3 text-start font-bold">
                        {t.analyticsPage.profitability.projectName}
                      </th>
                      <th className="pb-3 text-start font-bold">
                        {t.analyticsPage.profitability.budget}
                      </th>
                      <th className="pb-3 text-start font-bold">
                        {t.analyticsPage.profitability.hours}
                      </th>
                      <th className="pb-3 text-start font-bold">
                        {t.analyticsPage.profitability.rate}
                      </th>
                      <th className="pb-3 text-end font-bold">
                        {t.analyticsPage.profitability.status}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-semibold dark:divide-zinc-800/60">
                    {profitability.map((item) => (
                      <tr
                        key={item.projectId}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      >
                        <td className="py-3 font-bold text-zinc-900 dark:text-zinc-100">
                          {item.projectName}
                        </td>
                        <td className="py-3 text-zinc-600 dark:text-zinc-400">
                          {item.budget.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 text-zinc-600 dark:text-zinc-400">
                          {item.totalLoggedHours} س
                        </td>
                        <td className="py-3 font-black text-emerald-600 dark:text-emerald-400">
                          {item.effectiveHourlyRate.toLocaleString()} ج.م/س
                        </td>
                        <td className="py-3 text-end">
                          <span
                            className={`rounded-md px-2.5 py-0.5 text-[10px] font-extrabold ${
                              item.isProfitable
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {item.isProfitable
                              ? t.analyticsPage.profitability.profitable
                              : t.analyticsPage.profitability.underTarget}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Adaptive Work Allocation (§51/§52) */}
      {activeTab === "allocation" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {t.analyticsPage.allocation.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.analyticsPage.allocation.subtitle}
                </p>
              </div>

              <span className="self-start rounded-xl bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 sm:self-auto dark:bg-blue-950/60 dark:text-blue-300">
                {allocation.stateLabelAr}
              </span>
            </div>

            {/* Recommendation Box */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300">
              {allocation.recommendationAr}
            </div>

            {/* Workstream Progress Bars */}
            <div className="space-y-4">
              {allocation.splits.map((split) => (
                <div key={split.streamKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {split.nameAr}
                    </span>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span>المستهدف: {split.targetPercentage}%</span>
                      <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                        الفعلي: {split.actualPercentage}% (
                        {split.actualLoggedHours} س)
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${split.color}`}
                      style={{
                        width: `${Math.min(100, split.actualPercentage)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Productivity & Habits */}
      {activeTab === "productivity" && (
        <div className="animate-in fade-in space-y-6 duration-150">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  متوسط استمرارية العادات الأسبوعية
                </h3>
              </div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {habitConsistencyScore}%
              </div>
              <p className="text-xs text-zinc-500">
                يقيس معدل إنجاز العادات اليومية مقارنة بالهدف المحدد لكل عادة.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  مراجعات العلاقة المكتملة
                </h3>
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {relationshipCheckinsCount}
              </div>
              <p className="text-xs text-zinc-500">
                جلسات التقييم الأسبوعي المشتركة المحمية والموثقة بنجاح.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
