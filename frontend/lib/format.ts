/**
 * Date/time formatting helpers.
 *
 * Every formatter pins `timeZone: "UTC"` so the server (usually UTC) and the
 * browser (usually local time) render identical strings during hydration.
 */

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
};

/** Parse a `YYYY-MM-DD` calendar date as UTC midnight (no timezone shift). */
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
}

/** `2026-11-05` -> `Nov 5, 2026`. Accepts full ISO timestamps too. */
export function formatDate(value: string): string {
  const date = value.length === 10 ? parseDateOnly(value) : new Date(value);
  return date.toLocaleDateString("en-US", DATE_OPTIONS);
}

/** `2026-11-05T09:30:00Z` -> `Nov 5, 2026 · 09:30`. */
export function formatDateTime(value: string): string {
  const date = new Date(value);
  const day = date.toLocaleDateString("en-US", DATE_OPTIONS);
  const time = date.toLocaleTimeString("en-US", TIME_OPTIONS);
  return `${day} · ${time}`;
}

/** Today's calendar date in the *local* timezone, as `YYYY-MM-DD`. */
export function todayIso(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Whole days from `from` to `to` (both `YYYY-MM-DD`, computed in UTC). */
function daysBetween(from: string, to: string): number {
  const a = parseDateOnly(from).getTime();
  const b = parseDateOnly(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

/**
 * Human due-date label: `Overdue` / `Due today` / `Due tomorrow` /
 * `Due in N days` / `Due Nov 20, 2026`.
 *
 * Deterministic for a given `dueDate` (only depends on today's local date),
 * so server and client agree during hydration on the same day.
 */
export function dueLabel(dueDate: string): string {
  const today = todayIso();
  if (dueDate < today) return "Overdue";
  if (dueDate === today) return "Due today";

  const diff = daysBetween(today, dueDate);
  if (diff === 1) return "Due tomorrow";
  if (diff <= 14) return `Due in ${diff} days`;
  return `Due ${formatDate(dueDate)}`;
}

/** `Jordan Lee` -> `JL` (used by `UserAvatar`). */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
