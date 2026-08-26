"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import {
  updateRoutineItems,
  resetRoutinesToDefaults,
} from "@/lib/actions/routines";
import type { RoutineRow } from "@/lib/supabase/types";
import type { RoutineItem, RoutineTimeOfDay } from "@/lib/schemas/routines";
import { RoutineItemModal } from "./routine-item-modal";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Sun,
  Briefcase,
  Sunset,
  Moon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
} from "lucide-react";

interface RoutinesViewProps {
  routines: RoutineRow[];
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("life_os_routines_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("life_os_routines_change", callback);
  };
}

function getRoutinesSnapshot(): string {
  if (typeof window === "undefined") return "{}";
  const todayKey = new Date().toISOString().split("T")[0];
  return localStorage.getItem(`life_os_routines_done_${todayKey}`) || "{}";
}

function getRoutinesServerSnapshot(): string {
  return "{}";
}

export function RoutinesView({ routines }: RoutinesViewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<RoutineTimeOfDay>("morning");
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RoutineItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const rawStorage = useSyncExternalStore(
    subscribeToStorage,
    getRoutinesSnapshot,
    getRoutinesServerSnapshot,
  );

  const completedItems: Record<string, boolean> = (() => {
    try {
      return JSON.parse(rawStorage);
    } catch {
      return {};
    }
  })();

  const todayKey = new Date().toISOString().split("T")[0];
  const storageKey = `life_os_routines_done_${todayKey}`;

  const currentRoutine =
    routines.find((r) => r.time_of_day === activeTab) || routines[0];
  const items: RoutineItem[] = Array.isArray(currentRoutine?.items)
    ? (currentRoutine.items as unknown as RoutineItem[])
    : [];

  const totalMinutes = items.reduce(
    (acc, it) => acc + (Number(it.duration_min) || 0),
    0,
  );
  const completedCount = items.filter((it) => completedItems[it.id]).length;
  const progressPercent =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const tabConfig: Record<
    RoutineTimeOfDay,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
      bg: string;
    }
  > = {
    morning: {
      label: t.routinesPage.tabs.morning,
      icon: Sun,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    workday: {
      label: t.routinesPage.tabs.workday,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    evening: {
      label: t.routinesPage.tabs.evening,
      icon: Sunset,
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    night: {
      label: t.routinesPage.tabs.night,
      icon: Moon,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
  };

  const handleSaveItem = (item: RoutineItem) => {
    if (!currentRoutine) return;
    const existingIndex = items.findIndex((it) => it.id === item.id);
    let updated: RoutineItem[];
    if (existingIndex >= 0) {
      updated = [...items];
      updated[existingIndex] = item;
    } else {
      updated = [...items, item];
    }

    startTransition(async () => {
      await updateRoutineItems(currentRoutine.id, updated);
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentRoutine) return;
    const updated = items.filter((it) => it.id !== itemId);
    startTransition(async () => {
      await updateRoutineItems(currentRoutine.id, updated);
    });
  };

  const handleResetDefaults = () => {
    if (!confirm(t.routinesPage.resetConfirm)) return;
    startTransition(async () => {
      await resetRoutinesToDefaults();
    });
  };

  const toggleItemDone = (id: string) => {
    try {
      const next = { ...completedItems, [id]: !completedItems[id] };
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("life_os_routines_change"));
    } catch {
      // ignore
    }
  };

  const handleResetTodayChecks = () => {
    try {
      localStorage.removeItem(storageKey);
      window.dispatchEvent(new Event("life_os_routines_change"));
    } catch {
      // ignore
    }
  };

  const CurrentIcon = tabConfig[activeTab]?.icon || Sun;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {t.routinesPage.title}
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t.routinesPage.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleResetDefaults}
            disabled={isPending}
            className="cursor-pointer rounded-2xl border-zinc-200 text-xs dark:border-zinc-800"
          >
            <RotateCcw className="me-1.5 h-3.5 w-3.5 text-zinc-400" />
            {t.routinesPage.resetDefaults}
          </Button>

          <Button
            onClick={() => {
              setItemToEdit(null);
              setModalOpen(true);
            }}
            className="cursor-pointer rounded-2xl bg-zinc-900 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="me-1.5 h-4 w-4" />
            {t.routinesPage.newItem}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {(Object.keys(tabConfig) as RoutineTimeOfDay[]).map((tabKey) => {
          const cfg = tabConfig[tabKey];
          const Icon = cfg.icon;
          const isActive = activeTab === tabKey;
          const routine = routines.find((r) => r.time_of_day === tabKey);
          const rItems: RoutineItem[] = Array.isArray(routine?.items)
            ? (routine.items as unknown as RoutineItem[])
            : [];
          const rMins = rItems.reduce(
            (acc, it) => acc + (Number(it.duration_min) || 0),
            0,
          );

          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`flex cursor-pointer flex-col justify-between gap-2 rounded-2xl border p-4 text-start transition-all ${
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={`rounded-xl p-2 ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                      : cfg.bg
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white dark:text-zinc-900" : cfg.color}`}
                  />
                </div>
                <span className="font-mono text-[10px] font-bold opacity-80">
                  {rMins} دقيقة
                </span>
              </div>
              <div>
                <div className="text-xs font-black">{cfg.label}</div>
                <div className="mt-0.5 text-[10px] opacity-70">
                  {rItems.length} خطوات
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Routine Detail Card & Checklist */}
      <div className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col justify-between gap-3 border-b border-zinc-100 pb-4 sm:flex-row sm:items-center dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl p-2.5 ${tabConfig[activeTab]?.bg}`}>
              <CurrentIcon
                className={`h-5 w-5 ${tabConfig[activeTab]?.color}`}
              />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {currentRoutine?.name || tabConfig[activeTab]?.label}
              </h2>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              {completedCount > 0 && (
                <button
                  onClick={handleResetTodayChecks}
                  className="cursor-pointer text-[11px] font-bold text-zinc-400 underline hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  تصفير إنجاز اليوم
                </button>
              )}
              <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* end of div */}
            <div className="mt-2 flex items-end gap-3 self-start text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {totalMinutes} دقيقة إجمالية
              </span>
              <span>•</span>
              <span>
                إنجاز اليوم: {completedCount} من {items.length} (
                {progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Steps List */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
            لا توجد خطوات مضافة في هذا الروتين.
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, idx) => {
              const isDone = !!completedItems[item.id];

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                    isDone
                      ? "border-emerald-200/60 bg-emerald-50/50 opacity-80 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                      : "border-zinc-200/60 bg-zinc-50/70 hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleItemDone(item.id)}
                      className={`cursor-pointer rounded-xl p-1 transition-all ${
                        isDone
                          ? "text-emerald-600"
                          : "text-zinc-300 hover:text-zinc-500"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 fill-emerald-500 text-white" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-zinc-400">
                          #{idx + 1}
                        </span>
                        <h4
                          className={`text-xs font-bold text-zinc-900 dark:text-zinc-100 ${
                            isDone
                              ? "text-zinc-400 line-through dark:text-zinc-500"
                              : ""
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>
                      {item.notes && (
                        <p className="ms-6 mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-lg border border-zinc-200 bg-white px-2 py-1 font-mono text-[11px] font-bold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                      {item.duration_min} د
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setItemToEdit(item);
                          setModalOpen(true);
                        }}
                        className="cursor-pointer rounded-lg p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        title={t.common.edit}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="cursor-pointer rounded-lg p-1 text-zinc-400 hover:text-rose-600"
                        title={t.common.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RoutineItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemToEdit={itemToEdit}
        onSave={handleSaveItem}
      />
    </div>
  );
}
