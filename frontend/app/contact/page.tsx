"use client";

import { useState } from "react";
import ArticleShell from "@/components/layout/ArticleShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { sendContactMessage } from "@/lib/api";
import { CONTACT_EMAIL } from "@/lib/legal";

const MAX_MESSAGE = 2000;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    const problem = await sendContactMessage({ name, email, message, website });
    setSending(false);
    if (problem) setError(problem);
    else setSent(true);
  }

  return (
    <ArticleShell
      title="Talk to the founder"
      eyebrow="Questions, ideas, or something that didn't work"
    >
      {sent ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-lead leading-relaxed text-stone">
            Thank you, your message is on its way. I read every one, and
            I&apos;ll reply to <strong className="text-ink">{email}</strong> as
            soon as I can.
          </p>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-8 text-lead leading-relaxed text-stone">
            I built Ask Orchid and read every message myself. Whether it&apos;s
            a question, an idea for something new, or a bug you ran into,
            I&apos;d love to hear it.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField
              label={
                <>
                  Name{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </>
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="What should I call you?"
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              placeholder="you@example.com"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-sm font-semibold text-ink"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE}
                rows={7}
                required
                placeholder="Your question, idea or feedback..."
                className="w-full resize-y rounded-xl border border-burgundy/20 bg-linen px-4 py-3 text-[0.9375rem] text-ink outline-none transition focus:border-burgundy/50 focus:ring-2 focus:ring-burgundy/15"
              />
              <p className="self-end text-caption text-muted">
                {message.length}/{MAX_MESSAGE}
              </p>
            </div>

            {/* Honeypot: hidden from people, but bots fill it in */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {error && (
              <p role="alert" className="text-sm text-error">
                {error}
              </p>
            )}

            <Button type="submit" disabled={sending} className="self-start">
              {sending ? "Sending..." : "Send message →"}
            </Button>

            <p className="text-caption text-muted">
              Prefer email? Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
              . Please don&apos;t share medical details you&apos;d want kept
              private.
            </p>
          </form>
        </>
      )}
    </ArticleShell>
  );
}
