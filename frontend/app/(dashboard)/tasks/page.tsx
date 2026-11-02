import type { Metadata } from "next";

import TasksView from "@/components/tasks/tasks-view";

export const metadata: Metadata = {
  title: "My Tasks",
};

/** My Tasks: everything assigned to or created by the current user. */
export default function MyTasksPage() {
  return <TasksView scope="mine" />;
}
