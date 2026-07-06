'use client'

interface Booking {
  id: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface ApiBooking {
  id: string;
  serviceId: string;
  stylist: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Service {
  id: string;
  name: string;
}

type BookingRecord = Booking | ApiBooking;

interface BookingsTableProps {
  bookings: BookingRecord[];
  services?: Service[];
  onCancel?: (id: string) => void;
}

function getServiceName(booking: BookingRecord, services?: Service[]) {
  if ('service' in booking) return booking.service;
  return services?.find((service) => service.id === booking.serviceId)?.name ?? booking.serviceId;
}

const STATUS_COLOR: Record<Booking['status'], string> = {
  confirmed: 'text-[var(--primary)]',
  pending: 'text-[var(--accent)]',
  cancelled: 'text-[var(--muted-fg)]',
};

export default function BookingsTable({ bookings, services, onCancel }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <p className="font-mono-head text-xs uppercase tracking-widest text-[var(--muted-fg)]">No records</p>
        <p className="mt-3 font-light text-[var(--muted-fg)]">Your ledger is empty. Reserve a slot above to fill it.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
            <th className="font-mono-head px-5 py-3 text-xs uppercase tracking-widest text-[var(--muted-fg)]">#</th>
            <th className="font-mono-head px-5 py-3 text-xs uppercase tracking-widest text-[var(--muted-fg)]">Service</th>
            <th className="font-mono-head hidden px-5 py-3 text-xs uppercase tracking-widest text-[var(--muted-fg)] sm:table-cell">Stylist</th>
            <th className="font-mono-head px-5 py-3 text-xs uppercase tracking-widest text-[var(--muted-fg)]">When</th>
            <th className="font-mono-head px-5 py-3 text-xs uppercase tracking-widest text-[var(--muted-fg)]">Status</th>
            <th className="font-mono-head px-5 py-3 text-xs uppercase tracking-widest text-[var(--muted-fg)]"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr
              key={b.id}
              className={i % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[color-mix(in_oklch,var(--surface)_92%,white)]'}
            >
              <td className="font-mono-head px-5 py-4 text-sm text-[var(--fg)]/60">{String(i + 1).padStart(2, '0')}</td>
              <td className="px-5 py-4 font-light text-[var(--fg)]">{getServiceName(b, services)}</td>
              <td className="hidden px-5 py-4 font-light text-[var(--fg)] sm:table-cell">{b.stylist}</td>
              <td className="px-5 py-4 font-light text-[var(--fg)]">{b.date} · {b.time}</td>
              <td className={`font-mono-head px-5 py-4 text-xs uppercase tracking-wide ${STATUS_COLOR[b.status]}`}>{b.status}</td>
              <td className="px-5 py-4">
                {b.status !== 'cancelled' && onCancel && (
                  <button
                    onClick={() => onCancel(b.id)}
                    className="font-mono-head border-2 border-[var(--border)] px-3 py-1.5 text-xs uppercase tracking-widest text-[var(--muted-fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
