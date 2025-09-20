import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { items, totals, customer } = payload || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customer || !customer.email) {
      return NextResponse.json(
        { error: "Customer email required" },
        { status: 400 }
      );
    }
    const db = await getDb();
    const doc = {
      items,
      totals,
      customer,
      userEmail: customer.email,
      total: totals?.grandTotal ?? null,
      status: "pending",
      createdAt: new Date(),
    };
    const result = await db.collection("orders").insertOne(doc);
    return NextResponse.json(
      { ok: true, orderId: result.insertedId },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
