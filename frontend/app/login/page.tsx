"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRedirectIfSignedIn } from "@/hooks/useRedirectIfSignedIn";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import TextLink from "@/components/ui/TextLink";

type Mode = "password" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useRedirectIfSignedIn();

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setMagicLinkSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } =
      mode === "password"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/ask` },
          });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "password") router.push("/ask");
    else setMagicLinkSent(true);
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your private notebook">
      {/* Password / magic link switch */}
      <div className="flex w-full rounded-full bg-linen p-1">
        {(["password", "magic"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={`flex-1 cursor-pointer rounded-full p-2 text-sm font-semibold transition-all duration-200 ${
              mode === m ? "bg-burgundy text-paper" : "text-muted"
            }`}
          >
            {m === "password" ? "Password" : "Magic link"}
          </button>
        ))}
      </div>

      {magicLinkSent ? (
        <div className="text-center">
          <p className="mb-3 font-display text-xl font-bold text-ink italic">
            Check your inbox
          </p>
          <p className="text-[0.9375rem] leading-relaxed text-muted">
            We sent a magic link to <strong>{email}</strong>. Click it to sign
            in — it expires in 1 hour.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {mode === "password" && (
            <PasswordField
              label="Password"
              labelExtra={
                <TextLink href="/forgot-password" className="text-[0.8125rem]">
                  Forgot password?
                </TextLink>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}

          {error && (
            <p role="alert" className="text-center text-sm text-error">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading
              ? "Please wait..."
              : mode === "password"
                ? "Log in →"
                : "Send magic link →"}
          </Button>
        </form>
      )}

      <p className="text-center text-[0.9375rem] text-muted">
        New here? <TextLink href="/signup">Create an account</TextLink>
      </p>
    </AuthShell>
  );
}
