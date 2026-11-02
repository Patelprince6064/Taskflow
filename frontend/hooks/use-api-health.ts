"use client";

import { useCallback, useEffect, useState } from "react";

import { buildApiUrl, fetchJson } from "@/lib/api";
import type { ApiHealthResponse, ApiHealthState } from "@/types/api";

/** Give up on a health check after this long so the UI never hangs. */
const HEALTH_CHECK_TIMEOUT_MS = 5000;

interface ApiHealthResult {
  /** State of the most recent health check. */
  status: ApiHealthState;
  /** Time of the last completed check, or `null` before the first one. */
  checkedAt: Date | null;
  /** Ask for a new health check (call from event handlers). */
  refresh: () => void;
  /** True while a check is in flight. */
  isChecking: boolean;
}

/**
 * Run `GET /api/health` on mount and expose the result to the UI.
 *
 * Design notes:
 * - `refresh` lives in the event handler and bumps `attempt`; the effect
 *   itself only writes state from asynchronous callbacks, so renders are
 *   never cascaded synchronously.
 * - Each check owns an `AbortController`; cleanup cancels it on unmount and
 *   before a newer attempt starts, so the visible state always belongs to the
 *   latest request.
 */
export function useApiHealth(): ApiHealthResult {
  const [status, setStatus] = useState<ApiHealthState>("checking");
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [attempt, setAttempt] = useState(0);

  const refresh = useCallback((): void => {
    setStatus("checking");
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const run = async (): Promise<void> => {
      try {
        await fetchJson<ApiHealthResponse>(buildApiUrl("/api/health"), {
          timeoutMs: HEALTH_CHECK_TIMEOUT_MS,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setStatus("online");
          setCheckedAt(new Date());
        }
      } catch {
        // Aborted means a newer attempt owns the state - leave it alone.
        if (!controller.signal.aborted) {
          setStatus("offline");
          setCheckedAt(new Date());
        }
      }
    };

    void run();

    return () => controller.abort();
  }, [attempt]);

  return { status, checkedAt, refresh, isChecking: status === "checking" };
}
