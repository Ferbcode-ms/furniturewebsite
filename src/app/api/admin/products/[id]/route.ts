import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { toObjectId } from "@/lib/dbUtils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const _id = toObjectId(params.id);
  if (!_id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const db = await getDb();
  const doc = await db.collection("products").findOne({ _id });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const _id = toObjectId(params.id);
  if (!_id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const body = await req.json();
  const db = await getDb();
  await db.collection("products").updateOne({ _id }, { $set: { ...body } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const _id = toObjectId(params.id);
  if (!_id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const db = await getDb();
  await db.collection("products").deleteOne({ _id });
  return NextResponse.json({ ok: true });
}
