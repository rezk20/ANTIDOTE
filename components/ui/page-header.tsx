import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800",
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
}
