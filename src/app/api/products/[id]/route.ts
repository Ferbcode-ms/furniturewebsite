import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { toObjectId } from "@/lib/dbUtils";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = await getDb();
  // Try Mongo _id first, then legacy string id field fallback
  const _id = toObjectId(id);
  let doc = _id ? await db.collection("products").findOne({ _id }) : null;
  if (!doc) {
    doc = await db.collection("products").findOne({ id });
  }
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}
