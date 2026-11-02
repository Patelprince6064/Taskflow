"use client";

/**
 * Settings › System — the Phase 1 backend health check plus a demo-data
 * reset. This is the only place that touches real infrastructure status.
 */

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import ApiStatus from "@/components/dashboard/api-status";

export default function SystemSection() {
  const { resetDemoData } = useDemoStore();
  const [message, setMessage] = useState<string | null>(null);

  function handleReset() {
    const confirmed = window.confirm(
      "Reset the demo workspace back to the sample data? Your locally created tasks will be removed.",
    );
    if (!confirmed) return;

    resetDemoData();
    setMessage("Demo data was reset to the original sample seed.");
  }

  return (
    <div className="flex flex-col gap-5">
      <DashboardCard
        title="System"
        subtitle="Demo workspace maintenance"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Sample data</p>
            <p className="mt-0.5 text-xs text-muted">
              Tasks you create in Phase 2 live in this browser only
              (localStorage). Reset restores the original sample workspace.
            </p>
            {message && (
              <p role="status" className="mt-1.5 text-xs text-emerald-700">
                {message}
              </p>
            )}
          </div>
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset demo data
          </Button>
        </div>
      </DashboardCard>

      {/* Phase 1 integration check, unchanged. */}
      <ApiStatus />
    </div>
  );
}
