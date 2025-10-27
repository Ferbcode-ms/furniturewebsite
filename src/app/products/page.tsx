"use client";

import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SimpleLoader from "@/components/SimpleLoader";
import { Search } from "lucide-react";
import { Product, HierarchicalCategory } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";

// Metadata moved to layout.tsx for client components

// Import Select components from shadcn/ui

export default function ProductsPage() {
  const params = useSearchParams();
  const initial = params.get("category") ?? "All";
  const [selected, setSelected] = useState<string>(initial);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "newest">("newest");

  useEffect(() => {
    const current = params.get("category") ?? "All";
    setSelected(current);
  }, [params]);

  const [hierarchicalCategories, setHierarchicalCategories] = useState<
    HierarchicalCategory[]
  >([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12;

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/categories");
        const data: { hierarchical: HierarchicalCategory[] } = await res.json();
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
        const data: { products: Product[] } = await res.json();
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selected, searchQuery, sortBy]);

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
    <Container className="py-6 lg:py-10 sm:p-20 p-5 mt-10">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mb-12 mb-6"
      >
        <h1 className=" tracking-wide leading-[1.2]  text-[40px] sm:text-[56px] md:text-[64px] lg:text-[80px]">
          {selected === "All" ? "COLLECTION" : selected.toUpperCase()}
        </h1>
        <p className="mt-4 text-neutral-600 text-[12px] sm:text-base max-w-2xl">
          {selected === "All"
            ? "Discover our carefully curated collection of premium furniture pieces."
            : (hierarchicalCategories.find((cat) => cat.name === selected)
                ?.subCategories?.length ?? 0) > 0
            ? `Explore our ${selected.toLowerCase()} collection and its subcategories, designed for modern living.`
            : `Explore our ${selected.toLowerCase()} collection, designed for modern living.`}
        </p>
      </motion.div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search furniture..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background rounded-4xl focus:outline-none border-1 border-[var(--textcolor)] text-[var(--textcolor)]"
          />
        </div>

        <div className="relative min-w-[200px]">
          <select
            value={sortBy}
            onChange={(e) =>
              handleSortChange(e.target.value as "name" | "price" | "newest")
            }
            className="w-full px-6 py-3 border-1 border-[var(--textcolor)] rounded-4xl focus:outline-none bg-background appearance-none cursor-pointer"
          >
            <option value="newest">NEWEST FIRST</option>
            <option value="price">PRICE: LOW TO HIGH</option>
            <option value="name">NAME: A TO Z</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="mb-8">
        {/* Main Categories */}
        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-2">
            <button
              onClick={() => handleSelect("All")}
              className={`sm:px-6 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors border-1 border-[var(--textcolor)] cursor-pointer ${
                selected === "All"
                  ? "bg-[var(--textcolor)] text-background"
                  : "bg-background "
              }`}
            >
              ALL
            </button>
            {hierarchicalCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className={`sm:px-6 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors  border-1 border-[var(--textcolor)] cursor-pointer ${
                  selected === cat.name
                    ? "bg-[var(--textcolor)] text-background"
                    : "bg-background"
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories - Show when a main category with subcategories is selected or when a subcategory is selected */}
        <AnimatePresence>
          {selected !== "All" &&
            (() => {
              // Find the main category that contains the selected category (either main or sub)
              const mainCategory = hierarchicalCategories.find(
                (cat) =>
                  cat.name === selected ||
                  (cat.subCategories && cat.subCategories.includes(selected))
              );
              return (mainCategory?.subCategories?.length ?? 0) > 0;
            })() && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-x-auto"
              >
                <div className="flex gap-2 pb-2">
                  <span className="text-sm text-neutral-500 px-2 py-2 whitespace-nowrap">
                    Subcategories:
                  </span>
                  {(() => {
                    // Find the main category that contains the selected category
                    const mainCategory = hierarchicalCategories.find(
                      (cat) =>
                        cat.name === selected ||
                        (cat.subCategories &&
                          cat.subCategories.includes(selected))
                    );
                    return mainCategory?.subCategories?.map((subCat) => (
                      <button
                        key={subCat}
                        onClick={() => handleSelect(subCat)}
                        className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors border-1 border-neutral-300 cursor-pointer ${
                          selected === subCat
                            ? "bg-neutral-800 text-white border-neutral-800"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        {subCat.toUpperCase()}
                      </button>
                    ));
                  })()}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Products Grid with Animation */}
      {loadingProducts ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {paginatedProducts.map((p: Product, i) => (
            <motion.div
              key={p._id || p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard
                id={String(p._id || p.id)}
                name={p.name}
                price={p.price}
                image={p.image}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Enhanced Empty State */}
      {!loadingProducts && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto text-[var(--textcolor)]">
            <Search className="h-12 w-12 mx-auto mb-6 " />
            <h3 className="text-2xl font-bold mb-4">No products found</h3>
            <p className="text-neutral-600 mb-8">
              {searchQuery.trim()
                ? `We couldn't find any products matching "${searchQuery}"`
                : "No products available in this category yet."}
            </p>
            {(searchQuery.trim() || selected !== "All") && (
              <AnimatedButton
                label="VIEW ALL PRODUCTS"
                onClick={() => {
                  setSearchQuery("");
                  handleSelect("All");
                }}
                variant="solid"
                className="border-1 p-2"
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Results Count and Pagination */}
      {!loadingProducts && filteredProducts.length > 0 && (
        <>
          <div className="mt-8 text-center text-sm text-neutral-500">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full border-1 border-[var(--textcolor)] transition-colors ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[var(--textcolor)] hover:text-background cursor-pointer"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-full border-1 border-[var(--textcolor)] transition-colors min-w-[40px] ${
                            currentPage === page
                              ? "bg-[var(--textcolor)] text-background"
                              : "hover:bg-[var(--textcolor)] hover:text-background cursor-pointer"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full border-1 border-[var(--textcolor)] transition-colors ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[var(--textcolor)] hover:text-background cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
