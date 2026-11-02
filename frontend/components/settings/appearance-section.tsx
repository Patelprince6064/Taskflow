"use client";

/**
 * Settings › Appearance — UI placeholder for theme and density choices.
 * (Only the light theme ships in Phase 2; the controls preview what's coming.)
 */

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/cn";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import Switch from "@/components/ui/switch";

type Theme = "light" | "dark" | "system";

const THEMES: Array<{ value: Theme; label: string; hint: string }> = [
  { value: "light", label: "Light", hint: "Clean white surfaces" },
  { value: "dark", label: "Dark", hint: "Ships in a later phase" },
  { value: "system", label: "System", hint: "Match device setting" },
];

export default function AppearanceSection() {
  const [theme, setTheme] = useState<Theme>("light");
  const [compact, setCompact] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <DashboardCard
      title="Appearance"
      subtitle="Personalise how TaskFlow looks for you"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        className="flex flex-col gap-5"
      >
        <fieldset>
          <legend className="text-sm font-medium text-ink">Theme</legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {THEMES.map((option) => {
              const active = theme === option.value;

              return (
                <label
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer flex-col rounded-xl border p-3 transition-colors",
                    active
                      ? "border-brand-400 bg-brand-50 ring-2 ring-brand-100"
                      : "border-line bg-surface hover:border-slate-300",
                    option.value === "dark" && "opacity-70",
                  )}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={active}
                    onChange={() => {
                      setTheme(option.value);
                      setSaved(false);
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-2 text-sm font-medium text-ink">
                    {option.label}
                    {active && (
                      <Check className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-0.5 text-xs text-muted">{option.hint}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-canvas px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Compact density</p>
            <p className="mt-0.5 text-xs text-muted">
              Tighten rows and cards to fit more on screen.
            </p>
          </div>
          <Switch
            label="Compact density"
            hideLabel
            checked={compact}
            onChange={(checked) => {
              setCompact(checked);
              setSaved(false);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button type="submit">Save changes</Button>
          {saved && (
            <p role="status" className="text-xs text-muted">
              Appearance is a Phase 2 preview — nothing is persisted yet.
            </p>
          )}
        </div>
      </form>
    </DashboardCard>
  );
}
