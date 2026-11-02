"use client";

/**
 * Toolbar for the tasks views: search, status/priority filters, due-date
 * sorting and the List ⇄ Kanban view switcher.
 */

import { LayoutGrid, Table2 } from "lucide-react";

import { cn } from "@/lib/cn";
import {
  PRIORITY_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
  type SortKey,
} from "@/lib/task-utils";
import SearchBar from "@/components/ui/search-bar";
import Select from "@/components/ui/select";
import type { TaskPriority, TaskStatus } from "@/types/task";

export type TaskViewMode = "list" | "kanban";

interface TaskToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TaskStatus | "all";
  onStatusChange: (value: TaskStatus | "all") => void;
  priority: TaskPriority | "all";
  onPriorityChange: (value: TaskPriority | "all") => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  view: TaskViewMode;
  onViewChange: (value: TaskViewMode) => void;
  /** Number of tasks currently shown (announced next to the filters). */
  resultCount: number;
}

export default function TaskToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  resultCount,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-xs lg:flex-row lg:items-center">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search by title or description…"
        label="Search tasks"
        className="w-full lg:max-w-xs"
      />

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={onStatusChange}
          className="w-full sm:w-auto"
          options={[
            { value: "all", label: "All statuses" },
            ...(Object.keys(STATUS_LABELS) as TaskStatus[]).map((value) => ({
              value,
              label: STATUS_LABELS[value],
            })),
          ]}
        />
        <Select
          aria-label="Filter by priority"
          value={priority}
          onChange={onPriorityChange}
          className="w-full sm:w-auto"
          options={[
            { value: "all", label: "All priorities" },
            ...(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((value) => ({
              value,
              label: PRIORITY_LABELS[value],
            })),
          ]}
        />
        <Select
          aria-label="Sort tasks"
          value={sort}
          onChange={onSortChange}
          className="col-span-2 w-full sm:col-span-1 sm:w-auto"
          options={(Object.keys(SORT_LABELS) as SortKey[]).map((value) => ({
            value,
            label: SORT_LABELS[value],
          }))}
        />
      </div>

      <div className="flex items-center gap-3 lg:ml-auto">
        <p
          aria-live="polite"
          className="hidden whitespace-nowrap text-xs text-muted sm:block"
        >
          {resultCount} {resultCount === 1 ? "task" : "tasks"}
        </p>

        {/* View switcher */}
        <div
          role="group"
          aria-label="View mode"
          className="flex rounded-lg border border-line bg-canvas p-0.5"
        >
          {(["list", "kanban"] as const).map((mode) => {
            const active = view === mode;
            const Icon = mode === "list" ? Table2 : LayoutGrid;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => onViewChange(mode)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                  active
                    ? "bg-surface text-ink shadow-xs"
                    : "text-muted hover:text-ink",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {mode === "list" ? "List" : "Kanban"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
