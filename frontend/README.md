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
| `components/ui/` | Reusable primitives: `button`, `card`, `logo` |
| `components/layout/` | Page chrome: `site-header`, `site-footer` |
| `components/dashboard/` | Feature composites (e.g. `api-status`) |
| `hooks/` | React hooks (`use-api-health`) |
| `lib/` | Shared utilities — the typed API client (`api.ts`) |
| `types/` | Shared API contracts |
| `public/` | Static assets |

## Environment

Copy `.env.example` to `.env.local` (git-ignored):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000   # Flask API base URL
```

See the [root README](../README.md) for the full architecture, setup and roadmap.
