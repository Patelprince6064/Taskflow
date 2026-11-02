import type { Metadata } from "next";

import DashboardView from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Overview",
};

/**
 * Dashboard home: summary cards, completion overview, recent tasks,
 * upcoming deadlines, my assigned tasks, team activity and priority
 * distribution. Client interactivity lives in `DashboardView`.
 */
export default function OverviewPage() {
  return <DashboardView />;
}
