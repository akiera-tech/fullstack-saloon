import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSessionUser } from '@/lib/auth';
import { createBooking, getBookingsByUser } from '@/lib/db';

const SERVICES = ['Signature Fade', 'Classic Hot-Towel Shave', 'Beard Sculpt', 'Full Restyle'];
const STYLISTS = ['Marcus Webb', 'Priya Anand', 'Jonah Reyes', 'Sofia Marchetti'];

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'You need to sign in to view bookings.' }, { status: 401 });
  const bookings = getBookingsByUser(user.id);
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'You need to sign in to book a chair.' }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.service !== 'string' || typeof body.stylist !== 'string' || typeof body.date !== 'string' || typeof body.time !== 'string') {
    return NextResponse.json({ error: 'Service, stylist, date, and time are required.' }, { status: 400 });
  }
  if (!SERVICES.includes(body.service)) {
    return NextResponse.json({ error: 'Choose a valid service from the list.' }, { status: 400 });
  }
  if (!STYLISTS.includes(body.stylist)) {
    return NextResponse.json({ error: 'Choose a valid stylist from the list.' }, { status: 400 });
  }
  const chosenDate = new Date(`${body.date}T${body.time}`);
  if (Number.isNaN(chosenDate.getTime()) || chosenDate.getTime() < Date.now() - 60000) {
    return NextResponse.json({ error: 'Pick a date and time in the future.' }, { status: 400 });
  }
  const booking = {
    id: crypto.randomUUID(),
    userId: user.id,
    service: body.service,
    stylist: body.stylist,
    date: body.date,
    time: body.time,
    status: 'confirmed' as const,
    createdAt: new Date().toISOString(),
  };
  createBooking(booking);
  return NextResponse.json({ booking }, { status: 201 });
}
