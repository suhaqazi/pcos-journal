"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import PageLabel from "@/components/ui/PageLabel";
import PillScroll from "@/components/ui/PillScroll";
import MonthCalendar from "@/components/journal/MonthCalendar";
import MoodPicker from "@/components/journal/MoodPicker";
import NotebookPage, { SaveStatus } from "@/components/journal/NotebookPage";
import SaveBar from "@/components/journal/SaveBar";
import WeekStrip from "@/components/journal/WeekStrip";
import {
  Draft,
  EMPTY_DRAFT,
  JournalEntry,
  addDays,
  addMonths,
  deleteEntry,
  draftFrom,
  fetchMonthEntries,
  isEmptyDraft,
  monthKey,
  saveEntry,
  todayKey,
} from "@/lib/journal";

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const today = todayKey();

  const [selectedKey, setSelectedKey] = useState(today); // the day being written
  const [month, setMonth] = useState(monthKey(today)); // the month the calendar shows
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [loadedMonths, setLoadedMonths] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [showMonth, setShowMonth] = useState(false); // small screens: week or month

  const syncedKey = useRef<string | null>(null); // which day the draft was loaded for
  const isDirty = status === "unsaved" || status === "error";

  // Loading

  // A different person signed in (or out): start fresh
  useEffect(() => {
    setEntries({});
    setLoadedMonths([]);
    syncedKey.current = null;
  }, [user?.id]);

  // Fetch each month's entries once, when the calendar shows it
  useEffect(() => {
    if (!user || loadedMonths.includes(month)) return;
    let cancelled = false;

    fetchMonthEntries(month)
      .then((rows) => {
        if (cancelled) return;
        setEntries((prev) => {
          const next = { ...prev };
          rows.forEach((row) => (next[row.entry_date] = row));
          return next;
        });
        setLoadedMonths((prev) => [...prev, month]);
      })
      .catch((err) => console.error("Couldn't load journal entries", err));

    return () => {
      cancelled = true;
    };
  }, [user, month, loadedMonths]);

  // Put the selected day's saved entry on the page, once it has loaded
  useEffect(() => {
    if (syncedKey.current === selectedKey) return;
    if (user && !loadedMonths.includes(monthKey(selectedKey))) return;
    setDraft(draftFrom(entries[selectedKey]));
    setStatus("idle");
    syncedKey.current = selectedKey;
  }, [selectedKey, entries, loadedMonths, user]);

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    function warn(e: BeforeUnloadEvent) {
      if (isDirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  // Saving

  async function persist(key: string, d: Draft): Promise<boolean> {
    if (!user) return false;
    try {
      if (isEmptyDraft(d)) {
        // Everything cleared: remove the page instead of keeping a blank one
        if (entries[key]) {
          await deleteEntry(key);
          setEntries((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        }
      } else {
        const saved = await saveEntry(user.id, key, d);
        setEntries((prev) => ({ ...prev, [key]: saved }));
      }
      return true;
    } catch (err) {
      console.error("Couldn't save journal entry", err);
      return false;
    }
  }

  async function handleSave() {
    setStatus("saving");
    const ok = await persist(selectedKey, draft);
    setStatus(ok ? "saved" : "error");
  }

  function updateDraft(change: Partial<Draft>) {
    setDraft((prev) => ({ ...prev, ...change }));
    setStatus("unsaved");
  }

  // Actions

  function selectDate(key: string) {
    if (key > today || key === selectedKey) return;
    // Unsaved changes are saved automatically before turning the page
    if (isDirty) void persist(selectedKey, draft);
    setSelectedKey(key);
    setMonth(monthKey(key)); // the calendar follows the page
  }

  function toggleSymptom(symptom: string) {
    const has = draft.symptoms.includes(symptom);
    updateDraft({
      symptoms: has
        ? draft.symptoms.filter((s) => s !== symptom)
        : [...draft.symptoms, symptom],
    });
  }

  async function handleDelete() {
    if (!window.confirm("Delete this page? This can't be undone.")) return;
    try {
      await deleteEntry(selectedKey);
      setEntries((prev) => {
        const next = { ...prev };
        delete next[selectedKey];
        return next;
      });
      setDraft(EMPTY_DRAFT);
      setStatus("idle");
    } catch (err) {
      console.error("Couldn't delete journal entry", err);
      setStatus("error");
    }
  }

  // Page

  // Used by both layouts, so they stay identical
  const calendar = (
    <MonthCalendar
      month={month}
      selectedKey={selectedKey}
      today={today}
      entries={entries}
      onSelect={selectDate}
      onMonthChange={(step) => setMonth(addMonths(month, step))}
    />
  );

  const moodPicker = user && (
    <MoodPicker
      mood={draft.mood}
      flow={draft.flow}
      symptoms={draft.symptoms}
      onMood={(mood) => updateDraft({ mood })}
      onFlow={(flow) => updateDraft({ flow })}
      onToggleSymptom={toggleSymptom}
    />
  );

  const notebook = (showSave: boolean) =>
    authLoading ? null : user ? (
      <NotebookPage
        dateKey={selectedKey}
        content={draft.content}
        onChange={(content) => updateDraft({ content })}
        status={status}
        hasEntry={Boolean(entries[selectedKey])}
        canGoNext={selectedKey < today}
        onPrev={() => selectDate(addDays(selectedKey, -1))}
        onNext={() => selectDate(addDays(selectedKey, 1))}
        onSave={handleSave}
        onDelete={handleDelete}
        showSave={showSave}
      />
    ) : (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-title font-black text-ink">Your pages are private</p>
        <p className="text-body text-muted">
          Sign in to start writing. Only you will ever be able to read your
          journal.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/login">Sign in</Button>
          <Button href="/signup" variant="secondary">
            Create an account
          </Button>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 pt-8 pb-28 md:px-8 lg:pb-24">
      {/* Header — positioned against the clipboard as in Figma (label x 122,
          w 733.74; board x 56). The negative margin matches the 50px the
          label's box overlaps the board's box, above the folder. */}
      <div className="mx-auto w-full max-w-6xl">
        <PageLabel
          title="Your journal"
          subtitle="One page for today"
          description="Write what your body did and how you felt. Over time, these pages turn into patterns you can bring to your clinician. Only you can read them."
          className="lg:-mb-[3.71%] lg:ml-[4.9%] lg:w-[54.44%]"
        />
      </div>

      {/* Large screens: the clipboard — one SVG, content laid on top.
          Positions are % of the board, measured from the Figma frame
          (1347.73 × 1054). */}
      <div className="relative mx-auto hidden w-full max-w-6xl lg:block">
        <Image
          src="/journalboard.svg"
          alt=""
          width={1348}
          height={1054}
          priority
          className="block h-auto w-full"
        />

        {/* Left card — calendar, then mood and symptoms */}
        <PillScroll
          className="absolute top-[20.21%] left-[9.14%] h-[70.11%] w-[28.16%]"
          contentClassName="flex flex-col gap-5 pr-4"
        >
          {calendar}
          {moodPicker}
        </PillScroll>

        {/* Right paper — the notebook page */}
        <div className="absolute top-[17.63%] left-[50.48%] h-[76%] w-[41.85%]">
          {notebook(true)}
        </div>
      </div>

      {/* Phones, tablets and small windows: the same pieces, stacked */}
      <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-8 lg:hidden">
        {/* Calendar card with binder rings */}
        <section className="relative rounded-2xl bg-paper px-4 pt-8 pb-5 shadow-[0_4px_10px_rgb(0_0_0/0.12)]">
          <div
            className="absolute inset-x-0 -top-3 flex justify-around px-10"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-6 w-2.5 rounded-full border-2 border-kraft bg-transparent"
              />
            ))}
          </div>

          {showMonth ? (
            calendar
          ) : (
            <WeekStrip
              selectedKey={selectedKey}
              today={today}
              entries={entries}
              onSelect={selectDate}
            />
          )}

          <button
            type="button"
            onClick={() => setShowMonth(!showMonth)}
            className="mx-auto mt-3 block cursor-pointer font-hand text-body font-bold text-burgundy underline underline-offset-4"
          >
            {showMonth ? "Show this week" : "Show month"}
          </button>
        </section>

        {/* Clipboard with the notebook page: fixed height, scrolls inside */}
        <section className="rounded-2xl bg-kraft p-3 shadow-[0_6px_14px_rgb(0_0_0/0.18)]">
          <div className="speckle-paper relative h-[65vh] min-h-[26rem] rounded-lg py-6 pr-5 pl-10">
            {/* Punch holes */}
            <div
              className="absolute inset-y-10 left-3 flex flex-col justify-between"
              aria-hidden="true"
            >
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="size-2.5 rounded-full bg-kraft" />
              ))}
            </div>
            {notebook(false)}
          </div>
        </section>

        {/* Mood, period and symptoms */}
        {user && (
          <section className="rounded-2xl bg-paper px-6 pt-2 pb-6 shadow-[0_4px_10px_rgb(0_0_0/0.12)]">
            {moodPicker}
          </section>
        )}
      </div>

      <SaveBar status={status} onSave={handleSave} />
    </main>
  );
}
