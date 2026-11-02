import type { Metadata } from "next";

import TasksView from "@/components/tasks/tasks-view";

export const metadata: Metadata = {
  title: "Created Tasks",
};

/** Created Tasks: work the current user raised for the team. */
export default function CreatedTasksPage() {
  return <TasksView scope="created" />;
}
