import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSessionToken } from "@/lib/auth";

export async function GET() {
  const token = await getSessionToken();
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  return NextResponse.json({ orders });
}

export async function PUT(req: NextRequest) {
  const token = await getSessionToken();
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json(
      { error: "id and status required" },
      { status: 400 }
    );
  }
  const db = await getDb();
  try {
    const { toObjectId } = await import("@/lib/dbUtils");
    const _id = toObjectId(id);
    if (!_id)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    await db.collection("orders").updateOne({ _id }, { $set: { status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
