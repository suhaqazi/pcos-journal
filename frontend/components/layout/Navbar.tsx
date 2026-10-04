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
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <nav
      className={`sticky top-0 z-100 grid grid-cols-[1fr_auto_1fr] items-center border-b px-12 py-3.5 backdrop-blur-sm transition-colors duration-300 ${
        scrolled
          ? "border-burgundy/10 bg-blush/60"
          : "border-transparent bg-blush/92"
      }`}
    >
      <Logo size="sm" />

      <div className="flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-radial from-olive to-olive-dark text-cream"
                  : "text-burgundy hover:text-olive"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-2.5">
        {user ? (
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
        )}
      </div>
    </nav>
  );
}
