import { getBrainDumps } from "@/lib/dal/brain-dump";
import { BrainDumpView } from "@/components/capture/brain-dump-view";

export const dynamic = "force-dynamic";

export default async function BrainDumpPage() {
  const dumps = await getBrainDumps("all");

  return <BrainDumpView dumps={dumps} />;
}
