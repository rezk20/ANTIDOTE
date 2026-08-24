import { Heart } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function MarriagePage() {
  return (
    <PhasePlaceholder
      title="Marriage Mission"
      description="250,000 EGP readiness tracker, itemized expense checklists, deadlines, housing strategy, and holistic readiness."
      phase="9"
      icon={<Heart className="h-6 w-6 text-rose-500" />}
      scheduledText="The Marriage Mission comprehensive tracking module will be delivered in Phase 9."
    />
  );
}
