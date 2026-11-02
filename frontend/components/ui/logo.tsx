interface LogoMarkProps {
  className?: string;
}

/**
 * TaskFlow logomark.
 *
 * Drawn inline (no image asset) so it stays crisp at any size and adds zero
 * network requests.
 */
export default function LogoMark({ className = "h-8 w-8" }: LogoMarkProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm ${className}`.trim()}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-1/2 w-1/2"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
