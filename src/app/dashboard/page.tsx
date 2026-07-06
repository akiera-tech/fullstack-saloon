'use client'

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import BookingForm from '@/components/BookingForm';
import BookingsTable from '@/components/BookingsTable';

interface SessionUser { id: string; name: string; email: string }
interface Booking {
  id: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    const res = await fetch('/api/bookings');
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(async (d) => {
        if (!active) return;
        if (!d.user) {
          router.push('/login');
          return;
        }
        setUser(d.user);
        await loadBookings();
        setLoading(false);
      });
    return () => { active = false; };
  }, [router, loadBookings]);

  async function handleCancel(id: string) {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) await loadBookings();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono-head text-xs uppercase tracking-widest text-[var(--muted-fg)]">Loading console…</p>
      </main>
    );
  }

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <main>
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-14">
        <p className="eyebrow mb-2">Operator Console</p>
        <h1 className="font-display mb-2 text-4xl text-[var(--fg)] sm:text-5xl">
          Welcome back, {user?.name.split(' ')[0]}.
        </h1>
        <p className="mb-10 font-light text-[var(--muted-fg)]">
          {confirmedCount === 0
            ? 'No confirmed slots yet — reserve one below.'
            : `You have ${confirmedCount} confirmed ${confirmedCount === 1 ? 'slot' : 'slots'} on the books.`}
        </p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
          <BookingForm onBooked={loadBookings} />
          <div>
            <p className="eyebrow mb-4">Reservation Ledger</p>
            <BookingsTable bookings={bookings} onCancel={handleCancel} />
          </div>
        </div>
        <p className="mt-14 font-light text-[var(--muted-fg)]">
          Wrong account? <Link href="/login" className="text-[var(--primary)] hover:underline">Sign in as someone else</Link>.
        </p>
      </section>
    </main>
  );
}
