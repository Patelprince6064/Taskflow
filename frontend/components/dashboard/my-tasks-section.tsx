"use client";

/**
 * "My assigned tasks": open work assigned to the signed-in demo user.
 */

import Link from "next/link";
import { CircleCheckBig } from "lucide-react";

import { dueLabel } from "@/lib/format";
import { isOverdue } from "@/lib/task-utils";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import PriorityBadge from "@/components/ui/priority-badge";
import StatusBadge from "@/components/ui/status-badge";

const VIEW_ALL_CLASS =
  "text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export default function MyTasksSection() {
  const { tasks, currentUserId } = useDemoStore();

  const mine = tasks
    .filter((task) => task.assigneeId === currentUserId && task.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <DashboardCard
      title="My assigned tasks"
      subtitle="Open work on your plate, soonest first"
      actions={
        <Link href="/tasks/assigned" className={VIEW_ALL_CLASS}>
          View all
        </Link>
      }
    >
      {mine.length === 0 ? (
        <EmptyState
          Icon={CircleCheckBig}
          title="All caught up"
          description="You have no open tasks assigned to you."
          density="compact"
        />
      ) : (
        <ul className="divide-y divide-line">
          {mine.map((task) => (
            <li
              key={task.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 first:pt-0 last:pb-0"
            >
              <Link
                href={`/tasks/${task.id}`}
                className="min-w-0 flex-1 truncate rounded text-sm font-medium text-ink transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                {task.title}
              </Link>
              <span
                className={`shrink-0 text-xs font-medium ${
                  isOverdue(task) ? "text-rose-600" : "text-muted"
                }`}
              >
                {dueLabel(task.dueDate)}
              </span>
              <PriorityBadge priority={task.priority} className="shrink-0" />
              <StatusBadge status={task.status} className="shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
