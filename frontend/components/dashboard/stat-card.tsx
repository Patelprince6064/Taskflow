import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

const TONE_CLASSES: Record<
  "default" | "brand" | "success" | "warning" | "danger",
  { icon: string; text: string }
> = {
  default: { icon: "bg-slate-100 text-slate-600", text: "text-slate-700" },
  brand: { icon: "bg-brand-50 text-brand-600", text: "text-brand-700" },
  success: { icon: "bg-emerald-50 text-emerald-600", text: "text-emerald-700" },
  warning: { icon: "bg-amber-50 text-amber-600", text: "text-amber-700" },
  danger: { icon: "bg-rose-50 text-rose-600", text: "text-rose-700" },
};

interface StatCardProps {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  tone?: keyof typeof TONE_CLASSES;
  /** Small supporting line, e.g. "+2 this week". */
  hint?: string;
  className?: string;
}

/** Compact KPI tile used by the dashboard summary row. */
export default function StatCard({
  label,
  value,
  Icon,
  tone = "default",
  hint,
  className,
}: StatCardProps) {
  const tones = TONE_CLASSES[tone];

  return (
    <div
      className={cn(
        "group rounded-2xl border border-line bg-surface p-4 shadow-xs transition-shadow hover:shadow-md sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted uppercase tracking-wide">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink tabular-nums sm:text-3xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 truncate text-xs text-muted">{hint}</p>
          )}
        </div>
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
            tones.icon,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
