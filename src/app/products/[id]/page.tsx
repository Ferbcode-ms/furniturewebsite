"use client";
import { type ProductWithCategory, type Product } from "@/data/products";
import Container from "@/components/ui/Container";
import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type DetailProduct = ProductWithCategory | Product;

async function getProductById(id: string): Promise<DetailProduct | undefined> {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (res.ok) return await res.json();
  } catch {}
  return undefined;
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dispatch } = useCart();
  const [product, setProduct] = useState<DetailProduct | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<DetailProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const p = await getProductById(id);
      if (!cancelled) {
        setProduct(p);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Load related products once we know the product (or id/category)
  useEffect(() => {
    async function loadRelated() {
      try {
        if (!product) {
          setRelated([]);
          return;
        }
        const category = (product as any).category as string | undefined;
        const qs = category ? `?category=${encodeURIComponent(category)}` : "";
        const res = await fetch(`/api/products${qs}`);
        const data = await res.json();
        const items: DetailProduct[] = (data.products || []).filter(
          (p: any) => p._id !== id && p.id !== id
        );
        setRelated(items.slice(0, 4));
      } catch {
        setRelated([]);
      }
    }
    loadRelated();
  }, [id, product]);

  if (loading) {
    return (
      <Container className="pt-10">
        <p className="text-sm text-neutral-600">Loading...</p>
      </Container>
    );
  }
  if (!product) {
    return (
      <Container className="pt-10">
        <p className="text-sm text-neutral-600">Product not found.</p>
        <Link href="/products" className="underline">
          Back to products
        </Link>
      </Container>
    );
  }

  const { name, price, image } = product as DetailProduct;

  return (
    <Container className="pt-10">
      <nav className="text-sm text-neutral-600">
        <Link href="/products" className="hover:underline cursor-pointer">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{name}</span>
      </nav>

      <div className="mt-6 grid md:grid-cols-2 gap-8 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="group rounded-xl overflow-hidden bg-white border border-neutral-200">
          <img
            src={image}
            alt={name}
            className="w-full h-[340px] sm:h-[480px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] cursor-zoom-in"
          />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {name}
          </h1>
          <p className="mt-2 text-lg">${price}</p>
          {"category" in (product as any) && (
            <p className="mt-1 text-xs text-neutral-600">
              {(product as any).category}
            </p>
          )}

          <div className="mt-4 h-px bg-neutral-200" />

          {((product as any).description ||
            (product as any).materials ||
            (product as any).dimensions) && (
            <div className="mt-6 space-y-6">
              {(product as any).description && (
                <p className="text-sm text-neutral-700 max-w-prose whitespace-pre-line">
                  {(product as any).description}
                </p>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                  Product details
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {(product as any).dimensions && (
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-500 min-w-24">
                        Dimensions
                      </span>
                      <span className="text-neutral-800">
                        {(product as any).dimensions}
                      </span>
                    </div>
                  )}
                  {(product as any).materials && (
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-500 min-w-24">
                        Materials
                      </span>
                      <span className="text-neutral-800">
                        {(product as any).materials}
                      </span>
                    </div>
                  )}
                  {(product as any).weight && (
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-500 min-w-24">Weight</span>
                      <span className="text-neutral-800">
                        {(product as any).weight}
                      </span>
                    </div>
                  )}
                  {(product as any).warranty && (
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-500 min-w-24">
                        Warranty
                      </span>
                      <span className="text-neutral-800">
                        {(product as any).warranty}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(product as any).features && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                    Key features
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-neutral-800 space-y-1">
                    {String((product as any).features)
                      .split(/\r?\n/)
                      .map((line: string, idx: number) => (
                        <li key={idx}>{line}</li>
                      ))}
                  </ul>
                </div>
              )}

              {(product as any).careInstructions && (
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                    Care instructions
                  </h3>
                  <p className="text-sm text-neutral-700 whitespace-pre-line">
                    {(product as any).careInstructions}
                  </p>
                </div>
              )}

              {(product as any).specifications && (
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                    Specifications
                  </h3>
                  <p className="text-sm text-neutral-700 whitespace-pre-line">
                    {(product as any).specifications}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              className="rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:opacity-90 cursor-pointer"
              onClick={() =>
                dispatch({ type: "ADD", payload: { id, name, price, image } })
              }
            >
              Add to Cart
            </button>
            <Link
              href="/products"
              className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-black hover:text-white hover:border-black cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Free shipping on orders over $250. 30-day returns.
          </p>
        </div>
      </div>
      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight">
          You may also like
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Products from the same category
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((rp: any) => (
            <ProductCard
              key={rp._id || rp.id}
              id={String(rp._id || rp.id)}
              name={rp.name}
              price={rp.price}
              image={rp.image}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
