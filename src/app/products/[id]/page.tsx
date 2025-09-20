"use client";
// Removed static product types - now using dynamic API data
import Container from "@/components/ui/Container";
import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { ShoppingCart } from "lucide-react";
import SimpleLoader from "@/components/SimpleLoader";
import { Product } from "@/types";

type DetailProduct = Product;

async function getProductById(id: string): Promise<DetailProduct | undefined> {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (res.ok) return await res.json();
  } catch {}
  return undefined;
}

// Metadata generation moved to separate server component due to client component limitation

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
        const category = product?.category;
        const qs = category ? `?category=${encodeURIComponent(category)}` : "";
        const res = await fetch(`/api/products${qs}`);
        const data = await res.json();
        const items: DetailProduct[] = (data.products || []).filter(
          (p: Product) => p._id !== id && p.id !== id
        );
        setRelated(items.slice(0, 4));
      } catch {
        setRelated([]);
      }
    }
    loadRelated();
  }, [id, product]);

  if (loading) {
    return <SimpleLoader />;
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
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description:
              product?.description || `Premium ${product.name} furniture`,
            image: product.image,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: "0",
                  currency: "USD",
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  businessDays: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ],
                  },
                },
              },
            },
            brand: {
              "@type": "Brand",
              name: "Furniture Store",
            },
            category: product?.category || "Furniture",
            material: product?.materials,
            weight: product?.weight,
            additionalProperty: [
              ...(product?.dimensions
                ? [
                    {
                      "@type": "PropertyValue",
                      name: "Dimensions",
                      value: product.dimensions,
                    },
                  ]
                : []),
              ...(product?.warranty
                ? [
                    {
                      "@type": "PropertyValue",
                      name: "Warranty",
                      value: product.warranty,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
      <Container className="pt-10">
        <nav className="text-sm text-neutral-600">
          <Link href="/products" className="hover:underline cursor-pointer">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{name}</span>
        </nav>

        <div className="mt-6 grid md:grid-cols-2 gap-10 items-start">
          <div className="group rounded-2xl overflow-hidden bg-[#FAFAFA] border border-neutral-200 shadow-sm">
            <Image
              src={image}
              alt={name}
              width={600}
              height={480}
              className="w-full h-[360px] sm:h-[520px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {name}
            </h1>
            <p className="mt-2 inline-flex items-center rounded-full bg-black text-white px-4 py-2 text-sm font-semibold">
              ${price}
            </p>
            {product?.category && (
              <p className="mt-1 text-xs text-neutral-600">
                {product.category}
              </p>
            )}

            <div className="mt-5 h-px bg-neutral-200" />

            {(product?.description ||
              product?.materials ||
              product?.dimensions) && (
              <div className="mt-6 space-y-6">
                {product?.description && (
                  <p className="text-sm text-neutral-700 max-w-prose whitespace-pre-line">
                    {product.description}
                  </p>
                )}

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                    Product details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {product?.dimensions && (
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-500 min-w-24">
                          Dimensions
                        </span>
                        <span className="text-neutral-800">
                          {product.dimensions}
                        </span>
                      </div>
                    )}
                    {product?.materials && (
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-500 min-w-24">
                          Materials
                        </span>
                        <span className="text-neutral-800">
                          {product.materials}
                        </span>
                      </div>
                    )}
                    {product?.weight && (
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-500 min-w-24">
                          Weight
                        </span>
                        <span className="text-neutral-800">
                          {product.weight}
                        </span>
                      </div>
                    )}
                    {product?.warranty && (
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-500 min-w-24">
                          Warranty
                        </span>
                        <span className="text-neutral-800">
                          {product.warranty}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {product?.features && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                      Key features
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-neutral-800 space-y-1">
                      {String(product.features)
                        .split(/\r?\n/)
                        .map((line: string, idx: number) => (
                          <li key={idx}>{line}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {product?.careInstructions && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                      Care instructions
                    </h3>
                    <p className="text-sm text-neutral-700 whitespace-pre-line">
                      {product.careInstructions}
                    </p>
                  </div>
                )}

                {product?.specifications && (
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
                      Specifications
                    </h3>
                    <p className="text-sm text-neutral-700 whitespace-pre-line">
                      {product.specifications}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 cursor-pointer"
                onClick={() =>
                  dispatch({ type: "ADD", payload: { id, name, price, image } })
                }
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <Link
                href="/products"
                className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-black hover:text-white hover:border-black cursor-pointer"
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
            {related.map((rp: Product) => (
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
    </>
  );
}
