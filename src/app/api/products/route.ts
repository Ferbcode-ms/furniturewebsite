import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const query: any = {};
  if (category && category !== "All") query.category = category;
  if (tag) query.tags = tag;
  const products = await db
    .collection("products")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ products });
}
