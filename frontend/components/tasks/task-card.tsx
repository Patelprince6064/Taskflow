"use client";

/**
 * Reusable task card used by the list view, the Kanban board and dashboard
 * sections. Shows status/priority badges, assignee, due date and an optional
 * quick status action.
 */

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Play } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatDate, todayIso } from "@/lib/format";
import {
  getNextStatus,
  getNextStatusLabel,
  isOverdue,
} from "@/lib/task-utils";
import { getTeamMember } from "@/lib/sample-data";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import PriorityBadge from "@/components/ui/priority-badge";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  /** `board` = compact Kanban card, `list` = full card with description. */
  variant?: "list" | "board";
  /** Enables the quick status button (Start / Complete). */
  onAdvance?: (task: Task) => void;
  className?: string;
}

export default function TaskCard({
  task,
  variant = "list",
  onAdvance,
  className,
}: TaskCardProps) {
  const { team } = useDemoStore();
  const assignee = getTeamMember(task.assigneeId, team);

  const overdue = isOverdue(task);
  const dueToday = task.dueDate === todayIso();
  const nextStatus = getNextStatus(task.status);
  const nextLabel = getNextStatusLabel(task.status);

  return (
    <article
      className={cn(
        "group rounded-xl border border-line bg-surface p-4 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/tasks/${task.id}`}
          className="min-w-0 rounded text-sm font-semibold text-ink transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span className="line-clamp-2">{task.title}</span>
        </Link>
        <PriorityBadge priority={task.priority} className="shrink-0" />
      </div>

      {variant === "list" && (
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />
        <span
          className={cn(
            "inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium",
            overdue
              ? "text-rose-600"
              : dueToday
                ? "text-amber-600"
                : "text-muted",
          )}
        >
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {dueToday ? "Due today" : formatDate(task.dueDate)}
          {overdue && <span className="sr-only"> (overdue)</span>}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="flex min-w-0 items-center gap-2">
          <UserAvatar
            name={assignee.name}
            id={assignee.id}
            size="sm"
          />
          <span className="truncate text-xs text-muted">
            {assignee.name}
          </span>
        </span>

        {onAdvance && nextStatus && nextLabel && (
          <button
            type="button"
            onClick={() => onAdvance(task)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
              nextStatus === "completed"
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100",
            )}
          >
            {nextStatus === "completed" ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {nextLabel}
            <ArrowRight className="h-3 w-3 opacity-60" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
