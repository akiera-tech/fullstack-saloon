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

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

interface DbShape {
  users: User[];
  bookings: Booking[];
  services: Service[];
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'haircut',
    name: 'Haircut',
    description: 'Classic haircut with wash and style.',
    price: 35,
    durationMinutes: 30,
  },
  {
    id: 'beard-trim',
    name: 'Beard Trim',
    description: 'Precision beard shaping and trim.',
    price: 20,
    durationMinutes: 15,
  },
  {
    id: 'color',
    name: 'Hair Color',
    description: 'Full color treatment.',
    price: 80,
    durationMinutes: 90,
  },
];

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial: DbShape = { users: [], bookings: [], services: DEFAULT_SERVICES };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

export function readDb(): DbShape {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  const db = JSON.parse(raw) as DbShape;

  // Backfill services for existing db.json files created before this field existed
  if (!db.services) {
    db.services = DEFAULT_SERVICES;
    writeDb(db);
  }

  return db;
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
