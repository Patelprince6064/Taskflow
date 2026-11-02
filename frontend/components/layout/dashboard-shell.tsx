"use client";

/**
 * Shell for every dashboard route: sidebar + header + content area, plus the
 * global Create Task dialog and the demo data provider.
 *
 * All interactivity lives here so each route can stay a thin server
 * component with `export const metadata`.
 */

import { useState, type ReactNode } from "react";

import { DemoDataProvider } from "@/components/providers/demo-data-provider";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import DashboardHeader from "@/components/layout/dashboard-header";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <DemoDataProvider>
      <div className="flex min-h-screen bg-canvas">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            onMenuClick={() => setNavOpen(true)}
            onCreateTask={() => setCreateOpen(true)}
          />
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </DemoDataProvider>
  );
}
