/**
 * Pure query/derivation helpers for tasks.
 *
 * All dashboard maths and task-list behaviour lives here as plain functions
 * so components stay presentational and the same logic can be reused when a
 * real API replaces the demo store.
 */

import { todayIso } from "@/lib/format";
import { getTeamMember } from "@/lib/sample-data";
import type {
  ActivityEvent,
  Task,
  TaskPriority,
  TaskScope,
  TaskStatus,
} from "@/types/task";

/** Canonical display labels (single source for badges, headers and selects). */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

/** Kanban column order. */
export const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "completed"];

/** Index = severity, so higher sorts first. */
const PRIORITY_RANK: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
};

export type SortKey = "due_soonest" | "due_latest" | "priority" | "title";

export const SORT_LABELS: Record<SortKey, string> = {
  due_soonest: "Due date: soonest first",
  due_latest: "Due date: latest first",
  priority: "Priority: highest first",
  title: "Title: A–Z",
};

/** A task is overdue when it is unfinished and its due date has passed. */
export function isOverdue(task: Task): boolean {
  return task.status !== "completed" && task.dueDate < todayIso();
}

/**
 * Which slice of the workspace a scope link shows.
 *
 * - `mine`     - work involving the current user (assigned to or created by them)
 * - `assigned` - work the current user must do
 * - `created`  - work the current user raised for others
 * - `completed`- finished work assigned to the current user
 */
export function matchesScope(
  task: Task,
  scope: TaskScope,
  userId: string,
): boolean {
  switch (scope) {
    case "mine":
      return task.assigneeId === userId || task.createdById === userId;
    case "assigned":
      return task.assigneeId === userId;
    case "created":
      return task.createdById === userId;
    case "completed":
      return task.status === "completed" && task.assigneeId === userId;
  }
}

export interface TaskQuery {
  /** Scope slice (from the route). */
  scope: TaskScope;
  /** Free-text search over title + description. */
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sort: SortKey;
  /** Current user id used by the scope predicates. */
  userId: string;
}

/** Filter → sort in one pass. Returns a new array; inputs are untouched. */
export function queryTasks(tasks: Task[], query: TaskQuery): Task[] {
  const term = query.search.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    if (!matchesScope(task, query.scope, query.userId)) return false;
    if (query.status !== "all" && task.status !== query.status) return false;
    if (query.priority !== "all" && task.priority !== query.priority) return false;
    if (term) {
      const haystack = `${task.title} ${task.description}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  return sortTasks(filtered, query.sort);
}

export function sortTasks(tasks: Task[], sort: SortKey): Task[] {
  const sorted = [...tasks];
  switch (sort) {
    case "due_soonest":
      sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      break;
    case "due_latest":
      sorted.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
      break;
    case "priority":
      sorted.sort((a, b) => {
        const byRank = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
        return byRank !== 0 ? byRank : a.dueDate.localeCompare(b.dueDate);
      });
      break;
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  return sorted;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

/** Summary numbers for the dashboard cards and the completion overview. */
export function getTaskStats(tasks: Task[]): TaskStats {
  const stats: TaskStats = {
    total: tasks.length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  };

  for (const task of tasks) {
    if (task.status === "todo") stats.pending += 1;
    else if (task.status === "in_progress") stats.inProgress += 1;
    else if (task.status === "completed") stats.completed += 1;
    if (isOverdue(task)) stats.overdue += 1;
  }

  return stats;
}

/** Count tasks per priority (for the priority distribution chart). */
export function getPriorityCounts(
  tasks: Task[],
): Record<TaskPriority, number> {
  const counts: Record<TaskPriority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };
  for (const task of tasks) counts[task.priority] += 1;
  return counts;
}

/** Next status in the workflow, or `null` when the task is finished. */
export function getNextStatus(status: TaskStatus): TaskStatus | null {
  if (status === "todo") return "in_progress";
  if (status === "in_progress") return "completed";
  return null;
}

/** Label for the quick status action on a task card. */
export function getNextStatusLabel(status: TaskStatus): string | null {
  if (status === "todo") return "Start";
  if (status === "in_progress") return "Complete";
  return null;
}

/**
 * Human sentence for an activity event, e.g.
 * `Priya Sharma assigned “Write API contract” to Marcus Webb`.
 *
 * `assigneeName` is supplied by the caller when the related task still exists
 * (the feed keeps denormalised titles for removed tasks).
 */
export function describeActivity(
  event: ActivityEvent,
  assigneeName?: string,
): string {
  const actor = getTeamMember(event.actorId);
  const title = `“${event.taskTitle}”`;

  switch (event.type) {
    case "created":
      return `${actor.name} created ${title}`;
    case "assigned":
      return assigneeName
        ? `${actor.name} assigned ${title} to ${assigneeName}`
        : `${actor.name} assigned ${title}`;
    case "status_changed":
      if (event.toStatus === "completed") {
        return `${actor.name} completed ${title}`;
      }
      if (event.toStatus === "in_progress" && event.fromStatus === "todo") {
        return `${actor.name} started ${title}`;
      }
      return `${actor.name} moved ${title} to ${STATUS_LABELS[event.toStatus ?? "todo"]}`;
  }
}
