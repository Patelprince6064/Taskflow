/**
 * Pure state transitions for the client-side demo workspace.
 *
 * Every user action (create, edit, status change, notification reads) is
 * modelled as one action so state stays predictable and testable. When the
 * real API arrives these transitions are replaced by optimistic updates over
 * HTTP responses - the components will not change.
 */

import { CURRENT_USER_ID, getTeamMember, createSeedState } from "@/lib/sample-data";
import type { DemoState } from "@/types/demo";
import type { AppNotification } from "@/types/notification";
import type {
  ActivityEvent,
  CreateTaskInput,
  Task,
  TaskStatus,
} from "@/types/task";

/** Browser-unique id with a non-crypto fallback for older environments. */
function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export type DemoAction =
  | { type: "state/restored"; state: DemoState }
  | { type: "state/reset" }
  | { type: "task/created"; input: CreateTaskInput }
  | { type: "task/updated"; id: string; patch: Partial<Omit<Task, "id">> }
  | { type: "task/status_changed"; id: string; status: TaskStatus }
  | { type: "notification/read"; id: string }
  | { type: "notification/read_all" };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "state/restored":
      return action.state;

    case "state/reset":
      return createSeedState();

    case "task/created": {
      const now = new Date().toISOString();
      const assignee = getTeamMember(action.input.assigneeId);

      const task: Task = {
        id: createId("task"),
        ...action.input,
        createdById: CURRENT_USER_ID,
        createdAt: now,
        completedAt: action.input.status === "completed" ? now : null,
      };

      const events: ActivityEvent[] = [
        {
          id: createId("act"),
          taskId: task.id,
          taskTitle: task.title,
          actorId: CURRENT_USER_ID,
          type: "created",
          at: now,
        },
      ];

      if (task.assigneeId !== CURRENT_USER_ID) {
        events.push({
          id: createId("act"),
          taskId: task.id,
          taskTitle: task.title,
          actorId: CURRENT_USER_ID,
          type: "assigned",
          at: now,
        });
      }

      const notification: AppNotification = {
        id: createId("note"),
        type: "assigned",
        title: "Task assigned",
        message:
          task.assigneeId === CURRENT_USER_ID
            ? `You created “${task.title}” and added it to your list.`
            : `You assigned “${task.title}” to ${assignee.name}.`,
        actorId: CURRENT_USER_ID,
        taskId: task.id,
        createdAt: now,
        read: false,
      };

      return {
        tasks: [task, ...state.tasks],
        activity: [...events, ...state.activity],
        notifications: [notification, ...state.notifications],
      };
    }

    case "task/updated": {
      const existing = state.tasks.find((task) => task.id === action.id);
      if (!existing) return state;

      const now = new Date().toISOString();
      const next: Task = { ...existing, ...action.patch };
      const events: ActivityEvent[] = [];

      if (action.patch.status && action.patch.status !== existing.status) {
        next.completedAt =
          action.patch.status === "completed" ? now : null;
        events.push({
          id: createId("act"),
          taskId: existing.id,
          taskTitle: existing.title,
          actorId: CURRENT_USER_ID,
          type: "status_changed",
          fromStatus: existing.status,
          toStatus: action.patch.status,
          at: now,
        });
      }

      if (action.patch.assigneeId && action.patch.assigneeId !== existing.assigneeId) {
        events.push({
          id: createId("act"),
          taskId: existing.id,
          taskTitle: existing.title,
          actorId: CURRENT_USER_ID,
          type: "assigned",
          at: now,
        });
      }

      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === next.id ? next : task)),
        activity: events.length ? [...events, ...state.activity] : state.activity,
      };
    }

    case "task/status_changed": {
      const existing = state.tasks.find((task) => task.id === action.id);
      if (!existing || existing.status === action.status) return state;

      const now = new Date().toISOString();
      const updated: Task = {
        ...existing,
        status: action.status,
        completedAt: action.status === "completed" ? now : null,
      };

      const event: ActivityEvent = {
        id: createId("act"),
        taskId: existing.id,
        taskTitle: existing.title,
        actorId: CURRENT_USER_ID,
        type: "status_changed",
        fromStatus: existing.status,
        toStatus: action.status,
        at: now,
      };

      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === updated.id ? updated : task)),
        activity: [event, ...state.activity],
      };
    }

    case "notification/read":
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === action.id ? { ...item, read: true } : item,
        ),
      };

    case "notification/read_all":
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.read ? item : { ...item, read: true },
        ),
      };
  }
}
