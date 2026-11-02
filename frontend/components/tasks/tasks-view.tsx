"use client";

/**
 * Shared client view behind every `/tasks*` route. The `scope` prop decides
 * which slice of the workspace is shown (mine / assigned / created /
 * completed) while search, filters, sorting and view mode stay local.
 */

import { useMemo, useState } from "react";
import { ListTodo } from "lucide-react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import {
  queryTasks,
  type SortKey,
} from "@/lib/task-utils";
import EmptyState from "@/components/ui/empty-state";
import Button from "@/components/ui/button";
import KanbanBoard from "@/components/tasks/kanban-board";
import TaskTable from "@/components/tasks/task-table";
import TaskToolbar, { type TaskViewMode } from "@/components/tasks/task-toolbar";
import type {
  Task,
  TaskPriority,
  TaskScope,
  TaskStatus,
} from "@/types/task";

interface TasksViewProps {
  scope: TaskScope;
}

const SCOPE_TITLES: Record<TaskScope, { empty: string; hint: string }> = {
  mine: {
    empty: "No tasks found",
    hint: "Tasks assigned to you or created by you will show up here.",
  },
  assigned: {
    empty: "Nothing assigned to you",
    hint: "Tasks other teammates assign to you will appear here.",
  },
  created: {
    empty: "You haven’t created any tasks",
    hint: "Tasks you create for the team will appear here.",
  },
  completed: {
    empty: "No completed tasks yet",
    hint: "Tasks you finish will be collected here.",
  },
};

export default function TasksView({ scope }: TasksViewProps) {
  const { tasks, search, setSearch, currentUserId, setTaskStatus } =
    useDemoStore();

  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<TaskPriority | "all">("all");
  const [sort, setSort] = useState<SortKey>("due_soonest");
  const [view, setView] = useState<TaskViewMode>("list");

  const filtered = useMemo(
    () =>
      queryTasks(tasks, {
        scope,
        search,
        status,
        priority,
        sort,
        userId: currentUserId,
      }),
    [tasks, scope, search, status, priority, sort, currentUserId],
  );

  const hasActiveFilters =
    search.trim().length > 0 || status !== "all" || priority !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setPriority("all");
  }

  function advance(task: Task) {
    if (task.status === "todo") setTaskStatus(task.id, "in_progress");
    else if (task.status === "in_progress") setTaskStatus(task.id, "completed");
  }

  const copy = SCOPE_TITLES[scope];

  return (
    <div className="flex flex-col gap-4">
      <TaskToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState
          Icon={ListTodo}
          title={hasActiveFilters ? "No tasks match your filters" : copy.empty}
          description={
            hasActiveFilters
              ? "Try a different search term or clear the active filters."
              : copy.hint
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <span className="text-xs text-muted">
                Use the “Create Task” button in the top bar to add one.
              </span>
            )
          }
        />
      ) : view === "list" ? (
        <TaskTable tasks={filtered} onAdvance={advance} />
      ) : (
        <KanbanBoard tasks={filtered} onAdvance={advance} />
      )}
    </div>
  );
}
