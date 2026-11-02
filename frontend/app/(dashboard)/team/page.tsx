import type { Metadata } from "next";

import TeamView from "@/components/team/team-view";

export const metadata: Metadata = {
  title: "Team Members",
};

/** Team roster with search and role filters. */
export default function TeamPage() {
  return <TeamView />;
}
