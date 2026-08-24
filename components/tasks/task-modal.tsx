"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createTask, updateTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, CheckSquare, Star, DollarSign, Target, Zap, Clock, Shield } from "lucide-react";
import type { TaskRow, GoalRow, ProjectRow } from "@/lib/supabase/types";
import type { TaskState } from "@/lib/schemas/tasks";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      isLoading={pending}
      className="min-w-[130px] rounded-xl"
    >
      {text}
    </Button>
  );
}

function TaskModalInnerForm({
  taskToEdit,
  goals = [],
  projects = [],
  defaultGoalId,
  defaultDate,
  onClose,
}: {
  taskToEdit?: TaskRow | null;
  goals?: GoalRow[];
  projects?: ProjectRow[];
  defaultGoalId?: string;
  defaultDate?: string;
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(taskToEdit);

  const actionWithId = isEditing
    ? updateTask.bind(null, taskToEdit!.id)
    : createTask;

  const [state, formAction] = useActionState<TaskState, FormData>(
    actionWithId,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Initialized cleanly with default / edited values
  const [revenueImpact, setRevenueImpact] = useState<number>(taskToEdit?.revenue_impact ?? 0);
  const [strategicImpact, setStrategicImpact] = useState<number>(taskToEdit?.strategic_impact ?? 0);
  const [urgency, setUrgency] = useState<number>(taskToEdit?.urgency ?? 0);
  const [effort, setEffort] = useState<number>(taskToEdit?.effort ?? 3);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const taskTypeOptions = [
    {
      value: "revenue",
      label: isRtl ? "عائد مباشر (Revenue)" : "Direct Income (Revenue)",
      icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
      badge: "Cash Flow",
      description: isRtl ? "مهام تجلب أموالاً مباشرة" : "Direct money-making activities",
    },
    {
      value: "product",
      label: isRtl ? "بناء أصل / منتج (Build Product)" : "Build Product / Asset",
      icon: <Target className="h-4 w-4 text-blue-500" />,
      badge: "Asset",
      description: isRtl ? "تطوير كود أو منصات طويلة الأجل" : "Building long-term leverage code",
    },
    {
      value: "client",
      label: isRtl ? "تسليم عميل (Client Delivery)" : "Client Delivery",
      icon: <CheckSquare className="h-4 w-4 text-indigo-500" />,
      description: isRtl ? "إنجاز التزامات العملاء الحالية" : "Delivering active client work",
    },
    {
      value: "career",
      label: isRtl ? "تطوير مهني (Career Growth)" : "Career & Portfolio",
      icon: <Star className="h-4 w-4 text-purple-500" />,
    },
    {
      value: "marriage",
      label: isRtl ? "تجهيز الزواج (Marriage Mission)" : "Marriage Mission",
      icon: <Shield className="h-4 w-4 text-rose-500" />,
    },
    {
      value: "finance",
      label: isRtl ? "المالية والمحافظ (Finance)" : "Finance & Wallets",
      icon: <DollarSign className="h-4 w-4 text-amber-500" />,
    },
    {
      value: "learning",
      label: isRtl ? "تعلم وتطوير (Learning)" : "Skill Learning",
    },
    {
      value: "relationship",
      label: isRtl ? "العلاقة والأسرة (Relationship)" : "Relationship & Family",
    },
    {
      value: "personal",
      label: isRtl ? "شخصي (Personal)" : "Personal",
    },
    {
      value: "admin",
      label: isRtl ? "إداري وروتيني (Admin)" : "Admin & Maintenance",
    },
  ];

  const priorityOptions = [
    { value: "critical", label: isRtl ? "حرجة جداً (Critical)" : "Critical Priority", badge: "Urgent + High ROI" },
    { value: "high", label: isRtl ? "عالية (High)" : "High Priority", badge: "High Impact" },
    { value: "medium", label: isRtl ? "متوسطة (Medium)" : "Medium Priority" },
    { value: "low", label: isRtl ? "منخفضة (Low)" : "Low Priority" },
  ];

  const statusOptions = [
    { value: "backlog", label: isRtl ? "قائمة الانتظار (Backlog)" : "Backlog" },
    { value: "planned", label: isRtl ? "مجدولة (Planned)" : "Planned" },
    { value: "in_progress", label: isRtl ? "قيد التنفيذ (In Progress)" : "In Progress" },
    { value: "done", label: isRtl ? "مكتملة (Completed)" : "Completed" },
  ];

  const goalOptions = [
    { value: "", label: isRtl ? "بدون هدف مرتبط" : "No goal linked" },
    ...goals.map((g) => ({
      value: g.id,
      label: `[${g.level.toUpperCase()}] ${g.title}`,
    })),
  ];

  const projectOptions = [
    { value: "", label: isRtl ? "بدون مشروع مرتبط" : "No project linked" },
    ...projects.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ];

  return (
    <form ref={formRef} action={formAction} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
      {state?.message && !state.ok && (
        <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {state.message}
        </div>
      )}

      {/* Title */}
      <div>
        <Label htmlFor="title" required>
          {t.tasks.taskTitle}
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={taskToEdit?.title ?? ""}
          placeholder={t.tasks.taskTitlePlaceholder}
          error={state?.errors?.title?.[0]}
          autoFocus
          required
        />
      </div>

      {/* Classification & Priority Tier Custom Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task_type" required>
            {t.tasks.classification}
          </Label>
          <CustomSelect
            id="task_type"
            name="task_type"
            defaultValue={taskToEdit?.task_type ?? "revenue"}
            options={taskTypeOptions}
          />
        </div>

        <div>
          <Label htmlFor="priority">
            {t.tasks.priorityTier}
          </Label>
          <CustomSelect
            id="priority"
            name="priority"
            defaultValue={taskToEdit?.priority ?? "medium"}
            options={priorityOptions}
          />
        </div>
      </div>

      {/* Friendly Interactive Impact Weights (0-5) */}
      <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>{t.tasks.impactWeights}</span>
          </span>
          <span className="text-[11px] text-zinc-400">
            {isRtl ? "يحدد الترتيب التلقائي" : "Auto-calculates priority rank"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Revenue impact */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t.tasks.revenueImpact}</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{revenueImpact} / 5</span>
            </div>
            <input type="hidden" name="revenue_impact" value={revenueImpact} />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRevenueImpact(val)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    revenueImpact === val
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Strategic impact */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5 text-blue-500" />
                <span>{t.tasks.strategicImpact}</span>
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{strategicImpact} / 5</span>
            </div>
            <input type="hidden" name="strategic_impact" value={strategicImpact} />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStrategicImpact(val)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    strategicImpact === val
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>{t.tasks.urgency}</span>
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{urgency} / 5</span>
            </div>
            <input type="hidden" name="urgency" value={urgency} />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUrgency(val)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    urgency === val
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Effort */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-rose-500" />
                <span>{t.tasks.effort}</span>
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{effort} / 5</span>
            </div>
            <input type="hidden" name="effort" value={effort} />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEffort(val)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    effort === val
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scheduled_date">
            {t.tasks.scheduledDate}
          </Label>
          <Input
            id="scheduled_date"
            name="scheduled_date"
            type="date"
            defaultValue={taskToEdit?.scheduled_date ?? defaultDate ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="status">
            {t.common.status}
          </Label>
          <CustomSelect
            id="status"
            name="status"
            defaultValue={taskToEdit?.status ?? "backlog"}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Goal Link & Project Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal_id">
            {t.tasks.linkedGoal}
          </Label>
          <CustomSelect
            id="goal_id"
            name="goal_id"
            defaultValue={taskToEdit?.goal_id ?? defaultGoalId ?? ""}
            options={goalOptions}
          />
        </div>

        <div>
          <Label htmlFor="project_id">
            {t.tasks.linkedProject}
          </Label>
          <CustomSelect
            id="project_id"
            name="project_id"
            defaultValue={taskToEdit?.project_id ?? ""}
            options={projectOptions}
          />
        </div>
      </div>

      {/* Recurring Rule */}
      <div>
        <Label htmlFor="recurring_rule">
          {t.tasks.recurringRule}
        </Label>
        <Input
          id="recurring_rule"
          name="recurring_rule"
          defaultValue={taskToEdit?.recurring_rule ?? ""}
          placeholder="e.g. daily / weekdays / weekly:mon,thu / monthly:1"
        />
      </div>

      {/* Top 3 Toggle */}
      <div className="flex items-center gap-3 pt-1">
        <input
          id="is_top_three"
          name="is_top_three"
          type="checkbox"
          defaultChecked={taskToEdit?.is_top_three ?? false}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
        />
        <Label htmlFor="is_top_three" className="mb-0 flex items-center gap-1.5 cursor-pointer font-semibold">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{t.tasks.markTopThree}</span>
        </Label>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="description">
          {t.tasks.notes}
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={taskToEdit?.description ?? ""}
          placeholder="Notes, subtasks, client requirements..."
          rows={3}
        />
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="outline" size="md" onClick={onClose} className="rounded-xl">
          {t.common.cancel}
        </Button>
        <SubmitButton text={isEditing ? t.common.save : t.common.create} />
      </div>
    </form>
  );
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  goals = [],
  projects = [],
  defaultGoalId,
  defaultDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskRow | null;
  goals?: GoalRow[];
  projects?: ProjectRow[];
  defaultGoalId?: string;
  defaultDate?: string;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(taskToEdit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? t.tasks.editTask : t.tasks.newTask}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <TaskModalInnerForm
          key={taskToEdit?.id ?? "new"}
          taskToEdit={taskToEdit}
          goals={goals}
          projects={projects}
          defaultGoalId={defaultGoalId}
          defaultDate={defaultDate}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
