"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({
  id,
  name,
  price,
  image,
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
    <div className="relative flex-shrink-0 bg-[var(--productcard)] group  overflow-hidden">
      <Link href={`/products/${id}`}>
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="w-full h-full object-cover mix-blend-multiply filter contrast-110 brightness-105 transition-transform duration-500 ease-out group-hover:scale-105 p-10"
            loading="lazy"
            draggable={false}
          />
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        type="button"
        aria-label="Add to cart"
        onClick={() =>
          dispatch({ type: "ADD", payload: { id, name, price, image } })
        }
        className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur p-2 text-sm transition-all duration-300 hover:scale-110"
      >
        <ShoppingCart className="h-4 w-4" />
      </button>

      {/* Product Details */}
      <div className="p-5 text-textcolor">
        <Link href={`/products/${id}`}>
          <h3 className="text-xl font-medium">{name}</h3>
          <p className="text-3xl font-semibold mt-2">${price}</p>
        </Link>
      </div>
    </div>
  );
}
