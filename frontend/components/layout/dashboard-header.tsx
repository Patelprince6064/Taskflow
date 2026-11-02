"use client";

/**
 * Top navigation bar: mobile menu trigger, page title + breadcrumbs, global
 * search, notification bell, profile menu and the Create Task action.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Plus, Settings, UserRound } from "lucide-react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import { getPageMeta } from "@/lib/nav";
import Button from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import UserAvatar from "@/components/ui/user-avatar";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  onCreateTask: () => void;
}

export default function DashboardHeader({
  onMenuClick,
  onCreateTask,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { search, setSearch, unreadCount, currentUser } = useDemoStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { title, breadcrumbs } = getPageMeta(pathname);

  // Close the profile menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function handleSearchEnter() {
    if (pathname !== "/tasks") router.push("/tasks");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Title + breadcrumbs */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-ink sm:text-lg">
            {title}
          </h1>
          {breadcrumbs.length > 1 && (
            <nav aria-label="Breadcrumb" className="hidden sm:block">
              <ol className="flex items-center gap-1 text-xs text-muted">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.label} className="flex items-center gap-1">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-brand-700"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-slate-500">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        {/* Search */}
        <SearchBar
          value={search}
          onChange={setSearch}
          onKeyDown={handleSearchEnter}
          placeholder="Search tasks…"
          label="Search tasks"
          className="hidden w-56 md:block lg:w-72"
        />

        {/* Notifications */}
        <Link
          href="/notifications"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface"
              aria-hidden="true"
            />
          )}
        </Link>

        {/* Profile menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="flex items-center gap-1.5 rounded-lg p-1 pr-2 transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <UserAvatar name={currentUser.name} id={currentUser.id} size="sm" />
            <ChevronDown
              className={`hidden h-4 w-4 text-muted transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
            >
              <div className="border-b border-line px-4 py-3">
                <p className="truncate text-sm font-semibold text-ink">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-muted">
                  {currentUser.email}
                </p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  Settings
                </Link>
              </div>
              <p className="border-t border-line bg-canvas px-4 py-2.5 text-[11px] text-muted">
                Demo workspace — no sign-in configured in Phase 2.
              </p>
            </div>
          )}
        </div>

        {/* Create task */}
        <Button
          onClick={onCreateTask}
          className="hidden sm:inline-flex"
          aria-label="Create task"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Task
        </Button>
        <Button
          onClick={onCreateTask}
          aria-label="Create task"
          className="sm:hidden !px-2.5"
        >
          <Plus className="h-4.5 w-4.5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
