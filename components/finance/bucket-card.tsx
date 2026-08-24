"use client";

import { useTransition } from "react";
import { deleteBucket } from "@/lib/actions/finance";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Heart,
  ShieldAlert,
  Briefcase,
  User,
  Laptop,
  Plane,
  Home,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import type { ComputedBucket } from "@/lib/logic/finance";

function getBucketIcon(kind: string) {
  switch (kind) {
    case "marriage":
      return <Heart className="h-5 w-5 text-rose-500" />;
    case "emergency":
      return <ShieldAlert className="h-5 w-5 text-amber-500" />;
    case "business":
      return <Briefcase className="h-5 w-5 text-blue-500" />;
    case "personal":
      return <User className="h-5 w-5 text-purple-500" />;
    case "hardware":
      return <Laptop className="h-5 w-5 text-teal-500" />;
    case "travel":
      return <Plane className="h-5 w-5 text-indigo-500" />;
    case "apartment":
      return <Home className="h-5 w-5 text-emerald-500" />;
    default:
      return <Wallet className="h-5 w-5 text-zinc-500" />;
  }
}

export function BucketCard({
  bucket,
  onEdit,
  onViewDetails,
}: {
  bucket: ComputedBucket;
  onEdit: (bucket: ComputedBucket) => void;
  onViewDetails: (bucket: ComputedBucket) => void;
}) {
  const { t, isRtl } = useLocale();
  const [isPending, startTransition] = useTransition();

  const icon = getBucketIcon(bucket.kind);

  return (
    <div className="group p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all space-y-4">
      {/* Header: Icon, Name, Kind */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
            {icon}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {bucket.name}
            </h3>
            <Badge variant="outline" className="text-[10px] font-bold uppercase">
              {bucket.kind}
            </Badge>
          </div>
        </div>

        {!bucket.is_active && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shrink-0">
            {isRtl ? "مؤرشفة" : "Archived"}
          </span>
        )}
      </div>

      {/* Balance Number */}
      <div className="space-y-1">
        <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
          {bucket.currentBalance.toLocaleString()}{" "}
          <span className="text-xs font-semibold text-zinc-400">EGP</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-medium flex-wrap">
          <span>
            {isRtl ? "الرصيد الابتدائي:" : "Starting:"}{" "}
            {Number(bucket.starting_balance).toLocaleString()} EGP
          </span>
          <span>
            • {isRtl ? "صافي الحركة:" : "Net:"}{" "}
            <span
              className={
                bucket.netChange >= 0
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-rose-600 dark:text-rose-400 font-bold"
              }
            >
              {bucket.netChange >= 0 ? "+" : ""}
              {bucket.netChange.toLocaleString()} EGP
            </span>
          </span>
        </div>
      </div>

      {/* Target Progress Bar (if set) */}
      {bucket.target_amount != null && bucket.target_amount > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            <span>
              {isRtl ? "المستهدف:" : "Target:"} {bucket.target_amount.toLocaleString()} EGP
            </span>
            <span className="text-purple-600 dark:text-purple-400">
              {bucket.progressPercent}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                bucket.kind === "marriage"
                  ? "bg-rose-500"
                  : "bg-purple-600"
              }`}
              style={{ width: `${bucket.progressPercent}%` }}
            />
          </div>

          {bucket.gap != null && bucket.gap > 0 && (
            <p className="text-[10px] text-zinc-400 font-medium">
              {isRtl ? "المتبقي للوصول للهدف:" : "Gap to goal:"}{" "}
              <span className="font-bold text-zinc-600 dark:text-zinc-300">
                {bucket.gap.toLocaleString()} EGP
              </span>
            </p>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          onClick={() => onViewDetails(bucket)}
          className="p-2 rounded-xl text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
          title={t.common.viewDetails}
        >
          <Eye className="h-4 w-4" />
        </button>

        <button
          onClick={() => onEdit(bucket)}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title={t.common.edit}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

        <button
          disabled={isPending}
          onClick={() => {
            if (
              confirm(
                `${t.common.confirmDelete} "${bucket.name}"? If transactions exist, it will be archived safely.`,
              )
            ) {
              startTransition(async () => {
                await deleteBucket(bucket.id);
              });
            }
          }}
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          title={t.common.delete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
