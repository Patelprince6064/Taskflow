import type { Metadata } from "next";

import NotificationsView from "@/components/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Notifications",
};

/** Notification feed (assignments, completions, deadlines). */
export default function NotificationsPage() {
  return <NotificationsView />;
}
