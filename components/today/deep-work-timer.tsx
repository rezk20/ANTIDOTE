"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { logTimerSession } from "@/lib/actions/time-tracking";
import type { TimeEntryKind } from "@/lib/schemas/time-entry";
import type { WeeklyTimeDistribution } from "@/lib/logic/time-tracking";
import type { TaskRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Square,
  Sparkles,
  Flame,
  X,
} from "lucide-react";

interface DeepWorkTimerProps {
  plannedTasks: TaskRow[];
  weeklyDistribution: WeeklyTimeDistribution;
}

export function DeepWorkTimer({
  plannedTasks,
  weeklyDistribution,
}: DeepWorkTimerProps) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [sessionKind, setSessionKind] = useState<TimeEntryKind>("deep_work");

  // Post-Session Rating Modal
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [focusRating, setFocusRating] = useState<number>(4);
  const [sessionNote, setSessionNote] = useState<string>("");
  const [completedSessionData, setCompletedSessionData] = useState<{
    startedAt: string;
    endedAt: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    const start = sessionStartTime || new Date().toISOString();
    const end = new Date().toISOString();

    setCompletedSessionData({ startedAt: start, endedAt: end });
    setRatingModalOpen(true);

    // Reset timer
    setSessionStartTime(null);
    setSecondsLeft(initialSeconds);
  }, [initialSeconds, sessionStartTime]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleStop]);

  const handleStart = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleSaveRating = () => {
    if (!completedSessionData) return;

    startTransition(async () => {
      await logTimerSession({
        task_id: selectedTaskId || null,
        kind: sessionKind,
        started_at: completedSessionData.startedAt,
        ended_at: completedSessionData.endedAt,
        focus_rating: focusRating,
        note: sessionNote || null,
      });

      setRatingModalOpen(false);
      setCompletedSessionData(null);
      setSessionNote("");
    });
  };

  const setPreset = (mins: number) => {
    if (isRunning) return;
    const totalSecs = mins * 60;
    setInitialSeconds(totalSecs);
    setSecondsLeft(totalSecs);
    setSessionStartTime(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const selectedTask = plannedTasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="p-6 rounded-3xl bg-zinc-900 text-white shadow-xl border border-zinc-800 space-y-6">
      {/* Header & Weekly Total */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight">
              {t.timeTracking.timerTitle}
            </h3>
            <p className="text-[11px] text-zinc-400">
              جلسات تركيز عميق مستمرة وتوثيق دقيق لساعات العمل
            </p>
          </div>
        </div>

        {/* Weekly Stats Summary */}
        <div className="flex items-center gap-4 bg-zinc-800/80 px-4 py-2.5 rounded-2xl border border-zinc-700/60">
          <div>
            <div className="text-[10px] font-bold text-zinc-400">
              {t.timeTracking.weeklyTotal}
            </div>
            <div className="text-sm font-black text-orange-400">
              {weeklyDistribution.totalHours} ساعة
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-300">
            <span title={t.timeTracking.deepWork}>🧠 {weeklyDistribution.deepWorkHours}h</span>
            <span title={t.timeTracking.revenue}>💼 {weeklyDistribution.revenueHours}h</span>
            <span title={t.timeTracking.learning}>📚 {weeklyDistribution.learningHours}h</span>
          </div>
        </div>
      </div>

      {/* Main Timer Display & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Task & Mode Picker */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">
              {t.timeTracking.selectTask}
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isRunning}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
            >
              <option value="">-- مهمة عامة بدون ربط --</option>
              {plannedTasks.map((tk) => (
                <option key={tk.id} value={tk.id}>
                  {tk.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">
              {t.timeTracking.kind}
            </label>
            <select
              value={sessionKind}
              onChange={(e) => setSessionKind(e.target.value as TimeEntryKind)}
              disabled={isRunning}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
            >
              <option value="deep_work">عمل عميق (Deep Work)</option>
              <option value="delivery">تسليم متطلبات العملاء (Delivery)</option>
              <option value="sales">مبيعات وتواصل (Sales/Outreach)</option>
              <option value="learning">تعلم تقني (Learning)</option>
              <option value="relationship">العلاقات والأسرة (Relationship)</option>
              <option value="rest">استراحة واستشفاء (Rest)</option>
            </select>
          </div>
        </div>

        {/* Center: Large Digital Countdown */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="text-5xl md:text-6xl font-black font-mono tracking-wider text-white">
            {formatTime(secondsLeft)}
          </div>

          {selectedTask && (
            <div className="text-xs font-bold text-orange-400 line-clamp-1 max-w-[240px]">
              🎯 {selectedTask.title}
            </div>
          )}

          {/* Presets */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPreset(25)}
              disabled={isRunning}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                initialSeconds === 25 * 60
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              25 د
            </button>
            <button
              onClick={() => setPreset(50)}
              disabled={isRunning}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                initialSeconds === 50 * 60
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              50 د
            </button>
            <button
              onClick={() => setPreset(90)}
              disabled={isRunning}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                initialSeconds === 90 * 60
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              90 د
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col items-center sm:items-end justify-center gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="w-full sm:w-44 py-6 font-black text-sm bg-orange-600 hover:bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-600/30 cursor-pointer"
            >
              <Play className="h-5 w-5 me-2 fill-white" />
              {sessionStartTime ? t.timeTracking.resume : t.timeTracking.start}
            </Button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-44">
              <Button
                onClick={handlePause}
                variant="outline"
                className="flex-1 py-6 font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 rounded-2xl cursor-pointer"
              >
                <Pause className="h-4 w-4 me-1.5" />
                {t.timeTracking.pause}
              </Button>
              <Button
                onClick={() => handleStop()}
                className="flex-1 py-6 font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-2xl cursor-pointer"
              >
                <Square className="h-4 w-4 me-1.5 fill-white" />
                {t.timeTracking.stop}
              </Button>
            </div>
          )}

          <div className="text-[10px] text-zinc-500 text-center sm:text-end w-full">
            {isRunning ? "🔴 الجلسة جارية الآن — احمِ تركيزك" : "جاهز للبدء"}
          </div>
        </div>
      </div>

      {/* Post-Session Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-zinc-900 text-white rounded-3xl p-6 border border-zinc-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-400" />
                <h4 className="text-sm font-black">
                  {t.timeTracking.focusPrompt}
                </h4>
              </div>
              <button
                onClick={() => setRatingModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">
                {t.timeTracking.focusRating}
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFocusRating(rate)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      focusRating === rate
                        ? "bg-orange-500 text-white scale-105"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">
                ملاحظات أو مخرجات الجلسة (اختياري)
              </label>
              <input
                type="text"
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                placeholder="ما الذي أنجزته في هذه الجلسة؟"
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
              />
            </div>

            <Button
              onClick={handleSaveRating}
              disabled={isPending}
              className="w-full py-2.5 text-xs font-black bg-orange-600 hover:bg-orange-500 text-white rounded-xl cursor-pointer"
            >
              {isPending ? t.common.saving : "حفظ الجلسة في سجل الوقت"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
