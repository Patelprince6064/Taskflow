/**
 * API client helpers shared by every frontend feature.
 *
 * The frontend talks to the Flask REST API through `NEXT_PUBLIC_API_URL`
 * (documented in `.env.example`). Centralising the base URL and the fetch
 * wrapper avoids duplicated, inconsistent request code.
 */

/** Base URL of the Flask API, without a trailing slash. */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

/** Resolve a path such as `/api/health` against the API base URL. */
export function buildApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

/** Thrown when a request fails, times out, or the API answers non-2xx. */
export class ApiRequestError extends Error {
  /** HTTP status returned by the API, when the server responded at all. */
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

interface FetchJsonOptions {
  /** Abort the request after this many milliseconds (default: 8000). */
  timeoutMs?: number;
  /** Optional caller-provided cancellation signal (e.g. component unmount). */
  signal?: AbortSignal;
}

/**
 * Fetch a JSON resource and surface failures as `ApiRequestError`.
 *
 * @param url - Absolute URL to request.
 * @param options - Timeout and cancellation controls.
 * @returns The parsed response body.
 * @throws {ApiRequestError} On timeout, network failure or a non-2xx status.
 */
export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { timeoutMs = 8000, signal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Forward the caller's signal so consumers can cancel on unmount.
  const forwardAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", forwardAbort, { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiRequestError(
        `Request to ${url} failed with status ${response.status}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    // `fetch` rejects on network errors and aborted (timed out) requests.
    throw new ApiRequestError(
      controller.signal.aborted
        ? `Request to ${url} timed out after ${timeoutMs}ms`
        : `Could not reach ${url}: ${error instanceof Error ? error.message : "network error"}`,
    );
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
