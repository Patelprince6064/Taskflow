"use client";

import { Search, X } from "lucide-react";
import type { KeyboardEvent } from "react";

import { cn } from "@/lib/cn";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Extra key handler (e.g. Enter to jump to the tasks page). */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** Placeholder text; also used for the screen-reader label if none given. */
  placeholder?: string;
  /** Accessible label (defaults to `placeholder`). */
  label?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Controlled search input with clear button.
 *
 * The label is visually hidden but always present so screen readers announce
 * the field correctly.
 */
export default function SearchBar({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search…",
  label,
  className,
  autoFocus,
}: SearchBarProps) {
  const accessibleLabel = label ?? placeholder;

  return (
    <div className={cn("relative", className)}>
      <span className="sr-only">{accessibleLabel}</span>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="text"
        role="searchbox"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="h-10 w-full rounded-lg border border-line bg-surface pr-9 pl-9 text-sm text-ink transition-colors placeholder:text-muted hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
