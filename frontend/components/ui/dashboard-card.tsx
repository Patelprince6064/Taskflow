import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface DashboardCardProps {
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Controls rendered on the right of the header (filters, links…). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Body padding override (some sections draw their own padding). */
  bodyClassName?: string;
}

/**
 * Section wrapper used across the dashboard and feature pages: white surface,
 * subtle border, rounded corners and a consistent header row.
 */
export default function DashboardCard({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-xs",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className={cn("px-5 py-4", bodyClassName)}>{children}</div>
    </section>
  );
}
