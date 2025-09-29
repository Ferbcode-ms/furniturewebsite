"use client";

import { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HierarchicalCategory } from "@/types";

interface CategoryDropdownProps {
  categories: HierarchicalCategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  loading?: boolean;
}

const CategoryDropdown = memo(function CategoryDropdown({
  categories,
  selectedCategory,
  onCategorySelect,
  loading = false,
}: CategoryDropdownProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  // Auto-expand category when it's selected and has subcategories
  const handleCategoryClick = (
    categoryName: string,
    hasSubCategories: boolean
  ) => {
    if (hasSubCategories && !expandedCategories.has(categoryName)) {
      toggleCategory(categoryName);
    }
    onCategorySelect(categoryName);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F7F4EA] rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 ml-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F7F4EA] rounded-lg border border-gray-200 p-3 lg:p-4">
      <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-gray-800">
        Categories
      </h3>

      {/* All Products Option */}
      <button
        onClick={() => onCategorySelect("All")}
        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          selectedCategory === "All"
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        All Products
      </button>

      <div className="mt-2 space-y-1 lg:space-y-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.name);
          const hasSubCategories =
            category.subCategories && category.subCategories.length > 0;

          return (
            <div key={category.name}>
              {/* Main Category */}
              <div className="flex items-center">
                <button
                  onClick={() =>
                    handleCategoryClick(category.name, hasSubCategories)
                  }
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
                {hasSubCategories && (
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                )}
              </div>

              {/* Sub Categories */}
              {hasSubCategories && isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.subCategories.map((subCategory) => (
                    <button
                      key={subCategory}
                      onClick={() => onCategorySelect(subCategory)}
                      className={`w-full text-left px-3 py-1 rounded-md text-sm transition-colors ${
                        selectedCategory === subCategory
                          ? "bg-gray-800 text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      └─ {subCategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default CategoryDropdown;
