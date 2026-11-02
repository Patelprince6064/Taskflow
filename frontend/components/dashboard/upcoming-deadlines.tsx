"use client";

/**
 * Upcoming deadlines: nearest due dates among unfinished tasks.
 */

import Link from "next/link";
import { CalendarCheck } from "lucide-react";

import { dueLabel, formatDate, todayIso } from "@/lib/format";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

const VIEW_ALL_CLASS =
  "text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export default function UpcomingDeadlines() {
  const { tasks } = useDemoStore();
  const today = todayIso();

  const upcoming = tasks
    .filter((task) => task.status !== "completed" && task.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <DashboardCard
      title="Upcoming deadlines"
      subtitle="Next due dates on unfinished work"
      actions={
        <Link href="/tasks" className={VIEW_ALL_CLASS}>
          View all
        </Link>
      }
    >
      {upcoming.length === 0 ? (
        <EmptyState
          Icon={CalendarCheck}
          title="No upcoming deadlines"
          description="Nothing is due soon — enjoy the quiet."
          density="compact"
        />
      ) : (
        <ul className="divide-y divide-line">
          {upcoming.map((task) => {
            const label = dueLabel(task.dueDate);
            const todayTask = task.dueDate === today;
            const tomorrowTask = label === "Due tomorrow";

            return (
              <li
                key={task.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  className={cn(
                    "inline-flex shrink-0 flex-col items-center justify-center rounded-lg px-2 py-1 text-center ring-1 ring-inset",
                    todayTask
                      ? "bg-amber-50 text-amber-700 ring-amber-200"
                      : tomorrowTask
                        ? "bg-brand-50 text-brand-700 ring-brand-200"
                        : "bg-canvas text-slate-600 ring-line",
                  )}
                >
                  <span className="text-[10px] leading-none font-semibold uppercase">
                    {task.dueDate.slice(5, 7)}/{task.dueDate.slice(8, 10)}
                  </span>
                  <span className="mt-0.5 text-[10px] leading-none opacity-80">
                    {todayTask ? "Today" : tomorrowTask ? "Tmrw" : "Due"}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="block truncate rounded text-sm font-medium text-ink transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {task.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">
                    {label} · {formatDate(task.dueDate)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
