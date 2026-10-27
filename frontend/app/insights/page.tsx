"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import PageLabel from "@/components/ui/PageLabel";
import InsightCard from "@/components/insights/InsightCard";
import StatTiles from "@/components/insights/StatTiles";
import MoodCalendar from "@/components/insights/MoodCalendar";
import MoodTrend from "@/components/insights/MoodTrend";
import SymptomBars from "@/components/insights/SymptomBars";
import CycleLengths from "@/components/insights/CycleLengths";
import { addMonths, fromDateKey, monthKey, todayKey } from "@/lib/journal";
import {
  HISTORY_MONTHS,
  InsightEntry,
  cycleSummary,
  fetchInsightEntries,
  inMonth,
  moodCounts,
  moodSummary,
  streaks,
  symptomCounts,
  weeklyMood,
} from "@/lib/insights";

export default function InsightsPage() {
  const { user, loading: authLoading } = useAuth();
  const today = todayKey();
  const thisMonth = monthKey(today);
  const firstMonth = addMonths(thisMonth, -(HISTORY_MONTHS - 1));

  const [entries, setEntries] = useState<InsightEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [month, setMonth] = useState(thisMonth);

  useEffect(() => {
    if (!user) return;
    fetchInsightEntries()
      .then(setEntries)
      .catch((err) => {
        console.error("Couldn't load insights", err);
        setFailed(true);
      });
  }, [user]);

  // Everything below is worked out from the same list of entries
  const insights = useMemo(() => {
    if (!entries) return null;
    const monthEntries = inMonth(entries, month);
    const weeks = weeklyMood(entries, today);
    const trendFrom = weeks[0].start; // first day of the 8-week window
    return {
      monthEntries,
      streak: streaks(entries, today),
      symptoms: symptomCounts(monthEntries),
      weeks,
      moodCounts: moodCounts(entries, trendFrom),
      moodSummary: moodSummary(entries, trendFrom),
      cycles: cycleSummary(entries, today),
    };
  }, [entries, month, today]);

  const monthName = fromDateKey(`${month}-01`).toLocaleDateString("en-US", {
    month: "long",
  });

  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-8 pt-8 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10">
          <PageLabel
            title="Your insights"
            subtitle="Patterns, not verdicts"
            description="Drawn only from your own journal pages. No scores, no judgement — just what your pages are telling you."
            className="md:ml-[4.9%] md:w-[54.44%]"
          />
        </div>

        {authLoading ? null : !user ? (
          <Notice
            title="Your insights are private"
            text="Sign in to see the patterns in your journal. Only you can see them."
          >
            <Button href="/login">Sign in</Button>
            <Button href="/signup" variant="secondary">
              Create an account
            </Button>
          </Notice>
        ) : failed ? (
          <Notice
            title="We couldn't load your insights"
            text="Please refresh the page to try again."
          />
        ) : !insights ? (
          <p className="text-center font-hand text-lead text-paper">
            Gathering your pages...
          </p>
        ) : entries!.length === 0 ? (
          <Notice
            title="Your insights grow from your journal"
            text="Write a page and pick a mood, and your patterns will start showing up here."
          >
            <Button href="/journal">Write your first page →</Button>
          </Notice>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Month switcher: changes the calendar, page count and symptoms */}
            <div className="flex items-center justify-center gap-4 self-center rounded-full bg-paper px-5 py-2">
              <button
                type="button"
                onClick={() => setMonth(addMonths(month, -1))}
                disabled={month === firstMonth}
                aria-label="Previous month"
                className="cursor-pointer text-title text-burgundy disabled:pointer-events-none disabled:opacity-25"
              >
                ‹
              </button>
              <span className="min-w-40 text-center font-display text-lead font-black text-ink italic">
                {monthName} {month.slice(0, 4)}
              </span>
              <button
                type="button"
                onClick={() => setMonth(addMonths(month, 1))}
                disabled={month === thisMonth}
                aria-label="Next month"
                className="cursor-pointer text-title text-burgundy disabled:pointer-events-none disabled:opacity-25"
              >
                ›
              </button>
            </div>

            <StatTiles
              monthName={monthName}
              pages={insights.monthEntries.length}
              currentStreak={insights.streak.current}
              longestStreak={insights.streak.longest}
            />

            <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
              <InsightCard
                title="Mood calendar"
                note={`How each day of ${monthName} felt`}
              >
                <MoodCalendar
                  month={month}
                  today={today}
                  entries={insights.monthEntries}
                />
              </InsightCard>
              <InsightCard
                title="Symptoms"
                note={`Days each was logged in ${monthName}`}
              >
                <SymptomBars counts={insights.symptoms} />
              </InsightCard>
            </div>

            <InsightCard
              title="Mood over time"
              note="Your average mood each week, for the last 8 weeks"
            >
              <MoodTrend
                weeks={insights.weeks}
                counts={insights.moodCounts}
                summary={insights.moodSummary}
              />
            </InsightCard>

            <InsightCard
              title="Your cycles"
              note="From the period days in your journal"
            >
              <CycleLengths {...insights.cycles} />
            </InsightCard>
          </div>
        )}
      </div>
    </main>
  );
}

// Centred message card for signed-out, empty and error states
function Notice({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-card bg-paper px-8 py-10 text-center">
      <h2 className="text-title font-black text-ink">{title}</h2>
      <p className="text-body text-muted">{text}</p>
      {children && (
        <div className="flex flex-wrap justify-center gap-3">{children}</div>
      )}
    </div>
  );
}
