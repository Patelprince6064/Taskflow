"use client";

/**
 * Settings › Account preferences — UI placeholder (no real account system
 * exists in Phase 2).
 */

import { useState } from "react";

import Button, { buttonClasses } from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import FormField from "@/components/ui/form-field";
import Select from "@/components/ui/select";

export default function AccountSection() {
  const [language, setLanguage] = useState("en");
  const [weekStart, setWeekStart] = useState("monday");
  const [saved, setSaved] = useState(false);

  return (
    <DashboardCard
      title="Account preferences"
      subtitle="Regional and workspace defaults"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="account-language" label="Language">
            <Select
              id="account-language"
              value={language}
              onChange={(value) => {
                setLanguage(value);
                setSaved(false);
              }}
              className="w-full"
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Español" },
                { value: "fr", label: "Français" },
              ]}
            />
          </FormField>

          <FormField id="account-week-start" label="Week starts on">
            <Select
              id="account-week-start"
              value={weekStart}
              onChange={(value) => {
                setWeekStart(value);
                setSaved(false);
              }}
              className="w-full"
              options={[
                { value: "monday", label: "Monday" },
                { value: "sunday", label: "Sunday" },
              ]}
            />
          </FormField>
        </div>

        <div className="rounded-lg border border-line bg-canvas px-4 py-3">
          <p className="text-sm font-medium text-ink">Danger zone</p>
          <p className="mt-0.5 text-xs text-muted">
            Deleting the account requires authentication, which arrives in a
            later phase.
          </p>
          <span className="mt-2 inline-block">
            <button
              type="button"
              disabled
              className={`${buttonClasses("secondary", "sm")} cursor-not-allowed opacity-60`}
              title="Not available in the Phase 2 demo"
            >
              Delete account
            </button>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button type="submit">Save changes</Button>
          {saved && (
            <p role="status" className="text-xs text-muted">
              Preferences are a Phase 2 preview — nothing is persisted yet.
            </p>
          )}
        </div>
      </form>
    </DashboardCard>
  );
}
