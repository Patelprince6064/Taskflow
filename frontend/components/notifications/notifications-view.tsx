"use client";

/**
 * Notifications page: feed of all notifications with mark-all action.
 */

import { Bell, CheckCheck } from "lucide-react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import NotificationItem from "@/components/notifications/notification-item";

export default function NotificationsView() {
  const { notifications, unreadCount, markAllNotificationsRead } = useDemoStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {unreadCount > 0 ? (
            <>
              <span className="font-medium text-ink">{unreadCount}</span>{" "}
              unread of {notifications.length} notifications
            </>
          ) : (
            `${notifications.length} notifications`
          )}
        </p>

        <Button
          variant="secondary"
          size="sm"
          onClick={markAllNotificationsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-4 w-4" aria-hidden="true" />
          Mark all as read
        </Button>
      </div>

      <DashboardCard
        title="Notifications"
        subtitle="Assignments, completions and deadline reminders"
        bodyClassName="p-0"
      >
        {notifications.length === 0 ? (
          <div className="p-5">
            <EmptyState
              Icon={Bell}
              title="No notifications"
              description="When teammates assign or complete tasks, you’ll find the updates here."
            />
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}
