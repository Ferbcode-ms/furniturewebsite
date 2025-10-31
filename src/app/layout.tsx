import type { Metadata } from "next";
import { Manrope, Anton } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import Navbar from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import ToastProvider from "@/components/ToastProvider";
import LenisProvider from "@/components/LenisProvider";
// import ClientLayout from "@/components/ClientLayout";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const displayFont = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  preload: false,
});

export const metadata: Metadata = {
  title: "Ravinder fiber art",
  description:
    "Ravinder fiber ar is a platform for artists to showcase their work and connect with other artists and art lovers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${manrope.className} ${displayFont.variable} antialiased bg-[#f4f0ea] text-[#4d3d30] uppercase`}
      >
        <LenisProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <ConditionalFooter />
            <ToastProvider />
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
