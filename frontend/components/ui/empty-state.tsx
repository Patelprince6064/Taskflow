import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Lucide icon shown in the muted circle (defaults to `Inbox`). */
  Icon?: LucideIcon;
  /** Optional call-to-action node (e.g. a "Create task" button). */
  action?: ReactNode;
  /**
   * `compact` tightens padding and drops the dashed border — used inside
   * cards/columns where a full-size state would be too heavy.
   */
  density?: "default" | "compact";
  className?: string;
}

/** Friendly placeholder shown when a list, board or feed has no content. */
export default function EmptyState({
  title,
  description,
  Icon = Inbox,
  action,
  density = "default",
  className,
}: EmptyStateProps) {
  const compact = density === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl bg-surface px-6 text-center",
        compact
          ? "py-8"
          : "border border-dashed border-line py-12",
        className,
      )}
    >
      <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-muted ring-1 ring-inset ring-line">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
