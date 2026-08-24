import { FileText } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function NotesPage() {
  return (
    <PhasePlaceholder
      title="Knowledge & Notes Engine"
      description="Markdown notes, 13 seeded folders, tags, search, pinned notes, and Brain Dump conversions."
      phase="7"
      icon={<FileText className="h-6 w-6 text-amber-500" />}
      scheduledText="The full Markdown Notes system and Brain Dump conversion flow will be delivered in Phase 7."
    />
  );
}
