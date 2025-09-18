"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
// categories are now fetched from API

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { totalQuantity, state, dispatch, totalPrice } = useCart();
  const [openMobile, setOpenMobile] = useState(false);
  const [navCategories, setNavCategories] = useState<string[]>([]);
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

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm p-4">
      <div className="relative mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-black [font-family:var(--font-display)] tracking-wide text-3xl  font-bold"
        >
          FURNITURE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm absolute left-1/2 -translate-x-1/2">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-6 py-2.5 rounded-full border transition-all duration-200 text-black font-medium ${
                  active
                    ? "bg-black text-white border-black"
                    : "border-transparent hover:bg-gray-100 hover:border-gray-300"
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
                  className={`px-6 py-2.5 rounded-full border transition-all duration-200 text-black font-medium ${
                    active
                      ? "bg-black text-white border-black"
                      : "border-transparent hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  Products
                </Link>
              );
            })()}
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl p-2 z-40">
              <div className="grid grid-cols-1">
                {navCategories.map((c) => (
                  <Link
                    key={c}
                    href={`/products?category=${encodeURIComponent(c)}`}
                    className="px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
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
              className="hidden sm:inline-block rounded-full border border-gray-300 text-sm px-5 py-2.5 font-medium transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="hidden sm:inline-block rounded-full border border-gray-300 text-sm px-5 py-2.5 font-medium transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
            >
              Login
            </Link>
          )}
          <button
            aria-label="Cart"
            onClick={() => dispatch({ type: "TOGGLE" })}
            className="relative rounded-full border border-gray-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm text-black font-medium transition-all duration-200 hover:bg-black hover:text-white hover:border-black"
          >
            <span className="hidden sm:inline">Cart</span>
            <span className="sm:hidden">🛒</span>
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

      {/* Mobile Navigation (absolute, does not push content) */}
      <div
        className={`md:hidden absolute inset-x-0 top-full origin-top-right transform transition-all duration-500  ${
          openMobile
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-50 pointer-events-none"
        }`}
      >
        <div className="border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-1 ">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block text-center [font-family:var(--font-display)] px-4 py-3 text-2xl rounded-lg  font-medium transition-colors duration-200  ${
                    active
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setOpenMobile(false)}
                >
                  {l.label}
                </Link>
              );
            })}
            {/* Mobile: Products link */}
            {(() => {
              const active = pathname.startsWith("/products");
              return (
                <Link
                  href="/products"
                  className={`block text-center [font-family:var(--font-display)] px-4 py-3 text-2xl rounded-lg  font-medium transition-colors duration-200  ${
                    active
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setOpenMobile(false)}
                >
                  Products
                </Link>
              );
            })()}

            <div className="pt-2">
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="block w-full text-center rounded-lg border border-gray-300 text-gray-800 font-medium px-4 py-3 transition-all duration-200 hover:bg-black hover:text-white text-2xl"
                  onClick={() => setOpenMobile(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="block w-full text-center rounded-lg border border-gray-300 text-gray-800 font-medium px-4 py-3 transition-all duration-200 hover:bg-black hover:text-white text-2xl"
                  onClick={() => setOpenMobile(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart dropdown */}
      {state.isOpen && (
        <div className="absolute right-2 sm:right-4 top-16 w-[320px] sm:w-[360px] max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white shadow-2xl z-50">
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
