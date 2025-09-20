"use client";

import Container from "@/components/ui/Container";
import ProductCard from "@/components/ProductCard";
import CategoryDropdown from "@/components/CategoryDropdown";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import SimpleLoader from "@/components/SimpleLoader";
import { Search, Filter, Grid, List } from "lucide-react";
// Metadata moved to layout.tsx for client components

export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("category") ?? "All";
  const [selected, setSelected] = useState<string>(initial);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest");

  useEffect(() => {
    const current = params.get("category") ?? "All";
    setSelected(current);
  }, [params]);

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState<any[]>(
    []
  );
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(["All", ...(data.categories || [])]);
        setHierarchicalCategories(data.hierarchical || []);
      } catch {
      } finally {
        setLoadingCats(false);
      }
    }
    loadCats();
  }, []);

  // Load all products once and filter client-side for better performance
  useEffect(() => {
    async function loadProducts() {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selected !== "All") {
      filtered = filtered.filter((product) => {
        // Check if the selected category is a main category
        const mainCategory = hierarchicalCategories.find(
          (cat) => cat.name === selected
        );

        if (
          mainCategory &&
          mainCategory.subCategories &&
          mainCategory.subCategories.length > 0
        ) {
          // If it's a main category with subcategories, include products from main category AND all subcategories
          const subCategoryNames = mainCategory.subCategories;
          return (
            product.category === selected ||
            subCategoryNames.includes(product.category)
          );
        } else {
          // If it's a subcategory or main category without subcategories, match exactly
          return product.category === selected;
        }
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "newest":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return filtered;
  }, [allProducts, selected, searchQuery, sortBy, hierarchicalCategories]);

  const handleSelect = useCallback((next: string) => {
    setSelected(next);
    // Update URL without page reload for better UX
    const url =
      next === "All"
        ? "/products"
        : `/products?category=${encodeURIComponent(next)}`;
    window.history.pushState({}, "", url);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((sort: "name" | "price" | "newest") => {
    setSortBy(sort);
  }, []);

  if (loadingCats && loadingProducts) {
    return <SimpleLoader />;
  }

  return (
    <Container className="py-6 lg:py-10">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
          Products
        </h1>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">
          {selected === "All"
            ? "Browse all our products"
            : (() => {
                const mainCategory = hierarchicalCategories.find(
                  (cat) => cat.name === selected
                );
                if (
                  mainCategory &&
                  mainCategory.subCategories &&
                  mainCategory.subCategories.length > 0
                ) {
                  return `Products in ${selected} and related subcategories`;
                }
                return `Products in ${selected} category`;
              })()}
        </p>

        {/* Mobile-First Search and Filter Controls */}
        <div className="mt-4 lg:mt-6 space-y-4">
          {/* Search Bar - Full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base"
            />
          </div>

          {/* Controls Row - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {/* Sort Dropdown */}
            <div className="flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value as "name" | "price" | "newest"
                  )
                }
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price Low-High</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden self-start sm:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {loadingProducts
              ? "Loading products..."
              : `${filteredProducts.length} product${
                  filteredProducts.length !== 1 ? "s" : ""
                } found`}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Mobile Category Dropdown - Top on mobile only */}
        <div className="w-full lg:hidden">
          <CategoryDropdown
            categories={hierarchicalCategories}
            selectedCategory={selected}
            onCategorySelect={handleSelect}
            loading={loadingCats}
          />
        </div>

        {/* Desktop Sidebar - Categories */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <div className="sticky top-24">
            <CategoryDropdown
              categories={hierarchicalCategories}
              selectedCategory={selected}
              onCategorySelect={handleSelect}
              loading={loadingCats}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Products Display */}
          {loadingProducts ? (
            <ProductGridSkeleton count={6} viewMode={viewMode} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredProducts.map((p: any) => (
                <ProductCard
                  key={p._id || p.id}
                  id={String(p._id || p.id)}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {filteredProducts.map((p: any) => (
                <div
                  key={p._id || p.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-full sm:w-20 h-32 sm:h-20 flex-shrink-0">
                    <img
                      src={p.image || "/placeholder.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {p.description || "No description available"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Category: {p.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:text-right gap-3 sm:gap-0">
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      ${p.price?.toFixed(2) || "0.00"}
                    </p>
                    <button
                      onClick={() => router.push(`/products/${p._id || p.id}`)}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loadingProducts && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery.trim()
                    ? `No products match "${searchQuery}". Try adjusting your search or filters.`
                    : "No products available in this category. Try selecting a different category or browse all products."}
                </p>
                {(searchQuery.trim() || selected !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      handleSelect("All");
                    }}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
