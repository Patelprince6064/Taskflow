"use client";

/**
 * Recent tasks section: the five newest tasks in the workspace.
 */

import Link from "next/link";

import { formatDate } from "@/lib/format";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import PriorityBadge from "@/components/ui/priority-badge";
import StatusBadge from "@/components/ui/status-badge";
import { ClipboardList } from "lucide-react";

const VIEW_ALL_CLASS =
  "text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export default function RecentTasks() {
  const { tasks } = useDemoStore();

  const recent = [...tasks]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardCard
      title="Recent tasks"
      subtitle="Newest additions to the workspace"
      actions={
        <Link href="/tasks" className={VIEW_ALL_CLASS}>
          View all
        </Link>
      }
    >
      {recent.length === 0 ? (
        <EmptyState
          Icon={ClipboardList}
          title="No tasks yet"
          description="Create the first task to see it here."
          density="compact"
        />
      ) : (
        <ul className="divide-y divide-line">
          {recent.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/tasks/${task.id}`}
                  className="block truncate rounded text-sm font-medium text-ink transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  {task.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted">
                  Created {formatDate(task.createdAt)}
                </p>
              </div>
              <PriorityBadge priority={task.priority} className="hidden shrink-0 sm:inline-flex" />
              <StatusBadge status={task.status} className="shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
