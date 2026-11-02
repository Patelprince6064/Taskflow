"use client";

/**
 * One notification row: type icon, message, relative timestamp and read
 * state. Clicking an unread item marks it read (and opens its task when it
 * has one).
 */

import { useRouter } from "next/navigation";
import {
  AlarmClock,
  CircleCheckBig,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { getTeamMember } from "@/lib/sample-data";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import UserAvatar from "@/components/ui/user-avatar";
import type { AppNotification, NotificationType } from "@/types/notification";

const TYPE_STYLE: Record<
  NotificationType,
  { icon: LucideIcon; iconClass: string }
> = {
  assigned: { icon: UserPlus, iconClass: "bg-brand-50 text-brand-600" },
  completed: { icon: CircleCheckBig, iconClass: "bg-emerald-50 text-emerald-600" },
  deadline: { icon: AlarmClock, iconClass: "bg-amber-50 text-amber-600" },
};

interface NotificationItemProps {
  notification: AppNotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { markNotificationRead, getTask } = useDemoStore();

  const actor = getTeamMember(notification.actorId);
  const style = TYPE_STYLE[notification.type];
  const Icon = style.icon;
  const task = notification.taskId ? getTask(notification.taskId) : undefined;

  function handleOpen() {
    if (!notification.read) markNotificationRead(notification.id);
    if (task) router.push(`/tasks/${task.id}`);
  }

  return (
    <li
      className={cn(
        "border-b border-line transition-colors last:border-b-0",
        notification.read ? "bg-surface" : "bg-brand-50/40",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
        {/* Icon / actor */}
        <span className="relative shrink-0">
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full",
              style.iconClass,
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <UserAvatar
            name={actor.name}
            id={actor.id}
            size="xs"
            className="absolute -right-1.5 -bottom-1.5 ring-2 ring-surface"
          />
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm",
                notification.read ? "text-slate-600" : "text-ink",
              )}
            >
              <span className="font-semibold">{notification.title}</span>
              {notification.message}
            </p>
            {!notification.read && (
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500"
                aria-label="Unread"
              />
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs text-muted">
              {formatDateTime(notification.createdAt)}
            </span>
            {task ? (
              <button
                type="button"
                onClick={handleOpen}
                className="rounded text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                View task
              </button>
            ) : (
              !notification.read && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(notification.id)}
                  className="rounded text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Mark as read
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
