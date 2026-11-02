/**
 * Persisted slice of the demo state.
 *
 * This module is the *only* place that touches `localStorage`, which makes it
 * the seam to replace when the real API lands: swap `loadDemoState`/
 * `saveDemoState` for GET/POST calls and the rest of the app is unaffected.
 */

import type { DemoState } from "@/types/demo";

const STORAGE_KEY = "taskflow.demo.v1";

/** Read the saved demo workspace (browser only). Returns `null` when absent. */
export function loadDemoState(): DemoState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DemoState>;
    if (
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.activity) ||
      !Array.isArray(parsed.notifications)
    ) {
      return null;
    }

    return {
      tasks: parsed.tasks,
      activity: parsed.activity,
      notifications: parsed.notifications,
    };
  } catch {
    // Corrupted or unavailable storage: fall back to the sample seed.
    return null;
  }
}

/** Persist the demo workspace. Storage failures are non-fatal for a demo. */
export function saveDemoState(state: DemoState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode / quota exceeded: the session simply stays in memory.
  }
}

/** Drop saved demo data (used by "Reset demo data" in Settings). */
export function clearDemoState(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up.
  }
}
