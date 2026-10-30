"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PillScroll from "@/components/ui/PillScroll";
import { AVERAGE_OVER, Period } from "@/lib/insights";
import { fromDateKey } from "@/lib/journal";

interface CycleLengthsProps {
  periods: Period[]; // full history, oldest first
  averageCycle: number | null;
  averagePeriod: number | null;
  currentDay: number | null;
}

// The typical range shaded on every track
const TYPICAL_MIN = 21;
const TYPICAL_MAX = 35;

// Rows shown before "Show all"
const PREVIEW = 5;

const shortDate = (key: string) =>
  fromDateKey(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const isOutsideTypical = (p: Period) =>
  p.cycleLength !== null &&
  (p.cycleLength < TYPICAL_MIN || p.cycleLength > TYPICAL_MAX);

// One row per period. Each track is a timeline in days: finished cycles
// show their full length, the current cycle shows how far along it is.
export default function CycleLengths({
  periods,
  averageCycle,
  averagePeriod,
  currentDay,
}: CycleLengthsProps) {
  const [newestFirst, setNewestFirst] = useState(true);
  const [onlyOutside, setOnlyOutside] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (periods.length === 0) {
    return (
      <p className="text-body text-muted">
        Mark your period days in your journal (Light, Medium or Heavy) and your
        cycles will appear here.
      </p>
    );
  }

  // Filter, then sort, then cut to the preview unless "Show all" is on
  const filtered = onlyOutside ? periods.filter(isOutsideTypical) : periods;
  const sorted = newestFirst ? [...filtered].reverse() : filtered;
  const visible = showAll ? sorted : sorted.slice(0, PREVIEW);

  // The scale grows if any cycle runs longer than 45 days, so nothing overflows
  const scale = Math.max(
    45,
    currentDay ?? 0,
    ...periods.map((p) => p.cycleLength ?? 0),
  );
  const pct = (days: number) => `${(days / scale) * 100}%`;

  const rows = (
    <ul className="flex flex-col gap-3">
      {visible.map((p) => {
        const isCurrent = p.cycleLength === null;
        const days = isCurrent ? (currentDay ?? 0) : p.cycleLength!;

        return (
          // Phones: date and label on one line, the bar full width below.
          // From sm up: date | bar | label, in one row.
          <li
            key={p.start}
            className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-small sm:grid-cols-[6.5rem_1fr_11rem]"
          >
            <span className="text-muted">{shortDate(p.start)}</span>

            <div className="relative order-3 col-span-2 h-3 overflow-hidden rounded-full bg-burgundy/10 sm:order-none sm:col-span-1">
              {/* Typical range, 21 to 35 days */}
              <div
                className="absolute inset-y-0 bg-olive/20"
                style={{
                  left: pct(TYPICAL_MIN),
                  width: pct(TYPICAL_MAX - TYPICAL_MIN),
                }}
              />
              {/* The cycle itself: solid when finished, dashed while in progress */}
              <div
                className={`relative h-full rounded-full ${
                  isCurrent
                    ? "border-2 border-dashed border-olive bg-olive/30"
                    : "bg-olive"
                }`}
                style={{ width: pct(days) }}
              />
            </div>

            <span className="text-right text-ink sm:order-none">
              {isCurrent ? `Day ${days} so far` : `${days}-day cycle`}
              <span className="text-muted"> · {p.periodDays}-day period</span>
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      {/* Headline numbers */}
      {(averageCycle !== null || averagePeriod !== null) && (
        <div className="mb-6">
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
            {averageCycle !== null && (
              <p className="text-body text-ink">
                <span className="font-display text-headline font-black text-burgundy italic">
                  {averageCycle}
                </span>{" "}
                day cycle on average
              </p>
            )}
            {averagePeriod !== null && (
              <p className="text-body text-ink">
                <span className="font-display text-headline font-black text-burgundy italic">
                  {averagePeriod}
                </span>{" "}
                day period on average
              </p>
            )}
          </div>
          <p className="mt-1 text-caption text-muted">
            Averages use your last {AVERAGE_OVER} cycles.
          </p>
        </div>
      )}

      {/* Sort and filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant={newestFirst ? "chipActive" : "chip"}
          aria-pressed={newestFirst}
          onClick={() => setNewestFirst(true)}
        >
          Newest first
        </Button>
        <Button
          variant={!newestFirst ? "chipActive" : "chip"}
          aria-pressed={!newestFirst}
          onClick={() => setNewestFirst(false)}
        >
          Oldest first
        </Button>
        <Button
          variant={onlyOutside ? "chipActive" : "chip"}
          aria-pressed={onlyOutside}
          onClick={() => setOnlyOutside(!onlyOutside)}
        >
          Outside {TYPICAL_MIN}–{TYPICAL_MAX} days
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-body text-muted">
          None of your cycles fall outside {TYPICAL_MIN} to {TYPICAL_MAX} days.
        </p>
      ) : (
        <>
          {/* Scale labels, lined up with the tracks below */}
          <div className="grid gap-3 sm:grid-cols-[6.5rem_1fr_11rem]">
            <span className="hidden sm:block" />
            <div className="relative h-5 font-hand text-caption text-muted">
              <span
                className="absolute -translate-x-1/2"
                style={{ left: pct(TYPICAL_MIN) }}
              >
                {TYPICAL_MIN}
              </span>
              <span
                className="absolute -translate-x-1/2"
                style={{ left: pct(TYPICAL_MAX) }}
              >
                {TYPICAL_MAX}
              </span>
            </div>
            <span className="hidden sm:block" />
          </div>

          {/* The full list scrolls inside the card instead of stretching the page */}
          {showAll ? (
            <PillScroll scrollClassName="max-h-80" contentClassName="pr-5">
              {rows}
            </PillScroll>
          ) : (
            rows
          )}

          {sorted.length > PREVIEW && (
            <Button
              variant="link"
              onClick={() => setShowAll(!showAll)}
              className="mt-4"
            >
              {showAll ? "Show less" : `Show all ${sorted.length} cycles`}
            </Button>
          )}
        </>
      )}

      <p className="mt-5 text-caption text-muted">
        Each bar is one cycle, from the first day of a period to the first day
        of the next, drawn on a {scale}-day scale. The shaded band marks 21 to
        35 days. Cycles outside it can be worth mentioning to your clinician.
        This is a pattern to talk about, not a diagnosis.
      </p>
    </div>
  );
}
