"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { WEEKDAYS } from "@/lib/constants/enums";
import type { ProfileRow } from "@/lib/supabase/types";
import type { SettingsState } from "@/lib/schemas/settings";

function SaveButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      isLoading={pending}
      className="min-w-[150px]"
    >
      {text}
    </Button>
  );
}

export function SettingsForm({ profile }: { profile: ProfileRow | null }) {
  const { t, isRtl } = useLocale();
  const [state, formAction] = useActionState<SettingsState, FormData>(
    updateSettings,
    undefined,
  );
  const [activeTab, setActiveTab] = useState<"profile" | "marriage" | "work" | "system">("profile");

  // Typed settings fallback
  const rawSettings = (profile?.settings ?? {}) as Record<string, unknown>;
  const marriageSettings = (rawSettings.marriage ?? {}) as Record<string, unknown>;
  const salesSettings = (rawSettings.sales_targets ?? {}) as Record<string, unknown>;
  const relSettings = (rawSettings.relationship ?? {}) as Record<string, unknown>;

  const weekdayOptions = WEEKDAYS.map((day) => {
    const dayNamesAr: Record<string, string> = {
      friday: "الجمعة (يوم محمي)",
      saturday: "السبت (يوم محمي)",
      sunday: "الأحد (يوم محمي)",
      monday: "الإثنين (يوم محمي)",
      tuesday: "الثلاثاء (يوم محمي)",
      wednesday: "الأربعاء (يوم محمي)",
      thursday: "الخميس (يوم محمي)",
    };
    return {
      value: day,
      label: isRtl ? dayNamesAr[day] || day : `${day.charAt(0).toUpperCase() + day.slice(1)} (Protected)`,
    };
  });

  const budgetOptions = [
    { value: "free", label: isRtl ? "مجاني (بدون مصاريف)" : "Free (No spend)" },
    { value: "low", label: isRtl ? "اقتصادي / منخفض" : "Low budget" },
    { value: "medium", label: isRtl ? "متوسط" : "Medium budget" },
    { value: "high", label: isRtl ? "احتفالي / مرتفع" : "Special celebration / High" },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "profile"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {t.settings.tabs.personal}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("marriage")}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "marriage"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {t.settings.tabs.marriage}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("work")}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "work"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {t.settings.tabs.work}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "system"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {t.settings.tabs.privacy}
        </button>
      </div>

      <form action={formAction} className="space-y-6">
        {/* State Banner */}
        {state?.message && (
          <div
            role="alert"
            className={`p-4 rounded-2xl text-sm font-medium border ${
              state.ok
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Tab 1: Personal & Schedule */}
        <div className={activeTab === "profile" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.tabs.personal}</CardTitle>
              <CardDescription>
                {isRtl ? "ضبط الهوية الشخصية والمنطقة الزمنية والعملة وساعات العمل." : "Configure your identity, timezone, currency, and work capacity."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_name" required>
                    {t.settings.displayName}
                  </Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    defaultValue={profile?.display_name ?? "Ahmed"}
                    error={state?.errors?.display_name?.[0]}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">{t.settings.timezone}</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    defaultValue={profile?.timezone ?? "Africa/Cairo"}
                    error={state?.errors?.timezone?.[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">{t.settings.currency}</Label>
                  <Input
                    id="currency"
                    name="currency"
                    defaultValue={profile?.currency ?? "EGP"}
                    error={state?.errors?.currency?.[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="weekly_off_day">{t.settings.weeklyOffDay}</Label>
                  <CustomSelect
                    id="weekly_off_day"
                    name="weekly_off_day"
                    defaultValue={profile?.weekly_off_day ?? "friday"}
                    options={weekdayOptions}
                  />
                </div>

                <div>
                  <Label htmlFor="work_hours_per_day">{t.settings.workHoursPerDay}</Label>
                  <Input
                    id="work_hours_per_day"
                    name="work_hours_per_day"
                    type="number"
                    min={1}
                    max={24}
                    defaultValue={Number(rawSettings.work_hours_per_day ?? 8)}
                  />
                </div>

                <div>
                  <Label htmlFor="preferred_start_time">{t.settings.preferredStartTime}</Label>
                  <Input
                    id="preferred_start_time"
                    name="preferred_start_time"
                    type="time"
                    defaultValue={String(rawSettings.preferred_start_time ?? "09:00")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab 2: Marriage & Savings Goal */}
        <div className={activeTab === "marriage" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.tabs.marriage}</CardTitle>
              <CardDescription>
                {isRtl ? "تحديد المستهدفات المالية لرحلة الاستعداد للزواج خلال 12 شهراً." : "Define the financial milestones for your 12-month marriage preparation roadmap."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marriage_target_amount">{t.settings.marriageTargetAmount} ({profile?.currency ?? "EGP"})</Label>
                  <Input
                    id="marriage_target_amount"
                    name="marriage_target_amount"
                    type="number"
                    defaultValue={Number(marriageSettings.target_amount ?? 250000)}
                  />
                </div>

                <div>
                  <Label htmlFor="marriage_target_months">{t.settings.marriageTargetMonths}</Label>
                  <Input
                    id="marriage_target_months"
                    name="marriage_target_months"
                    type="number"
                    defaultValue={Number(marriageSettings.target_months ?? 12)}
                  />
                </div>

                <div>
                  <Label htmlFor="marriage_fallback_months">{t.settings.marriageFallbackMonths}</Label>
                  <Input
                    id="marriage_fallback_months"
                    name="marriage_fallback_months"
                    type="number"
                    defaultValue={Number(marriageSettings.fallback_months ?? 24)}
                  />
                </div>

                <div>
                  <Label htmlFor="marriage_housing_strategy">{t.settings.housingStrategy}</Label>
                  <Input
                    id="marriage_housing_strategy"
                    name="marriage_housing_strategy"
                    defaultValue={String(marriageSettings.housing_strategy ?? "Rent initially, buy later")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab 3: Income & Revenue Targets */}
        <div className={activeTab === "work" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.tabs.work}</CardTitle>
              <CardDescription>
                {isRtl ? "ضبط مسارات العمل ومستهدفات التواصل الأسبوعي واليومي (Proposals & Outreach)." : "Configure your revenue pipelines and activity targets."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_stream">{t.settings.primaryStream}</Label>
                  <Input
                    id="primary_stream"
                    name="primary_stream"
                    defaultValue={String(rawSettings.primary_stream ?? "MERN / Next.js Freelance")}
                  />
                </div>

                <div>
                  <Label htmlFor="secondary_stream">{t.settings.secondaryStream}</Label>
                  <Input
                    id="secondary_stream"
                    name="secondary_stream"
                    defaultValue={String(rawSettings.secondary_stream ?? "Discord Bots")}
                  />
                </div>

                <div>
                  <Label htmlFor="proposals_per_week">{t.settings.proposalsPerWeek}</Label>
                  <Input
                    id="proposals_per_week"
                    name="proposals_per_week"
                    type="number"
                    defaultValue={Number(salesSettings.proposals_per_week ?? 5)}
                  />
                </div>

                <div>
                  <Label htmlFor="outreach_per_day">{t.settings.outreachPerDay}</Label>
                  <Input
                    id="outreach_per_day"
                    name="outreach_per_day"
                    type="number"
                    defaultValue={Number(salesSettings.outreach_per_day ?? 3)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab 4: Preferences & Privacy */}
        <div className={activeTab === "system" ? "block" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.tabs.privacy}</CardTitle>
              <CardDescription>
                {isRtl ? "إدارة تفضيلات الميزانية والخصوصية وميزات الـ AI." : "Manage relationship defaults and privacy controls."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="relationship_shared_day">{t.settings.sharedDay}</Label>
                  <CustomSelect
                    id="relationship_shared_day"
                    name="relationship_shared_day"
                    defaultValue={String(relSettings.shared_day ?? "friday")}
                    options={weekdayOptions}
                  />
                </div>

                <div>
                  <Label htmlFor="relationship_budget_preference">{t.settings.defaultBudget}</Label>
                  <CustomSelect
                    id="relationship_budget_preference"
                    name="relationship_budget_preference"
                    defaultValue={String(relSettings.budget_preference ?? "low")}
                    options={budgetOptions}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="ai_enabled"
                    name="ai_enabled"
                    type="checkbox"
                    defaultChecked={Boolean(rawSettings.ai_enabled)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <Label htmlFor="ai_enabled" className="mb-0 cursor-pointer">
                    {t.settings.aiEnabled}
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="ai_relationship_access"
                    name="ai_relationship_access"
                    type="checkbox"
                    defaultChecked={Boolean(rawSettings.ai_relationship_access)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                  />
                  <Label htmlFor="ai_relationship_access" className="mb-0 cursor-pointer">
                    {t.settings.aiPrivacy}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <SaveButton text={t.common.save} />
        </div>
      </form>
    </div>
  );
}
