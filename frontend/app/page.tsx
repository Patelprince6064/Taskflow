import Link from "next/link";

import ApiStatus from "@/components/dashboard/api-status";
import { buttonClasses } from "@/components/ui/button";
import Card, { CardDescription, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/api";

/** Phase 1 deliverables rendered as the product "stack" overview. */
const STACK_CARDS = [
  {
    title: "Next.js frontend",
    description:
      "App Router, TypeScript and Tailwind CSS on a clean, responsive layout, ready for the full dashboard UI.",
    meta: "frontend/",
  },
  {
    title: "Flask REST API",
    description:
      "Modular application factory with CORS, JSON error handling and a health endpoint covered by pytest.",
    meta: "backend/",
  },
  {
    title: "Delivery-ready foundation",
    description:
      "Environment templates, git hygiene and documentation prepared for Vercel, Render and Supabase.",
    meta: "migrations/",
  },
];

/** Work intentionally deferred to later phases — described, never faked. */
const NEXT_UP = [
  "Google OAuth 2.0 sign-in",
  "Supabase PostgreSQL schema and migrations",
  "Gmail API notifications",
];

/**
 * Phase 1 placeholder: a landing/dashboard entry point that documents the
 * foundation and verifies frontend → backend connectivity. The real dashboard
 * is built in a later phase.
 */
export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Phase 1 · Foundation ready
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Team task management, built for clarity.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            TaskFlow gives teams one place to plan, assign and track work — a
            modern Next.js interface backed by a Flask REST API and Supabase
            PostgreSQL.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={buildApiUrl("/api/health")}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses("primary", "md")}
            >
              Open API health
            </Link>
            <a href="#stack" className={buttonClasses("secondary", "md")}>
              Explore the stack
            </a>
          </div>
        </div>
      </section>

      {/* Stack overview */}
      <section id="stack" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          What Phase 1 ships
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          A clean, maintainable foundation for a real production application —
          nothing duplicated, nothing faked.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STACK_CARDS.map((card) => (
            <Card key={card.title}>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription className="mt-2">
                {card.description}
              </CardDescription>
              <p className="mt-4 font-mono text-xs text-brand-700">
                {card.meta}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Connectivity + roadmap */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Backend connectivity
            </h2>
            <p className="mt-2 text-muted">
              The frontend reads <code className="font-mono text-sm text-ink">NEXT_PUBLIC_API_URL</code>{" "}
              and calls the Flask API directly, with CORS restricted to this
              app&apos;s origin.
            </p>
            <div className="mt-6">
              <ApiStatus />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Next up
            </h2>
            <p className="mt-2 text-muted">
              Future capabilities are planned in the README but deliberately not
              implemented yet.
            </p>
            <ul className="mt-6 space-y-3">
              {NEXT_UP.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  {item}
                  <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted ring-1 ring-inset ring-line">
                    Planned
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
