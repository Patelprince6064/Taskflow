"use client";

/**
 * Team activity feed: the latest events across the workspace, derived from
 * the demo store's activity log.
 */

import Link from "next/link";
import { Activity } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import { getTeamMember } from "@/lib/sample-data";
import { describeActivity } from "@/lib/task-utils";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import UserAvatar from "@/components/ui/user-avatar";

export default function TeamActivity() {
  const { activity, tasks } = useDemoStore();

  const recent = activity.slice(0, 6);

  return (
    <DashboardCard
      title="Team activity"
      subtitle="What teammates have been doing lately"
    >
      {recent.length === 0 ? (
        <EmptyState
          Icon={Activity}
          title="No activity yet"
          description="Actions on tasks will show up here."
          density="compact"
        />
      ) : (
        <ol className="relative space-y-4 before:absolute before:top-1 before:bottom-1 before:left-[15px] before:w-px before:bg-line">
          {recent.map((event) => {
            const actor = getTeamMember(event.actorId);
            const task = tasks.find((item) => item.id === event.taskId);
            const assigneeName =
              event.type === "assigned" && task
                ? getTeamMember(task.assigneeId).name
                : undefined;

            return (
              <li key={event.id} className="relative flex gap-3">
                <UserAvatar
                  name={actor.name}
                  id={actor.id}
                  size="sm"
                  className="relative z-10 ring-2 ring-surface"
                />
                <div className="min-w-0 flex-1 pb-0.5">
                  <p className="text-sm text-slate-600">
                    {describeActivity(event, assigneeName)}
                    {task && (
                      <>
                        {" · "}
                        <Link
                          href={`/tasks/${task.id}`}
                          className="font-medium text-brand-600 transition-colors hover:text-brand-700"
                        >
                          View task
                        </Link>
                      </>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDateTime(event.at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardCard>
  );
}
