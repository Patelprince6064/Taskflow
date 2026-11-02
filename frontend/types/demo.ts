/**
 * Shared shape of the client-side demo workspace.
 *
 * Persisted to `localStorage` by `lib/demo-storage.ts` and seeded with
 * `lib/sample-data.ts` until a real API exists.
 */

import type { AppNotification } from "@/types/notification";
import type { ActivityEvent, Task } from "@/types/task";

export interface DemoState {
  tasks: Task[];
  /** Global activity feed, newest first (also powers task timelines). */
  activity: ActivityEvent[];
  notifications: AppNotification[];
}
