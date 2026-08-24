import { Calendar } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <PhasePlaceholder
      title="Calendar & Protected Schedule"
      description="Day time blocks, week commitments, month deadlines, collision detection, and Friday protection."
      phase="11"
      icon={<Calendar className="h-6 w-6 text-sky-500" />}
      scheduledText="The Calendar and Cash-flow projection schedule will be delivered in Phase 11."
    />
  );
}
