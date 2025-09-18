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
  const doc = await db.collection("categories").findOne({ _id });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const _id = toObjectId(params.id);
  if (!_id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const { name, description } = await req.json();
  const db = await getDb();

  // Find existing category to detect rename
  const existing = await db.collection("categories").findOne({ _id });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // If changing name, prevent duplicate names
  if (name && name !== existing.name) {
    const dup = await db.collection("categories").findOne({ name });
    if (dup) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }
  }

  // Update category document
  await db
    .collection("categories")
    .updateOne({ _id }, { $set: { name, description } });

  // Cascade rename in products where category is stored as string
  if (name && name !== existing.name) {
    await db
      .collection("products")
      .updateMany({ category: existing.name }, { $set: { category: name } });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const _id = toObjectId(params.id);
  if (!_id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const db = await getDb();
  await db.collection("categories").deleteOne({ _id });
  return NextResponse.json({ ok: true });
}
