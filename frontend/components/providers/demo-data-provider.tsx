"use client";

/**
 * Demo workspace store (React context).
 *
 * Holds tasks, activity and notifications for Phase 2. State is seeded with
 * sample data, mirrored into `localStorage`, and exposed through `useDemoStore`
 * so every page reads one source of truth.
 *
 * Phase 3 swap: replace the reducer/dispatch calls inside the action callbacks
 * with API calls (`fetchJson` in lib/api.ts). Consumers keep the same hook.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { demoReducer, type DemoAction } from "@/lib/demo-reducer";
import {
  clearDemoState,
  loadDemoState,
  saveDemoState,
} from "@/lib/demo-storage";
import {
  CURRENT_USER_ID,
  TEAM_MEMBERS,
  createSeedState,
  getTeamMember,
} from "@/lib/sample-data";
import type { DemoState } from "@/types/demo";
import type { AppNotification } from "@/types/notification";
import type { CreateTaskInput, Task, TaskStatus } from "@/types/task";
import type { TeamMember } from "@/types/team";

interface DemoStoreValue extends DemoState {
  /** Static team roster (sample data, not yet API-backed). */
  team: TeamMember[];
  currentUserId: string;
  currentUser: TeamMember;
  /** Shared search term (header search + tasks page stay in sync). */
  search: string;
  setSearch: (value: string) => void;
  /** Number of unread notifications for the bell badge. */
  unreadCount: number;
  getTask: (id: string) => Task | undefined;
  createTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id">>) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  /** Restores the sample seed and drops saved demo data. */
  resetDemoData: () => void;
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  // The seed is used for BOTH the server render and the client's first render,
  // so hydration matches. Saved demo data is restored in an effect below (a
  // reducer dispatch, not setState, so no cascading render is triggered here).
  const [state, dispatch] = useReducer(demoReducer, undefined, createSeedState);
  const [search, setSearch] = useState("");

  // Restore saved demo data once after hydration. The mirror effect below runs
  // first with the seed, then again with the restored state, so the final
  // persisted value is always correct.
  useEffect(() => {
    const saved = loadDemoState();
    if (saved) dispatch({ type: "state/restored", state: saved });
  }, []);

  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  const run = useCallback((action: DemoAction) => dispatch(action), []);

  const getTask = useCallback(
    (id: string) => state.tasks.find((task) => task.id === id),
    [state.tasks],
  );

  const createTask = useCallback(
    (input: CreateTaskInput) => run({ type: "task/created", input }),
    [run],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<Task, "id">>) =>
      run({ type: "task/updated", id, patch }),
    [run],
  );

  const setTaskStatus = useCallback(
    (id: string, status: TaskStatus) =>
      run({ type: "task/status_changed", id, status }),
    [run],
  );

  const markNotificationRead = useCallback(
    (id: string) => run({ type: "notification/read", id }),
    [run],
  );

  const markAllNotificationsRead = useCallback(
    () => run({ type: "notification/read_all" }),
    [run],
  );

  const resetDemoData = useCallback(() => {
    clearDemoState();
    run({ type: "state/reset" });
  }, [run]);

  const value = useMemo<DemoStoreValue>(() => {
    const unreadCount = state.notifications.filter(
      (item: AppNotification) => !item.read,
    ).length;

    return {
      ...state,
      team: TEAM_MEMBERS,
      currentUserId: CURRENT_USER_ID,
      currentUser: getTeamMember(CURRENT_USER_ID),
      search,
      setSearch,
      unreadCount,
      getTask,
      createTask,
      updateTask,
      setTaskStatus,
      markNotificationRead,
      markAllNotificationsRead,
      resetDemoData,
    };
  }, [
    state,
    search,
    getTask,
    createTask,
    updateTask,
    setTaskStatus,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
  ]);

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  );
}

/** Access the demo workspace. Must be used under `DemoDataProvider`. */
export function useDemoStore(): DemoStoreValue {
  const store = useContext(DemoStoreContext);
  if (!store) {
    throw new Error("useDemoStore must be used within <DemoDataProvider>");
  }
  return store;
}
