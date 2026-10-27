"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import PillScroll from "@/components/ui/PillScroll";
import MonthCalendar from "@/components/journal/MonthCalendar";
import MoodPicker from "@/components/journal/MoodPicker";
import NotebookPage, { SaveStatus } from "@/components/journal/NotebookPage";
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

const DESCRIPTION =
  "Write what your body did and how you felt. Over time, these pages turn into patterns you can bring to your clinician. Only you can read them.";

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const today = todayKey();

  const [selectedKey, setSelectedKey] = useState(today); // the day being written
  const [month, setMonth] = useState(monthKey(today)); // the month the calendar shows
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});
  const [loadedMonths, setLoadedMonths] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [status, setStatus] = useState<SaveStatus>("idle");

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

  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-8 pt-8 pb-24">
      {/* Header — the tape label from Figma, with text laid on top.
          The label is a container (@container), and its text is sized in
          cqw (% of the label's width), so the words shrink and grow WITH
          the label instead of spilling out of it.
          From md up: placed as % of the board, like the Figma design
          (label x 122, w 733.74; board x 56). The negative margin matches
          the 50px the label's box overlaps the board's box, above the folder.
          On phones the label is full width, and the description moves
          underneath it, where it can stay readable. */}
      <div className="mx-auto w-full max-w-6xl">
        <div className="@container relative w-full md:-mb-[3.71%] md:ml-[4.9%] md:w-[54.44%]">
          <Image
            src="/askpagehead.svg"
            alt=""
            width={734}
            height={228}
            priority
            className="block h-auto w-full"
          />
          <div className="absolute inset-x-[12%] top-[22%] bottom-[12%] flex flex-col items-center justify-center text-center">
            <h1 className="text-[7cqw] leading-tight font-black text-burgundy md:text-[4.5cqw]">
              Your journal
            </h1>
            <p className="text-[3.8cqw] font-bold text-ink md:mb-[1.2cqw] md:text-[2.4cqw]">
              One page for today
            </p>
            <p className="hidden text-[1.9cqw] leading-snug text-ink md:block">
              {DESCRIPTION}
            </p>
          </div>
        </div>

        <p className="mt-3 mb-6 rounded-xl bg-paper/90 px-4 py-3 text-center text-small text-ink md:hidden">
          {DESCRIPTION}
        </p>
      </div>

      {/* Clipboard — one SVG, content laid on top. Positions are % of the
          board, measured from the Figma frame (1347.73 × 1054). */}
      <div className="relative mx-auto w-full max-w-6xl">
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
          className="absolute top-[20.21%] left-[9.14%] h-[70.11%] w-[28.16%] -rotate-[1.3deg]"
          contentClassName="flex flex-col gap-5 pr-4"
        >
          <MonthCalendar
            month={month}
            selectedKey={selectedKey}
            today={today}
            entries={entries}
            onSelect={selectDate}
            onMonthChange={(step) => setMonth(addMonths(month, step))}
          />
          {user && (
            <MoodPicker
              mood={draft.mood}
              flow={draft.flow}
              symptoms={draft.symptoms}
              onMood={(mood) => updateDraft({ mood })}
              onFlow={(flow) => updateDraft({ flow })}
              onToggleSymptom={toggleSymptom}
            />
          )}
        </PillScroll>

        {/* Right paper — the notebook page */}
        <div className="absolute top-[17.63%] left-[50.48%] h-[76%] w-[41.85%]">
          {authLoading ? null : user ? (
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
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-title font-black text-ink">
                Your pages are private
              </p>
              <p className="text-body text-muted">
                Sign in to start writing. Only you will ever be able to read
                your journal.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/login">Sign in</Button>
                <Button href="/signup" variant="secondary">
                  Create an account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
