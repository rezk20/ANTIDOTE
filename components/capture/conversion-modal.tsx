"use client";

import { useState, useTransition } from "react";
import { convertBrainDump } from "@/lib/actions/conversions";
import { NOTE_FOLDERS } from "@/lib/schemas/notes";
import { getFolderLabel } from "@/components/notes/folder-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/locale-provider";
import {
  Wand2,
  X,
  CheckSquare,
  FileText,
  Target,
  Users,
  Sparkles,
} from "lucide-react";
import type { BrainDumpRow } from "@/lib/supabase/types";

export function ConversionModal({
  isOpen,
  onClose,
  dump,
}: {
  isOpen: boolean;
  onClose: () => void;
  dump: BrainDumpRow | null;
}) {
  if (!isOpen || !dump) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <ConversionModalInnerForm
          key={dump.id}
          onClose={onClose}
          dump={dump}
        />
      </div>
    </div>
  );
}

function ConversionModalInnerForm({
  onClose,
  dump,
}: {
  onClose: () => void;
  dump: BrainDumpRow;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const [targetType, setTargetType] = useState<"task" | "note" | "goal" | "lead">("task");

  const rawContent = dump.content || "";
  const firstLine = rawContent.split("\n")[0].replace(/^#+\s*/, "").slice(0, 150);

  // Task fields
  const [taskTitle, setTaskTitle] = useState(firstLine);
  const [taskArea, setTaskArea] = useState("work");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskType, setTaskType] = useState("revenue");
  const [taskScheduledDate, setTaskScheduledDate] = useState("");
  const [taskIsTopThree, setTaskIsTopThree] = useState(false);

  // Note fields
  const [noteTitle, setNoteTitle] = useState(firstLine);
  const [noteFolder, setNoteFolder] = useState("inbox");
  const [noteContent, setNoteContent] = useState(rawContent);

  // Goal fields
  const [goalTitle, setGoalTitle] = useState(firstLine);
  const [goalLevel, setGoalLevel] = useState("quarter");
  const [goalTargetValue, setGoalTargetValue] = useState("");
  const [goalUnit, setGoalUnit] = useState("EGP");

  // Lead fields
  const [leadTitle, setLeadTitle] = useState(firstLine);
  const [leadStage, setLeadStage] = useState("proposal_sent");
  const [leadExpectedValue, setLeadExpectedValue] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("dump_id", dump.id);
    formData.set("target_type", targetType);

    if (targetType === "task") {
      formData.set("task_title", taskTitle.trim());
      formData.set("task_area", taskArea);
      formData.set("task_priority", taskPriority);
      formData.set("task_type", taskType);
      formData.set("task_scheduled_date", taskScheduledDate);
      formData.set("task_is_top_three", String(taskIsTopThree));
    } else if (targetType === "note") {
      formData.set("note_title", noteTitle.trim());
      formData.set("note_folder", noteFolder);
      formData.set("note_content", noteContent);
    } else if (targetType === "goal") {
      formData.set("goal_title", goalTitle.trim());
      formData.set("goal_level", goalLevel);
      formData.set("goal_target_value", goalTargetValue);
      formData.set("goal_unit", goalUnit);
    } else if (targetType === "lead") {
      formData.set("lead_title", leadTitle.trim());
      formData.set("lead_stage", leadStage);
      formData.set("lead_expected_value", leadExpectedValue);
      formData.set("lead_notes", dump.content);
    }

    startTransition(async () => {
      const res = await convertBrainDump({ ok: false }, formData);
      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.message || "Failed to convert capture.");
      }
    });
  }

  const typeTabs = [
    {
      id: "task" as const,
      label: t.conversions.convertToTask,
      icon: <CheckSquare className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: "note" as const,
      label: t.conversions.convertToNote,
      icon: <FileText className="h-4 w-4 text-amber-500" />,
    },
    {
      id: "goal" as const,
      label: t.conversions.convertToGoal,
      icon: <Target className="h-4 w-4 text-rose-500" />,
    },
    {
      id: "lead" as const,
      label: t.conversions.convertToLead,
      icon: <Users className="h-4 w-4 text-blue-500" />,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {t.conversions.convertTitle}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.conversions.convertSubtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {errorMsg}
          </div>
        )}

        {/* Raw Capture Excerpt */}
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 italic line-clamp-3">
          &ldquo;{dump.content}&rdquo;
        </div>

        {/* Entity Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
          {typeTabs.map((tab) => {
            const isSelected = targetType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTargetType(tab.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.id.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form based on Selected Target Type */}

        {/* 1. TASK Conversion Form */}
        {targetType === "task" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <Label htmlFor="task_title" className="text-xs font-bold">
                {t.conversions.taskTitle} *
              </Label>
              <Input
                id="task_title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.conversions.taskArea}</Label>
                <select
                  value={taskArea}
                  onChange={(e) => setTaskArea(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium"
                >
                  <option value="work">{isRtl ? "العمل (Work)" : "Work"}</option>
                  <option value="money">{isRtl ? "المالية (Money)" : "Money"}</option>
                  <option value="personal">{isRtl ? "شخصي (Personal)" : "Personal"}</option>
                  <option value="relationship">{isRtl ? "العلاقات والمنزل (Relationship)" : "Relationship"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.tasks.classification || "Type"}</Label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium"
                >
                  <option value="revenue">{isRtl ? "إيرادات وأرباح (Revenue)" : "Revenue"}</option>
                  <option value="career">{isRtl ? "تطوير مهني (Career)" : "Career"}</option>
                  <option value="client">{isRtl ? "مشروع عميل (Client)" : "Client"}</option>
                  <option value="product">{isRtl ? "منتج وSaaS (Product)" : "Product"}</option>
                  <option value="learning">{isRtl ? "تعلم وتطوير (Learning)" : "Learning"}</option>
                  <option value="marriage">{isRtl ? "تجهيزات الزواج (Marriage)" : "Marriage"}</option>
                  <option value="personal">{isRtl ? "شخصي وصحي (Personal)" : "Personal"}</option>
                  <option value="admin">{isRtl ? "إداري وروتيني (Admin)" : "Admin"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.conversions.taskPriority}</Label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium"
                >
                  <option value="critical">{t.tasks.critical}</option>
                  <option value="high">{t.tasks.high}</option>
                  <option value="medium">{t.tasks.medium}</option>
                  <option value="low">{t.tasks.low}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center pt-1">
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.tasks.scheduledDate || "Scheduled Date"}</Label>
                <Input
                  type="date"
                  value={taskScheduledDate}
                  onChange={(e) => setTaskScheduledDate(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="task_is_top_three"
                  checked={taskIsTopThree}
                  onChange={(e) => setTaskIsTopThree(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-zinc-300 text-amber-600 cursor-pointer"
                />
                <Label htmlFor="task_is_top_three" className="text-xs font-bold cursor-pointer">
                  {t.todayPlan.topThreeTitle} (Top 3)
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* 2. NOTE Conversion Form */}
        {targetType === "note" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <Label htmlFor="note_title" className="text-xs font-bold">
                {t.conversions.noteTitle} *
              </Label>
              <Input
                id="note_title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">{t.conversions.noteFolder}</Label>
              <select
                value={noteFolder}
                onChange={(e) => setNoteFolder(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium"
              >
                {NOTE_FOLDERS.filter((f) => f !== "archive").map((f) => (
                  <option key={f} value={f}>
                    {getFolderLabel(f, t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">{t.notesPage.content}</Label>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
                className="text-xs font-mono rounded-xl"
              />
            </div>
          </div>
        )}

        {/* 3. GOAL Conversion Form */}
        {targetType === "goal" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <Label htmlFor="goal_title" className="text-xs font-bold">
                {t.conversions.goalTitle} *
              </Label>
              <Input
                id="goal_title"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.conversions.goalTimeframe}</Label>
                <select
                  value={goalLevel}
                  onChange={(e) => setGoalLevel(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium"
                >
                  <option value="week">{isRtl ? "أسبوعي (Weekly)" : "Weekly"}</option>
                  <option value="month">{isRtl ? "شهري (Monthly)" : "Monthly"}</option>
                  <option value="quarter">{isRtl ? "ربع سنوي (Quarterly)" : "Quarterly"}</option>
                  <option value="year">{isRtl ? "سنوي (Annual)" : "Annual"}</option>
                  <option value="vision">{isRtl ? "رؤية مستقبلية (Vision)" : "Vision"}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">{t.goals.targetValue || "Target Value"}</Label>
                  <Input
                    type="number"
                    value={goalTargetValue}
                    onChange={(e) => setGoalTargetValue(e.target.value)}
                    placeholder="e.g. 50000"
                    className="text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">{t.goals.unit || "Unit"}</Label>
                  <Input
                    type="text"
                    value={goalUnit}
                    onChange={(e) => setGoalUnit(e.target.value)}
                    placeholder="EGP / Users"
                    className="text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. LEAD Conversion Form */}
        {targetType === "lead" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <Label htmlFor="lead_title" className="text-xs font-bold">
                {t.conversions.leadTitle} *
              </Label>
              <Input
                id="lead_title"
                value={leadTitle}
                onChange={(e) => setLeadTitle(e.target.value)}
                className="text-xs rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.conversions.leadStage}</Label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium"
                >
                  <option value="new">{isRtl ? "فرصة جديدة (New Lead)" : "New Lead"}</option>
                  <option value="contacted">{isRtl ? "تم التواصل (Contacted)" : "Contacted"}</option>
                  <option value="proposal_sent">{isRtl ? "تم إرسال العرض (Proposal Sent)" : "Proposal Sent"}</option>
                  <option value="won">{isRtl ? "مغلقة بنجاح (Won / Closed)" : "Won / Closed"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">{t.conversions.leadValue}</Label>
                <Input
                  type="number"
                  value={leadExpectedValue}
                  onChange={(e) => setLeadExpectedValue(e.target.value)}
                  placeholder="15000"
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="rounded-xl text-xs font-bold"
          >
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            className="rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.conversions.convertTitle}</span>
          </Button>
        </div>
      </form>
    </>
  );
}
