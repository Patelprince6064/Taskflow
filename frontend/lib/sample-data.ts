/**
 * SAMPLE DATA - visual development only.
 *
 * Everything in this file stands in for API responses during Phase 2. It is
 * kept deliberately separate from components and state logic so Phase 3 can
 * replace `createSeedState()` with real `GET` requests without touching the
 * UI.
 *
 * Nothing here is persisted to a backend: changes live in the browser's
 * localStorage only (see lib/demo-storage.ts).
 */

import type { DemoState } from "@/types/demo";
import type { AppNotification } from "@/types/notification";
import type {
  ActivityEvent,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";
import type { TeamMember } from "@/types/team";

/** The signed-in persona for the demo workspace. */
export const CURRENT_USER_ID = "u1";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "u1",
    name: "Jordan Lee",
    email: "jordan.lee@taskflow.test",
    role: "Designer",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "priya.sharma@taskflow.test",
    role: "Product Manager",
  },
  {
    id: "u3",
    name: "Marcus Webb",
    email: "marcus.webb@taskflow.test",
    role: "Developer",
  },
  {
    id: "u4",
    name: "Sofia Rossi",
    email: "sofia.rossi@taskflow.test",
    role: "Developer",
  },
  {
    id: "u5",
    name: "Daniel Kim",
    email: "daniel.kim@taskflow.test",
    role: "QA Engineer",
  },
  {
    id: "u6",
    name: "Ethan Brooks",
    email: "ethan.brooks@taskflow.test",
    role: "Developer",
  },
];

/* ------------------------------------------------------------------ */
/* Date helpers (seed-relative, evaluated when the seed is created)    */
/* ------------------------------------------------------------------ */

/** Calendar date `offset` days from today as `YYYY-MM-DD` (local time). */
function dayOnly(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** ISO timestamp `offset` days from today at `hour:30` (local time). */
function stamp(offset: number, hour = 9): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(hour, 30, 0, 0);
  return date.toISOString();
}

/* ------------------------------------------------------------------ */
/* Seed tasks                                                          */
/* ------------------------------------------------------------------ */

/**
 * Shape of a seed row. Deliberately not `CreateTaskInput`: seeds carry their
 * own `id`, creator and audit fields, while `createTask` fills those in
 * client-side at runtime.
 */
interface SeedTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  createdById: string;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
}

const SEED_TASKS: SeedTask[] = [
  {
    id: "t1",
    title: "Finalize dashboard empty states",
    description:
      "Write copy and pick illustrations for every empty list in the dashboard so first-time users always know what to do next.",
    status: "todo",
    priority: "high",
    assigneeId: "u1",
    createdById: "u2",
    dueDate: dayOnly(2),
    createdAt: stamp(-2, 10),
    completedAt: null,
  },
  {
    id: "t2",
    title: "Implement Kanban drag indicators",
    description:
      "Add clear drop targets between Kanban columns and make sure the placeholder matches the card dimensions.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "u4",
    createdById: "u1",
    dueDate: dayOnly(4),
    createdAt: stamp(-5, 11),
    completedAt: null,
  },
  {
    id: "t3",
    title: "Write API contract for /api/tasks",
    description:
      "Document request/response schemas, error envelopes and pagination rules so frontend and backend can move in parallel.",
    status: "in_progress",
    priority: "high",
    assigneeId: "u3",
    createdById: "u2",
    dueDate: dayOnly(1),
    createdAt: stamp(-7, 9),
    completedAt: null,
  },
  {
    id: "t4",
    title: "Fix mobile sidebar focus trap",
    description:
      "Keyboard focus escapes behind the open drawer on small screens. Trap focus while open and restore it to the trigger on close.",
    status: "todo",
    priority: "urgent",
    assigneeId: "u4",
    createdById: "u1",
    dueDate: dayOnly(-1),
    createdAt: stamp(-6, 14),
    completedAt: null,
  },
  {
    id: "t5",
    title: "QA regression pass — Phase 2 UI",
    description:
      "Run the full manual checklist across desktop, tablet and mobile viewports and log any layout or contrast issues.",
    status: "todo",
    priority: "medium",
    assigneeId: "u5",
    createdById: "u2",
    dueDate: dayOnly(3),
    createdAt: stamp(-3, 15),
    completedAt: null,
  },
  {
    id: "t6",
    title: "Design notification bell states",
    description:
      "Define unread, read and empty states for the bell feed, including the count badge cap (99+).",
    status: "completed",
    priority: "medium",
    assigneeId: "u1",
    createdById: "u1",
    dueDate: dayOnly(-2),
    createdAt: stamp(-9, 10),
    completedAt: stamp(-3, 16),
  },
  {
    id: "t7",
    title: "Set up preview environments",
    description:
      "Connect the repository to the hosting provider so every pull request gets an isolated preview URL.",
    status: "completed",
    priority: "low",
    assigneeId: "u3",
    createdById: "u2",
    dueDate: dayOnly(-4),
    createdAt: stamp(-12, 9),
    completedAt: stamp(-5, 12),
  },
  {
    id: "t8",
    title: "Accessibility audit: keyboard navigation",
    description:
      "Walk the whole app with the keyboard only: focus order, visible focus rings, skip links and modal focus return.",
    status: "in_progress",
    priority: "urgent",
    assigneeId: "u1",
    createdById: "u2",
    dueDate: dayOnly(0),
    createdAt: stamp(-4, 13),
    completedAt: null,
  },
  {
    id: "t9",
    title: "Draft Q4 roadmap slides",
    description:
      "Summarise shipped work, open risks and the proposed next quarter focus for the stakeholder review.",
    status: "todo",
    priority: "low",
    assigneeId: "u2",
    createdById: "u2",
    dueDate: dayOnly(6),
    createdAt: stamp(-1, 9),
    completedAt: null,
  },
  {
    id: "t10",
    title: "Optimize image loading on landing",
    description:
      "Serve responsive sizes, preload the hero asset and remove layout shift above the fold.",
    status: "todo",
    priority: "medium",
    assigneeId: "u6",
    createdById: "u4",
    dueDate: dayOnly(5),
    createdAt: stamp(-2, 16),
    completedAt: null,
  },
  {
    id: "t11",
    title: "Refactor demo store for API swap",
    description:
      "Keep all persistence behind lib/demo-storage.ts so Phase 3 can replace it with REST calls without UI changes.",
    status: "in_progress",
    priority: "high",
    assigneeId: "u3",
    createdById: "u1",
    dueDate: dayOnly(7),
    createdAt: stamp(-1, 11),
    completedAt: null,
  },
  {
    id: "t12",
    title: "Onboarding empty-state illustrations",
    description:
      "Produce simple line illustrations in the brand style for the tasks, team and notifications empty states.",
    status: "completed",
    priority: "medium",
    assigneeId: "u1",
    createdById: "u2",
    dueDate: dayOnly(-3),
    createdAt: stamp(-10, 10),
    completedAt: stamp(-4, 17),
  },
  {
    id: "t13",
    title: "Investigate flaky date tests",
    description:
      "Date assertions fail around midnight because of timezone drift — pin the timezone in the test setup.",
    status: "todo",
    priority: "urgent",
    assigneeId: "u5",
    createdById: "u4",
    dueDate: dayOnly(-2),
    createdAt: stamp(-8, 14),
    completedAt: null,
  },
  {
    id: "t14",
    title: "Write README quick-start section",
    description:
      "Document the two-terminal local setup, environment variables and the health-check smoke test.",
    status: "completed",
    priority: "low",
    assigneeId: "u3",
    createdById: "u2",
    dueDate: dayOnly(-5),
    createdAt: stamp(-14, 9),
    completedAt: stamp(-6, 15),
  },
  {
    id: "t15",
    title: "Polish responsive breakpoints",
    description:
      "Tighten the tablet layout, prevent horizontal overflow on mobile and re-check table scrolling.",
    status: "todo",
    priority: "medium",
    assigneeId: "u1",
    createdById: "u2",
    dueDate: dayOnly(1),
    createdAt: stamp(-3, 10),
    completedAt: null,
  },
  {
    id: "t16",
    title: "Spike: real-time presence",
    description:
      "Time-boxed research into websockets vs. polling for showing who is viewing a task, with a short write-up.",
    status: "todo",
    priority: "low",
    assigneeId: "u6",
    createdById: "u2",
    dueDate: dayOnly(10),
    createdAt: stamp(-1, 15),
    completedAt: null,
  },
];

/* ------------------------------------------------------------------ */
/* Derived activity feed                                               */
/* ------------------------------------------------------------------ */

/**
 * Build the timeline from the seed tasks instead of hand-writing events:
 * every task gets a `created` event, an `assigned` event when the creator
 * delegated it, plus status changes matching its current status.
 */
function buildSeedActivity(tasks: Task[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const task of tasks) {
    const base = { taskId: task.id, taskTitle: task.title };

    events.push({
      ...base,
      id: `a_${task.id}_created`,
      actorId: task.createdById,
      type: "created",
      at: task.createdAt,
    });

    if (task.assigneeId !== task.createdById) {
      events.push({
        ...base,
        id: `a_${task.id}_assigned`,
        actorId: task.createdById,
        type: "assigned",
        at: new Date(new Date(task.createdAt).getTime() + 2 * 3_600_000).toISOString(),
      });
    }

    if (task.status !== "todo") {
      events.push({
        ...base,
        id: `a_${task.id}_progress`,
        actorId: task.assigneeId,
        type: "status_changed",
        fromStatus: "todo",
        toStatus: "in_progress",
        at: new Date(new Date(task.createdAt).getTime() + 24 * 3_600_000).toISOString(),
      });
    }

    if (task.status === "completed" && task.completedAt) {
      events.push({
        ...base,
        id: `a_${task.id}_completed`,
        actorId: task.assigneeId,
        type: "status_changed",
        fromStatus: "in_progress",
        toStatus: "completed",
        at: task.completedAt,
      });
    }
  }

  return events.sort((a, b) => b.at.localeCompare(a.at));
}

/* ------------------------------------------------------------------ */
/* Seed notifications                                                  */
/* ------------------------------------------------------------------ */

function seedNotifications(): AppNotification[] {
  const items: AppNotification[] = [
    {
      id: "n1",
      type: "deadline",
      title: "Deadline approaching",
      message: "“Accessibility audit: keyboard navigation” is due today.",
      actorId: "u2",
      taskId: "t8",
      createdAt: stamp(0, 9),
      read: false,
    },
    {
      id: "n2",
      type: "assigned",
      title: "New task assigned",
      message: "Priya Sharma assigned you “Finalize dashboard empty states”.",
      actorId: "u2",
      taskId: "t1",
      createdAt: stamp(-1, 10),
      read: false,
    },
    {
      id: "n3",
      type: "deadline",
      title: "Task overdue",
      message: "“Investigate flaky date tests” passed its due date and is still open.",
      actorId: "u4",
      taskId: "t13",
      createdAt: stamp(-2, 9),
      read: true,
    },
    {
      id: "n4",
      type: "assigned",
      title: "New task assigned",
      message: "Priya Sharma assigned you “Polish responsive breakpoints”.",
      actorId: "u2",
      taskId: "t15",
      createdAt: stamp(-3, 14),
      read: false,
    },
    {
      id: "n5",
      type: "completed",
      title: "Task completed",
      message: "Marcus Webb completed “Set up preview environments”.",
      actorId: "u3",
      taskId: "t7",
      createdAt: stamp(-5, 11),
      read: true,
    },
    {
      id: "n6",
      type: "completed",
      title: "Task completed",
      message: "Marcus Webb completed “Write README quick-start section”.",
      actorId: "u3",
      taskId: "t14",
      createdAt: stamp(-6, 15),
      read: true,
    },
  ];

  return items;
}

/* ------------------------------------------------------------------ */
/* Public seed                                                         */
/* ------------------------------------------------------------------ */

/**
 * Create a fresh demo workspace.
 *
 * Called on first load and by "Reset demo data". Dates are relative to the
 * moment the seed is created so the demo always looks current.
 */
export function createSeedState(): DemoState {
  const tasks: Task[] = SEED_TASKS.map(
    ({ id, createdAt, completedAt, ...task }) => ({
      id,
      ...task,
      createdAt,
      completedAt,
    }),
  );

  return {
    tasks,
    activity: buildSeedActivity(tasks),
    notifications: seedNotifications(),
  };
}

/** Look up a seeded team member (safe fallback keeps the UI rendering). */
export function getTeamMember(
  id: string,
  members: TeamMember[] = TEAM_MEMBERS,
): TeamMember {
  return (
    members.find((member) => member.id === id) ?? {
      id,
      name: "Unknown user",
      email: "unknown@taskflow.test",
      role: "Developer",
    }
  );
}
