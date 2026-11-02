"use client";

/**
 * Priority distribution: how the workspace's backlog is weighted.
 */

import { getPriorityCounts, PRIORITY_LABELS } from "@/lib/task-utils";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import DashboardCard from "@/components/ui/dashboard-card";
import type { TaskPriority } from "@/types/task";

const BAR_COLORS: Record<TaskPriority, string> = {
  low: "bg-slate-400",
  medium: "bg-sky-500",
  high: "bg-amber-500",
  urgent: "bg-rose-500",
};

const ORDER: TaskPriority[] = ["urgent", "high", "medium", "low"];

interface PriorityDistributionProps {
  className?: string;
}

export default function PriorityDistribution({ className }: PriorityDistributionProps) {
  const { tasks } = useDemoStore();
  const counts = getPriorityCounts(tasks);
  const total = tasks.length;

  return (
    <DashboardCard
      title="Priority distribution"
      subtitle="Open and closed tasks by priority"
      className={className}
    >
      <ul className="space-y-4">
        {ORDER.map((priority) => {
          const count = counts[priority];
          const width = total === 0 ? 0 : Math.round((count / total) * 100);

          return (
            <li key={priority}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-600">
                  {PRIORITY_LABELS[priority]}
                </span>
                <span className="text-muted tabular-nums">
                  {count} {total > 0 && `(${width}%)`}
                </span>
              </div>
              <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-line">
                <span
                  className={`block h-full rounded-full ${BAR_COLORS[priority]}`}
                  style={{ width: `${width}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
