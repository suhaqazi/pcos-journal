"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setDisplayName(null);
      return;
    }

    async function fetchProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .single();

      if (data?.full_name) {
        setDisplayName(data.full_name.split(" ")[0]);
      } else {
        setDisplayName(user!.email?.split("@")[0] ?? null);
      }
    }

    fetchProfile();
  }, [user]);

  const navLinks = [
    { label: "Ask", href: "/ask" },
    { label: "Journal", href: "/journal" },
    { label: "Insights", href: "/insights" },
    { label: "Resources", href: "/resources" },
  ];

  return (
    <>
      <style>{`
        .nav-link {
          font-family: var(--font-figtree);
          font-size: 0.875rem;
          font-weight: 800;
          color: #6B1F32;
          text-decoration: none;
          padding: 0.375rem 0.875rem;
          border-radius: 999px;
          transition: all 0.2s ease;
          background-color: transparent;
        }
        .nav-link:hover {
          color: #818B56;
        }
        .nav-link.active {
          color: #FAF7F2;
          background: radial-gradient(circle at center, #818B56, #383B2F);
        }
        .signin-btn {
          font-family: var(--font-figtree);
          font-size: 0.875rem;
          font-weight: 500;
          color: #6B1F32;
          background-color: #FFE8E4;
          border: 1px solid #6B1F32;
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s ease;
          display: inline-block;
        }
        .signin-btn:hover {
          background-color: #6B1F32;
          color: #FFE8E4;
          transform: translateY(-0.0625rem);
        }
        .getstarted-btn {
          font-family: var(--font-figtree);
          font-size: 0.875rem;
          font-weight: 500;
          color: #FAF7F2;
          background: radial-gradient(circle at center, #818B56, #383B2F);
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 999px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s ease;
          display: inline-block;
        }
        .getstarted-btn:hover {
          opacity: 0.88;
          transform: translateY(-0.0625rem);
        }
      `}</style>

      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0.875rem 3rem",
          backgroundColor: scrolled
            ? "rgba(255, 232, 228, 0.6)"
            : "rgba(255, 232, 228, 0.92)",
          backdropFilter: "blur(0.5rem)",
          WebkitBackdropFilter: "blur(0.5rem)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "background-color 0.3s ease",
          borderBottom: scrolled
            ? "0.0625rem solid rgba(107, 31, 50, 0.1)"
            : "none",
        }}
      >
        {/* Logo + App name */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            textDecoration: "none",
          }}
        >
          <Image
            src="/orchid.svg"
            alt="Ask Orchid logo"
            width={32}
            height={32}
          />
          <span
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "italic",
              fontWeight: "900",
              fontSize: "1.25rem",
              color: "#6B1F32",
              letterSpacing: "-0.02rem",
            }}
          >
            Ask Orchid
          </span>
        </Link>

        {/* Nav links */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.625rem",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {user ? (
            <>
              <span
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.875rem",
                  color: "#6B1F32",
                  opacity: 0.8,
                }}
              >
                Hi, {displayName}
              </span>
              <button
                onClick={signOut}
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#6B1F32",
                  backgroundColor: "#FFE8E4",
                  border: "0.0625rem solid #6B1F32",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6B1F32",
                  backgroundColor: "#FFE8E4",
                  border: "0.0625rem solid #6B1F32",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                style={{
                  fontFamily: "var(--font-figtree)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#FAF7F2",
                  background: "radial-gradient(circle, #818B56, #383B2F)",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "999px",
                  textDecoration: "none",
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
