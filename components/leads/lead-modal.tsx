"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createLead, updateLead } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, Briefcase } from "lucide-react";
import type { LeadRow, ClientRow } from "@/lib/supabase/types";
import type { LeadState } from "@/lib/schemas/leads";

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

function LeadModalInnerForm({
  leadToEdit,
  clients = [],
  defaultStage = "new",
  onClose,
}: {
  leadToEdit?: LeadRow | null;
  clients?: ClientRow[];
  defaultStage?: string;
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(leadToEdit);

  const actionWithId = isEditing
    ? updateLead.bind(null, leadToEdit!.id)
    : createLead;

  const [state, formAction] = useActionState<LeadState, FormData>(
    actionWithId,
    { ok: false },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const stageOptions = [
    { value: "new", label: isRtl ? "استكشاف جديد (New Discovery)" : "New Discovery", badge: "Discovery" },
    { value: "qualified", label: isRtl ? "مؤهل للمراسلة (Qualified)" : "Qualified", badge: "Discovery" },
    { value: "contacted", label: isRtl ? "تم التواصل الأول (Contacted)" : "Contacted", badge: "Outreach" },
    { value: "proposal_sent", label: isRtl ? "تم إرسال العرض (Proposal Sent)" : "Proposal Sent", badge: "Pitching" },
    { value: "follow_up", label: isRtl ? "بانتظار المتابعة (Follow-Up)" : "Follow-Up", badge: "Nurture" },
    { value: "call", label: isRtl ? "مكالمة مجدولة (Call Scheduled)" : "Call", badge: "Nurture" },
    { value: "negotiation", label: isRtl ? "تفاوض على السعر (Negotiation)" : "Negotiation", badge: "Pitching" },
    { value: "won", label: isRtl ? "صفقة رابحة (Won!)" : "Won!", badge: "Won" },
    { value: "in_progress", label: isRtl ? "قيد التنفيذ (In Progress)" : "In Progress", badge: "Delivery" },
    { value: "delivered", label: isRtl ? "تم التسليم (Delivered)" : "Delivered", badge: "Delivery" },
    { value: "paid", label: isRtl ? "تم استلام الدفعة (Paid)" : "Paid", badge: "Paid" },
    { value: "review_requested", label: isRtl ? "طلب تقييم (Review Requested)" : "Review Requested", badge: "Retention" },
    { value: "referral_requested", label: isRtl ? "طلب ترشيح (Referral)" : "Referral Requested", badge: "Retention" },
    { value: "lost", label: isRtl ? "صفقة ملغاة (Lost)" : "Lost", badge: "Closed" },
  ];

  const sourceOptions = [
    { value: "upwork", label: "Upwork" },
    { value: "mostaql", label: isRtl ? "مستقل (Mostaql)" : "Mostaql" },
    { value: "khamsat", label: isRtl ? "خمسات (Khamsat)" : "Khamsat" },
    { value: "linkedin", label: "LinkedIn Cold Outreach" },
    { value: "discord", label: "Discord Developer Communities" },
    { value: "twitter", label: "Twitter / X DM" },
    { value: "referral", label: isRtl ? "ترشيح من عميل سابق (Referral)" : "Client Referral" },
    { value: "direct", label: isRtl ? "تواصل مباشر (Direct Client)" : "Direct Outreach" },
    { value: "other", label: isRtl ? "مصدر آخر" : "Other" },
  ];

  const clientOptions = [
    { value: "", label: isRtl ? "بدون عميل مرتبط (فرصة جديدة)" : "No linked client (New Lead)" },
    ...clients.map((c) => ({
      value: c.id,
      label: `${c.name} ${c.company ? `(${c.company})` : ""}`,
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
          {t.leads.leadTitle}
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={leadToEdit?.title ?? ""}
          placeholder={t.leads.leadTitlePlaceholder}
          error={state?.errors?.title?.[0]}
          autoFocus
          required
        />
      </div>

      {/* Stage & Source Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stage" required>
            {t.leads.stage}
          </Label>
          <CustomSelect
            id="stage"
            name="stage"
            defaultValue={leadToEdit?.stage ?? defaultStage}
            options={stageOptions}
          />
        </div>

        <div>
          <Label htmlFor="source">
            {t.leads.source}
          </Label>
          <CustomSelect
            id="source"
            name="source"
            defaultValue={leadToEdit?.source ?? "upwork"}
            options={sourceOptions}
          />
        </div>
      </div>

      {/* Financials: Expected Value, Proposal Amount, Probability */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="expected_value">
            {t.leads.expectedValue} (EGP)
          </Label>
          <Input
            id="expected_value"
            name="expected_value"
            type="number"
            defaultValue={leadToEdit?.expected_value ?? ""}
            placeholder="e.g. 15000"
          />
        </div>

        <div>
          <Label htmlFor="proposal_amount">
            {t.leads.proposalAmount} (EGP)
          </Label>
          <Input
            id="proposal_amount"
            name="proposal_amount"
            type="number"
            defaultValue={leadToEdit?.proposal_amount ?? ""}
            placeholder="e.g. 18000"
          />
        </div>

        <div>
          <Label htmlFor="probability">
            {t.leads.probability}
          </Label>
          <Input
            id="probability"
            name="probability"
            type="number"
            step="0.05"
            min="0"
            max="1"
            defaultValue={leadToEdit?.probability ?? "0.5"}
            placeholder="0.5"
          />
        </div>
      </div>

      {/* Linked Client & Next Follow Up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_id">
            {t.clients.title}
          </Label>
          <CustomSelect
            id="client_id"
            name="client_id"
            defaultValue={leadToEdit?.client_id ?? ""}
            options={clientOptions}
          />
        </div>

        <div>
          <Label htmlFor="next_follow_up_at">
            {t.leads.followUpDate}
          </Label>
          <Input
            id="next_follow_up_at"
            name="next_follow_up_at"
            type="date"
            defaultValue={leadToEdit?.next_follow_up_at?.split("T")[0] ?? ""}
          />
        </div>
      </div>

      {/* Reference URL */}
      <div>
        <Label htmlFor="url">
          {t.leads.url}
        </Label>
        <Input
          id="url"
          name="url"
          type="url"
          defaultValue={leadToEdit?.url ?? ""}
          placeholder="https://..."
        />
      </div>

      {/* Lost Reason (if applicable) */}
      <div>
        <Label htmlFor="lost_reason">
          {t.leads.lostReason}
        </Label>
        <Input
          id="lost_reason"
          name="lost_reason"
          defaultValue={leadToEdit?.lost_reason ?? ""}
          placeholder="e.g. Budget mismatch / Competitor hired / No response"
        />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">
          {t.leads.notes}
        </Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={leadToEdit?.notes ?? ""}
          placeholder="Client background, tech stack, requirements, pain points..."
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

export function LeadModal({
  isOpen,
  onClose,
  leadToEdit,
  clients = [],
  defaultStage = "new",
}: {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: LeadRow | null;
  clients?: ClientRow[];
  defaultStage?: string;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(leadToEdit);

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
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? t.leads.editLead : t.leads.newLead}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <LeadModalInnerForm
          key={leadToEdit?.id ?? "new"}
          leadToEdit={leadToEdit}
          clients={clients}
          defaultStage={defaultStage}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
