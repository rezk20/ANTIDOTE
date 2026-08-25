"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveDecision, deleteDecision } from "@/lib/actions/decisions";
import type { DecisionRow, DecisionStatus } from "@/lib/supabase/types";
import type { DecisionOptionInput } from "@/lib/schemas/decisions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Repeat,
  ShieldAlert,
} from "lucide-react";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision?: DecisionRow | null;
}

export function DecisionModal({
  isOpen,
  onClose,
  decision,
}: DecisionModalProps) {
  if (!isOpen) return null;

  return (
    <DecisionModalInner
      key={decision?.id || "new"}
      decision={decision}
      onClose={onClose}
    />
  );
}

function DecisionModalInner({
  decision,
  onClose,
}: {
  decision?: DecisionRow | null;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State initialized with passed decision
  const [title, setTitle] = useState(decision?.title || "");
  const [whyNow, setWhyNow] = useState(decision?.why_now || "");
  const [options, setOptions] = useState<DecisionOptionInput[]>(() => {
    if (decision?.options && Array.isArray(decision.options)) {
      return decision.options as DecisionOptionInput[];
    }
    return [
      { id: "opt_1", label: "", notes: "" },
      { id: "opt_2", label: "", notes: "" },
    ];
  });
  const [upside, setUpside] = useState(decision?.upside || "");
  const [downside, setDownside] = useState(decision?.downside || "");
  const [cost, setCost] = useState(decision?.cost || "");
  const [timeRequired, setTimeRequired] = useState(decision?.time_required || "");
  const [risk, setRisk] = useState(decision?.risk || "");
  const [worstCase, setWorstCase] = useState(decision?.worst_case || "");
  const [bestCase, setBestCase] = useState(decision?.best_case || "");
  const [reversible, setReversible] = useState(
    decision?.reversible !== undefined ? decision.reversible : true,
  );
  const [decisionText, setDecisionText] = useState(decision?.decision || "");
  const [reviewDate, setReviewDate] = useState(decision?.review_date || "");
  const [status, setStatus] = useState<DecisionStatus>(decision?.status || "open");

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: `opt_${Date.now()}`, label: "", notes: "" },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (
    index: number,
    field: "label" | "notes",
    val: string,
  ) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("يرجى إدخال عنوان القرار");
      return;
    }

    startTransition(async () => {
      setErrorMsg(null);
      const res = await saveDecision({
        id: decision?.id,
        title: title.trim(),
        why_now: whyNow.trim() || null,
        options: options.filter((o) => o.label.trim().length > 0),
        upside: upside.trim() || null,
        downside: downside.trim() || null,
        cost: cost.trim() || null,
        time_required: timeRequired.trim() || null,
        risk: risk.trim() || null,
        worst_case: worstCase.trim() || null,
        best_case: bestCase.trim() || null,
        reversible,
        decision: decisionText.trim() || null,
        review_date: reviewDate || null,
        status,
      });

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "تعذر حفظ القرار");
      }
    });
  };

  const handleDelete = () => {
    if (!decision?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذا القرار؟")) return;

    startTransition(async () => {
      const res = await deleteDecision(decision.id);
      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "تعذر حذف القرار");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {decision ? t.decisionsPage.editDecision : t.decisionsPage.newDecision}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                نموذج تفكير هيكلي للقرارات الكبرى (§34 Template)
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                عنوان القرار المفصلي *
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: رفع أسعار الفريلانس / الدخول في شراكة تقنية..."
                className="h-10 text-xs font-semibold rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                حالة القرار
              </Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DecisionStatus)}
                className="w-full h-10 px-3 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
              >
                <option value="open">مفتوح / قيد التقييم</option>
                <option value="decided">تم اتخاذ القرار</option>
                <option value="reviewed">تمت مراجعته وتقييمه</option>
              </select>
            </div>
          </div>

          {/* Why Now? */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t.decisionsPage.whyNow}
            </Label>
            <Textarea
              value={whyNow}
              onChange={(e) => setWhyNow(e.target.value)}
              placeholder={t.decisionsPage.whyNowPh}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          {/* Options Considered */}
          <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                {t.decisionsPage.optionsTitle}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="text-[11px] font-bold h-7 gap-1 rounded-lg"
              >
                <Plus className="h-3 w-3" />
                <span>{t.decisionsPage.addOption}</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div key={opt.id || idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-extrabold text-zinc-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <Input
                    value={opt.label}
                    onChange={(e) => handleOptionChange(idx, "label", e.target.value)}
                    placeholder={`الخيار ${String.fromCharCode(65 + idx)}...`}
                    className="h-8 text-xs font-medium rounded-lg flex-1"
                  />
                  <Input
                    value={opt.notes || ""}
                    onChange={(e) => handleOptionChange(idx, "notes", e.target.value)}
                    placeholder="ملاحظات مختصرة..."
                    className="h-8 text-[11px] rounded-lg w-1/3"
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upside vs Downside */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {t.decisionsPage.upside}
              </Label>
              <Textarea
                value={upside}
                onChange={(e) => setUpside(e.target.value)}
                placeholder="أفضل نتيجة ممكنة في حال نجاح الخيار..."
                rows={2}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-rose-700 dark:text-rose-400">
                {t.decisionsPage.downside}
              </Label>
              <Textarea
                value={downside}
                onChange={(e) => setDownside(e.target.value)}
                placeholder="السلبيات، التضحيات، والتكاليف الجانبية..."
                rows={2}
                className="text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Cost, Time, Risk */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.decisionsPage.cost}
              </Label>
              <Input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="مثال: 5,000 ج.م أو صفر"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.decisionsPage.timeRequired}
              </Label>
              <Input
                value={timeRequired}
                onChange={(e) => setTimeRequired(e.target.value)}
                placeholder="مثال: 20 ساعة / أسبوعين"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.decisionsPage.risk}
              </Label>
              <Input
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                placeholder="مثال: منخفض / فقدان عميل"
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Worst Case vs Best Case */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {t.decisionsPage.worstCase}
              </Label>
              <Textarea
                value={worstCase}
                onChange={(e) => setWorstCase(e.target.value)}
                placeholder="لو فشل القرار تماماً، ما أسوأ ما قد يحدث وهل يمكن تحمله؟"
                rows={2}
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-blue-700 dark:text-blue-400">
                {t.decisionsPage.bestCase}
              </Label>
              <Textarea
                value={bestCase}
                onChange={(e) => setBestCase(e.target.value)}
                placeholder="السيناريو المثالي الأقصى..."
                rows={2}
                className="text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Reversibility Toggle (§34 Type 1 vs Type 2) */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                {reversible ? (
                  <Repeat className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                )}
                <span>
                  {reversible
                    ? t.decisionsPage.reversible
                    : t.decisionsPage.irreversible}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {reversible
                  ? "قرارات النوع الثاني (Type 2): يمكن التراجع عنها بسهولة بدون خسائر فادحة."
                  : "قرارات النوع الأول (Type 1): اتجاه أحادي يصعب التراجع عنه، يتطلب حذراً وتأنياً."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setReversible(!reversible)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                reversible ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  reversible ? "start-6" : "start-0.5"
                }`}
              />
            </button>
          </div>

          {/* Decision & Review Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {t.decisionsPage.decisionLabel}
              </Label>
              <Input
                value={decisionText}
                onChange={(e) => setDecisionText(e.target.value)}
                placeholder="القرار الذي استقر عليه الرأي للتنفيذ..."
                className="h-10 text-xs font-semibold rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {t.decisionsPage.reviewDate}
              </Label>
              <Input
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                className="h-10 text-xs font-semibold rounded-xl"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              {decision?.id && (
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
