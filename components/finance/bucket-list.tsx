"use client";

import { useState } from "react";
import { BucketCard } from "./bucket-card";
import { BucketModal } from "./bucket-modal";
import { BucketDetailModal } from "./bucket-detail-modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/components/providers/locale-provider";
import { Wallet, Plus } from "lucide-react";
import type { ComputedBucket } from "@/lib/logic/finance";
import type { TransactionRow } from "@/lib/supabase/types";

export function BucketList({
  buckets,
  transactions = [],
}: {
  buckets: ComputedBucket[];
  transactions?: TransactionRow[];
}) {
  const { t } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bucketToEdit, setBucketToEdit] = useState<ComputedBucket | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<ComputedBucket | null>(null);

  function handleCreate() {
    setBucketToEdit(null);
    setIsModalOpen(true);
  }

  function handleEdit(bucket: ComputedBucket) {
    setBucketToEdit(bucket);
    setIsModalOpen(true);
  }

  function handleViewDetails(bucket: ComputedBucket) {
    setSelectedBucket(bucket);
    setIsDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.finances.wallets} ({buckets.length})
          </h2>
        </div>

        <Button onClick={handleCreate} size="sm" className="gap-1.5 rounded-xl font-bold">
          <Plus className="h-4 w-4" />
          <span>{t.finances.newWallet}</span>
        </Button>
      </div>

      {/* Buckets Grid */}
      {buckets.length === 0 ? (
        <EmptyState
          icon={<Wallet className="h-6 w-6 text-blue-500" />}
          title={t.finances.noWalletsTitle}
          description={t.finances.noWalletsDesc}
          action={
            <Button onClick={handleCreate} size="sm" className="rounded-xl font-bold">
              {t.finances.newWallet}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buckets.map((bucket) => (
            <BucketCard
              key={bucket.id}
              bucket={bucket}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <BucketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bucketToEdit={bucketToEdit}
      />

      {/* Detail View Modal */}
      <BucketDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        bucket={selectedBucket}
        transactions={transactions}
        onEdit={() => {
          if (selectedBucket) handleEdit(selectedBucket);
        }}
      />
    </div>
  );
}
