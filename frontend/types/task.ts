/**
 * Domain types for tasks.
 *
 * These shapes mirror what the Flask/Supabase API is expected to return in a
 * later phase, so the UI can be wired to real data without redesigning the
 * components.
 */

/** Workflow states used by the list view and Kanban board. */
export type TaskStatus = "todo" | "in_progress" | "completed";

/** Ordered from least to most urgent (index order = severity order). */
export type TaskPriority = "low" | "medium" | "high" | "urgent";

/** Which slice of the workspace a tasks view is showing. */
export type TaskScope = "mine" | "assigned" | "created" | "completed";

/** A task record as rendered across the app. */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** `TeamMember.id` of the person doing the work. */
  assigneeId: string;
  /** `TeamMember.id` of the person who raised the task. */
  createdById: string;
  /** ISO timestamp (YYYY-MM-DDTHH:mm:ssZ). */
  createdAt: string;
  /** Calendar date (YYYY-MM-DD) - intentionally date-only like an API date field. */
  dueDate: string;
  /** ISO timestamp, set when the task reaches `completed`. */
  completedAt: string | null;
}

/** Payload accepted by `createTask` - id and audit fields are added client-side. */
export interface CreateTaskInput {
  title: string;
  description: string;
  assigneeId: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
}

/** Entries in the activity timeline shown on the task details page. */
export type ActivityType = "created" | "assigned" | "status_changed";

export interface ActivityEvent {
  id: string;
  taskId: string;
  /** Denormalised so the feed still renders if a task is later removed. */
  taskTitle: string;
  /** `TeamMember.id` of whoever performed the action. */
  actorId: string;
  type: ActivityType;
  /** For `status_changed` events. */
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  /** ISO timestamp. */
  at: string;
}
