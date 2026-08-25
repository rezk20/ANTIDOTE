"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { saveWishlistItem, toggleWishlistBought, deleteWishlistItem } from "@/lib/actions/relationship";
import {
  RELATIONSHIP_WISHLIST_CATEGORIES,
  type RelationshipWishlistCategory,
} from "@/lib/schemas/relationship";
import type { RelationshipWishlistRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Gift,
  Plus,
  ExternalLink,
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
  X,
} from "lucide-react";

interface RelationshipWishlistViewProps {
  wishlist: RelationshipWishlistRow[];
}

export function RelationshipWishlistView({ wishlist }: RelationshipWishlistViewProps) {
  const { t } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RelationshipWishlistRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleBought = (item: RelationshipWishlistRow) => {
    startTransition(async () => {
      await toggleWishlistBought(item.id, !item.is_bought);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      startTransition(async () => {
        await deleteWishlistItem(id);
      });
    }
  };

  const handleAdd = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: RelationshipWishlistRow) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {t.relationshipPage.wishlistTitle}
          </h3>
          <p className="text-xs text-zinc-500">
            {t.relationshipPage.wishlistSubtitle}
          </p>
        </div>

        <Button
          onClick={handleAdd}
          className="rounded-2xl text-xs font-black gap-2 bg-pink-600 hover:bg-pink-700 text-white shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.relationshipPage.newWishlistItem}</span>
        </Button>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="p-8 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
          <Gift className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            لا توجد عناصر في قائمة الرغبات حتى الآن
          </h4>
          <p className="text-[11px] text-zinc-400">
            أضف الهدايا أو مستلزمات المنزل التي ترغبان في اقتنائها لاحقاً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {wishlist.map((item) => {
            const isBought = item.is_bought;
            const categoryName = t.relationshipPage.wishlistCategories[item.category as keyof typeof t.relationshipPage.wishlistCategories] || item.category;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition-all space-y-3 flex flex-col justify-between shadow-xs ${
                  isBought
                    ? "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-70"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-pink-300 dark:hover:border-pink-800"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {categoryName}
                    </span>

                    <button
                      onClick={() => handleToggleBought(item)}
                      disabled={isPending}
                      className="p-1 rounded-full text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      title={isBought ? "إلغاء الاقتناء" : "تعليم كتم الشراء"}
                    >
                      {isBought ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <h4 className={`text-xs font-bold leading-relaxed ${isBought ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {item.title}
                  </h4>

                  {item.notes && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    {item.estimated_price ? (
                      <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                        {Number(item.estimated_price).toLocaleString()} ج.م
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-[11px]">غير محدد</span>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-zinc-400 hover:text-pink-600 transition-colors"
                        title="فتح الرابط"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="حذف"
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

      {/* Add / Edit Wishlist Item Modal */}
      <WishlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={itemToEdit}
      />
    </div>
  );
}

function WishlistModal({
  isOpen,
  onClose,
  itemToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: RelationshipWishlistRow | null;
}) {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState(itemToEdit?.title || "");
  const [category, setCategory] = useState<RelationshipWishlistCategory>(
    (itemToEdit?.category as RelationshipWishlistCategory) || "gift",
  );
  const [estimatedPrice, setEstimatedPrice] = useState(
    itemToEdit?.estimated_price ? String(itemToEdit.estimated_price) : "",
  );
  const [url, setUrl] = useState(itemToEdit?.url || "");
  const [notes, setNotes] = useState(itemToEdit?.notes || "");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const res = await saveWishlistItem({
        id: itemToEdit?.id,
        title,
        category,
        estimated_price: estimatedPrice ? Number(estimatedPrice) : null,
        url: url || null,
        priority: "medium",
        notes: notes || null,
      });

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "حدث خطأ أثناء الحفظ");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-pink-500/10 text-pink-600">
              <Gift className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
              {itemToEdit ? "تعديل الرغبة / الهدية" : t.relationshipPage.newWishlistItem}
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
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="item_title" className="text-xs font-bold">
              اسم الهدية / العنصر *
            </Label>
            <Input
              id="item_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ساعة يد مفضلة / ماكينة قهوة / طقم أكواب..."
              className="text-xs rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold">التصنيف</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RelationshipWishlistCategory)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                {RELATIONSHIP_WISHLIST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t.relationshipPage.wishlistCategories[cat as keyof typeof t.relationshipPage.wishlistCategories] || cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="item_price" className="text-xs font-bold">
                السعر التقديري (EGP)
              </Label>
              <Input
                id="item_price"
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="1500"
                className="text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="item_url" className="text-xs font-bold">
              رابط الشراء أو المعاينة (اختياري)
            </Label>
            <Input
              id="item_url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://amazon.eg/..."
              className="text-xs rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="item_notes" className="text-xs font-bold">
              ملاحظات (اللون، المقاس، المعرض...)
            </Label>
            <Textarea
              id="item_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="text-xs font-bold rounded-xl cursor-pointer"
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="text-xs font-bold rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-xs cursor-pointer"
            >
              {isPending ? t.common.saving : t.common.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
