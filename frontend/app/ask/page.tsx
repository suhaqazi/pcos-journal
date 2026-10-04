"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { AnswerData, parseAnswer } from "@/lib/answer";
import Button from "@/components/ui/Button";
import PillScroll from "@/components/ui/PillScroll";
import HistoryCabinet, { HistoryItem } from "@/components/ask/HistoryCabinet";
import GuestHistoryPrompt from "@/components/ask/GuestHistoryPrompt";

const SUGGESTED_QUESTIONS = [
  "Why are my cycles so irregular?",
  "What actually counts as a PCOS symptom?",
  "Can PCOS change my hair and skin?",
  "What should I ask my doctor first?",
  "How does insulin resistance connect to PCOS?",
  "Why do I feel so tired all the time?",
  "Can PCOS affect my mood?",
  "What lifestyle changes actually help with PCOS?",
  "Is PCOS the reason I'm gaining weight?",
  "What are the Rotterdam criteria?",
];

function getRandomQuestions() {
  return [...SUGGESTED_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 4);
}

const CONNECTION_ERROR: AnswerData = {
  summary: "Something went wrong.",
  points: [
    {
      heading: "Connection issue",
      body: "Please check your connection and try again. If the problem persists, the service may be temporarily unavailable.",
    },
  ],
  closing: "Please try again in a moment.",
};

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AnswerData | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    setSuggested(getRandomQuestions());
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadHistory() {
      setHistoryLoading(true);
      const { data } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setHistory(data);
      setHistoryLoading(false);
    }

    loadHistory();
  }, [user]);

  async function handleSubmit() {
    if (!question.trim() || question.length > 500) return;
    setLoading(true);
    setAnswer(null);
    setSources([]);
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const parsed = parseAnswer(data.answer);
      setAnswer(parsed);
      setSources(data.sources || []);

      if (user) {
        const { data: saved } = await supabase
          .from("questions")
          .insert({
            user_id: user.id,
            question,
            answer: JSON.stringify(parsed),
            sources: data.sources || [],
          })
          .select()
          .single();

        if (saved) setHistory((prev) => [saved, ...prev]);
      }
    } catch {
      setAnswer(CONNECTION_ERROR);
    } finally {
      setLoading(false);
    }
  }

  function resetQuestion() {
    setQuestion("");
    setAnswer(null);
    setSources([]);
    setSuggested(getRandomQuestions());
  }

  return (
    <main className="min-h-screen bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat">
      {/* Hero header */}
      <div className="flex justify-center py-16">
        <div className="relative inline-block">
          <Image
            src="/askpagehead.svg"
            alt=""
            width={720}
            height={180}
            className="block"
          />
          <div className="absolute top-[65%] left-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="mb-2 text-display leading-tight font-black text-ink">
              Ask the question you've been{" "}
              <span className="text-burgundy">holding</span>
            </h1>
            <p className="text-body leading-normal text-burgundy">
              No jargon, no judgement. Ask anything about PCOS and get a warm,
              plain-language answer — then take the parts that matter to your
              clinician.
            </p>
          </div>
        </div>
      </div>

      {/* Cork board — one SVG for the whole board, text boxes laid on top.
          Positions are % of the board, measured from the Figma frame
          (1321.65 × 886), so everything scales together. */}
      <div className="flex justify-center px-8 pb-28">
        <div className="relative w-full max-w-6xl">
          <Image
            src="/corkboard.svg"
            alt="Cork board"
            width={1322}
            height={886}
            priority
            className="block h-auto w-full"
          />

          {/* Whiteboard — question input */}
          <div className="absolute top-[7%] left-[4.99%] flex h-[85.67%] w-[42.07%] flex-col gap-3.5">
            <h2 className="text-title font-bold text-ink">
              What's on your mind today?
            </h2>
            <p className="text-body text-muted">
              Ask anything about PCOS - no question is ever too small.
            </p>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="For example: my periods have been all over the place for months, is that something to worry about?"
              maxLength={500}
              className="min-h-20 flex-1 resize-none rounded-lg border border-burgundy/15 bg-transparent p-3 font-hand text-lead leading-relaxed text-ink outline-none"
            />

            <div className="flex items-center justify-between text-caption">
              <p className="text-muted">
                {!user &&
                  "Guest questions aren't saved. Sign in to keep a history."}
              </p>
              <p
                className={question.length > 450 ? "text-error" : "text-muted"}
              >
                {question.length}/500
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              {suggested.map((q) => (
                <Button key={q} variant="chip" onClick={() => setQuestion(q)}>
                  {q}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !question.trim()}
              className="self-start"
            >
              {loading ? "Asking..." : "Ask Orchid →"}
            </Button>
          </div>

          {/* Green paper — answer. Pill sits just outside, on the paper's edge. */}
          <PillScroll
            resetKey={answer}
            className="absolute top-[10.05%] left-[54.7%] h-[44.7%] w-[38.59%]"
            contentClassName="flex flex-col gap-3"
            pillClassName="-right-[2.4%] inset-y-0"
          >
            {(!answer || loading) && (
              <p
                className={`m-auto text-center font-display text-lead font-bold italic text-burgundy ${
                  loading ? "opacity-70" : "opacity-40"
                }`}
              >
                {loading
                  ? "Checking the guidelines..."
                  : "Your answer will land here"}
              </p>
            )}

            {answer && !loading && (
              <>
                <p className="font-display text-lead leading-snug font-bold italic text-ink">
                  {answer.summary}
                </p>

                {answer.points.map((point) => (
                  <div key={point.heading} className="text-body">
                    <p className="mb-0.5 font-bold text-burgundy">
                      {point.heading}
                    </p>
                    <p className="leading-relaxed text-ink">{point.body}</p>
                  </div>
                ))}

                <p className="text-small leading-snug text-muted italic">
                  {answer.closing}
                </p>

                <Button
                  variant="link"
                  onClick={resetQuestion}
                  className="self-start"
                >
                  Ask another →
                </Button>
              </>
            )}
          </PillScroll>

          {/* Pink paper — sources (whole box tilted to match the paper) */}
          <PillScroll
            resetKey={answer}
            className="absolute top-[66.95%] left-[55.29%] h-[21.74%] w-[36.03%] -rotate-[5.5deg]"
            contentClassName="pr-4"
          >
            {answer && !loading ? (
              <>
                <p className="mb-1 text-body font-semibold text-ink">Sources</p>
                {sources.map((s) => (
                  <p
                    key={s}
                    className="text-small leading-normal text-ink-olive"
                  >
                    {s}
                  </p>
                ))}
                <p className="mt-1.5 text-caption text-muted italic">
                  For informational purposes only. Always consult your
                  healthcare provider.
                </p>
              </>
            ) : (
              <p className="mt-4 text-center text-body text-ink-olive opacity-40">
                Sources will appear here
              </p>
            )}
          </PillScroll>
        </div>
      </div>

      {/* History — nothing until we know who's signed in, so signed-in
          users don't see the guest prompt flash first */}
      <div className="mx-auto max-w-6xl px-8 pb-24">
        {authLoading ? null : user ? (
          <HistoryCabinet history={history} loading={historyLoading} />
        ) : (
          <GuestHistoryPrompt />
        )}
      </div>
    </main>
  );
}
