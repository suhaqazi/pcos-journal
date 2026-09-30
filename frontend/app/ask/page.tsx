"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);

  const { user, loading: authLoading } = useAuth();
  const isGuest = !user;

  useEffect(() => {
    setSuggested(getRandomQuestions());
  }, []);

  async function handleSubmit() {
    if (!question.trim() || question.length > 500) return;
    setLoading(true);
    setAnswer("");
    setSources([]);
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch {
      setAnswer(
        "Something went wrong. Please check your connection and try again.",
      );
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
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
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
                fontFamily: "var(--font-figtree)",
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

      {/* Cork board */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 2rem 3rem",
          paddingBottom: "7rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "72rem",
          }}
        >
          {/* Cork board SVG */}
          <Image
            src="/corkboard.svg"
            alt="Cork board"
            width={1322}
            height={886}
            style={{ width: "100%", height: "auto", display: "block" }}
          />

          {/* Left panel — question input directly on whiteboard */}
          <div
            style={{
              position: "absolute",
              top: "4%",
              left: "2%",
              width: "47%",
              height: "92%",
              display: "flex",
              flexDirection: "column",
              padding: "1.5rem",
              gap: "0.875rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "700",
                fontSize: "clamp(1rem, 1.8vw, 1.375rem)",
                color: "#202B0E",
              }}
            >
              What's on your mind today?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
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
                fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "0.0625rem solid rgba(107, 31, 50, 0.15)",
                backgroundColor: "transparent",
                color: "#202B0E",
                resize: "none",
                outline: "none",
                lineHeight: "1.6",
                flex: 1,
                minHeight: "8rem",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.6875rem",
                  color: "#5A5A50",
                }}
              >
                {isGuest
                  ? "Guest questions aren't saved. Sign in to keep a history."
                  : ""}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.6875rem",
                  color: question.length > 450 ? "#E24B4A" : "#5A5A50",
                }}
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
                    fontFamily: "var(--font-figtree)",
                    fontSize: "clamp(0.6875rem, 1vw, 0.8125rem)",
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
                fontFamily: "var(--font-figtree)",
                fontSize: "clamp(0.8125rem, 1.2vw, 0.9375rem)",
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

          {/* Right panel — cork side */}
          <div
            style={{
              position: "absolute",
              top: "4%",
              left: "51%",
              width: "46%",
              height: "92%",
              display: "flex",
              flexDirection: "column",
              gap: "3%",
              padding: "2%",
            }}
          >
            {/* Empty state */}
            {!answer && !loading && (
              <>
                {/*  top — answer slot */}
                <div style={{ flex: "0 0 58%", position: "relative" }}>
                  <Image
                    src="/toppaper.svg"
                    alt=""
                    fill
                    style={{ objectFit: "contain", objectPosition: "top" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      width: "70%",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-fraunces)",
                        fontStyle: "italic",
                        fontWeight: "700",
                        fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                        color: "#6B2D3E",
                        opacity: 0.4,
                      }}
                    >
                      Your answer will land here
                    </p>
                  </div>
                </div>

                {/*  bottom — reference slot */}
                <div style={{ flex: "0 0 35%", position: "relative" }}>
                  <Image
                    src="/bottompaper.svg"
                    alt=""
                    fill
                    style={{ objectFit: "contain", objectPosition: "bottom" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      width: "70%",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "clamp(0.625rem, 0.9vw, 0.75rem)",
                        color: "#3B4A1A",
                        opacity: 0.4,
                      }}
                    >
                      Sources will appear here
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Loading */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-figtree)",
                    fontSize: "clamp(0.8125rem, 1.2vw, 0.9375rem)",
                    color: "#5A4A3A",
                    opacity: 0.7,
                  }}
                >
                  Checking the guidelines...
                </p>
              </div>
            )}

            {/* Answer state */}
            {answer && !loading && (
              <>
                {/* Answer on top paper — scrollable */}
                <div
                  style={{
                    flex: "0 0 58%",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Image
                    src="/toppaper.svg"
                    alt=""
                    fill
                    style={{
                      objectFit: "fill",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Scrollable answer text on top of paper */}
                  <div
                    style={{
                      position: "absolute",
                      top: "18%",
                      left: "10%",
                      right: "8%",
                      bottom: "5%",
                      overflowY: "auto",
                      zIndex: 2,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "clamp(0.625rem, 1vw, 0.8125rem)",
                        color: "#202B0E",
                        lineHeight: "1.6",
                      }}
                    >
                      {answer}
                    </p>
                    <button
                      onClick={() => {
                        setQuestion("");
                        setAnswer("");
                        setSources([]);
                        setSuggested(getRandomQuestions());
                      }}
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "clamp(0.5625rem, 0.8vw, 0.6875rem)",
                        fontWeight: "600",
                        color: "#6B1F32",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "0.75rem",
                        padding: 0,
                        display: "block",
                      }}
                    >
                      Ask another →
                    </button>
                  </div>
                </div>

                {/* Citations on bottom paper — scrollable */}
                <div
                  style={{
                    flex: "0 0 35%",
                    position: "relative",
                  }}
                >
                  <Image
                    src="/bottompaper.svg"
                    alt=""
                    fill
                    style={{
                      objectFit: "fill",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: "10%",
                      right: "8%",
                      bottom: "8%",
                      overflowY: "auto",
                      zIndex: 2,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "clamp(0.5625rem, 0.8vw, 0.6875rem)",
                        fontWeight: "600",
                        color: "#202B0E",
                        marginBottom: "0.375rem",
                      }}
                    >
                      Sources
                    </p>
                    {sources.map((s) => (
                      <p
                        key={s}
                        style={{
                          fontFamily: "var(--font-figtree)",
                          fontSize: "clamp(0.5rem, 0.75vw, 0.625rem)",
                          color: "#3B4A1A",
                          lineHeight: "1.5",
                        }}
                      >
                        {s}
                      </p>
                    ))}
                    <p
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "clamp(0.4375rem, 0.6vw, 0.5625rem)",
                        color: "#5A5A50",
                        marginTop: "0.5rem",
                        opacity: 0.7,
                      }}
                    >
                      For informational purposes only. Always consult your
                      healthcare provider.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Guest CTA */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 2rem 6rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#F1EBD5",
            borderRadius: "0.7rem 0.7rem 0 0",
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
              fontFamily: "var(--font-figtree)",
              fontSize: "0.75rem",
              fontWeight: "600",
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
            ></svg>
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
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.9375rem",
                  color: "#5A5A50",
                  lineHeight: "1.6",
                  maxWidth: "32rem",
                }}
              >
                Sign in for a bigger question allowance and a private history
                you can revisit any time. Your journal and insights come with it
                too.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/login"
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: "#FAF7F2",
                background: "radial-gradient(circle, #818B56, #383B2F)",
                padding: "0.75rem 2rem",
                borderRadius: "999px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: "#6B1F32",
                backgroundColor: "white",
                border: "0.0625rem solid #6B1F32",
                padding: "0.75rem 2rem",
                borderRadius: "999px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
