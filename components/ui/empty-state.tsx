import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 my-4",
        className,
      )}
    >
      {icon && (
        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mb-4 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
