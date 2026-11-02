"use client";

/**
 * Tabular list view of tasks. Wraps in a horizontal scroll container so the
 * layout never overflows the page on small screens.
 */

import Link from "next/link";
import { Check, Play } from "lucide-react";

import { formatDate, todayIso } from "@/lib/format";
import {
  getNextStatus,
  getNextStatusLabel,
  isOverdue,
} from "@/lib/task-utils";
import { getTeamMember } from "@/lib/sample-data";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import { cn } from "@/lib/cn";
import PriorityBadge from "@/components/ui/priority-badge";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import type { Task } from "@/types/task";

interface TaskTableProps {
  tasks: Task[];
  onAdvance?: (task: Task) => void;
}

const HEADERS = ["Task", "Assignee", "Priority", "Status", "Due date", ""] as const;

export default function TaskTable({ tasks, onAdvance }: TaskTableProps) {
  const { team } = useDemoStore();

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-xs">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-xs font-semibold tracking-wide text-muted uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tasks.map((task) => {
            const assignee = getTeamMember(task.assigneeId, team);
            const overdue = isOverdue(task);
            const dueToday = task.dueDate === todayIso();
            const nextStatus = getNextStatus(task.status);
            const nextLabel = getNextStatusLabel(task.status);

            return (
              <tr
                key={task.id}
                className="transition-colors hover:bg-canvas/70"
              >
                <td className="max-w-[280px] px-4 py-3">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="block truncate rounded text-sm font-medium text-ink transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {task.title}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {task.description}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <UserAvatar
                      name={assignee.name}
                      id={assignee.id}
                      size="sm"
                    />
                    <span className="whitespace-nowrap text-sm text-slate-600">
                      {assignee.name}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "whitespace-nowrap text-sm",
                      overdue
                        ? "font-medium text-rose-600"
                        : dueToday
                          ? "font-medium text-amber-600"
                          : "text-slate-600",
                    )}
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    >
                      View
                    </Link>
                    {onAdvance && nextStatus && nextLabel && (
                      <button
                        type="button"
                        onClick={() => onAdvance(task)}
                        aria-label={`${nextLabel} “${task.title}”`}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                      >
                        {nextStatus === "completed" ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {nextLabel}
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
