import type { ReactNode } from "react";
import { Suspense } from "react";

import DashboardShell from "@/components/layout/dashboard-shell";

/**
 * Deterministic loading skeleton shown while the dashboard shell streams in.
 *
 * The demo store derives sample dates from "now", which cannot be baked into
 * a static prerender — the `<Suspense>` boundary below defers the shell to a
 * per-request/client render (Next.js "blocking-prerender-current-time-client"
 * guidance). The fallback itself must stay 100% deterministic, so it only
 * uses fixed markup: no dates, no randomness.
 */
function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="flex min-h-screen bg-canvas"
    >
      {/* Sidebar placeholder */}
      <div className="hidden w-64 shrink-0 border-r border-line bg-surface lg:block">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
          <span className="h-8 w-8 animate-pulse rounded-xl bg-slate-200" />
          <span className="h-5 w-24 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="space-y-3 px-5 py-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="block h-8 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>

      {/* Main area placeholder */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-16 border-b border-line bg-surface" />
        <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <span className="h-72 animate-pulse rounded-2xl bg-slate-100 lg:col-span-2" />
            <span className="h-72 animate-pulse rounded-2xl bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <span className="h-64 animate-pulse rounded-2xl bg-slate-100" />
            <span className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}

/**
 * Route group layout for the whole dashboard.
 *
 * Server component that delegates to the client shell (sidebar, header,
 * global Create Task dialog and the demo data provider). Kept separate from
 * the root layout so every dashboard page shares one shell instance across
 * client navigations.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
