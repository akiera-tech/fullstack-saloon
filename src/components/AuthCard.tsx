'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthCardProps {
  mode: 'login' | 'register';
}

export default function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again.');
        setSubmitting(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Cannot reach the server right now. Try again in a moment.');
      setSubmitting(false);
    }
  }

  return (
    <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--elevation-lg)] lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#141b26] p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.17 250 / 0.5), transparent 70%)' }}
        />
        <div className="relative">
          <p className="eyebrow mb-4">{isRegister ? 'New Operator' : 'Returning Operator'}</p>
          <h2 className="font-display text-3xl leading-tight text-[var(--fg)]">
            {isRegister ? 'Set up your seat at the console.' : 'Back to your console.'}
          </h2>
          <p className="mt-4 max-w-xs font-light leading-relaxed text-[var(--muted-fg)]">
            {isRegister
              ? 'One account tracks every booking you make, with live status on each.'
              : 'Your bookings, statuses, and history pick up right where you left them.'}
          </p>
        </div>
        <p className="relative font-mono-head text-xs text-[var(--muted-fg)]/70">SESSION::SECURE_HTTPONLY</p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 sm:p-10">
        <h1 className="font-display mb-1 text-2xl text-[var(--fg)]">{isRegister ? 'Create account' : 'Sign in'}</h1>
        <p className="mb-7 font-light text-[var(--muted-fg)]">
          {isRegister ? 'Takes under a minute.' : 'Enter your credentials to continue.'}
        </p>
        {isRegister && (
          <label className="mb-5 block">
            <span className="eyebrow mb-2 block">Full Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-[var(--primary)] bg-transparent px-4 py-3 text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--muted-fg)]/50 focus:border-[var(--primary)]"
              placeholder="Alex Rivera"
            />
          </label>
        )}
        <label className="mb-5 block">
          <span className="eyebrow mb-2 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border-2 bg-transparent px-4 py-3 text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--muted-fg)]/50 ${error ? 'border-[var(--accent)]' : 'border-[var(--primary)]'}`}
            placeholder="you@example.com"
          />
        </label>
        <label className="mb-2 block">
          <span className="eyebrow mb-2 block">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border-2 bg-transparent px-4 py-3 text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--muted-fg)]/50 ${error ? 'border-[var(--accent)]' : 'border-[var(--primary)]'}`}
            placeholder="At least 8 characters"
          />
        </label>
        {error && (
          <p className="font-mono-head mt-3 text-xs uppercase tracking-wide text-[var(--accent)]">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="font-mono-head group relative mt-7 flex w-full items-center justify-center border-2 border-[var(--primary)] px-6 py-3.5 text-sm uppercase tracking-widest text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[#05080b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="absolute left-0 top-0 h-full w-1 -translate-x-1 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
          {submitting ? 'Processing…' : isRegister ? 'Create Account' : 'Sign In'}
        </button>
        <p className="mt-6 text-center font-light text-[var(--muted-fg)]">
          {isRegister ? (
            <>Already have an account? <Link href="/login" className="text-[var(--primary)] hover:underline">Sign in</Link></>
          ) : (
            <>New here? <Link href="/register" className="text-[var(--primary)] hover:underline">Create an account</Link></>
          )}
        </p>
      </form>
    </div>
  );
}
