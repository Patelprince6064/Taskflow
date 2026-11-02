/**
 * Shared API contracts between the Flask backend and the Next.js frontend.
 *
 * Keeping response shapes in one place lets components consume the API with
 * full type safety instead of untyped `any` payloads.
 */

/** Response returned by `GET /api/health` (see backend/app/routes/health.py). */
export interface ApiHealthResponse {
  status: "success" | "error";
  message: string;
}

/** Client-side state of the API health check. */
export type ApiHealthState = "checking" | "online" | "offline";
