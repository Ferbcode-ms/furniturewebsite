import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Category, HierarchicalCategory } from "@/types";

export async function GET() {
  try {
    const db = await getDb();
    const cats = (await db
      .collection("categories")
      .find({})
      .project({ name: 1, parentId: 1, isSubCategory: 1, _id: 1 })
      .sort({ name: 1 })
      .toArray()) as Category[];

    // Return both flat list and hierarchical structure
    const flatCategories = cats.map((c: Category) => c.name).filter(Boolean);

    // Create hierarchical structure
    const mainCategories = cats.filter((c: Category) => !c.parentId);
    const subCategories = cats.filter((c: Category) => c.parentId);

    const hierarchicalCategories: HierarchicalCategory[] = mainCategories.map(
      (main: Category) => ({
        name: main.name,
        subCategories: subCategories
          .filter((sub: Category) => sub.parentId === main._id.toString())
          .map((sub: Category) => sub.name),
      })
    );

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
  } catch {
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
