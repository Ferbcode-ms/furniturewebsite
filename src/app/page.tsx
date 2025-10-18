"use client";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Hero from "@/components/layout/Hero";
import { useEffect, useRef, useState } from "react";
import SimpleLoader from "@/components/SimpleLoader";
import { Product } from "@/types";
import AboutPage from "@/components/layout/About";
import AnimatedButton from "@/components/AnimatedButton";
import TrendingSection from "@/components/TrendingSection";
import ArrivalsSection from "@/components/ArrivalsSection";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type HierarchicalCategory = {
  name: string;
  subCategories: string[];
};

export default function Home() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [categories, setCategories] = useState<HierarchicalCategory[]>([]);
  const [arrivals, setArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const bgSectionRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const categoryTrackRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef<boolean>(false);

  // ✅ Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Fetch Data
  useEffect(() => {
    (async () => {
      try {
        const [tr, ar, cs] = await Promise.all([
          fetch("/api/products?tag=trending").then((r) => r.json()),
          fetch("/api/products?tag=arrival").then((r) => r.json()),
          fetch("/api/categories").then((r) => r.json()),
        ]);
        setTrending(tr.products || []);
        setArrivals(ar.products || []);
        setCategories(cs.hierarchical || []);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ GSAP Scroll Animation (Fixed)
  useEffect(() => {
    if (isMobile.current) return;
    if (!categoryRef.current || !categoryTrackRef.current) return;

    const section = categoryRef.current;
    const track = categoryTrackRef.current;

    // GSAP Context ensures React-safe cleanup
    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - section.offsetWidth;
      if (totalScroll <= 0) return;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, section);

    // Cleanup properly to avoid "removeChild" errors
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [categories]);

  const images = [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  ];

  if (loading) return <SimpleLoader />;

  // ✅ Categories Section
  const CategoriesSection = () => {
    if (isMobile.current) {
      // Mobile layout
      return (
        <div className="overflow-x-auto pb-6 hide-scrollbar">
          <div className="flex flex-col sm:flex-row gap-6 px-6">
            {categories.slice(0, 4).map((category, index) => (
              <div
                key={category.name}
                className="flex-shrink-0 w-[85vw] min-h-[60vh] flex items-center"
              >
                <div className="flex flex-col items-center gap-6">
                  <Image
                    src={images[index % images.length]}
                    alt={category.name}
                    width={480}
                    height={240}
                    className="h-60 w-full object-cover rounded-lg"
                  />
                  <div className="flex flex-col items-center text-center">
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        category.name
                      )}`}
                      className="flex flex-col gap-2"
                    >
                      <span className="text-3xl font-medium">
                        {category.name}
                      </span>
                      {category.subCategories.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {category.subCategories.length} subcategories
                        </p>
                      )}
                    </Link>
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        category.name
                      )}`}
                    >
                      <AnimatedButton
                        className="mt-4 border p-2 px-3 text-textcolor text-sm uppercase hover:bg-[var(--textcolor)] hover:text-background transition-colors"
                        label={`${category.name} Products`}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Desktop with ScrollTrigger
    return (
      <section ref={categoryRef} className="relative overflow-hidden">
        <div
          ref={categoryTrackRef}
          className="categories-track flex gap-10 px-10 will-change-transform"
          style={{ width: `${categories.length * 80}vw` }}
        >
          {categories.slice(0, 4).map((category, index) => (
            <div
              key={category.name}
              className="category-item flex-shrink-0 w-[80vw] h-[100vh] flex items-center justify-center"
            >
              <div className="flex flex-col sm:flex-row items-center gap-10">
                <Image
                  src={images[index % images.length]}
                  alt={category.name}
                  width={280}
                  height={320}
                  className="h-80 w-full sm:w-80 object-cover rounded-lg"
                />
                <div className="flex flex-col items-center sm:items-start">
                  <Link
                    href={`/products?category=${encodeURIComponent(
                      category.name
                    )}`}
                    className="flex flex-col gap-4"
                  >
                    <span className="text-4xl sm:text-6xl md:text-8xl font-medium">
                      {category.name}
                    </span>
                    {category.subCategories.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {category.subCategories.length} subcategories
                      </p>
                    )}
                  </Link>
                  <Link
                    href={`/products?category=${encodeURIComponent(
                      category.name
                    )}`}
                  >
                    <AnimatedButton
                      className="mt-4 border p-2 px-3 text-textcolor text-sm uppercase hover:bg-[var(--textcolor)] hover:text-background transition-colors"
                      label={`${category.name} Products`}
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // ✅ Page Layout
  return (
    <div className="space-y-24 overflow-x-hidden">
      <Hero />
      <AboutPage />
      <TrendingSection products={trending} />

      {/* Categories Section */}
      <Container className="overflow-visible">
        <CategoriesSection />
      </Container>

      {/* Parallax Background */}
      <Container>
        <div
          ref={bgSectionRef}
          className="relative flex items-center justify-center min-h-[60vh] overflow-hidden"
        >
          <Image
            src="https://plus.unsplash.com/premium_photo-1683120656283-64c0815111f2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170"
            alt="Background"
            width={1170}
            height={780}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 h-full w-full bg-black/30"></div>
          <div className="text-sm sm:text-lg font-medium bg-background px-15 sm:px-25 py-10 sm:py-15 sm:m-50 m-25 w-150 capitalize text-center z-10">
            Since <br />
            <p className="text-7xl sm:text-9xl m-5">1958</p> <br />
            <p>
              We create furniture masterpieces that tell stories and store
              memories that don’t fade with trends.
            </p>
            <Link href="/products">
              <AnimatedButton
                className="mt-10 border-2 p-1 px-2 sm:px-3 border-var(--textcolor) text-textcolor uppercase text-[12px] sm:text-sm hover:bg-[var(--textcolor)] hover:text-background transition-colors"
                label="explore collection"
              />
            </Link>
          </div>
        </div>
      </Container>

      <ArrivalsSection products={arrivals} />
    </div>
  );
}
