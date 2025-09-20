"use client";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Brand */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-7xl md:text-8xl font-extrabold tracking-tigh ">
            FURNISHINGS
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-2xl mx-auto">
            Quiet luxury for everyday living — thoughtfully crafted pieces to
            elevate your space.
          </p>
        </div>

        {/* Links grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
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
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-white/80 hover:text-white"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              Contact
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@furniture.example"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  hello@furniture.example
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
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
