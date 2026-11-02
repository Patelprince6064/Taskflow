"use client";

/**
 * Team page view: searchable, role-filterable roster of member cards.
 */

import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import { useDemoStore } from "@/components/providers/demo-data-provider";
import EmptyState from "@/components/ui/empty-state";
import SearchBar from "@/components/ui/search-bar";
import Select from "@/components/ui/select";
import TeamMemberCard from "@/components/team/team-member-card";
import type { TeamRole } from "@/types/team";

export default function TeamView() {
  const { team } = useDemoStore();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<TeamRole | "all">("all");

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(team.map((member) => member.role)));
    return [
      { value: "all" as const, label: "All roles" },
      ...roles.map((value) => ({ value, label: value })),
    ];
  }, [team]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return team.filter((member) => {
      if (role !== "all" && member.role !== role) return false;
      if (term) {
        const haystack = `${member.name} ${member.email} ${member.role}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [team, search, role]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-xs sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
          label="Search team members"
          className="w-full sm:max-w-xs"
        />
        <Select
          aria-label="Filter by role"
          value={role}
          onChange={setRole}
          options={roleOptions}
          className="w-full sm:w-auto"
        />
        <p
          aria-live="polite"
          className="text-xs text-muted sm:ml-auto sm:pr-1"
        >
          {filtered.length} {filtered.length === 1 ? "member" : "members"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          Icon={Users}
          title="No team members match"
          description="Try a different name, email or role filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
