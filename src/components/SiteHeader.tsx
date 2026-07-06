'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchMe, logout, ApiUser } from "@/lib/api-client";

export default function SiteHeader() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchMe()
      .then((d) => setUser(d.user))
      .finally(() => setLoaded(true));
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-[var(--fg)]">
          SALOON<span className="text-[var(--primary)]">.</span>
        </Link>
        <nav className="hidden items-center gap-8 font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)] md:flex">
          <Link href="/#services" className="transition-colors hover:text-[var(--fg)]">Services</Link>
          <Link href="/#process" className="transition-colors hover:text-[var(--fg)]">Process</Link>
          {user && (
            <Link href="/dashboard" className="transition-colors hover:text-[var(--fg)]">Dashboard</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {loaded && !user && (
            <>
              <Link
                href="/login"
                className="font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)] transition-colors hover:text-[var(--fg)]"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="border-2 border-[var(--primary)] bg-transparent px-4 py-2 font-mono-op text-xs uppercase tracking-widest text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--bg)]"
              >
                Reserve a chair
              </Link>
            </>
          )}
          {loaded && user && (
            <button
              onClick={handleLogout}
              className="border-2 border-[var(--border)] bg-transparent px-4 py-2 font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--fg)]"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
