"use client";
// Removed static product types - now using dynamic API data
import Container from "@/components/Container";
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
      <Container className=" m-20 ">
        {/* Breadcrumb with updated styling */}
        <nav className="text-sm text-textcolor/70 uppercase tracking-wider pt-10 pl-20">
          <Link
            href="/products"
            className="hover:text-textcolor transition-colors"
          >
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-textcolor">{name}</span>
        </nav>

        <div className="mx-20 my-10 grid md:grid-cols-2 gap-16 items-start border-2 border-textcolor/10 p-10 rounded-lg bg-[var(--productcard)]">
          {/* Image container with improved styling */}
          <div className="group rounded-lg overflow-hidden bg-[var(--productcard)] relative ">
            <Image
              src={image}
              alt={name}
              width={200}
              height={280}
              className="w-full h-[480px] sm:h-[500px] object-contain mix-blend-multiply filter contrast-110 brightness-105 transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 540px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product details with updated styling */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-textcolor">
                {name}
              </h1>
              <p className="mt-4 text-2xl sm:text-3xl font-semibold text-textcolor">
                ${price}
              </p>
              {product?.category && (
                <p className="mt-2 text-sm uppercase tracking-wider text-textcolor/70">
                  {product.category}
                </p>
              )}
            </div>

            <div className="h-px bg-textcolor/10" />

            {/* Product details section */}
            <div className="space-y-8">
              {product?.description && (
                <p className="text-base text-textcolor/80 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Specifications grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-textcolor uppercase tracking-wide">
                  Product Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {product?.dimensions && (
                    <div className="space-y-2">
                      <span className="text-sm uppercase tracking-wider text-textcolor/70">
                        Dimensions
                      </span>
                      <p className="text-textcolor">{product.dimensions}</p>
                    </div>
                  )}
                  {product?.materials && (
                    <div className="space-y-2">
                      <span className="text-sm uppercase tracking-wider text-textcolor/70">
                        Materials
                      </span>
                      <p className="text-textcolor">{product.materials}</p>
                    </div>
                  )}
                  {product?.weight && (
                    <div className="space-y-2">
                      <span className="text-sm uppercase tracking-wider text-textcolor/70">
                        Weight
                      </span>
                      <p className="text-textcolor">{product.weight}</p>
                    </div>
                  )}
                  {product?.warranty && (
                    <div className="space-y-2">
                      <span className="text-sm uppercase tracking-wider text-textcolor/70">
                        Warranty
                      </span>
                      <p className="text-textcolor">{product.warranty}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  className="flex-1 text-textcolor border-1 rounded-full border-amber-950 px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300 hover:bg-textcolor/90"
                  onClick={() =>
                    dispatch({
                      type: "ADD",
                      payload: { id, name, price, image },
                    })
                  }
                >
                  <span className="flex items-center justify-center gap-2 ">
                    <ShoppingCart className="h-4 w-4 t" />
                    Add to Cart
                  </span>
                </button>
                <Link
                  href="/products"
                  className="flex-1 border border-textcolor px-8 py-4 text-sm uppercase tracking-wider text-center transition-all duration-300 hover:bg-textcolor hover:text-background"
                >
                  Continue Shopping
                </Link>
              </div>

              <p className="text-sm uppercase tracking-wider text-textcolor/70">
                Free shipping on orders over $250 • 30-day returns
              </p>
            </div>
          </div>
        </div>

        {/* Related products section */}
        <div className="mt-32 m-20">
          <h2 className="text-3xl sm:text-4xl font-medium text-textcolor mb-2">
            You May Also Like
          </h2>
          <p className="text-sm uppercase tracking-wider text-textcolor/70 mb-8">
            Products from the same category
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
