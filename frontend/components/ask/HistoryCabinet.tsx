"use client";

import { useMemo, useState, CSSProperties } from "react";
import PillScroll from "@/components/ui/PillScroll";
import { parseAnswer } from "@/lib/answer";

export interface HistoryItem {
  id: string | number;
  question: string;
  answer: string;
  sources: string[] | null;
  created_at: string;
}

// Folder colors from the Figma design.
// card = background of each question row inside the opened folder.
const FOLDERS = [
  { bg: "#E3BBB1", fg: "#4A1424", card: "rgba(255,255,255,0.4)" },
  { bg: "#B0664F", fg: "#FFF8EE", card: "rgba(255,255,255,0.15)" },
  { bg: "#B8C8C3", fg: "#202B0E", card: "rgba(255,255,255,0.4)" },
  { bg: "#61768A", fg: "#FFF8EE", card: "rgba(255,255,255,0.15)" },
  { bg: "#F2ECDA", fg: "#202B0E", card: "rgba(255,255,255,0.6)" },
];

// Where each folder's tab sits, so the tabs stagger like real files
const TAB_POSITIONS = ["12%", "66%", "44%", "16%", "0%"];

interface Day {
  key: string; // e.g. 2026-10-03
  date: Date;
  items: HistoryItem[];
  style: CSSProperties; // this day's folder colors, as CSS variables
}

// One group per calendar day (user's local time), newest first.
// Colors are counted from the OLDEST day, so when a new day is added on top, every existing folder keeps its color.
function groupByDay(items: HistoryItem[]): Day[] {
  const groups = new Map<string, HistoryItem[]>();
  for (const item of items) {
    const key = new Date(item.created_at).toLocaleDateString("en-CA");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  const entries = [...groups];
  return entries.map(([key, dayItems], i) => {
    const n = (entries.length - 1 - i) % FOLDERS.length;
    const c = FOLDERS[n];
    return {
      key,
      date: new Date(dayItems[0].created_at),
      items: dayItems,
      style: {
        "--bg": c.bg,
        "--fg": c.fg,
        "--card": c.card,
        "--tab-left": TAB_POSITIONS[n],
      } as CSSProperties,
    };
  });
}

export default function HistoryCabinet({
  history,
  loading,
}: {
  history: HistoryItem[];
  loading: boolean;
}) {
  const days = useMemo(() => groupByDay(history), [history]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openId, setOpenId] = useState<HistoryItem["id"] | null>(null);

  // Newest day is open until the user picks another
  const activeDay = days.find((d) => d.key === activeKey) ?? days[0];

  function openDay(key: string) {
    setActiveKey(key);
    setOpenId(null);
  }

  return (
    <section className="rounded-2xl bg-cabinet px-4 pt-5 pb-4">
      <h2 className="mb-4 text-center font-hand text-title font-bold not-italic tracking-wide text-burgundy">
        Your question history
      </h2>

      {loading ? (
        <p className="py-12 text-center text-muted">Loading your history...</p>
      ) : !activeDay ? (
        <p className="py-12 text-center text-muted">
          Questions you ask will be filed here, one folder per day.
        </p>
      ) : (
        <div className="grid gap-3 md:h-[28rem] md:grid-cols-[2fr_3fr]">
          {/* Left — one folder per day. Each folder is 6rem tall but
              overlaps the next by 2rem, so only its tab and a strip show. */}
          <PillScroll
            className="md:h-full"
            scrollClassName="max-h-[28rem]"
            contentClassName="pr-5"
          >
            {days.map((day) => {
              const isActive = day.key === activeDay.key;
              return (
                <button
                  key={day.key}
                  onClick={() => openDay(day.key)}
                  aria-pressed={isActive}
                  style={day.style}
                  className="group relative -mb-8 block h-24 w-full cursor-pointer last:mb-0 last:h-48"
                >
                  <span
                    className={`absolute top-1 left-(--tab-left) flex h-7 items-center rounded-t-[0.6rem] bg-(--bg) px-4 font-hand text-small font-bold text-(--fg) transition-transform duration-200 group-hover:-translate-y-1 ${
                      isActive
                        ? "-translate-y-1 underline underline-offset-4"
                        : ""
                    }`}
                  >
                    {day.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="absolute inset-x-0 top-7 bottom-0 rounded-t-xl bg-(--bg)" />
                </button>
              );
            })}
          </PillScroll>

          {/* Right — the opened day, in its folder's color */}
          <div
            style={activeDay.style}
            className="overflow-hidden rounded-xl bg-(--bg) text-(--fg)"
          >
            <PillScroll
              resetKey={activeDay.key}
              className="h-full"
              scrollClassName="max-h-[28rem]"
              contentClassName="p-6 pr-8"
              pillClassName="right-2 inset-y-4"
            >
              <h3 className="text-title font-bold">
                {activeDay.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <p className="mt-1 mb-4 text-small opacity-75">
                {activeDay.items.length}{" "}
                {activeDay.items.length === 1 ? "question" : "questions"}
              </p>

              <ul className="flex flex-col gap-2">
                {activeDay.items.map((item) => (
                  <QuestionRow
                    key={item.id}
                    item={item}
                    open={openId === item.id}
                    onToggle={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                  />
                ))}
              </ul>
            </PillScroll>
          </div>
        </div>
      )}
    </section>
  );
}

// One question in the opened day — click to show or hide its answer
function QuestionRow({
  item,
  open,
  onToggle,
}: {
  item: HistoryItem;
  open: boolean;
  onToggle: () => void;
}) {
  const answer = parseAnswer(item.answer);

  return (
    <li className="rounded-[0.625rem] bg-(--card)">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-baseline justify-between gap-4 px-4 py-3 text-left font-display font-bold italic"
      >
        <span>{item.question}</span>
        <span className="shrink-0 font-body text-caption font-normal not-italic opacity-70">
          {new Date(item.created_at).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-2.5 px-4 pb-4 text-body leading-relaxed">
          {answer ? (
            <>
              <p className="font-display text-lead font-bold italic">
                {answer.summary}
              </p>
              {answer.points.map((point) => (
                <div key={point.heading}>
                  <p className="font-bold">{point.heading}</p>
                  <p>{point.body}</p>
                </div>
              ))}
              <p className="italic opacity-75">{answer.closing}</p>
            </>
          ) : (
            <p>{item.answer}</p>
          )}

          {item.sources?.[0] && (
            <p className="border-t border-current/25 pt-2 text-caption">
              Source: {item.sources[0]}
            </p>
          )}
          <p className="text-caption italic opacity-75">
            For informational purposes only. Always consult your healthcare
            provider.
          </p>
        </div>
      )}
    </li>
  );
}
