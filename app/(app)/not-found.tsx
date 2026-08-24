import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Compass } from "lucide-react";

export default function AppNotFound() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <EmptyState
        icon={<Compass className="h-8 w-8" />}
        title="Page not found"
        description="The section or item you are looking for does not exist in your command center."
        action={
          <Link href="/home">
            <Button variant="primary" size="sm">
              Return to Dashboard
            </Button>
          </Link>
        }
      />
    </div>
  );
}
