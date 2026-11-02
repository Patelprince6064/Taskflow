/**
 * Tiny class-name combiner (no dependency needed for a project this size).
 *
 * Filters out falsy values so conditional classes read cleanly:
 *   cn("base", isActive && "active", className)
 */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
