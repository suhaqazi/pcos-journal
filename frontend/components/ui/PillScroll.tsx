"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

// One scroll style for the whole app: the browser's scrollbar is hidden
// (no-scrollbar utility in globals.css) and replaced by a short burgundy
// pill that slides along the right edge — only when content overflows.

interface PillScrollProps {
  children: ReactNode;
  className?: string; // outer box: position, size, background
  scrollClassName?: string; // the scrolling area: usually a max height
  contentClassName?: string; // the content: padding, flex, gap
  pillClassName?: string; // where the pill's track sits
  resetKey?: unknown; // when this changes, jump back to the top
}

export default function PillScroll({
  children,
  className = "",
  scrollClassName = "",
  contentClassName = "",
  pillClassName = "right-0 inset-y-0",
  resetKey,
}: PillScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 = top, 1 = bottom
  const [canScroll, setCanScroll] = useState(false);

  function update() {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el || !content) return;
    // Real content height vs visible box — ignores fake overflow
    // from shadows, transforms and rounding
    setCanScroll(content.offsetHeight - el.clientHeight > 4);
    const maxScroll = el.scrollHeight - el.clientHeight;
    setProgress(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  // Re-check whenever the box or its content changes size
  useEffect(() => {
    const observer = new ResizeObserver(update);
    if (scrollRef.current) observer.observe(scrollRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    update();
  }, [resetKey]);

  // The pill needs a positioned parent. Default to "relative", but only if
  // the caller didn't already position the box (e.g. "absolute" on the
  // cork board) — two position classes conflict and the wrong one can win.
  const position = /\b(absolute|fixed|sticky)\b/.test(className)
    ? ""
    : "relative";

  return (
    <div className={`${position} ${className}`}>
      <div
        ref={scrollRef}
        onScroll={update}
        tabIndex={0}
        className={`no-scrollbar h-full overflow-y-auto overflow-x-hidden ${scrollClassName}`}
      >
        <div ref={contentRef} className={`min-h-full ${contentClassName}`}>
          {children}
        </div>
      </div>

      {canScroll && (
        <div
          className={`pointer-events-none absolute w-[clamp(0.375rem,0.6vw,0.625rem)] [--pill-h:clamp(1.75rem,3vw,2.75rem)] ${pillClassName}`}
        >
          {/* Position changes on every scroll, so it stays inline */}
          <div
            className="absolute left-0 w-full h-(--pill-h) rounded-full bg-burgundy-deep"
            style={{ top: `calc((100% - var(--pill-h)) * ${progress})` }}
          />
        </div>
      )}
    </div>
  );
}
