import { cn } from "@/lib/cn";
import { STATUS_LABELS } from "@/lib/task-utils";
import type { TaskStatus } from "@/types/task";

const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-600 ring-slate-200",
  in_progress: "bg-brand-50 text-brand-700 ring-brand-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const STATUS_DOT: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-brand-500",
  completed: "bg-emerald-500",
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

/** Pill showing a task's workflow state. */
export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
