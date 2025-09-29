"use client";

import { memo } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">
            {selectedLabel === "All" ? "All Products" : selectedLabel}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Categories</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onCategorySelect("All")}
          className={selectedCategory === "All" ? "bg-accent" : ""}
        >
          All Products
        </DropdownMenuItem>
        {categories.map((cat) => {
          const hasSubs = !!cat.subCategories && cat.subCategories.length > 0;
          if (!hasSubs) {
            return (
              <DropdownMenuItem
                key={cat.name}
                onClick={() => onCategorySelect(cat.name)}
                className={selectedCategory === cat.name ? "bg-accent" : ""}
              >
                {cat.name}
              </DropdownMenuItem>
            );
          }
          return (
            <DropdownMenuSub key={cat.name}>
              <DropdownMenuSubTrigger
                className={selectedCategory === cat.name ? "bg-accent" : ""}
              >
                {cat.name}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                <DropdownMenuItem
                  onClick={() => onCategorySelect(cat.name)}
                  className={selectedCategory === cat.name ? "bg-accent" : ""}
                >
                  All {cat.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {cat.subCategories?.map((sub) => (
                  <DropdownMenuItem
                    key={sub}
                    onClick={() => onCategorySelect(sub)}
                    className={selectedCategory === sub ? "bg-accent" : ""}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default CategoryDropdownMenu;
