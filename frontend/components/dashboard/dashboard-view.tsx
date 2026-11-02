"use client";

/**
 * Dashboard view: summary stat cards plus the six dashboard sections.
 * All numbers derive from the demo store (sample data in Phase 2).
 */

import {
  AlertTriangle,
  CircleCheckBig,
  ClipboardList,
  LoaderCircle,
  Clock,
} from "lucide-react";

import { getTaskStats } from "@/lib/task-utils";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import CompletionOverview from "@/components/dashboard/completion-overview";
import MyTasksSection from "@/components/dashboard/my-tasks-section";
import PriorityDistribution from "@/components/dashboard/priority-distribution";
import RecentTasks from "@/components/dashboard/recent-tasks";
import TeamActivity from "@/components/dashboard/team-activity";
import UpcomingDeadlines from "@/components/dashboard/upcoming-deadlines";
import StatCard from "@/components/dashboard/stat-card";

export default function DashboardView() {
  const { tasks } = useDemoStore();
  const stats = getTaskStats(tasks);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          Icon={ClipboardList}
          tone="default"
          hint="In this workspace"
        />
        <StatCard
          label="Pending Tasks"
          value={stats.pending}
          Icon={Clock}
          tone="warning"
          hint="Waiting to start"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          Icon={LoaderCircle}
          tone="brand"
          hint="Actively being worked on"
        />
        <StatCard
          label="Completed Tasks"
          value={stats.completed}
          Icon={CircleCheckBig}
          tone="success"
          hint="Finished and closed"
        />
        <StatCard
          label="Overdue Tasks"
          value={stats.overdue}
          Icon={AlertTriangle}
          tone="danger"
          hint="Past due, still open"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Completion + priority */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CompletionOverview className="lg:col-span-2" />
        <PriorityDistribution />
      </div>

      {/* Recent + deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTasks />
        <UpcomingDeadlines />
      </div>

      {/* My tasks + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyTasksSection />
        <TeamActivity />
      </div>
    </div>
  );
}
