"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export function CustomSelect({
  id,
  name,
  value: controlledValue,
  defaultValue,
  options,
  placeholder = "Select an option...",
  disabled = false,
  className,
  error,
  required,
  onChange,
}: CustomSelectProps) {
  const [internalValue, setInternalValue] = React.useState<string>(
    controlledValue ?? defaultValue ?? (options[0]?.value || ""),
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue) || options[0];

  // Sync when controlled value or defaultValue changes
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Click-away listener
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(val: string) {
    if (disabled) return;
    setInternalValue(val);
    onChange?.(val);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Hidden input for standard form and Server Action submissions */}
      {name && (
        <input
          type="hidden"
          name={name}
          id={id}
          value={selectedValue}
          required={required}
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-white dark:bg-zinc-800/90 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-2xs transition-all cursor-pointer select-none",
          "hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10",
          isOpen
            ? "border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/10 dark:ring-zinc-100/10"
            : error
              ? "border-rose-500 dark:border-rose-500"
              : "border-zinc-200 dark:border-zinc-800",
          disabled && "cursor-not-allowed opacity-50 bg-zinc-100 dark:bg-zinc-900",
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
                  {selectedOption.icon}
                </span>
              )}
              <span className="truncate font-medium">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-zinc-400">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-zinc-700 dark:text-zinc-300",
          )}
        />
      </button>

      {/* Floating Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute start-0 end-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-100 focus:outline-none"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs text-start transition-colors cursor-pointer select-none",
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100",
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {option.icon && (
                    <span
                      className={cn(
                        "shrink-0",
                        isSelected
                          ? "text-white dark:text-zinc-950"
                          : "text-zinc-400 dark:text-zinc-500",
                      )}
                    >
                      {option.icon}
                    </span>
                  )}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                            isSelected
                              ? "bg-white/20 text-white dark:bg-black/10 dark:text-zinc-950"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                          )}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p
                        className={cn(
                          "text-[11px] truncate mt-0.5 font-normal",
                          isSelected
                            ? "text-zinc-300 dark:text-zinc-700"
                            : "text-zinc-400 dark:text-zinc-500",
                        )}
                      >
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
