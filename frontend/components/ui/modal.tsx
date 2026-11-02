"use client";

/**
 * Accessible modal dialog primitive.
 *
 * Handles the shared chrome (backdrop, Escape, scroll lock, focus trap and
 * focus restore) so feature modals only render their own content.
 */

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible dialog label (required). */
  title: string;
  /** Optional supporting copy rendered under the title. */
  description?: string;
  children: ReactNode;
  /** Footer content (usually action buttons). */
  footer?: ReactNode;
  /** Extra classes for the dialog panel. */
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const focusPanel = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (first ?? panel).focus();
  }, []);

  // Escape-to-close + scroll lock + focus capture/restore.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Defer so the panel has rendered before we move focus into it.
    const raf = window.requestAnimationFrame(focusPanel);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, onClose, focusPanel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-lg rounded-t-2xl bg-surface shadow-2xl ring-1 ring-slate-900/5 outline-none sm:rounded-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="modal-title"
              className="text-base font-semibold text-ink"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-m-1.5 shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-line bg-canvas px-5 py-4 sm:flex-row sm:justify-end sm:rounded-b-2xl sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
