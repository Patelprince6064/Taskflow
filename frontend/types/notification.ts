/**
 * Domain types for notifications.
 */

export type NotificationType = "assigned" | "completed" | "deadline";

/** A single notification in the bell feed. */
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** `TeamMember.id` of who/what triggered the notification. */
  actorId: string;
  /** Related task, when the notification is about one. */
  taskId?: string;
  /** ISO timestamp. */
  createdAt: string;
  read: boolean;
}
