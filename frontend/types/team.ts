/**
 * Domain types for team members.
 */

/** Roles available in the demo workspace (used by the role filter). */
export type TeamRole =
  | "Product Manager"
  | "Designer"
  | "Developer"
  | "QA Engineer";

/** A member of the TaskFlow workspace. */
export interface TeamMember {
  id: string;
  name: string;
  /** Uses the reserved `.test` domain: these are sample people, not real users. */
  email: string;
  role: TeamRole;
  /**
   * Optional avatar image URL. The demo renders initials instead
   * (`UserAvatar`), so this stays empty until real profiles exist.
   */
  avatarUrl?: string;
}
