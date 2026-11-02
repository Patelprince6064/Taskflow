"use client";

/**
 * Team member summary card: avatar, identity and workload counters.
 */

import { cn } from "@/lib/cn";
import { useDemoStore } from "@/components/providers/demo-data-provider";
import UserAvatar from "@/components/ui/user-avatar";
import type { TeamMember } from "@/types/team";

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export default function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  const { tasks, currentUserId } = useDemoStore();

  const assigned = tasks.filter((task) => task.assigneeId === member.id);
  const completed = assigned.filter((task) => task.status === "completed").length;
  const inProgress = assigned.filter((task) => task.status === "in_progress").length;

  return (
    <article
      className={cn(
        "group rounded-2xl border border-line bg-surface p-5 shadow-xs transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <UserAvatar name={member.name} id={member.id} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-ink">
              {member.name}
            </h3>
            {member.id === currentUserId && (
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                You
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted" title={member.email}>
            {member.email}
          </p>
          <span className="mt-1.5 inline-flex items-center rounded-md bg-canvas px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-line">
            {member.role}
          </span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
        <div>
          <dt className="text-[11px] text-muted">Assigned</dt>
          <dd className="mt-0.5 text-lg font-semibold text-ink tabular-nums">
            {assigned.length}
          </dd>
        </div>
        <div className="border-x border-line">
          <dt className="text-[11px] text-muted">In progress</dt>
          <dd className="mt-0.5 text-lg font-semibold text-brand-600 tabular-nums">
            {inProgress}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted">Completed</dt>
          <dd className="mt-0.5 text-lg font-semibold text-emerald-600 tabular-nums">
            {completed}
          </dd>
        </div>
      </dl>
    </article>
  );
}
