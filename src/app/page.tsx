"use client";
import Link from "next/link";
import Container from "@/components/ui/Container";
// Removed static categories import - now using dynamic API data
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowRight } from "lucide-react";
import ScrollVelocity from "@/components/ScrollVelocity";
import CircularText from "@/components/CircularText";
import CurvedLoop from "@/components/CurvedLoop";
import SimpleLoader from "@/components/SimpleLoader";
import { Product } from "@/types";
import SplitText from "@/components/SplitText";

export default function Home() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [arrivals, setArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const [tr, ar, cs] = await Promise.all([
          fetch("/api/products?tag=trending")
            .then((r) => r.json())
            .catch(() => ({ products: [] })) as Promise<{
            products: Product[];
          }>,
          fetch("/api/products?tag=arrival")
            .then((r) => r.json())
            .catch(() => ({ products: [] })) as Promise<{
            products: Product[];
          }>,
          fetch("/api/categories")
            .then((r) => r.json())
            .catch(() => ({ categories: [] })) as Promise<{
            categories: string[];
          }>,
        ]);
        setTrending(tr.products || []);
        setArrivals(ar.products || []);
        setCategories(cs.categories?.length ? cs.categories : []);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) {
    return <SimpleLoader />;
  }

  return (
    <div className="space-y-24 overflow-x-hidden">
      {/* Hero */}
      <Container className="pt-8">
        <div className="flex md:flex-row flex-col gap-10 items-end relative overflow-hidden min-h-[70vh] md:min-h-auto">
          {/* Mobile Background Image */}
          <div
            className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1600&q=80)",
            }}
          />
          {/* Mobile Overlay for better text readability */}
          <div className="md:hidden absolute inset-0 bg-black/20 rounded-xl" />

          {/* Content with mobile overlay */}
          <div className="flex-1 w-full relative px-10 sm:px-0 z-10 md:z-auto">
            <div className="mt-16 sm:mt-0 font-extrabold tracking-widest sm:tracking-wide leading-[1.5] [font-family:var(--font-display)] text-[40px] sm:text-[80px] md:text-[120px] lg:text-[160px] text-white md:text-black break-words">
              <SplitText
                text="FINE"
                tag="h1"
                className="block"
                delay={80}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 140 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.15}
                rootMargin="-100px"
                textAlign="left"
              />
              <br />
              <span className="  rounded-xl sm:pr-10 py-1 inline-block">
                <SplitText
                  text="FURNISHINGS"
                  tag="h1"
                  className="block"
                  delay={80}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 150 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.15}
                  rootMargin="-100px"
                  textAlign="left"
                />
              </span>
            </div>
            <div className="flex flex-col gap-4 items-start w-full">
              <p className="mt-6 max-w-[80%] sm:text-lg text-white/90 md:text-neutral-400">
                Choosing the right furniture for your home online will add
                elegance and functionality while also being cost effective and
                long lasting.
              </p>
            </div>
          </div>

          {/* SHOP NOW Button - Moved to right side */}
          <div className="flex justify-end w-full md:w-auto relative z-10 md:z-auto">
            <Link
              href="#trending"
              className="inline-flex items-center gap-3 rounded-full bg-black text-white px-8 py-4 text-sm font-bold group transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-gray-800 m-4"
            >
              <span className="[font-family:var(--font-display)] tracking-widest font-light">
                SHOP NOW
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Desktop Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1600&q=80"
            alt="Hero"
            className="hidden md:block rounded-xl z-10 sm:-z-1 sm:h-96 w-[60%] max-w-md object-cover absolute top-0 right-0 transition-transform duration-500 ease-out hover:scale-[1.03]"
          />
        </div>
      </Container>
      <hr className="bg-gray-500" />
      {/* Trending Now */}
      <Container id="trending">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-extrabold tracking-wide leading-[1.2] [font-family:var(--font-display)] text-[40px] sm:text-[56px] md:text-[64px] lg:text-[80px]">
            FOR TRENDING <br />
            <span className="absolute z-10">NOW</span>
          </h1>
          <CircularText
            text="FURNITURE*TRENDING*NOW*"
            onHover="speedUp"
            spinDuration={20}
            className="text-black "
          />
        </div>

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
            <div className="group relative rounded-xl overflow-hidden  bg-[#FAFAFA] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trending[0].image}
                alt={trending[0].name}
                className="h-100 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-[#FAFAFA] px-8 py-4 text-xs font-semibold shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                ${trending[0].price}
              </span>
            </div>
          )}

          {!loading && trending[1] && (
            <div className="group relative rounded-xl overflow-hidden bg-[#FAFAFA] md:translate-y-[-60px] transition-all duration-300 hover:-translate-y-3 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trending[1].image}
                alt={trending[1].name}
                className="h-100 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-[#FAFAFA] px-8 py-4 text-xs font-semibold shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                ${trending[1].price}
              </span>
            </div>
          )}

          {!loading && trending[2] && (
            <div className="group relative rounded-xl overflow-hidden bg-[#FAFAFA] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trending[2].image}
                alt={trending[2].name}
                className="h-100 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-[#FAFAFA] px-8 py-4 text-xs font-semibold shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
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
        <div className="mb-12">
          <ScrollVelocity
            texts={["NEW ARRIVALS", "FRESH DESIGNS"]}
            velocity={50}
            numCopies={5}
            className="text-black font-extrabold"
          />
        </div>
        {/* Scroll Velocity Text */}

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
            arrivals.map((p: Product, i: number) => {
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
      {/* Curved Loop Text */}
      <Container>
        <div className="mb-12">
          <CurvedLoop
            marqueeText="BEST FURNITURE BY CATEGORIES ✦"
            speed={2}
            curveAmount={300}
            direction="left"
            interactive={true}
            className="text-black"
          />
        </div>
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
