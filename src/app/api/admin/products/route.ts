import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const products = await db
    .collection("products")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const {
    name,
    price,
    image,
    category,
    description,
    tags,
    dimensions,
    materials,
    features,
    weight,
    warranty,
    careInstructions,
    specifications,
  } = await req.json();
  if (!name || !price || !image) {
    return NextResponse.json(
      { error: "name, price, image required" },
      { status: 400 }
    );
  }
  const db = await getDb();
  const res = await db.collection("products").insertOne({
    name,
    price,
    image,
    category: category || null,
    description: description || "",
    tags: tags || [],
    dimensions: dimensions || "",
    materials: materials || "",
    features: features || "",
    weight: weight || "",
    warranty: warranty || "",
    careInstructions: careInstructions || "",
    specifications: specifications || "",
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true, id: res.insertedId }, { status: 201 });
}
