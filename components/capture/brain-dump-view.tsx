"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { QuickCaptureBox } from "@/components/capture/quick-capture-box";
import { BrainDumpItem } from "@/components/capture/brain-dump-item";
import { ConversionModal } from "@/components/capture/conversion-modal";
import { useLocale } from "@/components/providers/locale-provider";
import { Inbox, CheckCircle2, Layers } from "lucide-react";
import type { BrainDumpRow } from "@/lib/supabase/types";

export function BrainDumpView({
  dumps = [],
}: {
  dumps: BrainDumpRow[];
}) {
  const { t } = useLocale();

  const [activeTab, setActiveTab] = useState<"inbox" | "converted" | "all">("inbox");
  const [selectedDumpForConversion, setSelectedDumpForConversion] = useState<BrainDumpRow | null>(null);
  const [isConversionOpen, setIsConversionOpen] = useState(false);

  const inboxDumps = dumps.filter((d) => d.status === "inbox");
  const convertedDumps = dumps.filter((d) => d.status === "converted");

  const displayedDumps =
    activeTab === "inbox"
      ? inboxDumps
      : activeTab === "converted"
        ? convertedDumps
        : dumps;

  function handleOpenConversion(dump: BrainDumpRow) {
    setSelectedDumpForConversion(dump);
    setIsConversionOpen(true);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      <PageHeader
        title={t.capture.inboxTitle}
        description={t.capture.inboxSubtitle}
        badge={
          <Badge variant="secondary">
            {inboxDumps.length} {t.conversions.tabs.inbox}
          </Badge>
        }
      />

      {/* Top Capture Box */}
      <QuickCaptureBox placeholder={t.capture.placeholder} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "inbox"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          <span>{t.conversions.tabs.inbox}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700">
            {inboxDumps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("converted")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "converted"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />
          <span>{t.conversions.tabs.converted}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700">
            {convertedDumps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{t.conversions.tabs.all}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700">
            {dumps.length}
          </span>
        </button>
      </div>

      {/* Dumps List */}
      <div className="space-y-3 pt-2">
        {displayedDumps.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title={t.capture.noDumpsTitle}
            description={t.capture.noDumpsDesc}
          />
        ) : (
          <div className="space-y-2.5">
            {displayedDumps.map((dump) => (
              <BrainDumpItem
                key={dump.id}
                dump={dump}
                onConvert={handleOpenConversion}
              />
            ))}
          </div>
        )}
      </div>

      {/* Conversion Modal Wizard */}
      <ConversionModal
        isOpen={isConversionOpen}
        onClose={() => setIsConversionOpen(false)}
        dump={selectedDumpForConversion}
      />
    </div>
  );
}
