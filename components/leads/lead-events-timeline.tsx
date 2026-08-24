"use client";

import { useState, useTransition } from "react";
import { logLeadEvent, recordLeadPayment } from "@/lib/actions/leads";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/select";
import {
  X,
  History,
  Send,
  PhoneCall,
  FileText,
  DollarSign,
  CheckCircle,
  Plus,
} from "lucide-react";
import type { LeadRow, LeadEventRow, LeadEventType } from "@/lib/supabase/types";

const EVENT_ICONS: Record<string, React.ReactNode> = {
  discovered: <CheckCircle className="h-4 w-4 text-blue-500" />,
  outreach: <Send className="h-4 w-4 text-amber-500" />,
  proposal_sent: <FileText className="h-4 w-4 text-purple-500" />,
  follow_up: <PhoneCall className="h-4 w-4 text-indigo-500" />,
  call: <PhoneCall className="h-4 w-4 text-emerald-500" />,
  negotiation: <DollarSign className="h-4 w-4 text-amber-500" />,
  won: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  paid: <DollarSign className="h-4 w-4 text-emerald-600" />,
  lost: <X className="h-4 w-4 text-rose-500" />,
  note: <FileText className="h-4 w-4 text-zinc-400" />,
};

export function LeadEventsTimeline({
  isOpen,
  onClose,
  lead,
  events,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadRow | null;
  events: LeadEventRow[];
}) {
  const { t, isRtl } = useLocale();
  const [showLogForm, setShowLogForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [eventType, setEventType] = useState<string>("outreach");
  const [noteText, setNoteText] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  if (!isOpen || !lead) return null;

  const leadEvents = events.filter((e) => e.lead_id === lead.id);

  const eventTypeOptions = [
    { value: "outreach", label: isRtl ? "تواصل أول (Cold DM / Outreach)" : "Initial Outreach" },
    { value: "call", label: isRtl ? "مكالمة استكشافية (Discovery Call)" : "Discovery Call" },
    { value: "follow_up", label: isRtl ? "متابعة دورية (Follow-Up)" : "Follow-Up Touch" },
    { value: "proposal_sent", label: isRtl ? "إرسال عرض مالي (Proposal)" : "Proposal Sent" },
    { value: "negotiation", label: isRtl ? "جلسة تفاوض (Negotiation)" : "Negotiation Touch" },
    { value: "note", label: isRtl ? "ملاحظة / سياق عام (Note)" : "General Note" },
  ];

  async function handleLogEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;

    startTransition(async () => {
      await logLeadEvent(lead.id, eventType as LeadEventType, noteText);
      setNoteText("");
      setShowLogForm(false);
    });
  }

  async function handleRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!lead || !paymentAmount) return;

    const todayStr = new Date().toISOString().split("T")[0];
    startTransition(async () => {
      await recordLeadPayment(lead.id, Number(paymentAmount), todayStr, noteText || undefined);
      setPaymentAmount("");
      setNoteText("");
      setShowPaymentForm(false);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {lead.title}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {t.leads.timeline} • {lead.stage.toUpperCase()}
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

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShowPaymentForm(false);
                setShowLogForm((prev) => !prev);
              }}
              className="gap-1.5 rounded-xl text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.leads.logTouch}</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowLogForm(false);
                setShowPaymentForm((prev) => !prev);
              }}
              className="gap-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>{t.leads.recordPayment}</span>
            </Button>
          </div>

          {/* Quick Log Touch Form */}
          {showLogForm && (
            <form onSubmit={handleLogEvent} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {t.leads.logTouch}
              </span>
              <div>
                <Label htmlFor="event_type">{t.common.status}</Label>
                <CustomSelect
                  value={eventType}
                  onChange={setEventType}
                  options={eventTypeOptions}
                />
              </div>
              <div>
                <Label htmlFor="note">{t.tasks.notes}</Label>
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What was discussed or agreed on?"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setShowLogForm(false)}>
                  {t.common.cancel}
                </Button>
                <Button type="submit" size="sm" variant="primary" isLoading={isPending}>
                  {t.common.save}
                </Button>
              </div>
            </form>
          )}

          {/* Quick Record Payment Form */}
          {showPaymentForm && (
            <form onSubmit={handleRecordPayment} className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                {t.leads.recordPayment}
              </span>
              <div>
                <Label htmlFor="payment_amount" required>
                  {isRtl ? "المبلغ المستلم (EGP)" : "Payment Amount (EGP)"}
                </Label>
                <Input
                  id="payment_amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={lead.proposal_amount ? String(lead.proposal_amount) : "e.g. 5000"}
                  required
                />
              </div>
              <div>
                <Label htmlFor="payment_note">{t.tasks.notes}</Label>
                <Input
                  id="payment_note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Milestone 1 upfront deposit"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setShowPaymentForm(false)}>
                  {t.common.cancel}
                </Button>
                <Button type="submit" size="sm" variant="primary" isLoading={isPending}>
                  {t.leads.recordPayment}
                </Button>
              </div>
            </form>
          )}

          {/* Timeline List */}
          <div className="space-y-4">
            {leadEvents.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4 text-center">
                {isRtl ? "لا توجد أنشطة مسجلة حتى الآن." : "No recorded events yet for this lead."}
              </p>
            ) : (
              <div className="relative ps-6 space-y-6 border-s-2 border-zinc-200 dark:border-zinc-800 ms-3">
                {leadEvents.map((ev) => (
                  <div key={ev.id} className="relative group">
                    {/* Circle icon marker */}
                    <div className="absolute -start-[31px] top-0.5 p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      {EVENT_ICONS[ev.event_type] || <CheckCircle className="h-3.5 w-3.5 text-zinc-400" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                          {ev.event_type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {new Date(ev.occurred_at).toLocaleString(isRtl ? "ar-EG" : "en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      {ev.amount != null && (
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {ev.amount.toLocaleString()} EGP
                        </div>
                      )}

                      {ev.note && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                          {ev.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
