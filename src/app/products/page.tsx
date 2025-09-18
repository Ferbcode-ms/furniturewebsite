"use client";

import Container from "@/components/ui/Container";
import ProductCard from "@/components/ProductCard";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("category") ?? "All";
  const [selected, setSelected] = useState<string>(initial);

  useEffect(() => {
    const current = params.get("category") ?? "All";
    setSelected(current);
  }, [params]);

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [list, setList] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(["All", ...(data.categories || [])]);
      } catch {
      } finally {
        setLoadingCats(false);
      }
    }
    loadCats();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoadingProducts(true);
      const qs =
        selected && selected !== "All"
          ? `?category=${encodeURIComponent(selected)}`
          : "";
      const res = await fetch(`/api/products${qs}`);
      const data = await res.json();
      setList(data.products || []);
      setLoadingProducts(false);
    }
    loadProducts();
  }, [selected]);

  function handleSelect(next: string) {
    setSelected(next);
    const url =
      next === "All"
        ? "/products"
        : `/products?category=${encodeURIComponent(next)}`;
    router.push(url);
  }

  return (
    <Container className="py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          {loadingCats && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </>
          )}
          {!loadingCats &&
            categories.map((c) => (
              <button
                key={c}
                className={`px-4 py-2 rounded-full border text-sm ${
                  selected === c
                    ? "bg-black text-white border-black"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelect(c)}
              >
                {c}
              </button>
            ))}
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loadingProducts &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        {!loadingProducts &&
          list.map((p: any) => (
            <ProductCard
              key={p._id || p.id}
              id={String(p._id || p.id)}
              name={p.name}
              price={p.price}
              image={p.image}
            />
          ))}
        {!loadingProducts && list.length === 0 && (
          <p className="text-sm text-neutral-600">No products found.</p>
        )}
      </div>
    </Container>
  );
}
