"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured by boundary:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-12">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred while loading this section of the command center."
        error={error}
        reset={reset}
      />
    </div>
  );
}
