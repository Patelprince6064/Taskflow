import type { Metadata } from "next";
import { Suspense } from "react";

import TaskDetailsView from "@/components/tasks/task-details-view";

export const metadata: Metadata = {
  title: "Task details",
};

/**
 * Deterministic placeholder for the details route while `params` streams in.
 * Must stay free of dates/randomness (prerender shell rule).
 */
function TaskDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading task" className="flex flex-col gap-5">
      <span className="h-5 w-28 animate-pulse rounded bg-slate-200" />
      <span className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <span className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          <span className="h-64 animate-pulse rounded-2xl bg-slate-100" />
        </div>
        <span className="h-80 animate-pulse rounded-2xl bg-slate-100" />
      </div>
      <span className="sr-only">Loading task…</span>
    </div>
  );
}

/**
 * Task details route. `params` is a Promise in Next 16 (async request APIs);
 * awaiting it inside a `<Suspense>` boundary keeps the rest of the shell
 * instantly navigable (Next.js "instant-shell-url-data" guidance). The task
 * itself is read from the demo store on the client — Phase 3 will fetch by id
 * instead.
 */
export default function TaskDetailsPage({
  params,
}: PageProps<"/tasks/[id]">) {
  return (
    <Suspense fallback={<TaskDetailsSkeleton />}>
      <TaskDetailsContent params={params} />
    </Suspense>
  );
}

async function TaskDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TaskDetailsView taskId={id} />;
}
