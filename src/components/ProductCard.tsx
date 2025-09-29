"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="group flex flex-col relative overflow-hidden h-full bg-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:shadow-md">
      <div className="relative w-full aspect-square">
        <Link href={`/products/${id}`} className="cursor-pointer">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      </div>
      <Button
        type="button"
        aria-label="Add to cart"
        variant="outline"
        size="icon"
        onClick={() =>
          dispatch({ type: "ADD", payload: { id, name, price, image } })
        }
        className="absolute top-2 right-2"
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
      <CardContent className="p-4 flex justify-between items-center ">
        <Link href={`/products/${id}`} className="cursor-pointer">
          <h3 className="text-base font-bold tracking-tight text-neutral-900">
            {name}
          </h3>
        </Link>

        <p className="text-base text-neutral-900">${price}</p>
      </CardContent>
    </Card>
  );
}
