import type { Metadata } from "next";

import TasksView from "@/components/tasks/tasks-view";

export const metadata: Metadata = {
  title: "Assigned Tasks",
};

/** Assigned Tasks: work the current user must do. */
export default function AssignedTasksPage() {
  return <TasksView scope="assigned" />;
}
