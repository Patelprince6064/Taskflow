/**
 * Navigation configuration + page meta derivation.
 *
 * The sidebar and the header both read from this single source so labels,
 * icons and breadcrumbs can never drift apart.
 */

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CircleCheckBig,
  FilePlus2,
  LayoutDashboard,
  ListTodo,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

import type { TaskScope } from "@/types/task";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Special rendering (e.g. unread badge). */
  badge?: "notifications";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar structure, in display order. */
export const NAV_GROUPS: NavGroup[] = [
  { label: "Menu", items: [{ label: "Overview", href: "/", icon: LayoutDashboard }] },
  {
    label: "Tasks",
    items: [
      { label: "My Tasks", href: "/tasks", icon: ListTodo },
      { label: "Assigned Tasks", href: "/tasks/assigned", icon: UserCheck },
      { label: "Created Tasks", href: "/tasks/created", icon: FilePlus2 },
      { label: "Completed Tasks", href: "/tasks/completed", icon: CircleCheckBig },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Team Members", href: "/team", icon: Users },
      { label: "Notifications", href: "/notifications", icon: Bell, badge: "notifications" },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/** Task scope routes (used to disambiguate the "My Tasks" active state). */
const SCOPE_PATHS = new Set(["/tasks/assigned", "/tasks/created", "/tasks/completed"]);

/** Whether a sidebar link should render as the active destination. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  // Task detail pages (/tasks/<id>) keep "My Tasks" highlighted.
  if (href === "/tasks" && pathname.startsWith("/tasks/") && !SCOPE_PATHS.has(pathname)) {
    return true;
  }
  return false;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageMeta {
  title: string;
  breadcrumbs: Breadcrumb[];
}

const SEGMENT_LABELS: Record<string, string> = {
  "": "Overview",
  tasks: "Tasks",
  assigned: "Assigned Tasks",
  created: "Created Tasks",
  completed: "Completed Tasks",
  team: "Team Members",
  notifications: "Notifications",
  settings: "Settings",
};

/**
 * Derive the header title and breadcrumbs from the current pathname.
 *
 * Pure and synchronous so both the server shell and the client header can
 * compute the same output (no hydration mismatch).
 */
export function getPageMeta(pathname: string): PageMeta {
  const segments = pathname.split("/").filter(Boolean);

  // Unknown nested routes under /tasks are task detail pages.
  const labels = segments.map((segment, index) => {
    if (index === 1 && segments[0] === "tasks" && !(segment in SEGMENT_LABELS)) {
      return "Task details";
    }
    return SEGMENT_LABELS[segment] ?? segment;
  });

  if (labels.length === 0) {
    return { title: "Overview", breadcrumbs: [{ label: "Overview" }] };
  }

  const breadcrumbs: Breadcrumb[] = labels.map((label, index) => ({
    label,
    href: index === labels.length - 1 ? undefined : `/${segments.slice(0, index + 1).join("/")}`,
  }));

  return { title: labels[labels.length - 1] ?? "TaskFlow", breadcrumbs };
}

/** Map a route back to its task scope (shared by the sidebar and tasks view). */
export function scopeFromPathname(pathname: string): TaskScope {
  if (pathname === "/tasks/assigned") return "assigned";
  if (pathname === "/tasks/created") return "created";
  if (pathname === "/tasks/completed") return "completed";
  return "mine";
}
