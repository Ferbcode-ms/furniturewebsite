"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  LayoutDashboard,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HierarchicalCategory } from "@/types";
// categories are now fetched from API

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { state, dispatch, totalPrice } = useCart();
  const [openMobile, setOpenMobile] = useState(false);
  const [navCategories, setNavCategories] = useState<string[]>([]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState<
    HierarchicalCategory[]
  >([]);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch("/api/categories");
        const data: {
          categories: string[];
          hierarchical: HierarchicalCategory[];
        } = await res.json();
        setNavCategories(data.categories || []);
        setHierarchicalCategories(data.hierarchical || []);
      } catch {}
    }
    loadCats();
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const r = await fetch("/api/admin/me", { cache: "no-store" });
        const d = await r.json();
        setIsAdmin(Boolean(d?.authenticated));
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mounted) return;

    if (openMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile, mounted]);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F4EA]/95   p-4">
      <div className="relative mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-black [font-family:var(--font-display)] tracking-wide sm:text-3xl text-2xl"
        >
          FURNITURE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm absolute left-1/2 -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((l) => {
                const active = pathname === l.href;
                return (
                  <NavigationMenuItem key={l.href}>
                    <NavigationMenuLink
                      asChild
                      className={`px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-gray-100 font-medium ${
                        active ? "border border-black" : ""
                      }`}
                    >
                      <Link href={l.href}>{l.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-gray-100 font-medium ${
                    pathname.startsWith("/products")
                      ? "border border-black"
                      : ""
                  }`}
                >
                  <Link href="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin ? (
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/admin" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/admin/login">Login</Link>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "TOGGLE" })}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Cart</span>
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {state.items.length}
              </span>
            )}
          </Button>
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-[#FAFAFA]">
              <nav className="px-6 py-6 space-y-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpenMobile(false)}
                    className="block text-xl font-semibold"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/products"
                  onClick={() => setOpenMobile(false)}
                  className="block text-xl font-semibold"
                >
                  Products
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setOpenMobile(false)}
                    className="block text-xl font-semibold"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    onClick={() => setOpenMobile(false)}
                    className="block text-xl font-semibold"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Cart dropdown */}
      {state.isOpen && (
        <div className="absolute right-2 sm:right-4 top-16 w-[320px] sm:w-[360px] max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-[#FAFAFA] shadow-2xl z-50">
          <div className="p-4 max-h-[60vh] overflow-auto">
            {state.items.length === 0 && (
              <div className="py-8 text-center">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              </div>
            )}
            {state.items.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() =>
                      dispatch({ type: "DECREMENT", payload: { id: item.id } })
                    }
                  >
                    −
                  </button>
                  <span className="text-sm w-6 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => dispatch({ type: "ADD", payload: item })}
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-xs text-gray-400 hover:text-red-500 p-1 transition-colors"
                  onClick={() =>
                    dispatch({ type: "REMOVE", payload: { id: item.id } })
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {state.items.length > 0 && (
            <>
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Subtotal
                </span>
                <span className="font-bold text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="p-4 flex gap-2">
                <button
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => dispatch({ type: "TOGGLE" })}
                >
                  Close
                </button>
                <button
                  className="flex-1 rounded-lg bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    router.push("/order");
                    dispatch({ type: "TOGGLE" });
                  }}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
