"use client";

/**
 * Styled native `<select>`.
 *
 * Native is deliberate: it is fully accessible (keyboard, screen readers,
 * mobile pickers) and needs no popup positioning logic. Only the visuals are
 * customised here.
 */

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  /** Field id so an external `<label htmlFor>` can target it. */
  id?: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<SelectOption<T>>;
  /** Visible label; also the accessible name when `aria-label` is absent. */
  label?: string;
  /** Hide the label visually (still announced by screen readers). */
  hideLabel?: boolean;
  "aria-label"?: string;
  className?: string;
}

export default function Select<T extends string>({
  id,
  value,
  onChange,
  options,
  label,
  hideLabel = false,
  className,
  ...rest
}: SelectProps<T>) {
  const accessibleLabel = rest["aria-label"] ?? label;

  return (
    <div className={cn("relative flex flex-col", className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "mb-1.5 block text-sm font-medium text-ink",
            hideLabel && "sr-only",
          )}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        aria-label={accessibleLabel}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-10 w-full appearance-none rounded-lg border border-line bg-surface pr-9 pl-3 text-sm text-ink transition-colors hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}
