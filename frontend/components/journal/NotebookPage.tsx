"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import PillScroll from "@/components/ui/PillScroll";
import { formatLongDate } from "@/lib/journal";

export type SaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: "",
  unsaved: "Unsaved changes",
  saving: "Saving...",
  saved: "Saved ✓",
  error: "Couldn't save, try again",
};

interface NotebookPageProps {
  dateKey: string;
  content: string;
  onChange: (content: string) => void;
  status: SaveStatus;
  hasEntry: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function NotebookPage({
  dateKey,
  content,
  onChange,
  status,
  hasEntry,
  canGoNext,
  onPrev,
  onNext,
  onSave,
  onDelete,
}: NotebookPageProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea with its text, so the page scrolls with the
  // app's pill scroll instead of the textarea's own scrollbar
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content, dateKey]);

  const canSave = status === "unsaved" || status === "error";

  return (
    <div className="flex h-full flex-col">
      {/* Date and delete */}
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-title font-black text-ink">
          {formatLongDate(dateKey)}
        </h2>
        {hasEntry && (
          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 cursor-pointer text-caption text-muted underline underline-offset-2 hover:text-error"
          >
            Delete page
          </button>
        )}
      </div>

      {/* Ruled paper: each line is exactly one line-height (2rem) tall */}
      <PillScroll
        resetKey={dateKey}
        className="min-h-0 flex-1"
        contentClassName="pr-4"
      >
        <textarea
          ref={textRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What did your body do today? How did you feel?"
          aria-label={`Journal entry for ${formatLongDate(dateKey)}`}
          rows={8}
          className="lined-paper block min-h-full w-full resize-none overflow-hidden font-hand text-lead leading-8 text-ink outline-none placeholder:text-muted/70"
        />
      </PillScroll>

      {/* Turn pages, save */}
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous day"
          className="cursor-pointer justify-self-start font-hand text-lead text-burgundy hover:text-burgundy-deep"
        >
          ← Prev
        </button>

        <div className="flex flex-col items-center gap-1">
          <Button size="sm" onClick={onSave} disabled={!canSave}>
            {status === "saving" ? "Saving..." : "Save page"}
          </Button>
          <span role="status" className="h-4 text-caption text-muted">
            {status !== "saving" && STATUS_TEXT[status]}
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Next day"
          className="cursor-pointer justify-self-end font-hand text-lead text-burgundy hover:text-burgundy-deep disabled:pointer-events-none disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
