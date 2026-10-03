"use client";

import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

// One scroll style for the whole app: native scrollbar hidden(.pill-scroll in globals.css), replaced by a short burgundy pill that slides along the right edge as user scroll.

const PILL_WIDTH = "clamp(0.375rem, 0.6vw, 0.625rem)";
const PILL_HEIGHT = "clamp(1.75rem, 3vw, 2.75rem)";
const PILL_COLOR = "#4A1424";

interface PillScrollProps {
  children: ReactNode;
  style?: CSSProperties; // outer box: position, size, background, etc.
  contentStyle?: CSSProperties; // the content inside: padding, flex, gap
  maxHeight?: string; // for boxes that grow with content up to a limit
  pillRight?: string; // pill distance from the right edge (negative = outside)
  trackInset?: string; // gap above and below the pill's track
  resetKey?: unknown; // when this changes, jump back to the top
}

export default function PillScroll({
  children,
  style,
  contentStyle,
  maxHeight,
  pillRight = "0",
  trackInset = "0",
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
    // Compare the real content height to the visible box. Using the content's
    // own height ignores fake overflow from shadows, transforms and rounding.
    const overflow = content.offsetHeight - el.clientHeight;
    setCanScroll(overflow > 4);
    const maxScroll = el.scrollHeight - el.clientHeight;
    setProgress(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  // Re-check whenever the box or its content changes size
  // (new answer, window resize, font load, etc.)
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

  return (
    <div style={{ position: "relative", ...style }}>
      <div
        ref={scrollRef}
        onScroll={update}
        tabIndex={0}
        className="pill-scroll"
        style={{
          height: "100%",
          maxHeight,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div ref={contentRef} style={{ minHeight: "100%", ...contentStyle }}>
          {children}
        </div>
      </div>

      {canScroll && (
        <div
          style={{
            position: "absolute",
            right: pillRight,
            top: trackInset,
            bottom: trackInset,
            width: PILL_WIDTH,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              height: PILL_HEIGHT,
              top: `calc((100% - ${PILL_HEIGHT}) * ${progress})`,
              backgroundColor: PILL_COLOR,
              borderRadius: "999px",
            }}
          />
        </div>
      )}
    </div>
  );
}
