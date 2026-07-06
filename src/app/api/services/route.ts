import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  const db = readDb();
  return NextResponse.json({ services: db.services }, { status: 200 });
}
