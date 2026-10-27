import { fromDateKey } from "@/lib/journal";

interface CycleLengthsProps {
  periods: { start: string; periodDays: number; cycleLength: number | null }[];
  averageCycle: number | null;
  averagePeriod: number | null;
  currentDay: number | null;
}

// The typical range shaded on every track
const TYPICAL_MIN = 21;
const TYPICAL_MAX = 35;

const shortDate = (key: string) =>
  fromDateKey(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

// One row per period. Each track is a timeline in days: finished cycles
// show their full length, the current cycle shows how far along it is.
export default function CycleLengths({
  periods,
  averageCycle,
  averagePeriod,
  currentDay,
}: CycleLengthsProps) {
  if (periods.length === 0) {
    return (
      <p className="text-body text-muted">
        Mark your period days in your journal (Light, Medium or Heavy) and your
        cycles will appear here.
      </p>
    );
  }

  // The scale grows if any cycle runs longer than 45 days, so nothing overflows
  const scale = Math.max(
    45,
    currentDay ?? 0,
    ...periods.map((p) => p.cycleLength ?? 0),
  );
  const pct = (days: number) => `${(days / scale) * 100}%`;

  return (
    <div>
      {/* Headline numbers */}
      {(averageCycle !== null || averagePeriod !== null) && (
        <div className="mb-6 flex flex-wrap items-baseline gap-x-10 gap-y-3">
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
      )}

      {/* Scale labels, lined up with the tracks below */}
      <div className="grid grid-cols-[4.5rem_1fr_11rem] gap-3">
        <span />
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
          <span className="absolute right-0">{scale} days</span>
        </div>
        <span />
      </div>

      {/* One row per period, oldest first */}
      <ul className="flex flex-col gap-3">
        {periods.map((p) => {
          const isCurrent = p.cycleLength === null;
          const days = isCurrent ? (currentDay ?? 0) : p.cycleLength!;

          return (
            <li
              key={p.start}
              className="grid grid-cols-[4.5rem_1fr_11rem] items-center gap-3 text-small"
            >
              <span className="text-muted">{shortDate(p.start)}</span>

              <div className="relative h-3 overflow-hidden rounded-full bg-burgundy/10">
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

              <span className="text-right text-ink">
                {isCurrent ? `Day ${days} so far` : `${days}-day cycle`}
                <span className="text-muted"> · {p.periodDays}-day period</span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-caption text-muted">
        Each bar is one cycle, from the first day of a period to the first day
        of the next. The shaded band marks 21 to 35 days. Cycles outside it can
        be worth mentioning to your clinician. This is a pattern to talk about,
        not a diagnosis.
      </p>
    </div>
  );
}
