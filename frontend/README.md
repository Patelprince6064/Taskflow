# TaskFlow — Frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 client for TaskFlow.

## Commands

```bash
npm install       # install dependencies
npm run dev       # development server on http://localhost:3000
npm run lint      # ESLint
npx tsc --noEmit  # type check
npm run build     # production build
```

## Layout

| Path | Purpose |
| --- | --- |
| `app/` | Routes, root layout and global styles (`globals.css` holds the Tailwind theme tokens) |
| `app/(dashboard)/` | Dashboard route group — one thin server page per route (with `metadata`) rendering a client view |
| `components/ui/` | Reusable primitives: `button`, `card`, `logo`, `modal`, `badge`, `search-bar`, `empty-state`, form controls |
| `components/layout/` | Dashboard chrome: `sidebar`, `dashboard-header`, `dashboard-shell` |
| `components/dashboard/` | Dashboard sections (stat cards, completion overview, activity feed, `api-status`) |
| `components/tasks/` | Task features: cards, table, Kanban, toolbar, create/edit modal, details view |
| `components/team/`, `components/notifications/`, `components/settings/` | Feature views for those routes |
| `components/providers/` | `demo-data-provider` — the Phase 2 demo store (context + reducer) |
| `hooks/` | React hooks (`use-api-health`) |
| `lib/` | Shared utilities — API client (`api.ts`), demo storage/seed/reducer, task queries, formatting |
| `types/` | Shared contracts (API + demo domain types) |
| `public/` | Static assets |

## Demo data (Phase 2)

Sample tasks/team/notifications live in `lib/sample-data.ts`, flow through the
reducer in `lib/demo-reducer.ts`, and are mirrored to `localStorage` by
`lib/demo-storage.ts` — that storage module is the single seam to replace with
real API calls in Phase 3. No backend data is written by the frontend yet.

## Environment

Copy `.env.example` to `.env.local` (git-ignored):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000   # Flask API base URL
```

See the [root README](../README.md) for the full architecture, setup and roadmap.
