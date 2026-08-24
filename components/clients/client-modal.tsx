"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createClient, updateClient } from "@/lib/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import {
  parseContacts,
  parseScheduledActions,
  type ContactChannel,
  type ScheduledAction,
} from "./client-detail-modal";
import { X, Users2, Plus, Trash2, MessageSquare, Clock } from "lucide-react";
import type { ClientRow } from "@/lib/supabase/types";
import type { ClientState } from "@/lib/schemas/clients";

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

function ClientModalInnerForm({
  clientToEdit,
  onClose,
}: {
  clientToEdit?: ClientRow | null;
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(clientToEdit);

  const [contacts, setContacts] = useState<ContactChannel[]>(() =>
    parseContacts(clientToEdit?.contact),
  );
  const [scheduledActions, setScheduledActions] = useState<ScheduledAction[]>(() =>
    parseScheduledActions(clientToEdit?.next_action),
  );

  const actionWithId = isEditing
    ? updateClient.bind(null, clientToEdit!.id)
    : createClient;

  const [state, formAction] = useActionState<ClientState, FormData>(
    actionWithId,
    { ok: false },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const statusOptions = [
    { value: "active", label: isRtl ? "عميل نشط (Active)" : "Active Client" },
    { value: "past", label: isRtl ? "عميل سابق (Past)" : "Past Client" },
    { value: "lost", label: isRtl ? "ملغي / مفقود (Lost)" : "Lost" },
  ];

  const paymentStatusOptions = [
    { value: "none", label: isRtl ? "بدون مدفوعات" : "None" },
    { value: "pending", label: isRtl ? "بانتظار الدفع (Pending)" : "Pending" },
    { value: "partial", label: isRtl ? "مدفوع جزئياً (Partial)" : "Partial" },
    { value: "paid", label: isRtl ? "مدفوع بالكامل (Paid)" : "Paid" },
  ];

  const sourceOptions = [
    { value: "upwork", label: "Upwork" },
    { value: "mostaql", label: "Mostaql" },
    { value: "khamsat", label: "Khamsat" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "discord", label: "Discord" },
    { value: "referral", label: isRtl ? "ترشيح من عميل (Referral)" : "Referral" },
    { value: "direct", label: isRtl ? "مباشر (Direct)" : "Direct" },
  ];

  const channelOptions = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "discord", label: "Discord" },
    { value: "email", label: "Email" },
    { value: "phone", label: isRtl ? "مكالمة هاتفية" : "Phone" },
    { value: "telegram", label: "Telegram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "upwork", label: "Upwork DM" },
    { value: "other", label: isRtl ? "أخرى" : "Other" },
  ];

  function addContactRow() {
    setContacts((prev) => [...prev, { channel: "whatsapp", value: "" }]);
  }

  function updateContactRow(index: number, field: "channel" | "value", val: string) {
    setContacts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  }

  function removeContactRow(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  }

  function addActionRow() {
    setScheduledActions((prev) => [...prev, { text: "", date: "" }]);
  }

  function updateActionRow(index: number, field: "text" | "date", val: string) {
    setScheduledActions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  }

  function removeActionRow(index: number) {
    setScheduledActions((prev) => prev.filter((_, i) => i !== index));
  }

  const serializedContacts = JSON.stringify(contacts.filter((c) => c.value.trim().length > 0));
  const serializedActions = JSON.stringify(scheduledActions.filter((a) => a.text.trim().length > 0));

  return (
    <form ref={formRef} action={formAction} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
      {/* Hidden inputs to pass structured JSON */}
      <input type="hidden" name="contact" value={serializedContacts} />
      <input type="hidden" name="next_action" value={serializedActions} />

      {state?.message && !state.ok && (
        <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {state.message}
        </div>
      )}

      {/* Name */}
      <div>
        <Label htmlFor="name" required>
          {t.clients.clientName}
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={clientToEdit?.name ?? ""}
          placeholder="e.g. John Doe / TechCorp"
          error={state?.errors?.name?.[0]}
          autoFocus
          required
        />
      </div>

      {/* Company & Source */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">
            {t.clients.company}
          </Label>
          <Input
            id="company"
            name="company"
            defaultValue={clientToEdit?.company ?? ""}
            placeholder="e.g. SaaS Startup Inc."
          />
        </div>

        <div>
          <Label htmlFor="source">
            {t.clients.source}
          </Label>
          <CustomSelect
            id="source"
            name="source"
            defaultValue={clientToEdit?.source ?? "upwork"}
            options={sourceOptions}
          />
        </div>
      </div>

      {/* Status & Payment Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">
            {t.common.status}
          </Label>
          <CustomSelect
            id="status"
            name="status"
            defaultValue={clientToEdit?.status ?? "active"}
            options={statusOptions}
          />
        </div>

        <div>
          <Label htmlFor="payment_status">
            {t.clients.paymentStatus}
          </Label>
          <CustomSelect
            id="payment_status"
            name="payment_status"
            defaultValue={clientToEdit?.payment_status ?? "none"}
            options={paymentStatusOptions}
          />
        </div>
      </div>

      {/* Follow-Up Date */}
      <div>
        <Label htmlFor="follow_up_date">
          {t.clients.followUpDate}
        </Label>
        <Input
          id="follow_up_date"
          name="follow_up_date"
          type="date"
          defaultValue={clientToEdit?.follow_up_date ?? ""}
        />
      </div>

      {/* Contact Channels Multi-List Builder */}
      <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900 dark:text-zinc-100">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span>{t.clients.contacts}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addContactRow}
            className="gap-1 text-xs rounded-xl py-1 px-2.5 h-auto font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.clients.addContact}</span>
          </Button>
        </div>

        {contacts.length === 0 ? (
          <p className="text-[11px] text-zinc-400 italic">
            {isRtl ? "لم تتم إضافة قنوات تواصل بعد. اضغط '+' لإضافة واتساب، ديسكورد، بريد..." : "No contact methods added yet. Click '+' to add WhatsApp, Discord, Email..."}
          </p>
        ) : (
          <div className="space-y-2">
            {contacts.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-36 shrink-0">
                  <CustomSelect
                    value={c.channel}
                    onChange={(val) => updateContactRow(idx, "channel", val)}
                    options={channelOptions}
                    className="text-xs"
                  />
                </div>
                <Input
                  value={c.value}
                  onChange={(e) => updateContactRow(idx, "value", e.target.value)}
                  placeholder={c.channel === "whatsapp" ? "+201..." : c.channel === "discord" ? "username#123" : "Contact handle or address"}
                  className="text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeContactRow(idx)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduled Actions Multi-List Builder */}
      <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900 dark:text-zinc-100">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>{t.clients.scheduledActions}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addActionRow}
            className="gap-1 text-xs rounded-xl py-1 px-2.5 h-auto font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.clients.addAction}</span>
          </Button>
        </div>

        {scheduledActions.length === 0 ? (
          <p className="text-[11px] text-zinc-400 italic">
            {isRtl ? "لا توجد خطوات عمل أو مواعيد متابعة مجدولة. اضغط '+' للجدولة." : "No scheduled action items yet. Click '+' to schedule tasks & follow-ups."}
          </p>
        ) : (
          <div className="space-y-2">
            {scheduledActions.map((act, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={act.text}
                  onChange={(e) => updateActionRow(idx, "text", e.target.value)}
                  placeholder={isRtl ? "مثال: إرسال فاتورة الدفعة الثانية / طلب تقييم" : "e.g. Send milestone invoice / Request review"}
                  className="text-xs flex-1"
                />
                <Input
                  type="date"
                  value={act.date ?? ""}
                  onChange={(e) => updateActionRow(idx, "date", e.target.value)}
                  className="text-xs w-36 shrink-0"
                />
                <button
                  type="button"
                  onClick={() => removeActionRow(idx)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">
          {t.clients.notes}
        </Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={clientToEdit?.notes ?? ""}
          placeholder="Client preferences, time zone, past engagements..."
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

export function ClientModal({
  isOpen,
  onClose,
  clientToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: ClientRow | null;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(clientToEdit);

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
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? t.clients.editClient : t.clients.newClient}
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

        <ClientModalInnerForm
          key={clientToEdit?.id ?? "new"}
          clientToEdit={clientToEdit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
