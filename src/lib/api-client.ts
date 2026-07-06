export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "client" | "owner";
  createdAt: string;
}

export interface ApiService {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
}

export interface ApiBooking {
  id: string;
  userId: string;
  serviceId: string;
  stylist: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data === "object" && data && "error" in data ? String((data as { error: string }).error) : "Something went wrong.";
    throw new Error(message);
  }
  return data as T;
}

export function fetchMe(): Promise<{ user: ApiUser | null }> {
  return request("/api/auth/me");
}

export function login(email: string, password: string): Promise<{ user: ApiUser }> {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function register(name: string, email: string, password: string): Promise<{ user: ApiUser }> {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}

export function logout(): Promise<{ ok: boolean }> {
  return request("/api/auth/logout", { method: "POST" });
}

export function fetchServices(): Promise<{ services: ApiService[] }> {
  return request("/api/services");
}

export function fetchBookings(): Promise<{ bookings: ApiBooking[] }> {
  return request("/api/bookings");
}

export function createBooking(payload: {
  serviceId: string;
  stylist: string;
  date: string;
  time: string;
}): Promise<{ booking: ApiBooking }> {
  return request("/api/bookings", { method: "POST", body: JSON.stringify(payload) });
}

export function cancelBooking(id: string): Promise<{ booking: ApiBooking }> {
  return request(`/api/bookings/${id}`, { method: "DELETE" });
}
