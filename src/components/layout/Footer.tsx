"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" relative m-2 sm:m-4  mt-20 bg-[url(https://images.unsplash.com/photo-1665522558273-ff232f599454?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171)] bg-cover bg-center  text-white ">
      <div className="absolute inset-0 h-full w-full bg-black/40 "></div>
      <div className=" flex flex-col justify-between z-10 relative ">
        {/* Links grid */}
        <div className="p-6 font-bold flex justify-between gap-10">
          {/* Shop */}
          <div>
            <h3 className="">Shop</h3>
            <ul className="">
              <li>
                <Link href="/products" className="t">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="">
            <p>INSTAGRAM</p>
            <p>FACEBOOK</p>
            <p>TWITTER</p>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-9xl m-10 sm:p-20 sm:m-20 my-50 tracking-tigh ">
            FURNISHINGS
          </h2>
        </div>
        {/* Bottom bar */}
        <div className="flex justify-between p-2 sm:p-6 bg-black/30 text-sm ">
          <p>© {new Date().getFullYear()} Furniture. All rights reserved.</p>
          <p>MADE BY : FERBCODE.MS</p>
        </div>
      </div>
    </footer>
  );
}
