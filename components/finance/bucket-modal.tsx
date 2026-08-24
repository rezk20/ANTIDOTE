"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createBucket, updateBucket } from "@/lib/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/select";
import { useLocale } from "@/components/providers/locale-provider";
import { X, Wallet } from "lucide-react";
import type { BucketRow } from "@/lib/supabase/types";
import type { BucketState } from "@/lib/schemas/finance";

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

function BucketModalInnerForm({
  bucketToEdit,
  onClose,
}: {
  bucketToEdit?: BucketRow | null;
  onClose: () => void;
}) {
  const { t, isRtl } = useLocale();
  const isEditing = Boolean(bucketToEdit);

  const actionWithId = isEditing
    ? updateBucket.bind(null, bucketToEdit!.id)
    : createBucket;

  const [state, formAction] = useActionState<BucketState, FormData>(
    actionWithId,
    { ok: false },
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      onClose();
    }
  }, [state?.ok, onClose]);

  const kindOptions = [
    { value: "marriage", label: isRtl ? "💍 زواج (Marriage)" : "💍 Marriage" },
    { value: "emergency", label: isRtl ? "🛡️ طوارئ (Emergency)" : "🛡️ Emergency" },
    { value: "business", label: isRtl ? "💼 بيزنس واستثمار (Business)" : "💼 Business" },
    { value: "personal", label: isRtl ? "👤 شخصي واحتياطي (Personal)" : "👤 Personal" },
    { value: "hardware", label: isRtl ? "💻 أجهزة وتجهيزات (Hardware)" : "💻 Hardware" },
    { value: "travel", label: isRtl ? "✈️ سفر وسياحة (Travel)" : "✈️ Travel" },
    { value: "apartment", label: isRtl ? "🏠 سكن وإيجار (Apartment)" : "🏠 Apartment" },
    { value: "other", label: isRtl ? "⚙️ أخرى (Other)" : "⚙️ Other" },
  ];

  return (
    <form ref={formRef} action={formAction} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
      {state?.message && !state.ok && (
        <div className="p-3.5 rounded-2xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {state.message}
        </div>
      )}

      {/* Name */}
      <div>
        <Label htmlFor="name" required>
          {t.finances.walletName}
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={bucketToEdit?.name ?? ""}
          placeholder="e.g. Marriage Fund / Emergency Reserve"
          error={state?.errors?.name?.[0]}
          autoFocus
          required
        />
      </div>

      {/* Kind */}
      <div>
        <Label htmlFor="kind" required>
          {t.finances.walletKind}
        </Label>
        <CustomSelect
          id="kind"
          name="kind"
          defaultValue={bucketToEdit?.kind ?? "marriage"}
          options={kindOptions}
        />
      </div>

      {/* Starting Balance & Target Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="starting_balance">
            {t.finances.startingBalance} (EGP)
          </Label>
          <Input
            id="starting_balance"
            name="starting_balance"
            type="number"
            step="any"
            min="0"
            defaultValue={bucketToEdit?.starting_balance ?? 0}
            placeholder="0"
            error={state?.errors?.starting_balance?.[0]}
          />
        </div>

        <div>
          <Label htmlFor="target_amount">
            {t.finances.targetAmount} (EGP)
          </Label>
          <Input
            id="target_amount"
            name="target_amount"
            type="number"
            step="any"
            min="0"
            defaultValue={bucketToEdit?.target_amount ?? ""}
            placeholder="e.g. 250000"
            error={state?.errors?.target_amount?.[0]}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Button type="button" variant="outline" size="md" onClick={onClose} className="rounded-xl">
          {t.common.cancel}
        </Button>
        <SubmitButton text={isEditing ? t.common.save : t.common.create} />
      </div>
    </form>
  );
}

export function BucketModal({
  isOpen,
  onClose,
  bucketToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  bucketToEdit?: BucketRow | null;
}) {
  const { t } = useLocale();
  const isEditing = Boolean(bucketToEdit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? t.finances.editWallet : t.finances.newWallet}
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

        <BucketModalInnerForm
          key={bucketToEdit?.id ?? "new"}
          bucketToEdit={bucketToEdit}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
