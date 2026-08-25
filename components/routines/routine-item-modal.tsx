"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import type { RoutineItem } from "@/lib/schemas/routines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Clock } from "lucide-react";

interface RoutineItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: RoutineItem | null;
  onSave: (item: RoutineItem) => void;
}

export function RoutineItemModal({
  isOpen,
  onClose,
  itemToEdit,
  onSave,
}: RoutineItemModalProps) {
  const { t } = useLocale();

  const [title, setTitle] = useState(itemToEdit?.title || "");
  const [durationMin, setDurationMin] = useState(
    itemToEdit?.duration_min ? String(itemToEdit.duration_min) : "15",
  );
  const [notes, setNotes] = useState(itemToEdit?.notes || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: itemToEdit?.id || `item_${Date.now()}`,
      title: title.trim(),
      duration_min: Number(durationMin) || 15,
      is_active: itemToEdit?.is_active ?? true,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {itemToEdit ? "تعديل بند الروتين" : t.routinesPage.newItem}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="item_title" className="text-xs font-bold">
              {t.routinesPage.itemTitle} *
            </Label>
            <Input
              id="item_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: شرب كوب ماء / جلسة تركيز أولى / قراءة 20 دقيقة..."
              className="text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="duration_min" className="text-xs font-bold">
              {t.routinesPage.durationMin}
            </Label>
            <Input
              id="duration_min"
              type="number"
              min="1"
              max="240"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              className="text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="item_notes" className="text-xs font-bold">
              ملاحظات إضافية (اختياري)
            </Label>
            <Input
              id="item_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تلميح أو خطوة فرعية..."
              className="text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs rounded-xl cursor-pointer"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl cursor-pointer"
            >
              {itemToEdit ? t.common.save : t.common.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
