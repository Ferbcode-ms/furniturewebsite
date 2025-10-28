"use client";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import AnimatedButton from "@/components/AnimatedButton";

interface ArrivalsSectionProps {
  products: Product[];
}

const ArrivalsSection = ({ products }: ArrivalsSectionProps) => {
  const trackRef = useRef(null);
  const [duplicatedProducts, setDuplicatedProducts] = useState<Product[]>([]);
  const isDragging = useRef(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(Draggable);
    setDuplicatedProducts([...products, ...products, ...products]);
  }, [products]);

  useLayoutEffect(() => {
    if (!trackRef.current || duplicatedProducts.length === 0) return;

    const track = trackRef.current;
    const cardWidth = 350 + 24;
    const totalWidth = cardWidth * products.length;
    let xPos = 0;

    // Auto-scroll animation (same as trending)
    const ctx = gsap.context(() => {
      const animate = () => {
        if (!isDragging.current) {
          xPos -= 1;
          if (xPos <= -totalWidth) xPos = 0;
          gsap.set(track, { x: xPos });
        }
        requestAnimationFrame(animate);
      };
      animate();

      // Simple drag functionality (like TrendingSection)
      Draggable.create(track, {
        type: "x",
        inertia: true,
        onDragStart: () => {
          isDragging.current = true;
        },
        onDrag: function () {
          xPos = this.x;
          if (xPos > 0) {
            xPos = -totalWidth;
            gsap.set(track, { x: xPos });
            this.update();
          }
        },
        onDragEnd: () => {
          setTimeout(() => (isDragging.current = false), 300);
        },
      });
    });
    return () => {
      ctx.revert();
    };
  }, [duplicatedProducts, products.length]);

  return (
    <Container>
      <h2 className="text-[28px] sm:text-[40px] md:text-[55px] mb-3 sm:mb-5 px-3 sm:px-5">
        New Arrivals
      </h2>

      <div className="overflow-hidden scrollbar-hide">
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 cursor-grab active:cursor-grabbing"
        >
          {duplicatedProducts.map((item, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 bg-[var(--productcard)] group hover:scale-[1.02] transition-transform duration-300"
            >
              <Link
                href={`/products/${item._id || item.id}`}
                className="block relative w-[290px] sm:w-[300px] md:w-[350px] group/card"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={350}
                  height={262}
                  draggable={false}
                  className="w-full p-5 my-10 aspect-[4/3] object-contain mix-blend-multiply filter contrast-110 brightness-105 transition-transform duration-300 group-hover/card:scale-105"
                />
                <div className="p-3 sm:p-4 md:p-5 text-textcolor">
                  <p className="text-base sm:text-lg md:text-xl font-medium truncate">
                    {item.name}
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1 sm:mt-2">
                    ₹{item.price}
                  </p>
                  <div className="absolute inset-0  transition-opacity duration-300 rounded-lg pointer-events-none" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Link href="/products">
          <AnimatedButton
            className="mt-12 border-2 p-1 px-2 sm:px-3 border-var(--textcolor) text-textcolor uppercase text-[12px] sm:text-sm mb-10   "
            label="explore collection"
          />
        </Link>
      </div>
    </Container>
  );
};

export default ArrivalsSection;
