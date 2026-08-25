"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveRelationshipCheckin } from "@/lib/actions/relationship";
import type { RelationshipCheckinRow } from "@/lib/supabase/types";
import type { RelationshipCheckinAnswers } from "@/lib/schemas/relationship";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Lock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Smile,
  ShieldCheck,
  History,
} from "lucide-react";

interface RelationshipCheckinFormProps {
  checkins: RelationshipCheckinRow[];
}

export function RelationshipCheckinForm({ checkins }: RelationshipCheckinFormProps) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [answers, setAnswers] = useState<RelationshipCheckinAnswers>({
    q_appreciation: "",
    q_connection: "",
    q_stressors: "",
    q_marriage_talk: "",
    q_next_shared_time: "",
  });
  const [notes, setNotes] = useState("");

  const handleChange = (field: keyof RelationshipCheckinAnswers, val: string) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    const todayDate = new Date().toISOString().slice(0, 10);

    startTransition(async () => {
      const res = await saveRelationshipCheckin({
        checkin_date: todayDate,
        answers,
        notes: notes || null,
      });

      if (res.ok) {
        setSuccessMsg(t.relationshipPage.checkinSavedSuccess);
        setAnswers({
          q_appreciation: "",
          q_connection: "",
          q_stressors: "",
          q_marriage_talk: "",
          q_next_shared_time: "",
        });
        setNotes("");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Checkin Form Box */}
      <div className="p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 bg-white dark:bg-zinc-900 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-700 dark:text-pink-300 text-[10px] font-black uppercase">
                {t.relationshipPage.privacyBadge}
              </span>
            </div>
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {t.relationshipPage.checkinTitle}
            </h3>
            <p className="text-xs text-zinc-500">
              {t.relationshipPage.checkinSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-[11px] text-zinc-500 font-bold border border-zinc-200 dark:border-zinc-700">
            <Lock className="h-3.5 w-3.5 text-zinc-400" />
            <span>مشفر ومستثنى من الـ AI</span>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-in fade-in">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question 1: Appreciation */}
          <div className="p-4 rounded-2xl bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/30 space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-pink-950 dark:text-pink-200">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-100 dark:fill-pink-950" />
              <span>{t.relationshipPage.questions.q_appreciation}</span>
            </Label>
            <Textarea
              value={answers.q_appreciation}
              onChange={(e) => handleChange("q_appreciation", e.target.value)}
              placeholder={t.relationshipPage.questions.q_appreciation_ph}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          {/* Question 2: Connection */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Smile className="h-4 w-4 text-amber-500" />
              <span>{t.relationshipPage.questions.q_connection}</span>
            </Label>
            <Textarea
              value={answers.q_connection}
              onChange={(e) => handleChange("q_connection", e.target.value)}
              placeholder={t.relationshipPage.questions.q_connection_ph}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          {/* Question 3: Stressors */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              <span>{t.relationshipPage.questions.q_stressors}</span>
            </Label>
            <Textarea
              value={answers.q_stressors}
              onChange={(e) => handleChange("q_stressors", e.target.value)}
              placeholder={t.relationshipPage.questions.q_stressors_ph}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          {/* Question 4: Marriage Talk */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Calendar className="h-4 w-4 text-rose-500" />
              <span>{t.relationshipPage.questions.q_marriage_talk}</span>
            </Label>
            <Textarea
              value={answers.q_marriage_talk}
              onChange={(e) => handleChange("q_marriage_talk", e.target.value)}
              placeholder={t.relationshipPage.questions.q_marriage_talk_ph}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          {/* Question 5: Next Shared Time */}
          <div className="p-4 rounded-2xl bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/30 space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-pink-950 dark:text-pink-200">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span>{t.relationshipPage.questions.q_next_shared_time}</span>
            </Label>
            <Textarea
              value={answers.q_next_shared_time}
              onChange={(e) => handleChange("q_next_shared_time", e.target.value)}
              placeholder={t.relationshipPage.questions.q_next_shared_time_ph}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-2xl text-xs font-black gap-2 bg-pink-600 hover:bg-pink-700 text-white shadow-xs cursor-pointer px-6"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isPending ? t.common.saving : t.relationshipPage.saveCheckin}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Previous Check-Ins Timeline */}
      {checkins.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <History className="h-4 w-4 text-zinc-400" />
            <span>{t.relationshipPage.checkinHistory} ({checkins.length})</span>
          </h4>

          <div className="space-y-3">
            {checkins.map((chk) => {
              const chkAnswers = (chk.answers as unknown as RelationshipCheckinAnswers) || {};

              return (
                <div
                  key={chk.id}
                  className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-pink-500/10 text-pink-600">
                        <Heart className="h-3.5 w-3.5 fill-pink-500" />
                      </div>
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                        تقييم {chk.checkin_date}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-400 font-bold">
                      {new Date(chk.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {chkAnswers.q_appreciation && (
                      <div className="p-3 rounded-2xl bg-pink-50/20 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-900/30 space-y-1">
                        <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300">
                          الامتنان والتقدير:
                        </span>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {chkAnswers.q_appreciation}
                        </p>
                      </div>
                    )}

                    {chkAnswers.q_next_shared_time && (
                      <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500">
                          الموعد / النشاط القادم:
                        </span>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {chkAnswers.q_next_shared_time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
