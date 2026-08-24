import { Users2 } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function RelationshipPage() {
  return (
    <PhasePlaceholder
      title="Relationship Engine (Us)"
      description="Shared activity ideas, budget-aware outing suggestions, shared wishlist, and private weekly check-in."
      phase="9"
      icon={<Users2 className="h-6 w-6 text-pink-500" />}
      scheduledText="The Us & Relationship engine with strict code-enforced privacy gates will be delivered in Phase 9."
    />
  );
}
