"use client";

/**
 * Settings › Notification preferences — UI placeholder switches. Gmail/email
 * delivery is explicitly out of scope until a later phase.
 */

import { useState } from "react";

import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import Switch from "@/components/ui/switch";

interface Preference {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
  disabled?: boolean;
}

const PREFERENCES: Preference[] = [
  {
    id: "assigned",
    label: "Task assignments",
    description: "When a teammate assigns a task to you.",
    defaultOn: true,
  },
  {
    id: "deadlines",
    label: "Deadline reminders",
    description: "A heads-up the day before a task is due.",
    defaultOn: true,
  },
  {
    id: "completed",
    label: "Completed tasks",
    description: "When someone finishes a task you created.",
    defaultOn: false,
  },
  {
    id: "digest",
    label: "Weekly digest",
    description: "A Monday summary of everything on your plate.",
    defaultOn: false,
  },
  {
    id: "email",
    label: "Email notifications",
    description: "Gmail delivery arrives with backend integration (Phase 3+).",
    defaultOn: false,
    disabled: true,
  },
];

export default function NotificationSection() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PREFERENCES.map((item) => [item.id, item.defaultOn])),
  );
  const [saved, setSaved] = useState(false);

  return (
    <DashboardCard
      title="Notification preferences"
      subtitle="Choose which events reach your bell feed"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        className="flex flex-col gap-4"
      >
        <ul className="divide-y divide-line">
          {PREFERENCES.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0"
            >
              <div className="min-w-0">
                <label
                  htmlFor={`pref-${item.id}`}
                  className="text-sm font-medium text-ink"
                >
                  {item.label}
                </label>
                <p className="mt-0.5 text-xs text-muted">{item.description}</p>
              </div>
              <Switch
                id={`pref-${item.id}`}
                label={item.label}
                hideLabel
                disabled={item.disabled}
                checked={values[item.id] ?? false}
                onChange={(checked) => {
                  setValues((current) => ({ ...current, [item.id]: checked }));
                  setSaved(false);
                }}
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button type="submit">Save changes</Button>
          {saved && (
            <p role="status" className="text-xs text-muted">
              Notification prefs are a Phase 2 preview — nothing is persisted
              yet.
            </p>
          )}
        </div>
      </form>
    </DashboardCard>
  );
}
