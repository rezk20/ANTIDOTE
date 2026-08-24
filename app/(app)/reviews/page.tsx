import { Clock } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  return (
    <PhasePlaceholder
      title="Weekly & Monthly Review Engine"
      description="Reflect on weekly outcomes, multi-dimensional progress scores, and planning for the upcoming week."
      phase="8"
      icon={<Clock className="h-6 w-6 text-teal-500" />}
      scheduledText="The Reviews framework and Weekly Review flow will be delivered in Phase 8 (MVP Checkpoint)."
    />
  );
}
