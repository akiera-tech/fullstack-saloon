'use client'

import { useState, FormEvent } from 'react';

const SERVICES = ['Signature Fade', 'Classic Hot-Towel Shave', 'Beard Sculpt', 'Full Restyle'];
const STYLISTS = ['Marcus Webb', 'Priya Anand', 'Jonah Reyes', 'Sofia Marchetti'];

interface BookingFormProps {
  onBooked: () => void;
}

export default function BookingForm({ onBooked }: BookingFormProps) {
  const [service, setService] = useState(SERVICES[0]);
  const [stylist, setStylist] = useState(STYLISTS[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const todayIso = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!date || !time) {
      setError('Pick a date and time to reserve the slot.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, stylist, date, time }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create the booking.');
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setDate('');
      setTime('');
      onBooked();
    } catch {
      setError('Cannot reach the server right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--elevation-sm)]">
      <p className="eyebrow mb-2">New Reservation</p>
      <h2 className="font-display mb-6 text-2xl text-[var(--fg)]">Book the chair</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2 block">Service</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full border-2 border-[var(--primary)] bg-transparent px-4 py-3 text-[var(--fg)] outline-none [&>option]:bg-[#1A2332]"
          >
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">Stylist</span>
          <select
            value={stylist}
            onChange={(e) => setStylist(e.target.value)}
            className="w-full border-2 border-[var(--primary)] bg-transparent px-4 py-3 text-[var(--fg)] outline-none [&>option]:bg-[#1A2332]"
          >
            {STYLISTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">Date</span>
          <input
            type="date"
            min={todayIso}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full border-2 bg-transparent px-4 py-3 text-[var(--fg)] outline-none transition-colors ${error ? 'border-[var(--accent)]' : 'border-[var(--primary)]'}`}
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">Time</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`w-full border-2 bg-transparent px-4 py-3 text-[var(--fg)] outline-none transition-colors ${error ? 'border-[var(--accent)]' : 'border-[var(--primary)]'}`}
          />
        </label>
      </div>
      {error && <p className="font-mono-head mt-4 text-xs uppercase tracking-wide text-[var(--accent)]">{error}</p>}
      {success && <p className="font-mono-head mt-4 text-xs uppercase tracking-wide text-[var(--primary)]">Slot confirmed. Check the table below.</p>}
      <button
        type="submit"
        disabled={submitting}
        className="font-mono-head group relative mt-6 flex items-center justify-center border-2 border-[var(--primary)] px-7 py-3 text-sm uppercase tracking-widest text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[#05080b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="absolute left-0 top-0 h-full w-1 -translate-x-1 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
        {submitting ? 'Reserving…' : 'Reserve Slot'}
      </button>
    </form>
  );
}
