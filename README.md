# TaskFlow — Team Task Management

A professional, production-oriented web application for planning, assigning and tracking team work. TaskFlow is being built as the **Hairdrama Tech internship assignment**, one phase at a time, on a clean monorepo foundation.

> **Status: Phase 2 complete (Professional UI/UX).** This repository contains the monorepo foundation from Phase 1 plus the full Phase 2 dashboard frontend: sidebar/top-nav shell, dashboard, task list & Kanban views, task details, team, notifications and settings pages, all backed by isolated sample data. Authentication, database persistence and email remain intentionally **not** implemented — they belong to future phases.

---

## 1. Project overview

TaskFlow gives teams a single place to organize work: create tasks, assign them to members, track status and keep everyone aligned. This repository holds both the web client and the API that powers it.

**Phase 1 delivers:**

- A clean monorepo (`frontend/`, `backend/`, `migrations/`).
- A Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 frontend with a professional light UI.
- A modular Flask REST API with an application factory, CORS, JSON error handling and a `/api/health` endpoint.
- Automated backend tests (pytest) and frontend linting/type-checking.
- Environment templates, `.gitignore` and this README.

**Phase 2 delivers:**

- A premium SaaS dashboard shell: left sidebar (navigation, active indicators, profile), top bar (title, breadcrumbs, search, notifications, avatar menu, Create Task).
- Pages: dashboard overview, tasks (list ⇄ Kanban, search, status/priority filters, due-date sorting), task details with activity timeline, team roster, notifications feed and settings.
- Reusable component library (`components/ui`) plus feature components for tasks, team, notifications and settings.
- A client-side demo store (React context + reducer) seeded with realistic sample data and mirrored to `localStorage` — deliberately isolated so Phase 3 can swap in REST calls without touching the UI.
- Frontend-only task creation/editing with form validation, status updates, completion and notification interactions.

---

## 2. Project objectives

1. **Production-ready architecture** — clear separation between frontend, API and database concerns, so each can be developed, tested and deployed independently.
2. **Type safety end to end** — strict TypeScript on the client, explicit typing and PEP 8 conventions on the server.
3. **Real integrations only** — no mocked authentication, fake emails or placeholder database connections; unfinished capabilities are documented instead of faked.
4. **Quality gates from day one** — automated tests, linting, and a health endpoint usable as a deployment smoke check.
5. **Iterative delivery** — phases are completed and reviewed one at a time.

---

## 3. Technology stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Frontend | **Next.js 16 (App Router)**, **React 19**, **TypeScript** | Server-first React with strict typing |
| Styling | **Tailwind CSS 4** | CSS-first configuration, design tokens in `globals.css` |
| Backend | **Python 3**, **Flask 3** | REST API via blueprint + application factory |
| Database | **Supabase PostgreSQL** | Planned for Phase 3 (not yet connected) |
| Authentication | **Google OAuth 2.0** | Future phase |
| Email | **Gmail API** | Future phase |
| Frontend hosting | **Vercel** | Future phase |
| Backend hosting | **Render** | Future phase |
| Testing | **pytest**, **ESLint**, `tsc` | Backend tests + frontend static checks |

---

## 4. Architecture overview

The browser only ever talks to the Next.js frontend and the Flask API. The API is the single owner of database access, so credentials never reach the client.

```mermaid
flowchart LR
    subgraph Browser
        U["User"]
    end

    subgraph "Frontend — Vercel"
        N["Next.js 16<br/>App Router · TypeScript · Tailwind"]
    end

    subgraph "Backend — Render"
        F["Flask REST API<br/>routes · services · models"]
    end

    subgraph "Data — Phase 3"
        S[("Supabase PostgreSQL")]
    end

    U -- "renders UI" --> N
    N -- "HTTPS · JSON<br/>GET /api/health (live)" --> F
    F -- "SQL over TLS (Phase 3)" .-> S
    F -.- P["Google OAuth 2.0 · Gmail API<br/>future phases"]

    style N fill:#eff6ff,stroke:#2563eb
    style F fill:#eff6ff,stroke:#2563eb
    style S fill:#f8fafc,stroke:#94a3b8,stroke-dasharray: 5 5
```

**Key decisions**

- **Application factory** (`backend/app/__init__.py`) — `create_app()` wires configuration, CORS, blueprints and error handlers, which keeps `run.py` trivial and makes testing trivial too.
- **Blueprints for routes** — every feature area registers its own routes, so Phase 2+ can add endpoints without touching the factory.
- **Configuration objects** (`backend/config.py`) — environment-driven `development` / `testing` / `production` classes; no hardcoded credentials.
- **Thin frontend API client** (`frontend/lib/api.ts`) — a single base URL and one typed `fetchJson` helper used by every feature, with timeouts and cancellation.
- **Contracts in one place** (`frontend/types/api.ts`) — response shapes are typed once and shared by components.

---

## 5. Folder structure

```text
taskflow-team-management/
├── frontend/                      # Next.js 16 application
│   ├── app/                       # App Router: root layout, global styles
│   │   ├── globals.css            # Tailwind 4 theme tokens + base styles
│   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   └── (dashboard)/           # Dashboard route group + shell layout
│   │       ├── page.tsx           # Overview (summary cards + sections)
│   │       ├── tasks/             # My/Assigned/Created/Completed + [id]
│   │       ├── team/              # Team members
│   │       ├── notifications/     # Notification feed
│   │       └── settings/          # Settings sections
│   ├── components/                # Reusable UI
│   │   ├── dashboard/             # Dashboard sections + api-status
│   │   ├── layout/                # sidebar, dashboard-header, dashboard-shell
│   │   ├── providers/             # demo-data-provider (demo store)
│   │   ├── tasks/                 # task card/table/kanban/modal/details
│   │   ├── team/ · notifications/ · settings/   # Feature views
│   │   └── ui/                    # button, card, modal, badges, form controls
│   ├── hooks/                     # React hooks (use-api-health)
│   ├── lib/                       # Utilities: api client, demo seed/store, queries, formatting
│   ├── types/                     # Shared TypeScript contracts
│   ├── public/                    # Static assets
│   ├── .env.example               # Frontend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # Flask REST API
│   ├── app/
│   │   ├── __init__.py            # create_app() application factory
│   │   ├── routes/                # Blueprints (health.py)
│   │   ├── services/              # Business logic (empty until Phase 3)
│   │   ├── models/                # Data models (empty until Phase 3)
│   │   └── utils/                 # Shared helpers (errors.py)
│   ├── tests/                     # pytest suite (health, errors, CORS)
│   ├── .env.example               # Backend environment template
│   ├── config.py                  # Environment configuration classes
│   ├── pytest.ini                 # pytest configuration
│   ├── run.py                     # Development entrypoint
│   └── requirements.txt           # Python dependencies
│
├── migrations/                    # SQL migrations for Supabase (Phase 3)
│   └── README.md                  # Conventions and integration plan
│
├── .env.example                   # Complete environment template
├── .gitignore
└── README.md
```

---

## 6. Frontend installation

Requirements: **Node.js 20.9+** (Node 22/24 recommended) and npm.

```bash
cd frontend
npm install
```

This installs Next.js, React, TypeScript, Tailwind CSS and ESLint from `package.json`.

---

## 7. Backend installation

Requirements: **Python 3.10+** (verified on 3.14).

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# macOS / Linux
source .venv/bin/activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

---

## 8. Environment setup

Template files (no real secrets, ever):

| File | Loaded by |
| --- | --- |
| `.env.example` (root) | Reference copy of every variable |
| `frontend/.env.example` | Next.js → copy to `frontend/.env.local` |
| `backend/.env.example` | python-dotenv → copy to `backend/.env` |

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend (Windows PowerShell: Copy-Item)
cp backend/.env.example backend/.env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Flask API base URL used by the browser |
| `FLASK_ENV` | `development` | Selects `development` / `testing` / `production` config |
| `FLASK_DEBUG` | `True` | Werkzeug debugger and auto-reloader |
| `PORT` | `5000` | API port |
| `FRONTEND_URL` | `http://localhost:3000` | Origin allowed by CORS |

`.env` and `.env.*` files are git-ignored (`.env.example` is explicitly not).

---

## 9. How to run locally

Open **two terminals** from the repository root.

**Terminal 1 — backend (port 5000):**

```bash
cd backend
python run.py
# Windows: .\.venv\Scripts\python.exe run.py
```

**Terminal 2 — frontend (port 3000):**

```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000**. The dashboard loads the Phase 2 demo workspace (sample tasks, team and notifications). The live *Backend connection* card that calls `GET /api/health` now lives under **Settings → System** and should read **API online** when the backend is running.

**Other commands**

```bash
# Backend tests
cd backend && python -m pytest

# Frontend lint + type check
cd frontend && npm run lint && npx tsc --noEmit

# Production build
cd frontend && npm run build
```

---

## 10. API health endpoint

The foundation endpoint used for smoke checks and the frontend status card.

| | |
| --- | --- |
| **Method** | `GET` |
| **URL** | `/api/health` |
| **Base URL (local)** | `http://localhost:5000` |
| **Auth** | None |
| **Success** | `200 OK` |

**Request**

```bash
curl http://localhost:5000/api/health
```

**Response**

```json
{
  "status": "success",
  "message": "TaskFlow API is running"
}
```

**Error envelope** (used by 404 / 405 / 500 handlers)

```json
{
  "status": "error",
  "message": "Resource not found"
}
```

**CORS** — responses include `Access-Control-Allow-Origin: http://localhost:3000` (the configured `FRONTEND_URL`), so the browser client is permitted to call the API.

**Verified in Phase 1:** `curl` returns `200` with the payload above, and the pytest suite (8 tests) covers the payload, JSON content type, unsupported methods, error shapes and CORS origin rules.

---

## 11. Future development phases

| Phase | Scope | Status |
| --- | --- | --- |
| **Phase 1** | Project initialization: monorepo, frontend, Flask API, health endpoint, tests, docs | ✅ Complete |
| **Phase 2** | Professional UI/UX: full dashboard frontend on sample data (no backend changes) | ✅ Complete |
| **Phase 3** | Backend integration: **Supabase PostgreSQL** CRUD, **Google OAuth 2.0** | ⬜ Planned |
| **Phase 4** | **Gmail API** notifications | ⬜ Planned |
| **Phase 5** | Deployment: **Vercel** (frontend) + **Render** (backend) | ⬜ Planned |

*Only Phase 1 and the Phase 3 database milestone are fixed by the specification; the ordering of the remaining phases will be confirmed with the project owner.*

Each phase is implemented only after review and approval of the previous one.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `EADDRINUSE` on port 3000/5000 | Stop the process already using the port |
| Frontend status card says *API offline* | Start the backend: `python run.py` inside `backend/` |
| CORS error in the browser | Confirm `FRONTEND_URL=http://localhost:3000` in `backend/.env` |
| `ModuleNotFoundError: app` | Run pytest from `backend/` (the `pythonpath = .` setting in `pytest.ini` handles it) |
| `next dev` reports another instance running | Next 16 locks the dev project — stop the old process first |
