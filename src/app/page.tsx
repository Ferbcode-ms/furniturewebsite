"use client";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { categories as staticCategories } from "@/data/products";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/ui/Skeleton";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
      {children}
    </h2>
  );
}

export default function Home() {
  const [trending, setTrending] = useState<any[]>([]);
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(staticCategories);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const [tr, ar, cs] = await Promise.all([
          fetch("/api/products?tag=trending")
            .then((r) => r.json())
            .catch(() => ({ products: [] })),
          fetch("/api/products?tag=arrival")
            .then((r) => r.json())
            .catch(() => ({ products: [] })),
          fetch("/api/categories")
            .then((r) => r.json())
            .catch(() => ({ categories: staticCategories })),
        ]);
        setTrending(tr.products || []);
        setArrivals(ar.products || []);
        setCategories(cs.categories?.length ? cs.categories : staticCategories);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="space-y-24">
      {/* Hero */}
      <Container className="pt-8">
        <div className="flex md:flex-row  flex-col gap-2 items-end relative">
          <div className="flex-1 w-full">
            <h1 className="font-extrabold tracking-wide leading-[1.5] [font-family:var(--font-display)] text-[72px] sm:text-[120px] md:text-[160px] ">
              FINE
              <br />
              <span className="bg-white rounded-2xl pr-10 py-1">
                FURNISHINGS
              </span>
            </h1>
            <div className="flex flex-col gap-4 items-start w-full">
              <p className="mt-6 max-w-[80%] text-lg   text-neutral-600">
                Choosing the right furniture for your home online will add
                elegance and functionality while also being cost effective and
                long lasting.
              </p>
              <div>
                <Link
                  href="#trending"
                  className="inline-flex items-center rounded-full bg-black text-white px-5 py-3 text-sm center font-bold group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="mr-2 px-2 py-2 [font-family:var(--font-display)] tracking-widest font-light">
                    SHOP NOW
                  </span>
                  <span className="inline-flex items-center justify-center">
                    <svg
                      className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 17L17 7"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 7h10v10"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1600&q=80"
            alt="Hero"
            className="rounded-xl -z-10  sm:h-96 w-[60%] object-cover absolute top-0 right-0 transition-transform duration-500 ease-out hover:scale-[1.03]"
          />
        </div>
      </Container>
      <hr className="bg-gray-500" />
      {/* Trending Now */}
      <Container id="trending">
        <h1 className="font-extrabold tracking-wide leading-[1.2] [font-family:var(--font-display)] text-[40px] sm:text-[72px] md:text-[80px] ">
          FOR TRENDING <br />
          <span className="absolute z-10">NOW</span>
        </h1>

        {/* Featured images row */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 md:gap-8 w-full md:w-[80%] mx-auto">
          {loading && (
            <>
              <Skeleton className="h-72 w-full rounded-xl" />
              <Skeleton className="h-72 w-full rounded-xl" />
              <Skeleton className="h-72 w-full rounded-xl" />
            </>
          )}
          {!loading && trending[0] && (
            <div className="group relative rounded-xl overflow-hidden  bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trending[0].image}
                alt={trending[0].name}
                className="h-100 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-semibold shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                ${trending[0].price}
              </span>
            </div>
          )}

          {!loading && trending[1] && (
            <div className="group relative rounded-xl overflow-hidden bg-white md:translate-y-[-60px] transition-all duration-300 hover:-translate-y-3 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trending[1].image}
                alt={trending[1].name}
                className="h-100 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-semibold shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                ${trending[1].price}
              </span>
            </div>
          )}

          {!loading && trending[2] && (
            <div className="group relative rounded-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trending[2].image}
                alt={trending[2].name}
                className="h-100 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-semibold shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                ${trending[2].price}
              </span>
            </div>
          )}
        </div>

        {/* Title + See All */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
          <div>
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              CUTTING-EDGE FURNITURE TRENDS
            </h3>
            <p className="mt-2 max-w-xl text-sm text-neutral-600">
              Explore our curated selection of stylish and functional furniture
              pieces, designed to elevate your space with comfort and elegance.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center rounded-full border px-5 py-2 text-sm font-bold transition-all duration-200 hover:bg-black hover:text-white hover:border-black hover:scale-105 active:scale-95"
          >
            <span className="mr-2">See All</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </Container>
      {/* New Arrival */}
      <Container>
        <h1 className="font-extrabold tracking-wide leading-[1.1] [font-family:var(--font-display)] text-[40px] sm:text-[64px] md:text-[96px]">
          NEW ARRIVALS
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">
          Curated, timeless pieces with quiet luxury and everyday function.
        </p>
        <div className="mt-8 columns-1 sm:columns-2 md:columns-3 gap-4 sm:gap-6 [column-fill:_balance]">
          {loading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-6 break-inside-avoid">
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ))}
            </>
          )}
          {!loading &&
            arrivals.map((p: any, i: number) => {
              const variants: Array<"square" | "tall" | "wide"> = [
                "square",
                "tall",
                "wide",
              ];
              const variant = variants[i % variants.length];
              return (
                <div key={p._id || p.id} className="mb-6 break-inside-avoid">
                  <ProductCard
                    id={String(p._id || p.id)}
                    name={p.name}
                    price={p.price}
                    image={p.image}
                    tag={p.tag}
                    variant={variant}
                  />
                </div>
              );
            })}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold transition-all duration-200 hover:bg-black hover:text-white hover:border-black hover:scale-[1.02] active:scale-95"
          >
            Explore Collection
          </Link>
        </div>
      </Container>
      {/* Shop by room */}
      <Container>
        <h1 className="font-bold tracking-wide leading-[1.2] [font-family:var(--font-display)] text-[40px] sm:text-[72px] md:text-[80px]">
          BEST SHOP BY ROOM
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">
          Discover pieces curated for every space in your home.
        </p>
        <div className="mt-8 grid md:grid-cols-2 gap-6 items-center">
          <ul className="space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c} className="list-none">
                <Link
                  href={`/products?category=${encodeURIComponent(c)}`}
                  className="group block rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c}</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-xs transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80"
            alt="Room"
            className="rounded-xl h-56 sm:h-96 w-full object-cover shadow-sm transition-transform duration-300 ease-out hover:scale-[1.01]"
          />
        </div>
      </Container>
    </div>
  );
}
