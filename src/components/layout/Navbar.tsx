"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, LayoutDashboard } from "lucide-react";
import AnimatedButton from "@/components/AnimatedButton";
import Image from "next/image";

const navLinks = [{ href: "/", label: "Home" }];

export default function Navbar() {
  const { state, dispatch, totalPrice } = useCart();
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => setMounted(true), []);

  // Remove the loadCats effect since we're not using categories in the navbar anymore

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

  // Lock body scroll when mobile menu or cart is open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = openMobile || state.isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile, state.isOpen, mounted]);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f4f0ea] p-0 sm:p-2 border-b border-gray-200">
      <div className="relative mx-auto max-w-6xl sm:px-4 px-2 sm:py-3 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="tracking-wide font-bold text-lg">
          FURNITURE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm absolute left-1/2 -translate-x-1/2 font-semibold">
          <ul className="group flex flex-1 list-none items-center justify-center space-x-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-6 py-2.5 transition-all duration-200 `}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/products"
                className={`px-6 py-2.5 transition-all font-semibold `}
              >
                Products
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3 font-semibold text-[14px]">
          {isAdmin ? (
            <Link href="/admin" className="gap-2 flex items-center">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <Link href="/admin/login">Login</Link>
          )}

          {/* Cart Button */}
          <button
            onClick={() => dispatch({ type: "TOGGLE" })}
            className="relative flex items-center justify-center mx-2 cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5 font-semibold" />
            <span className="hidden sm:inline ml-2 font-semibold">CART</span>
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-6 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {state.items.length}
              </span>
            )}
          </button>

          {/* Mobile Burger Button */}
          <button
            onClick={() => setOpenMobile(!openMobile)}
            className="md:hidden relative z-50 flex flex-col justify-between w-6 h-4 focus:outline-none m-1 "
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-full bg-black transition-transform duration-300 ${
                openMobile ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-black transition-opacity duration-300 ${
                openMobile ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-black transition-transform duration-300 ${
                openMobile ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-[#f4f0ea] transition-transform duration-500 ease-in-out ${
          openMobile ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 text-3xl font-semibold">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpenMobile(false)}
              className="hover:text-gray-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/products"
            onClick={() => setOpenMobile(false)}
            className="hover:text-gray-700 transition-colors"
          >
            Products
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setOpenMobile(false)}
              className="hover:text-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setOpenMobile(false)}
              className="hover:text-gray-700 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Cart UI */}
      <div
        className={`fixed inset-0 z-[60] ${
          state.isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!state.isOpen}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-500 ${
            state.isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => dispatch({ type: "TOGGLE" })}
        />

        {/* Cart Panel */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className={`relative w-full max-w-5xl bg-[#FAF7F0] py-20 shadow-sm border border-neutral-200 text-[17px] transition-all duration-500 ${
              state.isOpen
                ? "opacity-100 translate-0 scale-100"
                : "opacity-0 translate-5 scale-85"
            }`}
          >
            {/* Close */}
            <button
              className="cursor-pointer absolute right-4 top-4 inline-flex items-center gap-2 tracking-wide text-black"
              onClick={() => dispatch({ type: "TOGGLE" })}
            >
              <span className="text-3xl leading-none">×</span>
              CLOSE
            </button>

            {state.items.length === 0 ? (
              <div className="px-8 sm:px-16 py-16 sm:py-24 text-center">
                <p className="lowercase text-black font-medium">
                  Your cart is empty at the moment.
                  <br className="hidden sm:block" /> We have awesome furniture
                  <br className="hidden sm:block" /> crafted for you.
                </p>
                <div className="mt-8">
                  <AnimatedButton
                    label="CONTINUE SHOPPING"
                    onClick={() => dispatch({ type: "TOGGLE" })}
                    className="rounded-full p-1 sm:px-2 border border-neutral-700"
                  />
                </div>
              </div>
            ) : (
              <div className="px-4 sm:px-6 py-4 sm:py-6 transition-all duration-500">
                <div className="max-h-[60vh] overflow-auto divide-y">
                  {state.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-gray-200"
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
                          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            dispatch({
                              type: "DECREMENT",
                              payload: { id: item.id },
                            })
                          }
                        >
                          −
                        </button>
                        <span className="text-sm w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            dispatch({ type: "ADD", payload: item })
                          }
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
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium text-gray-700">
                    Subtotal
                  </span>
                  <span className="font-bold text-lg">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <AnimatedButton
                    label="Continue Shopping"
                    onClick={() => dispatch({ type: "TOGGLE" })}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                  />
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
