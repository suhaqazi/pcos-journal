"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      {/* Dashed divider with diamond */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 3rem",
          backgroundColor: "#F5F0E8",
        }}
      >
        <div
          style={{
            flex: 1,
            borderTop: "0.0625rem dashed #6B1F32",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            width: "0.75rem",
            height: "0.75rem",
            backgroundColor: "#6B1F32",
            transform: "rotate(45deg)",
            margin: "0 1rem",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            flex: 1,
            borderTop: "0.0625rem dashed #6B1F32",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Main footer body */}
      <div
        style={{
          backgroundColor: "#F5F0E8",
          padding: "0.3rem 6rem 3rem",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
      >
        {/* Left — Brand */}
        <div>
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textDecoration: "none",
              marginBottom: "1rem",
            }}
          >
            <Image
              src="/orchid.svg"
              alt="Ask Orchid logo"
              width={130}
              height={130}
            />
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontStyle: "italic",
                fontWeight: "900",
                fontSize: "1.5rem",
                color: "#6B1F32",
                marginTop: "0.2rem",
              }}
            >
              Ask Orchid
            </span>
          </Link>

          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.9375rem",
              color: "#5A5A50",
              lineHeight: "1.7",
              marginBottom: "1.5rem",
              maxWidth: "20rem",
            }}
          >
            A warm, private notebook for PCOS — ask gentle questions, keep dated
            entries, and notice your own patterns over time.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* LinkedIn */}
            <Link
              href="https://www.linkedin.com/in/suha-qazi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6B1F32", opacity: 0.7 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>

            {/* GitHub */}
            <Link
              href="https://github.com/suhaqazi"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6B1F32", opacity: 0.7 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>

            {/* Email */}
            <Link
              href="askmyorchid@gmail.com"
              style={{ color: "#6B1F32", opacity: 0.7 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Explore */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#5A5A50",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Explore
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {["Ask", "Journal", "Insights", "Resources"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "1rem",
                  color: "#202B0E",
                  textDecoration: "none",
                  opacity: 0.8,
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Your Account */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#5A5A50",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Your Account
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {[
              { label: "Create an account", href: "/signup" },
              { label: "Sign in", href: "/login" },
              { label: "Try Ask without an account", href: "/ask" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "1rem",
                  color: "#202B0E",
                  textDecoration: "none",
                  opacity: 0.8,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-figtree)",
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "#5A5A50",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Company
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {[
              { label: "Talk to the founder", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "1rem",
                  color: "#202B0E",
                  textDecoration: "none",
                  opacity: 0.8,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          backgroundColor: "#EDE8DE",
          padding: "1.25rem 6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          borderTop: "0.0625rem solid rgba(107, 31, 50, 0.1)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "0.8125rem",
            color: "#5A5A50",
            maxWidth: "36rem",
            lineHeight: "1.5",
          }}
        >
          Ask Orchid is a supportive companion built on guidelines, not
          professional medical advice. Please talk with a clinician about your
          serious concern and care.
        </p>

        <p
          style={{
            fontFamily: "var(--font-figtree)",
            fontSize: "0.8125rem",
            color: "#5A5A50",
          }}
        >
          © 2026 Ask Orchid
        </p>
      </div>
    </footer>
  );
}
