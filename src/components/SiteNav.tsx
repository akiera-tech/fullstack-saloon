'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SessionUser { id: string; name: string; email: string }

export default function SiteNav() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (active) setUser(d.user); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#0F1419]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono-head text-lg tracking-tight text-[var(--fg)]">
          SALOON<span className="text-[var(--primary)]">_OPS</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/#services" className="eyebrow hidden transition-colors hover:text-[var(--primary)] sm:inline">Services</Link>
          <Link href="/#process" className="eyebrow hidden transition-colors hover:text-[var(--primary)] sm:inline">Process</Link>
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="font-mono-head border-2 border-[var(--primary)] px-4 py-2 text-xs uppercase tracking-widest text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[#05080b]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="font-mono-head border-2 border-[var(--border)] px-4 py-2 text-xs uppercase tracking-widest text-[var(--muted-fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="eyebrow transition-colors hover:text-[var(--primary)]">Sign In</Link>
              <Link
                href="/register"
                className="font-mono-head border-2 border-[var(--primary)] px-4 py-2 text-xs uppercase tracking-widest text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[#05080b]"
              >
                Book the Chair
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
