import { MOODS, fromDateKey } from "@/lib/journal";
import { moodForScore } from "@/lib/insights";

// Vertical positions for Great, Good, Okay, Low, Rough
const LEVELS = ["top-0", "top-1/4", "top-1/2", "top-3/4", "top-full"];

interface Week {
  start: string;
  average: number | null;
  low: number | null;
  high: number | null;
}

interface MoodTrendProps {
  weeks: Week[];
  summary: string | null;
  counts: { id: string; label: string; dot: string; count: number }[];
}

// score 5 (Great) sits at the top, 1 (Rough) at the bottom
const toY = (score: number) => ((5 - score) / 4) * 100;

// Each week shows its average mood as a dot, and a soft bar from its
// hardest day to its best day. The line joins the averages. Labels and
// dots are HTML (crisp text at any size); only the line is SVG.
export default function MoodTrend({ weeks, summary, counts }: MoodTrendProps) {
  const points = weeks
    .map((w, i) => ({ ...w, x: (i / (weeks.length - 1)) * 100 }))
    .filter(
      (
        w,
      ): w is Week & {
        x: number;
        average: number;
        low: number;
        high: number;
      } => w.average !== null,
    );

  if (points.length === 0) {
    return (
      <p className="text-body text-muted">
        Pick a mood on your journal pages to see how your weeks feel.
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-3">
        {/* Mood names down the side */}
        <div className="relative h-48 w-12 shrink-0 font-hand text-small text-muted">
          {MOODS.map((m, i) => (
            <span
              key={m.id}
              className={`absolute right-0 -translate-y-1/2 leading-none ${LEVELS[i]}`}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Plot area */}
        <div className="relative h-48 flex-1 border-b border-l border-burgundy/20">
          {/* Range bars: hardest to best day of each week */}
          {points.map((p) => (
            <span
              key={`range-${p.start}`}
              className="absolute w-1.5 -translate-x-1/2 rounded-full bg-burgundy/15"
              style={{
                left: `${p.x}%`,
                top: `${toY(p.high)}%`,
                bottom: `${100 - toY(p.low)}%`,
              }}
            />
          ))}

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <polyline
              points={points.map((p) => `${p.x},${toY(p.average)}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="text-burgundy/60"
            />
          </svg>

          {points.map((p) => (
            <span
              key={p.start}
              title={`Week of ${fromDateKey(p.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: mostly ${moodForScore(p.average).label}, from ${moodForScore(p.low).label} to ${moodForScore(p.high).label}`}
              className={`absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-paper ${moodForScore(p.average).dot}`}
              style={{ left: `${p.x}%`, top: `${toY(p.average)}%` }}
            />
          ))}
        </div>
      </div>

      {/* Week labels */}
      <div className="mt-2 ml-15 flex justify-between font-hand text-caption text-muted">
        {weeks.map((w) => (
          <span key={w.start}>
            {fromDateKey(w.start).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        ))}
      </div>

      <p className="mt-3 text-caption text-muted">
        Dots show each week&apos;s average mood. Shaded bars show the range from
        that week&apos;s hardest day to its best.
      </p>

      {/* Plain facts first, then the summary sentence */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
        {counts.map((m) => (
          <span
            key={m.id}
            className="flex items-center gap-1.5 text-small text-ink"
          >
            <span className={`size-2.5 rounded-full ${m.dot}`} />
            {m.count} {m.label}
          </span>
        ))}
      </div>
      {summary && <p className="mt-3 text-body text-ink">{summary}</p>}
    </div>
  );
}
