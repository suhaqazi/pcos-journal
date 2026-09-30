"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/ask");
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/ask`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
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
          maxWidth: "28rem",
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
            Welcome back
          </h1>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#5A5A50",
            }}
          >
            Log in to your private notebook
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#F5F0E8",
            borderRadius: "999px",
            padding: "0.25rem",
            width: "100%",
          }}
        >
          {(["password", "magic"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
                setMagicLinkSent(false);
              }}
              style={{
                flex: 1,
                fontFamily: "var(--font-figtree)",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: mode === m ? "#FFFDF7" : "#5A5A50",
                backgroundColor: mode === m ? "#6B1F32" : "transparent",
                border: "none",
                borderRadius: "999px",
                padding: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {m === "password" ? "Password" : "Magic link"}
            </button>
          ))}
        </div>

        {/* Magic link success state */}
        {magicLinkSent ? (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "700",
                fontSize: "1.25rem",
                color: "#202B0E",
                marginBottom: "0.75rem",
              }}
            >
              Check your inbox
            </p>
            <p
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                color: "#5A5A50",
                lineHeight: "1.6",
              }}
            >
              We sent a magic link to <strong>{email}</strong>. Click it to sign
              in — it expires in 1 hour.
            </p>
          </div>
        ) : (
          <form
            onSubmit={mode === "password" ? handleLogin : handleMagicLink}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
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

            {/* Password field — only shown in password mode */}
            {mode === "password" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.375rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                  <Link
                    href="/forgot-password"
                    style={{
                      fontFamily: "var(--font-figtree)",
                      fontSize: "0.8125rem",
                      color: "#6B1F32",
                      textDecoration: "underline",
                      textUnderlineOffset: "0.1875rem",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
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
                  {/* Show/hide toggle */}
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
                      // Eye-off icon
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
                      // Eye icon
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
              </div>
            )}

            {/* Error */}
            {error && (
              <p
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.875rem",
                  color: "#E24B4A",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: "var(--font-figtree)",
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: "#FAF7F2",
                background: loading
                  ? "#9A9A90"
                  : "radial-gradient(circle, #818B56, #383B2F)",
                padding: "0.875rem 2rem",
                borderRadius: "999px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                width: "100%",
                marginTop: "0.5rem",
              }}
            >
              {loading
                ? "Please wait..."
                : mode === "password"
                  ? "Log in →"
                  : "Send magic link →"}
            </button>
          </form>
        )}

        {/* Signup link */}
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "0.9375rem",
            color: "#5A5A50",
            textAlign: "center",
          }}
        >
          New here?{" "}
          <Link
            href="/signup"
            style={{
              color: "#6B1F32",
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "0.1875rem",
            }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
