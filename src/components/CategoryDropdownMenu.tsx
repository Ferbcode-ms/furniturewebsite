"use client";

import { memo } from "react";
import { ChevronDown } from "lucide-react";
// Replace shadcn dropdown with simple button + list
import { HierarchicalCategory } from "@/types";

interface CategoryDropdownMenuProps {
  categories: HierarchicalCategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  loading?: boolean;
}

const CategoryDropdownMenu = memo(function CategoryDropdownMenu({
  categories,
  selectedCategory,
  onCategorySelect,
  loading = false,
}: CategoryDropdownMenuProps) {
  const selectedLabel = selectedCategory || "All";

  return (
    <div className="relative">
      <details className="w-full">
        <summary className="list-none cursor-pointer w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm">
          <span className="truncate">
            {selectedLabel === "All" ? "All Products" : selectedLabel}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </summary>
        <div className="mt-2 w-64 rounded-md border bg-white shadow p-1">
          <div className="px-2 py-1.5 text-sm font-semibold">Categories</div>
          <div className="-mx-1 my-1 h-px bg-neutral-200" />
          <button
            type="button"
            onClick={() => onCategorySelect("All")}
            className={`w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-neutral-100 ${
              selectedCategory === "All" ? "bg-neutral-100" : ""
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => {
            const hasSubs = !!cat.subCategories && cat.subCategories.length > 0;
            if (!hasSubs) {
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => onCategorySelect(cat.name)}
                  className={`w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-neutral-100 ${
                    selectedCategory === cat.name ? "bg-neutral-100" : ""
                  }`}
                >
                  {cat.name}
                </button>
              );
            }
            return (
              <div key={cat.name} className="">
                <div
                  className={`px-2 py-1.5 text-sm font-medium ${
                    selectedCategory === cat.name
                      ? "bg-neutral-100 rounded-sm"
                      : ""
                  }`}
                >
                  {cat.name}
                </div>
                <div className="pl-2">
                  <button
                    type="button"
                    onClick={() => onCategorySelect(cat.name)}
                    className={`w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-neutral-100 ${
                      selectedCategory === cat.name ? "bg-neutral-100" : ""
                    }`}
                  >
                    All {cat.name}
                  </button>
                  {cat.subCategories?.map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => onCategorySelect(sub)}
                      className={`w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-neutral-100 ${
                        selectedCategory === sub ? "bg-neutral-100" : ""
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
});

export default CategoryDropdownMenu;
