"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, LayoutDashboard, ChevronRight } from "lucide-react";
// categories are now fetched from API

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { totalQuantity, state, dispatch, totalPrice } = useCart();
  const [openMobile, setOpenMobile] = useState(false);
  const [navCategories, setNavCategories] = useState<string[]>([]);
  const [hierarchicalCategories, setHierarchicalCategories] = useState<any[]>(
    []
  );
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
        const data = await res.json();
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
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-gray-200 shadow-sm p-4">
      <div className="relative mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-black [font-family:var(--font-display)] tracking-wide sm:text-3xl text-2xl"
        >
          FURNITURE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm absolute left-1/2 -translate-x-1/2">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-10 py-2.5 rounded-full transition-all duration-200 text-black hover:bg-gray-100 font-medium ${
                  active ? " text-black border-black border-2 " : " "
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Products dropdown */}
          <div className="relative group">
            {(() => {
              const active = pathname.startsWith("/products");
              return (
                <Link
                  href="/products"
                  className={`px-6 py-2.5 rounded-full transition-all duration-200 text-black hover:bg-gray-100 font-medium ${
                    active ? " text-black border-black border-2" : ""
                  }`}
                >
                  Products
                </Link>
              );
            })()}
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full mt-2 w-64 max-w-[90vw] rounded-xl border border-gray-200 bg-[#FAFAFA] shadow-xl p-4 z-40">
              <div className="space-y-1">
                {hierarchicalCategories.length > 0
                  ? hierarchicalCategories.map((category: any) => (
                      <div
                        key={category.name}
                        className="group/category relative"
                      >
                        <Link
                          href={`/products?category=${encodeURIComponent(
                            category.name
                          )}`}
                          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          {category.name}
                        </Link>

                        {/* Subcategories appear on the right */}
                        {category.subCategories &&
                          category.subCategories.length > 0 && (
                            <div className="invisible opacity-0 group-hover/category:visible group-hover/category:opacity-100 transition-all duration-200 absolute left-full top-0 ml-2 w-48 max-w-[80vw] bg-white rounded-lg border border-gray-200 shadow-lg p-3 z-50">
                              <div className="space-y-1">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                  {category.name}
                                </div>
                                {category.subCategories.map((sub: string) => (
                                  <Link
                                    key={sub}
                                    href={`/products?category=${encodeURIComponent(
                                      sub
                                    )}`}
                                    className="block px-3 py-1 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))
                  : navCategories.map((c) => (
                      <Link
                        key={c}
                        href={`/products?category=${encodeURIComponent(c)}`}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        {c}
                      </Link>
                    ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-300 text-sm px-5 py-2.5 font-medium transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-300 text-sm px-5 py-2.5 font-medium transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
            >
              Login
            </Link>
          )}
          <button
            aria-label="Cart"
            onClick={() => dispatch({ type: "TOGGLE" })}
            className="relative inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm text-black font-medium transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {state.items.length}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                openMobile ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {openMobile ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation (simple dropdown) */}
      <div
        className={`md:hidden absolute inset-x-0 h-[1024px] origin-top transform transition-all duration-200  bg-[#FAFAFA] ${
          openMobile
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="px-10 py-30 h-full flex flex-col ">
          <h2 className="uppercase p-2.5">navigation</h2>
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`block w-full text-start text-3xl px-2 py-3 rounded-md  font-bold border-b-2 uppercase  border-gray-200  ${
                  active ? " text-black" : "text-gray-800"
                }`}
                onClick={() => setOpenMobile(false)}
              >
                <div className="flex items-center  justify-between">
                  <span className="flex-1 ">{l.label} </span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </div>
              </Link>
            );
          })}
          <Link
            href="/products"
            className={`block w-full text-start text-3xl px-2 py-3 rounded-md  font-bold border-b uppercase  border-gray-200 ${
              pathname.startsWith("/products")
                ? "bg-black text-white"
                : "text-gray-800"
            }`}
            onClick={() => setOpenMobile(false)}
          >
            <div className="flex items-center justify-between">
              <span className="flex-1 ">Products</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </div>
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="block w-full text-center text-3xl px-2 py-3 rounded-md  font-bold border-b uppercase  border-gray-200"
              onClick={() => setOpenMobile(false)}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1 ">Dashboard</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </div>
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="block w-full text-start text-3xl px-2 py-3 rounded-md  font-bold border-b uppercase  border-gray-200"
              onClick={() => setOpenMobile(false)}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1 ">Login</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </div>
            </Link>
          )}
        </nav>
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
