import { getBrainDumps } from "@/lib/dal/brain-dump";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { QuickCaptureBox } from "@/components/capture/quick-capture-box";
import { BrainDumpItem } from "@/components/capture/brain-dump-item";
import { Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrainDumpPage() {
  const dumps = await getBrainDumps("inbox");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Brain Dump Inbox"
        description="Fast capture for ideas, tasks, notes, or worries. Clear your working memory now and convert or organize them later."
        badge={
          <Badge variant="secondary">
            {dumps.length} {dumps.length === 1 ? "Item" : "Items"}
          </Badge>
        }
      />

      {/* Top Capture Box */}
      <QuickCaptureBox placeholder="Capture a thought, task, or lead before you forget it..." />

      {/* Dumps List */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Unprocessed Captures
        </h2>

        {dumps.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Inbox Zero"
            description="Your brain dump inbox is completely clear. Press B anywhere to quickly capture a new thought."
          />
        ) : (
          <div className="space-y-2.5">
            {dumps.map((dump) => (
              <BrainDumpItem key={dump.id} dump={dump} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
