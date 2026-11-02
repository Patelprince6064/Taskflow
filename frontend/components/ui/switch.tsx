"use client";

/**
 * Toggle switch used by the Settings placeholders.
 *
 * Built on a native checkbox so keyboard and screen-reader behaviour comes
 * for free; the visuals are customised with peer-checked utilities.
 */

import { cn } from "@/lib/cn";

interface SwitchProps {
  /** Optional id to pair with an external `<label htmlFor>`. */
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name (required for standalone switches). */
  label: string;
  /** Hide the label (renders inside the setting row instead). */
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Switch({
  id,
  checked,
  onChange,
  label,
  hideLabel = false,
  disabled = false,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-3",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-label={hideLabel ? label : undefined}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-200 peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none"
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
      {!hideLabel && <span className="text-sm text-ink">{label}</span>}
    </label>
  );
}
