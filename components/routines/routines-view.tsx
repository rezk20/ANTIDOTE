"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { updateRoutineItems, resetRoutinesToDefaults } from "@/lib/actions/routines";
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

export function RoutinesView({ routines }: RoutinesViewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<RoutineTimeOfDay>("morning");
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RoutineItem | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const currentRoutine = routines.find((r) => r.time_of_day === activeTab) || routines[0];
  const items: RoutineItem[] = Array.isArray(currentRoutine?.items)
    ? (currentRoutine.items as unknown as RoutineItem[])
    : [];

  const totalMinutes = items.reduce((acc, it) => acc + (Number(it.duration_min) || 0), 0);
  const completedCount = items.filter((it) => completedItems[it.id]).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const tabConfig: Record<
    RoutineTimeOfDay,
    { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
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
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const CurrentIcon = tabConfig[activeTab]?.icon || Sun;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {t.routinesPage.title}
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t.routinesPage.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleResetDefaults}
            disabled={isPending}
            className="text-xs rounded-2xl border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 me-1.5 text-zinc-400" />
            {t.routinesPage.resetDefaults}
          </Button>

          <Button
            onClick={() => {
              setItemToEdit(null);
              setModalOpen(true);
            }}
            className="text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 me-1.5" />
            {t.routinesPage.newItem}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(Object.keys(tabConfig) as RoutineTimeOfDay[]).map((tabKey) => {
          const cfg = tabConfig[tabKey];
          const Icon = cfg.icon;
          const isActive = activeTab === tabKey;
          const routine = routines.find((r) => r.time_of_day === tabKey);
          const rItems: RoutineItem[] = Array.isArray(routine?.items)
            ? (routine.items as unknown as RoutineItem[])
            : [];
          const rMins = rItems.reduce((acc, it) => acc + (Number(it.duration_min) || 0), 0);

          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`p-4 rounded-2xl border transition-all text-start cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-md"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? "bg-white/20 dark:bg-zinc-900/20 text-white dark:text-zinc-900" : cfg.bg
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white dark:text-zinc-900" : cfg.color}`} />
                </div>
                <span className="text-[10px] font-mono font-bold opacity-80">
                  {rMins} دقيقة
                </span>
              </div>
              <div>
                <div className="text-xs font-black">{cfg.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">
                  {rItems.length} خطوات
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Routine Detail Card & Checklist */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${tabConfig[activeTab]?.bg}`}>
              <CurrentIcon className={`h-5 w-5 ${tabConfig[activeTab]?.color}`} />
            </div>
            <div>
              <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {currentRoutine?.name || tabConfig[activeTab]?.label}
              </h2>
              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {totalMinutes} دقيقة إجمالية
                </span>
                <span>•</span>
                <span>
                  إنجاز اليوم: {completedCount} من {items.length} ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="w-32 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden self-end sm:self-center">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        {items.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-400">
            لا توجد خطوات مضافة في هذا الروتين.
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, idx) => {
              const isDone = !!completedItems[item.id];

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 opacity-80"
                      : "bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-700/50 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleItemDone(item.id)}
                      className={`p-1 rounded-xl transition-all cursor-pointer ${
                        isDone ? "text-emerald-600" : "text-zinc-300 hover:text-zinc-500"
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
                        <span className="text-[10px] font-mono font-bold text-zinc-400">
                          #{idx + 1}
                        </span>
                        <h4
                          className={`text-xs font-bold text-zinc-900 dark:text-zinc-100 ${
                            isDone ? "line-through text-zinc-400 dark:text-zinc-500" : ""
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 ms-6">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                      {item.duration_min} د
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setItemToEdit(item);
                          setModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                        title={t.common.edit}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 cursor-pointer"
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
