import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { toObjectId } from "@/lib/dbUtils";

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
  const { name, description, image, parentId } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  const db = await getDb();

  // Check if category exists (considering parent relationship)
  const exists = await db.collection("categories").findOne({
    name,
    parentId: parentId || null,
  });
  if (exists)
    return NextResponse.json({ error: "Category exists" }, { status: 409 });

  // If parentId is provided, verify parent exists
  if (parentId) {
    const parentObjectId = toObjectId(parentId);
    if (!parentObjectId) {
      return NextResponse.json(
        { error: "Invalid parent category ID" },
        { status: 400 }
      );
    }
    const parent = await db
      .collection("categories")
      .findOne({ _id: parentObjectId });
    if (!parent)
      return NextResponse.json(
        { error: "Parent category not found" },
        { status: 400 }
      );
  }

  const res = await db.collection("categories").insertOne({
    name,
    description: description || "",
    image: image || "",
    parentId: parentId || null,
    isSubCategory: !!parentId,
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true, id: res.insertedId }, { status: 201 });
}
