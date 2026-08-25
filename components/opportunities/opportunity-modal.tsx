"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveOpportunity, deleteOpportunity } from "@/lib/actions/opportunities";
import type {
  OpportunityRow,
  OpportunityKind,
  OpportunityRisk,
  OpportunityStatus,
} from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  DollarSign,
  Clock,
} from "lucide-react";

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity?: OpportunityRow | null;
}

export function OpportunityModal({
  isOpen,
  onClose,
  opportunity,
}: OpportunityModalProps) {
  if (!isOpen) return null;

  return (
    <OpportunityModalInner
      key={opportunity?.id || "new"}
      opportunity={opportunity}
      onClose={onClose}
    />
  );
}

function OpportunityModalInner({
  opportunity,
  onClose,
}: {
  opportunity?: OpportunityRow | null;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State initialized with passed opportunity
  const [title, setTitle] = useState(opportunity?.title || "");
  const [kind, setKind] = useState<OpportunityKind>(opportunity?.kind || "freelance");
  const [expectedValue, setExpectedValue] = useState<string>(
    opportunity?.expected_value ? String(opportunity.expected_value) : "15000",
  );
  const [probability, setProbability] = useState<number>(
    opportunity?.probability !== undefined ? opportunity.probability : 0.6,
  );
  const [timeHours, setTimeHours] = useState<string>(
    opportunity?.time_required_hours ? String(opportunity.time_required_hours) : "15",
  );
  const [risk, setRisk] = useState<OpportunityRisk>(opportunity?.risk || "medium");
  const [nextAction, setNextAction] = useState(opportunity?.next_action || "");
  const [status, setStatus] = useState<OpportunityStatus>(opportunity?.status || "open");

  const evNum = Number(expectedValue) || 0;
  const hrsNum = Math.max(1, Number(timeHours) || 1);
  const liveScore = Math.round(((evNum * probability) / hrsNum) * 10) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("يرجى إدخال عنوان الفرصة");
      return;
    }

    startTransition(async () => {
      setErrorMsg(null);
      const res = await saveOpportunity({
        id: opportunity?.id,
        title: title.trim(),
        kind,
        expected_value: evNum,
        probability,
        time_required_hours: hrsNum,
        risk,
        next_action: nextAction.trim() || null,
        status,
      });

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "تعذر حفظ الفرصة");
      }
    });
  };

  const handleDelete = () => {
    if (!opportunity?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذه الفرصة؟")) return;

    startTransition(async () => {
      const res = await deleteOpportunity(opportunity.id);
      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "تعذر حذف الفرصة");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {opportunity
                  ? t.opportunitiesPage.editOpportunity
                  : t.opportunitiesPage.newOpportunity}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                معادلة العائد المتوقع على الوقت (§50 Opportunity Score)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Kind */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              عنوان الفرصة / العميل *
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تطبيق عقاري / بوت إدارة مجتمع / عقد ريموت..."
              className="h-10 text-xs font-semibold rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                نوع الفرصة
              </Label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as OpportunityKind)}
                className="w-full h-10 px-3 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
              >
                <option value="freelance">مشروع فريلانس (Freelance)</option>
                <option value="discord_client">عميل بوت ديسكورد</option>
                <option value="remote">عقد عمل عن بعد (Remote)</option>
                <option value="job">وظيفة بدوام كامل</option>
                <option value="partnership">شراكة استراتيجية</option>
                <option value="product">منتج رقمي جانبي</option>
                <option value="other">فرصة أخرى</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                حالة الفرصة
              </Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OpportunityStatus)}
                className="w-full h-10 px-3 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
              >
                <option value="open">مفتوحة للدراسة (Open)</option>
                <option value="pursuing">قيد المتابعة والتفاوض (Pursuing)</option>
                <option value="won">تم الفوز بها (Won)</option>
                <option value="dropped">مستبعدة (Dropped)</option>
              </select>
            </div>
          </div>

          {/* Value, Probability Slider, Hours */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  <span>القيمة المتوقعة (ج.م)</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="500"
                  value={expectedValue}
                  onChange={(e) => setExpectedValue(e.target.value)}
                  className="h-9 text-xs font-bold rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>الساعات المقدرة للعمل</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={timeHours}
                  onChange={(e) => setTimeHours(e.target.value)}
                  className="h-9 text-xs font-bold rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Probability Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-600 dark:text-zinc-400">
                  احتمالية الفوز والإغلاق:
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                  {Math.round(probability * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Live Score Preview */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">
                معامل الجدوى المحسوب:
              </span>
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                <span className="text-base">{liveScore.toLocaleString()}</span>
                <span>ج.م / ساعة</span>
              </div>
            </div>
          </div>

          {/* Risk & Next Action */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                مستوى المخاطرة
              </Label>
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value as OpportunityRisk)}
                className="w-full h-9 px-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
              >
                <option value="low">منخفضة (Low)</option>
                <option value="medium">متوسطة (Medium)</option>
                <option value="high">عالية (High)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                الخطوة القادمة المحددة
              </Label>
              <Input
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="مثال: إرسال عرض مخصص / جدولة مكالمة ديمو..."
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              {opportunity?.id && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs font-bold rounded-xl cursor-pointer"
              >
                {t.common.cancel}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isPending ? t.common.saving : t.common.save}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
