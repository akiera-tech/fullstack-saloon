import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface DbShape {
  users: User[];
  bookings: Booking[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial: DbShape = { users: [], bookings: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function readDb(): DbShape {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as DbShape;
}

function writeDb(data: DbShape): void {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getUserByEmail(email: string): User | undefined {
  const db = readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  const db = readDb();
  return db.users.find((u) => u.id === id);
}

export function createUser(user: User): void {
  const db = readDb();
  db.users.push(user);
  writeDb(db);
}

export function getBookingsByUser(userId: string): Booking[] {
  const db = readDb();
  return db.bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function createBooking(booking: Booking): void {
  const db = readDb();
  db.bookings.push(booking);
  writeDb(db);
}

export function cancelBooking(id: string, userId: string): boolean {
  const db = readDb();
  const b = db.bookings.find((x) => x.id === id && x.userId === userId);
  if (!b) return false;
  b.status = 'cancelled';
  writeDb(db);
  return true;
}
