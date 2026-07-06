import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createUser, getUserByEmail } from '@/lib/db';
import { generateSalt, hashPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'name, email, and password are required.' }, { status: 400 });
  }
  const { name, email, password } = body;
  if (name.trim().length < 2) {
    return NextResponse.json({ error: 'Name needs at least 2 characters.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password needs at least 8 characters.' }, { status: 400 });
  }
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }
  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };
  createUser(user);
  await createSession(user.id);
  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
}
