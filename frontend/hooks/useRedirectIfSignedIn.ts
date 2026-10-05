"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Sends already-signed-in users away from pages like login and signup
export function useRedirectIfSignedIn(to = "/ask") {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.push(to);
  }, [user, loading, router, to]);
}