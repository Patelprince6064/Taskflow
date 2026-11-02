# Database migrations

This directory holds the schema history for TaskFlow's **Supabase PostgreSQL**
database.

## Status

**No migrations exist yet — by design.**

Phase 1 only prepares the project structure. Database integration happens in
**Phase 3**, and until then:

- No database driver (e.g. `psycopg`) is installed in `backend/requirements.txt`.
- No connection pool, ORM session or fake in-memory/SQLite substitute exists.
  SQLite would silently diverge from PostgreSQL behaviour, so it is explicitly
  avoided as a stand-in for Supabase.

## Planned integration (Phase 3)

1. **Provision** a Supabase project and take the connection string from
   *Project Settings → Database*.
2. **Store** it as `DATABASE_URL` in `backend/.env` (and in the hosting
   provider's secret store for Render) — never in source control.
3. **Connect** through a small data-access layer in `backend/app/models/`,
   using a direct PostgreSQL connection (Supabase is standard PostgreSQL and
   works with any driver).
4. **Migrate** by applying the SQL files below in lexicographic order, tracking
   applied versions in a `schema_migrations` bookkeeping table.

## Conventions

| Rule | Value |
| --- | --- |
| File naming | `NNN_snake_case_description.sql` (e.g. `001_create_users.sql`) |
| Ordering | Applied ascending: `001`, `002`, `003`, ... |
| Immutability | Applied migrations are never edited — write a new one instead |
| Reversibility | Each file should document a manual rollback statement in a header comment |
| Scope | One logical change per file (keep diffs reviewable) |
| Safety | Start with `BEGIN;` / `COMMIT;` so a failed migration leaves no partial schema |

## Example file

```sql
-- 001_create_tasks.sql
-- Purpose: create the tasks table
-- Rollback: DROP TABLE IF EXISTS tasks;

BEGIN;

CREATE TABLE IF NOT EXISTS tasks (...);

COMMIT;
```
