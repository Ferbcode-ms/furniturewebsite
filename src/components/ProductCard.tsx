"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

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
    <div className="group relative rounded-xl overflow-hidden bg-white border border-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${id}`} className="block cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className={`${
            variant === "tall"
              ? "h-[360px]"
              : variant === "wide"
              ? "h-44"
              : "h-56"
          } w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
        />
      </Link>
      {tag && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-medium border border-neutral-200">
          {tag}
        </span>
      )}
      <span className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-xs font-semibold border border-neutral-200 shadow-sm">
        ${price}
      </span>
      <div className="p-4 flex items-center justify-between">
        <div>
          <Link
            href={`/products/${id}`}
            className="font-medium hover:underline cursor-pointer"
          >
            {name}
          </Link>
        </div>
        <button
          className="rounded-full border border-neutral-300 px-3 py-1 text-sm transition-colors hover:bg-black hover:text-white cursor-pointer"
          onClick={() =>
            dispatch({ type: "ADD", payload: { id, name, price, image } })
          }
        >
          Add
        </button>
      </div>
    </div>
  );
}
