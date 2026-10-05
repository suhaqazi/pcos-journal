"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRedirectIfSignedIn } from "@/hooks/useRedirectIfSignedIn";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import TextLink from "@/components/ui/TextLink";

function getRequirements(password: string) {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    {
      label: "One special character (!@#$%^&*)",
      met: /[!@#$%^&*]/.test(password),
    },
  ];
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useRedirectIfSignedIn();

  const requirements = getRequirements(password);
  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, date_of_birth: dateOfBirth || null },
        emailRedirectTo: `${window.location.origin}/ask`,
      },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  }

  if (success) {
    return (
      <AuthShell title="Check your inbox" wide>
        <p className="text-center text-[0.9375rem] leading-relaxed text-muted">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account — it expires in 1 hour.
        </p>
        <TextLink href="/login" className="text-[0.9375rem]">
          Back to sign in
        </TextLink>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Your private PCOS notebook, just for you"
      wide
    >
      <form
        onSubmit={handleSignup}
        className="grid w-full gap-4 sm:grid-cols-2"
      >
        <TextField
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          required
          wrapperClassName="sm:col-span-2"
        />

        <TextField
          label={
            <>
              Date of birth{" "}
              <span className="font-normal text-muted">(optional)</span>
            </>
          }
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          hint={password && <PasswordChecklist requirements={requirements} />}
        />

        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          tone={
            confirmPassword ? (passwordsMatch ? "success" : "error") : "default"
          }
          hint={
            confirmPassword && (
              <p
                className={`text-xs ${passwordsMatch ? "text-olive" : "text-error"}`}
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </p>
            )
          }
        />

        {error && (
          <p
            role="alert"
            className="text-center text-sm text-error sm:col-span-2"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !allRequirementsMet || !passwordsMatch}
          className="mt-2 w-full sm:col-span-2"
        >
          {loading ? "Creating account..." : "Create account →"}
        </Button>
      </form>

      <p className="text-center text-[0.9375rem] text-muted">
        Already have an account? <TextLink href="/login">Log in</TextLink>
      </p>
    </AuthShell>
  );
}

// Live checklist under the password field
function PasswordChecklist({
  requirements,
}: {
  requirements: { label: string; met: boolean }[];
}) {
  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {requirements.map((req) => (
        <li key={req.label} className="flex items-center gap-2">
          <span
            className={`flex size-3.5 shrink-0 items-center justify-center rounded-full ${
              req.met ? "bg-olive" : "bg-sand"
            }`}
          >
            {req.met && (
              <svg
                width="8"
                height="8"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className={`text-xs ${req.met ? "text-olive" : "text-muted"}`}>
            {req.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
