import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Product } from "@/types";
import { productsQuerySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);

    // Validate query parameters
    const queryParams = {
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      q: searchParams.get("q") || undefined,
      sort:
        (searchParams.get("sort") as "name" | "price" | "newest") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const validatedParams = productsQuerySchema.parse(queryParams);

    const query: Record<string, unknown> = {};
    if (validatedParams.category && validatedParams.category !== "All") {
      // Expand parent category to include its child categories (by name)
      try {
        const catsCol = db.collection("categories");
        const cat = await catsCol.findOne({ name: validatedParams.category });
        if (cat) {
          if (!cat.parentId) {
            // Parent category: include itself + all children names
            const children = await catsCol
              .find({ parentId: String(cat._id) })
              .project({ name: 1 })
              .toArray();
            const names = [
              validatedParams.category,
              ...children
                .map((c: { name?: string }) => c.name || "")
                .filter((n: string) => n.length > 0),
            ];
            query.category = { $in: names };
          } else {
            // Subcategory selected: filter strictly to this subcategory
            query.category = validatedParams.category;
          }
        } else {
          // Fallback to strict match if category not found in DB
          query.category = validatedParams.category;
        }
      } catch {
        // On DB error, fallback to strict match
        query.category = validatedParams.category;
      }
    }
    if (validatedParams.tag) {
      query.tags = validatedParams.tag;
    }
    if (validatedParams.q) {
      const regex = new RegExp(validatedParams.q, "i");
      query.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    const page = validatedParams.page || 1;
    const limit = validatedParams.limit || 8;
    const skip = (page - 1) * limit;

    let sortBy: Record<string, 1 | -1> = { createdAt: -1 };
    switch (validatedParams.sort) {
      case "name":
        sortBy = { name: 1 };
        break;
      case "price":
        sortBy = { price: 1 };
        break;
      case "newest":
      default:
        sortBy = { createdAt: -1 };
        break;
    }

    const collection = db.collection("products");
    const total = await collection.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const products = (await collection
      .find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .project({
        name: 1,
        price: 1,
        image: 1,
        category: 1,
        tags: 1,
        createdAt: 1,
      })
      .toArray()) as Product[];

    return NextResponse.json(
      { products, page, limit, total, totalPages },
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
