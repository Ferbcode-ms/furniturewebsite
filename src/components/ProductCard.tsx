"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({
  id,
  name,
  price,
  image,
  tag,
  variant = "square",
}: {
  id: string;
  name: string;
  price: number;
  image: string;
  tag?: string;
  variant?: "square" | "tall" | "wide";
}) {
  const { dispatch } = useCart();
  return (
    <div className="group relative p-3  overflow-hidden rounded-xl border border-neutral-200 bg-[#FAFAFA] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${id}`} className="block cursor-pointer">
        <Image
          src={image}
          alt={name}
          width={400}
          height={variant === "tall" ? 360 : variant === "wide" ? 176 : 224}
          className={`${
            variant === "tall"
              ? "h-[360px]"
              : variant === "wide"
              ? "h-44"
              : "h-56"
          } w-full object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.02]`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
      </Link>
      <div className="px-2 pt-3 pb-2">
        <Link href={`/products/${id}`} className="block cursor-pointer">
          <h3 className="text-xl font-extrabold tracking-tight text-neutral-900">
            {name}
          </h3>
        </Link>
        {tag && (
          <p className="mt-1 text-[12px] leading-5 text-neutral-500">{tag}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-lg  px-6 hover:bg-black hover:text-white transition-all duration-200 py-2 font-semibold text-black shadow-sm">
            ${price}
          </span>
          <div className="flex items-center gap-2">
            {/* Heart icon - hidden on mobile, visible on desktop */}
            <button
              type="button"
              aria-label="Add to wishlist"
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-[#FAFAFA] text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white cursor-pointer"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Add to cart"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-[#FAFAFA] text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white cursor-pointer"
              onClick={() =>
                dispatch({ type: "ADD", payload: { id, name, price, image } })
              }
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
