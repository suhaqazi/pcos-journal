"use client";

import Button from "@/components/ui/Button";
import PillScroll from "@/components/ui/PillScroll";
import AnswerBody from "@/components/ask/AnswerBody";
import { AnswerData } from "@/lib/answer";

export interface Turn {
  id: number;
  question: string;
  answer: AnswerData | null; // null while Orchid is still answering
  sources: string[];
}

interface MobileChatProps {
  thread: Turn[];
  draft: string;
  onDraftChange: (text: string) => void;
  onSend: () => void;
  suggested: string[];
  loading: boolean;
  isGuest: boolean;
  remaining: number | null;
}

// The Ask page on phones, tablets and small windows: a chat inside the
// wooden-framed whiteboard. User questions on the right, Orchid's answers
// (green) and sources (pink) on the left.
export default function MobileChat({
  thread,
  draft,
  onDraftChange,
  onSend,
  suggested,
  loading,
  isGuest,
  remaining,
}: MobileChatProps) {
  const last = thread[thread.length - 1];

  return (
    <div className="rounded-xl border-[10px] border-wood bg-whiteboard p-4 shadow-[0_6px_14px_rgb(0_0_0/0.15)] md:p-6">
      {/* Conversation: grows up to 60% of the screen, then scrolls */}
      <PillScroll
        scrollClassName="max-h-[60vh]"
        contentClassName="flex flex-col gap-3 pr-4"
        resetKey={`${thread.length}-${last?.answer ? "answered" : "waiting"}`}
        scrollTo="bottom"
      >
        {thread.length === 0 ? (
          <div>
            <h2 className="text-title font-bold text-ink">
              What&apos;s on your mind today?
            </h2>
            <p className="mt-1 mb-4 text-body text-muted">
              Ask anything about PCOS. No question is too small.
            </p>
            <div className="flex flex-col gap-1.5">
              {suggested.map((q) => (
                <Button key={q} variant="chip" onClick={() => onDraftChange(q)}>
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          thread.map((turn) => (
            <div key={turn.id} className="flex flex-col gap-2">
              {/* User question */}
              <p className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-burgundy px-4 py-2.5 text-body text-paper">
                {turn.question}
              </p>

              {turn.answer ? (
                <>
                  {/* Orchid's answer */}
                  <div className="max-w-[92%] self-start rounded-2xl rounded-bl-sm bg-sage-light px-4 py-3">
                    <AnswerBody answer={turn.answer} />
                  </div>

                  {/* Sources */}
                  {turn.sources.length > 0 && (
                    <div className="max-w-[92%] self-start rounded-2xl rounded-bl-sm bg-blush px-4 py-2.5 text-small">
                      <p className="font-semibold text-ink">Sources</p>
                      {turn.sources.map((s) => (
                        <p key={s} className="text-ink-olive">
                          {s}
                        </p>
                      ))}
                      <p className="mt-1 text-caption text-muted italic">
                        For informational purposes only. Always consult your
                        healthcare provider.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="self-start rounded-2xl rounded-bl-sm bg-sage-light px-4 py-2.5 font-display text-body text-burgundy italic">
                  Checking the guidelines...
                </p>
              )}
            </div>
          ))
        )}
      </PillScroll>

      {/* Write and send */}
      <div className="mt-4 border-t border-burgundy/15 pt-4">
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Type your question..."
          maxLength={500}
          rows={3}
          aria-label="Your question"
          className="w-full resize-none rounded-lg border border-burgundy/15 bg-transparent p-3 font-hand text-lead leading-relaxed text-ink outline-none focus:border-burgundy/40"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-caption text-muted">
            {remaining !== null
              ? `${remaining} ${remaining === 1 ? "question" : "questions"} left today`
              : isGuest
                ? "Guest questions aren't saved."
                : `${draft.length}/500`}
          </p>
          <Button
            size="sm"
            onClick={onSend}
            disabled={loading || !draft.trim()}
          >
            {loading ? "Asking..." : "Ask Orchid →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
