"use client";

/**
 * Application sidebar.
 *
 * Renders the brand, grouped navigation with active indicators, an unread
 * badge on Notifications and the signed-in profile. On small screens the same
 * content slides in as a drawer (toggled by the header menu button).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";
import { NAV_GROUPS, isNavActive } from "@/lib/nav";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import LogoMark from "@/components/ui/logo";
import UserAvatar from "@/components/ui/user-avatar";

interface SidebarProps {
  /** Mobile drawer visibility (desktop rail is always shown). */
  open: boolean;
  onClose: () => void;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { unreadCount } = useDemoStore();

  return (
    <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-5 last:mb-0">
          <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isNavActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                      active
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "font-medium text-slate-600 hover:bg-canvas hover:text-ink",
                    )}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 -left-3 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600"
                      />
                    )}
                    <Icon
                      className={cn("h-4.5 w-4.5 shrink-0", active ? "text-brand-600" : "text-muted")}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge === "notifications" && unreadCount > 0 && (
                      <span
                        className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums"
                        aria-label={`${unreadCount} unread notifications`}
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarContent({ open, onClose }: SidebarProps) {
  const { currentUser } = useDemoStore();

  // Escape closes the drawer (desktop rail has no open state to close).
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Brand */}
      <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <LogoMark className="h-8 w-8" />
          <span className="text-base font-semibold tracking-tight text-ink">
            TaskFlow
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <NavList onNavigate={onClose} />

      {/* Profile */}
      <div className="border-t border-line p-3">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <UserAvatar name={currentUser.name} id={currentUser.id} size="md" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">
              {currentUser.name}
            </span>
            <span className="block truncate text-xs text-muted">
              {currentUser.role}
            </span>
          </span>
        </Link>
      </div>
    </>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <SidebarContent open={false} onClose={onClose} />
      </aside>

      {/* Mobile drawer */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "visible" : "invisible",
        )}
      >
        <div
          onClick={onClose}
          className={cn(
            "absolute inset-0 bg-slate-900/40 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-64 max-w-[85vw] flex-col bg-surface shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent open={open} onClose={onClose} />
        </div>
      </div>
    </>
  );
}
