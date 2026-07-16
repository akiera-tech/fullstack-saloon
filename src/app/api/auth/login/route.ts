import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if !body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  const user = getUserByEmail(body.email);
  if (!user || !verifyPassword(body.password, user.salt, user.passwordHash)) {
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
