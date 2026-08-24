import { Sun } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  return (
    <PhasePlaceholder
      title="Today's Mission & Execution"
      description="Daily execution command: Top 3 priority actions, work block capacity guards, money/personal/relationship actions, and shutdown workflow."
      phase="6"
      icon={<Sun className="h-6 w-6 text-amber-500" />}
      scheduledText="The Today engine will be implemented in Phase 6, synthesizing real data from Tasks, Leads, and Finance."
    />
  );
}
