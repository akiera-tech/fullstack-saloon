import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { cancelBooking } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'You need to sign in to manage bookings.' }, { status: 401 });
  const { id } = await params;
  const ok = cancelBooking(id, user.id);
  if (!ok) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
