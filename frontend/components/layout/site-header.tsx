import Link from "next/link";

import LogoMark from "@/components/ui/logo";

/**
 * Sticky application header rendered by the root layout on every page.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <LogoMark className="h-8 w-8 transition-transform group-hover:-rotate-3" />
          <span className="text-lg font-semibold tracking-tight text-ink">
            TaskFlow
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav
            aria-label="Primary"
            className="flex items-center gap-4 text-sm font-medium text-muted sm:gap-6"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Dashboard
            </Link>
            <a href="#stack" className="hidden transition-colors hover:text-ink sm:block">
              Stack
            </a>
          </nav>
          <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            Phase 1
          </span>
        </div>
      </div>
    </header>
  );
}
