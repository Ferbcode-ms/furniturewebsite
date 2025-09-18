import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const cats = await db
    .collection("categories")
    .find({})
    .sort({ name: 1 })
    .toArray();
  return NextResponse.json({ categories: cats });
}

export async function POST(req: NextRequest) {
  const { name, description } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  const db = await getDb();
  const exists = await db.collection("categories").findOne({ name });
  if (exists)
    return NextResponse.json({ error: "Category exists" }, { status: 409 });
  const res = await db
    .collection("categories")
    .insertOne({ name, description: description || "", createdAt: new Date() });
  return NextResponse.json({ ok: true, id: res.insertedId }, { status: 201 });
}
