import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const cats = await db
      .collection("categories")
      .find({})
      .project({ name: 1, parentId: 1, isSubCategory: 1, _id: 1 })
      .sort({ name: 1 })
      .toArray();

    // Return both flat list and hierarchical structure
    const flatCategories = cats.map((c: any) => c.name).filter(Boolean);

    // Create hierarchical structure
    const mainCategories = cats.filter((c: any) => !c.parentId);
    const subCategories = cats.filter((c: any) => c.parentId);

    const hierarchicalCategories = mainCategories.map((main: any) => ({
      name: main.name,
      subCategories: subCategories
        .filter((sub: any) => sub.parentId === main._id.toString())
        .map((sub: any) => sub.name),
    }));

    return NextResponse.json(
      {
        categories: flatCategories,
        hierarchical: hierarchicalCategories,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
