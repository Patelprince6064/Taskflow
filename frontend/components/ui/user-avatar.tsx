import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[8px]",
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-lg",
};

/** Soft background/foreground pairs so members get a stable, distinct tint. */
const PALETTE = [
  "bg-brand-100 text-brand-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

/** Deterministic colour choice so the same person always looks the same. */
function colorFor(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash + seed.charCodeAt(index)) % PALETTE.length;
  }
  return PALETTE[hash] ?? PALETTE[0];
}

interface UserAvatarProps {
  name: string;
  /** Stable id (preferred over name when available). */
  id?: string;
  size?: AvatarSize;
  className?: string;
}

/**
 * Initials avatar.
 *
 * Always `aria-hidden`: it is decorative because the person's name is
 * rendered next to it (or announced by the surrounding control).
 */
export default function UserAvatar({
  name,
  id,
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none",
        SIZE_CLASSES[size],
        colorFor(id ?? name),
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
