import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const cats = await db
    .collection("categories")
    .find({})
    .project({ name: 1 })
    .toArray();
  const categories = cats.map((c: any) => c.name).filter(Boolean);
  return NextResponse.json({ categories });
}
