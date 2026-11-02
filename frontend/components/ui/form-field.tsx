import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** `aria-describedby` target for a field's error message. */
export function fieldErrorId(id: string): string {
  return `${id}-error`;
}

/** `aria-describedby` target for a field's hint text. */
export function fieldHintId(id: string): string {
  return `${id}-hint`;
}

interface FormFieldProps {
  /** Unique field id (labels and described-by wiring use it). */
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

/** Label + control + hint/error scaffold for consistent form layouts. */
export default function FormField({
  id,
  label,
  children,
  hint,
  error,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-ink"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={fieldHintId(id)} className="text-xs text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={fieldErrorId(id)}
          role="alert"
          className="text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
