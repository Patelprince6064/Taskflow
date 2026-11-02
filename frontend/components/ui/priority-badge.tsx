import { Flag } from "lucide-react";

import { cn } from "@/lib/cn";
import { PRIORITY_LABELS } from "@/lib/task-utils";
import type { TaskPriority } from "@/types/task";

const PRIORITY_PILL: Record<TaskPriority, string> = {
  low: "bg-slate-50 text-slate-600 ring-slate-200",
  medium: "bg-sky-50 text-sky-700 ring-sky-200",
  high: "bg-amber-50 text-amber-700 ring-amber-200",
  urgent: "bg-rose-50 text-rose-700 ring-rose-200",
};

/** Text-only colours for the compact `plain` variant. */
const PRIORITY_TEXT: Record<TaskPriority, string> = {
  low: "text-slate-500",
  medium: "text-sky-700",
  high: "text-amber-700",
  urgent: "text-rose-700",
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  /** `plain` renders coloured text without the pill (for dense tables). */
  variant?: "pill" | "plain";
  className?: string;
}

/** Indicator for how important a task is. */
export default function PriorityBadge({
  priority,
  variant = "pill",
  className,
}: PriorityBadgeProps) {
  if (variant === "plain") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium",
          PRIORITY_TEXT[priority],
          className,
        )}
      >
        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
        {PRIORITY_LABELS[priority]}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        PRIORITY_PILL[priority],
        className,
      )}
    >
      <Flag className="h-3 w-3" aria-hidden="true" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
