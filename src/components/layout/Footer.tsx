"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Brand */}
        <div className="text-center">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tigh ">
            FURNISHINGS
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-2xl mx-auto">
            Quiet luxury for everyday living — thoughtfully crafted pieces to
            elevate your space.
          </p>
        </div>

        {/* Links grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              About
            </h3>
            <p className="mt-3 text-sm text-white/70">
              We curate minimalist designs with enduring materials and precise
              craftsmanship.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              Shop
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Living%20room"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Living Room
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Bedroom"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Bedroom
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Office"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Office
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Dining%20Room"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Dining
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              Support
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/#shipping"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              Newsletter
            </h3>
            <p className="mt-3 text-sm text-white/70">
              Get product drops and occasional offers.
            </p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-full bg-white text-black placeholder-black/50 px-4 py-2 text-sm outline-none"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-full border border-white/20 px-4 py-2 text-sm transition-colors hover:bg-white hover:text-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/70">
          <p>© {new Date().getFullYear()} Furniture. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white">
              Privacy
            </Link>
            <span className="opacity-30">•</span>
            <Link href="/" className="hover:text-white">
              Terms
            </Link>
            <span className="opacity-30">•</span>
            <Link href="/" className="hover:text-white">
              Cookies
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="h-8 w-8 rounded-full border border-white/30 inline-flex items-center justify-center hover:border-white/60"
            >
              in
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="h-8 w-8 rounded-full border border-white/30 inline-flex items-center justify-center hover:border-white/60"
            >
              t
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="h-8 w-8 rounded-full border border-white/30 inline-flex items-center justify-center hover:border-white/60"
            >
              f
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
