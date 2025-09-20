import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { productsQuerySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);

    // Validate query parameters
    const queryParams = {
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
    };

    const validatedParams = productsQuerySchema.parse(queryParams);

    const query: any = {};
    if (validatedParams.category && validatedParams.category !== "All") {
      query.category = validatedParams.category;
    }
    if (validatedParams.tag) {
      query.tags = validatedParams.tag;
    }
    const products = await db
      .collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .project({
        name: 1,
        price: 1,
        image: 1,
        category: 1,
        tags: 1,
        createdAt: 1,
      })
      .toArray();
    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (e) {
    if (e instanceof Error && e.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid query parameters", details: e.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
