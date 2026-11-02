"use client";

/**
 * Settings › Profile — UI placeholder. Edits are local state only; nothing is
 * persisted in Phase 2 (no auth, no backend).
 */

import { useState, type FormEvent } from "react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FormField from "@/components/ui/form-field";
import Select from "@/components/ui/select";

export default function ProfileSection() {
  const { currentUser, team } = useDemoStore();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <DashboardCard
      title="Profile settings"
      subtitle="How you appear to teammates in this workspace"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="profile-name" label="Full name">
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink transition-colors hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </FormField>

          <FormField id="profile-email" label="Email address">
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSaved(false);
              }}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink transition-colors hover:border-slate-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </FormField>

          <FormField id="profile-role" label="Role">
            <Select
              id="profile-role"
              value={role}
              onChange={(value) => {
                setRole(value);
                setSaved(false);
              }}
              className="w-full"
              options={Array.from(new Set(team.map((member) => member.role))).map(
                (value) => ({ value, label: value }),
              )}
            />
          </FormField>

          <FormField
            id="profile-timezone"
            label="Time zone"
            hint="Used for due-date reminders."
          >
            <Select
              id="profile-timezone"
              value="utc"
              onChange={() => setSaved(false)}
              className="w-full"
              options={[
                { value: "utc", label: "UTC (default)" },
                { value: "local", label: "Browser local time" },
              ]}
            />
          </FormField>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button type="submit">Save changes</Button>
          {saved && (
            <p role="status" className="text-xs text-muted">
              Profile edits are a Phase 2 preview — nothing is persisted yet.
            </p>
          )}
        </div>
      </form>
    </DashboardCard>
  );
}
