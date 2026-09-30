"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

function getRequirements(password: string): PasswordRequirement[] {
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
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const requirements = getRequirements(password);
  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          date_of_birth: dateOfBirth || null,
        },
        emailRedirectTo: `${window.location.origin}/ask`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main
        style={{
          backgroundImage: "url('/wallpaper.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFDF7",
            borderRadius: "2.5rem",
            padding: "3rem",
            width: "100%",
            maxWidth: "42rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Image src="/orchid.svg" alt="Ask Orchid" width={60} height={60} />
          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: "700",
              fontSize: "1.75rem",
              color: "#202B0E",
            }}
          >
            Check your inbox
          </h1>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#5A5A50",
              lineHeight: "1.6",
            }}
          >
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account — it expires in 1 hour.
          </p>
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              fontWeight: "600",
              color: "#6B1F32",
              textDecoration: "underline",
              textUnderlineOffset: "0.1875rem",
            }}
          >
            Back to sign in
          </Link>
        </div>
      </main>
    );
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFDF7",
          borderRadius: "2.5rem",
          padding: "3rem",
          width: "100%",
          maxWidth: "42rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Image src="/orchid.svg" alt="Ask Orchid" width={60} height={60} />
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "900",
                fontSize: "1.375rem",
                color: "#6B1F32",
              }}
            >
              Ask Orchid
            </span>
          </div>
        </Link>

        {/* Heading */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: "700",
              fontSize: "1.75rem",
              color: "#202B0E",
              marginBottom: "0.5rem",
            }}
          >
            Create your account
          </h1>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#5A5A50",
            }}
          >
            Your private PCOS notebook, just for you
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {/* Full name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              gridColumn: "1 / -1",
            }}
          >
            <label
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#202B0E",
              }}
            >
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "0.0625rem solid rgba(107, 31, 50, 0.2)",
                backgroundColor: "#F5F0E8",
                color: "#202B0E",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Date of birth — optional */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#202B0E",
              }}
            >
              Date of birth{" "}
              <span style={{ fontWeight: "400", color: "#5A5A50" }}>
                (optional)
              </span>
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "0.0625rem solid rgba(107, 31, 50, 0.2)",
                backgroundColor: "#F5F0E8",
                color: "#202B0E",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Email */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#202B0E",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "0.0625rem solid rgba(107, 31, 50, 0.2)",
                backgroundColor: "#F5F0E8",
                color: "#202B0E",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Password */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#202B0E",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.9375rem",
                  padding: "0.75rem 3rem 0.75rem 1rem",
                  borderRadius: "0.75rem",
                  border: "0.0625rem solid rgba(107, 31, 50, 0.2)",
                  backgroundColor: "#F5F0E8",
                  color: "#202B0E",
                  outline: "none",
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#5A5A50",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password requirements */}
            {password && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  marginTop: "0.375rem",
                }}
              >
                {requirements.map((req) => (
                  <div
                    key={req.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "0.875rem",
                        height: "0.875rem",
                        borderRadius: "999px",
                        backgroundColor: req.met ? "#818B56" : "#E0D8C8",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {req.met && (
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 12 12"
                          fill="none"
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
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-figtree)",
                        fontSize: "0.75rem",
                        color: req.met ? "#818B56" : "#5A5A50",
                      }}
                    >
                      {req.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#202B0E",
              }}
            >
              Confirm password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.9375rem",
                  padding: "0.75rem 3rem 0.75rem 1rem",
                  borderRadius: "0.75rem",
                  border: `0.0625rem solid ${
                    confirmPassword
                      ? passwordsMatch
                        ? "rgba(129, 139, 86, 0.5)"
                        : "rgba(226, 75, 74, 0.5)"
                      : "rgba(107, 31, 50, 0.2)"
                  }`,
                  backgroundColor: "#F5F0E8",
                  color: "#202B0E",
                  outline: "none",
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#5A5A50",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showConfirmPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {/* Match indicator */}
            {confirmPassword && (
              <p
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.75rem",
                  color: passwordsMatch ? "#818B56" : "#E24B4A",
                }}
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                color: "#E24B4A",
                textAlign: "center",
                gridColumn: "1 / -1",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !allRequirementsMet || !passwordsMatch}
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              fontWeight: "600",
              color: "#FAF7F2",
              background:
                loading || !allRequirementsMet || !passwordsMatch
                  ? "#9A9A90"
                  : "radial-gradient(circle, #818B56, #383B2F)",
              padding: "0.875rem 2rem",
              borderRadius: "999px",
              border: "none",
              cursor:
                loading || !allRequirementsMet || !passwordsMatch
                  ? "not-allowed"
                  : "pointer",
              width: "100%",
              marginTop: "0.5rem",
              gridColumn: "1 / -1",
            }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>

        {/* Login link */}
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "0.9375rem",
            color: "#5A5A50",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#6B1F32",
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "0.1875rem",
            }}
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
