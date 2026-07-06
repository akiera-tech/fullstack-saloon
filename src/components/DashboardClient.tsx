'use client'

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe, fetchBookings, fetchServices, cancelBooking, ApiUser, ApiBooking, ApiService } from "@/lib/api-client";
import BookingForm from "@/components/BookingForm";
import BookingsTable from "@/components/BookingsTable";

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [meData, bookingsData, servicesData] = await Promise.all([
      fetchMe(),
      fetchBookings().catch(() => ({ bookings: [] as ApiBooking[] })),
      fetchServices(),
    ]);
    setUser(meData.user);
    setBookings(bookingsData.bookings);
    setServices(servicesData.services);
    setLoading(false);
    if (!meData.user) router.push("/login");
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono-op text-sm text-[var(--muted-fg)]">LOADING SESSION…</p>
      </div>
    );
  }

  if (!user) return null;

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="eyebrow font-mono-op text-[var(--primary)]">Session active</p>
      <h1 className="font-display mt-3 text-4xl text-[var(--fg)] md:text-5xl">
        Welcome back, {user.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 max-w-xl font-light text-[var(--muted-fg)]">
        You have {confirmedCount} confirmed {confirmedCount === 1 ? "booking" : "bookings"} on the ledger.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <BookingForm onBooked={refresh} />
        <div>
          <p className="font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)]">Your bookings</p>
          <div className="mt-3">
            <BookingsTable bookings={bookings} services={services} onCancel={async (id) => {
              await cancelBooking(id).catch(() => undefined);
              refresh();
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
