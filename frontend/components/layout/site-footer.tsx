/**
 * Footer rendered by the root layout.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>TaskFlow — plan, assign and ship work together.</p>
        <p className="font-mono text-xs">Phase 1 · Foundation</p>
      </div>
    </footer>
  );
}
