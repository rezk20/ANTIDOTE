import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export interface PhasePlaceholderProps {
  title: string;
  description: string;
  phase: string;
  icon: React.ReactNode;
  scheduledText: string;
}

export function PhasePlaceholder({
  title,
  description,
  phase,
  icon,
  scheduledText,
}: PhasePlaceholderProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={title}
        description={description}
        badge={<Badge variant="accent">Phase {phase}</Badge>}
      />

      <EmptyState
        icon={icon}
        title={`${title} Module`}
        description={scheduledText}
        action={
          <Link href="/home">
            <Button variant="secondary" size="sm">
              Back to Command Center
            </Button>
          </Link>
        }
      />
    </div>
  );
}
