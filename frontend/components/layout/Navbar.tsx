"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Ask", href: "/ask" },
  { label: "Journal", href: "/journal" },
  { label: "Insights", href: "/insights" },
  { label: "Resources", href: "/resources" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // phone menu
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the phone menu when the page changes
  useEffect(() => setMenuOpen(false), [pathname]);

  // ...and when Escape is pressed
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  // First name from the profile, falling back to the email prefix
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

      setDisplayName(
        data?.full_name
          ? data.full_name.split(" ")[0]
          : (user!.email?.split("@")[0] ?? null),
      );
    }

    fetchProfile();
  }, [user]);

  const authButtons = user ? (
    <>
      <span className="text-sm text-burgundy/80">Hi, {displayName}</span>
      <Button variant="secondary" size="sm" onClick={signOut}>
        Sign out
      </Button>
    </>
  ) : (
    <>
      <Button href="/login" variant="secondary" size="sm">
        Sign in
      </Button>
      <Button href="/signup" size="sm">
        Get started
      </Button>
    </>
  );

  // Desktop links are small pills; phone links are bigger, easier to tap
  const linkClass = (href: string, size: "sm" | "lg") =>
    `rounded-full font-bold transition-all duration-200 ${
      size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-4 py-2.5 text-base"
    } ${
      pathname === href
        ? "bg-radial from-olive to-olive-dark text-cream"
        : "text-burgundy hover:text-olive"
    }`;

  return (
    <nav
      className={`sticky top-0 z-100 border-b backdrop-blur-sm transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-burgundy/10 bg-blush/95"
          : "border-transparent bg-blush/92"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-3.5 md:grid md:grid-cols-[1fr_auto_1fr] md:px-12">
        <Logo size="sm" />

        {/* Desktop: links in the middle, account buttons on the right */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={linkClass(link.href, "sm")}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center justify-end gap-2.5 md:flex">
          {authButtons}
        </div>

        {/* Phones: one menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full text-burgundy hover:bg-burgundy/10 md:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Phone menu: drops down under the bar */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-burgundy/10 px-5 pt-3 pb-5 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={linkClass(link.href, "lg")}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-wrap items-center gap-2.5 border-t border-burgundy/10 pt-4">
            {authButtons}
          </div>
        </div>
      )}
    </nav>
  );
}
