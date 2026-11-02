import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Surface container used for every grouped block in the dashboard. */
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-6 shadow-sm ${className}`.trim()}
    >
      {children}
    </div>
  );
}

interface CardTextProps {
  children: ReactNode;
  className?: string;
}

/** Heading for a `Card`. */
export function CardTitle({ children, className = "" }: CardTextProps) {
  return (
    <h3
      className={`text-base font-semibold tracking-tight text-ink ${className}`.trim()}
    >
      {children}
    </h3>
  );
}

/** Supporting copy for a `Card`. */
export function CardDescription({ children, className = "" }: CardTextProps) {
  return (
    <p
      className={`text-sm leading-relaxed text-muted ${className}`.trim()}
    >
      {children}
    </p>
  );
}
