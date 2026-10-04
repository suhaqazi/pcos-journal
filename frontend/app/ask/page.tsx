"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import PillScroll from "@/components/ui/PillScroll";

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

const FOLDER_COLORS = [
  { bg: "#FFE8E4", border: "#E8C4BC", text: "#6B1F32" },
  { bg: "#E9EED9", border: "#C8D4A8", text: "#202B0E" },
  { bg: "#EEF1D0", border: "#C8D4A8", text: "#3B4A1A" },
  { bg: "#F5E6EA", border: "#D4B0BC", text: "#6B1F32" },
  { bg: "#FFFDF7", border: "#E0D8C8", text: "#202B0E" },
];

interface AnswerData {
  summary: string;
  points: { heading: string; body: string }[];
  closing: string;
}

function parseAnswer(raw: string): AnswerData | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getRandomQuestions() {
  return [...SUGGESTED_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 4);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function folderColor(index: number) {
  return FOLDER_COLORS[index % FOLDER_COLORS.length];
}

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AnswerData | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [activeFolder, setActiveFolder] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { user } = useAuth();
  const isGuest = !user;

  // The opened history item, worked out once instead of searching repeatedly
  const activeIndex = history.findIndex((h) => h.id === activeFolder);
  const activeItem = activeIndex >= 0 ? history[activeIndex] : null;
  const activeColor = folderColor(Math.max(activeIndex, 0));
  const activeAnswer = activeItem ? parseAnswer(activeItem.answer) : null;

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
      setAnswer({
        summary: "Something went wrong.",
        points: [
          {
            heading: "Connection issue",
            body: "Please check your connection and try again. If the problem persists, the service may be temporarily unavailable.",
          },
        ],
        closing: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        backgroundImage: "url('/wallpaper.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Hero header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <Image
            src="/askpagehead.svg"
            alt=""
            width={720}
            height={180}
            style={{ display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "80%",
            }}
          >
            <h1
              style={{
                fontWeight: "900",
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                color: "#202B0E",
                marginBottom: "0.5rem",
                lineHeight: "1.2",
              }}
            >
              Ask the question you've been{" "}
              <span style={{ color: "#6B1F32" }}>holding</span>
            </h1>
            <p
              style={{
                fontSize: "clamp(0.75rem, 1.2vw, 0.9375rem)",
                color: "#6B1F32",
                lineHeight: "1.5",
              }}
            >
              No jargon, no judgement. Ask anything about PCOS and get a warm,
              plain-language answer — then take the parts that matter to your
              clinician.
            </p>
          </div>
        </div>
      </div>

      {/* Cork board — one SVG for the whole board, text boxes laid on top.
          All positions are % of the board, measured from the Figma frame
          (1321.65 × 886), so everything scales together. */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 2rem 7rem",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "72rem" }}>
          <Image
            src="/corkboard.svg"
            alt="Cork board"
            width={1322}
            height={886}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />

          {/* Whiteboard — question input */}
          <div
            style={{
              position: "absolute",
              left: "4.99%",
              top: "7%",
              width: "42.07%",
              height: "85.67%",
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            <h2
              style={{
                fontWeight: "700",
                fontSize: "clamp(1rem, 1.8vw, 1.375rem)",
                color: "#202B0E",
              }}
            >
              What's on your mind today?
            </h2>
            <p
              style={{
                fontSize: "clamp(0.8125rem, 1.1vw, 0.9375rem)",
                color: "#5A5A50",
              }}
            >
              Ask anything about PCOS — no question is too small.
            </p>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="For example: my periods have been all over the place for months — is that something to worry about?"
              maxLength={500}
              style={{
                fontFamily: "var(--font-gaegu)",
                fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "0.0625rem solid rgba(107, 31, 50, 0.15)",
                backgroundColor: "transparent",
                color: "#202B0E",
                resize: "none",
                outline: "none",
                lineHeight: "1.6",
                flex: 1,
                minHeight: "5rem",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "clamp(0.6875rem, 0.9vw, 0.75rem)",
              }}
            >
              <p style={{ color: "#5A5A50" }}>
                {isGuest &&
                  "Guest questions aren't saved. Sign in to keep a history."}
              </p>
              <p
                style={{ color: question.length > 450 ? "#E24B4A" : "#5A5A50" }}
              >
                {question.length}/500
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              {suggested.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  style={{
                    fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
                    color: "#6B1F32",
                    backgroundColor: "transparent",
                    border: "0.0625rem solid rgba(107, 31, 50, 0.25)",
                    borderRadius: "999px",
                    padding: "0.3rem 0.75rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !question.trim()}
              style={{
                fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                fontWeight: "600",
                color: "#FAF7F2",
                background: loading
                  ? "#9A9A90"
                  : "radial-gradient(circle, #818B56, #383B2F)",
                padding: "0.625rem 1.5rem",
                borderRadius: "999px",
                border: "none",
                cursor: loading || !question.trim() ? "not-allowed" : "pointer",
                alignSelf: "flex-start",
              }}
            >
              {loading ? "Asking..." : "Ask Orchid →"}
            </button>
          </div>

          {/* Green paper — answer. Pill sits just outside, on the paper's edge. */}
          <PillScroll
            resetKey={answer}
            pillRight="-2.4%"
            style={{
              position: "absolute",
              left: "54.7%",
              top: "10.05%",
              width: "38.59%",
              height: "44.7%",
            }}
            contentStyle={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {(!answer || loading) && (
              <p
                style={{
                  margin: "auto",
                  textAlign: "center",
                  fontFamily: "var(--font-fraunces)",
                  fontStyle: "italic",
                  fontWeight: "700",
                  fontSize: "clamp(0.9375rem, 1.3vw, 1.125rem)",
                  color: "#6B2D3E",
                  opacity: loading ? 0.7 : 0.4,
                }}
              >
                {loading
                  ? "Checking the guidelines..."
                  : "Your answer will land here"}
              </p>
            )}

            {answer && !loading && (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "italic",
                    fontWeight: "700",
                    fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
                    color: "#202B0E",
                    lineHeight: "1.4",
                  }}
                >
                  {answer.summary}
                </p>

                {answer.points.map((point) => (
                  <div
                    key={point.heading}
                    style={{ fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        color: "#6B1F32",
                        marginBottom: "0.125rem",
                      }}
                    >
                      {point.heading}
                    </p>
                    <p style={{ color: "#202B0E", lineHeight: "1.55" }}>
                      {point.body}
                    </p>
                  </div>
                ))}

                <p
                  style={{
                    fontStyle: "italic",
                    fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)",
                    color: "#5A5A50",
                    lineHeight: "1.4",
                  }}
                >
                  {answer.closing}
                </p>

                <button
                  onClick={() => {
                    setQuestion("");
                    setAnswer(null);
                    setSources([]);
                    setSuggested(getRandomQuestions());
                  }}
                  style={{
                    fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)",
                    fontWeight: "600",
                    color: "#6B1F32",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  Ask another →
                </button>
              </>
            )}
          </PillScroll>

          {/* Pink paper — sources (whole box tilted to match the paper) */}
          <PillScroll
            resetKey={answer}
            style={{
              position: "absolute",
              left: "55.29%",
              top: "66.95%",
              width: "36.03%",
              height: "21.74%",
              transform: "rotate(-5.5deg)",
            }}
            contentStyle={{ paddingRight: "1rem" }}
          >
            {answer && !loading ? (
              <>
                <p
                  style={{
                    fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
                    fontWeight: "600",
                    color: "#202B0E",
                    marginBottom: "0.25rem",
                  }}
                >
                  Sources
                </p>
                {sources.map((s) => (
                  <p
                    key={s}
                    style={{
                      fontSize: "clamp(0.75rem, 0.95vw, 0.875rem)",
                      color: "#3B4A1A",
                      lineHeight: "1.5",
                    }}
                  >
                    {s}
                  </p>
                ))}
                <p
                  style={{
                    fontSize: "clamp(0.6875rem, 0.85vw, 0.8125rem)",
                    color: "#5A5A50",
                    marginTop: "0.375rem",
                    fontStyle: "italic",
                  }}
                >
                  For informational purposes only. Always consult your
                  healthcare provider.
                </p>
              </>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
                  color: "#3B4A1A",
                  opacity: 0.4,
                }}
              >
                Sources will appear here
              </p>
            )}
          </PillScroll>
        </div>
      </div>

      {/* History section */}
      <div
        style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 2rem 6rem" }}
      >
        {isGuest ? (
          <div
            style={{
              backgroundColor: "#F1EBD5",
              borderRadius: "0.75rem 0.75rem 0 0",
              padding: "2.5rem 3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-1.5rem",
                left: "1rem",
                backgroundColor: "#F1EBD5",
                borderRadius: "0.5rem 0.5rem 0 0",
                padding: "0.375rem 1.25rem",
                fontFamily: "var(--font-gaegu)",
                fontSize: "0.875rem",
                fontWeight: "700",
                color: "#6B1F32",
                letterSpacing: "0.05em",
              }}
            >
              YOUR HISTORY
            </div>

            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ flexShrink: 0, marginTop: "0.25rem" }}
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#6B1F32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "italic",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    color: "#6B1F32",
                    marginBottom: "0.5rem",
                  }}
                >
                  Want to keep your questions?
                </p>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#5A5A50",
                    lineHeight: "1.6",
                    maxWidth: "32rem",
                  }}
                >
                  Sign in for a bigger question allowance and a private history
                  you can revisit any time. Your journal and insights come with
                  it too.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link
                href="/login"
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: "600",
                  color: "#FAF7F2",
                  background: "radial-gradient(circle, #818B56, #383B2F)",
                  padding: "0.75rem 2rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: "600",
                  color: "#6B1F32",
                  backgroundColor: "white",
                  border: "0.0625rem solid #6B1F32",
                  padding: "0.75rem 2rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                }}
              >
                Create an account
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Left — scrollable folder stack */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-gaegu)",
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#FFFDF7",
                  letterSpacing: "0.05em",
                  marginBottom: "1rem",
                  opacity: 0.8,
                }}
              >
                Your question history
              </p>

              {historyLoading ? (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#FFFDF7",
                    opacity: 0.5,
                  }}
                >
                  Loading your history...
                </p>
              ) : (
                history.length > 0 && (
                  <PillScroll
                    maxHeight="32rem"
                    contentStyle={{
                      paddingTop: "1rem",
                      paddingRight: "1.25rem",
                    }}
                  >
                    {history.map((item, index) => {
                      const isActive = activeFolder === item.id;
                      const color = folderColor(index);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveFolder(item.id)}
                          style={{
                            position: "relative",
                            marginBottom: "-3rem",
                            cursor: "pointer",
                            zIndex: history.length - index,
                            transition: "transform 0.2s ease",
                            transform: isActive
                              ? "translateY(-0.5rem)"
                              : "none",
                          }}
                        >
                          {/* Folder tab */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "1.5rem",
                              backgroundColor: color.bg,
                              borderTop: `0.0625rem solid ${color.border}`,
                              borderLeft: `0.0625rem solid ${color.border}`,
                              borderRight: `0.0625rem solid ${color.border}`,
                              borderRadius: "0.5rem 0.5rem 0 0",
                              padding: "0.25rem 1rem",
                              zIndex: 1,
                              fontFamily: "var(--font-gaegu)",
                              fontSize: "0.9375rem",
                              fontWeight: "700",
                              color: color.text,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(item.created_at)}
                          </div>

                          {/* Folder body */}
                          <div
                            style={{
                              backgroundColor: color.bg,
                              border: `0.0625rem solid ${color.border}`,
                              borderRadius: "0 0.75rem 0.75rem 0.75rem",
                              padding: "1.75rem 1.25rem 4rem",
                              marginTop: "1.5rem",
                              boxShadow: isActive
                                ? "0 0.25rem 1rem rgba(0,0,0,0.15)"
                                : "0 0.125rem 0.5rem rgba(0,0,0,0.08)",
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "var(--font-fraunces)",
                                fontStyle: "italic",
                                fontWeight: "700",
                                fontSize: "1rem",
                                color: color.text,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.question}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {/* Space so the last folder isn't hidden by the overlap */}
                    <div style={{ height: "4rem" }} />
                  </PillScroll>
                )
              )}
            </div>

            {/* Right — opened file content */}
            <div style={{ position: "sticky", top: "6rem" }}>
              {activeItem ? (
                <div style={{ position: "relative" }}>
                  {/* File tab */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-1.75rem",
                      left: "1.5rem",
                      backgroundColor: activeColor.bg,
                      borderTop: `0.0625rem solid ${activeColor.border}`,
                      borderLeft: `0.0625rem solid ${activeColor.border}`,
                      borderRight: `0.0625rem solid ${activeColor.border}`,
                      borderRadius: "0.5rem 0.5rem 0 0",
                      padding: "0.375rem 1.25rem",
                      fontFamily: "var(--font-gaegu)",
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: activeColor.text,
                    }}
                  >
                    {formatDate(activeItem.created_at)}
                  </div>

                  {/* File body */}
                  <PillScroll
                    resetKey={activeFolder}
                    maxHeight="32rem"
                    pillRight="0.625rem"
                    trackInset="1rem"
                    style={{
                      backgroundColor: "#F2ECD6",
                      border: `0.0625rem solid ${activeColor.border}`,
                      borderRadius: "0 0.75rem 0.75rem 0.75rem",
                    }}
                    contentStyle={{ padding: "2rem 2.5rem 2rem 2rem" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-fraunces)",
                        fontStyle: "italic",
                        fontWeight: "700",
                        fontSize: "1.125rem",
                        color: activeColor.text,
                        marginBottom: "1rem",
                        lineHeight: "1.3",
                      }}
                    >
                      {activeItem.question}
                    </p>

                    {activeAnswer ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-fraunces)",
                            fontStyle: "italic",
                            fontWeight: "700",
                            fontSize: "1rem",
                            color: activeColor.text,
                            lineHeight: "1.4",
                          }}
                        >
                          {activeAnswer.summary}
                        </p>
                        {activeAnswer.points.map((point) => (
                          <div
                            key={point.heading}
                            style={{ fontSize: "0.875rem" }}
                          >
                            <p
                              style={{
                                fontWeight: "700",
                                color: "#6B1F32",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {point.heading}
                            </p>
                            <p style={{ color: "#3B3B35", lineHeight: "1.6" }}>
                              {point.body}
                            </p>
                          </div>
                        ))}
                        <p
                          style={{
                            fontStyle: "italic",
                            fontSize: "0.8125rem",
                            color: activeColor.text,
                            opacity: 0.6,
                          }}
                        >
                          {activeAnswer.closing}
                        </p>
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "#3B3B35",
                          lineHeight: "1.7",
                        }}
                      >
                        {activeItem.answer}
                      </p>
                    )}

                    {activeItem.sources?.length > 0 && (
                      <div
                        style={{
                          marginTop: "1rem",
                          paddingTop: "0.75rem",
                          borderTop: `0.0625rem solid ${activeColor.border}`,
                          fontSize: "0.75rem",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: "600",
                            color: activeColor.text,
                            opacity: 0.7,
                            marginBottom: "0.25rem",
                          }}
                        >
                          Source
                        </p>
                        <p style={{ color: "#3B3B35", lineHeight: "1.5" }}>
                          {activeItem.sources[0]}
                        </p>
                      </div>
                    )}

                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "#5A5A50",
                        marginTop: "1rem",
                        opacity: 0.6,
                        fontStyle: "italic",
                      }}
                    >
                      For informational purposes only. Always consult your
                      healthcare provider.
                    </p>
                  </PillScroll>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "12rem",
                    backgroundColor: "rgba(255,253,247,0.1)",
                    borderRadius: "0.75rem",
                    border: "0.0625rem dashed rgba(255,253,247,0.3)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-gaegu)",
                      fontSize: "1.125rem",
                      color: "#FFFDF7",
                      opacity: 0.4,
                      textAlign: "center",
                    }}
                  >
                    Select a folder to read your answer
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
