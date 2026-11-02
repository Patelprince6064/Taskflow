"use client";

/**
 * Kanban board: To Do / In Progress / Completed columns built from the same
 * `TaskCard` used by the list view.
 */

import { cn } from "@/lib/cn";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/task-utils";
import EmptyState from "@/components/ui/empty-state";
import TaskCard from "@/components/tasks/task-card";
import type { Task, TaskStatus } from "@/types/task";
import { CircleDashed } from "lucide-react";

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-brand-500",
  completed: "bg-emerald-500",
};

interface KanbanBoardProps {
  tasks: Task[];
  onAdvance?: (task: Task) => void;
}

export default function KanbanBoard({ tasks, onAdvance }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {STATUS_ORDER.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <section
            key={status}
            aria-label={`${STATUS_LABELS[status]} column`}
            className="flex min-w-0 flex-col rounded-2xl border border-line bg-canvas/70 p-3"
          >
            <header className="flex items-center gap-2 px-1 pb-3">
              <span
                className={cn("h-2 w-2 rounded-full", COLUMN_ACCENT[status])}
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-ink">
                {STATUS_LABELS[status]}
              </h3>
              <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted ring-1 ring-inset ring-line tabular-nums">
                {columnTasks.length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-3">
              {columnTasks.length === 0 ? (
                <EmptyState
                  title="Nothing here"
                  description={`Tasks marked “${STATUS_LABELS[status]}” will appear in this column.`}
                  Icon={CircleDashed}
                  density="compact"
                />
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    variant="board"
                    onAdvance={onAdvance}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
