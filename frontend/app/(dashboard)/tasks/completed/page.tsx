import type { Metadata } from "next";

import TasksView from "@/components/tasks/tasks-view";

export const metadata: Metadata = {
  title: "Completed Tasks",
};

/** Completed Tasks: finished work assigned to the current user. */
export default function CompletedTasksPage() {
  return <TasksView scope="completed" />;
}
