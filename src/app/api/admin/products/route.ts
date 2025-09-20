import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { productCreateSchema } from "@/lib/validations";

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
  try {
    const body = await req.json();

    // Validate input with Zod
    const validatedData = productCreateSchema.parse(body);

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
    } = validatedData;

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
  } catch (e) {
    if (e instanceof Error && e.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: e.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
