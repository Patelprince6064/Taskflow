"use client";

/**
 * Task details page view: full task information, actions (edit / complete)
 * and the per-task activity timeline. Data comes from the demo store, so the
 * page re-renders automatically after status edits.
 */

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  History,
  ListTodo,
  Pencil,
  RotateCcw,
  UserRound,
} from "lucide-react";

import { formatDate, formatDateTime } from "@/lib/format";
import { getTeamMember } from "@/lib/sample-data";
import { describeActivity, isOverdue, STATUS_LABELS } from "@/lib/task-utils";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import Button, { buttonClasses } from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import PriorityBadge from "@/components/ui/priority-badge";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { cn } from "@/lib/cn";
import type { ActivityType } from "@/types/task";

interface TaskDetailsViewProps {
  taskId: string;
}

const TIMELINE_ICON: Record<
  ActivityType,
  { label: string; iconClass: string; glyph: ReactNode }
> = {
  created: {
    label: "Created",
    iconClass: "bg-brand-50 text-brand-600 ring-brand-200",
    glyph: <ListTodo className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  assigned: {
    label: "Assigned",
    iconClass: "bg-violet-50 text-violet-600 ring-violet-200",
    glyph: <UserRound className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  status_changed: {
    label: "Status changed",
    iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    glyph: <Check className="h-3.5 w-3.5" aria-hidden="true" />,
  },
};

export default function TaskDetailsView({ taskId }: TaskDetailsViewProps) {
  const { getTask, activity, team, setTaskStatus } = useDemoStore();
  const [editOpen, setEditOpen] = useState(false);

  const task = getTask(taskId);

  if (!task) {
    return (
      <EmptyState
        Icon={ListTodo}
        title="Task not found"
        description="This task doesn’t exist in the demo workspace — it may have been removed after a data reset."
        action={
          <Link
            href="/tasks"
            className={buttonClasses("primary", "md")}
          >
            Back to tasks
          </Link>
        }
      />
    );
  }

  const assignee = getTeamMember(task.assigneeId, team);
  const creator = getTeamMember(task.createdById, team);
  const overdue = isOverdue(task);
  const completed = task.status === "completed";

  const timeline = activity.filter((event) => event.taskId === task.id);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/tasks"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to tasks
        </Link>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {overdue && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                  Overdue
                </span>
              )}
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {task.title}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Created {formatDateTime(task.createdAt)} by {creator.name}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit task
            </Button>
            {completed ? (
              <Button
                variant="secondary"
                onClick={() => setTaskStatus(task.id, "in_progress")}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reopen task
              </Button>
            ) : (
              <Button onClick={() => setTaskStatus(task.id, "completed")}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Mark as completed
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left: description + timeline */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <DashboardCard title="Description">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {task.description}
            </p>
          </DashboardCard>

          <DashboardCard
            title="Task activity"
            subtitle="Everything that has happened on this task"
          >
            {timeline.length === 0 ? (
              <p className="py-2 text-sm text-muted">No activity recorded yet.</p>
            ) : (
              <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-line">
                {timeline.map((event) => {
                  const actor = getTeamMember(event.actorId, team);
                  const style = TIMELINE_ICON[event.type];
                  const assigneeName =
                    event.type === "assigned"
                      ? getTeamMember(task.assigneeId, team).name
                      : undefined;

                  return (
                    <li key={event.id} className="relative flex gap-3">
                      <span
                        className={cn(
                          "relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                          style.iconClass,
                        )}
                      >
                        {style.glyph}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-600">
                          <span className="font-medium text-ink">
                            {actor.name}
                          </span>{" "}
                          {describeActivity(event, assigneeName)
                            .replace(`${actor.name} `, "")
                            .replace(/^./, (char) => char.toLowerCase())}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {style.label} · {formatDateTime(event.at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </DashboardCard>
        </div>

        {/* Right: metadata */}
        <DashboardCard title="Details" className="h-fit">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Status</dt>
              <dd>
                <StatusBadge status={task.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Priority</dt>
              <dd>
                <PriorityBadge priority={task.priority} />
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3 border-t border-line pt-4">
              <dt className="text-muted">Assigned to</dt>
              <dd className="flex items-center gap-2 text-right">
                <span className="truncate font-medium text-ink">
                  {assignee.name}
                </span>
                <UserAvatar name={assignee.name} id={assignee.id} size="sm" />
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-muted">Created by</dt>
              <dd className="text-right font-medium text-ink">
                {creator.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
              <dt className="inline-flex items-center gap-1.5 text-muted">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Created
              </dt>
              <dd className="text-ink">{formatDate(task.createdAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Due date</dt>
              <dd
                className={cn(
                  "font-medium",
                  overdue ? "text-rose-600" : "text-ink",
                )}
              >
                {formatDate(task.dueDate)}
              </dd>
            </div>
            {task.completedAt && (
              <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
                <dt className="inline-flex items-center gap-1.5 text-muted">
                  <History className="h-4 w-4" aria-hidden="true" />
                  Completed
                </dt>
                <dd className="text-ink">{formatDate(task.completedAt)}</dd>
              </div>
            )}
          </dl>

          <p className="mt-4 rounded-lg bg-canvas px-3 py-2 text-xs text-muted ring-1 ring-inset ring-line">
            Current status: <strong>{STATUS_LABELS[task.status]}</strong>.
            Changes here use demo data only until the API lands.
          </p>
        </DashboardCard>
      </div>

      {/* Edit dialog (frontend-only) */}
      <CreateTaskModal
        key={task.id}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
      />
    </div>
  );
}
