"use client";

import Button from "@/components/ui/button";
import Card, { CardDescription, CardTitle } from "@/components/ui/card";
import { useApiHealth } from "@/hooks/use-api-health";
import type { ApiHealthState } from "@/types/api";

const STATUS_STYLES: Record<
  ApiHealthState,
  { label: string; pill: string; dot: string }
> = {
  checking: {
    label: "Checking…",
    pill: "bg-brand-50 text-brand-700 ring-brand-200",
    dot: "bg-brand-500 animate-pulse",
  },
  online: {
    label: "API online",
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  offline: {
    label: "API offline",
    pill: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

/**
 * Live status card for `GET /api/health`.
 *
 * This is the Phase 1 integration check: it proves the Next.js frontend can
 * reach the Flask API (including CORS) without any mocked data.
 */
export default function ApiStatus() {
  const { status, checkedAt, refresh, isChecking } = useApiHealth();
  const styles = STATUS_STYLES[status];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Backend connection</CardTitle>
          <CardDescription>
            Live check of{" "}
            <code className="rounded bg-canvas px-1.5 py-0.5 font-mono text-xs text-ink">
              GET /api/health
            </code>
          </CardDescription>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {styles.label}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-muted">
          {checkedAt
            ? `Last checked ${checkedAt.toLocaleTimeString()}`
            : "Waiting for the first check…"}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={refresh}
          disabled={isChecking}
        >
          Re-check
        </Button>
      </div>
    </Card>
  );
}
