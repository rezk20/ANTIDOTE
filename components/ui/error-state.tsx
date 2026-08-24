"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils/cn";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error;
  reset?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this section.",
  error,
  reset,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 my-4",
        className,
      )}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mb-4 font-bold text-lg">
        !
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm">
        {error?.message || description}
      </p>
      {reset && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
