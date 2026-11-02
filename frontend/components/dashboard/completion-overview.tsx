"use client";

/**
 * Completion overview: headline percentage plus a per-status breakdown.
 */

import { cn } from "@/lib/cn";
import { getTaskStats, STATUS_LABELS, STATUS_ORDER } from "@/lib/task-utils";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import DashboardCard from "@/components/ui/dashboard-card";
import type { TaskStatus } from "@/types/task";

const BAR_COLORS: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-brand-500",
  completed: "bg-emerald-500",
};

interface CompletionOverviewProps {
  className?: string;
}

export default function CompletionOverview({ className }: CompletionOverviewProps) {
  const { tasks } = useDemoStore();
  const stats = getTaskStats(tasks);

  const percent =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <DashboardCard
      title="Task completion overview"
      subtitle="Progress across the whole workspace"
      className={className}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <p className="text-3xl font-semibold text-ink tabular-nums">
            {percent}%
          </p>
          <p className="text-xs text-muted">completed</p>
        </div>

        <div className="min-w-0 flex-1">
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Task completion"
            className="h-2.5 w-full overflow-hidden rounded-full bg-line"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {stats.completed} of {stats.total} tasks done
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {STATUS_ORDER.map((status) => {
          const count =
            status === "todo"
              ? stats.pending
              : status === "in_progress"
                ? stats.inProgress
                : stats.completed;
          const width =
            stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);

          return (
            <li key={status} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-medium text-slate-600">
                {STATUS_LABELS[status]}
              </span>
              <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-line">
                <span
                  className={cn("block h-full rounded-full", BAR_COLORS[status])}
                  style={{ width: `${width}%` }}
                />
              </span>
              <span className="w-12 shrink-0 text-right text-xs font-medium text-ink tabular-nums">
                {count}
              </span>
            </li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}
